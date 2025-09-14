import { Metadata } from 'next'

// Enable static generation with revalidation
export const revalidate = 300 // Revalidate every 5 minutes

// Generate metadata for better SEO and caching
export const metadata: Metadata = {
  title: 'Statistics - EarnFromAdsBD',
  description: 'View your earnings and statistics',
}

// Static props with ISR
async function getStats() {
  // This would typically fetch from your database
  // For demo purposes, we'll simulate data
  await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
  
  return {
    totalUsers: Math.floor(Math.random() * 10000) + 5000,
    totalEarnings: Math.floor(Math.random() * 50000) + 25000,
    adsWatched: Math.floor(Math.random() * 100000) + 50000,
    activeUsers: Math.floor(Math.random() * 1000) + 500,
    lastUpdated: new Date().toISOString()
  }
}

export default async function StatsPage() {
  const stats = await getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Platform Statistics
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon="👥"
            color="bg-blue-500"
          />
          <StatCard
            title="Total Earnings"
            value={`৳${stats.totalEarnings.toLocaleString()}`}
            icon="💰"
            color="bg-green-500"
          />
          <StatCard
            title="Ads Watched"
            value={stats.adsWatched.toLocaleString()}
            icon="📺"
            color="bg-purple-500"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers.toLocaleString()}
            icon="🔥"
            color="bg-orange-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Real-time Updates
          </h2>
          <p className="text-gray-600">
            Last updated: {new Date(stats.lastUpdated).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This page is statically generated and revalidated every 5 minutes for optimal performance.
          </p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string
  value: string
  icon: string
  color: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} rounded-full p-3 text-white text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
