// 配置檔案測試腳本
// 使用方法: node test-config.js

import { readFileSync } from 'fs';

try {
    // 讀取配置檔案
    const configContent = readFileSync('config.json', 'utf8');
    const config = JSON.parse(configContent);
    
    console.log('✅ 配置檔案載入成功');
    console.log('📋 Kintone 配置:');
    console.log('   Domain:', config.kintone.domain);
    console.log('   Username:', config.kintone.username);
    console.log('   Apps:', JSON.stringify(config.kintone.apps));
    console.log('   Port:', config.server.port);
    
    // 驗證必要欄位
    const required = [
        'kintone.domain',
        'kintone.username',
        'kintone.password',
        'kintone.apps.studentAuth',
        'kintone.apps.teacherAuth'
    ];
    
    let allValid = true;
    for (const field of required) {
        const value = field.split('.').reduce((obj, key) => obj?.[key], config);
        if (!value) {
            console.log('❌ 缺少必要欄位:', field);
            allValid = false;
        }
    }
    
    if (allValid) {
        console.log('✅ 所有必要欄位都存在');
        console.log('🎉 配置驗證完成！');
        console.log('現在可以執行: node server-config.js');
    } else {
        console.log('❌ 配置驗證失敗');
        process.exit(1);
    }
    
} catch (error) {
    console.error('❌ 配置檔案錯誤:', error.message);
    process.exit(1);
} 