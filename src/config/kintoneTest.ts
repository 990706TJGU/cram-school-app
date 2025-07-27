// 測試用的 Kintone 配置
export const KINTONE_TEST_CONFIG = {
  // 測試網域（請替換為您的實際網域）
  DOMAIN: 'yqconstruction.cybozu.com',
  
  // 測試應用程式 ID
  APPS: {
    STUDENT_AUTH: '222',
    TEACHER_AUTH: '224',
    LINE_BINDING: '225',
  },
  
  // 測試 API Token（請替換為您的實際 Token）
  API_TOKEN: 'cy.s.api1.eyJraWQiOiJ2MSIsInR5cCI6IkpXVCIsImFsZyI6IkhTMjU2In0.eyJyYW5kIjoiYmYzNDg1ZDktZTliNy00NWUyLWEzM2EtOGZkOGQ2YmJiZjJhIiwiaXNzIjoiYzc1MTE1MiIsImV4cCI6MTgwMDg1NjE4OX0.OJiZkP1JWWTy9o5TtYtil3ZY8EPNpy9NHB7E6ZwtwpU',
  
  // 基本 URL
  get BASE_URL() {
    return `https://${this.DOMAIN}/k/v1`
  },
  
  // 檔案下載 URL
  get FILE_URL() {
    return `https://${this.DOMAIN}/k/v1/file`
  }
}

// 測試模式標記
export const IS_TEST_MODE = true 