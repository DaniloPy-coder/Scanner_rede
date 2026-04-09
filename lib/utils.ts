export function getPortColor(port: number | null) {
  if (port === 80 || port === 443) return "bg-blue-500";
  if (port === 22) return "bg-yellow-500";
  if (port === 3389) return "bg-red-500";
  if (port === 3306) return "bg-purple-500";

  return "bg-gray-600";
}

export function parsePort(portStr: string) {
  const match = portStr.match(/\d+/);
  return match ? Number(match[0]) : null;
}
