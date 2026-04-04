import { useState } from 'react'
import AppShell from './components/AppShell'
import HomeView from './components/views/HomeView'
import MatchesView from './components/views/MatchesView'
import PlayersView from './components/views/PlayersView'
import FeedView from './components/views/FeedView'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  function handleTabChange(tab) {
    setActiveTab(tab)
    window.scrollTo(0, 0)
  }

  return (
    <AppShell activeTab={activeTab} onTabChange={handleTabChange}>
      {activeTab === 'home' && <HomeView />}
      {activeTab === 'matches' && <MatchesView />}
      {activeTab === 'players' && <PlayersView />}
      {activeTab === 'feed' && <FeedView />}
    </AppShell>
  )
}
