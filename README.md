# VIVA - Volunteer Impact & Vitality Alliance

A community-focused volunteer organization website built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **React 19** with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **Framer Motion** - Animation library (respects prefers-reduced-motion)
- **React Router 7** - Client-side routing
- **Lucide React** - Beautiful icon library

## Quick Start

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VIVACodebase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Local: http://localhost:5173
   - The terminal will show the exact URL

   If port 5173 is in use, Vite will automatically use the next available port (5174, 5175, etc.)

5. **To expose on network** (for testing on other devices)
   ```bash
   npm run dev -- --host
   ```

### Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── blocks/          # Reusable page sections (Hero, StatCard, etc.)
│   ├── layout/          # Layout components (Header, Footer, Layout)
│   └── ui/              # UI primitives (Button, Card, Badge, etc.)
├── data/
│   └── mockData.ts      # Mock data for all pages
├── hooks/
│   └── useReducedMotion.ts  # Accessibility hook
├── pages/               # Route pages
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Events.tsx
│   ├── Volunteer.tsx
│   ├── Contact.tsx
│   ├── Donate.tsx
│   └── ...
├── types/
│   └── index.ts         # TypeScript interfaces
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point
```

## Available Routes

- `/` - Home page
- `/about` - About VIVA
- `/about/board` - Board of Executives
- `/about/awards` - Awards & Scholarships
- `/about/reports` - Annual Reports
- `/events` - Upcoming events
- `/events/calendar` - Calendar view
- `/events/past` - Past events
- `/events/:slug` - Event detail page
- `/volunteer` - Volunteer information and application
- `/contact` - Contact information
- `/donate` - Donation page

## Design System

### Colors
- **Primary**: Green/Teal (`primary-50` to `primary-950`)
- **Accent**: Orange/Amber (`accent-50` to `accent-950`)
- **Neutrals**: Gray scale

### Components
- Glassmorphism cards (`.glass-card`)
- Gradient heroes (`.gradient-hero`)
- Soft shadows (`.shadow-soft`, `.shadow-soft-lg`)
- Responsive grid layouts

### Typography
- **Sans**: Inter
- **Display**: Manrope
- Custom display sizes for large headings

## Development Guidelines

### Adding a New Page

1. Create the page component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Update navigation in `src/components/layout/Header.tsx` if needed

### Adding Mock Data

1. Define TypeScript interface in `src/types/index.ts`
2. Add mock data in `src/data/mockData.ts`
3. Import and use in your components

### Styling

- Use Tailwind utility classes
- Custom classes are in `src/index.css`
- Follow existing patterns for consistency
- Always respect `prefers-reduced-motion` for animations

### Code Style

- ESLint configured for React + TypeScript
- Run `npm run lint` to check for issues
- Use default exports for pages
- Use named exports for utility components

## Common Issues

### White/Blank Page
- Check browser console (F12) for JavaScript errors
- Ensure all imports use correct export types (`default` vs `named`)
- TypeScript types should use `import type` syntax

### Styles Not Applying
- Make sure Tailwind classes are in the `content` array in `tailwind.config.cjs`
- Restart the dev server after config changes
- Check for typos in class names

### Port Already in Use
- Vite will automatically find an available port
- Or manually specify: `npm run dev -- --port 3000`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally with `npm run dev`
4. Run `npm run lint` to check for issues
5. Submit a pull request

## License

This project is proprietary to VIVA organization.
