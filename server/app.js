const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.static('/build/index.html'));

app.get('/api/tickets', (request, response) => {
  const data = fs.readFileSync('./data.json');
  const tickets = JSON.parse(data);

  if (request.query.searchText) {
    const queryParam = request.query.searchText.toLowerCase();
    const newTickets = tickets.filter((ticket) => {
      const filterTickets = ticket.title.toLowerCase();

      if (queryParam.indexOf('#') === 0) {
        if (!ticket.labels) {
          return false;
        }
        const filterLabels = ticket.labels.map((element) => element.toLowerCase());

        return filterLabels.some((label) => label.includes(queryParam.replace('#', '')));
      }
      return filterTickets.includes(queryParam);
    });
    response.send(newTickets);
  } else {
    response.send(tickets);
  }
});

app.post('/api/tickets/:ticketId/done', (request, response) => {
  const data = fs.readFileSync('./data.json');
  const tickets = JSON.parse(data);
  const doneTickets = tickets.map((ticket) => {
    if (ticket.id === request.params.ticketId) {
      // eslint-disable-next-line no-param-reassign
      ticket.done = true;
      response.send(ticket);
      return ticket;
    }
    return ticket;
  });
  const update = JSON.stringify(doneTickets);
  fs.writeFile('data.json', update);
  response.send(doneTickets);
});

app.post('/api/tickets/:ticketId/undone', (request, response) => {
  const data = fs.readFileSync('./data.json');
  const tickets = JSON.parse(data);
  const doneTickets = tickets.map((ticket) => {
    if (ticket.id === request.params.ticketId) {
      // eslint-disable-next-line no-param-reassign
      ticket.done = false;

      response.send(ticket);
      return ticket;
    }
    return ticket;
  });
  const update = JSON.stringify(doneTickets);
  fs.writeFile('data.json', update);
  response.send(doneTickets);
});
module.exports = app;
