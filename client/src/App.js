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
    setTickets(data);
  }
  useEffect(() => {
    getTicketsFromServer();
  }, []);

  async function searchFunc(val) {
    const { data }= await axios.get(`/api/tickets?searchText=${val}`)
    setTickets(data)
  }

  function hideTicket (id) {
    setTickets((prevTickets)=> {
      const newTickets = prevTickets.map(ticket=> {
        if (ticket.id === id) {
          ticket.hide = true
          return ticket
        } else {
          return ticket
        }
      })
      return newTickets
    })
  }

  function restoreTickets () {
    setTickets((prevTickets=> {
      const newTickets = prevTickets.map(ticket=>{
        ticket.hide= false
        return ticket
      })
      return newTickets
    }))
  }

  const displayedTickets=tickets.filter(ticket=> !Boolean(ticket.hide))
  const hideCounter=tickets.length-displayedTickets.length
  const results=tickets.length
  return (
    <main className='app'>
      <div className='navbar'>
      <h1>Tickets Manager</h1>
      <SearchInput func={searchFunc}/>
      </div>
      { hideCounter>0 ? <div className='hideTicketsCounter'>
      <span>Showing <b>{results}</b> Results </span>
      <span>(</span>
      <span id='hideTicketsCounter'><b>{hideCounter}</b></span>
      <span> Hidden Tickets)</span>
      <button id='restoreHideTickets' onClick={()=>restoreTickets()}>restore <i class="fa fa-undo" aria-hidden="true"></i></button>
      </div>: <div className='hideTicketsCounter'>Showing <b>{results}</b> Results</div> }
      <TicketsList data={displayedTickets} hideFunc={hideTicket}/>
    </main>
  );
}

export default App;
