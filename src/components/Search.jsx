import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className='search'>
      <div>
        <img src="./search.svg" alt="Search" />
        <input 
          type="text"
          placeholder='Search for a movie...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <h3 className='text-white'>{searchTerm}</h3>
    </div>
  )
}

export default Search