'use client'

/**
 * Alternative finder modal for flights, hotels, and activities
 */
import { useState } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Plane,
  Hotel,
  Calendar,
  X,
  Search,
  DollarSign,
  Star,
  MapPin,
  Clock,
  TrendingDown,
  TrendingUp,
  Sparkles,
} from 'lucide-react'

type ItemType = 'flight' | 'accommodation' | 'activity'

interface Alternative {
  id: string
  name: string
  price: number
  rating?: number
  description: string
  features: string[]
  savings?: number
  isRecommended?: boolean
}

interface AlternativeFinderModalProps {
  isOpen: boolean
  onClose: () => void
  itemType: ItemType
  currentItem?: {
    id: string
    name: string
    price: number
  }
  onSelectAlternative: (alternative: Alternative) => void
}

export function AlternativeFinderModal({
  isOpen,
  onClose,
  itemType,
  currentItem,
  onSelectAlternative,
}: AlternativeFinderModalProps) {
  const [priceRange, setPriceRange] = useState<'cheaper' | 'similar' | 'premium'>('cheaper')
  const [loading, setLoading] = useState(false)
  const [alternatives, setAlternatives] = useState<Alternative[]>([])

  const icons = {
    flight: Plane,
    accommodation: Hotel,
    activity: Calendar,
  }

  const Icon = icons[itemType]

  const handleSearch = async () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const mockAlternatives: Alternative[] = [
        {
          id: '1',
          name: itemType === 'flight' ? 'Turkish Airlines TK123' : itemType === 'accommodation' ? 'Grand Hyatt Istanbul' : 'Bosphorus Sunset Cruise',
          price: currentItem ? currentItem.price * 0.7 : 500,
          rating: 4.8,
          description: itemType === 'flight' ? 'Direct flight, 2h 30m' : itemType === 'accommodation' ? '5-star luxury hotel in Taksim' : 'Evening cruise with dinner',
          features: itemType === 'flight'
            ? ['Direct', '2 checked bags', 'Meal included', 'Wi-Fi']
            : itemType === 'accommodation'
            ? ['City view', 'Pool', 'Spa', 'Restaurant']
            : ['2 hours', 'Dinner included', 'Live music', 'Guide'],
          savings: currentItem ? Math.round(currentItem.price * 0.3) : 150,
          isRecommended: true,
        },
        {
          id: '2',
          name: itemType === 'flight' ? 'Pegasus PC456' : itemType === 'accommodation' ? 'Hilton Istanbul Bomonti' : 'Hagia Sophia Tour',
          price: currentItem ? currentItem.price * 0.5 : 350,
          rating: 4.5,
          description: itemType === 'flight' ? '1 stop, 4h 15m' : itemType === 'accommodation' ? '4-star business hotel' : 'Guided historical tour',
          features: itemType === 'flight'
            ? ['1 stop', '1 checked bag', 'Snacks']
            : itemType === 'accommodation'
            ? ['Business center', 'Gym', 'Free breakfast']
            : ['3 hours', 'Skip the line', 'Audio guide'],
          savings: currentItem ? Math.round(currentItem.price * 0.5) : 250,
        },
        {
          id: '3',
          name: itemType === 'flight' ? 'SunExpress XQ789' : itemType === 'accommodation' ? 'Swissotel The Bosphorus' : 'Topkapi Palace Visit',
          price: currentItem ? currentItem.price * 0.85 : 680,
          rating: 4.9,
          description: itemType === 'flight' ? 'Direct, premium economy' : itemType === 'accommodation' ? 'Luxury resort with Bosphorus view' : 'Full palace tour with harem',
          features: itemType === 'flight'
            ? ['Direct', 'Extra legroom', '2 bags', 'Priority boarding']
            : itemType === 'accommodation'
            ? ['Bosphorus view', '3 pools', 'Private beach', 'Spa']
            : ['4 hours', 'Harem access', 'Expert guide', 'Tea included'],
          savings: currentItem ? Math.round(currentItem.price * 0.15) : 80,
        },
      ]

      setAlternatives(mockAlternatives)
      setLoading(false)
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <Card className="w-full max-w-4xl my-8 bg-background">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Find Alternatives</h2>
                  <p className="text-sm text-muted-foreground">
                    {currentItem
                      ? `Currently: ${currentItem.name} - $${currentItem.price}`
                      : `Search for ${itemType}s`}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b bg-muted/30">
            <div className="space-y-4">
              <div>
                <Label className="mb-3 block">Price Range</Label>
                <Tabs value={priceRange} onValueChange={(v) => setPriceRange(v as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="cheaper" className="gap-2">
                      <TrendingDown className="h-4 w-4" />
                      Cheaper
                    </TabsTrigger>
                    <TabsTrigger value="similar" className="gap-2">
                      <DollarSign className="h-4 w-4" />
                      Similar
                    </TabsTrigger>
                    <TabsTrigger value="premium" className="gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Premium
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Button onClick={handleSearch} className="w-full" disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'Searching...' : 'Search Alternatives'}
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="p-6 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                <p className="mt-4 text-sm text-muted-foreground">Finding best alternatives...</p>
              </div>
            ) : alternatives.length > 0 ? (
              <div className="space-y-4">
                {alternatives.map((alt) => (
                  <Card
                    key={alt.id}
                    className={`p-4 hover:shadow-lg transition-shadow cursor-pointer ${
                      alt.isRecommended ? 'border-2 border-primary' : ''
                    }`}
                  >
                    {alt.isRecommended && (
                      <Badge className="mb-3 gap-1">
                        <Sparkles className="h-3 w-3" />
                        Recommended
                      </Badge>
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{alt.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{alt.description}</p>

                        {/* Rating */}
                        {alt.rating && (
                          <div className="flex items-center gap-1 mb-3">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{alt.rating}</span>
                          </div>
                        )}

                        {/* Features */}
                        <div className="flex flex-wrap gap-2">
                          {alt.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary mb-1">
                          ${alt.price}
                        </div>
                        {alt.savings && (
                          <div className="text-sm text-green-600 font-medium mb-3">
                            Save ${alt.savings}
                          </div>
                        )}
                        <Button
                          onClick={() => {
                            onSelectAlternative(alt)
                            onClose()
                          }}
                          size="sm"
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Click "Search Alternatives" to find options
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Dialog>
  )
}
