export default (folderName) => {
  describe("Chart", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.get(
        '[data-cy="tab-Kanban-b5657df0-bc8a-4fc8-bd00-8c0928932ffc-b52e6e96-5033-4c7f-a104-29bd5ddcac4a"]',
      ).click();
    });

    it("Display kanban", () => {
      cy.log("Displays a kanban");
      // check the tag area
      cy.find("Test-KCS-0000000004").should("exist");
    });
  });
};
