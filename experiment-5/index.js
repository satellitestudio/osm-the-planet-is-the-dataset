#!/usr/bin/env node

const tileReduce = require('@mapbox/tile-reduce')
const path = require('path')
const fs = require('fs')

const mbtiles = process.argv[2] || path.join(__dirname, '../data/in/belgium.mbtiles')
const out = process.argv[3] || path.join(__dirname, '../data/out/experiment-5')

let themeParksFragments = []
const themeParksGeoJSONs = {}

tileReduce({
  map: path.join(__dirname, './map.js'),
  sources: [{
    name: 'osm',
    mbtiles
  }],
  mapOptions: {
    includeEnveloppe: false
  }
})
  .on('reduce', function(data) {
    //process.stderr.write(`${data.themeParksFragments.length} features\n`)
    themeParksFragments = themeParksFragments.concat(data.themeParksFragments)
  })
  .on('end', function() {
    console.log(themeParksFragments)
    themeParksFragments.forEach(themeParkFragment => {
      console.log(themeParkFragment)
      const id = themeParkFragment.id
      if (themeParksGeoJSONs[id] !== undefined) {
        themeParksGeoJSONs[id].features = 
          themeParksGeoJSONs[id].features.concat(themeParkFragment.features)
        themeParksGeoJSONs[id].area += themeParksGeoJSONs[id].area 
      } else {
        themeParksGeoJSONs[id] = {
          name: themeParkFragment.name,
          area: themeParkFragment.area,
          type: 'FeatureCollection',
          features: themeParkFragment.features
        }
      }
    })

    Object.keys(themeParksGeoJSONs).forEach(id => {
      const geoJSON = themeParksGeoJSONs[id]
      let name = geoJSON.name
      console.log(name, geoJSON.area)
      const geoJSONFile = path.join(out, 'geojson', `${name}.json`)
      //const svgFile = path.join(out, 'svg', `${name}.svg`)
      fs.writeFile(geoJSONFile, JSON.stringify(geoJSON), err => { 
        if (err !== null) {
          process.stderr.write(err)
          return
        }      
        
      })
    })
  })
