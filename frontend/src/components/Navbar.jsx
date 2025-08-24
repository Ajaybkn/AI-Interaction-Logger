import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function Navbar() {
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
			{/* Left side - brand */}
			<Link to="/dashboard" className="text-xl font-bold text-blue-600">
				MyApp
			</Link>

			{/* Middle - navigation links */}
			<div className="space-x-6">
				<Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
					Dashboard
				</Link>
				<Link to="/boards" className="text-gray-700 hover:text-blue-600">
					Boards
				</Link>
			</div>

			{/* Right side - user & logout */}
			<div className="flex items-center space-x-4">
				<span className="text-gray-600">Hi, {user?.name}</span>
				<button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
					Logout
				</button>
			</div>
		</nav>
	);
}
