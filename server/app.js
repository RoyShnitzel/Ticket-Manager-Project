const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.static('/build/index.html'));

app.get('/api/tickets', ((request, response) => {
  const data = fs.readFileSync('./data.json');
  const tickets = JSON.parse(data);
  console.log(request.query.searchText);
  if (request.query.searchText) {
    const queryParam = request.query.searchText.toLowerCase();
    const newTicket = tickets.filter((ticket) => {
      const filterTicket = ticket.title.toLowerCase();
      return filterTicket.includes(queryParam);
    });
    response.send(newTicket);
  } else {
    response.send(tickets);
  }
}));

app.post('/api/tickets/:ticketId/done', ((request, response) => {
  console.log(request.params.ticketId);
  const data = fs.readFileSync('./data.json');
  const tickets = JSON.parse(data);
  const doneTickets = tickets.map((ticket) => {
    if (ticket.id === request.params.ticketId) {
      // eslint-disable-next-line no-param-reassign
      ticket.done = true;
      console.log(ticket);
      response.send(ticket);
      return ticket;
    }
    return ticket;
  });
  const update = JSON.stringify(doneTickets);
  fs.writeFile('data.json', update);
  response.send(doneTickets);
}));

app.post('/api/tickets/:ticketId/undone', ((request, response) => {
  console.log(request.params.ticketId);
  const data = fs.readFileSync('./data.json');
  const tickets = JSON.parse(data);
  const doneTickets = tickets.map((ticket) => {
    if (ticket.id === request.params.ticketId) {
      // eslint-disable-next-line no-param-reassign
      ticket.done = false;
      console.log(ticket);
      response.send(ticket);
      return ticket;
    }
    return ticket;
  });
  const update = JSON.stringify(doneTickets);
  fs.writeFile('data.json', update);
  response.send(doneTickets);
}));
module.exports = app;
