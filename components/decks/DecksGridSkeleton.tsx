import { Card, CardContent } from "@/components/ui/card";

export default function DecksGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="hover:shadow-lg transition-shadow duration-200 bg-white">
          <CardContent className="p-6">
            {/* Header skeleton */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Progress stats skeleton */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse" />
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
              </div>
            </div>

            {/* Button skeleton */}
            <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

