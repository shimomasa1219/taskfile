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
    
              res.render('index.ejs',{name: "hi! " + user.name})
            })
  } else {
    res.render('hoge.ejs',{name:" "});
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
              res.render('index.ejs',{name:"hi! "+ results[i].name,})
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