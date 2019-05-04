const express = require("express");
const mongoose = require("mongoose");
const user = mongoose.model("user");
const sonoynanlar = mongoose.model("sonoynananlar");
const jwt = require('jsonwebtoken');
//https://stackoverflow.com/questions/33246028/save-token-in-local-storage-using-node

var kullanicidata = [];
module.exports = (req, res, next) => {
	var url = req.url;
	var deneme = url.substring(1)
	// const token = req.headers['x-access-token'] || req.body.token || req.query.token
	const token = req.cookies.auth;
	// const kullanici =req.cookies.kullanici;


	if (token) {

		jwt.verify(token, req.app.get('api_secret_key'), (err, decoded) => {

			if (err) {

				res.json({

					status: false,

					message: 'Failed to authenticate token.'

				})

			} else {

				// req.decode = decoded;
				// kullanicidata[0] = token;
				user.findOne({ kullaniciadi: decoded.kullaniciadi }, (err, user) => {
					kullanicidata[0]=user;
					var Promise =sonoynanlar.find({kullaniciadi:decoded.kullaniciadi}).limit(3).sort({ eklenmetarihi: -1 })
					Promise.then((data) => {
						kullanicidata[1]=data;
						res.render("" + deneme + "", {
							list: JSON.stringify(kullanicidata)
						})
					}).catch((err) => {
						res.json(err)
					})
				})
				next();

			}

		});

	} else {
		if (deneme == "index") {
			res.render("" + deneme + "", {
				list: JSON.stringify("misafir girişi")
			})
			next();
		}
		else{
			res.redirect("/login")
			next();
		}

	}

};