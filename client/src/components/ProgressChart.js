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
  const formatted = data.map(d => ({
    date: new Date(d.date).toLocaleDateString(),
    weight: d.weight
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
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