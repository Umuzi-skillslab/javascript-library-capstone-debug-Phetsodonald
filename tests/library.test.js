const {Book, DigitalBook, Member, PremiumMember, ERROR_MESSAGES, addMultipleMembers} = require('../src/library');

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

        member.joinDate = new Date('2025-01-01');

        const mockToday = new Date('2025-01-31');
        const duration = Math.floor(
            (mockToday - member.joinDate) / (1000 * 60 * 60 * 24)
        );

        expect(duration).toBe(30);
    });
    
});

// describe('PremiumMember Class', () => {
//     // Missing: all tests for premium member
//     // Missing: test for inheritance
//     // Missing: test for overridden methods
// });

// describe('Library Functions', () => {
//     // Missing: beforeEach to initialize test data
    
//     test('findBookByISBN returns book', () => {
//         // Test data not set up properly
//         var book = findBookByISBN('978-0-123');
        
//         // Will fail - no books in array
//         expect(book).toBeDefined();
//     });
    
//     // Missing: test for getBooksByAuthor
//     // Missing: test with empty arrays
//     // Missing: test with null/undefined inputs
// });

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
