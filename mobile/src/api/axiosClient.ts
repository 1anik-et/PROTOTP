import axios from 'axios';

// Use your machine's actual WiFi IP so real devices can connect
const baseURL = 'https://prototp-backend.onrender.com/api';

export const axiosClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});