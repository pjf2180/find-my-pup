export default function SearchSkeleton() {
    return (
      <div className="w-full flex items-center justify-between p-4 bg-[#120B26]">
        {/* Sort By and Direction */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="h-4 w-12 bg-gray-700 rounded mb-1 animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-700 rounded-md animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <div className="h-4 w-16 bg-gray-700 rounded mb-1 animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-700 rounded-md animate-pulse"></div>
          </div>
        </div>
  
        {/* Found Dogs Count */}
        <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
  
        {/* Button */}
        <div className="h-10 w-40 bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
    );
  }
  