import { useState } from "react";

type Resultado = {
  ip: string;
  status: string;
  hostname: string;
  tipo: string;
  os: string;
  portas: string;
  mac?: string;
};

export function useScan() {
  const [data, setData] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentIP, setCurrentIP] = useState("");

  async function startScan(baseIP: string, ips: string, ports: string) {
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
      const { done, value } = await reader.read();
      if (done) break;

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
        } catch {
          console.warn("Erro ao parsear linha:", line);
        }
      }
    }

    setLoading(false);
  }

  return {
    data,
    loading,
    progress,
    currentIP,
    startScan,
  };
}
