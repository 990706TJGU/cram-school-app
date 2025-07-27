import React from 'react'
import { Button, Card, Typography, Space } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

const WelcomePage: React.FC = () => {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card style={{ 
        width: '100%', 
        maxWidth: '400px', 
        textAlign: 'center',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <Title level={2} style={{ color: '#1890ff' }}>
          🎓 李鋒個別指導系統
        </Title>
        
        <Paragraph style={{ fontSize: '16px', marginBottom: '30px' }}>
          歡迎使用李鋒個別指導管理系統
        </Paragraph>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button 
            type="primary" 
            size="large" 
            onClick={handleLogin}
            style={{ width: '100%' }}
          >
            開始使用
          </Button>
          
          <div style={{ fontSize: '14px', color: '#666' }}>
            <p>✅ React 應用程式載入成功</p>
            <p>✅ 路由系統正常運作</p>
            <p>✅ Ant Design 組件正常</p>
          </div>
        </Space>
      </Card>
    </div>
  )
}

export default WelcomePage 