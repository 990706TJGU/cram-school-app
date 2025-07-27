import React from 'react'
import { Card, Form, DatePicker, Select, Input, Button, Table, Tag, Typography, Space, Modal, message } from 'antd'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { leaveRequestAPI } from '@/services/api'
import dayjs from 'dayjs'

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

// 表單驗證規則
const leaveRequestSchema = yup.object({
  leaveDate: yup.date().required('請選擇請假日期'),
  leaveReason: yup.string().required('請填寫請假原因'),
  leaveType: yup.string().required('請選擇請假類型'),
})

const LeaveRequest: React.FC = () => {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()

  // 請假申請表單
  const leaveForm = useForm({
    resolver: yupResolver(leaveRequestSchema),
    defaultValues: {
      leaveDate: '',
      leaveReason: '',
      leaveType: '',
    },
  })

  // 取得請假紀錄
  const { data: leaveRecords } = useQuery({
    queryKey: ['leave-records'],
    queryFn: () => leaveRequestAPI.getLeaveRecords(),
  })

  // 提交請假申請
  const submitLeaveMutation = useMutation({
    mutationFn: (data: any) => leaveRequestAPI.submitLeaveRequest(data),
    onSuccess: () => {
      message.success('請假申請已提交')
      queryClient.invalidateQueries({ queryKey: ['leave-records'] })
      form.resetFields()
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '提交失敗')
    },
  })

  // 處理表單提交
  const handleSubmit = (data: any) => {
    submitLeaveMutation.mutate({
      ...data,
      leaveDate: dayjs(data.leaveDate).format('YYYY-MM-DD'),
    })
  }

  // 表格欄位
  const columns = [
    {
      title: '請假日期',
      dataIndex: 'leaveDate',
      key: 'leaveDate',
      render: (date: string) => dayjs(date).format('YYYY/MM/DD'),
    },
    {
      title: '請假類型',
      dataIndex: 'leaveType',
      key: 'leaveType',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          sick: 'red',
          personal: 'blue',
          other: 'default',
        }
        const labelMap: Record<string, string> = {
          sick: '病假',
          personal: '事假',
          other: '其他',
        }
        return <Tag color={colorMap[type]}>{labelMap[type]}</Tag>
      },
    },
    {
      title: '請假原因',
      dataIndex: 'leaveReason',
      key: 'leaveReason',
      ellipsis: true,
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          pending: 'processing',
          approved: 'success',
          rejected: 'error',
        }
        const labelMap: Record<string, string> = {
          pending: '審核中',
          approved: '已核准',
          rejected: '已拒絕',
        }
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>
      },
    },
    {
      title: '申請時間',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY/MM/DD HH:mm'),
    },
  ]

  return (
    <div>
      <Title level={2}>請假申請</Title>

      <Card title="新增請假申請" style={{ marginBottom: '24px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={leaveForm.handleSubmit(handleSubmit)}
        >
          <Form.Item
            name="leaveDate"
            label="請假日期"
            rules={[{ required: true, message: '請選擇請假日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="leaveType"
            label="請假類型"
            rules={[{ required: true, message: '請選擇請假類型' }]}
          >
            <Select placeholder="請選擇請假類型">
              <Option value="sick">病假</Option>
              <Option value="personal">事假</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="leaveReason"
            label="請假原因"
            rules={[{ required: true, message: '請填寫請假原因' }]}
          >
            <TextArea rows={4} placeholder="請詳細說明請假原因" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLeaveMutation.isPending}
              >
                提交申請
              </Button>
              <Button onClick={() => form.resetFields()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="請假紀錄">
        <Table
          columns={columns}
          dataSource={leaveRecords?.data?.data || []}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 筆記錄`,
          }}
        />
      </Card>
    </div>
  )
}

export default LeaveRequest 