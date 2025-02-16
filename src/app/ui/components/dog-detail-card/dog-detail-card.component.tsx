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

export function DogDetailCard({ dog, imageSrc, altText = "" }: CardProps) {
  const { set, favorites } = useContext(FavoritesContext);

  const dogIsActive: boolean = favorites[dog.id] != undefined;

  return (
    <div className="relative w-80 h-96 rounded-xl bg-white overflow-hidden flex flex-col">
      {/* Image "Window" */}
      <div className="relative w-full h-[65%] rounded-xl overflow-hidden">
        <Image
          src={imageSrc}
          alt={altText}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>

      {/* Top Right Square */}
      <div className="absolute top-3 right-3 w-fit cursor-pointer">
        <HeartButton
          active={dogIsActive}
          onChange={(isActive: boolean) => {
            console.log("changed to: ", isActive, dog.id);
            set(dog, isActive);
          }}
        />
      </div>

      {/* Content Section (Fixed Height) */}
      <div className="h-[35%]">
        <div className="h-full flex flex-col items-center  pt-4 justify-between">
          <div className="self-start flex flex-col gap-1">
            {" "}
            <p className="font-bold text-xl self-start">{dog.name}</p>
            <p className="font-semibold text-sm text-gray-400 self-start">
              {dog.breed}
            </p>
            <p className="font-normal text-sm text-gray-400 self-start">
              {" "}
              {`${dog.age} year${dog.age > 1 ? "s" : ""}`}
            </p>
            <p className="font-medium text-sm text-gray-500">
              {`${dog.location.city}, ${dog.location.state} ${dog.zip_code}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
