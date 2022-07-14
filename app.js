const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); 
const mysql = require('mysql')
const { S3, ListObjectsCommand ,GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs')
const path = require('path')
const { render } = require('ejs');
const DynamoDBStore = require('connect-dynamodb')({session: session})
const client = new S3()


app.use('/', session({
  name: 'login.session',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { path: '/', secure: false },
  store: new DynamoDBStore({
    table: 'session-table'
  })
}))

//初期ページ読み込み

app.set('view engine', 'ejs')
app.get('/', (req, res) => {
  if (req.session.user) {
    const user = req.session.user
    client.send(new ListObjectsCommand({ Bucket: 'imageserver01' }))
            .then(data => {
              const syousai = data.Contents.map(o => {return{ namae: o.Key, size: o.Size}})
              res.render('index.ejs',{
                id:syousai,
                name: "hi! " + user.name
              })
            })
  } else {
    res.render('hoge.ejs',{name:" "});
  }
})
app.get("/download", (req,res)=>{
  if(req.session.user){
    var name1 = req.query.name
    client.send(new GetObjectCommand({ Bucket: 'imageserver01', Key: name1 }))
    .then(data => {
      res.attachment(name1)
      data.Body.pipe(res)
    })
  }else{
    res.render('hoge.ejs',{name:"IDとパスワードを入力してください"})
  }
})





//ID pass読み取り
app.post("/top", (req,res)=>{
  id =req.body.mozi1;
  pass =  req.body.mozi2;
  const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'mydb'
  });
  connection.connect((err) =>{
    if(err)throw err
  })
  connection.query('SELECT * FROM users01', (err, results) =>{
    if (err){
      throw err
    }
    if (results){
      console.log(results,1);
    }
    var angou = crypto.createHash('sha256').update(pass).digest('hex')
    for (let i=0; i<results.length; ++i){
      if(id==results[i].user_id){   
        if(id==results[i].user_id && angou==results[i].password){
          req.session.user={
            user_id:results[i].user_id,
            name:results[i].name
          }
          client.send(new ListObjectsCommand({ Bucket: 'imageserver01' }))
            .then(data => {
              const syousai = data.Contents.map(o => {return{ namae: o.Key, size: o.Size}})
              res.render('index.ejs',{
                name:"hi! "+ results[i].name,
                id:syousai
              })
            })
            
       }else{
        res.render('hoge.ejs',{name: "id又はパスワードが間違っています"});
       }
      }
    }
  })
  connection.end()
});

app.listen(8080);