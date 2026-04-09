type Props = {
  safeMode: boolean;
  onToggle: () => void;
};

export function SafeModeToggle({ safeMode, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1 rounded-lg text-sm transition ${
        safeMode
          ? "bg-yellow-600 hover:bg-yellow-700"
          : "bg-gray-700 hover:bg-gray-600"
      }`}
    >
      {safeMode ? "🔒 Modo Seguro" : "👁️ Mostrar Dados"}
    </button>
  );
}
