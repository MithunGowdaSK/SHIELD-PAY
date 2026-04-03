import { useNavigate } from "react-router-dom";

export default function AIRisk() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8]">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-[300px]">

        <h1 className="text-lg font-semibold mb-3">
          AI Risk Analysis 🤖
        </h1>

        <p className="text-sm text-gray-500 mb-4">
          Analyzing fraud patterns...
        </p>

        <button
          onClick={() => navigate("/fraud")}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg"
        >
          Continue
        </button>

      </div>
    </div>
  );
}