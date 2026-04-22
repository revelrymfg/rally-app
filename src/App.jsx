import { useState } from 'react'
import AppShell from './components/AppShell'
import WelcomeModal from './components/WelcomeModal'
import CountdownScreen, { isTournamentStarted } from './components/CountdownScreen'
import HomeView from './components/views/HomeView'
import MatchesView from './components/views/MatchesView'
import PlayersView from './components/views/PlayersView'
import FeedView from './components/views/FeedView'
import { ToastProvider } from './contexts/ToastContext'
import { useNotifications } from './hooks/useNotifications'

function loadUser() {
  try {
    const stored = localStorage.getItem('rallyUser')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function AuthenticatedApp({ currentUser, onReset }) {
  const [activeTab, setActiveTab] = useState('home')
  useNotifications(currentUser)

  function handleTabChange(tab) {
    setActiveTab(tab)
    window.scrollTo(0, 0)
  }

  return (
    <AppShell activeTab={activeTab} onTabChange={handleTabChange} currentUser={currentUser} onReset={onReset}>
      {activeTab === 'home' && <HomeView currentUser={currentUser} />}
      {activeTab === 'matches' && <MatchesView currentUser={currentUser} />}
      {activeTab === 'players' && <PlayersView />}
      {activeTab === 'feed' && <FeedView currentUser={currentUser} />}
    </AppShell>
  )
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(loadUser)
  const [skippedCountdown, setSkippedCountdown] = useState(
    () => sessionStorage.getItem('countdownSkipped') === 'true'
  )

  function handleReset() {
    localStorage.removeItem('rallyUser')
    setCurrentUser(null)
  }

  function handleSkipCountdown() {
    sessionStorage.setItem('countdownSkipped', 'true')
    setSkippedCountdown(true)
  }

  // Show countdown screen before tournament starts (unless skipped this session)
  if (!isTournamentStarted() && !skippedCountdown) {
    return <CountdownScreen onSkip={handleSkipCountdown} />
  }

  if (!currentUser) {
    return <WelcomeModal onSelect={setCurrentUser} />
  }

  return (
    <ToastProvider>
      <AuthenticatedApp currentUser={currentUser} onReset={handleReset} />
    </ToastProvider>
  )
}
