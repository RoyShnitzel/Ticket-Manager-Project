/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Ticket from './ticket';

function TicketsList(props) {
  function makeTicketsList(data) {
    const list = data.map((ticket) => <Ticket ticketData={ticket} />);
    return list;
  }
  const newData = props.data;
  return (
    <main>
      {makeTicketsList(newData)}
    </main>
  );
}

export default TicketsList;
