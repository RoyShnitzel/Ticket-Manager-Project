import React from 'react';

function Label(props) {
  const data = props.label
  console.log (data)
  const displayData = data.map((label)=> {
      return <div key ={label} className='label'>{label}</div>
  })  
  return (
    <div>
    {displayData}
    </div>
  );
}

export default Label;