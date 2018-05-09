#!/usr/bin/env node

const path = require('path')
const out = process.argv[2] || path.join(__dirname, '../data/out/experiment-5')
const fs = require('fs')
const mapshaper = require('mapshaper')

const geoJSONsPath = path.join(out, 'geojson')
const geoJSONs = fs.readdirSync(geoJSONsPath)

geoJSONs.forEach(geoJSON => {
  if (geoJSON === '.DS_Store') {
    return
  }
  const geoJSONPath = path.join(out, 'geojson', geoJSON)
  const svgPath = path.join(out, 'svg', geoJSON.replace('json', 'svg'))
  process.stderr.write(svgPath)
  mapshaper.runCommands([
    geoJSONPath,
    // 'where=_type=="area"', 
    // 'fill=red',
    '-svg-style',
    'where=_type=="water"',
    'fill=blue',
    '-svg-style',
    'where=_type=="path"',
    'stroke=green',
    '-proj',
    '+init=EPSG:3857',
    '-o',
    'format=svg',
    'svg-scale=1',
    svgPath
  ], err => {
    if (err !== null) process.stderr.write(err)
  })
})
