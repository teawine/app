const mysql=require("mysql");

let connect=function(sql,param,callback){
    var db=mysql.createConnection({
      host:"192.168.191.1",   ///数据库URL
      port:"3306",     //数据库端口，默认3306
      user:"root", 
      password:"root",
      database:"als"
    });
    db.query(sql,param,callback);
    db.end();
};

module.exports=connect;
