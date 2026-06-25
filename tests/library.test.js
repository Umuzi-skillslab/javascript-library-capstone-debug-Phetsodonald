const { books, members } = require('../src/storage');
const {LATE_FEE_PER_DAY} = require('../src/constants');
const { Book, Member, PremiumMember, DigitalBook, LibraryStats } = require('../src/library');
const { findBookByISBN,
        addMultipleBooks, 
        findOverdueBooks, 
        processReturnQueue, 
        ERROR_MESSAGES, 
        formatBookInfo, 
        getBooksByAuthor, 
        calculateFineAmount, 
        addMultipleMembers, 
        checkMember, 
        verifyObject, 
        verifyArray, 
        verifyMap, 
        calculateTotalLateFees,
        combineBookCollections,
        searchBooksByCategory} = require('../src/utils');

describe('Book Class', () => {
    // HAPPY TESTS
    test('should create a book instance', () => {
        const book = new Book('978-0-123', 'Ice and Fire', 'Phetso', 2020, 5, 'fiction');
        
        expect(book.isbn).toBe('978-0-123');
        expect(book.title).toBe('Ice and Fire');
        expect(book.author).toBe('Phetso');
        expect(book.year).toBe(2020);
        expect(book.category).toBe('fiction');
        expect(book.availableCopies).toBe(5);

    }); 

    test('should check book copies are available', () => {
        const book = new Book('978-0-123', 'Ice and Fire', 'Phetso', 2020, 5, 'fiction');
        expect(book.checkAvailability()).toBe(true);
    });

    test('should get book information', () => {
        const book = new Book('978-0-123', 'Ice and Fire', 'Phetso', 2020, 5, 'fiction');

        expect(book.getBookInfo().replace(/\s+$/gm, '')).toBe(
    `TITLE: ICE AND FIRE
    AUTHOR: PHETSO
    YEAR: 2020`
        ); 
    });
    
    test('should checkout if there are available copies', () => {
        const member = new Member('member165', 'Phetso', 'Phetso@gmail.com');
        const book = new Book('978-0-123', 'Ice and Fire', 'Phetso', 2020, 5, 'fiction');

        expect(book.checkOut(member.id)).toBe(true);
        expect(book.availableCopies).toBe(4);
        expect(book.checkedOut.length).toBe(1)
    });

    test('should check for copies availability', () => {
        const book = new Book('978-0-123', 'Ice and Fire', 'Phetso', 2020, 0, 'fiction');
        expect(book.checkAvailability()).toBe(false)
    })



    // SAD TESTS
    test('should throw an error if invalid value is passed to isbn.', () => {
        expect(() => {
            new Book(9757, 'Ice and Fire', 'Phetso', 2020, 5, 'fiction');
        }).toThrowError(ERROR_MESSAGES.invalidString(9757));
    });

    test('should throw an error if invalid value is passed to title input.', () => {
        expect(() => {
            new Book ('978-0-123', true, 'Phetso', 2020, 5, 'fiction');
        }).toThrowError(ERROR_MESSAGES.invalidString(true));
    });

    test('should throw an error if invalid value is passed to author name input.', () => {
        expect(() => {
            new Book('978-0-123', 'Ice and Fire', null, 2023, 7, 'nonfiction')
        }).toThrowError(ERROR_MESSAGES.invalidString(null));
    });

    test('should throw an error if invalid value is passed to year input.', () => {
        expect(() => {
            new Book('978-0-123', 'Ice and Fire', 'Phetso', -245686.79, 8, 'Reference')
        }).toThrowError(ERROR_MESSAGES.invalidNumber(-245686.79));
    });

    test('should throw an error if invalid value is passed to copies input.', () => {
        expect(() => {
            new Book('978-0-123', 'Ice and Fire', 'Phetso', 2026, -43, 'non-fiction');
        }).toThrowError(ERROR_MESSAGES.invalidNumber(-43));
    });

    test('should throw an error if invalid value is passed to category input.', () => {
        expect(() => {
            new Book('978-0-123', 'Ice and Fire', 'Phetso', 2026, 3, undefined);
        }).toThrowError(ERROR_MESSAGES.invalidString(undefined))
    })

});

describe('DigitalBook Class', () => {
    // HAPPY TESTS
    test('should check if ebook is an instanceOf Book and DigitalBook classes', () => {
        const ebook = new DigitalBook('778-0-123', 'song of ice and fire', 'Phetso', 1993, 'fiction', 12, 'pdf');

        expect(ebook instanceof Book).toBe(true);
        expect(ebook instanceof DigitalBook).toBe(true);
    })
    
    test('should check if the super() is called ', () => {
        const ebook = new DigitalBook('778-0-123', 'song of ice and fire', 'Phetso', 1993, 'fiction', 12, 'pdf');
        expect(ebook.isbn).toBe('778-0-123');
        expect(ebook.title).toBe('song of ice and fire');
        expect(ebook.author).toBe('Phetso');
        expect(ebook.year).toBe(1993);
        expect(ebook.availableCopies).toBe(1);
        expect(ebook.category).toBe('fiction')
    });
    
    test('should check if the downloads increments after a is downloaded', () => {
        const member = new Member('member165', 'Phetso', 'Phetso@gmail.com');
        const ebook = new DigitalBook('778-0-123', 'song of ice and fire', 'Phetso', 1993, 'fiction', 12, 'pdf');

        expect(ebook.download(member.id)).toBe(true);
        expect(ebook.downloads).toBe(1);

    });

    test('should check if check out method increaments download', () => {
        const member = new Member('member165', 'Phetso', 'Phetso@gmail.com');
        const ebook = new DigitalBook('778-0-123', 'song of ice and fire', 'Phetso', 1993, 'fiction', 12, 'pdf');

        ebook.checkOut(member.id);
        expect(ebook.downloads).toBe(1);
    });

    // SAD TESTS
    test('should throw an error if invalid value is passed to isbn input.', () => {
        
        expect(() => {
            const ebook = new DigitalBook(null, 'song of ice and fire', 'Phetso', 1993, 'fiction', 12, 'pdf');
        }).toThrowError(ERROR_MESSAGES.invalidString(null));
    });

    test('should throw an error if invalid value is passed to title input', () => {
        expect(() => {
            const ebook = new DigitalBook('778-0-123', false, 'Phetso', 1993, 'fiction', 12, 'pdf');
        }).toThrowError(ERROR_MESSAGES.invalidString(false));
    });

    test('should throw an error if invalid value is passed to author input.', () => {
        expect(() => {
            const ebook = new DigitalBook('778-0-123', 'song of ice and fire', undefined, 1993, 'fiction', 12, 'pdf');
        }).toThrowError(ERROR_MESSAGES.invalidString(undefined));
    });

    test('should throw an error if invalid value is passed to year input', () => {
        expect(() => {
            const ebook = new DigitalBook('778-0-123', 'song of ice and fire', 'Phetso', -1993, 'fiction', 12, 'pdf');
        }).toThrowError(ERROR_MESSAGES.invalidNumber(-1993));
    });

    test('should throw an error if invalid value is passed to category input.', () => {
        expect(() => {
            const ebook = new DigitalBook('778-0-123', 'song of ice and fire', 'Phetso', 1993, 16893, 12, 'pdf');
        }).toThrowError(ERROR_MESSAGES.invalidString(16893))
    });

    test('should throw an error if invalid value is passed to fileSize input.', () => {
        expect(() => {
            const ebook = new DigitalBook('778-0-123', 'song of ice and fire', 'Phetso', 1993, 'fiction', 'MB', 'pdf');
        }).toThrowError(ERROR_MESSAGES.invalidNumber('MB'));
    });

    test('should throw an error if invalid value is passed to format input.', () => {
        expect(() => {
            const ebook = new DigitalBook('778-0-123', 'song of ice and fire', 'Phetso', 1993, 'fiction', 'MB', -1673.8903);
        }).toThrowError(ERROR_MESSAGES.invalidString(-1673.8903));
    })
    
});

describe('Member Class', () => {
    test('canBorrow returns boolean', () => {
        const member = new Member('member1', 'John Doe', 'john@example.com', 'standard');
        
        expect(member.canBorrow()).toBe(true);
    });
    
    
    test('should check for borrow limit', () => {
        const member = new Member('member1', 'John Doe', 'john@example.com', 'standard');
        const book = new Book('978-0-123', 'Ice and Fire', 'Phetso', 2020, 5, 'fiction');
        
        member.borrowedBooks.push(book)
        member.borrowedBooks.push(book)
        member.borrowedBooks.push(book)
        member.borrowedBooks.push(book)
        member.borrowedBooks.push(book)
        expect(member.canBorrow()).toBe(false);
    });
    
    test('should calculate membership duration', () => {
        const member = new Member(
            'member1',
            'John Doe',
            'john@example.com',
            'standard'
        );

        expect(member.membershipDuration()).toBe(0);
    });

    test('should get updated member info', () => {
        const member = new Member(
            'member1',
            'John Doe',
            'john@example.com',
            'standard'
        );

        member.getUpdatedMemberInfo({
            name: 'Jane Doe',
            email: 'jane@gmail.com'
        });

        expect(member.name).toBe('Jane Doe');
        expect(member.email).toBe('jane@gmail.com');
        expect(member.membershipType).toBe('standard');

    })
    
});

describe('PremiumMember Class', () => {
    
    test('should check is member is an instance of a Member class', () => {
        const member = new PremiumMember('member', 'Phetso', 'rose@gmail.com');
        expect(member instanceof Member).toBe(true);
        expect(member instanceof PremiumMember).toBe(true);
    });

    test('should check if premium member can borrow more books', () => {
        const member = new PremiumMember('member', 'Phetso', 'rose@gmail.com')
        const book = new Book('978-0-123', 'Ice and Fire', 'Phetso', 2020, 5, 'fiction');

        
        member.borrowedBooks.push(book);
        member.borrowedBooks.push(book);
        member.borrowedBooks.push(book);
        member.borrowedBooks.push(book);
        member.borrowedBooks.push(book);
        member.borrowedBooks.push(book);
        member.borrowedBooks.push(book);
        member.borrowedBooks.push(book);
        member.borrowedBooks.push(book);
        member.borrowedBooks.push(book);

        expect(member.canBorrow()).toBe(true);
        expect(member.borrowedBooks.length).toBe(10)
    });

});

describe('Library Functions', () => {
    let book1;
    let book2;
    beforeEach(() => {
        books.clear();
        members.length = 0;

        book1 = new Book(
            '978-0-123',
            'Ice and Fire',
            'Phetso',
            2020,
            5,
            'fiction'
        );

        book2 = new Book(
            '978-0-456',
            'JavaScript Mastery',
            'John Doe',
            2023,
            3,
            'technology'
        );

        addMultipleBooks(book1, book2);
    });

    test('should check if findBookByISBN returns book by isbn', () => {
        const book1 = findBookByISBN('978-0-123');
        const book2 = findBookByISBN('978-0-456');

        expect(book1.title).toBe('Ice and Fire');
        expect(book2.title).toBe('JavaScript Mastery');
    });
    
    
    test('should check if getBooksByAuthor return all books by the author.', () => {
        const results = getBooksByAuthor('Phetso');
        expect(results.length).toBe(1);
        expect(results[0].author).toBe('Phetso');
    });

    test('should calculate total borrowings correctly', () => {
        book1.checkedOut.push({ memberId: 'm1', borrowDate: new Date() });
        book1.checkedOut.push({ memberId: 'm2', borrowDate: new Date() });
        book2.checkedOut.push({ memberId: 'm3', borrowDate: new Date() });

        const total = LibraryStats.calculateTotalBorrowings();
        expect(total).toBe(3);
        expect(LibraryStats.totalBorrowings).toBe(3)
    });

    test('should calculate average borrowings per book', () => {

        book1.checkedOut.push({ memberId: 'm1', borrowDate: new Date() });
        book1.checkedOut.push({ memberId: 'm2', borrowDate: new Date() });
        book2.checkedOut.push({ memberId: 'm3', borrowDate: new Date() });

        LibraryStats.calculateTotalBorrowings();

        const avg = LibraryStats.calculateAverageBorrowingsPerBook();

        expect(avg).toBe(2);
    });

    test('should return correct library summary', () => {

        members.push({ id: 'm1' });
        members.push({ id: 'm2' });

        LibraryStats.calculateTotalBorrowings();

        LibraryStats.totalBooks = books.size;
        LibraryStats.totalMembers = members.length;

        const summary = LibraryStats.getSummary();

        expect(summary).toEqual({
            totalBooks: 2,
            totalMembers: 2,
            totalBorrowings: LibraryStats.totalBorrowings
        });
    });

    test('should update stats correctly', () => {

        members.push({ id: 'm1' });

        LibraryStats.updateStats();

        expect(LibraryStats.totalBooks).toBe(2);
        expect(LibraryStats.totalMembers).toBe(1);
    });

    test('should return most popular book', () => {

        book1.checkedOut.push({ memberId: 'm1', borrowDate: new Date() });
        book1.checkedOut.push({ memberId: 'm2', borrowDate: new Date() });

        book2.checkedOut.push({ memberId: 'm3', borrowDate: new Date() });

        const popular = LibraryStats.getMostPopularBook();

        expect(popular.isbn).toBe('978-0-123');
    });

    test('should search books by category', () => {
        books.clear();
        const book1 = new Book('978-0-123', 'Ice and Fire', 'Phetso', 2020, 5, 'fiction');
        const book2 = new Book('978-0-456', 'Taken', 'Phetso', 2010, 7, 'non-fiction');
        const book3 = new Book('948-0-456', 'Taken', 'Phetso', 2010, 7, 'non-fiction');

        addMultipleBooks(book1, book2, book3);
        const results = searchBooksByCategory(books, 'non-fiction');

        expect(results.length).toBe(2);
    })

    test('should throw an error if invalid value is passed to searchBooksByCategory function.', () => {
        expect(() => {
            const results = searchBooksByCategory(books, 1234);
        }).toThrowError(ERROR_MESSAGES.invalidString(1234))
    });  
    
    test('should return empty array when author has no books', () => {
        const result = getBooksByAuthor('Unknown Author');
        expect(result).toEqual([]);
    });

    test('should throw an error if a invalid value is passed to getBooksByAuthor.', () => {
        expect(() => {
            getBooksByAuthor(null)
        }).toThrowError(ERROR_MESSAGES.invalidString(null));
    })

    test('should throw an error if an invalid value is passed to findBookByISBN.', () => {
        expect(() => {
            findBookByISBN(undefined)
        }).toThrowError(ERROR_MESSAGES.invalidString(undefined));
    });

});

describe('calculateFineAmount function', () => {
    test('should calculate the fine amount', () => {
        expect(calculateFineAmount(5)).toBe(2.50);
    });

    test('should return false when member does not exist', () => {
        const result = checkMember('member12390');

        expect(result).toBe(false);
    });

    test('should throw an error in an invalid value is passed to calculateFineAmount function.', () => {
        expect(() => {
            calculateFineAmount(undefined);
        }).toThrowError(ERROR_MESSAGES.invalidNumber(undefined));
    })
});

describe('findOverdueBooks', () => {
 test('should return books that are overdue', () => {
        books.clear();

        const book = new Book(
            '978-0-123',
            'Ice and Fire',
            'Phetso',
            2020,
            5,
            'fiction'
        );

        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

        book.checkedOut.push({
            memberId: 'member1',
            borrowDate: tenDaysAgo
        });

        books.set(book.isbn, book);

        const result = findOverdueBooks(7);

        expect(result.length).toBe(1);
        expect(result[0].isbn).toBe('978-0-123');
        expect(result[0].memberId).toBe('member1');
    });

});

describe('processReturnQueue', () => {
    test('should process all items in the return queue', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        processReturnQueue(['book1', 'book2', 'book3']);

        expect(consoleSpy).toHaveBeenCalledTimes(3);

        expect(consoleSpy).toHaveBeenNthCalledWith(
            1,
            'Processing return: book1'
        );

        expect(consoleSpy).toHaveBeenNthCalledWith(
            2,
            'Processing return: book2'
        );

        expect(consoleSpy).toHaveBeenNthCalledWith(
            3,
            'Processing return: book3'
        );

        consoleSpy.mockRestore();
        });
})

describe('calculateTotalLateFees', () => {
    
    test('should correctly calculate total late fees for multiple overdue books', () => {
        const memberRecord = {
            overdueBooks: [
                { daysLate: 2 },
                { daysLate: 5 },
                { daysLate: 1 }
            ]
        };

        const expected = (2 + 5 + 1) * LATE_FEE_PER_DAY;

        expect(calculateTotalLateFees(memberRecord)).toBe(expected);
    });

    test('should return 0 when there are no overdue books', () => {
        const memberRecord = {
            overdueBooks: []
        };

        expect(calculateTotalLateFees(memberRecord)).toBe(0);
    });

    test('should calculate correctly for a single overdue book', () => {
        const memberRecord = {
            overdueBooks: [
                { daysLate: 4 }
            ]
        };

        expect(calculateTotalLateFees(memberRecord)).toBe(4 * LATE_FEE_PER_DAY);
    });

    test('should throw an error if an invalid value is passed to calculateTotalLateFees function', () => {
        
        expect(() => {
            calculateTotalLateFees(7);
        }).toThrowError(ERROR_MESSAGES.invalidObject)
    })
});

describe('combineBookCollections',() =>{
    test('should combine all the arrays in a single array', () => {
        const fiction = ['song of ice and fire', 'Behind the wall']
        const nonFiction = ['Story of Mary']
        const reference = ['Dua lipa']

        const results = combineBookCollections(fiction, nonFiction, reference);
        expect(results).toEqual(['song of ice and fire', 'Behind the wall', 'Story of Mary', 'Dua lipa'])
    });

    test('should throw an error if an invalid value is passed', () => {
        
        expect(() => {
            combineBookCollections('fiction', undefined, null);
        }).toThrowError(ERROR_MESSAGES.invalidArray('fiction'))
    })
});

describe('addMultipleBooks', () => {
    
    test('should add book to the books storage', () => {
        books.clear();
        const book1 = new Book('978-0-123', 'Ice and Fire', 'Phetso', 2020, 5, 'fiction');
        const book2 = new Book('928-0-523', 'Story of Mary', 'Phetso', 2010, 5, 'nonFiction');
        const book3 = new Book('930-0-183', 'Eddie', 'Phetso', 2017, 5, 'fiction');

        addMultipleBooks(book1, book2, book3)
        expect(books.size).toBe(3);        
    });

    test('should throw an error if an invalid value is passed', () => {
        expect(() => {
            addMultipleBooks("book1", "book2")
        }).toThrowError(ERROR_MESSAGES.instanceError("Book"))
    });

    test('should throw an error if ther is duplicate ISBN', () => {
        const book1 = new Book('978-0-123', 'Ice and Fire', 'Phetso', 2020, 5, 'fiction');
        expect(() => {   
             addMultipleBooks(book1);
        }).toThrowError(ERROR_MESSAGES.isbnDuplicateError(book1.isbn))
    })
})

describe('utils functions', () => {   

    test('should throw an error if invalid value is passed to verifyObject function.', () => {
        expect(() => {
            verifyObject('object')
        }).toThrowError(ERROR_MESSAGES.invalidObject)
    });

    test('should throw an error if invalid value is passed to verifyArray function', () => {
        expect(() => {
            verifyArray(null);
        }).toThrowError(ERROR_MESSAGES.invalidArray(null))
    })

    test('should throw an error if invalid value is passed to verifyMap function', () => {
        expect(() => {
            verifyMap('Map');
        }).toThrowError(ERROR_MESSAGES.instanceError('Map'))
    })

    test('should throw error when member already exists', () => {
        const member = new Member(
            'member12390',
            'Phetso',
            'ray@gmail.com',
            'standard'
        );

        addMultipleMembers(member);

        expect(() => {
            checkMember('member12390');
        }).toThrowError(
            ERROR_MESSAGES.idDuplicateError('member12390')
        );
    });


})

// describe('Array Operations', () => {
//     // Missing: tests for filter operations
//     // Missing: tests for map operations
//     // Missing: tests for reduce operations
//     // Missing: tests for spread operator
//     // Missing: tests for rest parameters
// });

// describe('Recursive Functions', () => {
//     // Missing: test for searchBooksByCategory
//     // Missing: test for base case
//     // Missing: test for stack overflow prevention
// });

// describe('Error Handling', () => {
//     // Missing: tests for try-catch blocks
//     // Missing: tests for undefined/null handling
//     // Missing: tests for type checking
// });

// describe('String Operations', () => {
//     // Missing: tests for formatBookInfo
//     // Missing: tests for template literals
//     // Missing: tests for string methods
// });

// describe('Math Operations', () => {
//     test('calculateFineAmount returns number', () => {
//         var fine = calculateFineAmount(5);
        
//         expect(typeof fine).toBe('number');
//         // Missing: test for correct calculation
//         // Missing: test for toFixed/rounding
//     });
    
//     // Missing: test for NaN handling
//     // Missing: test for negative numbers
// });

// describe('DOM Manipulation', () => {
//     // Missing: DOM setup with jsdom
//     // Missing: tests for event handlers
//     // Missing: tests for renderBookCatalogue
//     // Missing: tests for search functionality
// });

// describe('JSON Operations', () => {
//     // Missing: tests for JSON.stringify
//     // Missing: tests for JSON.parse
//     // Missing: tests for error handling in JSON operations
// });

// describe('LocalStorage', () => {
//     // Missing: localStorage mock
//     // Missing: tests for save functionality
//     // Missing: tests for load functionality
//     // Missing: tests for error handling
// });

// // Missing: describe blocks for:
// // - Nested loops
// // - For-of loops
// // - Destructuring
// // - Scope testing (var, let, const)
// // - Module exports/imports
