map.removeLayer(tileLayer)

var darkmatternolabels   = L.tileLayer.provider('CartoDB.DarkMatterNoLabels');
    darkmatter   = L.tileLayer.provider('CartoDB.DarkMatter');
    positronnolabels = L.tileLayer.provider('CartoDB.PositronNoLabels').addTo(map),
    positron = L.tileLayer.provider('CartoDB.Positron'),
    tonerdark = L.tileLayer.provider('Stamen.Toner');
    tonerlight = L.tileLayer.provider('Stamen.TonerLite');
    esri = L.tileLayer.provider('Esri.WorldImagery');
    labels = L.tileLayer.provider('Stamen.TonerLabels').addTo(map);

    var baseMaps = {
        "darkmatternolabels": darkmatternolabels,
        "darkmatter": darkmatter,
        "positronnolabels": positronnolabels,
        "positron": positron,
        "tonerdark": tonerdark,
        "tonerlight": tonerlight,
        "esri": esri
    };

    var overlayMaps = {
      "labels": labels
  };

//L.control.layers(baseMaps, overlayMaps).addTo(map);
