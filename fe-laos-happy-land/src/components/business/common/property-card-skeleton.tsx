"use client";

interface PropertyCardSkeletonProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

export default function PropertyCardSkeleton({
  className = "",
  size = "medium",
}: PropertyCardSkeletonProps) {
  const getCardPadding = () => {
    switch (size) {
      case "small":
        return "p-3";
      case "large":
        return "p-5";
      default:
        return "p-4";
    }
  };

  const getImageHeight = () => {
    switch (size) {
      case "small":
        return "h-32";
      case "large":
        return "h-48";
      default:
        return "h-40";
    }
  };

  return (
    <div
      className={`flex h-full flex-col rounded-xl bg-white shadow-sm ${className}`}
    >
      {/* Image skeleton */}
      <div
        className={`${getImageHeight()} w-full animate-pulse rounded-t-xl bg-gray-200`}
      />

      {/* Content skeleton */}
      <div className={`flex flex-1 flex-col ${getCardPadding()}`}>
        {/* Title skeleton */}
        <div
          className="mb-3 h-4 w-3/4 animate-pulse rounded bg-gray-200"
          style={{
            minHeight:
              size === "small"
                ? "2.5rem"
                : size === "large"
                  ? "3.5rem"
                  : "3rem",
          }}
        />

        {/* Description skeleton */}
        <div className="mb-3 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Price skeleton */}
        <div className="mb-4 h-5 w-1/2 animate-pulse rounded bg-gray-200" />

        {/* Location and area skeleton */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Property details skeleton */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-8 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-8 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Footer skeleton - Push to bottom */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
