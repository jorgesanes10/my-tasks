import { TaskType } from "../../types";

const apiUrl = import.meta.env.VITE_API_URL;

export const getTasks = async () => {
  const apiToken = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${apiToken}`,
  };

  const response = await fetch(`${apiUrl}/tasks`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("There was an error with the request. Try again later");
  }

  return response.json();
};

export const addTask = async (task: TaskType) => {
  const apiToken = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${apiToken}`,
  };

  const response = await fetch(`${apiUrl}/tasks`, {
    method: "POST",
    headers,
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("There was an error with the request. Try again later");
  }

  return response.json();
};

export const updateTask = async (task: TaskType) => {
  const apiToken = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${apiToken}`,
  };

  const id = task._id;

  const newTask = {
    title: task.title,
    description: task.description,
    completed: task.completed,
  };

  const response = await fetch(`${apiUrl}/tasks/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(newTask),
  });

  if (!response.ok) {
    throw new Error("There was an error with the request. Try again later");
  }

  return response.json();
};

export const deleteTask = async (taskId: string) => {
  const apiToken = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${apiToken}`,
  };

  const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error("There was an error with the request. Try again later");
  }

  return response.json();
};

// Authentication

export const login = async (credentials: {
  username: string;
  password: string;
}) => {
  const { username, password } = credentials;

  const body = {
    username,
    password,
  };

  const response = await fetch(`${apiUrl}/login`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Unable to sign in. Verify your username and password");
  }

  return response.json();
};
