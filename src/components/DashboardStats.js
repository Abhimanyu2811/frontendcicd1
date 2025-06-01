import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#E91E63"];

const DashboardStats = ({ enrolledCount, completedCount, score }) => {
  const courseData = [
    { name: "Enrolled", value: enrolledCount },
    { name: "Completed", value: completedCount },
  ];

  const scoreData = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div className="bg-white rounded-2xl shadow-md p-4">
        <h4 className="text-lg font-semibold mb-2 text-center">Course Progress</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={courseData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              dataKey="value"
            >
              {courseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4">
        <h4 className="text-lg font-semibold mb-2 text-center">Score Analysis</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={scoreData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {scoreData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardStats;
