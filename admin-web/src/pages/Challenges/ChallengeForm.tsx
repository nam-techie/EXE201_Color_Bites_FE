import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { challengesApi } from '../../services/challengesApi'
import type { Challenge, ChallengeType, CreateChallengeDto, UpdateChallengeDto } from '../../types/challenge'
import { CHALLENGE_TYPE_CONFIG } from '../../types/challenge'
import dayjs from 'dayjs'

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
   const [challengeType, setChallengeType] = useState<ChallengeType>('PARTNER_LOCATION')

   // Reset form when modal opens/closes
   useEffect(() => {
      if (visible) {
         if (isEditing && challenge) {
            // Calculate durationDay from startDate and endDate
            const start = dayjs(challenge.startDate)
            const end = dayjs(challenge.endDate)
            const durationDay = end.diff(start, 'day')

            form.setFieldsValue({
               title: challenge.title,
               description: challenge.description,
               challengeType: challenge.challengeType,
               restaurantId: challenge.restaurantId,
               typeObjId: challenge.typeObjId,
               targetCount: challenge.targetCount,
               startDate: challenge.startDate ? dayjs(challenge.startDate) : null,
               durationDay: durationDay > 0 ? durationDay : 7,
               rewardDescription: challenge.rewardDescription
            })
            setChallengeType(challenge.challengeType)
         } else {
            form.resetFields()
            // Set default values for new challenge
            form.setFieldsValue({
               challengeType: 'PARTNER_LOCATION',
               targetCount: 5,
               durationDay: 7
            })
            setChallengeType('PARTNER_LOCATION')
         }
      }
   }, [visible, isEditing, challenge, form])

   const handleChallengeTypeChange = (value: ChallengeType) => {
      setChallengeType(value)
      // Clear the conditional field when type changes
      if (value === 'PARTNER_LOCATION') {
         form.setFieldValue('typeObjId', undefined)
      } else {
         form.setFieldValue('restaurantId', undefined)
      }
   }

   const handleSubmit = async (values: any) => {
      try {
         setLoading(true)

         if (isEditing && challenge) {
            // Update existing challenge - sử dụng UpdateChallengeDto
            const updateData: UpdateChallengeDto = {
               title: values.title,
               description: values.description,
               challengeType: values.challengeType,
               restaurantId: values.challengeType === 'PARTNER_LOCATION' ? values.restaurantId : undefined,
               typeObjId: values.challengeType === 'THEME_COUNT' ? values.typeObjId : undefined,
               targetCount: values.targetCount,
               startDate: values.startDate?.toISOString(),
               // Calculate endDate from startDate + durationDay for update
               endDate: values.startDate ? dayjs(values.startDate).add(values.durationDay, 'day').toISOString() : undefined,
               rewardDescription: values.rewardDescription
            }
            await challengesApi.updateChallenge(challenge.id, updateData)
            message.success('Cập nhật thử thách thành công')
         } else {
            // Create new challenge - sử dụng CreateChallengeDto
            const createData: CreateChallengeDto = {
               title: values.title,
               description: values.description,
               challengeType: values.challengeType,
               restaurantId: values.challengeType === 'PARTNER_LOCATION' ? values.restaurantId : undefined,
               typeObjId: values.challengeType === 'THEME_COUNT' ? values.typeObjId : undefined,
               targetCount: values.targetCount,
               startDate: values.startDate?.toISOString(),
               durationDay: values.durationDay,
               rewardDescription: values.rewardDescription
            }
            await challengesApi.createChallenge(createData)
            message.success('Tạo thử thách thành công')
         }

         onSubmit()
      } catch (error: any) {
         console.error('Error saving challenge:', error)
         const errorMessage = error.response?.data?.message || (isEditing ? 'Không thể cập nhật thử thách' : 'Không thể tạo thử thách')
         message.error(errorMessage)
      } finally {
         setLoading(false)
      }
   }

   const handleCancel = () => {
      form.resetFields()
      onClose()
   }

   const challengeTypeOptions = Object.entries(CHALLENGE_TYPE_CONFIG).map(([key, config]) => ({
      label: (
         <div className="flex items-center space-x-2">
            <span className="text-lg">{config.icon}</span>
            <span>{config.label}</span>
         </div>
      ),
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
            {/* Title */}
            <Form.Item
               name="title"
               label="Tiêu đề thử thách"
               rules={[
                  { required: true, message: 'Vui lòng nhập tiêu đề thử thách' },
                  { min: 2, message: 'Tiêu đề phải có ít nhất 2 ký tự' },
                  { max: 200, message: 'Tiêu đề không được quá 200 ký tự' }
               ]}
            >
               <Input
                  placeholder="Nhập tiêu đề thử thách..."
                  size="large"
               />
            </Form.Item>

            {/* Description */}
            <Form.Item
               name="description"
               label="Mô tả thử thách"
               rules={[
                  { max: 1000, message: 'Mô tả không được quá 1000 ký tự' }
               ]}
            >
               <Input.TextArea
                  placeholder="Nhập mô tả chi tiết cho thử thách này..."
                  rows={4}
                  showCount
                  maxLength={1000}
               />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Challenge Type */}
               <Form.Item
                  name="challengeType"
                  label="Loại thử thách"
                  rules={[
                     { required: true, message: 'Vui lòng chọn loại thử thách' }
                  ]}
               >
                  <Select
                     placeholder="Chọn loại thử thách"
                     size="large"
                     options={challengeTypeOptions}
                     onChange={handleChallengeTypeChange}
                  />
               </Form.Item>

               {/* Target Count - REQUIRED */}
               <Form.Item
                  name="targetCount"
                  label="Mục tiêu số bài nộp"
                  rules={[
                     { required: true, message: 'Vui lòng nhập số bài nộp cần đạt' }
                  ]}
               >
                  <InputNumber
                     placeholder="Số bài nộp cần đạt"
                     size="large"
                     min={1}
                     max={1000}
                     className="w-full"
                  />
               </Form.Item>
            </div>

            {/* Conditional fields based on challengeType */}
            {challengeType === 'PARTNER_LOCATION' && (
               <Form.Item
                  name="restaurantId"
                  label="ID Nhà hàng"
                  rules={[
                     { required: true, message: 'Vui lòng nhập ID nhà hàng' }
                  ]}
                  extra="Nhập ID của nhà hàng mà thử thách này áp dụng"
               >
                  <Input
                     placeholder="Nhập ID nhà hàng..."
                     size="large"
                  />
               </Form.Item>
            )}

            {challengeType === 'THEME_COUNT' && (
               <Form.Item
                  name="typeObjId"
                  label="ID Chủ đề (Theme)"
                  rules={[
                     { required: true, message: 'Vui lòng nhập ID chủ đề' }
                  ]}
                  extra="Nhập ID của chủ đề món ăn mà thử thách này áp dụng"
               >
                  <Input
                     placeholder="Nhập ID chủ đề..."
                     size="large"
                  />
               </Form.Item>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Start Date - REQUIRED */}
               <Form.Item
                  name="startDate"
                  label="Ngày bắt đầu"
                  rules={[
                     { required: true, message: 'Vui lòng chọn ngày bắt đầu' }
                  ]}
                  extra="Ngày bắt đầu phải trong tương lai"
               >
                  <DatePicker
                     placeholder="Chọn ngày bắt đầu"
                     size="large"
                     className="w-full"
                     showTime
                     format="DD/MM/YYYY HH:mm"
                     disabledDate={(current) => current && current < dayjs().startOf('day')}
                  />
               </Form.Item>

               {/* Duration Day - REQUIRED */}
               <Form.Item
                  name="durationDay"
                  label="Số ngày diễn ra"
                  rules={[
                     { required: true, message: 'Vui lòng nhập số ngày' }
                  ]}
                  extra="Thử thách sẽ kết thúc sau số ngày này kể từ ngày bắt đầu"
               >
                  <InputNumber
                     placeholder="Số ngày"
                     size="large"
                     min={1}
                     max={365}
                     className="w-full"
                     addonAfter="ngày"
                  />
               </Form.Item>
            </div>

            {/* Reward Description */}
            <Form.Item
               name="rewardDescription"
               label={
                  <span>
                     Mô tả phần thưởng
                     <span className="text-gray-400 text-sm font-normal"> (Tùy chọn)</span>
                  </span>
               }
               rules={[
                  { max: 500, message: 'Mô tả phần thưởng không được quá 500 ký tự' }
               ]}
            >
               <Input.TextArea
                  placeholder="Nhập mô tả phần thưởng cho thử thách..."
                  rows={3}
                  showCount
                  maxLength={500}
               />
            </Form.Item>

            {/* Form Actions */}
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
