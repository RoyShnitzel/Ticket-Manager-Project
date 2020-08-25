import React from 'react';

function Label(props) {
  const data = props.label
  console.log (data)
  const displayData = data.map((label)=> {
      return <span key ={label} className='label'>#{label}</span>
  })  
  return (
    <span>
    {displayData}
    </span>
  );
}

export default Label;