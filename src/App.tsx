import { useEffect, useState } from "react";

interface HealthResponse {
  status: string;
  timestamp: string;
  dbMessage: string;
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/health`)
      .then((res) => res.json())
      .then((data: HealthResponse) => setHealth(data))
      .catch(() => setError("Could not reach backend"));
  }, []);

  return (
    <div>
      <h1>DevQuest Skeleton</h1>
      {error && <p>{error}</p>}
      {health ? (
        <p>Backend says: {health.dbMessage} (checked at {health.timestamp})</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;