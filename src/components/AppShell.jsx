import BottomNav from './BottomNav'

export default function AppShell({ children }) {
  return (
    <div className="min-h-dvh flex flex-col overflow-x-hidden">
      <main className="flex-1 w-full max-w-[430px] mx-auto pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
