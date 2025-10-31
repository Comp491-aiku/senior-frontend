import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Plane,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Users,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Check
} from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="w-fit">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered Travel Planning
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Plan Your Perfect Trip with{' '}
                <span className="text-primary">AI Intelligence</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl">
                Let our advanced AI agents create personalized itineraries tailored to your preferences,
                budget, and travel style. Experience smarter travel planning.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/trip/create">
                  <Button size="lg" className="text-lg h-12 px-8">
                    Start Planning
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="text-lg h-12 px-8">
                    See How It Works
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-semibold"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">10,000+ travelers</div>
                    <div className="text-muted-foreground">planned their trips</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl" />
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Trip to Paris</CardTitle>
                    <Badge>Confirmed</Badge>
                  </div>
                  <CardDescription>7 days • 2 travelers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Plane className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Flight to Paris</p>
                        <p className="text-sm text-muted-foreground">Mon, Dec 15 • 10:30 AM</p>
                      </div>
                      <Check className="h-5 w-5 text-green-500" />
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Visit Eiffel Tower</p>
                        <p className="text-sm text-muted-foreground">Tue, Dec 16 • 2:00 PM</p>
                      </div>
                      <Check className="h-5 w-5 text-green-500" />
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Louvre Museum Tour</p>
                        <p className="text-sm text-muted-foreground">Wed, Dec 17 • 10:00 AM</p>
                      </div>
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-muted-foreground">Total Budget</span>
                    <span className="text-2xl font-bold">$2,450</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need for Perfect Travel Planning
            </h2>
            <p className="text-xl text-muted-foreground">
              Powered by advanced AI agents that work together to create your ideal itinerary
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Sparkles className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI-Powered Planning</CardTitle>
                <CardDescription>
                  Our intelligent agents analyze millions of data points to create the perfect itinerary for you
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Smart Budget Optimization</CardTitle>
                <CardDescription>
                  Get the best value with automatic budget optimization and cost-effective recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Flexible Scheduling</CardTitle>
                <CardDescription>
                  Intelligent scheduling that adapts to your pace, interests, and travel style preferences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Local Recommendations</CardTitle>
                <CardDescription>
                  Discover hidden gems and popular attractions with insights from local data sources
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Real-Time Weather</CardTitle>
                <CardDescription>
                  Plan activities based on accurate weather forecasts and seasonal recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Instant Updates</CardTitle>
                <CardDescription>
                  Get real-time updates on flight changes, weather alerts, and local events
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4">How It Works</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Plan Your Trip in 3 Simple Steps
            </h2>
            <p className="text-xl text-muted-foreground">
              Our AI agents handle the complexity while you enjoy the simplicity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute top-8 left-8 -z-10 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <CardTitle>Share Your Preferences</CardTitle>
                  <CardDescription>
                    Tell us your destination, dates, budget, and interests. Our AI learns your travel style.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute top-8 right-8 -z-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <CardTitle>AI Creates Your Itinerary</CardTitle>
                  <CardDescription>
                    Watch as our specialized agents work together to craft your perfect trip in minutes.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute top-8 left-8 -z-10 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <CardTitle>Travel with Confidence</CardTitle>
                  <CardDescription>
                    Get a detailed day-by-day plan with bookings, maps, and real-time updates.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-primary-foreground/80">Happy Travelers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">150+</div>
              <div className="text-primary-foreground/80">Countries Covered</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-primary-foreground/80">Itineraries Created</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4.9★</div>
              <div className="text-primary-foreground/80">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="py-20 md:py-32 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4">Our AI Agents</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Meet Your Personal Travel Team
            </h2>
            <p className="text-xl text-muted-foreground">
              5 specialized AI agents working together to create your perfect itinerary
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Orchestrator</CardTitle>
                <CardDescription>
                  Coordinates all agents to create the perfect plan
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Plane className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Flight Agent</CardTitle>
                <CardDescription>
                  Finds best flight options and prices
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Hotel Agent</CardTitle>
                <CardDescription>
                  Recommends perfect accommodations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Activity Agent</CardTitle>
                <CardDescription>
                  Plans activities based on interests
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Weather Agent</CardTitle>
                <CardDescription>
                  Provides accurate weather forecasts
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10" />
            <CardHeader className="relative text-center py-16">
              <CardTitle className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Start Your Adventure?
              </CardTitle>
              <CardDescription className="text-xl mb-8">
                Join thousands of travelers who trust AIKU for their trip planning
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/trip/create">
                  <Button size="lg" className="text-lg h-12 px-8">
                    Create Your Free Trip
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="text-lg h-12 px-8">
                    Learn More About Us
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  )
}
