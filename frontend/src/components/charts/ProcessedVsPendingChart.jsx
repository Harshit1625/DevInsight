import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProcessedVsPendingChart({ processed, pending }) {
  const data = {
    labels: ["Processed", "Pending"],
    datasets: [
      {
        data: [processed, pending],
        backgroundColor: ["#16a34a", "#dc2626"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="bg-white p-7 pb-14 rounded border h-[40vh] w-full lg:w-1/4">
      <h3 className="font-semibold mb-3">Processed vs Pending Logs</h3>
      <Doughnut data={data} options={options} />
    </div>
  );
}
