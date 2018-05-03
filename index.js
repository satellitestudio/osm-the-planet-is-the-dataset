#!/usr/bin/env node

const tileReduce = require('@mapbox/tile-reduce')
const path = require('path')
const fs = require('fs')

const mbtiles = process.argv[2] || path.join(__dirname, 'data/in/belgium.mbtiles');


var geoJson = {
  type: 'FeatureCollection',
  features: []
}

var names = {}

tileReduce({
  map: path.join(__dirname, '/src/map.js'),
  sources: [{
    name: 'osm',
    mbtiles: mbtiles,
    // raw: true // set to true will feed the map script raw MVT data instead of GeoJSON
  }],
  mapOptions: {}
})
.on('reduce', function(data) {
  process.stderr.write(`${data.features.length} features`)
  // geoJson.features = geoJson.features.concat(data.features);

  data.features.forEach(function (feature) {
    var name = feature.properties.name
    if (names[name]) {
      names[name]++;
    } else{
      names[name] = 1;
    }
  })
})
.on('end', function() {
  // process.stderr.write(`reduce complete, ${geoJson.features.length} features`)
  // console.log (JSON.stringify(geoJson))

  var arr = Object.keys(names).map(function(name) {
    return { name: name, count: names[name] }
  });

  arr.sort(function (a, b) {
    return a.count > b.count;
  })

  arr.forEach(function (feature) {
    console.log(`${feature.name}, ${feature.count}`)
  });

})
