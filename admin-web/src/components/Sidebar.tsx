import {
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Smile,
  Store,
  Tag,
  Trophy,
  Users
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { adminApi } from '../services/adminApi'

const Sidebar = () => {
  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
      exact: true
    },
    {
      title: 'Users',
      icon: Users,
      path: '/users'
    },
    {
      title: 'Posts',
      icon: FileText,
      path: '/posts'
    },
    {
      title: 'Restaurants',
      icon: Store,
      path: '/restaurants'
    },
    {
      title: 'Comments',
      icon: MessageSquare,
      path: '/comments'
    },
    {
      title: 'Tags',
      icon: Tag,
      path: '/tags'
    },
    {
      title: 'Transactions',
      icon: CreditCard,
      path: '/transactions'
    },
    {
      title: 'Moods',
      icon: Smile,
      path: '/moods'
    },
    {
      title: 'Challenges',
      icon: Trophy,
      path: '/challenges'
    },
    {
      title: 'Statistics',
      icon: BarChart3,
      path: '/statistics'
    }
  ]

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Menu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mummi</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="px-2">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            THEME
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.title}
              </NavLink>
            )
          })}
        </div>

      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={async () => {
            try {
              await adminApi.logout()
            } catch (error) {
              console.error('Logout error:', error)
            } finally {
              window.location.href = '/login'
            }
          }}
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
