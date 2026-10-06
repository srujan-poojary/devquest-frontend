import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sandpack } from "@codesandbox/sandpack-react";
import { useAuth } from "../contexts/AuthContext";

interface Resource {
  id: string;
  title: string;
  url: string;
  type: string;
  platform: string;
}

interface TopicDetail {
  id: string;
  title: string;
  description: string | null;
  baseXp: number;
  exercisePrompt: string | null;
  exerciseFiles: Record<string, string> | null;
  resources: { resource: Resource }[];
}

function QuestPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [completed, setCompleted] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const authHeaders = { Authorization: `Bearer ${session?.access_token}` };

  useEffect(() => {
    if (!topicId || !session) return;
    fetch(`${apiUrl}/topics/${topicId}`, { headers: authHeaders })
      .then((res) => res.json())
      .then(setTopic);
  }, [topicId, session]);

  const handleComplete = async () => {
    if (!topicId) return;
    const res = await fetch(`${apiUrl}/quests/${topicId}/complete`, {
      method: "POST",
      headers: authHeaders,
    });
    if (res.ok) {
      navigate("/dashboard");
    }
  };

  if (!topic) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <button onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
      <h1>{topic.title}</h1>
      <p>{topic.description}</p>
      <p>{topic.baseXp} XP</p>

      <h3>Resources</h3>
      <ul>
        {topic.resources.map(({ resource }) => (
          <li key={resource.id}>
            <a href={resource.url} target="_blank" rel="noreferrer">
              {resource.title}
            </a>{" "}
            — {resource.platform} ({resource.type})
          </li>
        ))}
      </ul>

      <h3>Practice</h3>
      {topic.exercisePrompt && (
        <p><strong>Task:</strong> {topic.exercisePrompt}</p>
      )}
      <Sandpack
        key={topic.id}
        template="vanilla"
        theme="dark"
        files={topic.exerciseFiles ?? undefined}
        options={{
          showLineNumbers: true,
          editorHeight: 400,
          showConsole: true,
          showConsoleButton: true,
          activeFile: "/index.html",
        }}
      />

      <div style={{ marginTop: 20 }}>
        {completed ? (
          <p>✅ Completed!</p>
        ) : (
          <button onClick={handleComplete}>Mark Complete</button>
        )}
      </div>
    </div>
  );
}

export default QuestPage;