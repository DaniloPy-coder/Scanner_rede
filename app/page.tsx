"use client";

import { useState } from "react";
import { getPortColor } from "../lib/csv";

const PORT_SERVICES: Record<number, string> = {
  21: "FTP",
  22: "SSH",
  80: "HTTP",
  443: "HTTPS",
  3306: "MySQL",
  3389: "RDP",
  8080: "HTTP-ALT",
};

type Resultado = {
  ip: string;
  status: string;
  hostname: string;
  tipo: string;
  os: string;
  portas: string;
  mac?: string;
};

export default function Home() {
  const [data, setData] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filter, setFilter] = useState("ALL");

  const [baseIP, setBaseIP] = useState("192.168.1");
  const [ips, setIps] = useState("1-20");
  const [ports, setPorts] = useState("22,80,443,3389");
  const [currentIP, setCurrentIP] = useState("");

  async function handleScan() {
    if (!ips.trim()) {
      alert("Digite um IP ou range");
      return;
    }

    setLoading(true);
    setData([]);
    setProgress(0);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        baseIP,
        ips,
        ports: ports.split(",").map(Number),
      }),
    });

    if (!res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const result = await reader.read();

      if (result.done) break;

      const value = result.value;

      buffer += decoder.decode(value, { stream: true });

      let lines = buffer.split("\n");

      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const parsed = JSON.parse(line);

          setProgress((parsed.progress / parsed.total) * 100);

          setCurrentIP(parsed.data.ip);

          setData((prev) => {
            const exists = prev.some((item) => item.ip === parsed.data.ip);
            if (exists) return prev;
            return [...prev, parsed.data];
          });
        } catch (err) {
          console.warn("Erro ao parsear linha:", line);
        }
      }
    }

    setLoading(false);
  }

  const filteredData =
    filter === "ALL" ? data : data.filter((r) => r.status === filter);

  function exportCSV() {
    const headers = ["IP", "Status", "Hostname", "Tipo", "OS", "MAC", "Portas"];

    const rows = data.map((r) => [
      r.ip,
      r.status,
      r.hostname,
      r.tipo,
      r.os,
      r.mac || "-",
      r.portas,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "scan-rede.csv";
    a.click();
  }

  function renderPortas(portas: string) {
    if (!portas) return "-";

    return portas.split(",").map((p) => {
      const clean = p.trim();

      const match = clean.match(/\d+/);
      const port = match ? Number(match[0]) : null;

      const color = getPortColor(port);

      return (
        <span key={clean} className={`text-xs px-2 py-1 mr-1 rounded ${color}`}>
          {clean}
        </span>
      );
    });
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            🌐 Scanner de Rede
          </h1>
          <p className="text-gray-400 mt-1">
            Descubra dispositivos, portas abertas e sistema operacional
          </p>
        </div>

        {/* CONFIG */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Base IP */}
            <div>
              <label className="text-sm text-gray-400">Base IP</label>
              <input
                value={baseIP}
                onChange={(e) => setBaseIP(e.target.value)}
                placeholder="192.168.1"
                className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>

            {/* IPs */}
            <div>
              <label className="text-sm text-gray-400">
                IPs (ex: 10, 1-20, 5,10-15)
              </label>
              <input
                value={ips}
                onChange={(e) => setIps(e.target.value)}
                className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Portas */}
            <div>
              <label className="text-sm text-gray-400">Portas</label>
              <input
                value={ports}
                onChange={(e) => setPorts(e.target.value)}
                className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Botão */}
            <div className="flex items-end">
              <button
                onClick={handleScan}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 transition-all rounded-lg p-2 font-semibold flex items-center justify-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {loading ? "Escaneando..." : "Iniciar Scan"}
              </button>
            </div>
          </div>
        </div>

        {/* PROGRESSO */}
        {loading && (
          <div className="mb-4">
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-500 h-3 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {Math.round(progress)}% concluído
            </p>
            <p className="text-xs text-blue-400 mt-1">
              Escaneando: {currentIP}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {data.length} dispositivos encontrados
            </p>
          </div>
        )}

        {/* CONTROLES */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-400">
            {data.length > 0 && `${filteredData.length} resultados`}
          </div>

          <div className="flex gap-2">
            {["ALL", "ONLINE", "OFFLINE"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  filter === f ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {f}
              </button>
            ))}
            <button
              onClick={exportCSV}
              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-sm"
            >
              Exportar CSV
            </button>
          </div>
        </div>

        {/* RESULTADOS */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800/80 text-gray-300">
              <tr>
                <th className="p-3 text-left">IP</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Hostname</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">OS</th>
                <th className="p-3 text-left">Portas</th>
                <th className="p-3 text-left">MAC</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((r, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-800 hover:bg-gray-800/50 transition"
                >
                  <td className="p-3 font-medium">{r.ip}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        r.status === "ONLINE"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="p-3 text-gray-300">{r.hostname}</td>

                  <td className="p-3">
                    <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                      {r.tipo}
                    </span>
                  </td>

                  <td className="p-3">{r.os}</td>

                  <td className="p-3">{renderPortas(r.portas)}</td>

                  <td className="p-3 text-gray-400">{r.mac || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && data.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              🔍 Nenhum scan realizado ainda
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
