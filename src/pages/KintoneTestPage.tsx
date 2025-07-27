import React, { useState } from 'react'
import { Card, Button, Input, message, Typography, Space, Alert } from 'antd'
import { authAPI } from '@/services/kintoneAPI'
import { KINTONE_TEST_CONFIG } from '@/config/kintoneTest'

const { Title, Text } = Typography

const KintoneTestPage: React.FC = () => {
  const [domain, setDomain] = useState(KINTONE_TEST_CONFIG.DOMAIN)
  const [apiToken, setApiToken] = useState(KINTONE_TEST_CONFIG.API_TOKEN)
  const [username, setUsername] = useState('student001')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const handleTestConnection = async () => {
    setLoading(true)
    setTestResult(null)

    try {
      // 更新配置
      KINTONE_TEST_CONFIG.DOMAIN = domain
      KINTONE_TEST_CONFIG.API_TOKEN = apiToken

      // 測試登入
      const response = await authAPI.studentLogin(username, password)
      
      setTestResult({
        success: response.success,
        message: response.message,
        data: response.data,
        timestamp: new Date().toLocaleString(),
      })

      if (response.success) {
        message.success('Kintone 連線測試成功！')
      } else {
        message.error(`測試失敗: ${response.message}`)
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.message || '連線錯誤',
        error: error,
        timestamp: new Date().toLocaleString(),
      })
      message.error('Kintone 連線測試失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Kintone 連線測試</Title>
      
      <Alert
        message="設定說明"
        description="請先設定您的 Kintone 網域和 API Token，然後測試連線。"
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
            <Text strong>API Token</Text>
            <Input.Password
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              placeholder="your-api-token-here"
              style={{ marginTop: '8px' }}
            />
          </div>
        </Space>
      </Card>

      <Card title="測試登入" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>測試帳號</Text>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="student001"
              style={{ marginTop: '8px' }}
            />
          </div>

          <div>
            <Text strong>測試密碼</Text>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123456"
              style={{ marginTop: '8px' }}
            />
          </div>

          <Button
            type="primary"
            onClick={handleTestConnection}
            loading={loading}
            size="large"
          >
            測試 Kintone 連線
          </Button>
        </Space>
      </Card>

      {testResult && (
        <Card title="測試結果">
          <div>
            <Text strong>狀態: </Text>
            <Text type={testResult.success ? 'success' : 'danger'}>
              {testResult.success ? '成功' : '失敗'}
            </Text>
          </div>
          <div style={{ marginTop: '8px' }}>
            <Text strong>訊息: </Text>
            <Text>{testResult.message}</Text>
          </div>
          <div style={{ marginTop: '8px' }}>
            <Text strong>時間: </Text>
            <Text>{testResult.timestamp}</Text>
          </div>
          {testResult.data && (
            <div style={{ marginTop: '16px' }}>
              <Text strong>用戶資料:</Text>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '12px', 
                borderRadius: '4px',
                marginTop: '8px',
                fontSize: '12px'
              }}>
                {JSON.stringify(testResult.data.user, null, 2)}
              </pre>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

export default KintoneTestPage 