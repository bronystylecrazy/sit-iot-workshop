import { TooltipProvider } from "@/components/ui/tooltip";
import useTaskList from "@/hooks/useTaskList";
import AddTaskDialog from "./components/AddTaskButton";
import Task from "./components/Task";

export default function Admin() {
  const { data } = useTaskList();
  const tasks = data?.data || [];
  return (
    <div className="w-full flex gap-4 p-4 justify-center">
      <div className="w-full max-w-[1024px] flex-col flex gap-4 p-4">
        <div className="flex items-center justify-between">
          <b className="text-3xl">Overview</b>
          <AddTaskDialog />
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <TooltipProvider delayDuration={10} skipDelayDuration={100}>
            {tasks.map((task, index) => (
              <Task key={task.id} index={index + 1} task={task} />
            ))}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
