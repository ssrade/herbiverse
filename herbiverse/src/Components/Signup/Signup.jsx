import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import signupAnimation from "../../assets/signup.json"; // Ensure this file exists

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name || !email || !password) {
      setError("All fields are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      setLoading(true);
      await signup(name, email, password);
      navigate("/");
    } catch (error) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#FFFAF7] to-[#DCFCE7] fixed overflow-y-auto inset-0 min-h-screen text-center py-12 px-4">
      {/* Container with flexbox - Increased width */}
      <div className="bg-gradient-to-b from-[#FFFAF7] via-[#FFFAF7] to-green-100 p-10 border border-[156b32] rounded-2xl shadow-lg flex w-[900px] h-[500px] backdrop-blur-lg">
        {/* Left Side - Enlarged Lottie Animation */}
        <div className="flex justify-center items-center w-1/2">
          <Lottie animationData={signupAnimation} loop={true} className="w-80 h-80" />
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-1/2 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mb-6">Signup</h2>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <form onSubmit={handleSubmit} className="w-full px-6">
            <input
              className="border p-3 w-full mb-4 rounded-lg"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border p-3 w-full mb-4 rounded-lg"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border p-3 w-full mb-6 rounded-lg"
              type="password"
              placeholder="Password (min. 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className={`text-white px-6 border-2 border-green-700 bg-green-500 hover:bg-green-600 py-3 w-full text-lg font-semibold rounded-xl ${
                loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
              }`}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
