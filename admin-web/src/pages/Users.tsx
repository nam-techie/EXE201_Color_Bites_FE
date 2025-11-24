import { Drawer, message } from 'antd'
import { Ban, CheckCircle, Download, Eye, MoreHorizontal, Search, Users as UsersIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { adminApi } from '../services/adminApi'
import { ListAccountResponse } from '../types/user'
import { exportUsersToExcel } from '../utils/export'
import UserDetail from './Users/UserDetail'

const Users = () => {
  const [users, setUsers] = useState<ListAccountResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'blocked'>('all')
  const [exportLoading, setExportLoading] = useState(false)
  
  // Detail drawer state
  const [selectedUser, setSelectedUser] = useState<ListAccountResponse | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminApi.getAllUsers()
      console.log('📋 Users data from backend:', response.data)
      // Debug first user to check data structure
      if (response.data.length > 0) {
        console.log('👤 First user data:', response.data[0])
        console.log('🔍 Available fields:', Object.keys(response.data[0]))
        console.log('📊 active field:', response.data[0].active)
      }
      
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError(error instanceof Error ? error.message : 'Không thể tải danh sách người dùng')
      setUsers([]) // Clear users on error
    } finally {
      setLoading(false)
    }
  }

  // Block user
  const handleBlockUser = async (userId: string) => {
    try {
      await adminApi.blockUser(userId)
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, active: false } : user
      ))
      alert('Người dùng đã được chặn thành công')
    } catch (error) {
      console.error('Error blocking user:', error)
      alert('Có lỗi xảy ra khi chặn người dùng')
    }
  }

  // Activate user
  const handleActivateUser = async (userId: string) => {
    try {
      await adminApi.activeUser(userId)
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, active: true } : user
      ))
      alert('Người dùng đã được kích hoạt thành công')
    } catch (error) {
      console.error('Error activating user:', error)
      alert('Có lỗi xảy ra khi kích hoạt người dùng')
    }
  }

  // View user detail
  const handleViewDetail = (user: ListAccountResponse) => {
    setSelectedUser(user)
    setDetailVisible(true)
  }

  // Close detail drawer
  const handleCloseDetail = () => {
    setDetailVisible(false)
    setSelectedUser(null)
  }

  // Export users to Excel
  const handleExport = async () => {
    setExportLoading(true)
    try {
      const response = await adminApi.getAllUsers()
      await exportUsersToExcel(response.data)
      message.success(`Đã xuất ${response.data.length} người dùng ra file Excel`)
    } catch (error) {
      console.error('Error exporting users:', error)
      message.error('Có lỗi xảy ra khi xuất file Excel')
    } finally {
      setExportLoading(false)
    }
  }

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || 
                          (filter === 'active' && user.active) || 
                          (filter === 'blocked' && !user.active)
    return matchesSearch && matchesFilter
  })

  // Count active/blocked users
  const activeCount = users.filter(user => user.active).length
  const blockedCount = users.length - activeCount

  useEffect(() => {
    fetchUsers()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <UsersIcon className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
            <p className="text-gray-600">Quản lý tất cả người dùng trong hệ thống</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          disabled={exportLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>{exportLoading ? 'Đang xuất...' : 'Xuất Excel'}</span>
        </button>
      </div>

       {/* Error Message */}
       {error && (
         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center">
               <div className="text-red-600 mr-3">⚠️</div>
               <div>
                 <h3 className="text-red-800 font-medium">Lỗi kết nối</h3>
                 <p className="text-red-600 text-sm mt-1">{error}</p>
               </div>
             </div>
             <button
               onClick={fetchUsers}
               className="btn-primary text-sm"
             >
               Thử lại
             </button>
           </div>
         </div>
       )}

       {/* Filters */}
       <div className="card p-6">
         <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả ({users.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                filter === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
               Hoạt động ({activeCount})
            </button>
            <button
              onClick={() => setFilter('blocked')}
              className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                filter === 'blocked' 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
               Bị chặn ({blockedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cập nhật lần cuối
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="ml-2 text-gray-600">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatarUrl ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.avatarUrl}
                              alt={user.username}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <UsersIcon className="h-6 w-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.active ? 'Hoạt động' : 'Bị chặn'}
                        {/* Debug info - remove after fixing */}
                        <span className="ml-1 text-xs opacity-50">({String(user.active)})</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(user.created)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(user.updated)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleViewDetail(user)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {user.active ? (
                          <button 
                            onClick={() => handleBlockUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Chặn người dùng"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleActivateUser(user.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Kích hoạt người dùng"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-900">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Drawer */}
      <Drawer
        title="Chi tiết người dùng"
        placement="right"
        width={600}
        open={detailVisible}
        onClose={handleCloseDetail}
        destroyOnClose
      >
        {selectedUser && (
          <UserDetail 
            user={selectedUser}
            onClose={handleCloseDetail}
            onUpdate={fetchUsers}
          />
        )}
      </Drawer>
    </div>
  )
}

export default Users
