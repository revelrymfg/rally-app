import BottomNav from './BottomNav'
import PullToRefresh from './PullToRefresh'
import { useUserTeam } from '../hooks/useUserTeam'

export default function AppShell({ children, activeTab, onTabChange, currentUser, onReset }) {
  const userTeam = useUserTeam(currentUser)
  const teamColor =
    userTeam === 'ca' ? '#C8102E' : userTeam === 'pdx' ? '#003DA5' : '#6B7280'

  return (
    <div className="min-h-dvh flex flex-col overflow-x-hidden">
      {/* Playing as bar */}
      {currentUser && (
        <div
          className="sticky top-0 z-40 bg-bg-secondary/90 backdrop-blur-sm border-b border-surface-border"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          <div className="max-w-[430px] mx-auto flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: teamColor }}
              />
              <span className="text-[12px] text-text-secondary">
                Playing as: <span className="font-semibold text-text-primary">{currentUser.name.split(' ')[0]}</span>
              </span>
            </div>
            <button
              onClick={onReset}
              className="text-[11px] text-text-muted underline underline-offset-2 hover:text-text-secondary transition-colors"
            >
              Not you?
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-[430px] mx-auto pb-24">
        <PullToRefresh>
          {children}
        </PullToRefresh>
      </main>
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  )
}
