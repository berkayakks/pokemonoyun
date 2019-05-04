const mongoose =require("mongoose");


var kategorilerSchema =new mongoose.Schema({
    kategoriadi:String,
    KategoriAciklamasi:String
})
mongoose.model("kategoriler",kategorilerSchema);