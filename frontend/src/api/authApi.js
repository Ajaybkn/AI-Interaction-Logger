import axios from "axios";

// const API_URL = "http://localhost:5003/api/auth";
const API_URL = "https://kanban-board-mv44.onrender.com/api/auth";

const authApi = {
	register: (data) => axios.post(`${API_URL}/register`, data).then((res) => res.data),
	login: (data) => axios.post(`${API_URL}/login`, data).then((res) => res.data),
	me: (token) => axios.get(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data),
};

export default authApi;
