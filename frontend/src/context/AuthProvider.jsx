import { useEffect, useState } from "react";
import authApi from "../api/authApi";
import { getToken, setToken, removeToken } from "../utils/storage";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Load user on app start
	useEffect(() => {
		const token = getToken();
		if (token) {
			authApi
				.me(token)
				.then((data) => setUser(data))
				.catch(() => logout())
				.finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, []);

	const login = async (token) => {
		setToken(token);
		const data = await authApi.me(token);
		setUser(data);
	};

	const logout = () => {
		removeToken();
		setUser(null);
	};

	return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
}
