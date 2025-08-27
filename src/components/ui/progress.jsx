import React from "react";

const Progress = React.forwardRef(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800 ${className}`}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-gradient-to-r from-purple-600 to-orange-600 transition-all duration-300 ease-in-out"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };