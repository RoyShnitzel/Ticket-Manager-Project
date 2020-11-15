/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('useFindAndModify', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const ticketSchema = new mongoose.Schema({
  title: String,
  content: String,
  userEmail: String,
  creationTime: Date,
  labels: [String],
  favorite: Boolean,
  done: Boolean,
});

ticketSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    // delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('TicketSchema', ticketSchema);
