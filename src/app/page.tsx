import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  MessageSquare,
  Zap,
  Users,
  CheckCircle2,
  ArrowRight,
  Mic,
  Globe,
  Calendar,
  DollarSign,
  MapPin,
  Star,
  Shield,
  Lock,
  Award
} from 'lucide-react'
import { TypeWriter } from '@/components/TypeWriter'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { FadeInSection } from '@/components/FadeInSection'
import { ParallaxCard } from '@/components/ParallaxCard'
import { TestimonialCard } from '@/components/TestimonialCard'
import { DestinationCard } from '@/components/DestinationCard'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Focused on Chat Interface */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
        {/* Background decoration - Enhanced */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container">
          <div className="max-w-6xl mx-auto">
            <FadeInSection className="text-center mb-12">
              <Badge className="mb-6 text-base px-4 py-2 animate-bounce">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Travel Planning
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-pink-600 animate-gradient">
                  Plan Your Trip to{' '}
                </span>
                <br />
                <TypeWriter
                  texts={['Paris', 'Tokyo', 'Bali', 'New York', 'Dubai', 'Rome']}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-primary"
                />
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Talk to our AI or type your dream trip. Our intelligent agents will plan everything -
                flights, hotels, activities, and more.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/trip/plan">
                  <Button size="lg" className="text-lg h-14 px-8 gap-2 group">
                    <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    Start Planning Now
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="text-lg h-14 px-8 hover:scale-105 transition-transform">
                    See How It Works
                  </Button>
                </Link>
              </div>

              {/* Trust indicators - Enhanced with AnimatedCounter */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Free to plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AnimatedCounter end={15} suffix="K+ trips planned" className="font-semibold" />
                </div>
              </div>
            </FadeInSection>

            {/* Hero Demo - Chat Interface Preview - Enhanced */}
            <FadeInSection delay={200} className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl -z-10 animate-pulse" />

              <ParallaxCard>
                <Card className="p-6 backdrop-blur-sm bg-background/95 border-2 shadow-2xl">
                  <div className="space-y-4">
                    {/* Example chat messages */}
                    <div className="flex gap-3 animate-fade-in">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-muted rounded-2xl rounded-tl-none p-4 hover:scale-[1.02] transition-transform">
                          <p className="text-sm">
                            "I want to visit Paris for 5 days in December with my partner.
                            Budget around $3000. We love museums and good food."
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 ml-1">You</p>
                      </div>
                    </div>

                    <div className="flex gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Sparkles className="h-5 w-5 text-primary-foreground animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl rounded-tl-none p-4 border border-primary/20 hover:scale-[1.02] transition-transform">
                          <p className="text-sm font-medium mb-2">Perfect! I'm planning your Paris trip...</p>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              <span>✓ Found 12 flights within budget</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              <span>✓ 8 romantic hotels in central Paris</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                              <span>⟳ Planning museum visits...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                              <span>⟳ Finding best restaurants...</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 ml-1">AI Assistant</p>
                      </div>
                    </div>

                    {/* Input area preview */}
                    <div className="flex gap-2 pt-2">
                      <div className="flex-1 bg-muted rounded-full px-4 py-3 flex items-center gap-2 hover:bg-muted/80 transition-colors cursor-pointer">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Type your message or click to speak...
                        </span>
                      </div>
                      <Button size="icon" className="rounded-full h-12 w-12 hover:scale-110 transition-transform">
                        <Mic className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </ParallaxCard>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Key Features - How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How AIKU Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to your perfect trip
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FadeInSection delay={100}>
              <ParallaxCard>
                <Card className="p-8 text-center relative overflow-hidden h-full hover:shadow-2xl transition-shadow">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                  <div className="relative">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 hover:scale-110 transition-transform">
                      <MessageSquare className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">1. Tell Us Your Dream</h3>
                    <p className="text-muted-foreground">
                      Talk or type naturally. "I want a beach vacation in Thailand" or
                      "Weekend trip to New York for shopping"
                    </p>
                  </div>
                </Card>
              </ParallaxCard>
            </FadeInSection>

            <FadeInSection delay={200}>
              <ParallaxCard>
                <Card className="p-8 text-center relative overflow-hidden h-full hover:shadow-2xl transition-shadow">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                  <div className="relative">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 hover:scale-110 transition-transform">
                      <Zap className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">2. AI Plans Everything</h3>
                    <p className="text-muted-foreground">
                      Watch our 5 AI agents work together - finding flights, hotels,
                      activities, checking weather, and optimizing your budget
                    </p>
                  </div>
                </Card>
              </ParallaxCard>
            </FadeInSection>

            <FadeInSection delay={300}>
              <ParallaxCard>
                <Card className="p-8 text-center relative overflow-hidden h-full hover:shadow-2xl transition-shadow">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                  <div className="relative">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">3. Edit & Book</h3>
                    <p className="text-muted-foreground">
                      Review, modify, share with friends, find alternatives,
                      or let AI book everything automatically
                    </p>
                  </div>
                </Card>
              </ParallaxCard>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <FadeInSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-muted-foreground">
              Start planning your dream trip to these amazing destinations
            </p>
          </FadeInSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <FadeInSection delay={100}>
              <DestinationCard
                name="Paris"
                country="France"
                image="/destinations/paris.jpg"
                price="From $1,200"
                duration="5-7 days"
                description="The City of Light awaits with iconic landmarks, world-class museums, and romantic cafes."
                tags={['Culture', 'Romance', 'Food']}
                gradient="from-pink-500 to-rose-600"
              />
            </FadeInSection>

            <FadeInSection delay={200}>
              <DestinationCard
                name="Tokyo"
                country="Japan"
                image="/destinations/tokyo.jpg"
                price="From $1,800"
                duration="7-10 days"
                description="Experience the perfect blend of ancient traditions and cutting-edge technology."
                tags={['Culture', 'Food', 'Tech']}
                gradient="from-red-500 to-pink-600"
              />
            </FadeInSection>

            <FadeInSection delay={300}>
              <DestinationCard
                name="Bali"
                country="Indonesia"
                image="/destinations/bali.jpg"
                price="From $900"
                duration="7-14 days"
                description="Tropical paradise with stunning beaches, ancient temples, and vibrant culture."
                tags={['Beach', 'Relax', 'Adventure']}
                gradient="from-emerald-500 to-teal-600"
              />
            </FadeInSection>

            <FadeInSection delay={400}>
              <DestinationCard
                name="New York"
                country="USA"
                image="/destinations/newyork.jpg"
                price="From $1,500"
                duration="4-6 days"
                description="The city that never sleeps offers endless entertainment, dining, and culture."
                tags={['City', 'Shopping', 'Culture']}
                gradient="from-blue-500 to-indigo-600"
              />
            </FadeInSection>

            <FadeInSection delay={500}>
              <DestinationCard
                name="Dubai"
                country="UAE"
                image="/destinations/dubai.jpg"
                price="From $1,400"
                duration="5-7 days"
                description="Futuristic city with luxury shopping, ultramodern architecture, and desert adventures."
                tags={['Luxury', 'Shopping', 'Desert']}
                gradient="from-amber-500 to-orange-600"
              />
            </FadeInSection>

            <FadeInSection delay={600}>
              <DestinationCard
                name="Santorini"
                country="Greece"
                image="/destinations/santorini.jpg"
                price="From $1,100"
                duration="5-7 days"
                description="Breathtaking sunsets, white-washed buildings, and crystal-clear Aegean waters."
                tags={['Beach', 'Romance', 'Relax']}
                gradient="from-cyan-500 to-blue-600"
              />
            </FadeInSection>

            <FadeInSection delay={700}>
              <DestinationCard
                name="Iceland"
                country="Iceland"
                image="/destinations/iceland.jpg"
                price="From $2,000"
                duration="7-10 days"
                description="Land of fire and ice with glaciers, hot springs, and the Northern Lights."
                tags={['Nature', 'Adventure', 'Unique']}
                gradient="from-purple-500 to-violet-600"
              />
            </FadeInSection>

            <FadeInSection delay={800}>
              <DestinationCard
                name="Maldives"
                country="Maldives"
                image="/destinations/maldives.jpg"
                price="From $2,500"
                duration="5-7 days"
                description="Overwater villas, pristine beaches, and world-class diving in paradise."
                tags={['Beach', 'Luxury', 'Honeymoon']}
                gradient="from-teal-500 to-cyan-600"
              />
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Modes Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Three Planning Modes
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose how you want to plan - from fully automatic to full control
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <FadeInSection delay={100}>
              <ParallaxCard>
                <Card className="p-6 border-2 hover:border-primary transition-colors h-full hover:shadow-xl">
                  <Badge className="mb-4">Most Popular</Badge>
                  <h3 className="text-2xl font-bold mb-2">Plan Mode</h3>
                  <p className="text-muted-foreground mb-4">
                    Get suggestions and recommendations. Edit freely, no commitments.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>See all options</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Edit anytime</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Share with friends</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Find alternatives</span>
                    </li>
                  </ul>
                </Card>
              </ParallaxCard>
            </FadeInSection>

            <FadeInSection delay={200}>
              <ParallaxCard>
                <Card className="p-6 border-2 hover:border-primary transition-colors h-full hover:shadow-xl">
                  <Badge variant="outline" className="mb-4">For Busy Travelers</Badge>
                  <h3 className="text-2xl font-bold mb-2">Auto-Pay Mode</h3>
                  <p className="text-muted-foreground mb-4">
                    AI books everything automatically. Fastest way to plan and travel.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Instant booking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Best prices</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Hands-free</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Save time</span>
                    </li>
                  </ul>
                </Card>
              </ParallaxCard>
            </FadeInSection>

            <FadeInSection delay={300}>
              <ParallaxCard>
                <Card className="p-6 border-2 hover:border-primary transition-colors h-full hover:shadow-xl">
                  <Badge variant="outline" className="mb-4">Full Control</Badge>
                  <h3 className="text-2xl font-bold mb-2">Edit Mode</h3>
                  <p className="text-muted-foreground mb-4">
                    Modify existing plans. Ask for alternatives and replacements.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Change anything</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Get alternatives</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Real-time updates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Collaborative</span>
                    </li>
                  </ul>
                </Card>
              </ParallaxCard>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powered by AI Agents
            </h2>
            <p className="text-xl text-muted-foreground">
              5 specialized agents working in parallel to create your perfect trip
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <FadeInSection delay={100}>
              <ParallaxCard intensity={5}>
                <Card className="p-6 h-full hover:shadow-xl transition-shadow group">
                  <Globe className="h-10 w-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-2">Orchestrator Agent</h3>
                  <p className="text-sm text-muted-foreground">
                    Coordinates all agents, decides parallel vs sequential execution
                  </p>
                </Card>
              </ParallaxCard>
            </FadeInSection>

            <FadeInSection delay={150}>
              <ParallaxCard intensity={5}>
                <Card className="p-6 h-full hover:shadow-xl transition-shadow group">
                  <Calendar className="h-10 w-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-2">Flight Agent</h3>
                  <p className="text-sm text-muted-foreground">
                    Searches thousands of flights, finds best prices and times
                  </p>
                </Card>
              </ParallaxCard>
            </FadeInSection>

            <FadeInSection delay={200}>
              <ParallaxCard intensity={5}>
                <Card className="p-6 h-full hover:shadow-xl transition-shadow group">
                  <MapPin className="h-10 w-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-2">Hotel Agent</h3>
                  <p className="text-sm text-muted-foreground">
                    Finds perfect accommodations based on your preferences
                  </p>
                </Card>
              </ParallaxCard>
            </FadeInSection>

            <FadeInSection delay={250}>
              <ParallaxCard intensity={5}>
                <Card className="p-6 h-full hover:shadow-xl transition-shadow group">
                  <Sparkles className="h-10 w-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-2">Activity Agent</h3>
                  <p className="text-sm text-muted-foreground">
                    Plans activities, restaurants, and experiences
                  </p>
                </Card>
              </ParallaxCard>
            </FadeInSection>

            <FadeInSection delay={300}>
              <ParallaxCard intensity={5}>
                <Card className="p-6 h-full hover:shadow-xl transition-shadow group">
                  <Zap className="h-10 w-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-2">Weather Agent</h3>
                  <p className="text-sm text-muted-foreground">
                    Provides forecasts and suggests weather-appropriate activities
                  </p>
                </Card>
              </ParallaxCard>
            </FadeInSection>

            <FadeInSection delay={350}>
              <ParallaxCard intensity={5}>
                <Card className="p-6 h-full hover:shadow-xl transition-shadow group">
                  <DollarSign className="h-10 w-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-2">Budget Optimizer</h3>
                  <p className="text-sm text-muted-foreground">
                    Ensures everything stays within your budget limits
                  </p>
                </Card>
              </ParallaxCard>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <FadeInSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by Travelers Worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our users say about their AI-planned adventures
            </p>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FadeInSection delay={100}>
              <TestimonialCard
                name="Sarah Johnson"
                role="Travel Blogger"
                image="/testimonials/sarah.jpg"
                rating={5}
                text="AIKU planned my entire 2-week European tour in minutes! Every detail was perfect - from boutique hotels to hidden local restaurants. The AI understood exactly what I wanted."
                trip="Paris, Rome & Barcelona"
              />
            </FadeInSection>

            <FadeInSection delay={200}>
              <TestimonialCard
                name="Michael Chen"
                role="Software Engineer"
                image="/testimonials/michael.jpg"
                rating={5}
                text="As someone who hates planning, this is a game-changer. I just said 'Beach vacation under $2000' and got an amazing Bali itinerary with flights, hotels, and activities."
                trip="Bali, Indonesia"
              />
            </FadeInSection>

            <FadeInSection delay={300}>
              <TestimonialCard
                name="Emily Rodriguez"
                role="Marketing Director"
                image="/testimonials/emily.jpg"
                rating={5}
                text="The AI agents working in parallel is incredible. I watched it find flights, hotels, and plan daily activities simultaneously. Saved me 10+ hours of research!"
                trip="Tokyo, Japan"
              />
            </FadeInSection>

            <FadeInSection delay={400}>
              <TestimonialCard
                name="David Park"
                role="Photographer"
                image="/testimonials/david.jpg"
                rating={5}
                text="Best travel planning tool ever. It suggested photography spots I'd never heard of and perfectly timed everything around golden hour. Absolutely brilliant!"
                trip="Iceland"
              />
            </FadeInSection>

            <FadeInSection delay={500}>
              <TestimonialCard
                name="Lisa Thompson"
                role="Teacher"
                image="/testimonials/lisa.jpg"
                rating={5}
                text="Planning a family trip with kids is usually stressful. AIKU found kid-friendly restaurants, activities, and even suggested the best times to visit attractions."
                trip="Orlando, Florida"
              />
            </FadeInSection>

            <FadeInSection delay={600}>
              <TestimonialCard
                name="James Wilson"
                role="Entrepreneur"
                image="/testimonials/james.jpg"
                rating={5}
                text="Used auto-pay mode and everything was booked while I focused on work. Trip was flawless. This is the future of travel planning!"
                trip="Dubai, UAE"
              />
            </FadeInSection>
          </div>

          {/* Stats Row */}
          <FadeInSection delay={700} className="mt-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter end={15} suffix="K+" />
                </div>
                <p className="text-sm text-muted-foreground">Trips Planned</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter end={98} suffix="%" />
                </div>
                <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter end={120} suffix="+" />
                </div>
                <p className="text-sm text-muted-foreground">Countries</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter end={4.9} start={0} suffix="/5" />
                </div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-20">
        <div className="container">
          <FadeInSection>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Your Trust is Our Priority
                </h2>
                <p className="text-muted-foreground">
                  We partner with industry leaders to ensure your data and payments are secure
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-8">
                <FadeInSection delay={100}>
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="font-semibold mb-2">SSL Encrypted</h3>
                    <p className="text-sm text-muted-foreground">
                      Bank-level encryption for all transactions
                    </p>
                  </div>
                </FadeInSection>

                <FadeInSection delay={200}>
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Lock className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="font-semibold mb-2">GDPR Compliant</h3>
                    <p className="text-sm text-muted-foreground">
                      Your privacy is protected by law
                    </p>
                  </div>
                </FadeInSection>

                <FadeInSection delay={300}>
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Award className="h-8 w-8 text-purple-500" />
                    </div>
                    <h3 className="font-semibold mb-2">Industry Certified</h3>
                    <p className="text-sm text-muted-foreground">
                      SOC 2 Type II certified platform
                    </p>
                  </div>
                </FadeInSection>

                <FadeInSection delay={400}>
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-8 w-8 text-orange-500" />
                    </div>
                    <h3 className="font-semibold mb-2">Verified Partners</h3>
                    <p className="text-sm text-muted-foreground">
                      Only trusted travel providers
                    </p>
                  </div>
                </FadeInSection>
              </div>

              {/* Partner Logos */}
              <FadeInSection delay={500} className="mt-16">
                <div className="border-t pt-12">
                  <p className="text-center text-sm text-muted-foreground mb-8">
                    Trusted by leading travel platforms
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale">
                    <div className="text-2xl font-bold">Google Maps</div>
                    <div className="text-2xl font-bold">Stripe</div>
                    <div className="text-2xl font-bold">Amadeus</div>
                    <div className="text-2xl font-bold">Booking.com</div>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <Card className="relative overflow-hidden p-12 md:p-16 text-center bg-gradient-to-br from-primary/10 via-background to-purple-500/10">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Plan Your Next Adventure?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start chatting with our AI. No credit card required, completely free to plan.
              </p>
              <Link href="/trip/plan">
                <Button size="lg" className="text-lg h-14 px-8 gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Start Planning Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
