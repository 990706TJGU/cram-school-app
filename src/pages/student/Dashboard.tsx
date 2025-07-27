import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  List,
  Avatar,
  Tag,
  Typography,
  Space,
  Button,
} from 'antd'
import {
  CalendarOutlined,
  BookOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  LockOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'
import { courseAPI, learningRecordAPI, gradeAPI } from '@/services/api'
import { mockCourses, mockGrades } from '@/utils/mockData'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  // 使用模擬數據
  const todayCourses = { data: { data: mockCourses.filter(c => c.date === dayjs().format('YYYY-MM-DD')) } }
  const recentRecords = { 
    data: { 
      data: [
        {
          id: 1,
          courseTopic: '數學基礎概念',
          courseDate: '2024-01-15',
          subject: '數學',
          starRating: 4,
        },
        {
          id: 2,
          courseTopic: '英文文法練習',
          courseDate: '2024-01-14',
          subject: '英文',
          starRating: 5,
        },
      ]
    } 
  }
  const gradeStats = { data: { data: mockGrades } }

  // 計算統計數據
  const stats = {
    totalCourses: todayCourses.data.data.length,
    completedCourses: todayCourses.data.data.filter((c: any) => c.status === 'completed').length,
    averageScore: gradeStats.data.data.reduce((acc: number, grade: any) => acc + grade.score, 0) / gradeStats.data.data.length,
    totalStudyHours: recentRecords.data.data.length * 2, // 假設每堂課2小時
  }

  return (
    <div className="fade-in-up" style={{ padding: '20px', maxWidth: '100%', overflow: 'hidden' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <Title level={2} style={{ 
            margin: 0, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700',
          }}>
            歡迎回來，{user?.name}！
          </Title>
          <Text style={{ color: '#64748b', fontSize: '16px' }}>
            今天是美好的一天，讓我們開始學習吧！
          </Text>
        </div>
        <Button 
          type="primary" 
          icon={<LockOutlined />}
          onClick={() => navigate('/change-password')}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            border: 'none',
            borderRadius: '12px',
            height: '40px',
            padding: '0 20px',
          }}
        >
          修改密碼
        </Button>
      </div>
      
      {/* 統計卡片 */}
      <Row gutter={[20, 20]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="glass-effect" style={{ 
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}>
            <Statistic
              title="今日課程"
              value={stats.totalCourses}
              prefix={<CalendarOutlined style={{ color: '#3b82f6' }} />}
              valueStyle={{ 
                color: '#1e293b',
                fontSize: '28px',
                fontWeight: '700'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="glass-effect" style={{ 
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}>
            <Statistic
              title="已完成"
              value={stats.completedCourses}
              prefix={<BookOutlined style={{ color: '#10b981' }} />}
              valueStyle={{ 
                color: '#1e293b',
                fontSize: '28px',
                fontWeight: '700'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="glass-effect" style={{ 
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}>
            <Statistic
              title="平均成績"
              value={stats.averageScore.toFixed(1)}
              prefix={<TrophyOutlined style={{ color: '#f59e0b' }} />}
              suffix="分"
              valueStyle={{ 
                color: '#1e293b',
                fontSize: '28px',
                fontWeight: '700'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="glass-effect" style={{ 
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}>
            <Statistic
              title="學習時數"
              value={stats.totalStudyHours}
              prefix={<ClockCircleOutlined style={{ color: '#8b5cf6' }} />}
              suffix="小時"
              valueStyle={{ 
                color: '#1e293b',
                fontSize: '28px',
                fontWeight: '700'
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 今日課程 */}
        <Col xs={24} lg={12}>
          <Card
            title="今日課程"
            extra={<Button type="link">查看全部</Button>}
          >
            {todayCourses?.data?.data?.length > 0 ? (
              <List
                dataSource={todayCourses.data.data}
                renderItem={(course: any) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={`${course.subject} - ${course.courseType === 'regular' ? '正課' : course.courseType === 'exam' ? '考試' : '自習'}`}
                      description={`${course.startTime} - ${course.endTime}`}
                    />
                    <Tag color={
                      course.status === 'completed' ? 'green' :
                      course.status === 'ongoing' ? 'blue' :
                      course.status === 'cancelled' ? 'red' : 'default'
                    }>
                      {course.status === 'completed' ? '已完成' :
                       course.status === 'ongoing' ? '進行中' :
                       course.status === 'cancelled' ? '已取消' : '未開始'}
                    </Tag>
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Text type="secondary">今日沒有課程安排</Text>
              </div>
            )}
          </Card>
        </Col>

        {/* 最近學習紀錄 */}
        <Col xs={24} lg={12}>
          <Card
            title="最近學習紀錄"
            extra={<Button type="link">查看全部</Button>}
          >
            {recentRecords?.data?.data?.length > 0 ? (
              <List
                dataSource={recentRecords.data.data}
                renderItem={(record: any) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<FileTextOutlined />} />}
                      title={record.courseTopic}
                      description={`${record.courseDate} - ${record.subject}`}
                    />
                    <Space direction="vertical" align="end">
                      <Tag color="blue">{record.subject}</Tag>
                      {record.starRating && (
                        <div>
                          {Array.from({ length: record.starRating }).map((_, i) => (
                            <span key={i} style={{ color: '#faad14' }}>★</span>
                          ))}
                        </div>
                      )}
                    </Space>
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Text type="secondary">尚無學習紀錄</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 成績趨勢 */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24}>
          <Card title="成績趨勢">
            {gradeStats?.data?.data?.length > 0 ? (
              <div>
                <Row gutter={[16, 16]}>
                  {gradeStats.data.data.slice(0, 5).map((grade: any) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={grade.id}>
                      <Card size="small">
                        <Statistic
                          title={`${grade.subject} - ${grade.examType === 'midterm' ? '期中考' : grade.examType === 'final' ? '期末考' : '模擬考'}`}
                          value={grade.score}
                          suffix="分"
                          valueStyle={{ color: grade.score >= 80 ? '#52c41a' : grade.score >= 60 ? '#faad14' : '#ff4d4f' }}
                        />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {dayjs(grade.examDate).format('YYYY/MM/DD')}
                        </Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Text type="secondary">尚無成績資料</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 學習進度 */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24}>
          <Card title="學習進度">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div>
                  <Text>數學</Text>
                  <Progress percent={85} status="active" />
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div>
                  <Text>英文</Text>
                  <Progress percent={72} status="active" />
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div>
                  <Text>國文</Text>
                  <Progress percent={90} status="active" />
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div>
                  <Text>物理</Text>
                  <Progress percent={68} status="active" />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default StudentDashboard 