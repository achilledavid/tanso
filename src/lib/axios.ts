import axios from "axios";
import { getSession } from "next-auth/react";

const axiosClient = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
});

axiosClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      try {
        const session = await getSession();

        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        } else {
          try {
            const tokenResponse = await axios.get("/api/auth/token");
            if (
              tokenResponse.data.token &&
              (tokenResponse.data.token.sub || tokenResponse.data.token.jti)
            ) {
              const serverToken =
                tokenResponse.data.token.sub || tokenResponse.data.token.jti;
              config.headers.Authorization = `Bearer ${serverToken}`;
            }
          } catch (tokenError) {
            console.error("Error getting token from server:", tokenError);
          }
        }
      } catch (error) {
        console.error("Error setting auth token:", error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
