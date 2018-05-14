#!/usr/bin/env node

const tileReduce = require('@mapbox/tile-reduce')
const path = require('path')

const mbtiles = process.argv[2] || path.join(__dirname, '../data/in/switzerland.mbtiles')

const geoJson = {
  type: 'FeatureCollection',
  features: []
}

tileReduce({
  map: path.join(__dirname, './map.js'),
  sources: [{
    name: 'osm',
    mbtiles,
    // raw: true // set to true will feed the map script raw MVT data instead of GeoJSON
  }],
  mapOptions: {}
})
  .on('reduce', function(data) {
    // process.stderr.write(`${data.features.length} features`)
    geoJson.features = geoJson.features.concat(data.features)
  })
  .on('end', function() {
    process.stderr.write(`reduce complete, ${geoJson.features.length} features`)
    console.log (JSON.stringify(geoJson))
  })
