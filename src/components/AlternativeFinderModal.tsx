'use client'

/**
 * Alternative finder modal for flights, hotels, and activities
 */
import { useState } from 'react'
// Dialog component removed - using custom overlay instead
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
  Check,
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

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop with animation */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
        onClick={onClose}
      >
        {/* Modal Card with scale animation */}
        <Card
          className="w-full max-w-4xl my-8 bg-background/95 backdrop-blur-xl border-2 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className="p-6 border-b bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 transform hover:scale-105 transition-transform">
                  <Icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Find Alternatives
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentItem
                      ? `Currently: ${currentItem.name} - $${currentItem.price}`
                      : `Search for ${itemType}s`}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-all hover:rotate-90 duration-300"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Filters with modern styling */}
          <div className="p-6 border-b bg-gradient-to-b from-background to-muted/20">
            <div className="space-y-5">
              <div>
                <Label className="mb-3 block text-sm font-semibold text-foreground/90">
                  Price Range
                </Label>
                <Tabs value={priceRange} onValueChange={(v) => setPriceRange(v as any)}>
                  <TabsList className="grid w-full grid-cols-3 p-1 bg-muted/50 backdrop-blur-sm">
                    <TabsTrigger
                      value="cheaper"
                      className="gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                    >
                      <TrendingDown className="h-4 w-4" />
                      Cheaper
                    </TabsTrigger>
                    <TabsTrigger
                      value="similar"
                      className="gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                    >
                      <DollarSign className="h-4 w-4" />
                      Similar
                    </TabsTrigger>
                    <TabsTrigger
                      value="premium"
                      className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Premium
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Button
                onClick={handleSearch}
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/80"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search Alternatives
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Results with modern cards */}
          <div className="p-6 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-16">
                <div className="relative inline-flex">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                  <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-primary/20" />
                </div>
                <p className="mt-6 text-base font-medium text-muted-foreground">
                  Finding best alternatives...
                </p>
                <p className="mt-1 text-sm text-muted-foreground/70">
                  Comparing prices and features
                </p>
              </div>
            ) : alternatives.length > 0 ? (
              <div className="space-y-4">
                {alternatives.map((alt, index) => (
                  <Card
                    key={alt.id}
                    className={`group relative overflow-hidden p-5 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 ${
                      alt.isRecommended
                        ? 'border-primary bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Recommended badge with glow */}
                    {alt.isRecommended && (
                      <Badge className="mb-3 gap-1.5 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/30 animate-pulse">
                        <Sparkles className="h-3.5 w-3.5" />
                        AI Recommended
                      </Badge>
                    )}

                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 space-y-3">
                        <h3 className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70 transition-all">
                          {alt.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {alt.description}
                        </p>

                        {/* Rating with stars */}
                        {alt.rating && (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(alt.rating!)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'fill-muted text-muted'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold">{alt.rating}</span>
                            <span className="text-xs text-muted-foreground">(Excellent)</span>
                          </div>
                        )}

                        {/* Features with modern badges */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {alt.features.map((feature, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Price & Action - Redesigned */}
                      <div className="text-right flex flex-col items-end gap-3">
                        <div>
                          <div className="text-4xl font-bold bg-gradient-to-br from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                            ${alt.price}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">per person</div>
                        </div>

                        {alt.savings && (
                          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                            <div className="text-sm font-bold text-green-600 dark:text-green-500">
                              Save ${alt.savings}
                            </div>
                          </div>
                        )}

                        <Button
                          onClick={() => {
                            onSelectAlternative(alt)
                            onClose()
                          }}
                          className="w-full min-w-[120px] shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-r from-primary to-primary/90"
                        >
                          <Check className="h-4 w-4 mr-1.5" />
                          Select
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                  <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-full">
                    <Search className="h-16 w-16 text-primary/60" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Ready to Find Alternatives?</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Choose your preferred price range and click &quot;Search Alternatives&quot; to discover amazing options
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  )
}
