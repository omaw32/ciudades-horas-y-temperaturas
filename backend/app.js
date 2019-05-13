//Express
const express = require('express')
const app = express();
// const https = require('https');
const service = require('./services');
const cors = require('cors')

app.use(cors())
//Api
app.get("/", (req, res) => {
  //var data = req.body;
  service.InsertarLonLen();
  service.ProcesarPromesas()
  .then((respuesta) => {
    res.send(respuesta);
  })
  .catch((error) => {
    console.log(error);
  });
});

//start our server
app.listen(3001, () => {
  console.log('Server started on port 3001');
});

//Websocket
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3030 });

wss.on('connection', function connection(ws) {
  console.log('Websocket is listen on port 3030');
  ws.on('message', function incoming(data) {
    console.log(data);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) { //client !== ws && 
        service.ProcesarPromesas()
        .then((respuesta) => {
          console.log({respuesta});
          client.send(JSON.stringify(respuesta));
        })
        .catch((error) => {
          console.log(error);
        });
      }
    });
  });
});