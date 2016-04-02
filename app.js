// ============
// Dependencies
// ============
// Package Dependencies
var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var sass				= require('node-sass-middleware');
var MongoClient = require('mongodb').MongoClient; // Require mongodb
var bodyParser = require('body-parser');

// parse application/json
app.use(bodyParser.json());

//insert a broker.
app.post('/broker', function(req,res){
	MongoClient.connect('mongodb://zihaow:123456@iad1-mongos1.objectrocket.com:16291/mbr', function(err, db) {
	  if (err) {
	    console.dir(err);
	  } else {
	  	var collection = db.collection('mortgage_broker');
	  	var broker_first_name = req.body.first_name;
	  	var broker_last_name = req.body.last_name;
	  	var broder_MIs_id = req.body.MIs_ID;
	  	var broder_Mort_id = req.body.Mort_id;
	  	var broker_M_value = req.body.M_value;
			collection.update( 
	  				 { location:"Halifax" },
	  				 { $push: { 
                        brokers:{
                        					"first_name":broker_first_name,
                        					"last_name":broker_last_name,
                        					"MIs_id":broder_MIs_id,
                        					"Mort_id":broder_Mort_id,
                        					"M_value":broker_M_value,
                        					"Info":"",
                        					"Ins":""
											          } 
                     }
             }, function(err,result){
             		if (err)
             			console.log("Something's wrong");
             		else
             			res.sendStatus(200);
             }
    	);
		}
	});
});

//update a broker info from EMP.
app.post('/broker_emp', function(req,res){
	MongoClient.connect('mongodb://zihaow:123456@iad1-mongos1.objectrocket.com:16291/mbr', function(err, db) {
	  if (err) {
	    console.dir(err);
	  } else {
	  	var collection = db.collection('mortgage_broker');
	  	var broker_first_name = req.body.first_name;
	  	var broker_last_name = req.body.last_name;
	  	var broker_mort_id = req.body.Mort_id;
	  	var broder_salary = req.body.salary;
	  	var broder_start_employment_date = req.body.start_employment_date;
			collection.update( 
	  				 { location:"Halifax", 
	  				 	'brokers.Mort_id':broker_mort_id },
	  				 { $set: { "brokers.$.Info":
	  				 					{ 
	  				 						"salary":broder_salary,
                        "start_employment_date":broder_start_employment_date
										 	}
										 }
             }, function(err,result){
             		if (err)
             			console.log("Something's wrong when updating this user.");
             		else
             			res.sendStatus(200);
             }
    	);
		}
	});
});

//update a broker info from INS.
app.post('/broker_ins', function(req,res){
	MongoClient.connect('mongodb://zihaow:123456@iad1-mongos1.objectrocket.com:16291/mbr', function(err, db) {
	  if (err) {
	    console.dir(err);
	  } else {
	  	var collection = db.collection('mortgage_broker');
	  	var broker_first_name = req.body.first_name;
	  	var broker_last_name = req.body.last_name;
	  	var broker_insured_value = req.body.insured_value;
	  	var broder_deductible = req.body.deductible;
			
			//
			collection.update( 
	  				 { location:"Halifax", 
	  				 	'brokers.first_name':broker_first_name,
	  				 	'brokers.last_name':broker_last_name},
	  				 { $set: { "brokers.$.Ins":
	  				 					{ 
	  				 						"insured_value":broker_insured_value,
                        "deductible":broder_deductible
										 	}
										 }
             }, function(err,result){
             		if (err)
             			console.log("Something's wrong when updating this user for INS.");
             		else
             			res.sendStatus(200);
             }
    	);
		}
	});
});

//get one broker info.
app.get('/broker_one', function(req,res){
	MongoClient.connect('mongodb://zihaow:123456@iad1-mongos1.objectrocket.com:16291/mbr', function(err, db) {
	  if (err) {
	    console.dir(err);
	  } else {
	  	var broker_last_name = req.query.last_name;
			var mort_id = req.query.mort_id;

			var collection = db.collection('mortgage_broker');
			// locate it by last name and mort_id
			collection.findOne({ location:"Halifax",
													 'brokers.last_name':broker_last_name,
													 'brokers.Mort_id':mort_id
			},function(err, doc) {
			  if (err) {
			    return console.dir(err);
			  } else {
			  	var thisDoc = doc.brokers;
			  	console.log(thisDoc);
			  	for(var i=0;i<thisDoc.length;i++){
			  		if(thisDoc[i].Mort_id === mort_id){
			  			res.send(thisDoc[i]);
			  		}
			  	}
			  }
			});
		}
	});
});


/*
// Connect and create a new doc
MongoClient.connect('mongodb://zihaow:123456@iad1-mongos1.objectrocket.com:16291/mbr', function(err, db) {
  if (err) {
    console.dir(err);
    console.log("error connected to mongodb");
  } else {
  	// doc will be created as the following sample data structure.
  	var broker_doc = {
        "location" : "Halifax",
        "brokers" : [
        {
    				"first_name": "Mike",
            "last_name": "Johnson",
            "MIs_id": "MJ123456",
            "Mort_id": "123456",
        }
        ]
  	};

  	// Call this only when you first run.
	  var collection = db.collection('mortgage_broker');
	  collection.insert(broker_doc, {w:1}, function(err, result) {
	    if (err) {
				return console.dir(err);
	    } else {
	      console.log("Inserted a doc!");
	      process.exit();
	    }
  	});
  }
});
*/

// =============
// Configuration
// =============
// Variables
var sassObject = {
	root: __dirname + '/app/public/stylesheets',
	src: '/',
	dest: '/css',
	debug: true,
	sourceComments: true,
	outputStyle: 'expanded'
};

// Env Setup
if (process.env.NODE_ENV === 'production') {
	sassObject.outputStyle = 'compressed';
	sassObject.sourceComments = false;
	sassObject.debug = false;
}

// Set & Use
app.set('views', __dirname + '/app/public/views');
app.set('view engine', 'jade');
app.use(sass(sassObject));

// Static File
app.use(express.static(__dirname + '/app/public/images'));
app.use(express.static(__dirname + '/app/public/javascripts'));
app.use(express.static(__dirname + '/app/public/javascripts/vendor'));
app.use(express.static(__dirname + '/app/public/stylesheets/css'));
app.use(express.static(__dirname + '/app/public/views/pages'));

// ======
// Routes
// ======
app.use(require('./app/controllers'));

// ===============
// Starting Server
// ===============
app.listen(port);
console.log('MBR Listening On Port ' + port);





