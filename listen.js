const express=require('express')
const app=express()


app.get('/',function (req,res) {
    res.sendFile(__dirname+'/view.html')

})


app.listen(8080)
console.log('监听成功')
