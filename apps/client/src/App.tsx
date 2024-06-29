import "./App.css";
import { Button, Col, Container, Overlay, Row } from "react-bootstrap";
import { TasksList } from "./components/TasksList";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "./api";
import { Login } from "./components/Login";

import helpIcon from "./assets/help.svg";
import { useRef, useState } from "react";

function App() {
  const [showHelp, setShowHelp] = useState(false);
  const helpTarget = useRef(null);

  const { data, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  return (
    <main>
      <Login />
      <Container>
        <Row>
          <Col
            className="center-col"
            style={{
              paddingTop: "10px",
            }}
          >
            <Button
              onClick={() => setShowHelp(!showHelp)}
              ref={helpTarget}
              className="unstyled"
            >
              <img src={helpIcon} alt="Help" />
            </Button>
            <Overlay
              target={helpTarget.current}
              show={showHelp}
              placement="bottom"
            >
              {({ ...props }) => (
                <div
                  className="help-popover"
                  {...props}
                  style={{
                    ...props.style,
                  }}
                >
                  <p>
                    <ul>
                      <li>
                        To create a new task, click on the "Add new task" button
                      </li>
                      <li>
                        To add a description, press the "Tab" key after typing
                        the task title
                      </li>
                      <li>
                        To edit a task's title or description, click on either
                        of the properties and edit the text
                      </li>
                      <li>
                        To save a task, title or description press the "Enter"
                        or "Tab" keys
                      </li>
                      <li>
                        To delete a task, delete the title and press the "Enter"
                        or "Tab" key
                      </li>
                    </ul>
                  </p>
                </div>
              )}
            </Overlay>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1>My tasks</h1>
          </Col>
        </Row>
        <br />
        <Row className="tasks-list-row">
          <Col md={8}>
            <p className="text-danger">{error?.message}</p>
            <TasksList tasks={data} />
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default App;
