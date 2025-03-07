
import React from "react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Updated data points for a more accurate forgetting curve
// Initial learning is 100%, then drops to 30% at day 1, followed by a decline to 10% by day 7
const forgettingCurveData = [
  { day: 0, retention: 100, label: "Initial learning" },
  { day: 1, retention: 30, label: "Day 1" },
  { day: 2, retention: 25 },
  { day: 3, retention: 20 },
  { day: 4, retention: 17 },
  { day: 5, retention: 14 },
  { day: 6, retention: 12 },
  { day: 7, retention: 10, label: "Day 7" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    // Format the day value
    let dayDisplay;
    if (data.day === 0) {
      dayDisplay = "Initial learning";
    } else {
      dayDisplay = `Day ${data.day}`;
    }
    
    return (
      <div className="p-3 bg-white shadow-md rounded-md border border-gray-200">
        <p className="font-medium text-gray-900">{dayDisplay}</p>
        <p className="text-primary">Retention: {data.retention}%</p>
        {data.label && <p className="text-sm text-gray-500">{data.label}</p>}
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
          <defs>
            <linearGradient id="colorRetention" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9b87f5" />
              <stop offset="50%" stopColor="#7c6ad6" />
              <stop offset="100%" stopColor="#6B96C3" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
          <XAxis 
            dataKey="day" 
            domain={[0, 7]}
            ticks={[0, 1, 2, 3, 4, 5, 6, 7]} // Display all days 0-7
            label={{ 
              value: "ELAPSED TIME (DAYS)", 
              position: "insideBottom", 
              offset: -20,
              fontSize: 12,
              fontWeight: "bold"
            }}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis 
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            label={{ 
              value: "MEMORY RETENTION", 
              angle: -90, 
              position: "insideLeft",
              style: { textAnchor: "middle" },
              fontSize: 12,
              fontWeight: "bold",
              offset: -5
            }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="retention"
            stroke="url(#colorRetention)"
            strokeWidth={4}
            dot={false}
            activeDot={{ r: 6, fill: "#9b87f5" }}
          />
          
          {/* Add annotation markers only for specific points */}
          {forgettingCurveData
            .filter(point => point.label)
            .map((point, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey="retention"
                data={[point]}
                stroke="none"
                dot={{
                  r: 5,
                  fill: "#7c6ad6",
                  stroke: "white",
                  strokeWidth: 2
                }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
