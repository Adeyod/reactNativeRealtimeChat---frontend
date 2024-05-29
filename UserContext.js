import React, { useState, createContext } from 'react';

const UserType = createContext(null);

const UserContext = ({ children }) => {
  const [userObject, setUserObject] = useState(null);
  return (
    <UserType.Provider value={{ userObject, setUserObject }}>
      {children}
    </UserType.Provider>
  );
};

export { UserContext, UserType };
