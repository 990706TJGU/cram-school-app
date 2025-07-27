import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Badge,
  Button,
} from 'antd'
import {
  DashboardOutlined,
  CalendarOutlined,
  FileTextOutlined,
  BookOutlined,
  BarChartOutlined,
  FilePdfOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const StudentLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileCollapsed, setMobileCollapsed] = useState(true)

  // 選單項目
  const menuItems = [
    {
      key: '/student/dashboard',
      icon: <DashboardOutlined />,
      label: '儀表板',
    },
    {
      key: '/student/calendar',
      icon: <CalendarOutlined />,
      label: '我的課表',
    },
    {
      key: '/student/leave-request',
      icon: <FileTextOutlined />,
      label: '請假申請',
    },
    {
      key: '/student/exam-request',
      icon: <BookOutlined />,
      label: '小考/自習申請',
    },
    {
      key: '/student/learning-records',
      icon: <FileTextOutlined />,
      label: '學習紀錄',
    },
    {
      key: '/student/grades',
      icon: <BarChartOutlined />,
      label: '成績查詢',
    },
    {
      key: '/student/reports',
      icon: <FilePdfOutlined />,
      label: '學習報告',
    },
  ]

  // 用戶下拉選單
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '個人資料',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '登出',
    },
  ]

  // 處理選單點擊
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  // 處理用戶選單點擊
  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout()
      navigate('/login')
    } else if (key === 'profile') {
      // 導向個人資料頁面
      navigate('/student/profile')
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        width={250}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          if (broken) {
            setMobileCollapsed(true)
          }
        }}
        style={{
          position: 'fixed',
          height: '100vh',
          zIndex: 1000,
          left: mobileCollapsed ? -250 : 0,
          transition: 'left 0.2s',
        }}
      >
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: '700',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
        }}>
          {collapsed ? (
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '700',
            }}>
              CS
            </div>
          ) : (
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '700',
            }}>
              李鋒個別指導系統
            </div>
          )}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={mobileCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setMobileCollapsed(!mobileCollapsed)}
              style={{
                fontSize: '16px',
                width: 48,
                height: 48,
              }}
            />
            <Text strong style={{ fontSize: '18px', marginLeft: '16px' }}>
              {menuItems.find(item => item.key === location.pathname)?.label || '李鋒個別指導系統'}
            </Text>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ fontSize: '16px' }}
              />
            </Badge>

            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer', alignItems: 'center' }}>
                <Avatar
                  icon={<UserOutlined />}
                  src={user?.avatar}
                  style={{ backgroundColor: '#1890ff' }}
                />
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-start',
                  minWidth: '60px'
                }}>
                  <Text strong style={{ 
                    fontSize: '14px', 
                    lineHeight: '1.2',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100px'
                  }}>
                    {user?.name || '用戶'}
                  </Text>
                  <Text type="secondary" style={{ 
                    fontSize: '12px', 
                    lineHeight: '1.2',
                    whiteSpace: 'nowrap'
                  }}>
                    {user?.role === 'student' ? '學生' : '家長'}
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </div>
        </Header>

        <Content style={{
          margin: '16px',
          padding: '16px',
          background: 'transparent',
          borderRadius: '12px',
          minHeight: 'calc(100vh - 96px)',
          marginLeft: mobileCollapsed ? '16px' : '266px',
          transition: 'margin-left 0.2s',
        }}>
          <Outlet />
        </Content>
      </Layout>
      
      {/* 手機遮罩層 */}
      {!mobileCollapsed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
          onClick={() => setMobileCollapsed(true)}
        />
      )}
    </Layout>
  )
}

export default StudentLayout 