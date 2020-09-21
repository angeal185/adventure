const cluster = require('cluster'),
settings = require('./app/data/settings'),
acnf = settings.app,
scnf = settings.server,
port = scnf.port;

if (cluster.isMaster) {

  const { app, BrowserWindow } = require('electron');

  function createWindow () {
    const win = new BrowserWindow(acnf.browserWindow)

    win.loadURL(scnf.url + port)

    if(acnf.dev){
      win.webContents.openDevTools();
    }

  }

  app.on('window-all-closed', function(){
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  cluster.fork(function(i){
    console.log(this)
  })
  .on('message', function(msg){
    if(msg.type === 'init'){
      createWindow()
    }
  })

} else {

  const http = require('http'),
  fs = require('fs'),
  mime = scnf.mime,
  index = scnf.index,
  server = http.createServer();

  function badReq(res, code, msg){
    res.statusCode = code;
    res.statusMessage = msg;
    return res.end();
  }
  
  server.on('request', function(req,res){

    const method = req.method,
    url = req.url,
    ctype = mime[url.split('.').pop()];

    if(method === 'GET'){

      if(url === '/'){
        return res.writeHead(200, scnf.headers[0]).end(index);
      } else {

        if(ctype){
          fs.readFile('.'+ url, function(err,data){
            if(err){return badReq(res, 404, 'Not Found')}
            res.writeHead(200, {
              'Content-Type': ctype,
              'Content-Length': data.length
            }).end(data);
          })
        } else {
          return badReq(res, 406, 'Not Acceptable')
        }

      }

    } else {
      return badReq(res, 405, 'Method Not Allowed')
    }

  })
  .on('error', function(err){
    console.log(err)
  })
  .listen(port, function(){
    console.log('server listening on port:'+ port);
    process.send({type: 'init'});
  })

  process.on('message', function(msg){

    if(msg.type === 'close'){
      server.close(function(){
        console.log('server closing on port:'+ port);
      })
    }

  })

}
