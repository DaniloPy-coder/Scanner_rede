import { getPortColor } from "../../lib/csv";

type Props = {
  portas: string;
};

export function RenderPortas({ portas }: Props) {
  if (!portas) return <>-</>;

  return (
    <>
      {portas.split(",").map((p) => {
        const clean = p.trim();

        const match = clean.match(/\d+/);
        const port = match ? Number(match[0]) : null;

        const color = getPortColor(port);

        return (
          <span
            key={clean}
            className={`text-xs px-2 py-1 mr-1 rounded ${color}`}
          >
            {clean}
          </span>
        );
      })}
    </>
  );
}
