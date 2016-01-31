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
	console.log('start officecenter js');
	var accessToken = req.query.at;
	var openId = req.query.oid;
	var appId = req.query.aid;
	CallOfficeCenter(openId, accessToken, appId, function(result){
		res.send(result);
	});
});

module.exports = router;
