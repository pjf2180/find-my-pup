import { DogDetail } from "@/app/api/endpoints/dogs/dog-details.endpoint";
import { DogDetailCard } from "../dog-detail-card/dog-detail-card.component";

interface DogGalleryProps {
  isLoading: boolean;
  dogs: DogDetail[];
}

export function DogGallery({ dogs, isLoading }: DogGalleryProps) {
  return (
    <div className="w-screen flex p-4">
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(320px,320px))] place-content-center auto-rows-auto w-full">
        {isLoading &&
          new Array(10)
            .fill(0)
            .map((_, i) => <DogDetailCardSkeleton key={i} />)}
        {!isLoading &&
          dogs?.map((dog) => (
            <DogDetailCard
              key={dog.id}
              dog={dog}
              imageSrc={dog.img}
              altText={`A ${dog.breed} called ${dog.name}`}
            />
          ))}
      </div>
    </div>
  );
}

export function DogDetailCardSkeleton() {
  return (
    <div className="relative w-80 h-96 rounded-xl bg-white overflow-hidden flex flex-col animate-pulse">
      {/* Image "Window" */}
      <div className="relative w-full h-[65%] bg-gray-300 animate-pulse"></div>

      {/* Content Section */}
      <div className="h-[35%] p-4 flex flex-col gap-2">
        <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 w-1/3 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
