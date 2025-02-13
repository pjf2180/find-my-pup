import { DogDetail } from "@/app/hooks/useDogSearch.hook";
import { DogDetailCard } from "../dog-detail-card/dog-detail-card.component";

interface DogGalleryProps {
  dogs: DogDetail[];
}
export function DogGallery({ dogs }: DogGalleryProps) {
  return (
    <div className="grid gap-4 justify-center md:grid-cols-[320px_320px] lg:grid-cols-[320px_320px_320px] ">
      {dogs?.map((dog) => (
        <DogDetailCard
          key={dog.id}
          dog={dog}
          imageSrc={dog.img}
          altText={`A ${dog.breed} called ${dog.name}`}
        >
          <div className="h-full flex flex-col items-center  p-4 justify-between">
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
            </div>
            <p className="font-light text-sm text-gray-400 self-end">
              {dog.zip_code}
            </p>
          </div>
        </DogDetailCard>
      ))}
    </div>
  );
}
