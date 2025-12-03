import jsPDF from 'jspdf'
import 'jspdf-autotable'
import ExcelJS from 'exceljs'
import type { Transaction } from '../types/transaction'
import { TRANSACTION_STATUS_CONFIG } from '../types/transaction'
import type { ListAccountResponse } from '../types/user'
import type { PostResponse } from '../types/post'
import type { RestaurantResponse } from '../types/restaurant'
import type { Comment } from '../types/comment'
import type { Tag } from '../types/tag'
import type { Mood } from '../types/mood'
import type { Challenge } from '../types/challenge'
import { CHALLENGE_TYPE_CONFIG, CHALLENGE_STATUS_CONFIG } from '../types/challenge'
import { formatDate } from './formatters'

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

// CSV Export utilities
export interface CSVExportData {
  headers: string[]
  data: any[][]
  filename: string
}

export const generateCSVData = <T>(
  data: T[],
  columns: {
    key: keyof T
    title: string
    render?: (value: any, record: T) => string
  }[],
  filename: string
): CSVExportData => {
  const headers = columns.map(col => col.title)
  const csvData = data.map(record => 
    columns.map(col => {
      const value = (record as any)[col.key]
      return col.render ? col.render(value, record) : String(value || '')
    })
  )

  return {
    headers,
    data: csvData,
    filename
  }
}

// PDF Export utilities
export interface PDFExportOptions {
  title: string
  data: any[][]
  headers: string[]
  filename: string
  orientation?: 'portrait' | 'landscape'
  fontSize?: number
}

export const generatePDF = (options: PDFExportOptions): void => {
  const {
    title,
    data,
    headers,
    filename,
    orientation = 'portrait',
    fontSize = 10
  } = options

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  })

  // Add title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 14, 20)

  // Add current date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`, 14, 30)

  // Add table
  doc.autoTable({
    head: [headers],
    body: data,
    startY: 40,
    styles: {
      fontSize: fontSize,
      cellPadding: 3,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 40 }
  })

  // Save the PDF
  doc.save(`${filename}.pdf`)
}

// Excel-like export with formatting
export const exportToExcel = (data: any[], filename: string): void => {
  const csvData = generateCSVData(
    data,
    Object.keys(data[0] || {}).map(key => ({
      key,
      title: key.charAt(0).toUpperCase() + key.slice(1)
    })),
    filename
  )

  // Create CSV link and trigger download
  const csvContent = [
    csvData.headers.join(','),
    ...csvData.data.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Export utilities for different data types
export const exportUsers = (users: any[]): void => {
  const data = users.map(user => ({
    'ID': user.id,
    'Tên người dùng': user.username,
    'Email': user.email,
    'Trạng thái': user.isActive ? 'Hoạt động' : 'Bị chặn',
    'Vai trò': user.role,
    'Ngày tạo': new Date(user.created).toLocaleDateString('vi-VN')
  }))

  exportToExcel(data, 'danh-sach-nguoi-dung')
}

export const exportPosts = (posts: any[]): void => {
  const data = posts.map(post => ({
    'ID': post.id,
    'Nội dung': post.content,
    'Tác giả': post.accountName,
    'Mood': post.moodName,
    'Lượt thích': post.reactionCount,
    'Bình luận': post.commentCount,
    'Trạng thái': post.isDeleted ? 'Đã xóa' : 'Hoạt động',
    'Ngày tạo': new Date(post.createdAt).toLocaleDateString('vi-VN')
  }))

  exportToExcel(data, 'danh-sach-bai-viet')
}

export const exportRestaurants = (restaurants: any[]): void => {
  const data = restaurants.map(restaurant => ({
    'ID': restaurant.id,
    'Tên nhà hàng': restaurant.name,
    'Địa chỉ': restaurant.address,
    'Loại': restaurant.type,
    'Khu vực': restaurant.region,
    'Giá trung bình': restaurant.avgPrice,
    'Đánh giá': restaurant.rating,
    'Trạng thái': restaurant.isDeleted ? 'Đã xóa' : 'Hoạt động',
    'Ngày tạo': new Date(restaurant.createdAt).toLocaleDateString('vi-VN')
  }))

  exportToExcel(data, 'danh-sach-nha-hang')
}

export const exportTransactions = (transactions: any[]): void => {
  const data = transactions.map(transaction => ({
    'ID': transaction.id,
    'Account ID': transaction.accountId,
    'Tên người dùng': transaction.accountName,
    'Email người dùng': transaction.accountEmail,
    'Số tiền': transaction.amount,
    'Đơn vị tiền tệ': transaction.currency,
    'Loại': transaction.type,
    'Trạng thái': TRANSACTION_STATUS_CONFIG[transaction.status as keyof typeof TRANSACTION_STATUS_CONFIG]?.label || transaction.status,
    'Gói dịch vụ': transaction.plan,
    'Cổng thanh toán': transaction.gateway,
    'Mã đơn hàng': transaction.orderCode,
    'ID giao dịch nhà cung cấp': transaction.providerTxnId,
    'Ngày tạo': formatDate(transaction.createdAt, 'DD/MM/YYYY HH:mm:ss'),
    'Ngày cập nhật': formatDate(transaction.updatedAt, 'DD/MM/YYYY HH:mm:ss'),
    'Tài khoản hoạt động': transaction.accountIsActive ? 'Có' : 'Không',
    'Vai trò tài khoản': transaction.accountRole
  }))

  exportToExcel(data, 'danh-sach-giao-dich')
}

// Export transactions to Excel with full formatting and UTF-8 support
export const exportTransactionsToExcel = async (transactions: Transaction[]): Promise<void> => {
  try {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Color Bites Admin'
    workbook.created = new Date()
    workbook.modified = new Date()
    
    // Create worksheet
    const worksheet = workbook.addWorksheet('Danh sách giao dịch')
    
    // Define columns with Vietnamese headers
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 15 },
      { header: 'Account ID', key: 'accountId', width: 15 },
      { header: 'Tên người dùng', key: 'accountName', width: 20 },
      { header: 'Email người dùng', key: 'accountEmail', width: 25 },
      { header: 'Số tiền', key: 'amount', width: 15 },
      { header: 'Đơn vị tiền tệ', key: 'currency', width: 10 },
      { header: 'Loại', key: 'type', width: 15 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Gói dịch vụ', key: 'plan', width: 15 },
      { header: 'Cổng thanh toán', key: 'gateway', width: 15 },
      { header: 'Mã đơn hàng', key: 'orderCode', width: 20 },
      { header: 'ID giao dịch nhà cung cấp', key: 'providerTxnId', width: 25 },
      { header: 'Ngày tạo', key: 'createdAt', width: 20 },
      { header: 'Ngày cập nhật', key: 'updatedAt', width: 20 },
      { header: 'Tài khoản hoạt động', key: 'accountIsActive', width: 18 },
      { header: 'Vai trò tài khoản', key: 'accountRole', width: 15 }
    ]
    
    // Style header row
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1890FF' }
    }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    headerRow.height = 25
    
    // Add data rows
    transactions.forEach((transaction) => {
      const statusLabel = TRANSACTION_STATUS_CONFIG[transaction.status]?.label || transaction.status
      
      const row = worksheet.addRow({
        id: transaction.id,
        accountId: transaction.accountId,
        accountName: transaction.accountName || '',
        accountEmail: transaction.accountEmail || '',
        amount: transaction.amount || 0,
        currency: transaction.currency || 'VND',
        type: transaction.type || '',
        status: statusLabel,
        plan: transaction.plan || '',
        gateway: transaction.gateway || '',
        orderCode: transaction.orderCode || '',
        providerTxnId: transaction.providerTxnId || '',
        createdAt: formatDate(transaction.createdAt, 'DD/MM/YYYY HH:mm:ss'),
        updatedAt: formatDate(transaction.updatedAt, 'DD/MM/YYYY HH:mm:ss'),
        accountIsActive: transaction.accountIsActive ? 'Có' : 'Không',
        accountRole: transaction.accountRole || ''
      })
      
      // Format amount column as currency
      const amountCell = row.getCell('amount')
      amountCell.numFmt = '#,##0'
      amountCell.alignment = { horizontal: 'right' }
      
      // Format date columns
      const createdAtCell = row.getCell('createdAt')
      createdAtCell.alignment = { horizontal: 'center' }
      
      const updatedAtCell = row.getCell('updatedAt')
      updatedAtCell.alignment = { horizontal: 'center' }
      
      // Center align status
      const statusCell = row.getCell('status')
      statusCell.alignment = { horizontal: 'center' }
      
      // Set row height
      row.height = 20
    })
    
    // Freeze header row
    worksheet.views = [
      { state: 'frozen', ySplit: 1 }
    ]
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `danh-sach-giao-dich-${timestamp}.xlsx`
    
    // Write to buffer and download
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = filename
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    throw error
  }
}

// Export users to Excel with full formatting and UTF-8 support
export const exportUsersToExcel = async (users: ListAccountResponse[]): Promise<void> => {
  try {
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Color Bites Admin'
    workbook.created = new Date()
    workbook.modified = new Date()
    
    const worksheet = workbook.addWorksheet('Danh sách người dùng')
    
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 15 },
      { header: 'Tên người dùng', key: 'username', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Vai trò', key: 'role', width: 15 },
      { header: 'Avatar URL', key: 'avatarUrl', width: 30 },
      { header: 'Ngày tạo', key: 'created', width: 20 },
      { header: 'Ngày cập nhật', key: 'updated', width: 20 }
    ]
    
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1890FF' }
    }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    headerRow.height = 25
    
    users.forEach((user) => {
      const row = worksheet.addRow({
        id: user.id,
        username: user.username || '',
        email: (user as any).email || '',
        status: user.active ? 'Hoạt động' : 'Bị chặn',
        role: user.role || '',
        avatarUrl: user.avatarUrl || '',
        created: formatDate(user.created, 'DD/MM/YYYY HH:mm:ss'),
        updated: formatDate(user.updated, 'DD/MM/YYYY HH:mm:ss')
      })
      
      const createdCell = row.getCell('created')
      createdCell.alignment = { horizontal: 'center' }
      
      const updatedCell = row.getCell('updated')
      updatedCell.alignment = { horizontal: 'center' }
      
      const statusCell = row.getCell('status')
      statusCell.alignment = { horizontal: 'center' }
      
      row.height = 20
    })
    
    worksheet.views = [{ state: 'frozen', ySplit: 1 }]
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `danh-sach-nguoi-dung-${timestamp}.xlsx`
    
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = filename
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting users to Excel:', error)
    throw error
  }
}

// Export posts to Excel with full formatting and UTF-8 support
export const exportPostsToExcel = async (posts: PostResponse[]): Promise<void> => {
  try {
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Color Bites Admin'
    workbook.created = new Date()
    workbook.modified = new Date()
    
    const worksheet = workbook.addWorksheet('Danh sách bài viết')
    
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 15 },
      { header: 'Account ID', key: 'accountId', width: 15 },
      { header: 'Tên người dùng', key: 'accountName', width: 20 },
      { header: 'Email', key: 'authorEmail', width: 25 },
      { header: 'Nội dung', key: 'content', width: 40 },
      { header: 'Mood', key: 'moodName', width: 15 },
      { header: 'Lượt thích', key: 'reactionCount', width: 12 },
      { header: 'Bình luận', key: 'commentCount', width: 12 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Ngày tạo', key: 'createdAt', width: 20 },
      { header: 'Ngày cập nhật', key: 'updatedAt', width: 20 }
    ]
    
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1890FF' }
    }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    headerRow.height = 25
    
    posts.forEach((post) => {
      const row = worksheet.addRow({
        id: post.id,
        accountId: post.accountId || '',
        accountName: post.accountName || '',
        authorEmail: post.authorEmail || '',
        content: post.content || '',
        moodName: post.moodName || '',
        reactionCount: post.reactionCount || 0,
        commentCount: post.commentCount || 0,
        status: post.isDeleted ? 'Đã xóa' : 'Hoạt động',
        createdAt: formatDate(post.createdAt, 'DD/MM/YYYY HH:mm:ss'),
        updatedAt: formatDate(post.updatedAt, 'DD/MM/YYYY HH:mm:ss')
      })
      
      const reactionCell = row.getCell('reactionCount')
      reactionCell.alignment = { horizontal: 'right' }
      
      const commentCell = row.getCell('commentCount')
      commentCell.alignment = { horizontal: 'right' }
      
      const createdAtCell = row.getCell('createdAt')
      createdAtCell.alignment = { horizontal: 'center' }
      
      const updatedAtCell = row.getCell('updatedAt')
      updatedAtCell.alignment = { horizontal: 'center' }
      
      const statusCell = row.getCell('status')
      statusCell.alignment = { horizontal: 'center' }
      
      row.height = 20
    })
    
    worksheet.views = [{ state: 'frozen', ySplit: 1 }]
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `danh-sach-bai-viet-${timestamp}.xlsx`
    
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = filename
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting posts to Excel:', error)
    throw error
  }
}

// Export restaurants to Excel with full formatting and UTF-8 support
export const exportRestaurantsToExcel = async (restaurants: RestaurantResponse[]): Promise<void> => {
  try {
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Color Bites Admin'
    workbook.created = new Date()
    workbook.modified = new Date()
    
    const worksheet = workbook.addWorksheet('Danh sách nhà hàng')
    
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 15 },
      { header: 'Tên', key: 'name', width: 25 },
      { header: 'Địa chỉ', key: 'address', width: 30 },
      { header: 'Mô tả', key: 'description', width: 40 },
      { header: 'Loại', key: 'type', width: 15 },
      { header: 'Khu vực', key: 'region', width: 15 },
      { header: 'Giá trung bình', key: 'avgPrice', width: 15 },
      { header: 'Đánh giá', key: 'rating', width: 12 },
      { header: 'Featured', key: 'featured', width: 12 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Ngày tạo', key: 'createdAt', width: 20 }
    ]
    
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1890FF' }
    }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    headerRow.height = 25
    
    restaurants.forEach((restaurant) => {
      const row = worksheet.addRow({
        id: restaurant.id,
        name: restaurant.name || '',
        address: restaurant.address || '',
        description: restaurant.description || '',
        type: restaurant.type || '',
        region: restaurant.region || '',
        avgPrice: restaurant.avgPrice || 0,
        rating: restaurant.rating || 0,
        featured: restaurant.featured ? 'Có' : 'Không',
        status: restaurant.isDeleted ? 'Đã xóa' : 'Hoạt động',
        createdAt: formatDate(restaurant.createdAt, 'DD/MM/YYYY HH:mm:ss')
      })
      
      const avgPriceCell = row.getCell('avgPrice')
      avgPriceCell.numFmt = '#,##0'
      avgPriceCell.alignment = { horizontal: 'right' }
      
      const ratingCell = row.getCell('rating')
      ratingCell.alignment = { horizontal: 'center' }
      
      const createdAtCell = row.getCell('createdAt')
      createdAtCell.alignment = { horizontal: 'center' }
      
      const statusCell = row.getCell('status')
      statusCell.alignment = { horizontal: 'center' }
      
      row.height = 20
    })
    
    worksheet.views = [{ state: 'frozen', ySplit: 1 }]
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `danh-sach-nha-hang-${timestamp}.xlsx`
    
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = filename
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting restaurants to Excel:', error)
    throw error
  }
}

// Export comments to Excel with full formatting and UTF-8 support
export const exportCommentsToExcel = async (comments: Comment[]): Promise<void> => {
  try {
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Color Bites Admin'
    workbook.created = new Date()
    workbook.modified = new Date()
    
    const worksheet = workbook.addWorksheet('Danh sách bình luận')
    
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 15 },
      { header: 'Post ID', key: 'postId', width: 15 },
      { header: 'Post Title', key: 'postTitle', width: 30 },
      { header: 'User ID', key: 'userId', width: 15 },
      { header: 'Tên người dùng', key: 'userName', width: 20 },
      { header: 'Email', key: 'userEmail', width: 25 },
      { header: 'Nội dung', key: 'content', width: 40 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Ngày tạo', key: 'createdAt', width: 20 },
      { header: 'Ngày cập nhật', key: 'updatedAt', width: 20 }
    ]
    
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1890FF' }
    }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    headerRow.height = 25
    
    comments.forEach((comment) => {
      const statusLabel = comment.status === 'active' ? 'Hoạt động' : 
                         comment.status === 'hidden' ? 'Ẩn' : 
                         comment.status === 'reported' ? 'Bị báo cáo' : comment.status
      
      const row = worksheet.addRow({
        id: comment.id,
        postId: comment.postId || '',
        postTitle: comment.post?.title || '',
        userId: comment.userId || '',
        userName: comment.user?.name || '',
        userEmail: comment.user?.email || '',
        content: comment.content || '',
        status: statusLabel,
        createdAt: formatDate(comment.createdAt, 'DD/MM/YYYY HH:mm:ss'),
        updatedAt: formatDate(comment.updatedAt, 'DD/MM/YYYY HH:mm:ss')
      })
      
      const createdAtCell = row.getCell('createdAt')
      createdAtCell.alignment = { horizontal: 'center' }
      
      const updatedAtCell = row.getCell('updatedAt')
      updatedAtCell.alignment = { horizontal: 'center' }
      
      const statusCell = row.getCell('status')
      statusCell.alignment = { horizontal: 'center' }
      
      row.height = 20
    })
    
    worksheet.views = [{ state: 'frozen', ySplit: 1 }]
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `danh-sach-binh-luan-${timestamp}.xlsx`
    
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = filename
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting comments to Excel:', error)
    throw error
  }
}

// Export tags to Excel with full formatting and UTF-8 support
export const exportTagsToExcel = async (tags: Tag[]): Promise<void> => {
  try {
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Color Bites Admin'
    workbook.created = new Date()
    workbook.modified = new Date()
    
    const worksheet = workbook.addWorksheet('Danh sách tag')
    
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 15 },
      { header: 'Tên', key: 'name', width: 20 },
      { header: 'Mô tả', key: 'description', width: 40 },
      { header: 'Số lần sử dụng', key: 'usageCount', width: 15 },
      { header: 'Số bài viết', key: 'postCount', width: 12 },
      { header: 'Số nhà hàng', key: 'restaurantCount', width: 12 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Ngày tạo', key: 'createdAt', width: 20 },
      { header: 'Ngày cập nhật', key: 'updatedAt', width: 20 }
    ]
    
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1890FF' }
    }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    headerRow.height = 25
    
    tags.forEach((tag) => {
      const row = worksheet.addRow({
        id: tag.id,
        name: tag.name || '',
        description: tag.description || '',
        usageCount: tag.usageCount || 0,
        postCount: tag.postCount || 0,
        restaurantCount: tag.restaurantCount || 0,
        status: tag.isDeleted ? 'Đã xóa' : 'Hoạt động',
        createdAt: formatDate(tag.createdAt, 'DD/MM/YYYY HH:mm:ss'),
        updatedAt: formatDate(tag.updatedAt, 'DD/MM/YYYY HH:mm:ss')
      })
      
      const usageCountCell = row.getCell('usageCount')
      usageCountCell.alignment = { horizontal: 'right' }
      
      const postCountCell = row.getCell('postCount')
      postCountCell.alignment = { horizontal: 'right' }
      
      const restaurantCountCell = row.getCell('restaurantCount')
      restaurantCountCell.alignment = { horizontal: 'right' }
      
      const createdAtCell = row.getCell('createdAt')
      createdAtCell.alignment = { horizontal: 'center' }
      
      const updatedAtCell = row.getCell('updatedAt')
      updatedAtCell.alignment = { horizontal: 'center' }
      
      const statusCell = row.getCell('status')
      statusCell.alignment = { horizontal: 'center' }
      
      row.height = 20
    })
    
    worksheet.views = [{ state: 'frozen', ySplit: 1 }]
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `danh-sach-tag-${timestamp}.xlsx`
    
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = filename
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting tags to Excel:', error)
    throw error
  }
}

// Export moods to Excel with full formatting and UTF-8 support
export const exportMoodsToExcel = async (moods: Mood[]): Promise<void> => {
  try {
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Color Bites Admin'
    workbook.created = new Date()
    workbook.modified = new Date()
    
    const worksheet = workbook.addWorksheet('Danh sách mood')
    
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 15 },
      { header: 'Tên', key: 'name', width: 20 },
      { header: 'Emoji', key: 'emoji', width: 12 },
      { header: 'Số lần sử dụng', key: 'usageCount', width: 15 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Ngày tạo', key: 'createdAt', width: 20 },
      { header: 'Ngày cập nhật', key: 'updatedAt', width: 20 }
    ]
    
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1890FF' }
    }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    headerRow.height = 25
    
    moods.forEach((mood) => {
      const row = worksheet.addRow({
        id: mood.id,
        name: mood.name || '',
        emoji: mood.emoji || '',
        usageCount: mood.usageCount || 0,
        status: mood.isDeleted ? 'Đã xóa' : 'Hoạt động',
        createdAt: formatDate(mood.createdAt, 'DD/MM/YYYY HH:mm:ss'),
        updatedAt: mood.updatedAt ? formatDate(mood.updatedAt, 'DD/MM/YYYY HH:mm:ss') : ''
      })
      
      const usageCountCell = row.getCell('usageCount')
      usageCountCell.alignment = { horizontal: 'right' }
      
      const createdAtCell = row.getCell('createdAt')
      createdAtCell.alignment = { horizontal: 'center' }
      
      if (mood.updatedAt) {
        const updatedAtCell = row.getCell('updatedAt')
        updatedAtCell.alignment = { horizontal: 'center' }
      }
      
      const statusCell = row.getCell('status')
      statusCell.alignment = { horizontal: 'center' }
      
      row.height = 20
    })
    
    worksheet.views = [{ state: 'frozen', ySplit: 1 }]
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `danh-sach-mood-${timestamp}.xlsx`
    
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = filename
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting moods to Excel:', error)
    throw error
  }
}

// Export challenges to Excel with full formatting and UTF-8 support
export const exportChallengesToExcel = async (challenges: Challenge[]): Promise<void> => {
  try {
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Color Bites Admin'
    workbook.created = new Date()
    workbook.modified = new Date()
    
    const worksheet = workbook.addWorksheet('Danh sách thử thách')
    
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 15 },
      { header: 'Tiêu đề', key: 'title', width: 30 },
      { header: 'Mô tả', key: 'description', width: 40 },
      { header: 'Loại', key: 'type', width: 20 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Nhà hàng', key: 'restaurantName', width: 25 },
      { header: 'Target Count', key: 'targetCount', width: 15 },
      { header: 'Ngày bắt đầu', key: 'startDate', width: 20 },
      { header: 'Ngày kết thúc', key: 'endDate', width: 20 },
      { header: 'Số người tham gia', key: 'participantCount', width: 18 },
      { header: 'Số người hoàn thành', key: 'completionCount', width: 20 },
      { header: 'Ngày tạo', key: 'createdAt', width: 20 }
    ]
    
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1890FF' }
    }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    headerRow.height = 25
    
    challenges.forEach((challenge) => {
      const typeLabel = CHALLENGE_TYPE_CONFIG[challenge.challengeType]?.label || challenge.challengeType
      const statusLabel = CHALLENGE_STATUS_CONFIG[challenge.status]?.label || challenge.status
      
      const row = worksheet.addRow({
        id: challenge.id,
        title: challenge.title || '',
        description: challenge.description || '',
        type: typeLabel,
        status: statusLabel,
        restaurantName: challenge.restaurantName || '',
        targetCount: challenge.targetCount || 0,
        startDate: formatDate(challenge.startDate, 'DD/MM/YYYY HH:mm:ss'),
        endDate: formatDate(challenge.endDate, 'DD/MM/YYYY HH:mm:ss'),
        participantCount: challenge.participantCount || 0,
        createdAt: formatDate(challenge.createdAt, 'DD/MM/YYYY HH:mm:ss')
      })
      
      const targetCountCell = row.getCell('targetCount')
      targetCountCell.alignment = { horizontal: 'right' }
      
      const participantCountCell = row.getCell('participantCount')
      participantCountCell.alignment = { horizontal: 'right' }
      
      const completionCountCell = row.getCell('completionCount')
      completionCountCell.alignment = { horizontal: 'right' }
      
      const startDateCell = row.getCell('startDate')
      startDateCell.alignment = { horizontal: 'center' }
      
      const endDateCell = row.getCell('endDate')
      endDateCell.alignment = { horizontal: 'center' }
      
      const createdAtCell = row.getCell('createdAt')
      createdAtCell.alignment = { horizontal: 'center' }
      
      const statusCell = row.getCell('status')
      statusCell.alignment = { horizontal: 'center' }
      
      row.height = 20
    })
    
    worksheet.views = [{ state: 'frozen', ySplit: 1 }]
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `danh-sach-thu-thach-${timestamp}.xlsx`
    
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = filename
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting challenges to Excel:', error)
    throw error
  }
}

export const exportComments = (comments: any[]): void => {
  const data = comments.map(comment => ({
    'ID': comment.id,
    'Nội dung': comment.content,
    'Bài viết': comment.postTitle,
    'Người dùng': comment.accountName,
    'Trạng thái': comment.isDeleted ? 'Đã xóa' : 'Hoạt động',
    'Ngày tạo': new Date(comment.createdAt).toLocaleDateString('vi-VN')
  }))

  exportToExcel(data, 'danh-sach-binh-luan')
}

export const exportTags = (tags: any[]): void => {
  const data = tags.map(tag => ({
    'ID': tag.id,
    'Tên tag': tag.name,
    'Mô tả': tag.description,
    'Số lần sử dụng': tag.usageCount,
    'Trạng thái': tag.isDeleted ? 'Đã xóa' : 'Hoạt động',
    'Ngày tạo': new Date(tag.createdAt).toLocaleDateString('vi-VN')
  }))

  exportToExcel(data, 'danh-sach-tag')
}

export const exportMoods = (moods: any[]): void => {
  const data = moods.map(mood => ({
    'ID': mood.id,
    'Tên mood': mood.name,
    'Mô tả': mood.description,
    'Số lần sử dụng': mood.usageCount,
    'Trạng thái': mood.isDeleted ? 'Đã xóa' : 'Hoạt động',
    'Ngày tạo': new Date(mood.createdAt).toLocaleDateString('vi-VN')
  }))

  exportToExcel(data, 'danh-sach-mood')
}

export const exportChallenges = (challenges: any[]): void => {
  const data = challenges.map(challenge => ({
    'ID': challenge.id,
    'Tiêu đề': challenge.title,
    'Mô tả': challenge.description,
    'Loại': challenge.type,
    'Trạng thái': challenge.status,
    'Người tham gia': challenge.participantCount,
    'Hoàn thành': challenge.completionCount,
    'Ngày bắt đầu': new Date(challenge.startDate).toLocaleDateString('vi-VN'),
    'Ngày kết thúc': new Date(challenge.endDate).toLocaleDateString('vi-VN'),
    'Ngày tạo': new Date(challenge.createdAt).toLocaleDateString('vi-VN')
  }))

  exportToExcel(data, 'danh-sach-thu-thach')
}

// Generic export function
export const exportData = <T>(
  data: T[],
  columns: {
    key: keyof T
    title: string
    render?: (value: any, record: T) => string
  }[],
  filename: string,
  format: 'csv' | 'pdf' = 'csv'
): void => {
  if (format === 'csv') {
    const csvData = generateCSVData(data, columns, filename)
    
    // Create CSV link and trigger download
    const csvContent = [
      csvData.headers.join(','),
      ...csvData.data.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    const headers = columns.map(col => col.title)
    const tableData = data.map(record => 
      columns.map(col => {
        const value = record[col.key]
        return col.render ? col.render(value, record) : String(value || '')
      })
    )

    generatePDF({
      title: filename,
      data: tableData,
      headers,
      filename
    })
  }
}
