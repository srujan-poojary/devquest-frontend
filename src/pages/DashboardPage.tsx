import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

interface RoadmapEntry {
  id: string;
  order: number;
  targetDate: string;
  topic: { id: string; title: string; baseXp: number };
}

interface Stats {
  totalXp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
}

function DashboardPage() {
  const { session, signOut } = useAuth();
  const [entries, setEntries] = useState<RoadmapEntry[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.access_token}`,
  };

  const fetchStats = async () => {
    const res = await fetch(`${apiUrl}/me/stats`, { headers: authHeaders });
    if (res.ok) setStats(await res.json());
  };

  useEffect(() => {
    if (session) fetchStats();
  }, [session]);

  const generateRoadmap = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/roadmap/generate`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ goal: "frontend", dailyHours: 2 }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEntries(data.roadmap.entries);
    } catch {
      setError("Something went wrong generating your roadmap.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoadmap = async () => {
    const res = await fetch(`${apiUrl}/roadmap/latest`, { headers: authHeaders });
    if (res.ok) {
      const data = await res.json();
      if (data) setEntries(data.entries);
    }
  };

  useEffect(() => {
    if (session) {
      fetchStats();
      fetchRoadmap();
    }
  }, [session]);

  return (
    <div style={{ maxWidth: 600, margin: "60px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>DevQuest Dashboard</h1>
        <button onClick={signOut}>Log out</button>
      </div>
      <p>Logged in as: {session?.user.email}</p>

      {stats && (
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <span>Level {stats.level}</span>
          <span>{stats.totalXp} XP</span>
          <span>🔥 {stats.currentStreak} day streak</span>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {entries && (
        <ul>
          {entries.map((e) => (
            <li key={e.id}>
              Step {e.order + 1} —{" "}
              <Link to={`/quest/${e.topic.id}`}>{e.topic.title}</Link> ({e.topic.baseXp} XP) — due{" "}
              {new Date(e.targetDate).toDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DashboardPage;