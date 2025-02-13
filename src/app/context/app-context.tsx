"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { FavoritesContextProvider } from "./favorites.context";

// Define the shape of the context data
interface AppContextType {
  user: string | null;
  setUser: (user: string | null) => void;
}

// Create the context with default values
const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to consume context safely
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <FavoritesContextProvider>{children}</FavoritesContextProvider>
    </AppContext.Provider>
  );
};
