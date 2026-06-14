interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  accent?: "default" | "danger" | "success";
}

export default function StatCard({
  label,
  value,
  subtext,
  accent = "default",
}: StatCardProps) {
  const valueColor = {
    default: "text-gray-900",
    danger: "text-red-600",
    success: "text-emerald-600",
  }[accent];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${valueColor}`}>{value}</p>
      {subtext && <p className="mt-1 text-xs text-gray-400">{subtext}</p>}
    </div>
  );
}
