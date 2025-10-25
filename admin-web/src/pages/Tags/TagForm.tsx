import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, ColorPicker, Form, Input, Modal, message } from 'antd'
import React, { useEffect } from 'react'
import { tagsApi } from '../../services/tagsApi'
import type { Tag, TagFormData } from '../../types/tag'
import { TAG_COLORS } from '../../types/tag'

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
        color: tag.color,
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
        await tagsApi.updateTag(tag.id, values)
        message.success('Cập nhật tag thành công')
      } else {
        await tagsApi.createTag(values)
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

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
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
          <Input 
            placeholder="Nhập tên tag"
            onChange={(e) => {
              const name = e.target.value
              if (name) {
                const slug = generateSlug(name)
                form.setFieldsValue({ slug })
              }
            }}
          />
        </Form.Item>

        {/* Auto-generated Slug */}
        <Form.Item
          name="slug"
          label="Slug (tự động tạo)"
        >
          <Input disabled placeholder="Slug sẽ được tạo tự động" />
        </Form.Item>

        {/* Color Picker */}
        <Form.Item
          name="color"
          label="Màu sắc"
          rules={[{ required: true, message: 'Vui lòng chọn màu sắc' }]}
        >
          <div className="space-y-3">
            <ColorPicker 
              showText 
              format="hex"
              presets={[
                {
                  label: 'Màu đề xuất',
                  colors: TAG_COLORS.slice(0, 10)
                },
                {
                  label: 'Màu bổ sung',
                  colors: TAG_COLORS.slice(10)
                }
              ]}
            />
            <div className="text-xs text-gray-500">
              Chọn màu sắc để phân biệt tag
            </div>
          </div>
        </Form.Item>

        {/* Color Preview */}
        <Form.Item shouldUpdate={(prev, curr) => prev.color !== curr.color}>
          {({ getFieldValue }) => {
            const color = getFieldValue('color')
            const name = getFieldValue('name')
            
            if (!color || !name) return null

            return (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Xem trước:</div>
                <div className="flex items-center space-x-2">
                  <span 
                    className="px-3 py-1 rounded-full text-white text-sm font-medium"
                    style={{ backgroundColor: color }}
                  >
                    {name}
                  </span>
                </div>
              </div>
            )
          }}
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
