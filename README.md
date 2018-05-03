#### How to use

- Install dependencies (node v7 needed):
```
npm i
```

- Install tippecanoe globally (for experiment 6):


- For experiments 3-6: download mbtiles needed from https://osmlab.github.io/osm-qa-tiles/

- Typically the resulting datasets are sent to stdout, so start experiments by running

```
./experiment-6/index.js [input mbtiles] > [output file (geoJSON, CSV)]
./experiment-6/index.js data/in/switzerland.mbtiles > data/out/switzerland-pistes.json
```
- For experiments that need a mapbox token: 

```
cp mapbox-token-sample.js mapbox-token.js
```

Then add your own token.
