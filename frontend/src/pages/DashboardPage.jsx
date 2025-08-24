import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
	const { user } = useContext(AuthContext);

	return (
		<div className="h-screen flex flex-col">
			<div className="flex-1 flex items-center justify-center bg-green-100">
				<h1 className="text-3xl font-bold">{user?.name}, Welcome to your Dashboard 🎉</h1>
			</div>
		</div>
	);
}
