export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar skeleton */}
      <aside className="hidden lg:flex w-64 bg-[#1B5E20] flex-col">
        <div className="h-14 flex items-center px-4 border-b border-white/10">
          <div className="w-8 h-8 rounded bg-islamic-gold animate-pulse" />
          <div className="ml-2 space-y-1.5">
            <div className="w-16 h-3 bg-white/20 rounded animate-pulse" />
            <div className="w-12 h-2 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-9 bg-white/10 rounded animate-pulse" />
          ))}
        </nav>
      </aside>

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4">
          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
        </header>
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-[#1B5E20] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">Memuat admin panel...</p>
          </div>
        </main>
      </div>
    </div>
  );
}
