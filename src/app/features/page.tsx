import Link from 'next/link'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Globe,
  Zap,
  Shield,
  Clock,
  Users,
  Star,
  TrendingUp,
  Bell,
} from 'lucide-react'

export default function FeaturesPage() {
  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4">Features</Badge>
          <h1 className="text-5xl font-bold mb-4">Everything You Need to Plan the Perfect Trip</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive suite of AI-powered features makes travel planning effortless
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <CardTitle>AI-Powered Itinerary Generation</CardTitle>
              <CardDescription>
                Our intelligent AI agents analyze millions of data points to create personalized
                itineraries in minutes, not hours.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <DollarSign className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Smart Budget Optimization</CardTitle>
              <CardDescription>
                Automatically optimize your spending with intelligent recommendations that maximize value
                within your budget constraints.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Calendar className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Flexible Scheduling</CardTitle>
              <CardDescription>
                Adaptive scheduling that respects your pace, whether you prefer a relaxed vacation or an
                action-packed adventure.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <MapPin className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Local Recommendations</CardTitle>
              <CardDescription>
                Discover hidden gems and popular attractions with insights from local data sources and
                traveler reviews.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Globe className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Real-Time Weather Integration</CardTitle>
              <CardDescription>
                Plan activities based on accurate weather forecasts and receive suggestions for weather-
                appropriate alternatives.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Instant Updates</CardTitle>
              <CardDescription>
                Get real-time notifications about flight changes, weather alerts, and local events that
                might affect your plans.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Secure Booking Links</CardTitle>
              <CardDescription>
                Direct links to trusted booking platforms with secure connections for flights, hotels, and
                activities.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Clock className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Time Zone Management</CardTitle>
              <CardDescription>
                Automatically handle time zones and daylight saving changes to ensure accurate scheduling
                across borders.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Group Travel Support</CardTitle>
              <CardDescription>
                Coordinate trips for multiple travelers with shared itineraries and collaborative planning
                features.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Star className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>
                AI learns from your preferences to provide increasingly accurate suggestions for future
                trips.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Price Tracking</CardTitle>
              <CardDescription>
                Monitor price changes for flights and accommodations and get alerts when prices drop.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Bell className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Smart Notifications</CardTitle>
              <CardDescription>
                Receive timely reminders for bookings, check-ins, and activities so you never miss a thing.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="p-12 bg-gradient-to-br from-primary/10 to-purple-500/10">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience These Features?</h2>
            <p className="text-xl text-muted-foreground mb-6">
              Start planning your perfect trip today with AIKU&apos;s AI-powered platform
            </p>
            <Link href="/trip/plan" className="inline-block">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors">
                Get Started Free
              </button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
