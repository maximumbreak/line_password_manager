module.exports = {
  LINE_TOKEN: 'linetoken input here', // ใส่ Channel access token
  LINE_API: 'https://api.line.me/v2/bot/message',
  FIREBASE: {
    PROJECT_ID: 'projectId Firebase input here', // ใส่ projectId fore Firebase
    KEY_PATH: './src/key.json' // ที่อยู่ของ key json ของ firebase ไฟล์
  },
  URL_COPY_PASSWORD: 'https://example.com/v1/api/copy?text=', // แก้ไข url ที่ deploy เพื่อใช้งานจริงได้เลย
  URL_LOGO: 'https://images2.imgbox.com/7e/0b/Cz8AV24h_o.png',
  BOT_MSG: {
    ACCOUNT: 'กรุณาระบุชื่อ Account ที่ต้องการ',
    CONFIRM: 'คุณยืนยันทำรายการหรือไม่',
    DELETE: 'ลบ {name} เรียบร้อยแล้ว'
  }
}
