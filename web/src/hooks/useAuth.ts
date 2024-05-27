import { httpClient } from "@/api";
import { checkAuth } from "@/pages/home/Login";
import useSWR from "swr";

export default function useAuth() {
  const response = useSWR("/api/auth/me", () =>
    httpClient.auth.me({
      seat_code: String(sessionStorage.getItem("SITWORKSHOPUSER")),
    }),
  );
  return {
    isAuthenticated: checkAuth(),
    user: response.data?.data,
    ...response,
  };
}
