
const jwt = require('jsonwebtoken');
//https://stackoverflow.com/questions/33246028/save-token-in-local-storage-using-node

var kullanicidata=[];
module.exports = (req, res, next) => {
    var url =req.url;
    var deneme =url.substring(1)
	// const token = req.headers['x-access-token'] || req.body.token || req.query.token
	const token =req.cookies.kullanici;
	if(token){
        kullanicidata[0]=token;
        res.render(""+deneme+"",{
            list: JSON.stringify(kullanicidata[0])
        })
        next();
	}else{
        kullanicidata[0]="misafir girişi";
        res.render(""+deneme+"",{
            list:JSON.stringify("misafir girişi")
        })
        next();
	}

};