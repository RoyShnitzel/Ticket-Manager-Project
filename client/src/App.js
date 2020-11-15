import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import axios from 'axios';
import TicketsList from './components/ticketsList';
import SearchInput from './components/searchInput';
import NewTicketPopUp from './components/newTicket';

function App() {
  const [tickets, setTickets] = useState([]);
  const [display, setDisplay] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [serverSort, setServerSort] = useState(true);
  const [localSort, setLocalSort] = useState(true);
  const [page,setPage] = useState(1)
  const [hasMore, setHasMore]= useState(true)
  const [allTickets, setAllTickets]= useState([]);
  const [valueOfInput,setValueOfInput] = useState('');
  const getTicketsFromServer = useCallback(async function getTicketsFromServer() {
    const limit = 10;
    const { data } = display !== false? await axios.get(`/api/tickets`):await axios.get(`/api/tickets?page=${page}&limit=${limit}&sort=false`); 
    const allTicketsData = await axios.get(`/api/tickets`)
    setAllTickets(allTicketsData.data)
    setPage(prevPage=>prevPage + 1); 
    setTickets(prevData=>[...prevData,...data]);
    data.length<10? setHasMore(false):display !== false? setHasMore(false):setHasMore(true);
  },[display])

  useEffect( () => {
    getTicketsFromServer();
  }, []);

  async function searchFunc(val,displayStatus) {
    const limit = 10;
    const codedVal = encodeURIComponent(val);
    const { data } = await axios.get(`/api/tickets?searchText=${codedVal}&page=${val === ''?1:0}&limit=${limit}`);
    data.sort((a, b) => (b.creationTime - a.creationTime));
    setTickets(data);
    setDisplay(displayStatus);
    val === ''? setHasMore(true):setHasMore(false)
    setPage(2)
  }

  const hideTicket = useCallback(function hideTicket(id) {
    function applyHide (data) {
      const newTickets = data.map((ticket) => {
        if (ticket.id === id) {
          ticket.hide = true;
          return ticket;
        }
        return ticket;
      });
      return newTickets;
    };
    if(display !== false){
      setAllTickets((prevTickets)=> {
        return applyHide(prevTickets)
      })
    } else {
    setTickets((prevTickets) => {
      return applyHide(prevTickets)
    });
  }
  },[display])

  const favoriteTicket = useCallback(function favoriteTicket(id, favorite) {
    setAllTickets((prevTickets) => {
      const newTickets = prevTickets.map((ticket) => {
        if (ticket.id === id) {
          if (favorite){
          ticket.favorite = false;
          axios.post(`/api/tickets/favorite/${ticket.id}/${favorite}`)
          return ticket;
          }
          axios.post(`/api/tickets/favorite/${ticket.id}/${favorite}`)
          ticket.favorite = true;
          return ticket;
        }
        return ticket;
      });
      return newTickets;
    });
    setTickets((prevTickets) => {
      const newTickets = prevTickets.map((ticket) => {
        if (ticket.id === id) {
          if (favorite){
          ticket.favorite = false;
          return ticket;
          }
          ticket.favorite = true;
          return ticket;
        }
        return ticket;
      });
      return newTickets;
    });
  })

  const doneTicket = useCallback(function doneTicket(id, done) {
    setAllTickets((prevTickets) => {
      const newTickets = prevTickets.map((ticket) => {
        if (ticket.id === id) {
          if (done){
          ticket.done = false;
          axios.post(`/api/tickets/${ticket.id}/${done}`)
          return ticket;
          }
          axios.post(`/api/tickets/${ticket.id}/${done}`)
          ticket.done = true;
          return ticket;
        }
        return ticket;
      });
      return newTickets;
    });
    setTickets((prevTickets) => {
      const newTickets = prevTickets.map((ticket) => {
        if (ticket.id === id) {
          if (done){
          ticket.done = false;
          return ticket;
          }
          ticket.done = true;
          return ticket;
        }
        return ticket;
      });
      return newTickets;
    });
  })

  const restoreTickets = useCallback(function restoreTickets() {
    function applyRestore(data) {
      const newTickets = data.map((ticket) => {
        ticket.hide = false;
        return ticket;
      });
      return newTickets;
    }
    if (display !== false){
      setAllTickets((prevTickets) => {
        return applyRestore(prevTickets)
      });
    } else {
    setTickets((prevTickets) => {
      return applyRestore(prevTickets)
    });
  }
  },[display])

  const sortTicketsByDate = useCallback(function sortTicketsByDate() {
    const ticketsClone = display !== false? allTickets.slice():tickets.slice();
    ticketsClone.sort((a, b) => {
      if(display !== false) {
        if(localSort){
          return a.creationTime - b.creationTime
        } else {
          return b.creationTime - a.creationTime
        }
    } else {
        if(serverSort){
          axios.get(`/api/tickets?page=1&limit=10&sort=true`).then(tickets => {
            setTickets(tickets.data)
            tickets.data.length<10? setHasMore(false):setHasMore(true);
            setPage(2)
          })
        } else {
          axios.get(`/api/tickets?page=1&limit=10&sort=false`).then(tickets => {
            setTickets(tickets.data)
            tickets.data.length<10? setHasMore(false):setHasMore(true);
            setPage(2)
          })
        }
    }});
    display !== false? setAllTickets(ticketsClone):setTickets(ticketsClone);
    display !== false? setLocalSort(!localSort):setServerSort(!serverSort);
  },[display,localSort,serverSort,allTickets,tickets])

  const displayedTickets = display !== false?  allTickets.filter((ticket) => !ticket.hide):tickets.filter((ticket) => !ticket.hide);
  const favoriteTickets = displayedTickets.filter((ticket) => Boolean(ticket.favorite));
  const doneTickets = displayedTickets.filter((ticket) => Boolean(ticket.done));
  const hideCounter =display !== false?  allTickets.length- displayedTickets.length:tickets.length - displayedTickets.length;
  const results = tickets.length;
  const favoriteResults = favoriteTickets.length;
  const doneResults = doneTickets.length;

  return (
    <main className="app">
      <div className="navbar">
        <h1>Tickets Manager</h1>
        <SearchInput searchFunc={searchFunc} value={valueOfInput} setValue={setValueOfInput} />
        <button
          className="favoritesDisplay"
          onClick={() => {setDisplay((prevdisplay)=>{if (prevdisplay ==='favorite'){searchFunc("",false); return false}searchFunc("",'favorite'); return 'favorite'}); setValueOfInput("")}}
        >
          {display === 'favorite'? (
            <>
              <i className="fa fa-star fa-2x" />
              <span className="toolTipFavorite">Display All</span>
            </>
          ) : (
            <>
              <i className="fa fa-star-o fa-2x" />
              <span className="toolTipFavorite">Display Favorites</span>
            </>
          )}
        </button>
        <button
          className="doneDisplay"
          onClick={() => {setDisplay((prevdisplay)=>{if (prevdisplay ==='done'){searchFunc("",false); return false}searchFunc("",'done'); return 'done'}); setValueOfInput("")}}
        >
          {display === 'done' ? (
            <>
              <i className="fa fa-minus-square fa-2x" />
              <span className="toolTipFavorite">Display All Tickets</span>
            </>
          ) : (
            <>
              <i className="fa fa-check-square fa-2x" />
              <span className="toolTipFavorite">Display Done Tickets</span>
            </>
          )}
        </button>
        <button onClick={()=>setPopUp(true)} className='newTicketButton'><i className="fa fa-plus-square fa-2x" aria-hidden="true"/>
        <span className="toolTipFavorite">Add New Ticket</span></button>
        <button onClick={()=> sortTicketsByDate() } className="sortButton"><i className="fa fa-calendar fa-2x" aria-hidden="true"/>
        <span className="toolTipFavorite">{'Sort by Date'}</span></button>
      </div>
      {popUp? <NewTicketPopUp setValueOfInput={setValueOfInput} func={setPopUp}
      setDisplay={setDisplay} setHasMore={setHasMore} setTickets={setTickets} 
      setPage={setPage} setAllTickets={setAllTickets}/>:null}
        <div className="hideTicketsCounter">
          <span>
            Showing
            {' '}
            <b>{display !== false ? display === 'favorite'? favoriteResults: doneResults : results}</b>
            {' '}
            Results
            {' '}
            out of
            {' '}
            <b>{display !== false ? display === 'favorite'? favoriteResults: doneResults :hasMore? allTickets.length:results}</b>
          </span>
          {hideCounter > 0 ? (
          <>(
          <span id="hideTicketsCounter">
            <b>{hideCounter}</b>
          </span>
          {' '}
          Hidden Tickets)
          <button id="restoreHideTickets" onClick={() => restoreTickets()}>
            restore
            {' '}
            <i className="fa fa-undo" aria-hidden="true" />
          </button>
          </>
          ) :(null)}
        </div>
      <TicketsList
        TicketListData={display !== false ? display==='favorite'? favoriteTickets: doneTickets : displayedTickets}
        hideFunc={hideTicket}
        favoriteFunc={favoriteTicket}
        doneFunc={doneTicket}
        loadMore={getTicketsFromServer}
        hasMore={hasMore}
        display={display}
      />
    </main>
  );
}

export default App;
