import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold tracking-tight">
            Welcome to <span className="text-primary">AIKU</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered travel companion. Create personalized itineraries with smart recommendations
            for flights, accommodations, activities, and more.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/trip/create">
              <Button size="lg" className="text-lg px-8">
                Start Planning
              </Button>
            </Link>
            <Link href="/trip">
              <Button size="lg" variant="outline" className="text-lg px-8">
                View My Trips
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Smart Planning</h3>
            <p className="text-muted-foreground">
              AI-powered recommendations based on your preferences, budget, and schedule
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
            <p className="text-muted-foreground">
              Get live weather forecasts, flight updates, and local event information
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Detailed Itineraries</h3>
            <p className="text-muted-foreground">
              Hour-by-hour schedules with maps, directions, and booking options
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
