import { useEffect, useState } from "react";
import api from "../api";

function Home() {
  const [difficulty, setDifficulty] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    title: string;
    options: [string];
    correct_answer_id: number;
    explanation: string;
  } | null>(null);
  const [spinner, setSpinner] = useState(false);
  const [answer, setAnswer] = useState(-1);
  const [showResults, setShowResults] = useState(0);

  const Generate = async () => {
    setError(null);
    setResult(null);
    setAnswer(-1);
    setShowResults(0);
    if (difficulty === "") {
      setError("Select a difficulty level.");
      return;
    }
    setSpinner(true);
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
      setError("Error: Couldnt generate a question.\nTry again.");
    } finally {
      setSpinner(false);
    }
  };

  const CheckAnswer = () => {
    setError(null);
    if (answer === -1) {
      setError("Select an option.");
      return;
    }
    if (answer === result?.correct_answer_id) {
      setShowResults(1);
    } else {
      setShowResults(2);
    }
  };

  useEffect(() => {
    if (answer !== -1 || difficulty !== "") {
      setError(null);
    }
  }, [difficulty, answer]);

  return (
    <div className="h-screen w-screen overflow-auto bg-black">
      <h1 className=" py-10 text-center text-6xl">
        <span className=" bg-white rounded-full px-5 py-2">
          AI Code Challenge Generator
        </span>
      </h1>
      <div className="border mx-5 pb-10 rounded bg-white">
        <div className="my-10 mx-5 flex justify-center">
          <p className="text-3xl w-[15%] my-auto">Select difficulty:</p>
          <div className=" my-auto mx-5 text-2xl">
            <button
              className={`border cursor-pointer mx-5 p-1 ${
                difficulty === "easy" ? "bg-gray-400 border-4" : "bg-green-100"
              }`}
              onClick={() => setDifficulty("easy")}
            >
              Easy
            </button>
            <button
              className={` cursor-pointer mx-5 p-1 ${
                difficulty === "medium"
                  ? "bg-gray-400 border-4"
                  : "bg-yellow-100 border"
              }`}
              onClick={() => setDifficulty("medium")}
            >
              Medium
            </button>
            <button
              className={` cursor-pointer mx-5 p-1 ${
                difficulty === "hard"
                  ? "bg-gray-400 border-4"
                  : "bg-red-100 border"
              }`}
              onClick={() => setDifficulty("hard")}
            >
              Hard
            </button>
          </div>
        </div>
        {!spinner && (
          <div className="text-center">
            <button
              className="border mt-2 rounded-full px-5 py-1 font-semibold bg-blue-200 hover:bg-blue-500 hover:text-white text-2xl cursor-pointer"
              onClick={Generate}
            >
              Generate
            </button>
          </div>
        )}
      </div>
      {spinner && (
        <div className="flex justify-center items-center my-10">
          <svg
            className="animate-spin h-6 w-6 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="ml-2 text-white">Generating {difficulty} question...</p>
        </div>
      )}
      {result && (
        <div className="my-10 border mx-5 px-5 rounded bg-white">
          <p className="text-center my-5 font-semibold">{result.title}</p>
          <div className="flex flex-col">
            {result.options.map((option, index) => (
              <button
                key={index}
                className={`cursor-pointer border py-2 my-4 text-left pl-2 ${
                  showResults !== 0
                    ? index === result.correct_answer_id
                      ? "bg-lime-400"
                      : index === answer
                      ? "bg-gray-400"
                      : ""
                    : answer === index
                    ? "bg-gray-400"
                    : "hover:bg-gray-200"
                } `}
                onClick={() => setAnswer(index)}
                disabled={showResults !== 0}
              >
                {option}
              </button>
            ))}
          </div>
          {showResults === 0 && (
            <div className="text-center my-5">
              <button
                className="border mt-2 rounded-full px-5 py-1 font-semibold bg-blue-200 hover:bg-blue-500 hover:text-white text-2xl cursor-pointer"
                onClick={CheckAnswer}
              >
                Confirm Answer
              </button>
            </div>
          )}
          {showResults !== 0 && (
            <div className="my-5">
              {showResults === 1 && <p>You answered Correct !</p>}
              {showResults === 2 && <p>You answered Incorrectly !</p>}
              <br />
              <p>{result.explanation}</p>
            </div>
          )}
        </div>
      )}
      {error && (
        <div>
          <p className="text-center my-5 font-bold text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
