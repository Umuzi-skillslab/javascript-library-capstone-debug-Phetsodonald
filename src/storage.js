// import fs from "fs";
// import path from "path";

import { Book, Member } from "./library.js";


let books = new Map();
let members = [];


function loadData() {

    const filePath = path.join(__dirname, "data.json");

    const jsonData = fs.readFileSync(filePath, "utf-8");

    const data = JSON.parse(jsonData);


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

}


export {
    books,
    members,
    loadData
};