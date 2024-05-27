import { httpClient } from "@/api.ts";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth.ts";
import useFinishedTask from "@/hooks/useFinishedTask.ts";
import useTaskList from "@/hooks/useTaskList";
import { cn } from "@/lib/utils.ts";
import { Roman } from "react-roman";
import { toast } from "sonner";
import Login, { checkAuth } from "./Login.tsx";
import { Progress } from "@/components/ui/progress.tsx";

export default function Home() {
  const { user } = useAuth();
  const { data, mutate: mutateTasks } = useTaskList();
  const { data: finishedTasksData, mutate: mutateFinishedTasks } =
    useFinishedTask();
  const tasks = data?.data || [];
  const finishedTasks = finishedTasksData?.data || [];

  const isFinished = (taskId: number) => {
    return finishedTasks.some((task) => task.task_id === taskId);
  };

  const markAsDone = (taskId: number) => {
    if (!user) return toast.error("Please login first");
    if (isFinished(taskId)) {
      httpClient.users
        .markAsUndone(user.id!, {
          task_id: taskId,
        })
        .then(() => {
          toast.success("Task marked as undone");
        })
        .finally(() => {
          mutateFinishedTasks();
          mutateTasks();
        });
    } else {
      httpClient.users
        .markStepAsDone(user.id!, {
          task_id: taskId,
        })
        .then(() => {
          toast.success("Task marked as done");
        })
        .finally(() => {
          mutateFinishedTasks();
          mutateTasks();
        });
    }
  };

  const progress = Math.round((finishedTasks.length / tasks.length) * 100 || 0);

  return (
    <div className="w-full flex flex-col gap-4 p-4 justify-center">
      <div className="w-full flex-col flex gap-4">
        <div className="flex items-center justify-between">
          <b className="text-3xl">SIT IOT WOKRSHOP</b>
        </div>
        <div className="flex flex-col gap-4 mt-4"></div>
      </div>
      <div className="w-full flex-col flex gap-4">
        <div className="flex items-center justify-between gap-4">
          <b className="text-2xl">
            {user?.firstname} {user?.lastname}
          </b>
          <div className="flex-1 flex flex-col">
            <b className="text-2xl text-right">{progress}%</b>
            <Progress value={progress} className="w-full" />
          </div>
        </div>
        {checkAuth() && (
          <div className="flex flex-col gap-4 mt-4">
            {tasks.map((task, index) => (
              <Card
                key={task.id}
                className={cn(
                  "w-full relative overflow-hidden",
                  isFinished(task.id!) && "bg-secondary",
                  !isFinished(task.id!) && "opacity-50",
                )}
                onClick={() => markAsDone(task.id!)}
              >
                <CardHeader>
                  <b className="text-xl">{task.title}</b>
                  <CardDescription className="w-full break-words">
                    {task.description}
                  </CardDescription>
                </CardHeader>
                <div className="text-8xl font-black opacity-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Roman>{index + 1}</Roman>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Login />
    </div>
  );
}
