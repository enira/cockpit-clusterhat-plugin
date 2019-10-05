
var button_stop = "<button class=\"btn btn-default btn-control-ct fa fa-stop\" id=\"action_stop_$PI\"></button>";
var button_start = "<button class=\"btn btn-default btn-control-ct fa fa-play\" id=\"action_start_$PI\"></button>";


var cmd_neighbor = ["ip", "neighbor"];
var cmd_ip = ["ip", "a"];

var devices = 0;

function discover_ip(device) {
	cockpit.spawn(cmd_neighbor, { }).done(function(data) {
		neighbor = new String(data);
			
		// search for ip in neighbor list
		var mac = "00:22:82:ff:ff:0" + device.replace("p","");
		var ns = neighbor.split('\n');
		var foundip = "";
			
		for (var l = 0;l < ns.length; l++) {
			if(ns[l].includes(mac)) {
				foundip = ns[l].split(" ")[0];
							
				document.getElementById("ip_" + device).innerHTML = foundip;
				document.getElementById("status_" + device).innerHTML = "<span class=\"green\">Online</span>";
			}
		}
		
		if (foundip == "") {
			setTimeout(function() {
				discover_ip(device);
			}, 4000)
		}
		
		}).fail(function(error){
			console.log(error);
		});		
}

function action(pi) {
	var doaction = pi.split("_");
	var btnid = "action_";
	
	if(doaction[1] == "start") {
		var cmddo = ["clusterctrl", "on", doaction[2]];
		cockpit.spawn(cmddo, { }).done(function(data) {
			// set new status online
			document.getElementById("status_" + doaction[2]).innerHTML = "<span class=\"orange\">Booting</span>";
			document.getElementById("button_" + doaction[2]).innerHTML = button_stop.replace("$PI", doaction[2]);
			
			setTimeout(function() {
				discover_ip(doaction[2]);
			}, 4000);
			
			btnid = btnid +"stop_" + doaction[2];
			
			document.getElementById(btnid).addEventListener("click", function(){
				action($(this)[0].id);
			});
		
			
		}).fail(function(error){
		   console.log(error);
		});
	}
	
	if(doaction[1] == "stop") {
		var cmddo = ["clusterctrl", "off", doaction[2]];
		cockpit.spawn(cmddo, { }).done(function(data) {
			// set new status offline
			document.getElementById("status_" + doaction[2]).innerHTML = "<span class=\"red\">Shutdown</span>";
			document.getElementById("button_" + doaction[2]).innerHTML = button_start.replace("$PI", doaction[2]);
			document.getElementById("ip_" + doaction[2]).innerHTML = "";
			
			
			btnid = btnid +"start_" + doaction[2];
			
			document.getElementById(btnid).addEventListener("click", function(){
				action($(this)[0].id);
			});
		
		}).fail(function(error){
		   console.log(error);
		});
	}
	
	
	// rebind listeners
	/*document.getElementById("pilist").innerHTML = document.getElementById("pilist").innerHTML ;
	
	var elems = document.querySelectorAll('[id^="action"]');
	for (var i = 0; i < elems.length; i++) {
		
		elems[i].addEventListener("click", function(){
			action($(this)[0].id);
		});
	}*/
}

function leds_on() {
		var cmd_leds = ["clusterctrl", "led", "on"];
		cockpit.spawn(cmd_leds, { }).done(function(data) {
		}).fail(function(error){
		   console.log(error);
		});
}

function leds_off() {
		var cmd_leds = ["clusterctrl", "led", "off"];
		cockpit.spawn(cmd_leds, { }).done(function(data) {
		}).fail(function(error){
		   console.log(error);
		});
}

cockpit.spawn(cmd_ip, { }).done(function(data) {
		ips = new String(data);
		var controllerip = "";
		var lines = ips.split('\n');
		for(var i = 0;i < lines.length;i++){
			if(lines[i].includes("inet ") && !lines[i].includes("127.0.0.1") && !lines[i].includes("172.19.180.254")) {
				var formatted = lines[i].split(" ")[5].split("/");
				controllerip = controllerip + formatted[0]  +", ";
			}
		}
		if(controllerip.length > 2) {
			controllerip = controllerip.substring(0, controllerip.length - 2);
		}
		
		document.getElementById("controller_ip").innerHTML = controllerip;
	}).fail(function(error){
       console.log(error);
    }
);

cockpit.spawn(cmd_neighbor, { }).done(function(data) {
		neighbor = new String(data);
				
		var cmd_status = ["clusterctrl", "status"];
		cockpit.spawn(cmd_status, { }).done(function(data) {
				ctrlstatus = new String(data);
				
				var lines = ctrlstatus.split('\n');
				for(var i = 0;i < lines.length;i++){
					if(lines[i].startsWith("p")) {
						devices = devices + 1;
						
						var item = lines[i].split(":");
						var status = "<span class=\"green\">Online</span>";
						var btns = "";
						var foundip = "";
						if(item[1] == "0"){
							status = "<span class=\"red\">Shutdown</span>";
							btns =  button_start.replace("$PI", item[0]);
						}
						else {
							btns = button_stop.replace("$PI", item[0]);
							
							// search for ip in neighbor list
							var mac = "00:22:82:ff:ff:0" + item[0].replace("p","");
							var ns = neighbor.split('\n');
							
							for (var l = 0;l < ns.length; l++) {
								if(ns[l].includes(mac)) {
									foundip = ns[l].split(" ")[0];
								}
							}
						}
						var pi = "<tr class=\"listing-ct-item\"><th id=\"status_" + item[0] + "\">"+status+"</th><td>"+ item[0]+ "</td><td id=\"ip_"+item[0]+"\">"+foundip+"</td><td class=\"listing-ct-actions\" id=\"button_"+item[0]+"\">"+btns+"</td></tr>";
						document.getElementById("pilist").innerHTML = document.getElementById("pilist").innerHTML + pi;
					}
				}		
				 
				document.getElementById("pilist").innerHTML = document.getElementById("pilist").innerHTML +" <tr class=\"listing-ct-panel\"></tr>";
			
				var elems = document.querySelectorAll('[id^="action"]');
				for (var i = 0; i < elems.length; i++) {
					elems[i].addEventListener("click", function(){
						action($(this)[0].id);
					});
				}
				}).fail(function(error){
			   console.log(error);
			}
		);

		}).fail(function(error){
			console.log(error);
		}
);

window.onload = function(){
	document.getElementById("leds_on").addEventListener("click", leds_on);
	document.getElementById("leds_off").addEventListener("click", leds_off);
}

cockpit.transport.wait(function() { });
