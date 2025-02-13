import { createContext, ReactNode, useState } from "react";
import { DogDetail } from "../hooks/useDogSearch.hook";

type FavoriteSetter = (dogId: DogDetail, isActive: boolean) => void;
interface FavoritesContextType {
  favorites: { [dogId: string]: DogDetail };
  set: FavoriteSetter;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: {},
  set: () => {},
});

export const FavoritesContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const set: FavoriteSetter = (dog: DogDetail, isActive: boolean) => {
    setContextValue((v) => {
      const dogId = dog.id;
      const nextFavorites = { ...v.favorites };
      if (isActive) {
        nextFavorites[dogId] = dog;
      } else {
        delete nextFavorites[dogId];
      }
      return { ...v, favorites: nextFavorites };
    });
  };
  const [contextValue, setContextValue] = useState<FavoritesContextType>({
    set,
    favorites: {},
  });

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};
