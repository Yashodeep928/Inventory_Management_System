export const LoadingSpinner = ({ size = 12 }: { size?: number }) => {
  const dimension = `${size}rem`; // Tailwind uses rem, so size=12 => h-12 w-12
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div
        className={`animate-spin rounded-full border-b-2 border-emerald-600`}
        style={{ height: dimension, width: dimension }}
      ></div>
    </div>
  );
};
