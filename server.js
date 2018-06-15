const express = require('express');
 
const app = express();
 
app.get('/', (req, res) => res.send('OK'));
 
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
  .keepAliveTimeout = 500;
