import { Button } from "react-bootstrap";
import type { TaskType } from "../../../types";
import { Task } from "../Task/Task.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTask } from "../../api/index.ts";
import { useRef } from "react";

interface TasksListProps {
  tasks: TaskType[];
}

export const TasksList = ({ tasks }: TasksListProps) => {
  const queryClient = useQueryClient();
  const sectionRef = useRef(null);

  const mutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      setTimeout(() => {
        const inputs = sectionRef.current?.querySelectorAll("input");

        inputs[inputs.length - 2]?.focus();
      }, 500);
    },
  });

  const handleAddButtonClick = () => {
    mutation.mutate({
      title: "",
      description: "",
      completed: false,
    });
  };

  return (
    <section ref={sectionRef}>
      {tasks?.map((task) => (
        <Task key={task._id} task={task} />
      ))}
      <Button
        id="add-task-button"
        onClick={handleAddButtonClick}
        data-testid="add-task-button"
      >
        Add new task
      </Button>
    </section>
  );
};
