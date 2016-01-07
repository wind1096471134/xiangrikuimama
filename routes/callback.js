var express = require('express');
var router = express.Router();

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
			https.request(options, function(res) {
				res.on('end', function() {
					res.render('jumpaccesstoken', { accesstoken: req.query.access_token });
				});
			});
		}
	}else{
   res.send('no type param, respond with a resource');
 }
});

module.exports = router;
