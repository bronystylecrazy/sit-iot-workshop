import { httpClient } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { AddTaskFormData } from "../AdminFormData";
import useTaskList from "@/hooks/useTaskList";
import { useState } from "react";
import { toast } from "sonner";
import { PlusIcon } from "@radix-ui/react-icons";

export default function AddTaskButton() {
  const { mutate } = useTaskList();
  const [open, setOpen] = useState(false);
  const form = useForm<AddTaskFormData>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    toast.promise(
      httpClient.tasks
        .createTask(data)
        .then(() => {
          setOpen(false);
          form.reset();
        })
        .finally(mutate),
      {
        loading: "Creating task...",
        success: "Task created successfully",
        error: "Failed to create task",
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <PlusIcon className="w-6 h-6 mr-2" width={32} /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form className="flex flex-col" onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new task.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Title
              </Label>
              <Input {...form.register("title")} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Description
              </Label>
              <Textarea
                {...form.register("description")}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
