import axios from "axios";
import { getToken } from "../utils/storage";

// const API = "http://localhost:5003/api/boards";
const API = "https://kanban-board-mv44.onrender.com/api/boards";

const authHeader = () => ({
	headers: { Authorization: `Bearer ${getToken()}` },
});

const boardApi = {
	getAll: () => axios.get(API, authHeader()).then((res) => res.data),
	getOne: (id) => axios.get(`${API}/${id}`, authHeader()).then((res) => res.data),
	create: (payload) => axios.post(API, payload, authHeader()).then((res) => res.data),
	update: (id, payload) => axios.put(`${API}/${id}`, payload, authHeader()).then((res) => res.data),
	remove: (id) => axios.delete(`${API}/${id}`, authHeader()).then((res) => res.data),
};

export default boardApi;
