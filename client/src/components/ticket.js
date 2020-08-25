/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import Label from './label';
function Ticket(props) {
  const data = props.ticketData;
  const labelData = data.labels;
  const time = new Date(data.creationTime)
  const newTime = time.toString()
  console.log(newTime)
  return (
    <div className="ticket">
      <h4>{data.title}</h4>
      <div>{data.content}</div>
      <div>{data.userEmail}</div>
      <div>{newTime}</div>
      {labelData !== undefined ?<Label className='label' label={labelData}/>:null}
    </div>
  );
}

export default Ticket;
