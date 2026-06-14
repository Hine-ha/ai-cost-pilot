interface ProgressBarProps {
  label: string;
  amount?: string;
  percentage: number;
  color?: "indigo" | "red" | "emerald" | "amber";
}

export default function ProgressBar({
  label,
  amount,
  percentage,
  color = "indigo",
}: ProgressBarProps) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  const barColor = {
    indigo: "bg-indigo-600",
    red: "bg-red-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
  }[color];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <div>
          <span className="font-medium text-gray-700">{label}</span>
          {amount && (
            <span className="ml-2 text-gray-500">{amount}</span>
          )}
        </div>
        <span className="font-medium text-gray-900">
          {clampedPercentage.toFixed(1)}%
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
}
