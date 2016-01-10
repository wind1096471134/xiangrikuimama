var express = require('express');
var router = express.Router();

var insertDoc = function(db, callback, openId, accessToken, exprire, rToken) {
	db.collection('token').insertOne({
		"OpenId":openId,
		"AccessToken":accessToken,
		"ExpireTime":exprire,
		"RefreshToken":rToken
	}, function(err, result) {
		console.log("insert a doc into token");
		callback(result);
		});
};

/* GET users listing. */
router.get('/', function(req, res, next) {
//	res.send('code:'+req.query.code+' type:'+req.query.type);
	if(req.query.type) {
		if(req.query.type=='jumpauthcode'){
			res.render('jumpauthcode', { code: req.query.code });
		}else if(req.query.type == 'accesstoken') {
			var options = {
				host: 'graph.qq.com',
				port: 443,
				path: '/oauth2.0/token?grant_type=authorization_code&client_id=101284920&client_secret=62cbfb724d9654c12d06cedeb448a19a&code='+req.query.code+'&state=test&redirect_uri=http%3A%2F%2Fwww.xiangrikuimama.com%2Fcallback%3Ftype%3Dshowaccesstoken',
				method: 'GET'
				};
			var https = require('https');
			var req = https.request(options, function(reshttps) {
				var output = '';
        console.log(options.host + ':' + reshttps.statusCode);
        reshttps.setEncoding('utf8');

        reshttps.on('data', function (chunk) {
            output += chunk;
        });
				reshttps.on('end', function() {
					//outputaccess_token=FB625E3B838EACB4660144FDE5441E5D&expires_in=7776000&refresh_token=3066D68B34763C5AF8BE820373BF67F8
					res.send('accesstoken:'+output);
					var accessToken='';
					var expiresTime='';
					var refreshToken='';
					var arrOutput = output.split('&');
					for(x in arrOutput) {
						console.log("x:" + x);
						var arr = x.split('=');
						if(arr[0] == 'access_token') {
							accessToken = arr[1];
						}
						if(arr[0] == 'expires_in') {
							expiresTime = arr[1];
						}
						if(arr[0] == 'refresh_token') {
							refreshToken = arr[1];
						}
					}
					console.log("output:" + output);
					console.log("accessToken:" + accessToken);
					var options2 = {
						host: 'graph.qq.com',
						port: 443,
						path: '/oauth2.0/me?access_token='+accessToken,
						method: 'GET'
						};
					var https2 = require('https');
					var req2 = https2.request(options2, function(res2) {
						var output2 = '';
						res2.setEncodeing('utf8');
						res2.on('data', function(chunk2) {
								output2 += chunk2;
							});
						res2.on('end', function(){
								//callback( {"client_id":"YOUR_APPID","openid":"YOUR_OPENID"} );
								console.log("getOpenid log:" + output2);
								var lpos = strpos(output2, "(");
								var rpos = strrpos(output2, ")");
								var str  = substr(output2, lpos + 1, rpos - lpos -1);
								var openidObj = JSON.parse( my_json_string );
								console.log("openidObj" + openidObj);
								insertDoc(req.db, function(result){
									req.db.close;}, 
									openidObj.openid, accessToken, expiresTime, refreshToken);
							});
						
						});
					//res.render('jumpaccesstoken', { accesstoken: req.query.access_token });
				});
			});
			req.end();
		}
	}else{
   res.send('no type param, respond with a resource');
 }
});

module.exports = router;
