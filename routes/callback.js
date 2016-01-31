var express = require('express');
var router = express.Router();

var insertDoc = function(db, callback, openId, accessToken, exprire, rToken) {
	var token = db.get('token');
	token.find({"OpenId":openId},function(err, docs){
			if(err){
				console.log('not find openid:'+openId+', insert one');
				token.insert({
					"OpenId":openId,
					"AccessToken":accessToken,
					"ExpireTime":exprire,
					"RefreshToken":rToken
				});
				db.close();
			}else{
				console.log('find openid for insert:'+openId+' docs:'+docs);
				try{
					console.log('find openid:' + openId +' docs keys:'+ Object.keys(docs));
					if(docs.length===undefined || docs.length==0){
						console.log('insert one');
						token.insert({
							"OpenId":openId,
							"AccessToken":accessToken,
							"ExpireTime":exprire,
							"RefreshToken":rToken
						});
						db.close();
					}
				}catch(e){
					console.log('find openid: err:'+e.message+' name:'+e.name+' code:'+e.number);
				}finally{
					console.log('find openid for insert: finally');
				}
			}
		});
};

/* GET users listing. */
router.get('/', function(req, res, next) {
//	res.send('code:'+req.query.code+' type:'+req.query.type);
	var myDb = req.db;
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
					
					var accessToken='';
					var expiresTime='';
					var refreshToken='';
					var arrOutput = output.split('&');
					for(var i = 0;i < arrOutput.length;++i) {
						var x = arrOutput[i];
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
					var openId = "";
					console.log("output:" + output);
					console.log("accessToken:" + accessToken);
					var options2 = {
						host: 'graph.qq.com',
						port: 443,
						path: '/oauth2.0/me?access_token='+accessToken,
						method: 'GET'
						};
						console.log("call https2 : /oauth2.0/me?access_token=" + accessToken);
					try{
//						var https2 = require('https');
//						var req2 = https2.request(options2, function(res2) {
//							console.log(options2.host + ':' + res2.statusCode);
//							var output2 = '';
//							res2.setEncodeing('utf8');
//							res2.on('data', function(chunk2) {
//									output2 += chunk2;
//								});
//							res2.on('end', function(){
//									//callback( {"client_id":"YOUR_APPID","openid":"YOUR_OPENID"} );
//									console.log("getOpenid log:" + output2);
//									var lpos = strpos(output2, "(");
//									var rpos = strrpos(output2, ")");
//									var str  = substr(output2, lpos + 1, rpos - lpos -1);
//									var openidObj = JSON.parse( my_json_string );
//									console.log("openidObj" + openidObj);
//									insertDoc(myDb, function(result){
//										myDb.close;}, 
//										openidObj.openid, accessToken, expiresTime, refreshToken);
//								});
//							
//							});
							var request = require('request');
							request('https://graph.qq.com/oauth2.0/me?access_token='+accessToken, function(error, response, body){
									console.log('get me openid:'+body);
									var lpos = body.indexOf("(");
									var rpos = body.indexOf(")");
									var str  = body.substr(lpos + 1, rpos - lpos -1);
									var openidObj = JSON.parse( str );
									console.log("openidObj" + openidObj);
									openId = openidObj.openid;
									insertDoc(myDb, function(result){
										myDb.close;}, 
										openidObj.openid, accessToken, expiresTime, refreshToken);
									console.log('openId:'+openId);
									res.cookie('openid', openId, {maxAge:10*60*000, httpOnly:true});
									res.render('jumpaccesstoken', { at: accessToken, openId: openId });
//									res.send('openid:'+openId);
								});
						}catch(e){
							console.log('call https2 err:'+e.message+' name:'+e.name+' code:'+e.number);
						}finally{
							console.log('call https2 finally');
						}
				});
			});
			req.end();
		}
	}else{
   res.send('no type param, respond with a resource');
 }
});

module.exports = router;
