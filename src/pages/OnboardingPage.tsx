import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function OnboardingPage() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [goal, setGoal] = useState("frontend");
  const [currentLevel, setCurrentLevel] = useState("beginner");
  const [dailyHours, setDailyHours] = useState(2);
  const [deadline, setDeadline] = useState("");
  const [learningStyle, setLearningStyle] = useState("visual");
  const [target, setTarget] = useState("internship");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/roadmap/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          goal,
          dailyHours: Number(dailyHours),
          deadline: deadline || null,
          currentLevel,
          learningStyle,
          target,
        }),
      });

      if (!res.ok) throw new Error();
      navigate("/dashboard");
    } catch {
      setError("Something went wrong generating your roadmap. Try adjusting your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "60px auto" }}>
      <h1>Begin Your Quest</h1>
      <p>Tell us about yourself so we can build your path.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label>
          Goal
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="fullstack">Full Stack</option>
          </select>
        </label>

        <label>
          Current skill level
          <select value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>

        <label>
          Daily study hours
          <input
            type="number"
            min={0.5}
            step={0.5}
            value={dailyHours}
            onChange={(e) => setDailyHours(Number(e.target.value))}
            required
          />
        </label>

        <label>
          Deadline (optional)
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </label>

        <label>
          Preferred learning style
          <select value={learningStyle} onChange={(e) => setLearningStyle(e.target.value)}>
            <option value="visual">Visual</option>
            <option value="reading">Reading</option>
            <option value="hands-on">Hands-on</option>
          </select>
        </label>

        <label>
          Target
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="internship">Internship</option>
            <option value="job">Job</option>
            <option value="hobby">Hobby</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Generating your roadmap..." : "Begin Your Quest"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default OnboardingPage;