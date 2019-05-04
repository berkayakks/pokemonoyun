const mongoose =require("mongoose");
require("./ürünler.Model");
require("./kategoriler.Model");
require("./user");
require("./sonoynananlar.model");
mongoose.connect('mongodb://localhost:27017/eticaret',{useNewUrlParser:true},(err)=>{
    if(!err){
        console.log("mongodb bağlantısı başarılı");
    }
    else{
        console.log(err);
    }
})

