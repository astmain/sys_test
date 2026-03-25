import express from 'express'

const app = express()

// 解析 JSON 请求体
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 根路由
app.get('/', (req, res) => {
  res.json({ message: '欢迎使用 Express 服务器', status: 'success' })
})
app.get('/index', (req, res) => {
  res.json({ message: '欢迎使用 Express 服务器_index', status: 'success' })
})


// 启动服务器
app.listen(3210, () => {
  console.log(`
  服务器运行在 
  http://127.0.0.1:3210
  http://103.119.2.223:3210
  `)
})
