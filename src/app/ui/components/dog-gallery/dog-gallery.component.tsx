import { DogDetail } from "@/app/hooks/useDogSearch.hook";
import { DogDetailCard } from "../dog-detail-card/dog-detail-card.component";

interface DogGalleryProps {
  dogs: DogDetail[];
}
export function DogGallery({ dogs }: DogGalleryProps) {
  return (
    <div className="grid gap-4 justify-center md:grid-cols-[320px_320px] lg:grid-cols-[320px_320px_320px]">
      {dogs?.map((dog) => (
        <DogDetailCard
          key={dog.id}
          dog={dog}
          imageSrc={dog.img}
          altText={`A ${dog.breed} called ${dog.name}`}
        />
      ))}
    </div>
  );
}
