const STYLES = {
  swissski: 'mapbox://styles/nerik/cjgnosz9q004y2snzkfi19kt1',
  hillshading: 'mapbox://styles/mapbox/cjaudgl840gn32rnrepcb9b9g', // the outdoors-v10 style but without Hillshade layers
}

let layerId = 'hillshading'


mapboxgl.accessToken = window.mapboxToken
const map = new mapboxgl.Map({
  container: 'map',
  style: STYLES[layerId],
  zoom: 12,
  center: [7.938158, 46.599573]
})

const layerList = document.getElementById('menu')
const inputs = layerList.getElementsByTagName('input')

let layersAdded = false

function switchLayer(layer) {
  layersAdded = false
  layerId = layer.target.id
  const styleUrl = STYLES[layerId]
  map.setStyle(styleUrl)
}

for (let i = 0; i < inputs.length; i++) {
  inputs[i].onclick = switchLayer
}

map.on('data', function () {
  if (!map.isStyleLoaded() || layersAdded === true) {
    return
  }

  layersAdded = true

  if (layerId === 'hillshading') {
    map.addSource('dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.terrain-rgb'
    })
    map.addLayer({
      'id': 'hillshading',
      'source': 'dem',
      'type': 'hillshade'
      // insert below waterway-river-canal-shadow;
      // where hillshading sits in the Mapbox Outdoors style
    }, 'waterway-river-canal-shadow')
  }

  map.addSource('pistes-source', {
    'type': 'vector',
    'url': 'mapbox://nerik.2feqov0i'
  })

  const colorStops = [
    [
      "green",
      "hsl(120, 96%, 40%)"
    ],
    [
      "blue",
      "hsl(236, 96%, 40%)"
    ],
    [
      "red",
      "hsl(359, 94%, 43%)"
    ],
    [
      "black",
      "hsl(0, 0%, 0%)"
    ],
    [
      "double-black",
      "hsl(0, 0%, 0%)"
    ],
    [
      "yellow",
      "hsl(60, 96%, 50%)"
    ],
    [
      "orange",
      "hsl(30, 96%, 50%)"
    ],
    [
      "extreme",
      "hsl(359, 83%, 29%)"
    ],
    [
      "bunny-hill",
      "hsl(326, 89%, 75%)"
    ]
  ]

  // ski tracks
  map.addLayer({
    "id": "pistes-world-d6ytad",
    "type": "line",
    "source": "pistes-source",
    "source-layer": "pistesworld",
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "line-color": {
        "base": 1,
        "type": "categorical",
        "property": "pisteColor",
        "stops": colorStops,
        "default": "hsl(294, 0%, 0%)"
      },
      "line-width": {
        "base": 1,
        "type": "categorical",
        "property": "pisteColor",
        "stops": [
          [
            "double-black",
            3
          ]
        ],
        "default": 1.5
      }
    }
  })

  // ski tracks labels
  map.addLayer({
    "id": "pistes-world-d6ytad-labels",
    "type": "symbol",
    "source": "pistes-source",
    "source-layer": "pistesworld",
    "layout": {
      "visibility": "visible",
      "text-field": "{name}",
      "symbol-placement": "line",
      "text-font": [
        "Open Sans Regular",
        "Arial Unicode MS Regular"
      ],
      "text-size": 14,
      "text-offset": [
        0,
        0
      ],
      "symbol-spacing": 250
    },
    "paint": {
      "text-halo-color": "hsl(0, 4%, 100%)",
      "text-halo-width": 1,
      "text-translate": [
        0,
        0
      ],
      "text-color": {
        "base": 1,
        "type": "categorical",
        "property": "pisteColor",
        "stops": colorStops
      }
    }
  })

})

var colorInterpolate = d3.interpolateRgbBasisClosed(['#FFE1B8', '#FFFFFF', '#8D9FFF'])

var slider = document.getElementById('slider')
slider.addEventListener('input', function(e) {
  const value = parseInt(e.target.value, 10) / 100
  // morning: 312, evening: 215
  const illum = 312 - Math.floor(value * 97)
  const color = colorInterpolate(value)
  const exagOffset = Math.abs(value * 2 - 1)
  const exag = .4 + (.3 * exagOffset)
  console.log(color)
  map.setPaintProperty('hillshading', 'hillshade-illumination-direction', illum)
  map.setPaintProperty('hillshading', 'hillshade-highlight-color', color)
  map.setPaintProperty('hillshading', 'hillshade-exaggeration', exag)

});
