import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Input,
  Button,
  message,
  Typography,
  Space,
  Form,
} from 'antd'
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'
import { authAPI } from '@/services/kintoneAPI'
import { KINTONE_CONFIG } from '@/config/kintone'

const { Title, Text } = Typography

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  // 根據用戶角色決定使用哪個 app ID
  const getAppId = () => {
    if (user?.role === 'teacher') {
      return KINTONE_CONFIG.APPS.TEACHER_AUTH
    }
    return KINTONE_CONFIG.APPS.STUDENT_AUTH
  }

  const handleChangePassword = async (values: any) => {
    if (!user) {
      message.error('請先登入')
      return
    }

    const { oldPassword, newPassword, confirmPassword } = values

    // 驗證新密碼
    if (newPassword !== confirmPassword) {
      message.error('新密碼與確認密碼不符')
      return
    }

    if (newPassword.length < 6) {
      message.error('新密碼至少需要6個字元')
      return
    }

    try {
      setLoading(true)
      
      const response = await authAPI.changePassword(
        user.id,
        getAppId(),
        oldPassword,
        newPassword,
        user.role
      )

      if (response.success) {
        message.success('密碼修改成功！請重新登入')
        logout()
        navigate('/login')
      } else {
        message.error(response.message || '改密碼失敗')
      }
    } catch (error: any) {
      console.error('改密碼錯誤:', error)
      message.error('改密碼失敗，請檢查網路連線')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // 根據用戶角色導向不同頁面
    if (user?.role === 'student' || user?.role === 'parent') {
      navigate('/student/dashboard')
    } else if (user?.role === 'teacher') {
      navigate('/teacher/dashboard')
    } else {
      navigate('/')
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
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 背景動畫效果 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
        animation: 'pulse 4s ease-in-out infinite alternate',
      }} />
      
      <Card
        className="glass-effect fade-in-up"
        style={{
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          margin: '0 auto',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
          }}>
            <LockOutlined style={{ fontSize: '32px', color: 'white' }} />
          </div>
          <Title level={2} style={{ 
            margin: 0, 
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700',
          }}>
            修改密碼
          </Title>
          <Text style={{ 
            color: '#64748b', 
            fontSize: '16px',
            marginTop: '8px',
          }}>
            請輸入舊密碼和新密碼
          </Text>
        </div>

        <Form
          form={form}
          onFinish={handleChangePassword}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="oldPassword"
            label="舊密碼"
            rules={[
              { required: true, message: '請輸入舊密碼' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="請輸入舊密碼"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密碼"
            rules={[
              { required: true, message: '請輸入新密碼' },
              { min: 6, message: '密碼至少需要6個字元' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="請輸入新密碼"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="確認新密碼"
            rules={[
              { required: true, message: '請確認新密碼' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('兩次輸入的密碼不一致'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="請再次輸入新密碼"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ 
                  minWidth: '120px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  height: '40px',
                  fontWeight: '600',
                }}
              >
                確認修改
              </Button>
              <Button
                onClick={handleCancel}
                style={{ 
                  minWidth: '120px',
                  borderRadius: '12px',
                  height: '40px',
                  fontWeight: '600',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  background: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ChangePasswordPage 