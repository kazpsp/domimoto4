(function($) {
  document.addEventListener("deviceready", onDeviceReady, false);

	function onDeviceReady() {
	// global variables
	var db;
	var db2;
	var shortName = 'WebSqlDB';
	var version = '1.0';
	var displayName = 'WebSqlDB';
	var maxSize = 65535;	

	db2 = openDatabase(shortName, version, displayName,maxSize);

	db2.transaction(function(transaction) {
		transaction.executeSql('SELECT name FROM sqlite_master WHERE type="table" AND name="Settings";', [],
		function(transaction, result) {
			if(result!=null){
			db2.transaction(function(transaction) {
				transaction.executeSql('SELECT * FROM Settings;', [],
				function(transaction, result) {
					if(result.rows.length>0){
						var row = result.rows.item(0);
						if (result != null && result.rows != null) {		
						    $.ajax({
						        type: 'POST',
							    headers: {
							        "email":row.Email,
							        "password":row.PassWord
							    },
						        url: 'http://api.domimoto.com/loginUser',
						        datatype: 'json',
						        success: function(data){
						        	if(data.auth!=null){
							            window.location.replace("domiApp.html");
									}
									else{
										alert('email o contraseña errado.');
									}
						        },
						        error: function(){
						            console.log('There was an error adding your request');
						        }
						    });			
						}
					}
				 },errorHandler);
			 },errorHandler);
			 }
		 },errorHandler);
	 },errorHandler);

	// this is called when an error happens in a transaction
	function errorHandler(transaction, error) {
	   alert('Error: ' + error.message + ' code: ' + error.code);
	}
	
	// this is called when a successful transaction happens
	function successCallBack() {	
	}
	
	function nullHandler(){};
	
	// called when the application loads
	
	// This alert is used to make sure the application is loaded correctly
	// you can comment this out once you have the application working
		
		 if (!window.openDatabase) {
		   // not all mobile devices support databases  if it does not, the	following alert will display
		   // indicating the device will not be albe to run this application
		   alert('Databases are not supported in this browser.');
		   return;
		 }
		
		// this line tries to open the database base locally on the device
		// if it does not exist, it will create it and return a database object stored in variable db
		 db = openDatabase(shortName, version, displayName,maxSize);
		
		// this line will try to create the table User in the database just created/openned
		 db.transaction(function(tx){
		  // you can uncomment this next line if you want the User table to be empty each time the application runs
		  // tx.executeSql( 'DROP TABLE User',nullHandler,nullHandler);
		
		  // this line actually creates the table User if it does not exist	and sets up the three columns and their types
		  // note the UserId column is an auto incrementing column which is	useful if you want to pull back distinct rows
		  // easily from the table.
		   tx.executeSql( 'CREATE TABLE IF NOT EXISTS Settings(SettingId INTEGER NOT NULL PRIMARY KEY, ApiKey TEXT NOT NULL, MotoId INTEGER NOT NULL,Email TEXT NOT NULL,PassWord TEXT NOT NULL)',
             [],nullHandler,errorHandler);
           },errorHandler,successCallBack);
            function ListDBValues() {
	
	 if (!window.openDatabase) {
	  alert('Databases are not supported in this browser.');
	  return;
	 }
	
	// this line clears out any content in the #lbUsers element on the page so that the next few lines will show updated
	// content and not just keep repeating lines
	 $('#lbUsers').html('');
	 
	
	// this next section will select all the content from the User table and then go through it row by row
	// appending the UserId  FirstName  LastName to the  #lbUsers element on the page
	 db.transaction(function(transaction) {
	    transaction.executeSql('SELECT * FROM Settings;', [],
	     function(transaction, result) {
	      if (result != null && result.rows != null) {
	        for (var i = 0; i < result.rows.length; i++) {
	          var row = result.rows.item(i);
	          $('#lbUsers').append('<br>' + row.SettingId + '. ' + row.ApiKey+ ' ' + row.MotoId + ' ' + row.Email + ' ' + row.PassWord);
	        }
	      }
	     },errorHandler);
	 },errorHandler,nullHandler);
	
	 return;
	
	}
	
	// this is the function that puts values into the database using the values from the text boxes on the screen
	$("#ListDBValues").click(function() {	
		 ListDBValues();
		 return false;
	});
	$("#txLastName").keyup(function(e){
	    if(e.keyCode == 13){
			$('#AddDBValue').trigger('click');	    	
  	    }
	});
	
	function insertDBValues(data) {
	   if (!window.openDatabase) {
	     alert('Databases are not supported in this browser.');
	     return;
	   }  
	  // this is the section that actually inserts the values into the Usertable
	   db.transaction(function(transaction) {
	     transaction.executeSql('INSERT INTO Settings(ApiKey,MotoId,Email,PassWord) VALUES (?,?,?,?)',[data.auth.apikey,data.auth.id,$('#txFirstName').val(), $('#txLastName').val()],
	       nullHandler,errorHandler);
	     });
	  // this calls the function that will show what is in the User table inthe database
	   ListDBValues();
	   return false;
	 }
			
	$("#AddDBValue").click(function(){
		console.log("ready");
	    $.ajax({
	        type: 'POST',
		    headers: {
		        "email":$('#txFirstName').val(),
		        "password":$('#txLastName').val()
		    },
	        url: 'http://api.domimoto.com/loginUser',
	        datatype: 'json',
	        success: function(data){
	        	if(data.auth!=null){
		            insertDBValues(data);
		            console.log('Your request was succesfully sent');
		            window.location.replace("domiApp.html");
				}
				else{
					alert('email o contraseña errado.');
				}
	        },
	        error: function(){
	            console.log('There was an error adding your request');
	        }
	    });
  	  return false;
	});
}
})(jQuery);