import React, { createContext, useState, useContext } from 'react';

// Create a context for the search string
const SearchContext = createContext();

// Custom hook for consuming the search context
export const useSearch = () => useContext(SearchContext);

// SearchProvider component to wrap the part of the app where you need access to searchString
export const SearchProvider = ({ children }) => {
  const [searchString, setSearchString] = useState('');

  return (
    <SearchContext.Provider value={{ searchString, setSearchString }}>
      {children}
    </SearchContext.Provider>
  );
};