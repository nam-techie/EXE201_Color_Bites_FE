import { useCallback, useState } from 'react'

export interface ConfirmOptions {
  title?: string
  content?: string
  okText?: string
  cancelText?: string
  type?: 'warning' | 'error' | 'info' | 'success'
  onOk?: () => void | Promise<void>
  onCancel?: () => void
}

export interface UseConfirmReturn {
  confirm: (options: ConfirmOptions) => Promise<boolean>
  modalProps: {
    visible: boolean
    title: string
    content: string
    okText: string
    cancelText: string
    type: 'warning' | 'error' | 'info' | 'success'
    loading: boolean
    onOk: () => void
    onCancel: () => void
  }
}

export const useConfirm = (): UseConfirmReturn => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({})
  const [resolve, setResolve] = useState<((value: boolean) => void) | null>(null)

  const confirm = useCallback((confirmOptions: ConfirmOptions): Promise<boolean> => {
    return new Promise((res) => {
      setOptions(confirmOptions)
      setVisible(true)
      setResolve(() => res)
    })
  }, [])

  const handleOk = useCallback(async () => {
    try {
      setLoading(true)
      
      if (options.onOk) {
        await options.onOk()
      }
      
      setVisible(false)
      resolve?.(true)
    } catch (error) {
      console.error('Error in confirm onOk:', error)
      // Don't close modal on error, let user handle it
    } finally {
      setLoading(false)
    }
  }, [options, resolve])

  const handleCancel = useCallback(() => {
    setVisible(false)
    options.onCancel?.()
    resolve?.(false)
  }, [options, resolve])

  const modalProps = {
    visible,
    title: options.title || 'Xác nhận',
    content: options.content || 'Bạn có chắc chắn muốn thực hiện hành động này?',
    okText: options.okText || 'Xác nhận',
    cancelText: options.cancelText || 'Hủy',
    type: options.type || 'warning',
    loading,
    onOk: handleOk,
    onCancel: handleCancel
  }

  return {
    confirm,
    modalProps
  }
}
