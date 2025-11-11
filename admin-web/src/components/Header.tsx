import { Bell, List, MessageSquare, Search, User } from 'lucide-react'

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-primary-600 hover:text-primary-700 cursor-pointer">Home</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600">Dashboard</span>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {/* Time Period Selector */}
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
            Day
          </button>
          <button className="px-3 py-1 text-sm bg-gray-800 text-white rounded-md">
            Month
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
            Year
          </button>
          <button className="p-1 text-gray-600 hover:text-gray-800">
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Notifications */}
        <div className="flex items-center space-x-2">
          <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
            <List className="w-5 h-5" />
          </button>
          
          <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
