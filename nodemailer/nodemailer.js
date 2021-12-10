//引入模块 nodemailer
const nodemailer = require('nodemailer')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//引用bodyParser 这个不要忘了写
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.post('/sendMail',function(req,res){
  // 邮箱验证
  let regular = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
  let user_email = req.body.email || ''

  console.log(req.body)
  if (!regular.test(user_email)) {
    res.status(400)
    res.json({
      code: 400,
      data: '邮箱格式错误'
    })

    return
  }
  console.log(req.body)

  const senderEmail = { // 发信人信息
    host: 'smtp.163.com', // 163邮箱 为smtp.163.com
    port: 465, // 端口
    service: '163',
    user: '13554712210@163.com', // 发件人邮箱账号
    pass: 'OUVCIQNTYQAHKUMW', // 发件人邮箱的授权码 这里可以通过qq邮箱获取 并且不唯一
    nickname: '唐月' // 发信人昵称
  }

  const email = req.body.email || '1015476269@qq.com' // 收信人

  let cacheHtml = // 邮件内容
    `
      <p>目标：${req.body.aim}</p>
      <p>描述：${req.body.desc}</p>
      <p>名字：${req.body.firstname}</p>
      <p>姓氏：${req.body.lastname}</p>
      <p>邮箱：${req.body.email}</p>
      <p>电话：${req.body.phone}</p>
      <p>行业：${req.body.industry}</p>
      <p>国家：${req.body.country}</p>
      <p>预算：${req.body.budget}</p>
      <p>网站：${req.body.website}</p>
      <p>公司：${req.body.company}</p>
    `

  const config = {
    // 163邮箱 为smtp.163.com
    host: senderEmail.host,
    // 端口
    port: senderEmail.port,
    auth: {
      service: senderEmail.service,
      user: senderEmail.user,
      pass: senderEmail.pass
    }
  }

  const transporter = nodemailer.createTransport(config)

  const mail = {
    // 发件人 邮箱  '昵称<发件人邮箱>'
    from: `${senderEmail.nickname}<${senderEmail.user}>`,
    // 主题
    subject: `${req.body.aim}`,
    // 收件人 的邮箱 可以是其他邮箱 不一定是qq邮箱
    // to: 'wanghuiwen312@sina.com',
    to: email,
    // 内容
    // text: `您的激活验证码为：${checkCode}, 请24小时内有效，请谨慎保管。11111` ,
    //这里可以添加html标签
    html: cacheHtml
  }

  transporter.sendMail(mail, function(error, info){
    if(error) {
      res.status(403)

      res.json({
        code: 403,
        data: '发送失败'
      })
      return console.log(error);
    } else {
      transporter.close()

      res.status(200)
      res.json({
        code: 200,
        data: '发送成功'
      })
      console.log('mail sent:', info.response)
    }
  })
})


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

//配置服务端口
app.listen(3001, () => {
  console.log(`Example app listening at http://${ ip }:3001`)
});

