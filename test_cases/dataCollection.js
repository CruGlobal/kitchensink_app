const testkcsObjectID = "01e0c6d4-ab5e-41ca-8715-77f0424e623f";
const testkcskeybObjectID = "3f4f9295-4ad6-4279-9789-5c6c175852df";
export default () => {
   describe("DataCollection", () => {
      beforeEach(() => {
         cy.get(
            '[data-cy="tab-DataCollections-b5f3ec2c-da69-46b0-b2a9-b76c3d809d69-b52e6e96-5033-4c7f-a104-29bd5ddcac4a"]',
         )
            .should("exist")
            .click();
      });

      it("Unlinked DC Loads Data", () => {
         cy.get(
            '[data-cy="tab No Link af4de560-ebf3-4500-a320-6042d3794a26 b82e7941-b47f-477d-9c10-1d7ef85185ff"]',
         )
            .should("be.visible")
            .click();
         cy.get('.webix_dataview[role="listbox"] > .webix_scroll_cont')
            .as("list")
            .should("be.visible")
            .find(".webix_dataview_item")
            .should("have.length", 18);
         // add a new record, should see it
         cy.request("POST", `/app_builder/model/${testkcsObjectID}`, {
            singlelinetext: "new",
         });
         cy.get("@list").find(".webix_dataview_item").should("have.length", 18);
      });

      it("Linked DC loads data according to parent cursor", () => {
         cy.get(
            '[data-cy="tab Linked baae6c32-ca96-4e21-acd2-7a54f57de3d8 b82e7941-b47f-477d-9c10-1d7ef85185ff"]',
         )
            .should("be.visible")
            .click();
         // no cursor so list should be empty
         cy.get('.webix_dataview[role="listbox"] > .webix_scroll_cont')
            .as("list")
            .should("be.visible")
            .find(".webix_dataview_item")
            .should("have.length", 0);
         // check we don't get newly created values
         cy.request("POST", `/app_builder/model/${testkcskeybObjectID}`, {
            "Key A": "Record C",
         });
         cy.get("@list").find(".webix_dataview_tiem").should("have.length", 0);
         // now set the cursor
         cy.get(
            '[data-cy="ABViewGrid_9a322f9c-738c-4cf6-8d88-c9755e898f88_table"] > .webix_dtable > .webix_ss_body',
         )
            .as("grid")
            .contains("Record A")
            .should("be.visible")
            .first()
            .click();

         cy.get("@list")
            .find(".webix_dataview_item")
            .should("have.length", 1)
            .first()
            .should("contain", "Record A")
            .and("not.contain", "Record B");

         cy.get("@grid")
            .contains("Record B")
            .should("be.visible")
            .first()
            .click();

         cy.get("@list")
            .find(".webix_dataview_item")
            .should("have.length", 1)
            .first()
            .should("contain", "Record B")
            .and("not.contain", "Record A");
      });

      it("Follows another datacollection's cursor", () => {
         cy.get(
            '[data-cy="tab Follow 415d32b3-5201-4a6f-bb06-10b3f4229f24 b82e7941-b47f-477d-9c10-1d7ef85185ff"]',
         )
            .should("be.visible")
            .click();
         cy.get(
            '[data-cy="ABViewGrid_5ab47051-fa69-46df-91bc-b46f7e3dd757_table"] > .webix_dtable > .webix_ss_body',
         )
            .contains("Record A")
            .as("recordA")
            .should("be.visible");
         cy.get("@recordA").click();

         cy.get(
            '[data-cy="detail connected Key A 2e3c1460-c09c-4645-9366-cdec84902fcd 4a9e79c9-83f7-4e62-9286-a48efccf3a3c"] > .webix_template',
         )
            .as("detailField")
            .should("be.visible")
            .and("contain", "Record A");

         cy.get('.webix_dataview[role="listbox"] > .webix_scroll_cont')
            .as("list")
            .should("be.visible")
            .find(".webix_dataview_item")
            .should("have.length", 1)
            .first()
            .should("contain", "Record A");
      });

      it("Should keep selected cursor when cursor of a linked DC changes", () => {
         // Select the Tabview
         cy.get(
            '[data-cy="tab Cursor 3f06ceac-ac30-4e64-b165-e30002fff60c b82e7941-b47f-477d-9c10-1d7ef85185ff"]',
         )
            .should("be.visible")
            .click();

         // Select a linked cursor
         cy.get('[data-cy="ABViewGrid_497b6d7d-c4e2-40a4-8bcb-fcaa24cf875f_datatable"]')
            .should("be.visible")
            .find(".webix_ss_body .webix_ss_right .webix_cell")
            .first()
            .click();

         // verify data is in grid before trying to bring up the scroll bar
         cy.get(
            '[data-cy="ABViewGrid_d08be402-470e-4b9d-b5f4-72e27426522c_datatable"] > .webix_ss_body > .webix_ss_center > .webix_ss_center_scroll > .webix_first > [aria-rowindex="1"]',
         ).should("be.visible");

         // Click to show the scroll bar
         cy.get('[data-cy="ABViewGrid_d08be402-470e-4b9d-b5f4-72e27426522c_datatable"]')
            .find(".webix_ss_body .webix_ss_right")
            .click();

         // Close the popup
         cy.get('[data-cy="Popup Close Button Edit TestKCS 5403c1cf-57f9-463d-b306-799d3641be11"]')
            .click();

         // Drag the scroll bar to bottom
         cy.get('[data-cy="ABViewGrid_d08be402-470e-4b9d-b5f4-72e27426522c_datatable"]')
            .find(".webix_c_scroll_y")
            .should("be.visible")
            .trigger('mousedown')
            .trigger('mousemove', { which: 1, pageY: 2000 })
            .trigger('mouseup');

         // Select the edit item
         cy.get('[data-cy="ABViewGrid_d08be402-470e-4b9d-b5f4-72e27426522c_datatable"]')
            .find(".webix_ss_body .webix_ss_right")
            .find('[aria-rowindex="30"]')
            .click();

         // Enter new data
         const newData = "NEW ONE";
         cy.get('[data-cy="string singlelinetext 78d60c46-5523-474d-8e0c-d8d6db814be8 5acd8c09-a0d2-4d3b-a993-b3c251858ed6"]')
            .as("textField")
            .should("exist")
            .should("not.be.disabled");

         cy.get("@textField").clear({ force: true });
         cy.get("@textField").type(newData, { force: true });

         // Save
         cy.get('[data-cy="button save 5acd8c09-a0d2-4d3b-a993-b3c251858ed6"]')
            .click();

         // Assert
         cy.get('[data-cy="ABViewGrid_d08be402-470e-4b9d-b5f4-72e27426522c_datatable"]')
            .find(".webix_ss_body .webix_ss_center")
            .find('[aria-rowindex="30"]')
            .should("contain", newData)
            .should("have.class", "webix_row_select");
      });

      it("Should Manage Updating Data across multiple DCs and cursors", () => {
         // Select the Tabview
         cy.get(
            '[data-cy="tab Cursor ++ 0139ab53-3d56-42d4-afd6-da7cb5df503b b82e7941-b47f-477d-9c10-1d7ef85185ff"]',
         )
            .should("be.visible")
            .click();

         //
         // Manually Setup Test:
         //

         // Select 1st item in Spells grid
         // clear popup
         cy.get(
            '[data-cy="ABViewGrid_aa3e9092-77c5-4df2-bac9-a9e3d8d3f9c4_datatable"] > .webix_ss_body > .webix_ss_center > .webix_ss_center_scroll > .textCell > [aria-rowindex="1"]',
         )
            .as("frostbolt")
            .should("be.visible");
         cy.get("@frostbolt").click();
         cy.get(
            '[data-cy="Popup Close Button Edit Spell c6f938f0-75cf-4484-8366-415fdd5657c0"]',
         )
            .should("be.visible")
            .click();

         // Verify Characters Linked to Spell has the 2 expected values:
         cy.get(
            '[data-cy="ABViewGrid_5bbafa43-1090-4e9d-8c1d-329a979fe6af_datatable"]',
         )
            .as("listCharactersFollowingSpell")
            .should("contain", "Sproket")
            .should("contain", "Morganto")
            .should("not.contain", "Lester");

         //
         // Now Edit Sproket to NOT have Frostbolt
         //
         // 1) click on Sproket
         cy.get(
            '[data-cy="ABViewGrid_c06a71ad-efe7-4c67-af01-1eb01cc854d8_datatable"] > .webix_ss_body > .webix_ss_center > .webix_ss_center_scroll > .textCell > [aria-rowindex="1"]',
         )
            .as("rowSproket")
            .click();

         // click the [x] on frostbolt
         cy.get(
            '[optvalue="8f07bf6a-5c9d-47ac-8fb1-f43a4bae4f36"] > .webix_multicombo_delete',
         )
            .should("be.visible")
            .click();

         // click [save]
         cy.get('[data-cy="button save 6a38ac65-7048-46ae-a771-29c7260f177e"]')
            .should("be.visible")
            .click();

         //
         // Verify Sproket & Frostbolt & listCharacters are correct
         //
         // Sproket no longer has Frostbolt
         cy.get(
            ".webix_ss_center > .webix_ss_center_scroll > .webix_last > .webix_row_select",
         )
            .as("sproketConnections")
            .should("not.contain", "Frostbolt");

         cy.get(
            '[data-cy="ABViewGrid_aa3e9092-77c5-4df2-bac9-a9e3d8d3f9c4_datatable"] > .webix_ss_body > .webix_ss_center > .webix_ss_center_scroll > .webix_last > [aria-rowindex="1"]',
         )
            .as("frostboltConnections")
            .should("not.contain", "Sproket");

         cy.get("@listCharactersFollowingSpell")
            .should("not.contain", "Sproket")
            .should("contain", "Morganto")
            .should("not.contain", "Lester");

         //
         // Now Add Sproket to Frostbolt
         //
         // click frostbolt to trigger the Edit Spell Popup:
         cy.get("@frostbolt").click();

         // add Sproket to list of users:
         // 1.click the drop list
         cy.get(
            '[data-cy="connectObject testkcsCharacters890 322052d2-ac63-40d6-9f7e-86d40eacd40b 2f658206-fdea-4823-87d9-82fe5b1680a4"] > .webix_el_box > .webix_inp_static',
         )
            .as("dropListCharacters")
            .should("be.visible");
         cy.get("@dropListCharacters").click();

         // 2. click on sproket entry
         cy.get('[webix_l_id="348b9e13-de18-48b4-a1e5-c6426c2f8296"]')
            .should("be.visible")
            .click();
         // 2.1 click [select]
         cy.get(
            ".webix_win_body > .webix_layout_line > .webix_el_button > .webix_el_box > .webix_button",
         )
            .should("be.visible")
            .click();

         // 3. click [save]
         cy.get('[data-cy="button save 2f658206-fdea-4823-87d9-82fe5b1680a4"]')
            .should("be.visible")
            .click();

         //
         // Verify Sproket & Frostbolt & listCharacters are correct
         //
         cy.get("@sproketConnections").should("contain", "Frostbolt");

         cy.get("@frostboltConnections").should("contain", "Sproket");

         cy.get("@listCharactersFollowingSpell")
            .should("contain", "Sproket")
            .should("contain", "Morganto")
            .should("not.contain", "Lester");
      });
   });
};
