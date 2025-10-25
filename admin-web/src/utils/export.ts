import jsPDF from 'jspdf'
import 'jspdf-autotable'

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
    'Người dùng': transaction.accountName,
    'Số tiền': transaction.amount,
    'Loại': transaction.type,
    'Trạng thái': transaction.status,
    'Kế hoạch': transaction.plan,
    'Cổng thanh toán': transaction.gateway,
    'Ngày tạo': new Date(transaction.createdAt).toLocaleDateString('vi-VN')
  }))

  exportToExcel(data, 'danh-sach-giao-dich')
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
