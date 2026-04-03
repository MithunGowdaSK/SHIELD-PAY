import { useNavigate } from "react-router-dom";

export default function FraudResult() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8]">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-[300px]">

        <h1 className="text-lg font-semibold mb-2">
          Fraud Result ⚠️
        </h1>

        <p className="text-sm text-gray-500 mb-4">
          Suspicious activity detected
        </p>

        <button
          onClick={() => navigate("/approval")}
          className="bg-red-500 text-white px-6 py-2 rounded-lg"
        >
          Continue
        </button>

      </div>
    </div>
  );
}