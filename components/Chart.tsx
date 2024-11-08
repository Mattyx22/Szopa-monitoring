import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

interface ChartProps {
  data: { timestamp: string; temperature: number; humidity: number }[];
}

const ChartComponent: React.FC<ChartProps> = ({ data }) => {
  const labels = data.map(d => new Date(d.timestamp).toLocaleTimeString());

  const temperatureData = data.map(d => d.temperature);
  const humidityData = data.map(d => d.humidity);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temperatureData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        yAxisID: 'y',
      },
      {
        label: 'Humidity (%)',
        data: humidityData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        yAxisID: 'y1',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: { type: 'linear', position: 'left' as const },
      y1: { type: 'linear', position: 'right' as const },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default ChartComponent;
