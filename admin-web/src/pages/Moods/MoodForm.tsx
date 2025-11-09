import { Button, Form, Input, Modal, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { moodsApi } from '../../services/moodsApi'
import type { CreateMoodDto, Mood, UpdateMoodDto } from '../../types/mood'

interface MoodFormProps {
  visible: boolean
  mood: Mood | null
  isEditing: boolean
  onClose: () => void
  onSubmit: () => void
}

const MoodForm: React.FC<MoodFormProps> = ({
  visible,
  mood,
  isEditing,
  onClose,
  onSubmit
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible) {
      if (isEditing && mood) {
        form.setFieldsValue({
          name: mood.name,
          emoji: mood.emoji
        })
      } else {
        form.resetFields()
      }
    }
  }, [visible, isEditing, mood, form])

  const handleSubmit = async (values: CreateMoodDto) => {
    try {
      setLoading(true)
      
      if (isEditing && mood) {
        // Update existing mood
        const updateData: UpdateMoodDto = {
          name: values.name,
          emoji: values.emoji
        }
        await moodsApi.updateMood(mood.id, updateData)
        message.success('Cập nhật mood thành công')
      } else {
        // Create new mood
        await moodsApi.createMood(values)
        message.success('Tạo mood thành công')
      }
      
      onSubmit()
    } catch (error) {
      console.error('Error saving mood:', error)
      message.error(isEditing ? 'Không thể cập nhật mood' : 'Không thể tạo mood')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa mood' : 'Thêm mood mới'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          name="emoji"
          label="Emoji"
          rules={[
            { required: true, message: 'Vui lòng nhập emoji' },
            { 
              validator: (_, value) => {
                if (!value || value.trim() === '') {
                  return Promise.reject(new Error('Vui lòng nhập emoji'))
                }
                // Kiểm tra xem có phải emoji không (có thể là 1 ký tự hoặc nhiều ký tự emoji)
                if (value.length > 10) {
                  return Promise.reject(new Error('Emoji không được quá 10 ký tự'))
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <Input 
            placeholder="Nhập emoji (ví dụ: 😊, ❤️, 😔, 😡...)"
            size="large"
            maxLength={10}
            style={{ fontSize: '20px' }}
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên mood"
          rules={[
            { required: true, message: 'Vui lòng nhập tên mood' },
            { min: 2, message: 'Tên mood phải có ít nhất 2 ký tự' },
            { max: 50, message: 'Tên mood không được quá 50 ký tự' }
          ]}
        >
          <Input 
            placeholder="Nhập tên mood (ví dụ: Hạnh phúc, Yêu thích, Buồn...)"
            size="large"
          />
        </Form.Item>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button onClick={handleCancel} size="large">
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
          >
            {isEditing ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default MoodForm
