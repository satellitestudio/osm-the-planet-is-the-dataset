#### The Overpass query

```
`[out:json][timeout:25];(
    node(around:${radius},${lat},${lng});
    way(around:${radius},${lat},${lng});
    relation(around:${radius},${lat},${lng});
    <;
);
out center;
>;
out skel qt;`
```

So for instance, somewhere in Vancouver, Canada, with a 300 meters radius:
```
[out:json];(
    node(around:300,49.222,-123);
    way(around:300,49.222,-123);
    relation(around:300,49.222,-123);
    <;
);
out center;
>;
out skel qt;
```

Calls to the API:



Check out the whole project on Github:
https://github.com/nerik/osm-haiku


#### Other possibilities with Overpass QL:

By polygon:

```
[out:json];(
    node(poly:"lat1 lon1 lat2 lon2 ...");
);
out skel qt;
```

Rough polygon around the city center of Valencia, Spain:
```
[out:json];(
    node(poly:"39.5 -0.4 39.45 -0.4 39.45 -0.35 39.47 -0.34 39.49 -0.35");
);
out skel qt;
```

By named area:

```
[out:json];
( area[name="United Kingdom"]; )->.a;
(
  node[amenity=childcare](area.a);
);
out meta qt;
```

Reference: https://wiki.openstreetmap.org/wiki/Overpass_API/Language_Guide