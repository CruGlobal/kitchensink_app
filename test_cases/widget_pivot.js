export default (folderName) => {
   describe("Chart", () => {
      beforeEach(() => {
         cy.visit("/");
         cy.get(
            '[data-cy="tab-Pivot-0f82aacb-dc13-481a-87d4-bd2b7ef2a6e9-b52e6e96-5033-4c7f-a104-29bd5ddcac4a"]',
         ).click();
      });


      it("Display kanban", () => {
         cy.log("Displays a kanban");
         // check the tag area
         cy.findByText('Test-KCS-0000000004').should("exist");
      });
   });
};
