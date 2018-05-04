#!/usr/bin/env node

const tileReduce = require('@mapbox/tile-reduce')
const path = require('path')
const fs = require('fs')
const mapshaper = require('mapshaper')

const mbtiles = process.argv[2] || path.join(__dirname, '../data/in/belgium.mbtiles')

let themeParksFragments = []
const themeParksGeoJSON = {}

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
    process.stderr.write(`${data.features.length} features`)
    themeParksFragments = themeParksFragments.concat(data.features)
    // data.features.forEach(themePark => {
    //   const file = path.join(__dirname, '../data/out/svg', 'test.json')
    //   console.log(file)
    //   mapshaper.runCommands()
    //   //fs.writeFileSync(file, JSON.stringify(themePark))
    // })
  })
  .on('end', function() {
    //process.stderr.write(`reduce complete, ${geoJson.features.length} features`)
    //console.log (JSON.stringify(geoJson))
    //console.log(themeParksFragments)
    themeParksFragments.forEach(themeParkFragment => {
      const id = themeParkFragment.properties['@id']
      if (themeParksGeoJSON[id] !== undefined) {
        themeParksGeoJSON[id].features.push(themeParkFragment)
      } else {
        themeParksGeoJSON[id] = {
          type: 'FeatureCollection',
          features: [themeParkFragment]
        }
      }
    })

    console.log(themeParksGeoJSON)

    Object.keys(themeParksGeoJSON).forEach(id => {
      console.log(id)
      const geoJSON = themeParksGeoJSON[id]
      console.log(geoJSON)
      const name = geoJSON.features[0].properties.name || id
      console.log(name)
      const file = path.join(__dirname, '../data/out/svg', `${name}.json`)
      fs.writeFileSync(file, JSON.stringify(geoJSON))
    })

  })
