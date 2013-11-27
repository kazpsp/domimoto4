(function($) {

	document.addEventListener("deviceready", onDeviceReady, false);

	function onDeviceReady() {
		var db;
		var shortName = 'WebSqlDB';
		var version = '1.0';
		var displayName = 'WebSqlDB';
		var maxSize = 65535;
		var pusher =  null;
		var row = [];
		var Email= '';
		var PassWord= '';
		var order_id= 0;
		var channel = '';
		var moto_id = 0;
        //var snd = new Media("../resources/sounds/ahooga.wav");
			
		db = openDatabase(shortName, version, displayName,maxSize);
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM Settings;', [],
			function(transaction, result) {
				var row = result.rows.item(0);
				if (result != null && result.rows != null) {
					 moto_id = row.MotoId;
					 Email = row.Email;
					 PassWord = row.PassWord;
				}
			 },errorHandler);
		 },errorHandler);


		// availability buttons
		$('#disc').click(function(){
		    disconnect();
		});
		
		$('#recon').click(function(){
		    reconnect();
		});	
		//salir
		$('#logOut').click(function(){
		    logOut(db);
		});	
		//aceptar, rechazar y completar ordenes
		$('#aceptar').click(function(){
		    aceptar_orden();
		});
		$('#rechazar').click(function(){
		    rechazar_orden();
		});
		$('#completar').click(function(){
		    completar_orden();
		});
		function reconnect(){
			if (pusher == null){
				pusher = new Pusher('8890449acb10eddbac23');
			}
		    pusher.disconnect();
		    pusher.connect();
		    $.ajax({
		        type: 'POST',
			    headers: {
			        "email":Email,
			        "password":PassWord
			    },
		        url: 'http://devg.aglobalsolutions.com/app.php?action=available',
		        success: function(data){
					if(data.status == 'ok'){
						$('#recon').removeClass("inactivo");						
						$('#disc').addClass("inactivo");
					    channel = pusher.subscribe('order@'+moto_id);
					    channel.bind('order', function(data) {
							$('#info_orden').html('<ul id="info"><li><span>Dirección Recogida:</span>' + data.order.pickupaddress + '</li><li><span>Nombre Restaurante:</span>' + data.order.pickupname + '</li><li><span>Dirección Entrega:</span>' + data.order.deliveraddress + '</li><li><span>Nombre Entrega:</span>' + data.order.delivername + '</li><li><span>Productos:</span>' + data.order.content + '</li><li><span>Precio Productos:</span>' + data.order.value + '</li></lu>');
							$('#aceptar').toggle();
							$('#rechazar').toggle();
							$('#recon').toggle();						
							$('#disc').toggle();
							$('#info').addClass('info');
							navigator.notification.vibrate(500);
							navigator.notification.beep(1);
							//snd.play();

							
							
					    	order_id = data.order.id;
					    });
					}
		            console.log('Your request was succesfully sent');
		        },
		        error: function(){
		            console.log('There was an error adding your request');
		        }
		    });
		}
		function disconnect(){
			if (pusher == null){
				pusher = new Pusher('8890449acb10eddbac23');
			}
		    pusher.disconnect();
		    $.ajax({
		        type: 'POST',
			    headers: {
			        "email":Email,
			        "password":PassWord
			    },
		        url: 'http://devg.aglobalsolutions.com/app.php?action=not_available',
		        success: function(data){
		            if(data.status == 'ok'){
						$('#recon').addClass("inactivo");						
						$('#disc').removeClass("inactivo");
		            }
		            console.log('Your request was succesfully sent');
		        },
		        error: function(){
		            console.log('There was an error adding your request');
		        }
		    });
		}	
		function aceptar_orden(){
		    $.ajax({
		        type: 'POST',
			    headers: {
			        "email":Email,
			        "password":PassWord
			    },
		        url: 'http://devg.aglobalsolutions.com/app.php?action=accept_order',
		        data: {"order_id":order_id},
		        success: function(data){						
		        	if(data.status == 'ok'){
						alert('La orden fue aceptada su usuario la esta esperando :3');		        		
						$('#completar').toggle();						
		        	}
		        	else{
						alert('oops algo ha salido mal probablemente un domimoto ya tomó la orden espere atento a la próxima orden.');		        				        		       		
						$('#info_orden').empty();
		        	}
		        	$('#aceptar').toggle();
					$('#rechazar').toggle();
		        },
		        error: function(){
		            console.log('There was an error adding your request');
		        }
		    });
		}	
		function completar_orden(){
		    $.ajax({
		        type: 'POST',
			    headers: {
			        "email":Email,
			        "password":PassWord
			    },
		        url: 'http://devg.aglobalsolutions.com/app.php?action=complete_order',
		        data: {"order_id":order_id},
		        success: function(data){					
		        	if(data.status == 'ok'){
						alert('La orden fue completada gracias por sus servicios :3');		        		
			        	$('#recon').toggle();
						$('#disc').toggle();
						$('#completar').toggle();						
						$('#info_orden').empty();
					}
					else{
						alert('Se ha producido un error');		        								
					}
		        },
		        error: function(){
		            console.log('There was an error adding your request');
		        }
		    });
		}	
				
		function rechazar_orden(){
			$('#info_orden').empty();
        	$('#aceptar').toggle();
			$('#rechazar').toggle();
			$('#recon').toggle();
			$('#disc').toggle();

		}	

		function handleMyEvent(data) {
			$('#debug_log').append('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
			alert('U HAVE A DOMICILIO');
		}
		function errorHandler(transaction, error) {
		   alert('Error: ' + error.message + ' code: ' + error.code);
		}
		
		// this is called when a successful transaction happens
		function successCallBack() {
			window.location.replace("index.html");
		}
		
		function logOut(lo){
			lo.transaction(function(lo){
			   lo.executeSql( 'DELETE FROM Settings',
	             []);
	           },errorHandler,successCallBack);
		}
	}

})(jQuery);