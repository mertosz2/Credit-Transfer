import axios from "axios";
import dayjs from "dayjs";
import Cookies from "js-cookie";

const baseUrl = `http://localhost:8080/`;

const services = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default services;
