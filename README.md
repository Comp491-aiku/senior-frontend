# AIKU Frontend

AI-powered travel planning application frontend built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Maps**: Mapbox / Google Maps
- **Charts**: Recharts
- **HTTP Client**: Axios

## Features

- 🎯 Trip planning with AI-powered recommendations
- 📅 Interactive itinerary builder with day-by-day schedules
- 🗺️ Map integration for visualizing locations
- 💰 Budget tracking and cost management
- 🌤️ Weather forecasts for travel dates
- ✈️ Flight and accommodation search
- 🎨 Modern, responsive UI with dark mode support

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── layout.tsx         # Root layout
│   │   ├── providers.tsx      # App providers
│   │   └── trip/              # Trip-related pages
│   │       ├── create/        # Create trip page
│   │       └── [id]/          # Trip details page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── TripForm.tsx      # Trip creation form
│   │   ├── ItineraryView.tsx # Itinerary display
│   │   ├── MapView.tsx       # Map component
│   │   └── BudgetTracker.tsx # Budget tracking
│   ├── hooks/                # Custom React hooks
│   │   ├── useTripPlanner.ts
│   │   └── useItinerary.ts
│   ├── services/             # API clients
│   │   └── api.ts           # Backend API client
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── lib/                 # Utility functions
│   │   └── utils.ts
│   └── utils/               # Helper functions
├── public/                   # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── .env.local               # Environment variables
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running (see backend README)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox API token | No |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | No |

## Key Components

### TripForm
Form component for creating and editing trips with destination, dates, budget, and preferences.

### ItineraryView
Displays the complete trip itinerary with day-by-day breakdown of activities, meals, and accommodations.

### BudgetTracker
Real-time budget tracking component showing spent vs. total budget with visual progress indicator.

### MapView
Interactive map showing trip locations and routes (requires Mapbox or Google Maps API key).

## API Integration

The frontend communicates with the FastAPI backend through the API client in `src/services/api.ts`.

Key endpoints:
- `GET /api/trips` - List all trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get trip details
- `POST /api/trips/:id/itinerary/generate` - Generate itinerary
- `GET /api/flights/search` - Search flights
- `GET /api/accommodations/search` - Search accommodations

## Styling

This project uses Tailwind CSS with shadcn/ui components. The design system is configured in:
- `tailwind.config.ts` - Tailwind configuration
- `src/app/globals.css` - Global styles and CSS variables

## Type Safety

All API responses and component props are fully typed using TypeScript interfaces defined in `src/types/index.ts`.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT
