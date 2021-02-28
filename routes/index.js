var express = require('express');
var router = express.Router();
/*
  Add a book in my library
  Body : token et isbn13
  Response : result
*/
router.post('/library/add/:token/:isbn13/', (req, res) => {
  let isbn13 = req.params.isbn13;
  let token = req.params.token;

  res.json({result})
});


/*
  Delete a book from library
  Body : token et isbn13
  Response : result (true),
*/
router.delete('/library/delete/:token/:isbn13/', (req, res) => {
  let isbn13 = req.params.isbn13;
  let token = req.params.token;

  var result = await bookModel.deleteOne({ idBook : req.params.idBook})

  res.json({result})
});


router.post('/recos', (req,res)=>{
  //Recupérer les résultats du questionnaire stockés dans un cookie, et renvoyer des suggestions.
  //Entrées : cookie questionnaire ou token
  //recherche par category (subjects) puis tri sur longueur et sur nouveautés
  //Sorties : objet suggestions , erreur ==> refaites le questionnarire
 })
 

 
 app.get('/library/:token', function (req, res) {
  //Accéder à une bibliothèque à partir de l'id du User (paramètre associé au composant livre)
  //Entrées : userId
  //mécanique de récupération d'une bibliothèque
  //Sorties : success, failure, [ISBN13]
 })

 CELINE //////
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const UsersModel = require('../models/users');
const ReviewsModel = require('../models/reviews');

// Check email from user (bouton "continuer")
router.post('/check-email');
// vérifier si le mail est déjà dans la DB ou pas.
// vérifier le format de l'email à cette étape.

// Signup
router.post('/sign-up', async function(req, res, next) {
  const checkExistingUserFromEmail = await UsersModel.findOne({email: req.body.email});
  if (!!req.body.userLibraryName && !!req.body.password && checkExistingUserFromEmail) {
    res.json({result: false, message: "il existe déjà un compte lié à cet email."})
    // redirect écran login 
  } else if (!req.body.userLibraryName || !req.body.email || !req.body.password) {
    res.json({result: false, message: "Veuillez remplir tous les champs pour créer un compte."})
  }  else {
    const userSave = await saveNewUser(req);
    const userToken = userSave.token;
    res.json({userToken, result:true});
  }
});

async function saveNewUser(req) {
  const cost = 10;
  const hash = bcrypt.hashSync(req.body.password, cost);
  const user = new UsersModel({
    // dans un cookie ou dans du localstorage ?
    // if (!cookie) message: 'refaire le questionnaire'
    favoriteBookStyles: req.body.favoriteBookStyles, // récupéré comment en front ?
    favoriteBookLength: req.body.favoriteBookLength, // récupéré comment en front ?
    favoriteBookPeriod: req.body.favoriteBookPeriod, // récupéré comment en front ?
    userLibraryName: req.body.userLibraryName,
    avatar: req.body.avatar, // url à récupérer... 
    email: req.body.email,
    password: hash,
    token: uid2(32), 
  });
  const userSave = await user.save();
  return userSave;
}

// Login
router.post('/log-in', async function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    res.json({ login: false, message: "Veuillez remplir tous les champs pour accéder à votre compte."})
  } else {
  const user = await UsersModel.findOne({email: req.body.email});
  const password = req.body.password;
  const userToken = user.token;
  if (bcrypt.compareSync(password, user.password)) {
    res.json({ login: true, userToken });
  } else { 
    res.json({login: false, message: "Ce compte n'existe pas, veuillez réessayer ou créer un compte." }); }
}});

// Update profile
router.post('/update', (req, res) => {
  const user = await UsersModel.find({token: req.body.token});
  // mettre à jour les champs souhaités : tout sauf l'email, le token, library, wishlist. 
  // par ex : 
  if (req.body.userLibraryName) {
    user.userLibraryName = req.body.userLibraryName;
  }
  const userSave = await user.save();
  res.json({ result: true, userSave });
});

// Logout : géré en frontend.

// Post review
router.post('/new-review', (req, res) => {
  const review = new ReviewsModel({ // voir sur le cours
    isbn13: req.body.isbn13,
    userLibraryName: req.body.userLibraryName,
    avatar: req.body.avatar,
    rating: req.body.rating,
    comment: req.body.comment,
  })
  // save.
  res.json({ result: true, review });
});

// Get reviews
router.get('/reviews', (req, res) => {
  const reviews = await ReviewsModel.find(); // par book ISBN
  res.json({ result: true, reviews });
});

/*
  Recherche sur Google Books API de livres
  Query : q ("tintin" || "saint-exupery" || "des fleurs pour algernon" || "978-2-7654-0912-0")
  Response : result (true), books [{title ("Tintin au Congo"), cover ("http://books.google.com/books/content?id=eFxNDQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"), resultCount(56), publishedDate(1970), ISBN13(9782203192157)}, ...]
API_key: "AIzaSyAIdljyRBhHojVGur6_xhEi1fdSKyb-rUE"
  */

 router.get('/search', (req, res) => {
  let q = req.query.q;

  if (!q) {
    res.json({ result: false });
  } else {
    // Appel à la google books API
    // limiter le nb de résultats
    res.json({ result: true, books: [{
      title: 'Tintin au Congo',
      cover: 'http://books.google.com/books/content?id=eFxNDQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      publishedDate: "1970",
      ISBN13: "9782203192157",
    },] });
  }
});

/*
  Recherche de wishlist à la BDD
  Query : token (123456)
  Response : result (true), books [{title ("Tintin au Congo"), cover ("http://books.google.com/books/content?id=eFxNDQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api")}, ...]
  */

router.post('/wishlist', (req, res) => {
  let token = req.body.token;

  if (!token) {
    res.json({ result: false });
  } else {
    // Appel à la BDD
    res.json({ result: true, books: [{
      title: 'Tintin au Congo',
      cover: 'http://books.google.com/books/content?id=eFxNDQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',

},] });
  }
});

/*
  Suppression d'un livre dans la wishlist d'un user dans la BDD
  Body : token (123456), book_Id,
  Response : result (true)
  */

router.delete('/wishlist/delete/:token/:Isbn13', (req, res) => {
  let token = req.params.token;
  let book_Id = req.params.isbn13

  if (!token) {
    res.json({ result: false });
  } else {
    // deleteOne sur la BDD
    res.json({ result: true});
  }
});

/*
  Ajout d'un livre dans la wishlist d'un user dans la BDD
  Body : token (123456), Isbn13(1234567890123)
  */

 router.post('/wishlist/add/:token/:Isbn13', (req, res) => {
  let token = req.params.token;
  let Isbn13 = req.params.Isbn13

  //check si book existant en BDD sinon ajouter en BDD
  // ajouter dans la wishlist de l'utilisateurs si pas déjà dans la wishlist

  if (!token) {
    res.json({ result: false });
  } else {

res.json({ result: true, books: [{
  title: 'Tintin au Congo',
  cover: 'http://books.google.com/books/content?id=eFxNDQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',

},] });
  }
});
 


module.exports = router;