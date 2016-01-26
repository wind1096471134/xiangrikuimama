var express = require('express');
var router = express.Router();

var CallOfficeCenter = function callOfficeCenter(openid, accessToken, appid, callback) {
	console.log('start call CallOfficeCenter, openid:'+openid+';accessToken:'+accessToken+';appid:'+appid);
	var options = {
		host: 'mmatest.qq.com',
		port: 80,
		path: '/tntzhang/myoffice/mqqweb/set_unfinished_msg',
		method: 'POST',
    headers: {
    	'Content-Type': 'application/json',
    }
	};
	var http = require('http');
	var req = http.request(options, function(reshttp) {
		var output = '';
	  console.log(options.host + ':' + reshttp.statusCode);
	  reshttp.setEncoding('utf8');
	
	  reshttp.on('data', function (chunk) {
	      output += chunk;
	  });
	  reshttp.on('end', function() {
	  	console.log('http post ok!output: '+output);
	  	callback(output);
	  });
	});
	req.on('error', function(e) {
  	console.log('problem with request: ' + e.message);
  	callback('error:'+e.message)
	});
	var body = {
	    "handled_openid":openid,
	    "self_openid":openid,
	    "access_token":accessToken,
	    "appid":appid,
	    "notice_param":{"operate_type":1,"notice_var":3,"notice_version":2},
	    "sub_items":[{"subitem_id":3, "notice_param":{"operate_type":1,"notice_var":3,"notice_version":2}},{"subitem_id":4, "notice_param":{"operate_type":1,"notice_var":3,"notice_version":2}}]
	}
	// write data to request body
	req.write(JSON.stringify(body));  ///RESULT HERE IS A JSON
	req.end();
};

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
					CallOfficeCenter(openId, accessToken, appId, function(result){
						console.log('start render happy.html');
						res.render('happy',{title:'xiangrikuimama', openId:req.cookies.openid, docStr:JSON.stringify(docs), retStr:result});
						return;
					});
				}
				res.send('get error');
			});
	}else{ 
  	res.render('index', { title: 'xiangrikuimama', domain:'www.xiangrikuimama.com'});
  }
});

module.exports = router;
