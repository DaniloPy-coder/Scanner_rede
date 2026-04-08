import express from "express";
import cors from "cors";
import { scan } from "../../lib/scanner";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/scan", async (req, res) => {
  try {
    const { baseIP, ips, ports } = req.body;

    if (!ips) {
      return res.status(400).json({ error: "IPs obrigatórios" });
    }

    const listaIPs = parseIPs(ips);

    const resultados = await scan(baseIP, listaIPs, ports, 1000, 20);

    res.json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no scan" });
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
