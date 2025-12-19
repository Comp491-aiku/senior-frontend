import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Target, Zap, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4">About Us</Badge>
          <h1 className="text-5xl font-bold mb-4">Our Mission</h1>
          <p className="text-xl text-muted-foreground">
            Making travel planning effortless and accessible for everyone through AI innovation
          </p>
        </div>

        {/* Story Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-3xl">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <p className="text-muted-foreground">
              AIKU was born from a simple frustration: planning the perfect trip shouldn&apos;t take weeks of
              research and countless hours of spreadsheet work. We believed there had to be a better way.
            </p>
            <p className="text-muted-foreground mt-4">
              Our team of travel enthusiasts and AI experts came together to build a platform that combines
              the best of both worlds - the creativity and personal touch of human travel planning with the
              efficiency and intelligence of advanced AI technology.
            </p>
            <p className="text-muted-foreground mt-4">
              Today, AIKU helps thousands of travelers create perfect itineraries in minutes, saving time
              and money while discovering amazing experiences they might have otherwise missed.
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>User-Centric</CardTitle>
                <CardDescription>
                  Every feature we build starts with understanding our users&apos; needs and pain points
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Innovation</CardTitle>
                <CardDescription>
                  We constantly push the boundaries of AI technology to deliver better travel experiences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Passion for Travel</CardTitle>
                <CardDescription>
                  We&apos;re travelers ourselves, and we pour our love for exploration into every feature
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Target className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Precision</CardTitle>
                <CardDescription>
                  We obsess over details to ensure every recommendation is relevant and valuable
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">The Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              AIKU is powered by a sophisticated multi-agent AI system that consists of 5 specialized agents:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="font-semibold mr-2">Orchestrator Agent:</span>
                <span className="text-muted-foreground">
                  Coordinates all other agents and ensures a cohesive itinerary
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Flight Agent:</span>
                <span className="text-muted-foreground">
                  Analyzes thousands of flight options to find the best deals
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Accommodation Agent:</span>
                <span className="text-muted-foreground">
                  Matches you with perfect places to stay based on your preferences
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Activity Agent:</span>
                <span className="text-muted-foreground">
                  Discovers experiences and activities tailored to your interests
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">Weather Agent:</span>
                <span className="text-muted-foreground">
                  Provides accurate forecasts to optimize your daily schedule
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
