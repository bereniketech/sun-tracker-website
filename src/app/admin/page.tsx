import { getStats } from "./actions";

interface StatCard {
  title: string;
  count: number;
  color: string;
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards: StatCard[] = [
    {
      title: "Total Cities",
      count: stats.citiesCount,
      color: "bg-blue-500",
    },
    {
      title: "Total Landmarks",
      count: stats.landmarksCount,
      color: "bg-green-500",
    },
    {
      title: "Active Subscriptions",
      count: stats.subscriptionsCount,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {stats.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          Error loading stats: {stats.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-lg shadow-md p-6">
            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <span className="text-white text-2xl font-bold">{card.count}</span>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold uppercase">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{card.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
