import { Skeleton } from "../ui/skeleton";

export default function RecipeLandingPageSkeleton() {
  return (
    <>
      <section className="relative py-10 px-5 md:py-20 md:px-30 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-8">
                <h1 className="text-4xl lg:text-6xl font-bold space-y-3 text-gray-800 leading-tight">
                  <Skeleton className="w-80 h-10 bg-slate-300" />
                  <span className="text-orange-500 block">
                    <Skeleton className="w-62 h-10  bg-slate-300" />
                  </span>
                </h1>
                <p className="text-xl text-gray-600 space-y-3 leading-relaxed">
                  <Skeleton className="w-72 h-5  bg-slate-300" />
                  <Skeleton className="w-66 h-5  bg-slate-300" />
                  <Skeleton className="w-60 h-5  bg-slate-300" />
                  <Skeleton className="w-72 h-5  bg-slate-300" />
                  <Skeleton className="w-48 h-5  bg-slate-300" />
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="w-full h-12  bg-slate-300" />
                <Skeleton className="w-full h-12  bg-slate-300" />
              </div>
              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-40 h-6  bg-slate-300" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-40 h-6  bg-slate-300" />
                </div>
              </div>
            </div>
            <div className="relative">
              <Skeleton className="w-full h-60 bg-slate-300" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
