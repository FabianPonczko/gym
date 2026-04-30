export default function RecommendationCard({ data }) {
  const diff = (data.recommended - data.lastWeight).toFixed(1);

  const getColor = () => {
    if (data.trend === "up") return "#22c55e";
    if (data.trend === "down") return "#ef4444";
    return "#eab308";
  };

  const getIcon = () => {
    if (data.trend === "up") return "⬆️";
    if (data.trend === "down") return "⬇️";
    return "➖";
  };
  
  const getMessage = () => {
  if (data.trend === "up") return "Subí peso 💪";
  if (data.trend === "down") return "Bajá peso 🧠";
  return "Mantené";
  };
  return (
    <div className="rec-card">
      <h4>{data.exercise}</h4>
      <p>Último: {data.lastWeight}kg x {data.lastReps}</p>

      <h2 style={{ color: getColor() }}>
        {getIcon()} {data.recommended} kg
      </h2>

      <p style={{ color: getColor() }}>
        {diff > 0 ? "+" : ""}{diff} kg
      </p>
      <h2>{getMessage()}</h2>
    </div>
  );
}