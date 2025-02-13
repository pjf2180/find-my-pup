import React, { useContext } from "react";
import Image from "next/image";
import HeartButton from "../heart-button/heart-button";
import { FavoritesContext } from "@/app/context/favorites.context";
import { DogDetail } from "@/app/hooks/useDogSearch.hook";

type CardProps = {
  dog: DogDetail;
  imageSrc: string;
  altText?: string;
  children?: React.ReactNode;
};

export function DogDetailCard({
  dog,
  imageSrc,
  altText = "",
  children,
}: CardProps) {
  const { set, favorites } = useContext(FavoritesContext);

  const dogIsActive: boolean = favorites[dog.id] != undefined;

  return (
    <div className="relative w-80 h-96 bg-white shadow-lg rounded-xl overflow-hidden flex flex-col">
      {/* Image "Window" */}
      <div className="relative w-full h-[65%] overflow-hidden">
        <Image
          src={imageSrc}
          alt={altText}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>

      {/* Top Right Square */}
      <div className="absolute top-4 right-4 w-fit cursor-pointer">
        <HeartButton
          active={dogIsActive}
          onChange={(isActive: boolean) => {
            console.log("changed to: ", isActive, dog.id);
            set(dog, isActive);
          }}
        />
      </div>

      {/* Content Section (Fixed Height) */}
      <div className="h-[35%]">{children}</div>
    </div>
  );
}
