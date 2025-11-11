import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, message } from 'antd'
import React, { useEffect } from 'react'
import { tagsApi } from '../../services/tagsApi'
import type { Tag, TagFormData } from '../../types/tag'

interface TagFormProps {
  visible: boolean
  tag?: Tag | null
  isEditing: boolean
  onClose: () => void
  onSubmit: () => void
}

const TagForm: React.FC<TagFormProps> = ({
  visible,
  tag,
  isEditing,
  onClose,
  onSubmit
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  // Initialize form with tag data when editing
  useEffect(() => {
    if (visible && tag && isEditing) {
      form.setFieldsValue({
        name: tag.name,
        description: tag.description
      })
    } else if (visible && !isEditing) {
      form.resetFields()
    }
  }, [visible, tag, isEditing, form])

  const handleSubmit = async (values: TagFormData) => {
    setLoading(true)
    try {
      if (isEditing && tag) {
        await tagsApi.updateTag(tag.id, { name: values.name, description: values.description })
        message.success('Cập nhật tag thành công')
      } else {
        await tagsApi.createTag({ name: values.name, description: values.description })
        message.success('Tạo tag thành công')
      }
      onSubmit()
    } catch (error) {
      message.error(isEditing ? 'Không thể cập nhật tag' : 'Không thể tạo tag')
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
      title={isEditing ? 'Chỉnh sửa tag' : 'Tạo tag mới'}
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
        className="space-y-4"
      >
        {/* Tag Name */}
        <Form.Item
          name="name"
          label="Tên tag"
          rules={[
            { required: true, message: 'Vui lòng nhập tên tag' },
            { min: 2, message: 'Tên tag phải có ít nhất 2 ký tự' },
            { max: 50, message: 'Tên tag không được quá 50 ký tự' }
          ]}
        >
          <Input placeholder="Nhập tên tag" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[
            { max: 200, message: 'Mô tả không được quá 200 ký tự' }
          ]}
        >
          <Input.TextArea 
            placeholder="Nhập mô tả cho tag (tùy chọn)"
            rows={3}
            showCount
            maxLength={200}
          />
        </Form.Item>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button 
            icon={<CloseOutlined />}
            onClick={handleCancel}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<CheckOutlined />}
            loading={loading}
          >
            {isEditing ? 'Cập nhật' : 'Tạo tag'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default TagForm
