// Kintone 配置
// 注意：此配置與後端 config.json 保持一致
export const KINTONE_CONFIG = {
  // Kintone 網域設定
  DOMAIN: 'yqconstruction.cybozu.com',
  
  // Kintone 應用程式 ID
  APPS: {
    STUDENT_AUTH: '222',
    TEACHER_AUTH: '224',
    LINE_BINDING: '225',
  },
  
  // API Token（已改用帳號密碼認證，此欄位保留但不使用）
  API_TOKEN: '',
  
  // 基本 URL
  get BASE_URL() {
    return `https://${this.DOMAIN}/k/v1`
  },
  
  // 檔案下載 URL
  get FILE_URL() {
    return `https://${this.DOMAIN}/k/v1/file`
  }
}

// Kintone 欄位代碼對應
export const KINTONE_FIELDS = {
  STUDENT_AUTH: {
    ID: 'id',
    STUDENT_NAME: 'student_name',
    USERNAME: 'username',
    PASSWORD: 'password',
    EMAIL: 'email',
    PHONE: 'phone',
    ROLE: 'role',
    STATUS: 'status',
    LINE_ID: 'line_id',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
  },
  TEACHER_AUTH: {
    ID: 'id',
    TEACHER_NAME: 'teacher_name',
    USERNAME: 'username',
    PASSWORD: 'password',
    EMAIL: 'email',
    PHONE: 'phone',
    ROLE: 'role',
    STATUS: 'status',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
  },
  LINE_BINDING: {
    ID: 'id',
    LINE_ID: 'line_id',
    STUDENT_NAME: 'student_name',
    STUDENT_ID: 'student_id',
    BINDING_DATE: 'binding_date',
    STATUS: 'status',
  }
}

// 角色對應
export const ROLES = {
  STUDENT: 'student',
  PARENT: 'parent',
  TEACHER: 'teacher',
  ADMIN: 'admin',
} as const

// 狀態對應
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const 