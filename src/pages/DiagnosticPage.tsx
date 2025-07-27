import React, { useState } from 'react'
import { Card, Button, message, Typography, Space, Alert, Divider } from 'antd'

const { Title, Text } = Typography

const DiagnosticPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>({})

  const testBackendHealth = async () => {
    setLoading(true)
    try {
      console.log('測試後端健康檢查...')
      const response = await fetch('http://localhost:8000/api/health')
      console.log('後端回應狀態:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('後端健康檢查成功:', data)
      setResults((prev: any) => ({ ...prev, health: data }))
      message.success('後端服務正常')
    } catch (error: any) {
      console.error('後端健康檢查失敗:', error)
      setResults((prev: any) => ({ ...prev, health: { error: error.message } }))
      message.error('後端服務異常')
    } finally {
      setLoading(false)
    }
  }

  const testKintoneConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/test-kintone')
      const data = await response.json()
      setResults((prev: any) => ({ ...prev, kintone: data }))
      if (data.success) {
        message.success('Kintone 連線正常')
      } else {
        message.error('Kintone 連線失敗')
      }
    } catch (error: any) {
      setResults((prev: any) => ({ ...prev, kintone: { error: error.message } }))
      message.error('Kintone 連線異常')
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/auth/student-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'student001',
          password: '123456'
        })
      })
      const data = await response.json()
      setResults((prev: any) => ({ ...prev, login: data }))
      if (data.success) {
        message.success('登入測試成功')
      } else {
        message.error('登入測試失敗')
      }
    } catch (error: any) {
      setResults((prev: any) => ({ ...prev, login: { error: error.message } }))
      message.error('登入測試異常')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>系統診斷</Title>
      
      <Alert
        message="診斷說明"
        description="這個頁面可以幫助我們檢查系統的各個組件是否正常工作。"
        type="info"
        showIcon
        style={{ marginBottom: '20px' }}
      />

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="1. 後端服務檢查">
          <Button 
            onClick={testBackendHealth} 
            loading={loading}
            type="primary"
          >
            測試後端服務
          </Button>
          {results.health && (
            <div style={{ marginTop: '16px' }}>
              <Text strong>結果:</Text>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '12px', 
                borderRadius: '4px',
                marginTop: '8px'
              }}>
                {JSON.stringify(results.health, null, 2)}
              </pre>
            </div>
          )}
        </Card>

        <Card title="2. Kintone 連線檢查">
          <Button 
            onClick={testKintoneConnection} 
            loading={loading}
            type="primary"
          >
            測試 Kintone 連線
          </Button>
          {results.kintone && (
            <div style={{ marginTop: '16px' }}>
              <Text strong>結果:</Text>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '12px', 
                borderRadius: '4px',
                marginTop: '8px'
              }}>
                {JSON.stringify(results.kintone, null, 2)}
              </pre>
            </div>
          )}
        </Card>

        <Card title="3. 登入功能檢查">
          <Button 
            onClick={testLogin} 
            loading={loading}
            type="primary"
          >
            測試登入功能
          </Button>
          {results.login && (
            <div style={{ marginTop: '16px' }}>
              <Text strong>結果:</Text>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '12px', 
                borderRadius: '4px',
                marginTop: '8px'
              }}>
                {JSON.stringify(results.login, null, 2)}
              </pre>
            </div>
          )}
        </Card>
      </Space>
    </div>
  )
}

export default DiagnosticPage 