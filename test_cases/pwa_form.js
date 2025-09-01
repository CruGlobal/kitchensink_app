export default () => {
   describe("Text", () => {
      it("Exists", () => {
         cy.visit("/mobile/app/admin/c355634c-42ca-4317-a086-3aeb4f750d8b?route=First_Page");
         cy.get("#app").should("exist");
         // Select the Text tab
         cy.get('.page-content')
            .contains("Example Text in a custom widget")
            .should("be.visible");
      });
   });
};
