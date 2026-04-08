import { scan } from "@/lib/scanner";

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

export async function POST(req: Request) {
  const body = await req.json();

  const {
    baseIP = "192.168.1",
    ips = "1-20",
    ports = [22, 80, 443],
    timeout = 1000,
  } = body;

  const ipList = parseIPs(ips);

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < ipList.length; i++) {
        const ip = `${baseIP}.${ipList[i]}`;

        const result = await scan(baseIP, [ipList[i]], ports, timeout, 1);

        const payload = {
          progress: i + 1,
          total: ipList.length,
          data: result[0],
        };

        controller.enqueue(
          new TextEncoder().encode(JSON.stringify(payload) + "\n"),
        );
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
