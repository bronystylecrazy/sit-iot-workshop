import { httpClient } from "@/api";
import { Task as TaskType } from "@/api/server.ts/Api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useUsers from "@/hooks/useUsers";
import { CheckIcon, RocketIcon } from "@radix-ui/react-icons";
import useSWR from "swr";

export type TaskProps = Readonly<{
  index: number;
  task: TaskType;
}>;

export default function Task(props: TaskProps) {
  const { data: usersData } = useUsers();
  const { data: usersPassedData } = useSWR(
    "/api/usersPassed?task_id=" + props.task.id,
    () => httpClient.tasks.getStepsByTaskId(props.task.id!),
  );
  const users = usersData?.data || [];
  const usersPassed = usersPassedData?.data || [];
  const usersNotPassed = users.filter(
    (user) => !usersPassed.some((passed) => passed.user_id === user.id),
  );
  const getUserById = (id: number) => users.find((user) => user.id === id);

  const passedProgress = Math.round(
    (usersPassed.length / users.length) * 100 || 0,
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">
          {props.index}. {props.task?.title}
        </CardTitle>
        <div className="w-full break-words">{props.task?.description}</div>
        <div className="w-full flex flex-col">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="passed" className="border-none">
              <AccordionTrigger>
                <div className="w-full flex gap-2 items-center">
                  <b className="flex gap-2 items-center flex-1">
                    <CheckIcon className="w-6 h-6" />{" "}
                    {passedProgress === 100 ? ( // If all users passed
                      <b>All Passed</b>
                    ) : (
                      <b>Passed</b>
                    )}
                  </b>
                  <div className="flex flex-col mr-4 h-full w-[40px]">
                    <b className="text-right">{passedProgress}%</b>
                    <Progress value={passedProgress} className="w-full w-30" />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex gap-2">
                  {usersPassed.map((user) => (
                    <Tooltip key={user.id}>
                      <TooltipTrigger>
                        <Badge className="flex flex-row gap-2 rounded-full">
                          <b>
                            {getUserById(user.user_id!)?.firstname ||
                              "NoFirstName"}
                          </b>
                          <b>
                            {getUserById(user.user_id!)?.lastname ||
                              "NoLastName"}
                          </b>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {getUserById(user.user_id!)?.seat || "Unknown Seat"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  {usersPassed.length === 0 && <p>No one has passed yet</p>}
                </div>
              </AccordionContent>
            </AccordionItem>
            {usersNotPassed.length > 0 && (
              <AccordionItem value="stuck" className="border-none">
                <AccordionTrigger>
                  <div className="w-full flex gap-2 items-center">
                    <b className="flex gap-2 items-center flex-1">
                      <RocketIcon className="w-4 h-4 mr-2" /> Stuckers
                    </b>
                    <div className="flex flex-col mr-4 h-full w-[40px]">
                      <b className="text-right">{100 - passedProgress}%</b>
                      <Progress
                        value={100 - passedProgress}
                        className="w-full w-30"
                      />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex gap-2">
                    {usersNotPassed.map((user) => (
                      <Tooltip key={user.id}>
                        <TooltipTrigger>
                          <Badge className="flex flex-row gap-2 rounded-full">
                            <b>{user.firstname || "NoFirstName"}</b>
                            <b>{user.lastname || "NoLastName"}</b>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{user.seat || "Unknown Seat"}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </CardHeader>
    </Card>
  );
}
