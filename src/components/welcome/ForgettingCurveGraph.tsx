
import React from "react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const forgettingCurveData = [
  { day: 0, retention: 100, label: "Immediate recall" },
  { day: 0.014, retention: 60, label: "20 minutes" },
  { day: 0.042, retention: 50, label: "1 hour" },
  { day: 1, retention: 33 },
  { day: 2, retention: 28 },
  { day: 3, retention: 23 },
  { day: 4, retention: 19 },
  { day: 5, retention: 16 },
  { day: 6, retention: 14 },
  { day: 7, retention: 12 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    // Format the day value
    let dayDisplay;
    if (data.day === 0) {
      dayDisplay = "Immediate";
    } else if (data.day < 1) {
      // Convert to hours or minutes
      const hours = Math.floor(data.day * 24);
      if (hours < 1) {
        const minutes = Math.round(data.day * 24 * 60);
        dayDisplay = `${minutes} minutes`;
      } else {
        dayDisplay = `${hours} hours`;
      }
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
  // Generate custom gradient for the line
  const gradientOffset = () => {
    return 0;
  };
  
  const offset = gradientOffset();
  
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
            tickFormatter={(value) => value === 0 ? "0" : Math.floor(value).toString()}
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
          
          {/* Add annotation markers */}
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
