import { Book, Member } from "./library.js";

export const books = new Map();
export const members = [];

export function saveToLocalStorage() {
    try {
        localStorage.setItem(
            "libraryBooks",
            JSON.stringify([...books.values()])
        );

        localStorage.setItem(
            "libraryMembers",
            JSON.stringify(members)
        );

        console.log("Library data saved successfully.");
        return true;
    } catch (error) {
        console.error("Failed to save library data:", error);
        return false;
    }
}

export function loadFromLocalStorage() {
    try {
        const booksData = localStorage.getItem("libraryBooks");
        const membersData = localStorage.getItem("libraryMembers");

        if (!booksData || !membersData) {
            return false;
        }

        const parsedBooks = JSON.parse(booksData);
        const parsedMembers = JSON.parse(membersData);

        books.clear();

        for (const bookData of parsedBooks) {
            const book = new Book(
                bookData.isbn,
                bookData.title,
                bookData.author,
                bookData.year,
                bookData.copies,
                bookData.category
            );

            book.availableCopies = bookData.availableCopies;
            book.checkedOut = bookData.checkedOut || [];

            books.set(book.isbn, book);
        }

        members.length = 0;

        for (const memberData of parsedMembers) {
            const member = new Member(
                memberData.id,
                memberData.name,
                memberData.email,
                memberData.membershipType
            );

            member.borrowedBooks = memberData.borrowedBooks || [];
            member.fines = memberData.fines || 0;

            members.push(member);
        }

        console.log("Library data loaded successfully.");
        return true;

    } catch (error) {
        console.error("Failed to load library data:", error);
        return false;
    }
}

export async function loadData() {
    try {
        books.clear();
        members.length = 0;

        const response = await fetch("../data.json");

        if (!response.ok) {
            throw new Error("Failed to load data.json");
        }

        const data = await response.json();

        data.books.forEach(bookData => {
            const book = new Book(
                bookData.isbn,
                bookData.title,
                bookData.author,
                bookData.year,
                bookData.copies,
                bookData.category
            );

            books.set(book.isbn, book);
        });

        data.members.forEach(memberData => {
            const member = new Member(
                memberData.id,
                memberData.name,
                memberData.email,
                memberData.membershipType
            );

            members.push(member);
        });

        console.log("JSON data loaded successfully.");
        return true;

    } catch (error) {
        console.error("Failed to load data:", error);
        return false;
    }
}