import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "react-bootstrap";
import type { TaskType } from "../../../types";
import { addTask } from "../../api/index.ts";
import { Task } from "../Task/Task.tsx";
import { SkeletonLoader } from "../SkeletonLoader/SkeletonLoader.tsx";

interface TasksListProps {
  tasks: TaskType[];
}

export const TasksList = ({ tasks }: TasksListProps) => {
  const queryClient = useQueryClient();
  const sectionRef = useRef<HTMLElement | null>(null);

  const mutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      setTimeout(() => {
        const inputs = (sectionRef.current as HTMLElement)?.querySelectorAll(
          "input"
        );

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
      {tasks?.length > 0 ? (
        tasks?.map((task) => <Task key={task._id} task={task} />)
      ) : (
        <>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </>
      )}

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
