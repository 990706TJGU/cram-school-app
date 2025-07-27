import React from 'react'
import { Card, Form, DatePicker, TimePicker, Select, Input, Button, Table, Tag, Typography, Space, InputNumber } from 'antd'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { examRequestAPI } from '@/services/api'
import dayjs from 'dayjs'

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

// 表單驗證規則
const examRequestSchema = yup.object({
  requestType: yup.string().required('請選擇申請類型'),
  subject: yup.string().required('請選擇科目'),
  requestDate: yup.date().required('請選擇申請日期'),
  requestTime: yup.date().required('請選擇申請時間'),
  duration: yup.number().required('請輸入時長').min(1, '時長至少1小時'),
  examRange: yup.string().when('requestType', {
    is: 'exam',
    then: yup.string().required('請填寫考試範圍'),
  }),
  studyContent: yup.string().when('requestType', {
    is: 'self_study',
    then: yup.string().required('請填寫自習內容'),
  }),
})

const ExamRequest: React.FC = () => {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()

  // 申請表單
  const examForm = useForm({
    resolver: yupResolver(examRequestSchema),
    defaultValues: {
      requestType: '',
      subject: '',
      requestDate: '',
      requestTime: '',
      duration: 1,
      examRange: '',
      studyContent: '',
    },
  })

  // 取得申請紀錄
  const { data: examRequests } = useQuery({
    queryKey: ['exam-requests'],
    queryFn: () => examRequestAPI.getExamRequests(),
  })

  // 提交申請
  const submitExamMutation = useMutation({
    mutationFn: (data: any) => examRequestAPI.submitExamRequest(data),
    onSuccess: () => {
      message.success('申請已提交')
      queryClient.invalidateQueries({ queryKey: ['exam-requests'] })
      form.resetFields()
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '提交失敗')
    },
  })

  // 處理表單提交
  const handleSubmit = (data: any) => {
    submitExamMutation.mutate({
      ...data,
      requestDate: dayjs(data.requestDate).format('YYYY-MM-DD'),
      requestTime: dayjs(data.requestTime).format('HH:mm'),
    })
  }

  // 表格欄位
  const columns = [
    {
      title: '申請日期',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (date: string) => dayjs(date).format('YYYY/MM/DD'),
    },
    {
      title: '申請時間',
      dataIndex: 'requestTime',
      key: 'requestTime',
      render: (time: string) => time,
    },
    {
      title: '申請類型',
      dataIndex: 'requestType',
      key: 'requestType',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          exam: 'red',
          self_study: 'blue',
        }
        const labelMap: Record<string, string> = {
          exam: '小考',
          self_study: '自習',
        }
        return <Tag color={colorMap[type]}>{labelMap[type]}</Tag>
      },
    },
    {
      title: '科目',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: '時長',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => `${duration} 小時`,
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
          scheduled: 'default',
        }
        const labelMap: Record<string, string> = {
          pending: '審核中',
          approved: '已核准',
          rejected: '已拒絕',
          scheduled: '已排程',
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
      <Title level={2}>小考/自習申請</Title>

      <Card title="新增申請" style={{ marginBottom: '24px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={examForm.handleSubmit(handleSubmit)}
        >
          <Form.Item
            name="requestType"
            label="申請類型"
            rules={[{ required: true, message: '請選擇申請類型' }]}
          >
            <Select 
              placeholder="請選擇申請類型"
              onChange={(value) => {
                if (value === 'exam') {
                  form.setFieldsValue({ studyContent: '' })
                } else {
                  form.setFieldsValue({ examRange: '' })
                }
              }}
            >
              <Option value="exam">小考</Option>
              <Option value="self_study">自習</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="subject"
            label="科目"
            rules={[{ required: true, message: '請選擇科目' }]}
          >
            <Select placeholder="請選擇科目">
              <Option value="數學">數學</Option>
              <Option value="英文">英文</Option>
              <Option value="國文">國文</Option>
              <Option value="物理">物理</Option>
              <Option value="化學">化學</Option>
              <Option value="生物">生物</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="requestDate"
            label="申請日期"
            rules={[{ required: true, message: '請選擇申請日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="requestTime"
            label="申請時間"
            rules={[{ required: true, message: '請選擇申請時間' }]}
          >
            <TimePicker style={{ width: '100%' }} format="HH:mm" />
          </Form.Item>

          <Form.Item
            name="duration"
            label="時長（小時）"
            rules={[{ required: true, message: '請輸入時長' }]}
          >
            <InputNumber min={1} max={8} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="examRange"
            label="考試範圍"
            rules={[
              {
                required: examForm.watch('requestType') === 'exam',
                message: '請填寫考試範圍',
              },
            ]}
          >
            <TextArea 
              rows={3} 
              placeholder="請填寫考試範圍"
              disabled={examForm.watch('requestType') !== 'exam'}
            />
          </Form.Item>

          <Form.Item
            name="studyContent"
            label="自習內容"
            rules={[
              {
                required: examForm.watch('requestType') === 'self_study',
                message: '請填寫自習內容',
              },
            ]}
          >
            <TextArea 
              rows={3} 
              placeholder="請填寫自習內容"
              disabled={examForm.watch('requestType') !== 'self_study'}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitExamMutation.isPending}
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

      <Card title="申請紀錄">
        <Table
          columns={columns}
          dataSource={examRequests?.data?.data || []}
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

export default ExamRequest 