import { useState } from "react";
import { useAppContext } from "./AppContext";
import api from "../api";

function Home() {
  const [difficulty, setDifficulty] = useState("");
  const { error, setError } = useAppContext();
  const [result, setResult] = useState<{
    title: string;
    options: [string];
    correct_answer_id: number;
    explanation: string;
  } | null>(null);

  const Generate = async () => {
    setError(null);
    if (difficulty === "") {
      setError("Select a difficulty level.");
      return;
    }
    const formData = new FormData();
    formData.append("difficulty", difficulty);
    try {
      const response = await api.post("/generate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        setResult(response.data);
      }
    } catch (error: any) {
      setError("Error: Couldnt generate a question");
    }
  };

  return (
    <div>
      <h1>AI code generator challenge</h1>
      <p>Select difficulty:</p>
      <div>
        <button
          className={`border cursor-pointer mr-5 ${
            difficulty === "easy" ? "bg-gray-400" : ""
          }`}
          onClick={() => setDifficulty("easy")}
        >
          Easy
        </button>
        <button
          className={`border cursor-pointer mr-5 ${
            difficulty === "medium" ? "bg-gray-400" : ""
          }`}
          onClick={() => setDifficulty("medium")}
        >
          Medium
        </button>
        <button
          className={`border cursor-pointer ${
            difficulty === "hard" ? "bg-gray-400" : ""
          }`}
          onClick={() => setDifficulty("hard")}
        >
          Hard
        </button>
      </div>
      <div>
        <button className="border mt-2" onClick={Generate}>
          Generate
        </button>
      </div>
      {error && (
        <div>
          <p>{error}</p>
        </div>
      )}
      {result && (
        <div>
          <p>{result.title}</p>
          <p>{result.options}</p>
          <p>{result.correct_answer_id}</p>
          <p>{result.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
