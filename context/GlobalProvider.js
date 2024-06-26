import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [userGlobal, setGlobalUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLogged) {
      getCurrentUser()
        .then((res) => {
          if (res) {
            setGlobalUser(res);
          } else {
            setIsLogged(false);
            setGlobalUser(null);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isLogged]);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        userGlobal,
        setGlobalUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
