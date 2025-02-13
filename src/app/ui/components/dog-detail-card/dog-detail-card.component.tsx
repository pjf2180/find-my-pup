import React from "react";
import Image from "next/image";
type CardProps = {
  imageSrc: string;
  altText?: string;
  children?: React.ReactNode;
};

export function DogDetailCard({ imageSrc, altText = "", children }: CardProps) {
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
      <div className="absolute top-4 right-4 w-10 h-10 bg-red-400 rounded cursor-pointer" />

      {/* Content Section (Fixed Height) */}
      <div className="h-[35%]">
        {children}
      </div>
    </div>
  );
}
