map.removeLayer(tileLayer)
positronnolabels = L.tileLayer.provider('CartoDB.PositronNoLabels').addTo(map);
labels = L.tileLayer.provider('Stamen.TonerLabels').addTo(map);

var Cognito = window.Cognito || {};
var authToken;

function logIn() {
    Cognito.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
            //$.ajax({
            //        url: './query-budget/',
            //        type: "POST",
            //        data: JSON.stringify({ }),
            //        dataType: "json",
            //        headers: {
            //            'content-type': 'application/json',
            //            Authorization: authToken
            //        }
            //    })
        } else {
            window.location.href = _config.cognito.signinUrl;
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = _config.cognito.signinUrl;
    });
  }
logIn();

var noSleep = new NoSleep();


var pingPointArray = [];
var pushArray = [];

function pushPath () {
  if (pingPointArray.length > 0) {
    pushArray = pingPointArray;
    pingPointArray = pingPointArray.slice(-1);
    var jqxhr = $.ajax({
        method: 'POST',
        url: 'https://f2ic5cxey7.execute-api.us-east-1.amazonaws.com/dev/ping/',
        headers: {
        		Authorization: authToken
        },
        data: JSON.stringify({ 'path': polyline.encode(pushArray)}),//JSON.stringify('formData'),
        contentType: 'application/json',
        crossDomain:true,
        success: function(xhr){
          //var newmarker = L.circle([latlng.lat, latlng.lng], 2).addTo(map)
          loadMapJson();
          },
        error: function(xhr){
              alert("Data connection issue! Please submit again.");
              console.log(xhr);
              $(this).prop("disabled",false);
            }
    });

    // returns a string-encoded polyline (from coordinate ordered lat,lng)
    var line = polyline.encode(pingPointArray);
    console.log(line)
  }
}



var mark  = L.layerGroup();
function onLocationFound(e) {
		//map.removeLayer(userLocation);
		if (map.hasLayer(mark)){
				map.removeLayer(mark);
				mark.clearLayers();
		}
		mark.addLayer(L.circle(e.latlng, 1, { color: 'red'}));
		map.addLayer(mark);
}


//var x = document.getElementById("exampleModal");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, null, {maximumAge:1000, timeout:990, enableHighAccuracy: true});
  } else {
    //x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
function showPosition(position) {
  //x.innerHTML = ("Latitude: " + position.coords.latitude +
  // "<br>Longitude: " + position.coords.longitude);
  pingPointArray.push([position.coords.longitude, position.coords.latitude]);
}


var getLocationInterval
var uploadPathInterval
var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/')+1);
if (filename == 'plow.html') {


  map.on('locationfound', onLocationFound);
  map.locate({setView : true, watch: true, enableHighAccuracy: true, maximumAge:1000});




  var mode='stop';
  $( "#record-button" ).click(function() {
    if (mode=='stop') {
      var interval = 3000;
      // start recording location
      pingPointArray.length = 0;
      pushArray.length = 0;
      getLocationInterval = setInterval(function(){ getLocation(); }, interval);
      uploadPathInterval = setInterval(function(){ pushPath(); }, interval * 10);
      mode = 'record'
      noSleep.enable();
      $("#record-button").removeClass("btn-secondary").addClass("btn-danger").html('RECORDING... <i class="fas fa-square"></i>');
      $("#pBar1").css("display","flex")
      $("#pBar2").css("display","flex")
    } else {
      // stop recording location
      clearInterval(getLocationInterval);
      clearInterval(uploadPathInterval);
      pingPointArray.length = 0;
      pushArray.length = 0;
      mode = 'stop'
      noSleep.disable();
      $("#record-button").removeClass("btn-danger").addClass("btn-secondary").html('RECORD <i class="fas fa-circle"></i>');
      $("#pBar1").hide()
      $("#pBar2").hide()
    }
  });
}

var menu = L.leafletMenu(map, {
        items: {
            'Sign Out': {
                onClick: function () {
                    Cognito.signOut();
                    //console.log(authToken)
                    logIn();
                    window.location.href = _config.cognito.signinUrl;
                },
            },
        }
});
var menuButton = L.easyButton({
    states: [{
        stateName: 'show-menu',
        icon: 'fa fa-tasks',
        title: 'Show Menu',
        onClick: function (btn, map) {
            menu.options.button = btn;
            menu.show();
            btn.state('hide-menu');
        }
    },{
        stateName: 'hide-menu',
        icon: 'fa fa-tasks',
        title: 'Hide Menu',
        onClick: function (btn, map) {
            menu.hide();
            btn.state('show-menu');
        }
    }],
    id: 'styles-menu',
});
menuButton.addTo(map);
