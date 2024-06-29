describe("My Tasks is working", () => {
  it("works as expected", () => {
    cy.visit("/");

    // Logs in to the app
    cy.get('[data-testid="username"]').type("jorgesanes10");
    cy.get('[data-testid="password"]').type("MyPassword123!");

    cy.get('[data-testid="signin-button"]').click();

    // adds a new task
    cy.get('[data-testid="add-task-button"]').click();

    cy.get(":nth-last-child(2) > .text-block > .title").type(
      "This is my automated task"
    );
    cy.get(":nth-last-child(2) > .text-block > .title").type("{enter}");

    cy.get(":nth-last-child(2) > .text-block > .description").type(
      "This is the description for the task"
    );
    cy.get(":nth-last-child(2) > .text-block > .description").type("{enter}");

    // reloads the page to test persistence of data

    cy.wait(1000);
    cy.reload();

    cy.get(":nth-last-child(2) > .text-block > .title").should(
      "have.value",
      "This is my automated task"
    );
    cy.get(":nth-last-child(2) > .text-block > .description").should(
      "have.value",
      "This is the description for the task"
    );

    // Modifies the latest task data

    cy.get(":nth-last-child(2) > .text-block > .title").type(" later");
    cy.get(":nth-last-child(2) > .text-block > .title").type("{enter}");

    cy.get(":nth-last-child(2) > .text-block > .description").type(" later");
    cy.get(":nth-last-child(2) > .text-block > .description").type("{enter}");

    cy.wait(1000);
    cy.reload();

    cy.get(":nth-last-child(2) > .text-block > .title").should(
      "have.value",
      "This is my automated task later"
    );
    cy.get(":nth-last-child(2) > .text-block > .description").should(
      "have.value",
      "This is the description for the task later"
    );

    // checks the task

    cy.get(":nth-last-child(2) > .unstyled").click();

    cy.wait(1000);
    cy.reload();

    cy.get(":nth-last-child(2) > .unstyled").should("have.class", "completed");

    // unchecks the task

    cy.get(":nth-last-child(2) > .unstyled").click();

    cy.wait(1000);
    cy.reload();

    cy.get(":nth-last-child(2) > .unstyled").should(
      "not.have.class",
      "completed"
    );

    // deletes the task
    cy.get(":nth-last-child(2) > .text-block > .title").clear();
    cy.get(":nth-last-child(2) > .text-block > .title").type("{enter}");

    cy.wait(1000);
    cy.reload();

    cy.get(":nth-last-child(2) > .text-block > .title").should(
      "not.have.value",
      "This is my automated task later"
    );
  });
});
