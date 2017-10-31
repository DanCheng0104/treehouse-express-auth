
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mid = require('../middleware')
// GET /
router.get('/', (req, res, next) => {
  return res.render('index', { title: 'Home' });
});
router.get('/profile', mid.loggedIn,(req, res, next) => {
  User.findById(req.session.userId)
      .exec(function(error,user){
        if (error){
          return next(error);
        }else{
          return res.render('profile',{title:'profile',name:user.name,favorite:user.favoriteBook})
        }
      });
});
router.get('/logout', (req, res, next) => {
  if (req.session){
      req.session.destroy(function(err){
        if(err){
          return next(err);
        }else{
          return res.redirect('/');
        }
      })

  }
});
router.get('/login', mid.loggedOut,(req, res, next) => {
  return res.render('login', { title: 'Log In' });
});
router.post('/login', (req, res, next) => {
  if(req.body.email && req.body.password){
    console.log(req.body);
    User.authenticate(req.body.email,req.body.password,function(error,user){
      console.log(error);
      if (error || !user){
        const err = new Error('Wrong email or pwd.');
        err.status = 401;
        return next(err);
      }else{
        req.session.userId = user._id;
        return res.redirect('/profile');
      }

    });
  }else{
    const err = new Error('Email and pwd are required.');
    err.status = 401;
    return next(err);
  }
});
// GET /about
router.get('/about', (req, res, next) => {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', (req, res, next) => {
  return res.render('contact', { title: 'Contact' });
});

router.get('/register', mid.loggedOut,(req, res, next) => {
  return res.render('register', { title: 'Sign Up' });
});

router.post('/register', (req, res, next) => {
  if (req.body.email && req.body.name && req.body.favoriteBook && req.body.password && req.body.confirmPassword){

  	//confirm passwords are the same
  	if (req.body.password !== req.body.confirmPassword){
	   	const err = new Error('Passwords do not match.');
	  	err.status = 400;
	  	return next(err); 		
  	}
  	//create object with form input
  	const userData = {
  		email:req.body.email ,
  		name: req.body.name,
  		favoriteBook:req.body.favoriteBook,
  		password:req.body.password
  	};
  	//use schema's 'create' method to insert document into mongo
  	User.create(userData,function(error,user){
  		if (error){
  			return next(error);
  		}else{
        req.session.userId = user._id;
  			return res.redirect('/profile');
  		}
  	});
  }else{
  	const err = new Error('All fields required.');
  	err.status = 400;
  	return next(err);
  }
});
module.exports = router;
