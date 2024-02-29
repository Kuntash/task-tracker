import { createContext, useContext } from "react";

export const UserContext = createContext({
  id: "",
});

export const UserContextProvider = UserContext.Provider;
export const useUserContext = () => useContext(UserContext);
