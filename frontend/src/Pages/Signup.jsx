import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center">Signup</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-primary w-full" type="submit">
            Signup
          </button>
        </form>
        <p className="text-center mt-2">
          Already have an account? <a href="/login" className="text-primary">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;