/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
const express = require("express");
const TicketSchema = require("./models/ticketMongo.js");

const app = express();
app.use(express.static("../client/build"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/tickets", async (request, response) => {
  const tickets = await TicketSchema.find({});
  const { page } = request.query;
  const { limit } = request.query;
  const { sort } = request.query;
  sort
    ? tickets.sort((a, b) =>
        sort === "true"
          ? a.creationTime - b.creationTime
          : b.creationTime - a.creationTime
      )
    : console.log(sort);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const pagedTickets = tickets.slice(startIndex, endIndex);

  if (request.query.searchText) {
    const queryParam = request.query.searchText.toLowerCase();
    const newTickets = tickets.filter((ticket) => {
      const filteredTicket = ticket.title.toLowerCase();
      // filter by labels. checks if "#" is the first letter
      if (queryParam.indexOf("#") === 0) {
        const labelQueryParam = queryParam.replace("#", "");
        if (!ticket.labels) {
          return false;
        }
        // check for every label in labels if it contains the queryParam
        return ticket.labels.some((label) =>
          label.toLowerCase().includes(labelQueryParam)
        );
      }
      return filteredTicket.includes(queryParam);
    });
    const newPagedTickets = newTickets.slice(startIndex, endIndex);
    response.send(
      page === "0" || page === undefined ? newTickets : newPagedTickets
    );
  } else {
    response.send(page === "0" || page === undefined ? tickets : pagedTickets);
  }
});

app.post("/api/tickets/:ticketId/:done", (request, response) => {
  if (request.params.done === "true") {
    TicketSchema.findByIdAndUpdate(
      { _id: request.params.ticketId },
      { done: false },
      { new: true }
    ).then(() => response.send("done"));
  } else {
    TicketSchema.findByIdAndUpdate(
      { _id: request.params.ticketId },
      { done: true },
      { new: true }
    ).then(() => response.send("done"));
  }
});

app.post("/api/tickets/favorite/:ticketId/:favorite", (request, response) => {
  if (request.params.favorite === "true") {
    TicketSchema.findByIdAndUpdate(
      { _id: request.params.ticketId },
      { favorite: false },
      { new: true }
    ).then(() => response.send("favorite"));
  } else {
    TicketSchema.findByIdAndUpdate(
      { _id: request.params.ticketId },
      { favorite: true },
      { new: true }
    ).then(() => response.send("favorite"));
  }
});

app.post("/addticket", (request, response) => {
  const newTicket = new TicketSchema({
    title: request.body.title,
    content: request.body.content,
    userEmail: request.body.userEmail,
    creationTime: request.body.creationTime,
    labels: request.body.labels,
  });
  newTicket.save().then(() => {
    response.send("Submitted");
  });
});

// app.post('/setMongodb', (req, res) => {
//   const data = fs.readFileSync('./data.json');
//   newAllTickets = JSON.parse(data);
//   newAllTickets.forEach((value) => {
//     const ticket = new TicketSchema({
//       title: value.title,
//       content: value.content,
//       userEmail: value.userEmail,
//       creationTime: value.creationTime,
//       labels: value.labels,
//     });
//     ticket.save().then((savedTicket) => {
//       res.json(savedTicket);
//     });
//   });
// });

module.exports = app;
