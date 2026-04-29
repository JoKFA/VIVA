/**
 * LoadingSkeleton — shared shimmer placeholders for data-fetching states.
 *
 * Usage:
 *   <LoadingSkeleton lines={3} />          // stacked text lines
 *   <LoadingSkeleton variant="card" />     // card block
 *   <LoadingSkeleton variant="circle" />   // avatar circle
 */

interface LoadingSkeletonProps {
  variant?: 'lines' | 'card' | 'circle';
  lines?: number;
  className?: string;
}

const shimmer = 'animate-pulse bg-gray-200 rounded';

export function LoadingSkeleton({
  variant = 'lines',
  lines = 3,
  className = '',
}: LoadingSkeletonProps) {
  if (variant === 'circle') {
    return <div className={`${shimmer} rounded-full w-12 h-12 ${className}`} />;
  }

  if (variant === 'card') {
    return (
      <div className={`${shimmer} h-48 w-full ${className}`} />
    );
  }

  // Default: stacked lines
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${shimmer} h-4`}
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

/** Full-page loading state — used while SiteSettings or critical data loads */
export function PageLoadingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 space-y-8">
      <LoadingSkeleton lines={2} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <LoadingSkeleton key={i} variant="card" />)}
      </div>
      <LoadingSkeleton lines={4} />
    </div>
  );
}
