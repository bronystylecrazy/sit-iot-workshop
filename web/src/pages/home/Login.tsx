import { httpClient } from "@/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import useAuth from "@/hooks/useAuth";
import useTaskList from "@/hooks/useTaskList";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const loginFormData = z.object({
  seat_code: z
    .string()
    .nonempty()
    .regex(
      /^S\d+R\d+$/i,
      'seat_code must be in the format "S<number>R<number>" (e.g. S1R1 or S8R2)',
    ),
  firstname: z.string().nonempty(),
  lastname: z.string().nonempty(),
});

export type LoginFormData = z.infer<typeof loginFormData>;

export const checkAuth = () =>
  /^S\d+R\d+$/i.test(String(sessionStorage.getItem("SITWORKSHOPUSER")));

export default function Login() {
  const { isAuthenticated, mutate: mutateAuth } = useAuth();
  const { mutate } = useTaskList();
  const [open, setOpen] = useState(() => !checkAuth());
  const form = useForm<LoginFormData>({
    defaultValues: {
      seat_code: "",
      firstname: "",
      lastname: "",
    },
    resolver: zodResolver(loginFormData),
  });

  const onSubmit = form.handleSubmit(async (form) => {
    const { data } = await httpClient.auth.login(form);
    if (!data) return;

    sessionStorage.setItem("SITWORKSHOPUSER", String(data.seat));
    sessionStorage.setItem("SITWORKSHOPAUTH", String(JSON.stringify(data)));
    mutate();
    mutateAuth();
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {!isAuthenticated && (
          <Button onClick={() => setOpen(true)} className="mt-2">
            Login
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register The Tracker</DialogTitle>
          <DialogDescription>
            Please enter your seat code and your name to register the tracker.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Seat Code
            </Label>
            <Input
              {...form.register("seat_code")}
              className="col-span-3"
              placeholder="(e.g. S1R1 or S8R2)"
            />
            {form.formState.errors.seat_code && (
              <Alert className="w-full col-span-4">
                <AlertTitle>
                  <b>Error!</b>
                </AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  {form.formState.errors.seat_code?.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Firstname
            </Label>
            <Input
              {...form.register("firstname")}
              className="col-span-3"
              placeholder="Firstname in English"
            />
            {form.formState.errors.firstname && (
              <Alert className="w-full col-span-4">
                <AlertTitle>
                  <b>Error!</b>
                </AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  {form.formState.errors.firstname?.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Lastname
            </Label>
            <Input
              {...form.register("lastname")}
              className="col-span-3"
              placeholder="Lastname in English"
            />
            {form.formState.errors.lastname && (
              <Alert className="w-full col-span-4">
                <AlertTitle>
                  <b>Error!</b>
                </AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  {form.formState.errors.lastname?.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Ok, ready to go!</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
