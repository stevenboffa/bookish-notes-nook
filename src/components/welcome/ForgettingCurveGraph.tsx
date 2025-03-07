
import React from "react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Sample data for Ebbinghaus's Forgetting Curve.
// These values approximate a rapid initial decline that levels off over a week.
const forgettingCurveData = [
  { day: 0, retention: 100, label: "Initial learning" },
  { day: 1, retention: 44, label: "Day 1" },
  { day: 2, retention: 40, label: "Day 2" },
  { day: 3, retention: 34, label: "Day 3" },
  { day: 4, retention: 31, label: "Day 4" },
  { day: 5, retention: 29, label: "Day 5" },
  { day: 6, retention: 28, label: "Day 6" },
  { day: 7, retention: 25, label: "Day 7" },
];

// Custom tooltip component for displaying details of each point
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#fff", border: "1px solid #ccc", padding: "8px" }}>
        <p>{label}</p>
        <p>{`Retention: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export function ForgettingCurveGraph() {
  return (
    <div className="h-72 md:h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={forgettingCurveData}
          margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
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
          
          {/* X axis configuration */}
          <XAxis 
            dataKey="day" 
            domain={[0, 7]}
            ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
            label={{ value: "Days", position: "insideBottom", offset: -20 }}
          />
          
          {/* Y axis configuration */}
          <YAxis 
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            label={{ value: "Retention (%)", angle: -90, position: "insideLeft" }}
          />
          
          {/* Tooltip component */}
          <Tooltip content={<CustomTooltip />} />
          
          {/* The actual line for the graph */}
          <Line
            type="monotone"
            dataKey="retention"
            stroke="url(#colorRetention)"
            strokeWidth={4}
            dot={{ r: 4 }}
            activeDot={{ r: 6, fill: "#9b87f5" }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
