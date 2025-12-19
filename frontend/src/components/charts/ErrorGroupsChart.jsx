import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const truncate = (text, max = 20) => {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "…" : text;
};

export default function ErrorGroupsChart({ groups }) {
  const topGroups = groups.slice(0, 6);
  console.log(topGroups);

  const data = {
    labels: topGroups.map((g) => truncate(g.fingerprint)),
    datasets: [
      {
        label: "Occurrences",
        data: topGroups.map((g) => g.count),
        backgroundColor: "#dc2626",
        maxBarThickness: 50,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    indexAxis: "x",
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => {
            const index = items[0].dataIndex;
            return topGroups[index].title;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
      y: {
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded border h-[40vh] w-full lg:w-[70vw]">
      <h3 className="font-semibold mb-3">Error Groups Distribution</h3>
      <Bar data={data} options={options} />
    </div>
  );
}
