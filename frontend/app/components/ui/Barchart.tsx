interface BarPoint { label: string; value: number }

function BarChart({ data }: { data?: BarPoint[] }) {
  const fallback: BarPoint[] = [
    { label: "Jan", value: 120 },
    { label: "Feb", value: 90 },
    { label: "Mar", value: 150 },
    { label: "Apr", value: 110 },
    { label: "May", value: 180 },
    { label: "Jun", value: 140 },
    { label: "Jul", value: 200 },
    { label: "Aug", value: 160 },
    { label: "Sep", value: 190 },
    { label: "Oct", value: 170 },
    { label: "Nov", value: 130 },
    { label: "Dec", value: 210 },
  ];
  const points = (data && data.length > 0) ? data : fallback;
  const max = Math.max(1, ...points.map(p => p.value));

  return (
    <div className="h-64 flex items-end justify-between space-x-2">
      {points.map((item, index) => (
        <div key={index} className="flex flex-col items-center space-y-2">
          <div
            className="w-8 rounded-t"
            style={{
              height: `${(item.value / max) * 200 + 20}px`,
              background: "linear-gradient(to top, #00A86B, #1FD6A6)",
            }}
            title={`${item.label}: ${item.value.toLocaleString()}`}
          />
          <span className="text-xs text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
export default BarChart;