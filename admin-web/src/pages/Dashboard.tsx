import {
    Activity,
    ArrowDown,
    ArrowUp,
    DollarSign,
    TrendingUp,
    Users
} from 'lucide-react'

const Dashboard = () => {
  const stats = [
    {
      title: 'Users',
      value: '26K',
      change: '-12.4%',
      changeType: 'decrease',
      color: 'bg-primary-500',
      icon: Users
    },
    {
      title: 'Income',
      value: '$6,200',
      change: '+40.9%',
      changeType: 'increase',
      color: 'bg-blue-500',
      icon: DollarSign
    },
    {
      title: 'Conversion Rate',
      value: '2.49%',
      change: '+84.7%',
      changeType: 'increase',
      color: 'bg-yellow-500',
      icon: Activity
    },
    {
      title: 'Sessions',
      value: '44K',
      change: '-23.6%',
      changeType: 'decrease',
      color: 'bg-red-500',
      icon: TrendingUp
    }
  ]

  const trafficData = [
    { label: 'Visits', value: '29.703 Users (40%)', color: 'bg-green-500' },
    { label: 'Unique', value: '24.093 Users (20%)', color: 'bg-blue-500' },
    { label: 'Pageviews', value: '78.706 Views (60%)', color: 'bg-yellow-500' },
    { label: 'New Users', value: '22.123 Users (80%)', color: 'bg-red-500' },
    { label: 'Bounce Rate', value: 'Average Rate (40.15%)', color: 'bg-purple-500' }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'increase' ? (
                      <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-16 h-16 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Traffic Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Traffic</h2>
          <p className="text-sm text-gray-500">January - July 2023</p>
        </div>
        
        {/* Chart Placeholder */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
          <p className="text-gray-500">Chart visualization would go here</p>
        </div>

        {/* Traffic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {trafficData.map((item, index) => (
            <div key={index} className="text-center">
              <div className={`w-4 h-4 ${item.color} rounded-full mx-auto mb-2`}></div>
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-600">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="card p-6">
            <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center mb-4">
              <div className="text-white text-center">
                <div className="text-2xl font-bold mb-1">89.9%</div>
                <div className="text-sm opacity-90">Metric {item}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
