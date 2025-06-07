import { Skeleton } from "@/components/ui/skeleton";

const ViewAllRecipesSkeleton = ({
  viewMode,
}: {
  viewMode: "grid" | "list";
}) => {
  const skeletonCount = 4;

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          : "space-y-6 mb-8"
      }
    >
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <div
          key={i}
          className={`group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm rounded-lg ${
            viewMode === "list" ? "flex flex-row" : ""
          }`}
        >
          <div
            className={`relative overflow-hidden ${
              viewMode === "list" ? "w-48 flex-shrink-0" : "rounded-t-lg"
            }`}
          >
            <Skeleton
              className={`object-cover bg-slate-200 ${
                viewMode === "list" ? "w-48 h-32" : "w-full h-48"
              }`}
            />
            <div className="absolute top-4 right-4">
              <Skeleton className="h-6 w-12 rounded-full bg-slate-200" />
            </div>
            <div className="absolute top-4 left-4">
              <Skeleton className="h-6 w-6 rounded-full bg-slate-200" />
            </div>
          </div>
          <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20 rounded-full bg-slate-200" />
                <Skeleton className="h-6 w-16 rounded-full bg-slate-200" />
              </div>
              <Skeleton className="h-6 w-3/4 bg-slate-200" />
              <Skeleton className="h-4 w-full bg-slate-200" />
              <Skeleton className="h-4 w-5/6 bg-slate-200" />
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-12 bg-slate-200" />
                  <Skeleton className="h-4 w-12 bg-slate-200" />
                </div>
                <Skeleton className="h-4 w-16 bg-slate-200" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-4 w-24 bg-slate-200" />
                <Skeleton className="h-8 w-24 rounded-md bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewAllRecipesSkeleton;
