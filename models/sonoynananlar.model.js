const mongoose =require("mongoose");


var sonoynananlarSchema =new mongoose.Schema({
    kullaniciadi:String,
    eklenmetarihi:Date,
    sonuc:Number
})
mongoose.model("sonoynananlar",sonoynananlarSchema);