const { books, members } = require('./storage');
const {LATE_FEE_PER_DAY} = require('./constants')

const ERROR_MESSAGES = {
    invalidString: value =>  `Expected a string value: ${value}`,
    invalidNumber: value =>  `Expected an integer value: ${value}`,
    instanceError: value =>  `Expected instance of ${value}`,
    invalidId: id => `Member with ID: ${id} not found.`,
    invalidIsbn: isbn => `Book with ISBN: ${isbn} not found.`,
    invalidArray: value => `${value} must be an array.`,
    invalidObject: "Expected an object.",
    idDuplicateError: id => `Member with ID ${id} already exists.`,
    isbnDuplicateError: isbn => `Book with ISBN ${isbn} already exists.`
};


// Creates a formatted summary of a book's details
function formatBookInfo(book) {
        return `TITLE: ${book.title.toUpperCase()}
    AUTHOR: ${book.author.toUpperCase()}
    YEAR: ${book.year}`.trim();

}

// Calculates fine amount
function calculateFineAmount(daysLate) {

    verifyNumber(daysLate);
    
    const fine = daysLate * LATE_FEE_PER_DAY;
    
    return Number(fine.toFixed(2));
}

// Validates that all provided values are strings
function verifyString(...strings){
    strings.forEach(string => {
        if( typeof string !== 'string' ){
            throw new Error(ERROR_MESSAGES.invalidString(string));
        }
    });
}

function checkMember(memberId) {
    verifyString(memberId);
    const memberExists = members.some(member => member.id === memberId);

    if (memberExists) {
        throw new Error(ERROR_MESSAGES.idDuplicateError(memberId));
    }
    return memberExists;
}

// Validates that all provided values are objects
function verifyObject(...objects) {
    objects.forEach(object => {
        if (typeof object !== 'object' || object === null) {
            throw new Error(ERROR_MESSAGES.invalidObject);
        }
    });
}

// Validates that all provided values are integers
function verifyNumber(...numbers){
    numbers.forEach(number => {
        if( typeof number !== 'number' || !Number.isInteger(number) || number < 0){
            throw new Error(ERROR_MESSAGES.invalidNumber(number));
        }
    });
}

function verifyArray(...arrays) {
    arrays.forEach(array => {
        if(!Array.isArray(array)){
            throw new Error(ERROR_MESSAGES.invalidArray(array));
        }
    })
}

function verifyMap(...maps) {
    maps.forEach(map => {
        if (!(map instanceof Map)) {
            throw new Error(ERROR_MESSAGES.instanceError("Map"));
        }
    });
}

function findOverdueBooks(daysOverdue) {
    verifyNumber(daysOverdue);

    const today = new Date();

    return [...books.values()].flatMap(book =>
        book.checkedOut
            .filter(record => {
                const daysBorrowed = Math.floor(
                    (today - new Date(record.borrowDate)) /
                    (1000 * 60 * 60 * 24)
                );

                return daysBorrowed > daysOverdue;
            })
            .map(record => ({
                isbn: book.isbn,
                memberId: record.memberId,
                borrowDate: record.borrowDate
            }))
    );
}  

// Processes each item in the return queue
function processReturnQueue(queue) {

    verifyArray(queue);

    let index = 0;

    while (index < queue.length) {
        const item = queue[index];

        console.log(`Processing return: ${item}`);

        index++;
    }
}

// Searchs book by category
function searchBooksByCategory(bookList, category) {
    verifyMap(bookList);
    verifyString(category);

    return [...bookList.values()].filter(
        book => book.category === category
    );
}

// Returns all books by author
function getBooksByAuthor(authorName) {
    verifyString(authorName);
    return [...books.values()].filter(book => book.author === authorName);
}

// Calculates the total late fees for a member
function calculateTotalLateFees(memberRecord) {
    verifyObject(memberRecord);
    
    return memberRecord.overdueBooks.reduce((total, book) => {
        return total + (book.daysLate * LATE_FEE_PER_DAY);
    }, 0);
}

// Combines all book collections into a single array
function combineBookCollections(fiction, nonFiction, reference) {
    verifyArray(fiction, nonFiction, reference);
    return [...fiction, ...nonFiction, ...reference];
}

// Adds multiple books to the library collection
function addMultipleBooks(...booksArr) {
    booksArr.forEach(book => {
        if (!book || typeof book !== 'object' || !book.isbn) {
            throw new Error(ERROR_MESSAGES.instanceError("Book"));
        }

        if (books.has(book.isbn)) {
            throw new Error(ERROR_MESSAGES.isbnDuplicateError(book.isbn));
        }

        books.set(book.isbn, book);
    });
}

// Adds multiple Members to the library data
function addMultipleMembers(...membersArr) {
    membersArr.forEach(member => {
        if (!member || typeof member !== 'object' || !member.id) {
            throw new Error(ERROR_MESSAGES.instanceError("Member"));
        }
        checkMember(member.id)
        members.push(member);
    });
}

// Updates member info safely without overwriting missing fields
function updateMemberInfo(member, updates) {
    verifyObject(updates);
    const { name, email, membershipType } = updates;

    if (name !== undefined) member.name = name;
    if (email !== undefined) member.email = email;
    if (membershipType !== undefined) member.membershipType = membershipType;

    return member;
}

// Borrows a book for a member
function borrowBook(memberId, isbn) {

    try {
        verifyString(memberId, isbn);
        
        const member = findMemberById(memberId);
        const book = findBookByISBN(isbn);

        if(!member.canBorrow())return false;
        if(!book.checkOut(memberId)) return false;

        member.borrowedBooks.push(isbn);
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }

}

// Finds a member by ID and throws an error if not found
function findMemberById(id) {
    verifyString(id);

    const member = members.find(member => member.id === id);

    if (!member) {
        throw new Error(ERROR_MESSAGES.invalidId(id));
    }

    return member;
}

// Finds a book by ISBN and throws an error if not found
function findBookByISBN(isbn) {
    verifyString(isbn);

    const book = books.get(isbn);
    
    if(!book){
        throw new Error(ERROR_MESSAGES.invalidIsbn(isbn))
    }

    return book;
}

module.exports = {
    findBookByISBN,
    findMemberById,
    findOverdueBooks,
    formatBookInfo,
    verifyArray,
    verifyMap,
    verifyNumber,
    verifyObject,
    verifyString,
    borrowBook,
    updateMemberInfo,
    calculateFineAmount,
    calculateTotalLateFees,
    checkMember,
    combineBookCollections, 
    addMultipleBooks,
    addMultipleMembers,
    searchBooksByCategory,
    getBooksByAuthor,
    processReturnQueue,
    ERROR_MESSAGES,
    
}