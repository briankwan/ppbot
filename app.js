var express = require('express');
var bodyParser = require('body-parser');

var request = require('request');
var https = require('https');
var fs = require('fs');
var slackbot = require('node-slackbot');
 
var app = express();
var port = process.env.PORT || 1337;
 
// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
 
// test route
app.get('/', function (req, res) { res.status(200).send('Hello world!'); });
 
app.listen(port, function () {
  console.log('Listening on port ' + port);
});

//app.post('/hello', function (req, res, next) {
//  var userName = req.body.user_name;
//  var botPayload = {
//    text : 'Hello ' + userName + '! Sup.'
//  };

module.exports = function (req, res, next) {
  var userName = req.body.user_name;
  var botPayload = {
    text : 'Hello, ' + userName + '! Huy sucks!'
  };

  // Loop otherwise..
 // if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
 // } else {
 //   return res.status(200).end();
 // }
}

app.post('/hello', module.exports);

function postRequest(text, req, res, callback){
	var	payload = {
		"channel": "#testingarea", 
		"username": "ppbot", 
		"text": "@here A push change in the master branch has been made at " + text + ". Also Huy sucks!", 
		"icon_emoji": ":ghost:"
	};

	var options = { 
		method: 'POST', 
		body: payload, 
		json: true, 
		url: 'https://hooks.slack.com/services/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'
		//url:'https://hooks.slack.com/services/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'
	};

	request(options, function (err, res, body) {})
}

function getResult(callback){
	lastPushed = null;
	var options = {
		url: 'https://api.github.com/repos/briankwan/ppbot',
		method: 'GET',
		headers: {'User-Agent': 'ppbot'}
	};

	request(options, function (error, response, body){
		if(!error && response.statusCode == 200){
			value = JSON.parse(body);
			lastPushed = value.pushed_at;
			callback(lastPushed);
			//postRequest(lastPushed);
			//console.log(lastPushed);
		}
		else{//error occured
			console.log(body);
		}
	});
	//console.log(lastPushed);
	return lastPushed;
}


function callRequest(req, res, callback){

	var pushed = null;

	var getResult1 = getResult(function(result){
		pushed = result;
		if(lastPushed == null){
			console.log('something went wrong in the get request');
		}

		setInterval(function(){
			console.log('every 10 sec');
			console.log('pushed: ' + pushed);
			getResult(function(result1){
				latest = result1;
				console.log('latest: ' + latest);
				if(latest !== pushed){
					postRequest(latest);
					pushed = latest;
				}
			}
		)}, 10000);
	});

	//postRequest(getResult);

}

callRequest();

//app.get('/testing', callRequest);

