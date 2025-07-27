import React, { useState } from 'react'
import { Card, Input, Button, message, Typography, Space, Alert, Table, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const { TextArea } = Input

interface TokenConfig {
  appId: string
  appName: string
  apiToken: string
  description: string
}

const ApiTokenManager: React.FC = () => {
  const [tokens, setTokens] = useState<TokenConfig[]>([
    {
      appId: '222',
      appName: '學生認證',
      apiToken: 'cy.s.api1.eyJraWQiOiJ2MSIsInR5cCI6IkpXVCIsImFsZyI6IkhTMjU2In0.eyJyYW5kIjoiYmYzNDg1ZDktZTliNy00NWUyLWEzM2EtOGZkOGQ2YmJiZjJhIiwiaXNzIjoiYzc1MTE1MiIsImV4cCI6MTgwMDg1NjE4OX0.OJiZkP1JWWTy9o5TtYtil3ZY8EPNpy9NHB7E6ZwtwpU',
      description: '學生登入認證應用程式'
    },
    {
      appId: '224',
      appName: '老師認證',
      apiToken: 'cy.s.api1.eyJraWQiOiJ2MSIsInR5cCI6IkpXVCIsImFsZyI6IkhTMjU2In0.eyJyYW5kIjoiYmYzNDg1ZDktZTliNy00NWUyLWEzM2EtOGZkOGQ2YmJiZjJhIiwiaXNzIjoiYzc1MTE1MiIsImV4cCI6MTgwMDg1NjE4OX0.OJiZkP1JWWTy9o5TtYtil3ZY8EPNpy9NHB7E6ZwtwpU',
      description: '老師登入認證應用程式'
    },
    {
      appId: '225',
      appName: 'LINE 綁定',
      apiToken: 'cy.s.api1.eyJraWQiOiJ2MSIsInR5cCI6IkpXVCIsImFsZyI6IkhTMjU2In0.eyJyYW5kIjoiYmYzNDg1ZDktZTliNy00NWUyLWEzM2EtOGZkOGQ2YmJiZjJhIiwiaXNzIjoiYzc1MTE1MiIsImV4cCI6MTgwMDg1NjE4OX0.OJiZkP1JWWTy9o5TtYtil3ZY8EPNpy9NHB7E6ZwtwpU',
      description: 'LINE 帳號綁定應用程式'
    }
  ])

  const [editingToken, setEditingToken] = useState<TokenConfig | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const columns = [
    {
      title: '應用程式 ID',
      dataIndex: 'appId',
      key: 'appId',
      width: 100,
    },
    {
      title: '應用程式名稱',
      dataIndex: 'appName',
      key: 'appName',
      width: 150,
    },
    {
      title: 'API Token',
      dataIndex: 'apiToken',
      key: 'apiToken',
      render: (token: string) => (
        <Text code style={{ fontSize: '10px' }}>
          {token.substring(0, 20)}...
        </Text>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: TokenConfig) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            編輯
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.appId)}
          >
            刪除
          </Button>
        </Space>
      ),
    },
  ]

  const handleEdit = (token: TokenConfig) => {
    setEditingToken(token)
    setIsModalVisible(true)
  }

  const handleDelete = (appId: string) => {
    setTokens(tokens.filter(t => t.appId !== appId))
    message.success('已刪除 API Token')
  }

  const handleSave = () => {
    if (editingToken) {
      setTokens(tokens.map(t => 
        t.appId === editingToken.appId ? editingToken : t
      ))
      message.success('已更新 API Token')
    }
    setIsModalVisible(false)
    setEditingToken(null)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingToken(null)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>API Token 管理</Title>
      
      <Alert
        message="重要提醒"
        description="每個 Kintone 應用程式都需要發行獨立的 API Token。請確保每個應用程式的 API Token 都有適當的權限。"
        type="warning"
        showIcon
        style={{ marginBottom: '20px' }}
      />

      <Card title="API Token 列表">
        <Table
          columns={columns}
          dataSource={tokens}
          rowKey="appId"
          pagination={false}
          size="small"
        />
      </Card>

      {/* 編輯 Modal */}
      {isModalVisible && editingToken && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Card
            title="編輯 API Token"
            style={{ width: 600, maxHeight: '80vh', overflow: 'auto' }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong>應用程式 ID</Text>
                <Input
                  value={editingToken.appId}
                  onChange={(e) => setEditingToken({...editingToken, appId: e.target.value})}
                  style={{ marginTop: '8px' }}
                />
              </div>

              <div>
                <Text strong>應用程式名稱</Text>
                <Input
                  value={editingToken.appName}
                  onChange={(e) => setEditingToken({...editingToken, appName: e.target.value})}
                  style={{ marginTop: '8px' }}
                />
              </div>

              <div>
                <Text strong>API Token</Text>
                <TextArea
                  value={editingToken.apiToken}
                  onChange={(e) => setEditingToken({...editingToken, apiToken: e.target.value})}
                  rows={3}
                  style={{ marginTop: '8px' }}
                />
              </div>

              <div>
                <Text strong>描述</Text>
                <Input
                  value={editingToken.description}
                  onChange={(e) => setEditingToken({...editingToken, description: e.target.value})}
                  style={{ marginTop: '8px' }}
                />
              </div>

              <div style={{ textAlign: 'right' }}>
                <Space>
                  <Button onClick={handleCancel}>取消</Button>
                  <Button type="primary" onClick={handleSave}>儲存</Button>
                </Space>
              </div>
            </Space>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ApiTokenManager 