import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function ProgressChart({ data }) {
  // formatear datos
  console.log(data);
  const formatted = data.map(d => ({
    date: new Date(d.date).toLocaleDateString(),
    weight: d.weight,
    
  }));
  

  return (
    <div style={{ width: "80%", height: 150 }}>
      <ResponsiveContainer>
        <LineChart data={formatted}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="weight" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}