import { httpClient } from "@/api";
import useSWR from "swr";

export default function useUsers() {
  return useSWR("/api/users", () => httpClient.users.getUsers());
}
