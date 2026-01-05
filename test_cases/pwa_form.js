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
      it("insert_item", () => {
         cy.visit("/mobile/app/admin/c355634c-42ca-4317-a086-3aeb4f750d8b?route=item_list");
         cy.get("#app").should("exist");
         cy.wait(100)
         // Select the add button
         cy.get('.page-content')
            .should("not.have.text", "test_add");
         cy.get('.page-content')
            .contains("add")
            // .should("be.visible")
            .first()
            .click({force:true})
         cy.wait(100)
         cy.get('.item-input')
            .should("be.visible")
            .first()
            .click()
         cy.get(".item-label").should("be.visible").contains("add_form").parent().type("test_add");
         cy.get('.button')
            .contains("Save")
            .first()
            .click()
         // check list
         cy.wait(100)
         cy.get('.page-content')
            .contains("item_list.mobile-list")
            .should("be.visible")

         cy.get('.item-title')
            .contains("test_add")
            .should("be.visible")
            .first()
            .click()
         // edit
         cy.get('.page-content')
            .contains("edit_form")
            .should("be.visible")
         cy.get(".item-input-wrap").should("be.visible").first().type("test_edit");
         // cy.get(".item-label").should("be.visible").contains("edit_form").parent().clear().type("test_edit");
         cy.get('.button')
            .contains("Save")
            .first()
            .click()
         cy.get('.page-content')
            .contains("item_list.mobile-list")
            .should("be.visible")
         cy.get('.item-title')
            .contains("test_edit")
            .should("be.visible")
         // delete
         cy.get('.item-title')
            .contains("test_edit")
            .parent()
            .trigger('pointerdown', { which: 1 })
            .trigger('pointermove', 'right')
            .trigger('pointerup', { force: true })

         cy.get('.swipeout-delete')
            .first()
            .click()

         cy.wait(50)
         cy.get('.dialog-buttons')
            .should("be.visible")
            .contains("OK")
            .first()
            .click()

      });
   });
};
