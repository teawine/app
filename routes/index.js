var express = require('express');
var router = express.Router();
const connect=require("../mysql/mysql");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//登录
router.get('/login', function(req, res, next) {
  if(req.query.pwd==="123"){
          res.send({code:1})
    }else{
          res.send({code:0})
    }
});
//添加用户
router.get('/createUser', function(req, res, next) {
    let {userId,userName,userMoney}=req.query;
    connect("select userId from alluser where userId=?",[userId],(err,info)=>{
        if(!err){
            if(info.length===0){
                connect("select userName from alluser where userName=?",[userName],(err,info)=>{
                    if(!err){
                        if(info.length===0){
                            connect("insert into alluser (userId,userName,userMoney) values (?,?,?)",[userId,userName,userMoney],(err,info)=>{
                                if(!err){
                                    res.send({code:1,msg:"创建成功"})
                                }
                            })
                        }else{
                            res.send({code:2,msg:"用户名重复"});
                        }
                    }
                })
            }else{
                res.send({code:2,msg:"用户Id重复"});
            }
        }
    })
});
//修改用户信息
router.get('/changeUser', function(req, res, next) {
    let {userId,userName}=req.query;
    connect("update alluser set userName=? where userId=?",[userName,userId],(err,info)=>{
        if(!err){
            res.send({code:1,msg:"修改成功"})
        }
    })

});
//删除用户
router.get('/removeUser', function(req, res, next) {
    let {removeId}=req.query;
    connect("delete from alluser where userId=?",[removeId],(err,info)=>{
        if(!err){
            connect("delete from allstatus where userId=?",[removeId],(err,info)=>{
                if(!err){
                    res.send({code:1,msg:"删除成功"})
                }
            })
        }
    })
});
//获取所有用户列表
router.get('/getAllUsers', function(req, res, next) {
    connect("select * from alluser",(err,info)=>{
        if(!err){
            res.send({code:1,userList:info})
        }
    })
});
//获取个人提交列表
router.get('/onlyUser', function(req, res, next) {
    let {onlyId}=req.query;
    connect("select * from allstatus where userId=?",[onlyId],(err,info)=>{
        if(!err){
            res.send({code:1,data:info})
        }
    })
});
//个人提交的记录
router.get('/addUserLog', function(req, res, next) {
    let {userId,time,money,info}=req.query;
    
    connect("insert into allstatus (userId,time,money,info) values (?,?,?,?)",[userId,time,money,info],(err,infos)=>{
        if(!err){
            connect("select userMoney from alluser where userId=?",[userId],(err,infos)=>{
                if(!err){
                    let basemoney=infos[0].userMoney;
                    basemoney=basemoney*1+money*1;
                    connect("update alluser set userMoney=? where userId=?",[basemoney,userId],(err,infos)=>{
                        if(!err){
                            res.send({code:1,msg:"提交成功"});
                        }
                    })
                }
            })
        }
    });
});

module.exports = router;
