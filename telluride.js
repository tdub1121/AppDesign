var fs = require( "fs" );
var http = require( "http" );
var sqlite = require( "sqlite3" );

function listPerformances( req, res )
{
    var db = new sqlite.Database( "telluride.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>" +
	"<body>";
    
    db.each( "SELECT PERFORMERS.NAME as pname, STAGES.NAME as sname, * FROM PERFORMANCE " + "JOIN PERFORMERS ON PERFORMERS.ID = PERFORMANCE.PERFORMER " + "JOIN STAGES ON STAGES.ID = PERFORMANCE.STAGE ",




 function( err, row ) {
        console.log( row );
	resp_text += row.TIME + " " + row.PERFORMER + " " + row.sname + " " + row.pname + "<br>";
    });
    db.close(
	   function() {
	       console.log("Complete! " + resp_text );
	       resp_text += "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}
function listVendors( req, res )
{
    var db = new sqlite.Database( "telluride2.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>" +
	"<body>";
    
    db.each( "SELECT * FROM VENDORS",



 function( err, row ) {
        console.log( row );
	resp_text += row.ID + " "+ row.NAME + "<br>";
    });
    db.close(
	   function() {
	       console.log("Complete! " + resp_text );
	       resp_text += "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}

function serveFile( filename, req, res )
{
    try
    {
    	var contents = fs.readFileSync( filename ).toString();
    }
    catch( e )
    {
    	console.log(
    	    "Error: Something bad happened trying to open "+filename );
    
	res.writeHead( 404 );
	res.end( "" );
	return;
    }

    res.writeHead( 200 );
    res.end( contents );
}

function serverFn( req, res )
{
    var filename = req.url.substring( 1, req.url.length );
    if( filename == "" )
    {
        filename = "./index.html";
    }
    if( filename == "list_performers" || filename == "list_performers?" )
    {
        listPerformers( req, res );
    }
    else if( filename == "list_performances" || filename == "list_performances?" )
    {
        listPerformances( req, res );
    }
    else if( filename == "list_vendors" || filename == "list_vendors?" )
    {
        listVendors( req, res );
    }
  
    else
    {
        serveFile( filename, req, res );
    }
}

var server = http.createServer( serverFn );

server.listen( 8080 );
