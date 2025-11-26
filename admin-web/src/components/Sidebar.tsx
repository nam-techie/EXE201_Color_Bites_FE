import {
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  MessageSquare,
  PieChart,
  Smile,
  Store,
  Tag,
  Trophy,
  Users
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const menuGroups = [
    {
      label: 'Overview',
      items: [
        {
          title: 'Dashboard',
          icon: LayoutDashboard,
          path: '/',
          exact: true
        },
        {
          title: 'Statistics',
          icon: PieChart,
          path: '/statistics'
        }
      ]
    },
    {
      label: 'Management',
      items: [
        {
          title: 'Users',
          icon: Users,
          path: '/users'
        },
        {
          title: 'Restaurants',
          icon: Store,
          path: '/restaurants'
        },
        {
          title: 'Posts',
          icon: FileText,
          path: '/posts'
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
        }
      ]
    },
    {
      label: 'Engagement',
      items: [
        {
          title: 'Challenges',
          icon: Trophy,
          path: '/challenges'
        },
        {
          title: 'Moods',
          icon: Smile,
          path: '/moods'
        }
      ]
    },
    {
      label: 'Finance',
      items: [
        {
          title: 'Transactions',
          icon: CreditCard,
          path: '/transactions'
        }
      ]
    }
  ]

  return (
    <div className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Mummi</h1>
            <p className="text-xs text-gray-500 font-medium">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group, index) => (
          <div key={index} className="mb-8">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
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
                    <span className="font-medium">{item.title}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>


    </div>
  )
}

export default Sidebar
