"use strict";
var paytm_config = require('./paytm/paytm_config').paytm_config;
var paytm_checksum = require('./paytm/checksum');
var querystring = require('querystring');
function route(request,response){
	switch(request.url){
		case '/':
			console.log("/ has started");
			response.writeHead(200 , {'Content-type':'text/html'});
			response.write('<html><head><title>Paytmdddddd</title></head><body>');
			response.write('</body></html>');
			response.end();
			break;
		case '/generate_checksum':
			if(request.method == 'POST'){
				let body = '';
				    request.on('data', chunk => {
				        body += chunk.toString(); // convert Buffer to string
				    });
				    request.on('end', () => {

var x = body.split('&');
console.log(x);
var y =x[1].split('=');

var amount = x[4].split('=');
console.log(amount[1]);


								var paramarray = {};
									paramarray['MID'] = 'EbXToE99242989375518'; //Provided by Paytm
									paramarray['ORDER_ID'] = y[1]; //unique OrderId for every request
									paramarray['CUST_ID'] = 'cust123';  // unique customer identifier
									paramarray['INDUSTRY_TYPE_ID'] = 'Retail'; //Provided by Paytm
									paramarray['CHANNEL_ID'] = 'WAP'; //Provided by Paytm
									paramarray['TXN_AMOUNT'] = amount[1]; // transaction amount
									paramarray['WEBSITE'] = 'WEBSTAGING'; //Provided by Paytm
									paramarray['CALLBACK_URL'] = 'https://pguat.paytm.com/paytmchecksum/paytmCallback.jsp';//Provided by Paytm
									paramarray['EMAIL'] = 'username@emailprovider.com'; // customer email id
									paramarray['MOBILE_NO'] = '7777777777'; // customer 10 digit mobile no.
										paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (err, checksum) {
											console.log('Checksum: ', checksum, "\n");
											response.writeHead(200, {'Content-type' : 'text/json','Cache-Control': 'no-cache'});
											response.write(JSON.stringify(checksum));
											response.end();
										});
				    });

			}else{
				response.writeHead(200, {'Content-type' : 'text/json'});
				response.end();
			}
			break;
		case '/verify_checksum':
			if(request.method == 'POST'){
				var fullBody = '';
				request.on('data', function(chunk) {
					fullBody += chunk.toString();
				});
				request.on('end', function() {
					var decodedBody = querystring.parse(fullBody);

					console.log(decodedBody);

					// get received checksum
					var checksum = decodedBody.CHECKSUMHASH;

					// remove this from body, will be passed to function as separate argument
					delete decodedBody.CHECKSUMHASH;

					response.writeHead(200, {'Content-type' : 'text/html','Cache-Control': 'no-cache'});
					if(paytm_checksum.verifychecksum(decodedBody, paytm_config.MERCHANT_KEY, checksum)) {
						console.log("Checksum Verification => true");
						response.write("Checksum Verification => true");
					}else{
						console.log("Checksum Verification => false");
						response.write("Checksum Verification => false");
					}
					 // if checksum is validated Kindly verify the amount and status
					 // if transaction is successful
					// kindly call Paytm Transaction Status API and verify the transaction amount and status.
					// If everything is fine then mark that transaction as successful into your DB.

					response.end();
				});
			}else{
				response.writeHead(200, {'Content-type' : 'text/json'});
				response.end();
			}
			break;
	}
}

function htmlEscape(str) {
  return String(str)
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
}
exports.route = route;
