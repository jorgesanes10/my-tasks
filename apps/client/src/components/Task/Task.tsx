import { Button, Form } from "react-bootstrap";
import { TaskType } from "../../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, updateTask } from "../../api";
import { useEffect, useState } from "react";
import classnames from "classnames";

import radioCheckedIcon from "../../assets/radio-checked.svg";
import radioUncheckedIcon from "../../assets/radio-unchecked.svg";

interface TaskProps {
  task: TaskType;
}

export const Task = ({ task }: TaskProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
  }, [task]);

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleClick = () => {
    updateTaskInfo(!task.completed);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      if (title) {
        updateTaskInfo();
      } else {
        deleteTheTask();
      }
    }
  };

  const handleBlur = () => {
    updateTaskInfo();
  };

  const updateTaskInfo = (isCompleted?: boolean) => {
    const updatedTask = {
      _id: task._id,
      title,
      description,
      completed: isCompleted === undefined ? task.completed : isCompleted,
    };

    updateMutation.mutate(updatedTask);
  };

  const deleteTheTask = () => {
    deleteMutation.mutate(task._id!.toString());
  };

  return (
    <article className="task-wrapper">
      <Button
        onClick={handleClick}
        className={classnames("unstyled", {
          completed: task.completed,
        })}
      >
        {task.completed ? (
          <img src={radioCheckedIcon} alt="mark task as incomplete" />
        ) : (
          <img src={radioUncheckedIcon} alt="mark task as complete" />
        )}
      </Button>
      <div className="text-block">
        <Form.Control
          type="text"
          value={title}
          onChange={handleTitleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="title"
        />
        <Form.Control
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="description"
        />
      </div>
    </article>
  );
};
