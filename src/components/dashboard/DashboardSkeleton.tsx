export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-lg bg-gray-200" />
        <div className="h-4 w-72 rounded bg-gray-100" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-24 rounded bg-gray-100" />
            <div className="mt-3 h-8 w-32 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 h-5 w-56 rounded bg-gray-200" />
        <div className="h-72 rounded-xl bg-gray-100" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 h-5 w-48 rounded bg-gray-200" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-10 rounded bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
