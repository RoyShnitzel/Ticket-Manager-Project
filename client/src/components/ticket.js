/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import Label from './label';
function Ticket(props) {
  const data = props.ticketData;
  const labelData = data.labels;
  const time = new Date(data.creationTime)
  const newTime = time.toUTCString().replace('GMT','').slice(4)
  console.log(newTime)
  return (
    <div className="ticket">
      <div className='ticketheader'><b>{data.title}</b></div>
      <div className='ticketbody'>{data.content}</div>
      <div className='ticketFooter'>
      <div className='emailAndTime'>
      <span >{data.userEmail} |</span>
      <span>{newTime}</span>
      </div>
      {labelData !== undefined ?<Label className='label' label={labelData}/>:null}
      </div>
    </div>
  );
}

export default Ticket;
