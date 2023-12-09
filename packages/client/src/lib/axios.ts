import axios from "axios"

import { API_BASE_URL } from "@/config/env"

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
})

export default instance
