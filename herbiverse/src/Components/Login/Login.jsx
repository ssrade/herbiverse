import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Adjust path as needed
import Lottie from "lottie-react";
import loginAnimation from "../../assets/login.json"; // Place JSON file inside `src/assets`

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#FFFAF7] to-[#DCFCE7] fixed overflow-y-auto inset-0  text-center py-12 px-4">
     <div className="bg-gradient-to-b from-[#FFFAF7] via-[#FFFAF7] to-green-100 p-10 border border-gray-200 rounded-2xl shadow-lg flex w-[900px] h-[500px] backdrop-blur-lg">
        {/* Left Side - Lottie Animation */}
        <div className="flex-1 flex justify-center items-center">
          <Lottie animationData={loginAnimation} loop={false} className="w-72 h-72" />
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex flex-col justify-center px-10">
          <h2 className="text-3xl font-bold text-center mb-6 text-green-700">Welcome Back to Herbiverse</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/60 placeholder-gray-500"
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/60 placeholder-gray-500"
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-500 text-white py-3 px-6 text-lg font-semibold rounded-lg border-2 border-green-600 hover:bg-green-600 transition-all duration-300 focus:outline-none ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-700">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-600 hover:text-green-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
