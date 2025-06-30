const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5432;

app.get('/index/health',(req, res) => {
  res.json({ status: 'OK' });
});


app.listen(PORT, () => {
  console.log("Servidor backend escuchando en PORT",PORT);
});
