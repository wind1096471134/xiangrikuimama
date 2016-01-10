var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	var collection = req.db.get('token');
	collection.find({},{},function(e,docs){
				console.log('type:'+typeof(docs));
				for(var key in docs) {
					var v = docs[key];
					console.log('docs['+key+']:'+v);
					console.log('type:'+typeof(v));
					for(var k in v)
						console.log('v['+k+']:'+v[k]);
				}
        res.send('id:'+docs[0]['OpenId']);
    });
  //res.send('respond with a resource');
});

module.exports = router;
