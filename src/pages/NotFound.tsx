import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-warm-50 px-8 py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow">404</p>
        <h1 className="font-display text-3xl font-extrabold text-warm-900">Page Not Found</h1>
        <p className="mt-3 text-sm leading-relaxed text-warm-600">
          The page may have moved, been unpublished, or the address may be incorrect.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/events" className="rounded-lg border border-warm-200 bg-white px-5 py-2.5 text-sm font-bold text-warm-700 hover:bg-warm-100">
            View Events
          </Link>
        </div>
      </div>
    </div>
  );
}
