import express from 'express'

const app = express()

// 解析 JSON 请求体
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 根路由
app.get('/', (req, res) => {
  res.json({ message: '欢迎使用 Express 服务器', status: 'success' })
})

// 启动服务器
app.listen(3000, () => {
  console.log(`服务器运行在 http://127.0.0.1:3000`)
})
