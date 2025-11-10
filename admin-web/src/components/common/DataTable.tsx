import { DeleteOutlined, EditOutlined, EyeOutlined, UndoOutlined } from '@ant-design/icons'
import { Button, Space, Table, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React from 'react'

// Generic interface cho data table
export interface DataTableColumn<T = any> {
  key: string
  title: string
  dataIndex?: string
  render?: (value: any, record: T, index: number) => React.ReactNode
  width?: number | string
  align?: 'left' | 'center' | 'right'
  sorter?: boolean
  filters?: Array<{ text: string; value: any }>
  onFilter?: (value: any, record: T) => boolean
}

export interface DataTableAction<T = any> {
  key: string
  label: string
  icon?: React.ReactNode
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
  danger?: boolean
  onClick: (record: T) => void
  visible?: (record: T) => boolean
}

export interface DataTableProps<T extends Record<string, any> = Record<string, any>> {
  data: T[]
  columns: DataTableColumn<T>[]
  actions?: DataTableAction<T>[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    pageSizeOptions?: string[]
    onChange: (page: number, pageSize: number) => void
    onShowSizeChange?: (current: number, size: number) => void
  }
  rowKey?: string | ((record: T) => string)
  size?: 'small' | 'middle' | 'large'
  scroll?: { x?: number; y?: number }
  emptyText?: string
  onRow?: (record: T, index: number) => {
    onClick?: (event: React.MouseEvent) => void
    onDoubleClick?: (event: React.MouseEvent) => void
  }
}

// Default actions cho common operations
export const defaultActions = {
  view: (onView: (record: any) => void): DataTableAction => ({
    key: 'view',
    label: 'Xem',
    icon: <EyeOutlined />,
    type: 'link',
    onClick: onView
  }),
  edit: (onEdit: (record: any) => void): DataTableAction => ({
    key: 'edit',
    label: 'Sửa',
    icon: <EditOutlined />,
    type: 'link',
    onClick: onEdit
  }),
  delete: (onDelete: (record: any) => void): DataTableAction => ({
    key: 'delete',
    label: 'Xóa',
    icon: <DeleteOutlined />,
    type: 'link',
    danger: true,
    onClick: onDelete
  }),
  restore: (onRestore: (record: any) => void): DataTableAction => ({
    key: 'restore',
    label: 'Khôi phục',
    icon: <UndoOutlined />,
    type: 'link',
    onClick: onRestore
  })
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  loading = false,
  pagination,
  rowKey = 'id',
  size = 'middle',
  scroll,
  emptyText = 'Không có dữ liệu',
  onRow
}: DataTableProps<T>) => {
  // Tạo columns cho Ant Design Table
  const antdColumns: ColumnsType<T> = [
    ...columns.map(col => ({
      key: col.key,
      title: col.title,
      dataIndex: col.dataIndex || col.key,
      render: col.render,
      width: col.width,
      align: col.align,
      sorter: col.sorter,
      filters: col.filters,
      onFilter: col.onFilter
    })),
    // Actions column
    ...(actions.length > 0 ? [{
      key: 'actions',
      title: 'Hành động',
      width: actions.length * 80 + 20,
      align: 'center' as const,
      render: (_: any, record: T) => (
        <Space size="small">
          {actions
            .filter(action => action.visible ? action.visible(record) : true)
            .map(action => (
              <Tooltip key={action.key} title={action.label}>
                <Button
                  type={action.type}
                  danger={action.danger}
                  size="small"
                  icon={action.icon}
                  onClick={() => action.onClick(record)}
                >
                  {action.label}
                </Button>
              </Tooltip>
            ))
          }
        </Space>
      )
    }] : [])
  ]

  return (
    <Table<T>
      columns={antdColumns}
      dataSource={data}
      loading={loading}
      pagination={pagination ? {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: pagination.showSizeChanger ?? true,
        showQuickJumper: pagination.showQuickJumper ?? true,
        pageSizeOptions: pagination.pageSizeOptions ?? ['10', '20', '50', '100'],
        onChange: pagination.onChange,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} của ${total} mục`,
        onShowSizeChange: pagination.onShowSizeChange
      } : false}
      rowKey={rowKey}
      size={size}
      scroll={scroll}
      onRow={onRow as any}
      locale={{
        emptyText: emptyText
      }}
    />
  )
}

export default DataTable
