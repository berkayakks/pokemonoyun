const express = require("express");
var app = express.Router();
const mongoose = require("mongoose");
const ürünler = mongoose.model("ürünler");
const kategoriler = mongoose.model("kategoriler");
const user = mongoose.model("user");
const sonoynanlar = mongoose.model("sonoynananlar");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const verifyToken = require("../middleware/verify-token");
const registercookie = require("../middleware/register-cookie");


/* sql serve bağlantısı isleri */
const sql = require('mssql')

const DbConnectionString = 'mssql://sa:Poyraz!234@185.77.1.38\\SQLEXPRESS/Emlak';
// const DbConnectionString = 'mssql://sa:123456@192.168.1.100:1433/deneme';

app.get("/sql", function (req, res) {
    sql.connect(DbConnectionString).then(pool => {
        return pool.request().query('select * from _Property');
    }).then(result => {
        sql.close();
        res.render("sql", { sql: JSON.stringify(result.recordset) });
        console.log(result.recordset);
    }).catch(err => {
        console.dir(err);
        sql.close();
    });
})
app.post("/sql", function (req, res) {
    var deneme = req.body;
    var adınız = req.body.adınız;
    sql.connect(DbConnectionString).then(pool => {
        return pool.request().query("insert into tablom (adınız,soyadınız,yasınız) values ('" + req.body.adınız + "','" + req.body.soyadınız + "'," + req.body.yasınız + ")");
    }).then(result => {
        sql.close();
        // res.render("sql", { sql: JSON.stringify(result.recordset) });
        console.log("tebrikler veri eklendi");
    }).catch(err => {
        console.dir(err);
        sql.close();
    });
})

/* sql serve bağlantısı isleri */

var model = [];

// const sql = require("msnodesqlv8");

// const connectionString = "server=DESKTOP-QR2FK3C\\BERKAY;Database=eticaret;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
// const query = "SELECT * FROM tablo1";

// sql.query(connectionString, query, (err, rows) => {
//     if(err){
//       console.log(err);
//     }
//     else{
//       console.log("sql bağlantısı başarılı")
//    

app.get("/berkary", verifyToken, (req, res) => {
    var a = 5;
    var b = req.body.sifreniz;
    res.send({ deneme: a });
})
app.get("/index", verifyToken, (req, res) => {

})
app.get("/hepsinisil", (req, res) => {
    user.deleteMany({ kullaniciadi: "berkay" }, (err, data) => {
        kategoriler.updateMany({ kategoriadi: "deneme" }, { KategoriAciklamasi: "ehhhehe" }, (err, data) => {
            if (!err) {
                res.send(data);
            }
        })
    })
})

app.get("/kullaniciekle", (req, res) => {
    var deneme = new sonoynanlar({
        kullaniciadi: "berkay",
        eklenmetarihi: Date.now(),
        sonuc: 0
    })
    deneme.save((err, data) => {
        if (!err) {
            res.send(data)
        }
    })
})
app.get("/save", (req, res) => {
    var ekle = new kategoriler({
        kategoriadi: "giyim",
        KategoriAciklamasi: "başarılı"
    })
    ekle.save((err, data) => {
        if (!err) {
            res.send(data);
        }
    })
})
app.get("/aggregate", verifyToken, (req, res) => {
    kategoriler.aggregate([
        {
            $lookup: {
                from: 'ürünlers',
                localField: '_id',
                foreignField: 'kategori_id',
                as: 'kategoridekiürünler'
            }
        },
        {
            $unwind: {
                path: '$kategoridekiürünler',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: {
                    _id: '$_id',
                    kategoriadi: '$kategoriadi',
                    KategoriAciklamasi: '$KategoriAciklamasi'
                },
                ürünler: {
                    $push: '$kategoridekiürünler'
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                kategoriadi: '$_id.kategoriadi',
                KategoriAciklamasi: '$_id.KategoriAciklamasi',
                ürünler: '$ürünler'
            }
        }
    ], (err, data) => {
        if (!err) {
            res.send(data);
        }
    })
    // Promise.then((data) => {
    //     res.send(data);
    // }).catch((err) => {
    //     res.send(err);
    // })
})
app.get("/deneme2", (req, res) => {
    ürünler.find({}, (err, data) => {
        model[ürünler] = data
        if (!err) {
            res.render("index", {
                list: JSON.stringify(model[ürünler])
            })
        }
    })
})
app.get("/urunekle", (req, res) => {
    var ekle = new ürünler({
        kategori_id: 10,
        ürünadi: "deneme4",
        ürünfiyati: 10000,
        date: Date.now()
    })
    ekle.save((err, data) => {
        res.send({ status: 1 })
    })
})
app.get("/urunlerigetir", (req, res) => {
    const Promise = ürünler.find({ kategori_id: 10 }).limit(3).sort({ date: -1 })
    Promise.then((data) => {
        res.json(data)
    }).catch((err) => {
        res.json(err)
    })
})
app.get("/register", (req, res) => {
    res.render("register", {
        list: "deneme"
    })
})
app.post("/register", (req, res) => {
    bcrypt.hash(req.body.sifre, 10, function (err, hash) {
        var ekle = new user({
            kullaniciadi: req.body.kullaniciadi,
            sifre: hash,
            email: req.body.email,
            doğrulama: req.body.doğrulama,
            puan: 1500,
            galibiyet:0,
            maglubiyet:0
        })
        ekle.save((err, data) => {
            if (!err) {
                // res.cookie('kullanici',data)
                res.redirect("/login")
            }
        })
    });
})
app.get("/login", (req, res) => {
    res.render("login");
})
app.post("/login", (req, res) => {
    user.findOne({ kullaniciadi: req.body.kullaniciadi }, (err, user) => {
        if (err) {
            throw err
        }
        if (!user) {
            res.json({
                status: false,
                message: "kullanıcı adı bulunamadı"
            })
        }
        else {
            bcrypt.compare(req.body.sifre, user.sifre).then((data) => {
                if (!data) {
                    res.json({
                        status: false,
                        message: "sifreniz uyuşmuyor"
                    })
                }
                else {
                    const payload = {
                        kullaniciadi: req.body.kullaniciadi,
                        sifre: req.body.sifre,
                        puan: user.puan
                    }
                    // res.cookie('kullanici',user)
                    const token = jwt.sign(payload, req.app.get('api_secret_key'), { expiresIn: 720 })
                    verifyToken.token = token;
                    res.cookie('auth', token);
                    console.log(token);
                    // res.send({
                    //     status: true,
                    //     token: token
                    // })
                    res.redirect("/index");
                }
            })
        }
    })
})
app.post("/guncelle", (req, res) => {
    var data = req.body;
    if (data.puangüncelle == "1") {
        user.findOneAndUpdate({ kullaniciadi: data.kullaniciadi }, { $inc: { puan: +50 ,galibiyet:+1} }, { upsert: true, new: true }, (err, data) => {
            var sonoyunekle =new sonoynanlar({
                kullaniciadi:data.kullaniciadi,
                eklenmetarihi:Date.now(),
                sonuc:1
            })
            sonoyunekle.save();
            if (!err) {
                res.send(data);
            }
        })
    }
    else {
        user.findOneAndUpdate({ kullaniciadi: data.kullaniciadi }, { $inc: { puan: -50,maglubiyet:+1 }},{ upsert: true, new: true }, (err, data) => {
            var sonoyunekle =new sonoynanlar({
                kullaniciadi:data.kullaniciadi,
                eklenmetarihi:Date.now(),
                sonuc:0
            })
            sonoyunekle.save();
            
            if (!err) {
                res.send(data);
            }
        })
    }
})
app.get("/kullaniciprofil", verifyToken, (req, res) => {
    res.render("kullaniciprofil");
})
app.get("/profilepage", verifyToken, (req, res) => {
    // res.render("profilepages");
})
app.get("/giris",(req,res)=>{
    res.render("giris");
})

module.exports = app;