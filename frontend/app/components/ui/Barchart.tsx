
const data = [
  { month: "Jan", height: 120 },
  { month: "Feb", height: 90 },
  { month: "Mar", height: 150 },
  { month: "Apr", height: 110 },
  { month: "May", height: 180 },
  { month: "Jun", height: 140 },
  { month: "Jul", height: 200 },
  { month: "Aug", height: 160 },
  { month: "Sep", height: 190 },
  { month: "Oct", height: 170 },
  { month: "Nov", height: 130 },
  { month: "Dec", height: 210 },
];

 function BarChart() {
  return (
    <div className="h-64 flex items-end justify-between space-x-2">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center space-y-2">
          <div
            className="w-8 rounded-t"
            style={{
              height: `${item.height}px`,
              background: "linear-gradient(to top, #00A86B, #1FD6A6)",
            }}
          />
          <span className="text-xs text-gray-500">{item.month}</span>
        </div>
      ))}
    </div>
  );
}
export default BarChart;