import { useState } from "react";
import { Link } from "react-router-dom";
import authApi from "../api/authApi";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [message, setMessage] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await authApi.register(form);
			setMessage("Signup successful! Please login.");
		} catch (err) {
			setMessage(err.response?.data?.message || "Signup failed");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-4">
			<div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
				{message && <p className="text-sm text-center text-green-600 mb-4">{message}</p>}
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						name="name"
						placeholder="Full Name"
						className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
						onChange={handleChange}
					/>
					<input
						type="email"
						name="email"
						placeholder="Email"
						className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
						onChange={handleChange}
					/>
					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							placeholder="Password"
							className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
							onChange={handleChange}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
						>
							{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>
					<button className="w-full bg-green-600 text-white p-3 rounded-lg font-medium hover:bg-green-700 transition">
						Sign Up
					</button>
				</form>
				<p className="text-sm text-gray-600 text-center mt-4">
					Already have an account?{" "}
					<Link to="/login" className="text-green-600 hover:underline font-medium">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}
