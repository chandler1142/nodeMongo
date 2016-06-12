var express = require('express')
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000
var mongoose = require('mongoose')
var app = new express()
var path = require('path')
var Movie = require('./models/movie.js')
var _ = require('underscore')


mongoose.connect('mongodb://localhost/nodeMongo')

app.set('views', './views/pages')
app.set('view engine','jade')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,'public')))
app.locals.moment = require("moment")
app.listen(port)

console.log('project has been started on port : ' + port)


//index page
app.get('/', function(req,res){
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