var express = require('express');
var router = express.Router();
var http = require('http');
var keys = require('../../keys.js');
var bt = require('bing-translate').init({
    client_id: keys.id,
    client_secret: keys.secret
  });
var languages = require('../languages/languages.js');
var randomWord = require('random-word');

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Practice Translating',
    object: languages
    });
});

// for testing charting functions of User
router.get('/progress', function(req, res) {
  res.render('progress', {username: "George"});
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  bt.translate(req.body.text, languages[req.body.from], languages[req.body.to], function(err, translated){
  if (err) {
    res.json(err);
  } else {
    res.json(translated);
  }
  });
});

router.post('/test', function(req, res, next){
  var wordArray = getWord();
  var translatedArray = [];
  for (var i = 0; i < wordArray.length; i++) {
    var word = translateWords(wordArray[i], languages[req.body.from], function(err, data){
      translatedArray.push(data);
      if(translatedArray.length === 19){
        res.send({array: translatedArray, fromLanguage:req.body.from, toLanguage: req.body.to});
      }
    });
  }
});

router.post('/testAnswer', function(req, res, next) {
  console.log(req.body);
  bt.translate(req.body.text, languages[req.body.from], languages[req.body.to], function(err, translated){
    if (err) {
      res.json(err);
    } else {
      res.json(translated);
    }
  });
});

function translateWords(word, fromLanguage, callback){
    bt.translate(word, 'en', fromLanguage, function(err, translated){
      if(err){
        console.log('err');
      } else {
        return callback(null, translated.translated_text);
      }
    });
  }

function getWord(){
  var wordArray = [];
   for (var i = 0; i < 20; i++) {
     var word = randomWord();
     wordArray.push(word);
   }
   return wordArray;
}

module.exports = router;
