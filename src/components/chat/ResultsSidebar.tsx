'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Hotel, MapPin, X, ChevronRight, ListTodo } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { FlightCard, type FlightData } from './FlightCard'
import { HotelCard, type HotelData } from './HotelCard'
import { ActivityCard, type ActivityData } from './ActivityCard'
import { TodoList } from '@/components/todos'

export interface TravelData {
  flights: FlightData[]
  hotels: HotelData[]
  activities: ActivityData[]
}

type TabType = 'flights' | 'hotels' | 'activities' | 'todos'

interface ResultsSidebarProps {
  isOpen: boolean
  onToggle: () => void
  travelData: TravelData
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  conversationId?: string
}

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'flights', label: 'Flights', icon: <Plane className="w-4 h-4" /> },
  { id: 'hotels', label: 'Hotels', icon: <Hotel className="w-4 h-4" /> },
  { id: 'activities', label: 'Activities', icon: <MapPin className="w-4 h-4" /> },
  { id: 'todos', label: 'Todos', icon: <ListTodo className="w-4 h-4" /> },
]

export function ResultsSidebar({
  isOpen,
  onToggle,
  travelData,
  activeTab,
  onTabChange,
  conversationId,
}: ResultsSidebarProps) {
  const getCounts = () => ({
    flights: travelData.flights.length,
    hotels: travelData.hotels.length,
    activities: travelData.activities.length,
  })

  const counts = getCounts()
  const totalCount = counts.flights + counts.hotels + counts.activities

  // Don't render if no results
  if (totalCount === 0) {
    return null
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 480, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hidden lg:flex flex-col border-l border-zinc-800 bg-zinc-900/50 h-full overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h2 className="font-semibold text-sm">Results ({totalCount})</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onToggle}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-800">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'text-zinc-100 border-b-2 border-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-300'
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.id !== 'todos' && counts[tab.id as keyof typeof counts] > 0 && (
                    <span className={cn(
                      'ml-0.5 px-1 py-0.5 text-[10px] rounded-full min-w-[18px]',
                      activeTab === tab.id ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-700 text-zinc-300'
                    )}>
                      {counts[tab.id as keyof typeof counts]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'flights' && (
                    <div className="space-y-3">
                      {travelData.flights.length > 0 ? (
                        travelData.flights.map((flight, index) => (
                          <FlightCard key={flight.id || index} flight={flight} />
                        ))
                      ) : (
                        <EmptyState icon={<Plane />} message="No flights found" />
                      )}
                    </div>
                  )}

                  {activeTab === 'hotels' && (
                    <div className="grid grid-cols-1 gap-3">
                      {travelData.hotels.length > 0 ? (
                        travelData.hotels.map((hotel, index) => (
                          <HotelCard key={hotel.id || index} hotel={hotel} />
                        ))
                      ) : (
                        <EmptyState icon={<Hotel />} message="No hotels found" />
                      )}
                    </div>
                  )}

                  {activeTab === 'activities' && (
                    <div className="grid grid-cols-2 gap-3">
                      {travelData.activities.length > 0 ? (
                        travelData.activities.map((activity, index) => (
                          <ActivityCard key={activity.id || index} activity={activity} />
                        ))
                      ) : (
                        <EmptyState icon={<MapPin />} message="No activities found" />
                      )}
                    </div>
                  )}

                  {activeTab === 'todos' && conversationId && (
                    <TodoList conversationId={conversationId} />
                  )}
                </motion.div>
              </AnimatePresence>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={onToggle}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 rounded-t-2xl max-h-[90vh] flex flex-col"
            >
              {/* Handle */}
              <div className="flex justify-center py-2">
                <div className="w-10 h-1 bg-zinc-600 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-2">
                <h2 className="font-semibold">Results ({totalCount})</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onToggle}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-zinc-800 px-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors',
                      activeTab === tab.id
                        ? 'text-zinc-100 border-b-2 border-zinc-100'
                        : 'text-zinc-400 hover:text-zinc-300'
                    )}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.id !== 'todos' && counts[tab.id as keyof typeof counts] > 0 && (
                      <span className={cn(
                        'ml-0.5 px-1 py-0.5 text-[10px] rounded-full min-w-[16px]',
                        activeTab === tab.id ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-700 text-zinc-300'
                      )}>
                        {counts[tab.id as keyof typeof counts]}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Content */}
              <ScrollArea className="flex-1 p-4 max-h-[60vh]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'flights' && (
                      <div className="space-y-3">
                        {travelData.flights.map((flight, index) => (
                          <FlightCard key={flight.id || index} flight={flight} />
                        ))}
                      </div>
                    )}

                    {activeTab === 'hotels' && (
                      <div className="grid grid-cols-2 gap-2">
                        {travelData.hotels.map((hotel, index) => (
                          <HotelCard key={hotel.id || index} hotel={hotel} />
                        ))}
                      </div>
                    )}

                    {activeTab === 'activities' && (
                      <div className="grid grid-cols-2 gap-2">
                        {travelData.activities.map((activity, index) => (
                          <ActivityCard key={activity.id || index} activity={activity} />
                        ))}
                      </div>
                    )}

                    {activeTab === 'todos' && conversationId && (
                      <TodoList conversationId={conversationId} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <Card className="p-6 text-center">
      <div className="w-8 h-8 mx-auto mb-2 text-muted-foreground">
        {icon}
      </div>
      <p className="text-muted-foreground text-sm">{message}</p>
    </Card>
  )
}

// Toggle Button Component (shown when sidebar is closed)
interface ResultsToggleButtonProps {
  onClick: () => void
  counts: { flights: number; hotels: number; activities: number }
}

export function ResultsToggleButton({ onClick, counts }: ResultsToggleButtonProps) {
  const total = counts.flights + counts.hotels + counts.activities

  if (total === 0) return null

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-24 right-4 z-30 flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-full px-4 py-2.5 shadow-lg transition-colors"
    >
      <div className="flex items-center gap-1.5 text-sm">
        {counts.flights > 0 && (
          <span className="flex items-center gap-1">
            <Plane className="w-3.5 h-3.5" />
            {counts.flights}
          </span>
        )}
        {counts.hotels > 0 && (
          <span className="flex items-center gap-1">
            <Hotel className="w-3.5 h-3.5" />
            {counts.hotels}
          </span>
        )}
        {counts.activities > 0 && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {counts.activities}
          </span>
        )}
      </div>
      <ChevronRight className="w-4 h-4" />
    </motion.button>
  )
}
