const mongoose =require("mongoose");

var ürünlerSchema =new mongoose.Schema({
    kategori_id:Number,
    ürünadi:String,
    ürünfiyati:Number,
    date:Date
})

mongoose.model("ürünler",ürünlerSchema);