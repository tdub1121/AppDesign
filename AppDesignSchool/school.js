var fs = require( "fs" );
var http = require( "http" );
var sqlite = require( "sqlite3" );

function formInputParser( url )
{
    inputs = {}
    var form_text = url.split( "?" )[1];
    var form_inputs = form_text.split( "&" );
    for( var i = 0; i < form_inputs.length; i++ ) {
        var inp = form_inputs[i].split( "=" );
        inputs[ inp[0] ] = inp[1];
    }
}

function addStudent( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    console.log( req.url );
    var form_text = req.url.split( "?" )[1];
    var form_inputs = form_text.split( "&" );
    var name_input = form_inputs[0].split( "=" );
    var year_input = form_inputs[1].split( "=" );
    var id_input = form_inputs[2].split( "=" );
    
    var NM = decodeURIComponent( ( name_input[1] + '' ).replace( /\+/g, '%20' ) );

    var YR = decodeURIComponent( ( year_input[1] + '' ).replace( /\+/g, '%20' ) );

     var IDD = decodeURIComponent( ( id_input[1] + '' ).replace( /\+/g, '%20' ) );
    var sql_cmd = "INSERT INTO STUDENT ('Name', 'YEAR', 'iD') VALUES ('"+ NM+"', '"+YR+"', '"+IDD+"')";
    db.run( sql_cmd );
    db.close();
    res.writeHead( 200 );
    res.end( "<html><body>Added!!!</body></html>" ); 
}
function addEnrollment( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    console.log( req.url );
    var form_text = req.url.split( "?" )[1];
    var form_inputs = form_text.split( "&" );
    var class_input = form_inputs[0].split( "=" );
    var student_input = form_inputs[1].split( "=" );
    
    
    var CL = decodeURIComponent( ( class_input[1] + '' ).replace( /\+/g, '%20' ) );

    var ST = decodeURIComponent( ( student_input[1] + '' ).replace( /\+/g, '%20' ) );
    console.log("t"+(CL === parseInt(CL, 10)));
    console.log("t"+(ST === parseInt(ST, 10)));
		
    if(isNaN(parseInt(CL, 10)) || isNaN(parseInt(ST,10)))
    {
  	res.writeHead( 200 );
	res.end( "<html><body>WRONG INPUT TYPE!</body></html>" ); 
    }
    else{


  var sql_cmd = "INSERT INTO ENROLLMENTS ('CLASSID', 'STUDENTID') VALUES ('"+ CL+"', '"+ST+"')";
    db.run( sql_cmd );
    db.close();
    res.writeHead( 200 );
    res.end( "<html><body>Added!!!</body></html>" ); 
}
      
      

}



function listStudents( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>" +
	"<body>";
    db.each("SELECT * FROM STUDENT", 
	    function( err, row ) {
        console.log( "stud "+ row.Name );
		
	resp_text += row.Name + " " + row.YEAR + " " + row.iD + "<br>";
    });
    db.close(
	   function() {
	       console.log( "Complete! "+resp_text );
	       resp_text += "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}
function listTeachers( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>" +
	"<body>";
    db.each("SELECT * FROM TEACHERS", 
	    function( err, row ) {
        console.log( "stud "+ row.NAme );
		
	resp_text += row.NAme + " " + row.OFFICE + " " + row.id + "<br>";
    });
    db.close(
	   function() {
	       console.log( "Complete! "+resp_text );
	       resp_text += "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}
function listClasses( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>" +
	"<body>";
    db.each("SELECT * FROM CLASSES", 
	    function( err, row ) {
        console.log( "stud "+ row.NAME );
		
	resp_text += row.NAME + " " + row.DEPARTMENT + " " + row.ID + "<br>";
    });
    db.close(
	   function() {
	       console.log( "Complete! "+resp_text );
	       resp_text += "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}
function listEnrollments( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>" +
	"<body>";
    db.each("SELECT * FROM ENROLLMENTS " + "JOIN STUDENT ON STUDENT.iD = ENROLLMENTS.STUDENTID " + "JOIN CLASSES ON CLASSES.ID = ENROLLMENTS.CLASSID ", 
	    function( err, row ) {
		console.log(err);
        console.log( "stud "+ row.CLASSID );
		
	resp_text += row.Name + " " + row.NAME + "<br>";
    });
    db.close(
	   function() {
	       console.log( "Complete! "+resp_text );
	       resp_text += "</body>" + "</html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   } );
}
function listTeachingAssignments( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html>" +
	"<body>";
    db.each("SELECT * FROM TEACHINGASSIGNMENTS", 
	    function( err, row ) {
        console.log( "stud "+ row.classID );
		
	resp_text += row.classID + " " + row.TEACHERID + "<br>";
    });
    db.close(
	   function() {
	       console.log( "Complete! "+resp_text );
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
        filename = "./index1.html";
    }
    if( filename == "list_students" || filename == "list_students?" )
    {
        listStudents( req, res );
    }
     else if( filename == "list_teachers" || filename == "list_teachers?" )
    {
        listTeachers( req, res );
    }
   else if( filename == "list_classes" || filename == "list_classes?" )
    {
        listClasses( req, res );
    }
   else if( filename == "list_enrollments" || filename == "list_enrollments?" )
    {
        listEnrollments( req, res );
    }
   else if( filename == "list_teaching_assignments" || filename == "list_teaching_assignments?" )
    {
        listTeachingAssignments( req, res );
    }
    else if( filename.substring( 0, 11) == "add_student" )
    {
        addStudent( req, res );
    }
    else if( filename.substring( 0, 14) == "add_enrollment" )
    {
        addEnrollment( req, res );
    }
    else
    {
        serveFile( filename, req, res );
    }
}

var server = http.createServer( serverFn );



server.listen( 8080 );
