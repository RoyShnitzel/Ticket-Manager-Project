/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';

function Ticket(props) {
  const data = props.ticketData;
  return (
    <div>
      <div>{data.title}</div>
      <div>{data.content}</div>
      <div>{data.userEmail}</div>
      <div>{data.creationTime}</div>

    </div>
  );
}

export default Ticket;
