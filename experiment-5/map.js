var pip = require('@turf/boolean-point-in-polygon').default
var coordAll = require('@turf/meta').coordAll
var getArea = require('@turf/area').default

const contains = (feature, envelope) => {
  const samplePoint = coordAll(feature)[0]
  return pip(samplePoint, envelope)
}

// return features like roller coasters etc that 'belong' to the theme park envelope
const getSubfeatures = (features, envelope) => {
  const filteredFeatures = features.filter(feature => {
    const p = feature.properties
    return contains(feature, envelope) &&
      (
        p.highway === 'pedestrian' ||
        p.highway === 'footway' ||
        p.railway === 'narrow_gauge' ||
        p.railway === 'miniature' ||
        p.railway === 'monorail' ||
        p.railway === 'tram' ||
        p.railway === 'rail' ||
        p.highway === 'raceway' ||
        p.natural === 'water' ||
        p.waterway === 'river' ||
        p.waterway === 'canal'
      )
  })
  filteredFeatures.forEach(feature => {
    const p = feature.properties
    feature.properties._type = 'rollercoaster'
    if (p.natural === 'water' || p.waterway !== undefined) {
      p._type = 'water'
    }
    else if (p.highway === 'pedestrian'  || p.highway === 'footway') {
      p._type = 'path'
    }
  })
  return filteredFeatures
}

module.exports = function(data, tile, writeData, done) {
  const themeParksEnveloppes = data.osm.osm.features.filter(feature => {
    return feature.properties.tourism === 'theme_park' &&     // get object tagged as theme parks
          feature.properties.name !== undefined &&
          ['Polygon', 'MultiPolygon'].indexOf(feature.geometry.type) > -1      // exclude non polygon geometries
  })

  const themeParksFragments = themeParksEnveloppes.map(themeParkEnveloppe => {
    const id = themeParkEnveloppe.properties['@id']
    let name = themeParkEnveloppe.properties.name
    name = name.replace('\'', '').replace('-','')
    themeParkEnveloppe.properties._type = 'area'
    const features = (global.mapOptions.includeEnveloppe === true) ? [themeParkEnveloppe] : []
    const area = getArea(themeParkEnveloppe)
    return {
      area,
      id,
      name,
      features: features.concat(getSubfeatures(data.osm.osm.features, themeParkEnveloppe))
    }
  }).filter(themeParksFragment => themeParksFragment.features.length && themeParksFragment.area > 250000)
  done(null, {
    themeParksFragments
  })
}
  