import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { login } from "../../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [showModal, setShowModal] = useState(!localStorage.getItem("token"));

  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      localStorage.setItem("token", response.AccessToken);

      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleKeydown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setSigningIn(true);

    loginMutation.mutate({
      username,
      password,
    });
  };

  return (
    <Modal show={showModal}>
      <Modal.Header>Sign in to My Tasks</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={handleUsernameChange}
              data-testid="username"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={handleKeydown}
              data-testid="password"
            />
          </Form.Group>
          <div className="sign-in-button-group">
            <Button
              onClick={handleSubmit}
              disabled={signingIn}
              data-testid="signin-button"
            >
              {signingIn ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
