export function exportCSV(data: any[]) {
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
