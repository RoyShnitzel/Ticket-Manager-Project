import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import TicketsList from './components/ticketsList';

function App() {
  const [tickets, setTickets] = useState([]);
  async function getTicketsFromServer() {
    const { data } = await axios.get('http://localhost:8080/api/tickets')
      .catch((error) => {
        console.log(error);
        alert('Tickets Do Not Exist');
      });
    console.log(data);
    setTickets(data);
  }
  useEffect(() => {
    getTicketsFromServer();
  }, []);

  return (
    <main>
      hello world
      <TicketsList data={tickets} />
    </main>
  );
}

export default App;
