import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import TicketsList from './components/ticketsList';
import SearchInput from './components/searchInput';

function App() {
  const [tickets, setTickets] = useState([]);
  async function getTicketsFromServer() {
    const { data } = await axios.get('/api/tickets')
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

  async function searchFunc(val) {
    const { data }= await axios.get(`/api/tickets/?searchText=${val}`)
    setTickets(data)
  }

  return (
    <main>
      <h1>Ticket Manager</h1>
      <SearchInput func={searchFunc}/>
      <TicketsList data={tickets} />
    </main>
  );
}

export default App;
