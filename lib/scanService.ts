export async function scanNetwork({
  baseIP,
  ips,
  ports,
  onProgress,
  onData,
}: {
  baseIP: string;
  ips: string;
  ports: number[];
  onProgress: (p: number) => void;
  onData: (data: any) => void;
}) {
  const res = await fetch("http://localhost:3001/scan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ baseIP, ips, ports }),
  });

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        const parsed = JSON.parse(line);

        onProgress((parsed.progress / parsed.total) * 100);
        onData(parsed.data);
      } catch {}
    }
  }
}
