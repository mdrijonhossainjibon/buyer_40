import { Metadata } from 'next'

// Enable ISR with longer revalidation for leaderboard
export const revalidate = 600 // Revalidate every 10 minutes

export const metadata: Metadata = {
  title: 'Leaderboard - EarnFromAdsBD',
  description: 'Top earners and rankings',
}

// Generate static params for different leaderboard types
export async function generateStaticParams() {
  return [
    { type: 'daily' },
    { type: 'weekly' },
    { type: 'monthly' },
    { type: 'all-time' }
  ]
}

async function getLeaderboardData() {
  // Simulate database query
  await new Promise(resolve => setTimeout(resolve, 150))
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    username: `User${i + 1}`,
    earnings: Math.floor(Math.random() * 10000) + 1000,
    adsWatched: Math.floor(Math.random() * 500) + 50,
    referrals: Math.floor(Math.random() * 100),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`
  })).sort((a, b) => b.earnings - a.earnings)
}

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboardData()
  const topThree = leaderboard.slice(0, 3)
  const others = leaderboard.slice(3, 20)

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          🏆 Leaderboard
        </h1>

        {/* Top 3 Podium */}
        <div className="flex justify-center items-end mb-12 space-x-4">
          {/* 2nd Place */}
          <div className="text-center">
            <div className="bg-gray-300 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <span className="text-2xl">🥈</span>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <p className="font-semibold">{topThree[1]?.username}</p>
              <p className="text-sm text-gray-600">৳{topThree[1]?.earnings.toLocaleString()}</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="text-center">
            <div className="bg-yellow-400 rounded-full w-20 h-20 flex items-center justify-center mb-2">
              <span className="text-3xl">🥇</span>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-xl border-2 border-yellow-400">
              <p className="font-bold text-lg">{topThree[0]?.username}</p>
              <p className="text-yellow-600 font-semibold">৳{topThree[0]?.earnings.toLocaleString()}</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="text-center">
            <div className="bg-orange-400 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <span className="text-2xl">🥉</span>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <p className="font-semibold">{topThree[2]?.username}</p>
              <p className="text-sm text-gray-600">৳{topThree[2]?.earnings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Rest of the leaderboard */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Top Earners</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {others.map((user, index) => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">{index + 4}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.adsWatched} ads watched</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">৳{user.earnings.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{user.referrals} referrals</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Updated every 10 minutes • Cached for optimal performance
          </p>
        </div>
      </div>
    </div>
  )
}
