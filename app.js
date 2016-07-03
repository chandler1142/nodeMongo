var express = require('express')
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000
var mongoose = require('mongoose')
var app = new express()
var path = require('path')
var Movie = require('./models/movie.js')
var User = require('./models/user.js')
var _ = require('underscore')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session)

mongoose.connect('mongodb://localhost/nodeMongo')

app.set('views', './views/pages')
app.set('view engine','jade')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())
app.use(session({
	secret: 'imooc',
	store: new mongoStore( {
		url: 'mongodb://localhost/nodeMongo',
		collection: 'sessions'
	})
}))
app.locals.moment = require("moment")
app.listen(port)

console.log('project has been started on port : ' + port)


//index page
app.get('/', function(req,res){
	console.log('user in session : ' + req.session.user);

	var _user = req.session.user

	if(_user) {
		app.locals.user = _user
	}

	Movie.fetch(function(err,movies){
		if(err) {
			console.log(err)
		}
		res.render('index',{
			title: '首页',
			movies: movies
		})
	})
	
})

// sign up
app.post('/user/signup', function(req,res) {
	var _user = req.body.user
	//req.param('user')
	//console.log(_user)
	
	User.findOne({name:_user.name},function(err, user) {
		if(err) {
			console.log(err)
		}
		if(user) {
			return res.redirect('/')
		} else {
			var user = new User(_user)
			user.save(function(err, user) {
				if(err) {
					console.log(err)
				}
				res.redirect('/admin/userlist')
			})
		}
	})
})

//user list page
app.get('/admin/userlist', function(req,res){
	User.fetch(function(err,users){
		if(err) {
			console.log(err)
		}
		res.render('userlist',{
			title: '用户列表',
			users: users
		})
	})
})

app.post('/user/signin', function(req,res) {
	var _user = req.body.user
	var name = _user.name
	var password = _user.password

	User.findOne({name:name},function(err,user) {
		if(err) {
			console.log(err)
		}

		if(!user) {
			return res.redirect('/')
		} else {
			user.comparePassword(password,function(err,isMatch) {
				if(err) {
					console.log(err)
				}
				if(isMatch) {	
					req.session.user = user									
					console.log('password is matched!')
					return res.redirect('/')
				} else {
					console.log('password is not matched!')
				}
			})
		}
	})
})

//logout
app.get('/logout',function(req,res) {
	delete req.session.user
	delete app.locals.user
	res.redirect('/')
})


//list page
app.get('/admin/list', function(req,res){
	Movie.fetch(function(err,movies){
		if(err) {
			console.log(err)
		}
		res.render('list',{
			title: '列表',
			movies: movies
		})
	})
})

//list delete
app.delete('/admin/list', function(req,res){
	var id = req.query.id
	if(id) {
		console.log(id)
		Movie.remove({_id:id}, function(err,movie) {
			if(err) {
				console.log(err)
			} else {
				res.json({success:1})
			}
		})
	}
})

//detail page
app.get('/movie/:id', function(req,res){
	var id = req.params.id

	Movie.findById(id,function(err,movie) {
		res.render('detail',{
			title: '详情:',
			movie: movie
		})
	})
})

//admin page
app.get('/admin/movie', function(req,res){
	res.render('admin',{
		title: '管理',
		movie: {
			doctor:'',
			country: '',
			language: '',
			title: '',
			year: '',
			poster: '',
			flash: '',
			summary:''
		}
	})
})

//admin update
app.get('/admin/update/:id', function(req,res){
	var id = req.params.id
	
	//var id = req.body.movie._id
	if(id) {
		Movie.findById(id,function(err,movie) {
			if(err) {
				console.log(err)
			}
			res.render('admin', {
				title: "后台更新",
				movie: movie
			})
		})
	} else {
		console.log("id is undefined or null")
	}

})

//admin post movie 
app.post('/admin/movie/new', function(req,res){
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if(id !== 'undefined') {
		Movie.findById(id,function(err,movie) {
			if(err) {
				console.log(err)
			}
			_movie = _.extend(movie, movieObj)
			_movie.save(function(err,movie) {
			if(err) {
					console.log(err)
				}

				res.redirect('/movie/'+ movie._id)
			})
		})
	} else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			country: movieObj.country,
			language: movieObj.language,
			title: movieObj.title,
			year: movieObj.year,
			poster: movieObj.poster,
			flash: movieObj.flash,
			summary: movieObj.summary
		})
		_movie.save(function(err,movie) {
			if(err) {
				console.log(err)
			}

			res.redirect('/movie/'+ movie._id)
		})
	}
})

// {
// 			title:'机械战警',
// 			_id:1,
// 			poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
// 		},{
// 			title:'机械战警',
// 			_id:2,
// 			poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
// 		},{
// 			title:'机械战警',
// 			_id:3,
// 			poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
// 		},{
// 			title:'机械战警',
// 			_id:4,
// 			poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
// 		},{
// 			title:'机械战警',
// 			_id:5,
// 			poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
// 		},{
// 			title:'机械战警',
// 			_id:6,
// 			poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
// 		}