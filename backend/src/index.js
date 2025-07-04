const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/index/health',(req, res) => {
  res.json({ status: 'OK' });
});


app.listen(PORT, () => {
  console.log("Servidor backend escuchando en PORT",PORT);
});
