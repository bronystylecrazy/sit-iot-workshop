import { httpClient } from "@/api";
import useSWR from "swr";
import useAuth from "./useAuth";

export default function useFinishedTask() {
  const { user } = useAuth();
  return useSWR("/api/finishedTask" + user?.id, async () =>
    httpClient.users.getStepsByUserId(+user!.id!),
  );
}
