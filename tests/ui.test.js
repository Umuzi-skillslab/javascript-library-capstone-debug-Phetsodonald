import fs from "fs";
import path from "path";
import { jest } from "@jest/globals";
import { startApp } from "../src/main.js";

describe("Application Startup", () => {

    beforeEach(() => {
        const html = fs.readFileSync(
            path.resolve("index.html"),
            "utf8"
        );

        document.documentElement.innerHTML = html;
        startApp();
    });


    test("should render all books when the app starts", () => {
        const catalogue = document.getElementById("catalogue-list");
        const bookCard = document.querySelector(".book-card");

        expect(bookCard).not.toBeNull();
        expect(catalogue.children).toHaveLength(15);
    });


    test("should show clicked book details", () => {
        const bookCard = document.querySelector(".book-card");
        const catalogue = document.getElementById("catalogue-list");
        const bookDetails = document.querySelector("#book-details");

        bookCard.click();

        expect(catalogue.style.display).toBe("none");
        expect(bookDetails.style.display).toBe("block");

        expect(bookDetails.textContent)
            .toContain("The Great Gatsby");

        expect(bookDetails.textContent)
            .toContain("F. Scott Fitzgerald");
    });


    test("should search books by title", () => {
        const searchInput = document.getElementById("search");
        const catalogue = document.getElementById("catalogue-list");

        searchInput.value = "gatsby";

        searchInput.dispatchEvent(
            new Event("input", { bubbles: true })
        );

        expect(catalogue.children).toHaveLength(1);
        expect(catalogue.textContent)
            .toContain("The Great Gatsby");
    });


    test("should show all books when search is cleared", () => {
        const searchInput = document.getElementById("search");
        const catalogue = document.getElementById("catalogue-list");

        // Search first
        searchInput.value = "gatsby";
        searchInput.dispatchEvent(
            new Event("input", { bubbles: true })
        );

        expect(catalogue.children).toHaveLength(1);


        // Clear search
        searchInput.value = "";
        searchInput.dispatchEvent(
            new Event("input", { bubbles: true })
        );


        expect(catalogue.children).toHaveLength(15);
    });


    test("should filter books by category", () => {
        const filterDropdown = document.getElementById("filter-category");
        const catalogue = document.getElementById("catalogue-list");


        filterDropdown.value = "fiction";

        filterDropdown.dispatchEvent(
            new Event("change", { bubbles: true })
        );


        expect(catalogue.children.length).toBeGreaterThan(0);

        expect(catalogue.textContent)
            .toContain("The Great Gatsby");
    });


    test("should display borrow section when borrow button is clicked", () => {
        const borrowButton = document.getElementById("borrow-book");

        const borrowSection = document.getElementById("borrow-section");
        const catalogue = document.getElementById("catalogue-list");


        borrowButton.click();


        expect(borrowSection.style.display)
            .toBe("block");

        expect(catalogue.style.display)
            .toBe("none");
    });

    test("should reject empty borrow form", () => {
        const form = document.getElementById("borrow-form");

        const alertMock = jest.spyOn(window, "alert")
            .mockImplementation(() => {});


        form.dispatchEvent(
            new Event("submit", { bubbles:true })
        );


        expect(alertMock)
            .toHaveBeenCalled();


        alertMock.mockRestore();
    });


    test("should display members section when members tab is clicked", () => {
        const membersTab = document.getElementById("members-tab");

        const memberSection = document.getElementById("member-section");


        membersTab.click();


        expect(memberSection.style.display)
            .toBe("block");
    });


    test("should display statistics section when statistics tab is clicked", () => {
        const statisticsTab = document.getElementById("statistics-tab");

        const statisticsSection =
            document.getElementById("statistics-section");


        statisticsTab.click();


        expect(statisticsSection.style.display)
            .toBe("block");
    });

    test("should update statistics values", () => {
        document
        .getElementById("statistics-tab")
        .click();


        expect(
            document.querySelector(".total-books").textContent
        ).toBe("15");
    });


    test("should toggle add member form", () => {
        const createMemberButton =
            document.getElementById("create-member");

        const formContainer =
            document.getElementById("member-form");


        createMemberButton.click();


        expect(formContainer.style.display)
            .toBe("block");


        expect(formContainer.querySelector("form"))
            .not.toBeNull();
    });

    test("should display members list", () => {
        document
        .getElementById("members-tab")
        .click();


        const members =
            document.querySelectorAll(".member-card");


        expect(members.length)
            .toBeGreaterThan(0);
    });


    test("should create member form fields", () => {
        const createMemberButton =
            document.getElementById("create-member");

        createMemberButton.click();


        expect(document.getElementById("name"))
            .not.toBeNull();

        expect(document.getElementById("email"))
            .not.toBeNull();

        expect(document.getElementById("member-id"))
            .not.toBeNull();

        expect(document.getElementById("membership-type"))
            .not.toBeNull();
    });

});