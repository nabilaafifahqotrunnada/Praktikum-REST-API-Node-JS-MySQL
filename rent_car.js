const mysql = require('mysql')
const diff = require('diff')
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
upload = require("express-fileupload")
const md5 = require("md5")
const moment = require("moment")

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// create MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "rent_car"
})

db.connect(error => {
    if (error) {
        console.log(error.message)
    } else {
        console.log("MySQL Connected")
    }
})

app.listen(1275, () => {
    console.log("Run on port 1275")
})

app.post("/sewa",(req,res)=>{
    var a = moment(req.body.tgl_sewa) 
    var b = moment(req.body.tgl_kembali) 
    var hari = b.diff(a, 'days')
    let id_mobil = {
        id_mobil:req.body.id_mobil
    }
    let sqlM = "SELECT biaya_sewa FROM mobil WHERE ?"
    db.query(sqlM,id_mobil,(error,result)=>{
        var string=JSON.stringify(result);
        var json =  JSON.parse(string);
        let total = json[0].biaya_sewa*hari
        let data = {
            id_sewa: req.body.id_sewa,
            id_mobil: req.body.id_mobil,
            id_karyawan: req.body.id_karyawan,
            id_pelanggan: req.body.id_pelanggan,
            tgl_sewa: req.body.tgl_sewa,
            tgl_kembali: req.body.tgl_kembali,
            total: total
        }
        let sql = "insert into sewa set?"
        db.query(sql,data,(error,result)=> {
            if (error) {
                res.json({message: error.message})
            } else {
                res.json({message: "Data has been inserted"})
            }
        })

    })
})

app.get("/sewa",(req,res)=>{
    let sql = "select * from sewa"
    db.query(sql,(error,result)=>{
        errorFunc(error,result)
        res.json(response)
    })
})

app.get("/detail_sewa",(req,res)=>{
    let sql = "SELECT s.id_sewa,p.id_pelanggan,p.namapel,m.id_mobil,m.no_mobil,m.merk,k.id_karyawan,k.namakar " +
    "FROM sewa s JOIN pelanggan p ON s.id_pelanggan = p.id_pelanggan "+
    "JOIN mobil m ON s.id_mobil = m.id_mobil " +
    "JOIN karyawan k ON s.id_karyawan = k.id_karyawan"
    db.query(sql,(error,result)=>{
        errorFunc(error,result)
        res.json(response)
    })
})

app.get("/sewa/:id",(req,res)=>{
    let data = {
        id_pelanggan: req.params.id
    }
    let sql = "SELECT p.id_pelanggan,s.id_sewa,p.namapel,m.id_mobil,m.no_mobil,m.merk,k.id_karyawan,k.namakar " +
    "FROM sewa s JOIN pelanggan p ON s.id_pelanggan = p.id_pelanggan "+
    "JOIN mobil m ON s.id_mobil = m.id_mobil " +
    "JOIN karyawan k ON s.id_karyawan = k.id_karyawan WHERE p.?"
    db.query(sql,data,(error,result)=>{
        if(error){
            response = {
                message: error.message
            }
        }else{
            response = {
                count: result.length,
                data: result
            }
        }
        res.json(response)
    })
})

app.delete("/sewa/:id",(req,res)=>{
    let data = {
        id_sewa: req.params.id
    }
    let sql = "delete from sewa where ?"
    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows + " data deleted"
        }
        res.json(response)
    })
})