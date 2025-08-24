// src/pages/LoginPage.jsx
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api/authApi";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import AuthContext from "../context/AuthContext";

export default function LoginPage() {
	const { login } = useContext(AuthContext);
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
		if (error) setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setSubmitting(true);
			const res = await authApi.login(form);
			await login(res.token);
			navigate("/dashboard");
		} catch (err) {
			setError(err?.response?.data?.message || "Login failed");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
			{/* Left: Brand / Message */}
			<section className="relative hidden md:flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-900">
				{/* Soft accent blobs */}
				<div className="pointer-events-none absolute inset-0">
					<div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-indigo-400/30 blur-3xl" />
					<div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-fuchsia-400/30 blur-3xl" />
				</div>

				<div className="relative z-10 mx-auto w-full max-w-lg px-10 text-white">
					<div className="mb-8 flex items-center gap-3">
						<div className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 backdrop-blur">
							<ShieldCheck size={24} />
						</div>
						<span className="text-xl font-semibold tracking-wide">Kanban Board</span>
					</div>

					<h2 className="text-4xl font-semibold leading-tight">Welcome back</h2>
					<p className="mt-4 text-white/90">
						Sign in to your workspace and get back to your boards and cards. Stay organized, move faster.
					</p>

					<div className="mt-10 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
						<p className="text-sm text-white/90">
							Tip: Use the global search in the header to jump directly to any card across your boards.
						</p>
					</div>

					<div className="mt-10 text-xs text-white/70">© {new Date().getFullYear()} Kanban Board</div>
				</div>
			</section>

			{/* Right: Login Form */}
			<section className="flex items-center justify-center bg-slate-50">
				<div className="w-full max-w-md px-6 py-10">
					{/* Mobile brand header */}
					<div className="mb-6 flex items-center justify-between md:hidden">
						<Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
							Kanban Board
						</Link>
						<Link to="/signup" className="text-sm text-indigo-600 hover:underline">
							Create account
						</Link>
					</div>

					<div className="mb-6">
						<h1 className="text-3xl font-bold tracking-tight text-slate-900">Login</h1>
						<p className="mt-1 text-sm text-slate-600">Welcome back. Please enter your details.</p>
					</div>

					<form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
						{/* Email */}
						<div className="mb-4">
							<label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
								Email
							</label>
							<input
								id="email"
								type="email"
								name="email"
								placeholder="name@example.com"
								value={form.email}
								onChange={handleChange}
								className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-700"
								autoComplete="email"
								required
							/>
						</div>

						{/* Password with eye toggle */}
						<div className="mb-1">
							<label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									name="password"
									placeholder="Enter your password"
									value={form.password}
									onChange={handleChange}
									className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-10 text-sm outline-none transition focus:border-slate-700"
									autoComplete="current-password"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword((prev) => !prev)}
									className="absolute inset-y-0 right-2 flex items-center text-slate-500 hover:text-slate-700"
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							</div>
						</div>

						{/* Error */}
						{error ? (
							<div className="mb-3 mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
						) : null}

						{/* Submit */}
						<button
							type="submit"
							disabled={submitting}
							className="mt-2 w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
						>
							{submitting ? "Signing in..." : "Sign in"}
						</button>

						<p className="mt-4 text-center text-sm text-slate-600">
							Don’t have an account?{" "}
							<Link to="/signup" className="text-indigo-600 hover:underline">
								Sign up
							</Link>
						</p>
					</form>

					{/* Small policy footnote */}
					<p className="mt-4 text-center text-xs text-slate-500">
						By continuing, you agree to our Terms and acknowledge our Privacy Policy.
					</p>
				</div>
			</section>
		</div>
	);
}
