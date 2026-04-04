import { Home, Swords, Users, MessageSquare } from 'lucide-react'

const tabs = [
  { label: 'Home', icon: Home, active: true },
  { label: 'Matches', icon: Swords, active: false },
  { label: 'Players', icon: Users, active: false },
  { label: 'Feed', icon: MessageSquare, active: false },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary/95 backdrop-blur-sm border-t border-surface-border z-50">
      <div className="max-w-[430px] mx-auto flex">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.label}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] transition-colors ${
                tab.active
                  ? 'text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <Icon size={20} strokeWidth={tab.active ? 2 : 1.5} />
              <span className="text-[10px] font-medium tracking-wide">
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
