import React from 'react';


function SearchInput(props) {
const onSearch= props.func

  return (
    <div className='search'><i className="fa fa-search"></i><input  onChange={(e)=> onSearch(e.target.value)} id='searchInput'/></div>
  );
}

export default SearchInput;
