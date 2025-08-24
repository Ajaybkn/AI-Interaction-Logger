import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api/authApi";
import { Eye, EyeOff } from "lucide-react";

import AuthContext from "../context/AuthContext";

export default function LoginPage() {
	const { login } = useContext(AuthContext);
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await authApi.login(form);
			console.log(res, "eeee");
			await login(res.token);
			navigate("/dashboard");
		} catch (err) {
			setError(err.response?.data?.message || "Login failed");
		}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
				<h2 className="text-2xl font-bold mb-4">Login</h2>
				{error && <p className="text-red-500 mb-2">{error}</p>}

				{/* Email */}
				<input
					type="email"
					name="email"
					placeholder="Email"
					className="w-full border p-2 mb-3 rounded"
					onChange={handleChange}
				/>

				{/* Password with eye toggle */}
				<div className="relative mb-3">
					<input
						type={showPassword ? "text" : "password"}
						name="password"
						placeholder="Password"
						className="w-full border p-2 rounded pr-10"
						onChange={handleChange}
					/>
					<button
						type="button"
						onClick={() => setShowPassword((prev) => !prev)}
						className="absolute inset-y-0 right-2 flex items-center text-gray-500"
					>
						{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
					</button>
				</div>

				{/* Submit */}
				<button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>

				<p className="mt-3 text-sm text-gray-600">
					Don’t have an account?{" "}
					<Link to="/signup" className="text-blue-500 hover:underline">
						Sign up
					</Link>
				</p>
			</form>
		</div>
	);
}
