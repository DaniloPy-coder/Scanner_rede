import ping from "ping";
import dns from "dns";
import net from "net";
import os from "os";
import { exec } from "child_process";

const PORT_SERVICES: Record<number, string> = {
  21: "FTP",
  22: "SSH",
  80: "HTTP",
  443: "HTTPS",
  3306: "MySQL",
  3389: "RDP",
  8080: "HTTP-ALT",
};

// ================= RANGES =================

function parseRanges(rangesStr: string): number[] {
  const result: number[] = [];

  rangesStr.split(",").forEach((part) => {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      for (let i = start; i <= end; i++) result.push(i);
    } else {
      result.push(Number(part));
    }
  });

  return result;
}

// ================= UTIL =================

function getBaseIP(): string {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]!) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address.split(".").slice(0, 3).join(".");
      }
    }
  }

  return "192.168.1";
}

function getTTL(ip: string): Promise<number | undefined> {
  return new Promise((resolve) => {
    const cmd =
      process.platform === "win32" ? `ping -n 1 ${ip}` : `ping -c 1 ${ip}`;

    exec(cmd, (err, stdout) => {
      if (err) return resolve(undefined);
      const match = stdout.match(/ttl[=\s](\d+)/i);
      resolve(match ? parseInt(match[1]) : undefined);
    });
  });
}

// ================= DETECÇÃO =================

function detectarOS(portas: number[], ttl?: number): string {
  if (portas.includes(3389)) return "Windows";
  if (portas.includes(22)) return "Linux/Unix";

  if (ttl !== undefined) {
    if (ttl <= 70) return "Linux/Android";
    if (ttl <= 130) return "Windows";
  }

  return "Desconhecido";
}

function detectarTipoDispositivo(portas: number[], ttl?: number): string {
  if (portas.includes(3389)) return "PC Windows";
  if (portas.includes(22)) return "Servidor/Linux";

  if (portas.includes(80) && portas.length <= 2) {
    return "Roteador/IoT";
  }

  if (ttl !== undefined && ttl >= 100) {
    return "PC/Notebook";
  }

  if (ttl !== undefined && ttl <= 70) {
    return "Celular";
  }

  return "Desconhecido";
}

// ================= MAC =================

async function getMAC(ip: string): Promise<string | undefined> {
  return new Promise(async (resolve) => {
    for (let i = 0; i < 3; i++) {
      await ping.promise.probe(ip);
    }

    setTimeout(() => {
      exec(`arp -a`, (err, stdout) => {
        if (err) return resolve(undefined);

        const regex = new RegExp(
          `${ip.replace(/\./g, "\\.")}\\s+([0-9a-f:-]{17})`,
          "i",
        );

        const match = stdout.match(regex);

        if (match) {
          resolve(match[1].toUpperCase().replace(/-/g, ":"));
        } else {
          resolve(undefined);
        }
      });
    }, 800);
  });
}

// ================= NETWORK =================

function scanPort(ip: string, port: number, timeout: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);

    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });

    socket.on("error", () => resolve(false));

    socket.connect(port, ip);
  });
}

function getHostname(ip: string): Promise<string> {
  return new Promise((resolve) => {
    dns.reverse(ip, (err, hostnames) => {
      resolve(!err && hostnames.length ? hostnames[0] : "Desconhecido");
    });
  });
}

// ================= CONCURRENCY =================

async function executarComLimite(
  tarefas: (() => Promise<void>)[],
  limite: number,
) {
  let index = 0;

  async function worker() {
    while (index < tarefas.length) {
      const i = index++;
      await tarefas[i]();
    }
  }

  await Promise.all(Array.from({ length: limite }, () => worker()));
}

// ================= SCAN IP =================

async function scanIP(ip: string, portas: number[], timeout: number) {
  const res = await ping.promise.probe(ip);

  if (!res.alive) {
    console.log(`${ip} OFFLINE`);
    return;
  }

  console.log(`\n🔎 Escaneando ${ip}...\n`);

  const hostname = await getHostname(ip);

  const scans = await Promise.all(portas.map((p) => scanPort(ip, p, timeout)));

  const abertas = portas.filter((_, i) => scans[i]);

  const ttl = await getTTL(ip);
  const mac = await getMAC(ip);

  console.log(`IP: ${ip}`);
  console.log(`Hostname: ${hostname}`);
  console.log(`MAC: ${mac}`);
  console.log(`Tipo: ${detectarTipoDispositivo(abertas, ttl)}`);
  console.log(`OS: ${detectarOS(abertas, ttl)}`);
  console.log(`Portas: ${abertas.join(", ") || "Nenhuma"}`);
}

// ================= SCAN REDE =================

export async function scan(
  baseIP: string,
  ipList: number[],
  portas: number[],
  timeout: number,
  concurrency: number,
) {
  const resultados: any[] = [];

  const tarefas = ipList.map((i) => async () => {
    const ip = `${baseIP}.${i}`;

    const res = await ping.promise.probe(ip);

    let hostname = "-";
    let abertas: number[] = [];

    if (res.alive) {
      hostname = await getHostname(ip);

      const scans = await Promise.all(
        portas.map((p) => scanPort(ip, p, timeout)),
      );

      abertas = portas.filter((_, idx) => scans[idx]);
    }

    const ttl = res.alive ? await getTTL(ip) : undefined;

    resultados.push({
      ip,
      status: res.alive ? "ONLINE" : "OFFLINE",
      hostname,
      tipo: detectarTipoDispositivo(abertas, ttl),
      os: detectarOS(abertas, ttl),
      portas: abertas.join(", "),
      mac: res.alive ? await getMAC(ip) : "-",
    });
  });

  await executarComLimite(tarefas, concurrency);

  resultados.sort((a, b) => {
    const pa = a.ip.split(".").map(Number);
    const pb = b.ip.split(".").map(Number);
    return pa[3] - pb[3];
  });

  return resultados;
}
