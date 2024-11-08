// @ts-ignore
import { useState, useEffect } from 'react';
import ChartComponent from '../components/Chart';

const Dashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [password, setPassword] = useState<string>('');
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (authenticated) {
      const fetchData = async () => {
        try {
          const res = await fetch('/api/receivedata');
          const json = await res.json();
          setData(json.data || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
      const interval = setInterval(fetchData, 1000);
      return () => clearInterval(interval);
    }
  }, [authenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123') {
      setAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const latestTemperature = data?.length > 0 ? `${data[data.length - 1].temperature}°C` : 'Loading...';
  const latestHumidity = data?.length > 0 ? `${data[data.length - 1].humidity}%` : 'Loading...';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {authenticated ? (
        <>
          <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">Szopa Monitoring</h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center mb-6 space-y-4 md:space-y-0 md:space-x-10">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-semibold">Temperature</p>
              <p className="text-4xl md:text-6xl font-bold">{latestTemperature}</p>
            </div>
            <div className="text-center">
              <p className="text-lg md:text-2xl font-semibold">Humidity</p>
              <p className="text-4xl md:text-6xl font-bold">{latestHumidity}</p>
            </div>
          </div>

          <div className="w-full max-w-3xl">
            <ChartComponent data={data} />
          </div>
        </>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="flex flex-col items-center bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Password Protected</h2>
          <label className="flex flex-col items-start w-full max-w-xs">
            <span className="mb-2 text-gray-300">Enter Password:</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 text-black rounded"
            />
          </label>
          <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600">
            Enter
          </button>
        </form>
      )}
    </div>
  );
};

export default Dashboard;
