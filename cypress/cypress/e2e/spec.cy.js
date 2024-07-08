describe("My Tasks is working", () => {
  it("works as expected", () => {
    cy.visit("/");

    // Logs in to the app
    cy.get('[data-testid="username"]').type("jorgesanes10");
    cy.get('[data-testid="password"]').type("MyPassword123!");

    cy.get('[data-testid="signin-button"]').click();

    // adds a new task
    cy.get('[data-testid="add-task-button"]').click();

    cy.getLastTask(".title").type("My task");
    cy.getLastTask(".title").type("{enter}");

    cy.getLastTask(".description").type("My description");
    cy.getLastTask(".description").type("{enter}");

    // reloads the page to test persistence of data

    cy.wait(1000);
    cy.reload();

    cy.getLastTask(".title").should("have.value", "My task");
    cy.getLastTask(".description").should("have.value", "My description");

    // Modifies the latest task data

    cy.getLastTask(".title").type(" later");
    cy.getLastTask(".title").type("{enter}");

    cy.getLastTask(".description").type(" later");
    cy.getLastTask(".description").type("{enter}");

    cy.wait(1000);
    cy.reload();

    cy.getLastTask(".title").should("have.value", "My task later");
    cy.getLastTask(".description").should("have.value", "My description later");

    // checks the task

    cy.getLastTask(`.check-button`).click();

    cy.wait(1000);
    cy.reload();

    cy.getLastTask(`.check-button`).should("have.class", "completed");

    // unchecks the task

    cy.getLastTask(`.check-button`).click();

    cy.wait(1000);
    cy.reload();

    cy.getLastTask(`.check-button`).should("not.have.class", "completed");

    // deletes the task
    cy.getLastTask(".title").clear();
    cy.getLastTask(".title").type("{enter}");

    cy.wait(1000);
    cy.reload();
    cy.wait(1000);

    cy.getLastTask(".title").should("not.have.value", "My task later");
  });
});
