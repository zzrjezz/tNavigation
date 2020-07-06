const express=require('express')
const fs=require('fs')
const multer  = require('multer')
const bodyParser = require('body-parser')
const mongoose=require('mongoose')


mongoose.connect('mongodb://localhost/tourist')
mongoose.connection.once('open',()=>{console.log('链接成功')})

//Schema约束
const Schema=mongoose.Schema
var touristSchema=new Schema({
    Id:Number,
    Key:String,
    Experience: {type:String,default:'阅历目前未知'},
    Signature: {type: String,default: '今天还没有写心情'},
    Uname:{type:String,default:'还没有昵称'}
})

//创建Model实例
var touristModel=mongoose.model('touristMondel',touristSchema)

var app=express()
// app.use(bodyParser.urlencoded({ extended: false }))

//设置跨域请求
app.all('*', function (req, res, next) {
    // 设置请求头为允许跨域
    res.header('Access-Control-Allow-Origin', '*');
    // 设置服务器支持的所有头信息字段
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, sessionToken');
    // 设置服务器支持的所有跨域请求的方法
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method.toLowerCase() == 'options') {
        res.send(200);  // 让options尝试请求快速结束
    } else {
        next();
    }
});

// var upload = multer({ dest: 'uploads/' })

//使用bodyParser读取数据
app.use(bodyParser.json())


app.use(express.static('image'))

app.use(express.static('Introduction'))

app.use(express.static('node_modules'))
//
// app.use('image',express.static('image'));

//主页路由get
app.get('/',function (req,res) {
    res.sendFile(__dirname+'/view.html')

})

//主页路由post
app.post('/',function (req,res) {
    console.log(req.body.firstName)
    res.send('send ok')
})

//form路由
app.get('/form',function (req,res) {
// var form=fs.readFileSync('./pack2.html',{encoding:'utf8'})
//     res.send(form)
    res.sendFile(__dirname+'/Ucenter.html')

})

// app.get('/image',function (req,res) {
// // var form=fs.readFileSync('./pack2.html',{encoding:'utf8'})
// //     res.send(form)
//
//     res.sendFile(__dirname+'/image/LijiangRiver.jpg');
//     res.sendFile(__dirname+'/image');
//
//
// })

app.get('/Introduction/ShuiyueCave',function (req,res) {
// var form=fs.readFileSync('./pack2.html',{encoding:'utf8'})
//     res.send(form)
    res.sendFile(__dirname+'/ShuiyueCave.html')

})


//注册接口
app.post('/register',function (req,res) {

    console.log(req.body)
    console.log(req.body.Id)
    console.log(req.body.Key)


    touristModel.create({Id: req.body.Id, Key: req.body.Key},
        (err) => {
            if (!err) {
                console.log('插入成功')
                res.send('注册成功')
            } else {
                console.log('插入失败:'+err)
                res.send('注册失败')

            }
        })

    // touristModel.find({Id:'7895'},function (err,docs) {
    //     if(!err){
    //         console.log(docs[0])
    //     }
    // })

})

//登录接口
app.post('/login',function (req,res) {

    console.log(req.body)
    // console.log(req.body.Id)
    // console.log(req.body.Key)

    touristModel.find({Id:req.body.Id},function (err,docs) {
        console.log(arguments)
        console.log(err)
        if(!err){

            console.log(req.body.Id)
            console.log(docs[0])
            if(docs[0]==undefined){res.send('登录失败:账号或密码错误')}
            else{
                if(docs[0].Id==req.body.Id&&docs[0].Key==req.body.Key){
                    console.log('登录成功')
                    res.send(docs[0])
                }else{
                    console.log('err1:'+err)
                    res.send('登录失败:账号或密码错误')
                }
            }


        }else{

            // res.send('登录失败:账号或密码错误')
            console.log('执行了2')
            console.log(err)

        }
        // console.log(docs[0])
    })

})

//修改接口
app.post('/updata',function (req,res) {

    console.log(req.body)
    console.log(req.body.Id)

    touristModel.update({Id:req.body.Id},{$set:{Signature:req.body.Signature,Experience:req.body.Experience,Uname:req.body.Uname}},function (situation,docs) {
        if(docs.nModified!==0){
            console.log(arguments)
            console.log('执行成功'+docs)
        res.send('修改成功')
        }
        else{
            res.send('修改失败')
        }
    })

})

//开放ip路由
app.get('/profiles/:ip',function (req,res) {
    console.log(req.params)
console.log('ip:'+req.params.ip)
    res.send('ip:'+req.params.ip)
})

//上传文件
// app.post('/uploads',upload.single('logo'),function (req,res) {
// res.send({
//     des:'上传成功'
// })
// })


// app.use(bodyParser.urlencoded({ extended: false }))

app.listen(3000)
console.log('监听端口3000')
