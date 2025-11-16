import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  imageUrl?: string;
}

export function TestimonialCard({ quote, author, role, imageUrl }: TestimonialCardProps) {
  return (
    <div className="glass-card-strong p-8 rounded-2xl shadow-glass relative overflow-hidden">
      {/* Decorative quote mark */}
      <div className="absolute top-4 right-4 opacity-10">
        <Quote className="w-16 h-16 text-primary-600" />
      </div>

      {/* Quote text */}
      <blockquote className="relative z-10 mb-6">
        <p className="text-gray-700 text-lg leading-relaxed italic">"{quote}"</p>
      </blockquote>

      {/* Author info */}
      <div className="flex items-center gap-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={author}
            className="w-14 h-14 rounded-full object-cover border-2 border-primary-100"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xl">
            {author.charAt(0)}
          </div>
        )}
        <div>
          <div className="font-semibold text-gray-900">{author}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>

      {/* Decorative gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-200/20 to-accent-200/20 pointer-events-none" />
    </div>
  );
}
