import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function SignupPage() {
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [message, setMessage] = useState({ type: "", text: "" });
	const [showPassword, setShowPassword] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
		if (message.text) setMessage({ type: "", text: "" });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
			setMessage({ type: "error", text: "Please fill in all required fields." });
			return;
		}
		try {
			setSubmitting(true);
			await authApi.register(form);
			// show success & then redirect to login
			setMessage({ type: "success", text: "Signup successful! Redirecting to login..." });
			setTimeout(() => navigate("/login"), 800);
		} catch (err) {
			const msg = err?.response?.data?.message || "Signup failed";
			setMessage({ type: "error", text: msg });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
			{/* Left */}
			<section className="relative hidden md:flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-900">
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

					<h2 className="text-4xl font-semibold leading-tight">Create your account</h2>
					<p className="mt-4 text-white/90">
						Join your team, create boards, and organize work in a simple and powerful way.
					</p>

					<div className="mt-10 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
						<p className="text-sm text-white/90">
							Pro tip: After joining, use the global search in the header to jump directly to any card.
						</p>
					</div>

					<div className="mt-10 text-xs text-white/70">© {new Date().getFullYear()} Kanban Board</div>
				</div>
			</section>

			{/* Right: Signup Form */}
			<section className="flex items-center justify-center bg-slate-50">
				<div className="w-full max-w-md px-6 py-10">
					{/* Mobile header */}
					<div className="mb-6 flex items-center justify-between md:hidden">
						<Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
							Kanban Board
						</Link>
						<Link to="/login" className="text-sm text-indigo-600 hover:underline">
							Sign in
						</Link>
					</div>

					<div className="mb-6">
						<h1 className="text-3xl font-bold tracking-tight text-slate-900">Create account</h1>
						<p className="mt-1 text-sm text-slate-600">It’s quick and easy. Enter your details to get started.</p>
					</div>

					<form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
						{/* Name */}
						<div className="mb-4">
							<label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
								Full name
							</label>
							<input
								id="name"
								type="text"
								name="name"
								placeholder="Jane Doe"
								value={form.name}
								onChange={handleChange}
								className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-700"
								autoComplete="name"
								required
							/>
						</div>

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

						{/* Password  */}
						<div className="mb-1">
							<label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									name="password"
									placeholder="Create a strong password"
									value={form.password}
									onChange={handleChange}
									className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-10 text-sm outline-none transition focus:border-slate-700"
									autoComplete="new-password"
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

						{/*  message */}
						{message.text ? (
							<div
								className={`mb-3 mt-2 rounded-md px-3 py-2 text-sm ${
									message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
								}`}
							>
								{message.text}
							</div>
						) : null}

						{/* Submit */}
						<button
							type="submit"
							disabled={submitting}
							className="mt-2 w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
						>
							{submitting ? "Creating account..." : "Sign up"}
						</button>

						<p className="mt-4 text-center text-sm text-slate-600">
							Already have an account?{" "}
							<Link to="/login" className="text-indigo-600 hover:underline">
								Sign in
							</Link>
						</p>
					</form>

					{/* Policy footnote */}
					<p className="mt-4 text-center text-xs text-slate-500">
						By signing up, you agree to our Terms and acknowledge our Privacy Policy.
					</p>
				</div>
			</section>
		</div>
	);
}
