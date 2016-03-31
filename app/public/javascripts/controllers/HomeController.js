app.controller('HomeController',['$scope', '$http', '$timeout', function($scope, $http, $timeout){
	
	// default intialization
	$scope.showSubmit = true;
	$scope.submitDone = false;
	$scope.allDone = false;
	$scope.showStatus = true;

	// insert a new broker.
	$scope.submit = function(first_name, last_name, MIs_id, M_value) {

		var Mort_id = makeid();
		Mort_id = Mort_id.concat(MIs_id);
		
		var new_broker = {
			"first_name":first_name,
			"last_name":last_name,
			"MIs_ID":MIs_id,
			"Mort_id":Mort_id,
			"M_value":M_value
		};
		
		var data = JSON.stringify(new_broker);
		
		// post a new brokder.
		$http({
			method:'POST',
			url: '/broker',
			data: data,
			headers: {'Content-Type': 'application/json'}
		}).success(function(res){
			$scope.showSubmit = false;
			$scope.submitDone = true;
			$scope.submitDoneYes = "Application Submitted.";
			$scope.mortage_id = "Your Mortage ID: "+Mort_id;
		}).catch(function(err){
			console.log("Fail to insert a broker.");
		});
	};

	var insurance_text = "";
	$scope.getState = function(last_name_broker, MID_id_broker) {
		
		
		$http({
    	url: '/broker_one', 
    	method: "GET",
    	params: {
    						last_name: last_name_broker,
    						mort_id:MID_id_broker
    					}
 		}).then(function(res){
 			$scope.showState = true;
 			var thisBrokerInfo = res.data.Info;
 			var thisBrokerIns = res.data.Ins;
 			console.log(thisBrokerInfo);
 			if (thisBrokerInfo.length === 0)
 				$scope.broker_state = "Missing employment info.";
 			else{
 				if (thisBrokerIns.length === 0)
 					$scope.broker_state = "Waiting for Insurance Company";
 				else{
 					// document to download.
 					var result = {
 						"Insurance_value":thisBrokerIns.insured_value,
 						"Deductible":thisBrokerIns.deductible
 					};
 					$scope.broker_state = "You application have been aproved, download your result file.";
 					$scope.allDone = true;
 					$scope.showStatus = false;
 					insurance_text = result;
 					console.log("We are ready");
 				}
 			}
 		}).catch(function(err){
 			console.log("Error getting the state.");
 		});
 	};

 	$scope.download = function(){
 		var filename = 'result.txt';
 		var text = "Insurance_value: ".concat(insurance_text.Insurance_value);
 		text = text.concat("\n");
 		var de = "Deductible: ".concat(insurance_text.Deductible);
 		text =  text.concat(de);
 		console.log(text);
 		download(filename, text);
 	};

	// generate an ID for mortage_ID.
	function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 3; i++ )
    	text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}

	// generate a document if MBR gathered all required info.
	function download(filename, text) {
	  var element = document.createElement('a');
	  element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
	  element.setAttribute('download', filename);
		element.style.display = 'none';
	  document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}
}]);