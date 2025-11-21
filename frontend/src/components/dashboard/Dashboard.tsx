import { Shirt, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { useWardrobe } from '../../contexts/WardrobeContext';
import { useUser } from '../../contexts/UserContext';

type View = 'dashboard' | 'closet' | 'outfit-creator';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { clothingItems, outfits } = useWardrobe();
  const { user } = useUser();

  const stats = [
    {
      label: 'Clothing Items',
      value: clothingItems.length,
      icon: Shirt,
      color: 'bg-blue-500'
    },
    {
      label: 'Outfits Created',
      value: outfits.length,
      icon: Sparkles,
      color: 'bg-purple-500'
    },
    {
      label: 'Items Worn',
      value: 0,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      label: 'Days Tracked',
      value: 1,
      icon: Calendar,
      color: 'bg-orange-500'
    }
  ];

  const recentOutfits = outfits.slice(-3);

  const quickActions = [
    {
      title: 'Add New Item',
      description: 'Upload a new clothing item to your wardrobe',
      action: () => onNavigate('closet'),
      color: 'from-blue-500 to-cyan-500',
      icon: Shirt
    },
    {
      title: 'Create Outfit',
      description: 'Mix and match items to create new outfits',
      action: () => onNavigate('outfit-creator'),
      color: 'from-purple-500 to-pink-500',
      icon: Sparkles
    }
  ];

  const recentActivity: any[] = []; // Empty means no activity

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username}! 👋
        </h3>
        <p className="text-gray-600">
          Here's what's happening with your virtual wardrobe today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`p-6 rounded-2xl bg-gradient-to-r ${action.color} text-white hover:scale-105 transition-transform duration-200 text-left group shadow-lg`}
                >
                  <Icon className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-white/90 text-sm">{action.description}</p>
                </button>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {/* Render activity here */}
                </div>
              ) : (
                <p className="text-gray-500 mb-4 text-center">
                  No recent activity to show!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Outfits */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Outfits</h2>
          <div className="space-y-4">
            {recentOutfits.length > 0 ? (
              recentOutfits.map((outfit) => (
                <div
                  key={outfit.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{outfit.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {outfit.items.slice(0, 3).map((item) => (
                      <span
                        key={item.id}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg"
                      >
                        {item.name}
                      </span>
                    ))}
                    {outfit.items.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
                        +{outfit.items.length - 3} more
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Created {outfit.createdAt.toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No outfits created yet!</p>
                <button
                  onClick={() => onNavigate('outfit-creator')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  Create your first outfit →
                </button>
              </div>
            )}
          </div>

          {/* Style Tips */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Style Tip of the Day</h3>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
              <p className="text-sm text-amber-800">
                Try layering different textures to add depth to your outfit. Mix smooth fabrics with textured ones for a more interesting look!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}