import express from 'express'

const app = express();

app.get('/dist/client.js', (req, res) => {
  return res.sendFile('./dist/client.js', { root: __dirname })
})

app.get('*', (req, res) => {
  return res.sendFile('index.html', { root: __dirname })
})

app.listen(3000)