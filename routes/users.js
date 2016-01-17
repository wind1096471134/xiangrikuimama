var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	var collection = req.db.get('token');
	try{
		collection.find({},{},function(e,docs){
				if(e){
					console.log('find open id error!');
	      	res.send('get user id error');
	      }else{
					console.log('find user operid docs:'+JSON.stringify(docs));
					for(var key in docs) {
						var v = docs[key];
						console.log('docs['+key+']:'+v);
						console.log('type:'+typeof(v));
						for(var k in v)
							console.log('v['+k+']:'+v[k]);
					}
					if(docs.length>0)
						res.send('id:'+docs[0]['OpenId']);
	        else
	        	res.send('no id');
	      }
	    });
		}catch(e){
			console.log('find user openid: err:'+e.message+' name:'+e.name+' code:'+e.number);
			res.send('get user id error throw');
		}finally{
			console.log('find user openid: finally');
		}
  //res.send('respond with a resource');
});

module.exports = router;
