import React, { useState } from 'react'
import { Card, Input, Button, message, Typography, Space, Alert } from 'antd'

const { Title, Text } = Typography

const KintoneConfigTest: React.FC = () => {
  const [domain, setDomain] = useState('yqconstruction.cybozu.com')
  const [appId, setAppId] = useState('222')
  const [apiToken, setApiToken] = useState('cy.s.api1.eyJraWQiOiJ2MSIsInR5cCI6IkpXVCIsImFsZyI6IkhTMjU2In0.eyJyYW5kIjoiYmYzNDg1ZDktZTliNy00NWUyLWEzM2EtOGZkOGQ2YmJiZjJhIiwiaXNzIjoiYzc1MTE1MiIsImV4cCI6MTgwMDg1NjE4OX0.OJiZkP1JWWTy9o5TtYtil3ZY8EPNpy9NHB7E6ZwtwpU')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testConfig = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('http://localhost:8000/api/test-kintone-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          appId,
          apiToken
        })
      })
      
      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        message.success('配置測試成功！')
      } else {
        message.error('配置測試失敗')
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message
      })
      message.error('配置測試異常')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Kintone 配置測試</Title>
      
      <Alert
        message="配置說明"
        description="請輸入您的 Kintone 網域、應用程式 ID 和 API Token 進行測試。"
        type="info"
        showIcon
        style={{ marginBottom: '20px' }}
      />

      <Card title="Kintone 配置" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>Kintone 網域</Text>
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="your-domain.cybozu.com"
              style={{ marginTop: '8px' }}
            />
          </div>

          <div>
            <Text strong>應用程式 ID</Text>
            <Input
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="222"
              style={{ marginTop: '8px' }}
            />
          </div>

          <div>
            <Text strong>API Token</Text>
            <Input.Password
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              placeholder="your-api-token-here"
              style={{ marginTop: '8px' }}
            />
          </div>

          <Button
            type="primary"
            onClick={testConfig}
            loading={loading}
            size="large"
          >
            測試配置
          </Button>
        </Space>
      </Card>

      {result && (
        <Card title="測試結果">
          <div>
            <Text strong>狀態: </Text>
            <Text type={result.success ? 'success' : 'danger'}>
              {result.success ? '成功' : '失敗'}
            </Text>
          </div>
          <div style={{ marginTop: '8px' }}>
            <Text strong>訊息: </Text>
            <Text>{result.message}</Text>
          </div>
          {result.details && (
            <div style={{ marginTop: '16px' }}>
              <Text strong>詳細資訊:</Text>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '12px', 
                borderRadius: '4px',
                marginTop: '8px',
                fontSize: '12px'
              }}>
                {JSON.stringify(result.details, null, 2)}
              </pre>
            </div>
          )}
          {result.error && (
            <div style={{ marginTop: '16px' }}>
              <Text strong>錯誤資訊:</Text>
              <pre style={{ 
                background: '#fff2f0', 
                padding: '12px', 
                borderRadius: '4px',
                marginTop: '8px',
                fontSize: '12px',
                border: '1px solid #ffccc7'
              }}>
                {JSON.stringify(result.error, null, 2)}
              </pre>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

export default KintoneConfigTest 