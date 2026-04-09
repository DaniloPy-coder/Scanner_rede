import express from "express";
import cors from "cors";
import { scan } from "../../lib/scanner";

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

app.post("/scan", async (req, res) => {
  try {
    const { baseIP, ips, ports } = req.body;

    const listaIPs = parseIPs(ips);
    const total = listaIPs.length;

    res.setHeader("Content-Type", "text/plain"); // IMPORTANTE
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Transfer-Encoding", "chunked");

    let progress = 0;

    for (const i of listaIPs) {
      const resultado = await scan(baseIP, [i], ports, 1000, 1);

      progress++;

      const payload = {
        progress,
        total,
        data: resultado[0],
      };

      res.write(JSON.stringify(payload) + "\n");

      await new Promise((r) => setTimeout(r, 30));
    }

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

function parseIPs(input: string): number[] {
  const result: number[] = [];

  input.split(",").forEach((part) => {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      for (let i = start; i <= end; i++) result.push(i);
    } else {
      result.push(Number(part));
    }
  });

  return result;
}

app.listen(3001, "0.0.0.0", () => {
  console.log("🚀 Backend rodando em http://localhost:3001");
});
