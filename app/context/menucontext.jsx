"use client";
import { createContext, useContext, useState } from "react";

const MenuContext = createContext(null);

export const MenuProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  return (
    <MenuContext.Provider value={{ items, setItems }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
