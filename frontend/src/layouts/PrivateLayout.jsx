import Navbar from "../components/Navbar";

export default function PrivateLayout({ children }) {
	return (
		<div className="h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 bg-gray-100">{children}</main>
		</div>
	);
}
