
interface CircularProgressProps {
  percentage: number;
  color: string;
}

 function CircularProgress({ percentage, color }: CircularProgressProps) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-20 h-20 mx-auto mb-2">
      <svg className="transform -rotate-90 w-20 h-20">
        <circle
          cx={radius + 5}
          cy={radius + 5}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="7"
          fill="transparent"
        />
        <circle
          cx={radius + 5}
          cy={radius + 5}
          r={radius}
          stroke={color}
          strokeWidth="7"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-900">{percentage}%</span>
      </div>
    </div>
  );
}
export default CircularProgress;