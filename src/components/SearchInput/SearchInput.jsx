import React from 'react'

const SearchInput = ({ searchTerm, onSearch }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Finn stoppested"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="p-3 text-lg border border-gray-300 rounded w-full"
      />
    </div>
  );
};

export default SearchInput