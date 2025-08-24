// src/api/cardApi.js
import axios from "axios";
import { getToken } from "../utils/storage";

const API = "http://localhost:5003/api/cards";

const authHeader = () => ({
	headers: { Authorization: `Bearer ${getToken()}` },
});

const cardApi = {
	create: (payload) => axios.post(API, payload, authHeader()).then((r) => r.data),
	// add more endpoints later (update, remove, move, etc.)
};

export default cardApi;
