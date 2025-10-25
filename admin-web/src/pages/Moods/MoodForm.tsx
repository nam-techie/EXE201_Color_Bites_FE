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
          description: mood.description
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
          description: values.description
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
          name="name"
          label="Tên mood"
          rules={[
            { required: true, message: 'Vui lòng nhập tên mood' },
            { min: 2, message: 'Tên mood phải có ít nhất 2 ký tự' },
            { max: 50, message: 'Tên mood không được quá 50 ký tự' }
          ]}
        >
          <Input 
            placeholder="Nhập tên mood (ví dụ: Happy, Excited, Sad...)"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={
            <span>
              Mô tả
              <span className="text-gray-400 text-sm font-normal"> (Tùy chọn)</span>
            </span>
          }
          rules={[
            { max: 200, message: 'Mô tả không được quá 200 ký tự' }
          ]}
        >
          <Input.TextArea
            placeholder="Nhập mô tả cho mood này..."
            rows={4}
            showCount
            maxLength={200}
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
