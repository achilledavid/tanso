import axios from 'axios'

const axiosClient = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
})

export default axiosClient
