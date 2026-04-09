export function maskIP(ip: string) {
  if (!ip) return "-";

  const parts = ip.split(".");
  if (parts.length !== 4) return ip;

  return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
}

export function maskMAC(mac?: string) {
  if (!mac) return "-";

  const parts = mac.split(":");
  return parts.map((p, i) => (i < 3 ? p : "XX")).join(":");
}
