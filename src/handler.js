const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createAt = new Date().toISOString();
  const updateAt = createAt;

  const newNote = {
    title, tags, body, id, createAt, updateAt,
  };

  notes.push(newNote);

  const isSuccsess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccsess) {
    const response = h.response({
      status: 'succsess',
      message: 'catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.header('Access-Control-Allow-Origin', '*');
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'catatan gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },

});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'Success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editNotesByIdHandler = (request, h) => {
  const { id } = request.params;
  // dapatkan data terbaru dari client
  const { title, tags, body } = request.payload;

  const updateAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updateAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNotesByIdHandler,
};