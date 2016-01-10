var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	var collection = req.db.get('token');
	collection.find({},{},function(e,docs){
				console.log('type:'+type(docs));
				for(var key in docs)
					console.log('docs['+key+']:'+docs[key]);
        res.send('id:'+docs[0]['openid']);
    });
  //res.send('respond with a resource');
});

module.exports = router;
