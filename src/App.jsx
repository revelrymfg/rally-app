import { useState } from 'react'
import AppShell from './components/AppShell'
import WelcomeModal from './components/WelcomeModal'
import HomeView from './components/views/HomeView'
import MatchesView from './components/views/MatchesView'
import PlayersView from './components/views/PlayersView'
import FeedView from './components/views/FeedView'

function loadUser() {
  try {
    const stored = localStorage.getItem('rallyUser')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [currentUser, setCurrentUser] = useState(loadUser)

  function handleTabChange(tab) {
    setActiveTab(tab)
    window.scrollTo(0, 0)
  }

  function handleReset() {
    localStorage.removeItem('rallyUser')
    setCurrentUser(null)
  }

  if (!currentUser) {
    return <WelcomeModal onSelect={setCurrentUser} />
  }

  return (
    <AppShell activeTab={activeTab} onTabChange={handleTabChange} currentUser={currentUser} onReset={handleReset}>
      {activeTab === 'home' && <HomeView currentUser={currentUser} />}
      {activeTab === 'matches' && <MatchesView />}
      {activeTab === 'players' && <PlayersView />}
      {activeTab === 'feed' && <FeedView currentUser={currentUser} />}
    </AppShell>
  )
}
