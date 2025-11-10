import React, { useState, useMemo } from 'react'
import { Checkbox } from 'antd'
import DataTable, { DataTableColumn, DataTableAction } from './DataTable'
import BulkActions from './BulkActions'

interface DataTableWithBulkActionsProps<T extends Record<string, any>> {
  data: T[]
  columns: DataTableColumn<T>[]
  actions: DataTableAction<T>[]
  loading?: boolean
  pagination?: any
  rowKey: string
  scroll?: any
  onBulkDelete?: (items: T[]) => Promise<void>
  onBulkExport?: (items: T[]) => Promise<void>
  onBulkUpdate?: (items: T[], updates: any) => Promise<void>
  getItemName?: (item: T) => string
}

const DataTableWithBulkActions = <T extends Record<string, any>>({
  data,
  columns,
  actions,
  loading = false,
  pagination,
  rowKey,
  scroll,
  onBulkDelete,
  onBulkExport
}: DataTableWithBulkActionsProps<T>) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedItems, setSelectedItems] = useState<T[]>([])

  // Add selection column to the beginning
  const columnsWithSelection = useMemo(() => {
    const selectionColumn: DataTableColumn<T> = {
      key: 'selection',
      title: 'Chọn',
      width: 50,
      render: (_, record: any) => (
        <Checkbox
          checked={selectedRowKeys.includes(record[rowKey])}
          onChange={(e) => {
            const key = record[rowKey]
            if (e.target.checked) {
              setSelectedRowKeys(prev => [...prev, key])
              setSelectedItems(prev => [...prev, record])
            } else {
              setSelectedRowKeys(prev => prev.filter(k => k !== key))
              setSelectedItems(prev => prev.filter(item => (item as any)[rowKey] !== key))
            }
          }}
        />
      )
    }

    return [selectionColumn, ...columns]
  }, [columns, selectedRowKeys, data, rowKey])

  const handleBulkDelete = async (items: T[]) => {
    if (onBulkDelete) {
      await onBulkDelete(items)
      // Clear selection after successful deletion
      setSelectedRowKeys([])
      setSelectedItems([])
    }
  }

  const handleBulkExport = async (items: T[]) => {
    if (onBulkExport) {
      await onBulkExport(items)
    }
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <BulkActions
          selectedItems={selectedItems}
          onBulkDelete={handleBulkDelete}
          onBulkExport={handleBulkExport}
        />
      )}

      {/* Data Table */}
      <DataTable
        data={data}
        columns={columnsWithSelection}
        actions={actions}
        loading={loading}
        pagination={pagination}
        rowKey={rowKey}
        scroll={scroll}
      />
    </div>
  )
}

export default DataTableWithBulkActions
