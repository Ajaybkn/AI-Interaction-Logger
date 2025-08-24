// src/api/listApi.js
import axios from "axios";
import { getToken } from "../utils/storage";

const API = "http://localhost:5003/api/lists";

const authHeader = () => ({
	headers: { Authorization: `Bearer ${getToken()}` },
});

const listApi = {
	// Get all lists for a board
	getByBoard: (boardId) => axios.get(`${API}/${boardId}`, authHeader()).then((res) => res.data),

	// Create a new list
	create: (payload) => axios.post(API, payload, authHeader()).then((res) => res.data),

	// Update a list
	update: (id, payload) => axios.put(`${API}/${id}`, payload, authHeader()).then((res) => res.data),

	// Delete a list
	remove: (id) => axios.delete(`${API}/${id}`, authHeader()).then((res) => res.data),
};

export default listApi;
