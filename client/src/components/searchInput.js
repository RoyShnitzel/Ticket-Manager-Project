import React from 'react';


function SearchInput(props) {
const onSearch= props.func

  return (
    <input placeholder='Search...' onChange={(e)=> onSearch(e.target.value)} id='searchInput'/>
  );
}

export default SearchInput;
