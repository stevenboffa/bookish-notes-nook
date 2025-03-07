
import React from "react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Data points representing Ebbinghaus's Forgetting Curve
// Adjusted to show a steeper decay from day 1 (50%) to day 2 (30%) while reaching 10% by day 7.
const forgettingCurveData = [
  { day: 0, retention: 100, label: "Day 0: 100%" },
  { day: 1, retention: 50, label: "Day 1: 50%" },
  { day: 2, retention: 30, label: "Day 2: 30%" }, // Increased decay between day 1 and day 2
  { day: 3, retention: 25, label: "Day 3: 25%" },
  { day: 4, retention: 20, label: "Day 4: 20%" },
  { day: 5, retention: 16, label: "Day 5: 16%" },
  { day: 6, retention: 13, label: "Day 6: 13%" },
  { day: 7, retention: 10, label: "Day 7: 10%" },
];

// Define tooltip props interface
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}

// Custom tooltip component for displaying details of each point
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
        <p className="font-medium">{payload[0].payload.label}</p>
        <p className="text-sm text-muted-foreground">{`Retention: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export function ForgettingCurveGraph() {
  return (
    <div className="h-64 sm:h-72 md:h-80 w-full max-w-full overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={forgettingCurveData}
          margin={{ top: 10, right: 5, left: -10, bottom: 30 }}
        >
          {/* Gradient definition for the line */}
          <defs>
            <linearGradient id="colorRetention" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9b87f5" />
              <stop offset="50%" stopColor="#7c6ad6" />
              <stop offset="100%" stopColor="#6B96C3" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
          
          {/* X axis configuration - adjusted for mobile */}
          <XAxis 
            dataKey="day"
            domain={[0, 7]}
            ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
            label={{ value: "Days", position: "insideBottom", offset: -20 }}
            tick={{ fontSize: 10 }}
            tickMargin={5}
          />
          
          {/* Y axis configuration - adjusted for mobile */}
          <YAxis 
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            label={{ 
              value: "Retention (%)", 
              angle: -90, 
              position: "insideLeft", 
              style: { textAnchor: 'middle' }, 
              offset: 0 
            }}
            tick={{ fontSize: 10 }}
            width={30}
            tickFormatter={(value) => value === 0 ? "0" : `${value}`}
          />
          
          {/* Tooltip component */}
          <Tooltip content={<CustomTooltip />} />
          
          {/* Smooth curve for the graph */}
          <Line
            type="basis" // 'basis' creates a smooth spline interpolation
            dataKey="retention"
            stroke="url(#colorRetention)"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4, fill: "#9b87f5" }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
