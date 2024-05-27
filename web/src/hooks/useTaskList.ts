import { httpClient } from "@/api";
import useSWR from "swr";

export default function useTaskList() {
  return useSWR("/tasks", () => httpClient.tasks.getTasks());
}
