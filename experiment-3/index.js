#!/usr/bin/env node

const tileReduce = require('@mapbox/tile-reduce')
const path = require('path')

const mbtiles = process.argv[2] || path.join(__dirname, 'data/in/france.mbtiles')

const hairdresserNamesCount = {}
let hairdressersCount = 0

tileReduce({
  map: path.join(__dirname, './map.js'),
  sources: [{
    name: 'osm',
    mbtiles: mbtiles,
    // raw: true // set to true will feed the map script raw MVT data instead of GeoJSON
  }],
  mapOptions: {}
})
  .on('reduce', function(data) {
    process.stderr.write(` ${data.names.length} features`)

    data.names.forEach(name => {
      if (hairdresserNamesCount[name]) {
        hairdresserNamesCount[name]++
      } else {
        hairdresserNamesCount[name] = 1
      }
      hairdressersCount++
    })
  })
  .on('end', function() {
    var arr = Object.keys(hairdresserNamesCount).map(name => ({
      name,
      count: hairdresserNamesCount[name]
    }))

    process.stderr.write(`a grand total of ${hairdressersCount} hairdressers`)

    arr.sort((a, b) => a.count - b.count)

    process.stdout.write('name,count')
    arr.forEach((feature) => {
      process.stdout.write(`${feature.name}, ${feature.count}\n`)
    })
  })
