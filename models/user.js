const mongoose =require("mongoose");


var userSchema =new mongoose.Schema({
    kullaniciadi:String,
    email :String,
    sifre : String,
    doğrulama :String,
    puan:Number,
    galibiyet:Number,
    maglubiyet:Number
})
mongoose.model("user",userSchema);