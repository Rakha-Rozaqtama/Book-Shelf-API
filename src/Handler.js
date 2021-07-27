const { nanoid } = require('nanoid');
const Books = require('./Storage');

const addBooksHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Checking payload request value & return negative response if the requirement not fulfilled
  if (typeof (name) === 'undefined') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // detail data
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // books data
  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  // Storing new books data in the array
  Books.push(newBooks);

  // Checking if the new books successfully stored
  const successStored = Books.filter((data) => data.id === id).length > 0;

  // positive response
  if (successStored) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // negative response
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (typeof (name) !== 'undefined') {
    const resultBooks = Books.filter((item) => item.name.toLowerCase()
      .includes(name.toLowerCase()));

    // Positive Response
    const response = h.response({
      status: 'success',
      data: {
        books: resultBooks.map((book) => (
          {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }
  if (typeof (reading) !== 'undefined') {
    let resultBooks = null;
    if (reading) {
      resultBooks = Books.filter((item) => item.reading === true);
    } else {
      resultBooks = Books.filter((item) => item.reading === false);
    }

    // Positive Response
    const response = h.response({
      status: 'success',
      data: {
        books: resultBooks.map((book) => (
          {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }
  if (typeof (finished) !== 'undefined') {
    let resultBooks = null;
    if (finished) {
      resultBooks = Books.filter((item) => item.finished);
    } else {
      resultBooks = Books.filter((item) => !item.finished);
    }

    // Positive Response
    const response = h.response({
      status: 'success',
      data: {
        books: resultBooks.map((book) => (
          {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  // Positive Response
  const response = h.response({
    status: 'success',
    data: {
      books: Books.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const bookFound = Books.filter((book) => book.id === bookId)[0];

  // Positive response, if 'bookFound' value not equals 'undefined'
  if (typeof (bookFound) !== 'undefined') {
    const response = h.response({
      status: 'success',
      data: {
        book: bookFound,
      },
    });
    response.code(200);
    return response;
  }

  // Negative response, if 'bookFound' value equals 'undefined'
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  // Path parameters
  const { bookId } = request.params;

  // Payload request
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Checking payload request value
  if (typeof (name) === 'undefined') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Checking if book id exist
  const bookIdx = Books.findIndex((book) => book.id === bookId);

  if (bookIdx !== -1) {
    const updateAt = new Date().toISOString();
    Books[bookIdx] = {
      ...Books[bookIdx],
      name,
      year,
      author,
      summary,
      publisher,
      readPage,
      pageCount,
      reading,
      updateAt,
    };

    // Positive response
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // Negative response
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const bookIdx = Books.findIndex((book) => book.id === bookId);

  if (bookIdx !== -1) {
    Books.splice(bookIdx, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // Negative response
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
