import React from 'react'
import { Calendar as AntCalendar, Badge, Card, Typography, Tag, Space } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { courseAPI } from '@/services/api'
import dayjs from 'dayjs'

const { Title } = Typography

const StudentCalendar: React.FC = () => {
  // 取得課程資料
  const { data: courses } = useQuery({
    queryKey: ['student-courses'],
    queryFn: () => courseAPI.getCalendar(),
  })

  // 取得指定日期的課程
  const getListData = (value: dayjs.Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD')
    const dayCourses = courses?.data?.data?.filter((course: any) => 
      course.courseDate === dateStr
    ) || []

    return dayCourses.map((course: any) => ({
      type: course.courseType === 'regular' ? 'success' : 
            course.courseType === 'exam' ? 'error' : 'warning',
      content: `${course.subject} - ${course.startTime}`,
      course,
    }))
  }

  // 日期單元格渲染
  const dateCellRender = (value: dayjs.Dayjs) => {
    const listData = getListData(value)
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map((item: any, index: number) => (
          <li key={index} style={{ marginBottom: '2px' }}>
            <Badge
              status={item.type as any}
              text={
                <span style={{ fontSize: '12px' }}>
                  {item.content}
                </span>
              }
            />
          </li>
        ))}
      </ul>
    )
  }

  // 月份單元格渲染
  const monthCellRender = (value: dayjs.Dayjs) => {
    const listData = getListData(value)
    return (
      <div style={{ textAlign: 'center' }}>
        {listData.length > 0 && (
          <Badge count={listData.length} style={{ backgroundColor: '#52c41a' }} />
        )}
      </div>
    )
  }

  return (
    <div>
      <Title level={2}>我的課表</Title>
      
      <Card>
        <AntCalendar
          dateCellRender={dateCellRender}
          monthCellRender={monthCellRender}
        />
      </Card>

      <div style={{ marginTop: '24px' }}>
        <Space>
          <Tag color="success">正課</Tag>
          <Tag color="error">考試</Tag>
          <Tag color="warning">自習</Tag>
        </Space>
      </div>
    </div>
  )
}

export default StudentCalendar 