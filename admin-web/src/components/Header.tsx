import { Dropdown, MenuProps } from 'antd'
import { Bell, ChevronDown, Search, Settings } from 'lucide-react'

import { adminApi } from '../services/adminApi'

const Header = () => {
  const handleLogout = async () => {
    try {
      await adminApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      window.location.href = '/login'
    }
  }

  const userMenu: MenuProps['items'] = [
    {
      key: '1',
      label: 'Profile',
    },
    {
      key: '2',
      label: 'Settings',
    },
    {
      key: '3',
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ]

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 px-8 flex items-center justify-between transition-all duration-300">
      {/* Breadcrumb / Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500">Welcome back, Admin</p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-10 pr-4 py-2.5 w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          <button className="p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="h-8 w-px bg-gray-200"></div>

        {/* User Profile */}
        <Dropdown menu={{ items: userMenu }} trigger={['click']}>
          <button className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-xl transition-all duration-200">
            <img
              src="https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff"
              alt="Admin"
              className="w-10 h-10 rounded-lg shadow-sm"
            />
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </Dropdown>
      </div>
    </header>
  )
}

export default Header
