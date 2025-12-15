interface BarPoint { label: string; value: number }

function BarChart({ data }: { data: BarPoint[] }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-500">No revenue data available</div>;
  }

  const max = Math.max(1, ...data.map(p => p.value));

  return (
    <div className="h-64 flex items-end justify-between space-x-2">
      {data.map((item, index) => (
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
