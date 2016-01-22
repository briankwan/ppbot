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
		"channel": "#general", 
		"username": "ppbot", 
		"text": "A change has been made at " + text + ". Also Huy sucks!", 
		"icon_emoji": ":ghost:"
	};

	var options = { 
		method: 'POST', 
		body: payload, 
		json: true, 
		url:'https://hooks.slack.com/services/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'
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

function loop(lastPushed){
	console.log('loop');
	console.log(lastPushed);
	var getResult1 = getResult(function(result){
		latest = result;
		if(latest !== lastPushed){
			lastPushed = latest;
			postRequest(latest);
		}
		else{
			postRequest('nothing has changed');
		}
	})
}


var url = 'https://api.github.com/repos/briankwan/ppbot';

function callRequest(req, res, callback){

	console.log('hello im here');

	var getResult1 = getResult(function(result){
		console.log('lastPushed');
		lastPushed = result;
		console.log(lastPushed);
		console.log('alskdjf;laksjfd');
		if(lastPushed == null){
			console.log('something went wrong in the get request');
		}

		setInterval(function(){
			console.log('every 10 sec');
			console.log('lastPushed: ' + lastPushed);
			getResult(function(result1){
				latest = result1;
				console.log('latest: ' + latest);
				if(latest !== lastPushed){
					postRequest(latest);
					latest = lastPushed;
				}
			}
		)}, 10000);

		console.log('wt');

	});

	//postRequest(getResult);

}

app.get('/testing', callRequest);

