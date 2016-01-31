var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	var collection = req.db.get('token');
	try{
		collection.find({},{},function(e,docs){
				if(e){
					console.log('find open id error!'+e);
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
						res.render('users', { at: docs[0]['AccessToken'], openId: docs[0]['OpenId'] });
	        else
						res.render('users', { at: '', openId: '' });
	      }
	    });
		}catch(e){
			console.log('find user openid: err:'+e.message+' name:'+e.name+' code:'+e.number);
			res.render('users', { at: '', openId: 'get user id error throw:' +e.message+' name:'+e.name+' code:'+e.number});
		}finally{
			console.log('find user openid: finally');
		}
  //res.send('respond with a resource');
});

module.exports = router;
