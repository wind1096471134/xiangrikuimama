var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('start index js');
	if(req.cookies.openid != undefined && req.cookies.openid.length > 0) {
		console.log('openid:'+req.cookies.openid);
		var token = req.db.get('token');
		token.find({"OpenId":req.cookies.openid},function(err, docs){
				if(err){
					console.log('not find openid:'+req.cookies.openid+';err:'+err);
				}else{
					console.log('find openid for index:'+req.cookies.openid+' docs:'+docs);
					try{
						console.log('find openid:' + req.cookies.openid +' docs keys:'+ Object.keys(docs));
					}catch(e){
						console.log('find openid: err:'+e.message+' name:'+e.name+' code:'+e.number);
					}finally{
						console.log('find openid for index: finally');
					}
				}
				console.log('doc string:'+JSON.stringify(docs));
				console.log('docs[0] string:'+JSON.stringify(docs[0]));
				console.log('docs!=undefined:'+(docs!=undefined));
				console.log('docs.length:'+(docs.length));
				console.log('docs.length>0:'+(docs.length>0));
				if(docs!=undefined && docs.length>0) {
					console.log('find docs and do sth.');
					var userInfo = docs[0];
					var accessToken = userInfo["AccessToken"];
					var openId = userInfo["OpenId"];
					var appId = 101284920;
					console.log('start render happy.html');
					res.render('happy',{title:'xiangrikuimama', openId:req.cookies.openid, at:accessToken, appid:appId, docStr:JSON.stringify(docs)});
					return;
				}
			});
	}else{ 
  	res.render('index', { title: 'xiangrikuimama', domain:'www.xiangrikuimama.com'});
  }
});

module.exports = router;
