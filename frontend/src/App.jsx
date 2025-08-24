import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BoardsPage from "./pages/BoardsPage";
import BoardDetailPage from "./pages/BoardDetailPage";
import AuthContext from "./context/AuthContext";
import AuthProvider from "./context/AuthProvider";
import { useContext } from "react";
import DashboardPage from "./pages/DashboardPage";
import PrivateLayout from "./layouts/PrivateLayout";

function PrivateRoute({ children }) {
	const { user, loading } = useContext(AuthContext);

	if (loading) return <p>Loading...</p>;
	return user ? children : <Navigate to="/login" replace />;
}

function RootRedirect() {
	const { user } = useContext(AuthContext);
	return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					{/* Root redirect */}
					<Route path="/" element={<RootRedirect />} />

					{/* Public Routes */}
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignupPage />} />

					{/* Private Routes with Navbar */}
					<Route
						path="/dashboard"
						element={
							<PrivateRoute>
								<PrivateLayout>
									<DashboardPage />
								</PrivateLayout>
							</PrivateRoute>
						}
					/>
					<Route
						path="/boards"
						element={
							<PrivateRoute>
								<PrivateLayout>
									<BoardsPage />
								</PrivateLayout>
							</PrivateRoute>
						}
					/>
					<Route
						path="/boards/:id"
						element={
							<PrivateRoute>
								<PrivateLayout>
									<BoardDetailPage />
								</PrivateLayout>
							</PrivateRoute>
						}
					/>

					{/* catch-all */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}
