var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
//	res.send('code:'+req.query.code+' type:'+req.query.type);
	if(req.query.type) {
		if(req.query.type=='jumpauthcode'){
			res.render('jumpauthcode', { code: req.query.code });
		}
	}else{
   res.send('no type param, respond with a resource');
 }
});

module.exports = router;
