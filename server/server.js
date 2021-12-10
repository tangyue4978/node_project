const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const dns = require('dns')

dns.lookup('iana.org', (err, address, family) => {
  console.log('IP 地址: %j 地址族: IPv%s', address, family);
});

// 获取本地ip
const ip = (() => {
  let interfaces = require("os").networkInterfaces();
  
  for (let devName in interfaces) {
    let iface = interfaces[devName];

    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];

      if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
        return alias.address;
      }
    }
  }
})();

 
let server = http.createServer(function(req,res){
	console.log(req.url)
        
    var staticPath = path.join(__dirname, ''); 
    var pathObj = url.parse(req.url, true);

    // console.log(pathObj, __dirname)
    
    if(pathObj.pathname =='/'){                 //如果没有后缀，默认他显示是index.html
        pathObj.pathname += 'index.html';    
    }

    if(pathObj.pathname =='/clear'){                 //如果没有后缀，默认他显示是index.html
        pathObj.pathname += 'clear.html';    
    }
    
    var filePath = path.join(staticPath, pathObj.pathname);
    
    //异步读取文件数据
    fs.readFile(filePath,'binary',function(err, fileContent){
        if(err){
            res.writeHead(404,"Not Found");
            res.end('<h1>404 Not Found!</h1>')  
        }else{
            res.writeHead(200, 'ok');
            res.write(fileContent, 'binary');
            res.end();  
        }
    });
});
 
server.listen(3333);
console.log('服务器已打开, 可以运行 http://' + ip + ':3333');