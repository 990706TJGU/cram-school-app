import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Card,
  Form,
  Input,
  Button,
  Tabs,
  message,
  Spin,
  Typography,
  Space,
  Divider,
} from 'antd'
import {
  UserOutlined,
  LockOutlined,
  BookOutlined,
  KeyOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'
import { authAPI } from '@/services/api'
import { LoginForm } from '@/types'
import { mockUsers } from '@/utils/mockData'

const { Title, Text } = Typography
const { TabPane } = Tabs

// 表單驗證規則
const accountLoginSchema = yup.object({
  username: yup.string().required('請輸入帳號'),
  password: yup.string().required('請輸入密碼'),
})

const verificationLoginSchema = yup.object({
  studentName: yup.string().required('請輸入學生姓名'),
  verificationCode: yup.string().required('請輸入驗證碼'),
})

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, setLoading, isLoading } = useAuthStore()
  const [activeTab, setActiveTab] = useState('account')

  // 帳密登入表單
  const accountForm = useForm<LoginForm>({
    resolver: yupResolver(accountLoginSchema),
    defaultValues: {
      username: '',
      password: '',
      loginType: 'account',
    },
  })

  // 驗證碼登入表單
  const verificationForm = useForm<LoginForm>({
    resolver: yupResolver(verificationLoginSchema),
    defaultValues: {
      studentName: '',
      verificationCode: '',
      loginType: 'verification',
    },
  })

  // 帳密登入處理
  const handleAccountLogin = async (data: LoginForm) => {
    try {
      setLoading(true)
      
      // 模擬登入邏輯
      let user = null
      if (data.username === 'student001' && data.password === '123456') {
        user = mockUsers.student
      } else if (data.username === 'parent001' && data.password === '123456') {
        user = mockUsers.parent
      } else if (data.username === 'teacher001' && data.password === '123456') {
        user = mockUsers.teacher
      } else if (data.username === 'admin001' && data.password === '123456') {
        user = mockUsers.admin
      }

      if (user) {
        const token = 'mock-token-' + Date.now()
        login(user, token)
        message.success('登入成功！')
        
        // 根據角色導向不同頁面
        if (user.role === 'student' || user.role === 'parent') {
          navigate('/student/dashboard')
        } else if (user.role === 'teacher') {
          navigate('/teacher/dashboard')
        } else if (user.role === 'admin') {
          navigate('/admin/dashboard')
        }
      } else {
        message.error('帳號或密碼錯誤')
      }
    } catch (error: any) {
      message.error('登入失敗，請檢查網路連線')
    } finally {
      setLoading(false)
    }
  }

  // 驗證碼登入處理
  const handleVerificationLogin = async (data: LoginForm) => {
    try {
      setLoading(true)
      const response = await authAPI.verificationLogin({
        studentName: data.studentName!,
        verificationCode: data.verificationCode!,
      })

      if (response.data.success) {
        const { user, token } = response.data.data
        login(user, token)
        message.success('登入成功！')
        navigate('/student/dashboard')
      } else {
        message.error(response.data.message || '登入失敗')
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '登入失敗，請檢查網路連線')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <BookOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            個別指導系統
          </Title>
          <Text type="secondary">補習班管理平台</Text>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          size="large"
        >
          <TabPane
            tab={
              <span>
                <UserOutlined />
                帳密登入
              </span>
            }
            key="account"
          >
            <form onSubmit={accountForm.handleSubmit(handleAccountLogin)}>
              <Form.Item
                label="帳號"
                validateStatus={accountForm.formState.errors.username ? 'error' : ''}
                help={accountForm.formState.errors.username?.message}
              >
                <Input
                  {...accountForm.register('username')}
                  prefix={<UserOutlined />}
                  placeholder="請輸入帳號"
                  autoComplete="username"
                />
              </Form.Item>

              <Form.Item
                label="密碼"
                validateStatus={accountForm.formState.errors.password ? 'error' : ''}
                help={accountForm.formState.errors.password?.message}
              >
                <Input.Password
                  {...accountForm.register('password')}
                  prefix={<LockOutlined />}
                  placeholder="請輸入密碼"
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  style={{ width: '100%' }}
                >
                  登入
                </Button>
              </Form.Item>
            </form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <KeyOutlined />
                驗證碼登入
              </span>
            }
            key="verification"
          >
            <form onSubmit={verificationForm.handleSubmit(handleVerificationLogin)}>
              <Form.Item
                label="學生姓名"
                validateStatus={verificationForm.formState.errors.studentName ? 'error' : ''}
                help={verificationForm.formState.errors.studentName?.message}
              >
                <Input
                  {...verificationForm.register('studentName')}
                  prefix={<UserOutlined />}
                  placeholder="請輸入學生姓名"
                />
              </Form.Item>

              <Form.Item
                label="驗證碼"
                validateStatus={verificationForm.formState.errors.verificationCode ? 'error' : ''}
                help={verificationForm.formState.errors.verificationCode?.message}
              >
                <Input
                  {...verificationForm.register('verificationCode')}
                  prefix={<KeyOutlined />}
                  placeholder="請輸入驗證碼"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  style={{ width: '100%' }}
                >
                  登入
                </Button>
              </Form.Item>
            </form>
          </TabPane>
        </Tabs>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Space direction="vertical" size="small">
            <Text type="secondary" style={{ fontSize: '12px' }}>
              支援角色：學生、家長、老師、管理員
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              如有問題請聯絡管理員
            </Text>
          </Space>
        </div>
      </Card>
    </div>
  )
}

export default LoginPage 