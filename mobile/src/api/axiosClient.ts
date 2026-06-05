import axios from 'axios';

// Use your machine's actual WiFi IP so real devices can connect
const baseURL = 'http://192.168.1.9:5000';

export const axiosClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});