import { Button, DatePicker, Form, Input, Modal, Select, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { challengesApi } from '../../services/challengesApi'
import type { Challenge, CreateChallengeDto, UpdateChallengeDto } from '../../types/challenge'
import { CHALLENGE_TYPE_CONFIG } from '../../types/challenge'

interface ChallengeFormProps {
  visible: boolean
  challenge: Challenge | null
  isEditing: boolean
  onClose: () => void
  onSubmit: () => void
}

const ChallengeForm: React.FC<ChallengeFormProps> = ({
  visible,
  challenge,
  isEditing,
  onClose,
  onSubmit
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible) {
      if (isEditing && challenge) {
        form.setFieldsValue({
          title: challenge.title,
          description: challenge.description,
          type: challenge.type,
          startDate: challenge.startDate ? new Date(challenge.startDate) : null,
          endDate: challenge.endDate ? new Date(challenge.endDate) : null,
          reward: challenge.reward
        })
      } else {
        form.resetFields()
      }
    }
  }, [visible, isEditing, challenge, form])

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true)
      
      const formData = {
        ...values,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString()
      }
      
      if (isEditing && challenge) {
        // Update existing challenge
        const updateData: UpdateChallengeDto = formData
        await challengesApi.updateChallenge(challenge.id, updateData)
        message.success('Cập nhật thử thách thành công')
      } else {
        // Create new challenge
        const createData: CreateChallengeDto = formData
        await challengesApi.createChallenge(createData)
        message.success('Tạo thử thách thành công')
      }
      
      onSubmit()
    } catch (error) {
      console.error('Error saving challenge:', error)
      message.error(isEditing ? 'Không thể cập nhật thử thách' : 'Không thể tạo thử thách')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  const challengeTypeOptions = Object.entries(CHALLENGE_TYPE_CONFIG).map(([key, config]) => ({
    label: config.label,
    value: key
  }))

  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa thử thách' : 'Tạo thử thách mới'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="title"
            label="Tiêu đề thử thách"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề thử thách' },
              { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự' },
              { max: 100, message: 'Tiêu đề không được quá 100 ký tự' }
            ]}
          >
            <Input 
              placeholder="Nhập tiêu đề thử thách..."
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại thử thách"
            rules={[
              { required: true, message: 'Vui lòng chọn loại thử thách' }
            ]}
          >
            <Select
              placeholder="Chọn loại thử thách"
              size="large"
              options={challengeTypeOptions}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          label="Mô tả thử thách"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả thử thách' },
            { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự' },
            { max: 500, message: 'Mô tả không được quá 500 ký tự' }
          ]}
        >
          <Input.TextArea
            placeholder="Nhập mô tả chi tiết cho thử thách này..."
            rows={4}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            rules={[
              { required: true, message: 'Vui lòng chọn ngày bắt đầu' }
            ]}
          >
            <DatePicker
              placeholder="Chọn ngày bắt đầu"
              size="large"
              className="w-full"
              showTime
              format="DD/MM/YYYY HH:mm"
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="Ngày kết thúc"
            rules={[
              { required: true, message: 'Vui lòng chọn ngày kết thúc' }
            ]}
          >
            <DatePicker
              placeholder="Chọn ngày kết thúc"
              size="large"
              className="w-full"
              showTime
              format="DD/MM/YYYY HH:mm"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="reward"
          label={
            <span>
              Phần thưởng
              <span className="text-gray-400 text-sm font-normal"> (Tùy chọn)</span>
            </span>
          }
          rules={[
            { max: 200, message: 'Mô tả phần thưởng không được quá 200 ký tự' }
          ]}
        >
          <Input.TextArea
            placeholder="Nhập mô tả phần thưởng cho thử thách..."
            rows={3}
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

export default ChallengeForm
