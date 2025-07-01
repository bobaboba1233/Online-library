const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/online_library');
});

afterAll(async () => {
  await mongoose.disconnect();
});