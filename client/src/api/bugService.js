import axios from "axios";

const API_URL = "http://localhost:5000/api/bugs";

export const createBug = (data) => axios.post(API_URL, data);
export const getBugs = () => axios.get(API_URL);
