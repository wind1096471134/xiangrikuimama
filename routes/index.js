var express = require('express');
var router = express.Router();

var CallOfficeCenter = function callOfficeCenter(openid, accessToken, appid, callback) {
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
	  reshttps.on('end', function() {
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
	if(req.cookies.openid != undefined && req.cookies.openid.length > 0) {
		var openId = req.cookies.openid;
		var token = req.db.get('token');
		token.find({"OpenId":openId},function(err, docs){
				if(err){
					console.log('not find openid:'+openId+', insert one');
				}else{
					console.log('find openid for insert:'+openId+' docs:'+docs);
					try{
						console.log('find openid:' + openId +' docs keys:'+ Object.keys(docs));
					}catch(e){
						console.log('find openid: err:'+e.message+' name:'+e.name+' code:'+e.number);
					}finally{
						console.log('find openid for insert: finally');
					}
				}
				if(docs.length>0) {
					var userInfo = docs[0];
					var accessToken = userInfo["AccessToken"];
					var openId = userInfo["OpenId"];
					var appId = 101284920;
					CallOfficeCenter(openId, accessToken, appId, function(result){
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
