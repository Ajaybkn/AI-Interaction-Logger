// src/api/listApi.js
import axios from "axios";
import { getToken } from "../utils/storage";

// const API = "http://localhost:5003/api/lists";
const API = "https://kanban-board-mv44.onrender.com/api/lists";

const authHeader = () => ({
	headers: { Authorization: `Bearer ${getToken()}` },
});

const listApi = {
	getByBoard: (boardId) => axios.get(`${API}/${boardId}`, authHeader()).then((res) => res.data),

	create: (payload) => axios.post(API, payload, authHeader()).then((res) => res.data),

	update: (id, payload) => axios.put(`${API}/${id}`, payload, authHeader()).then((res) => res.data),

	remove: (id) => axios.delete(`${API}/${id}`, authHeader()).then((res) => res.data),
};

export default listApi;
