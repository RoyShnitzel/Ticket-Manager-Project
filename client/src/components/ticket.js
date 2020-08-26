/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import Label from './label';
function Ticket(props) {
  const data = props.ticketData;
  const labelData = data.labels;
  const ticketId= data.id;
  const time = new Date(data.creationTime)
  const newTime = time.toUTCString().replace('GMT','').slice(4)
  const favorite = data.favorite;

  return (
    <div className="ticket">
      <button className='favoriteButton' onClick={()=>props.favoriteFunc(ticketId, favorite)}>{favorite? <i class="fa fa-times" aria-hidden="true"></i>:<i className='fa fa-star'></i>}</button>
      <div className='flexheader'>
      <div className='ticketheader'><b>{data.title}</b></div>
      <button className='hideTicketButton' id='hideTicketButton' onClick={()=>props.hideFunc(ticketId)}><i className="fa fa-eye-slash fa-lg" aria-hidden="true"></i></button>
      </div>
      <div className='ticketbody'>{data.content}</div>
      <div className='ticketFooter'>
      <div className='emailAndTime'>
      <span>{data.userEmail} |</span>
      <span>{newTime}</span>
      </div>
      {labelData !== undefined ?<Label className='label' label={labelData}/>:null}
      </div>
    </div>
  );
}

export default Ticket;
