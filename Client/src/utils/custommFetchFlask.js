
import axios from "axios";

const customFetchFlask = axios.create({
  baseURL: "http://localhost:5000", 
});

export default customFetchFlask;
