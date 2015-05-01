var http = require( "http" );


var x = 0;

function serverFn( req, res ){

for( field in req ){
          // console.log( "R."+field+" = ..." );
    }


if (req.url.substring(0, 16) == "/submit_the_form"){

    var form_data = req.url.split( "?" )[ 1 ];
    var pairs = form_data.split( "&" );
    for( var i = 0; i < pairs.length; i++ ){
	
	var kv = pairs[i].split( "=" );
	var key = kv[0];
	var value = kv[1];
	console.log( i + " " + key + " "+ value );
    }
}
    
    res.writeHead( 200 );
    
    var h = "<!DOCTYPE html>"+
        "<html>"+
        "<body>"+
	"<form action='submit_the_form' method='get'>"+
	"<input name='textbox' type='text' value='write something'>"+
	"<input name='pretty' type='color'>"+
        "<p>Hello web Foo Bar Baz! "+x+"</p>"+
        "</body>"+
        "</html>";
    res.end( contents );
}
var server = http.createServer( serverFn );

server.listen( 8080 );
