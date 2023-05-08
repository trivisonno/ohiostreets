var urlBase = "https://hv2o9op7m2.execute-api.us-east-1.amazonaws.com/dev"

var map = L.map('map', {
  zoomControl: true,
  zoomSnap: 0.5,
  fullscreenControl: true
});

// map.setView([41.49968, -81.69364], 15);

var tileLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  maxNativeZoom: 19,
  maxZoom: 19
});

L.control.scale({
  metric: false,
  maxWidth: 200
}).addTo(map);

var streets = L.layerGroup();
var streetsJSON = L.geoJson();
map.addLayer(streets);

var vehicles = L.layerGroup();
var vehiclesJSON = L.geoJson();
map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.addLayer(vehicles);
var lastUpdateLoaded = 0;


function loadMapJson() {
  function popUp(f,l){
    var out = [];
    if (f.properties){
        for(key in f.properties){
          if (key.includes("tiger")==false && key.includes("etymology")==false) {
            if (key == "@id") {
              out.push(key+": <a target='_blank' href='https://www.openstreetmap.org/"+f.properties[key]+"'>"+f.properties[key]+"</a>");
            } else {
              out.push(key+": "+f.properties[key]);
            }
          }
        }
        l.bindPopup(out.join("<br />"));
    }
}


  var jsonTest = new L.GeoJSON.AJAX(["ohio_30-40mph_streets.geojson"],{onEachFeature:popUp, style: function(feature) {
        switch (feature.properties.maxspeed) {
            case '30 mph': return {color: "#1E88E5"};
            case '35 mph':   return {color: "#FFC107"};
            case '40 mph':   return {color: "#D81B60"};
        }
    }}).addTo(map);
}




var legend = L.control({position: 'topright'});
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
   labels = ['<strong>Ohio streets without<br>state route tags:</strong>']

  labels.push('<i style="background:#1E88E5"></i> 30 mph');
  labels.push('<i style="background:#FFC107"></i> 35 mph');
  labels.push('<i style="background:#D81B60"></i> 40 mph');
div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(map);


loadMapJson();



L.easyButton('fa-camera', function(btn, map){
  const map2 = document.querySelector(".leaflet-labels-pane .leaflet-zoom-animated");
  const coordinates = map2.style.transform.split("(")[1].split(")")[0].split(",");
  map2.style.top = -1 * parseInt(coordinates[1].replace("px", ""), 10) + "px";
  map2.style.left = -1 * parseInt(coordinates[0].replace("px", ""), 10) + "px";

  map.downloadExport({
    container: map._container,
    format: "image/jpg",
    fileName: "plowcle-screenshot_"+moment.tz(moment.tz.guess()).format('YYYYMMDD_hmmAz')+".jpg",
    exclude: ['.leaflet-control-zoom',  '.leaflet-control-attribution']
  })

  map2.style.top = '0';
  map2.style.left = '0';
}).addTo( map );


var options = { timeout: 60000, position: 'topleft' }
var box = L.control.messagebox(options).addTo(map);
