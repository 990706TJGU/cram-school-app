import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Input,
  Button,
  message,
  Typography,
  Space,
} from 'antd'
import {
  UserOutlined,
  LockOutlined,
  BookOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'
import { authAPI } from '@/services/kintoneAPI'

const { Title, Text } = Typography

const SimpleLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, setLoading, isLoading } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!username || !password) {
      message.error('請輸入帳號和密碼')
      return
    }

    try {
      setLoading(true)
      console.log('開始登入流程...')
      console.log('帳號:', username)
      
      // 嘗試學生/家長登入
      console.log('嘗試學生登入...')
      let response = await authAPI.studentLogin(username, password)
      console.log('學生登入回應:', response)
      
      // 如果學生登入失敗，嘗試老師登入
      if (!response.success) {
        console.log('學生登入失敗，嘗試老師登入...')
        response = await authAPI.teacherLogin(username, password)
        console.log('老師登入回應:', response)
      }

      if (response.success && response.data) {
        const { user, token } = response.data
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
        message.error(response.message || '帳號或密碼錯誤')
      }
    } catch (error: any) {
      console.error('登入錯誤:', error)
      message.error('登入失敗，請檢查網路連線')
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
          }}>
            <BookOutlined style={{ fontSize: '32px', color: 'white' }} />
          </div>
          <Title level={2} style={{ 
            margin: 0, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700',
          }}>
            李鋒個別指導系統
          </Title>
          <Text style={{ 
            color: '#64748b', 
            fontSize: '16px',
            marginTop: '8px',
          }}>
            智能補習班管理平台
          </Text>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>帳號</Text>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              prefix={<UserOutlined />}
              placeholder="請輸入帳號"
              size="large"
              onPressEnter={handleLogin}
            />
          </div>

          <div>
            <Text strong>密碼</Text>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              prefix={<LockOutlined />}
              placeholder="請輸入密碼"
              size="large"
              onPressEnter={handleLogin}
            />
          </div>

          <Button
            type="primary"
            size="large"
            loading={isLoading}
            onClick={handleLogin}
            style={{ width: '100%' }}
          >
            登入
          </Button>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              測試帳號：student001 / parent001 / teacher001 / admin001
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              密碼：123456
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  )
}

export default SimpleLoginPage 