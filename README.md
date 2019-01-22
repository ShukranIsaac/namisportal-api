## Calling Region Endpoints
Here is an **example** of how to query for region name in url under the ***/regions*** endpoint
```
/regions
```
the response will be something like this:

```
// 20190122105344
// http://localhost:3300/regions

[
  {
    "properties": {
      "name": "Northern Region"
    },
    "polygons": [
      "5c46d5f521c0a71664d7b301",
      "5c46d5f521c0a71664d7b302",
      "5c46d5f521c0a71664d7b303"
    ],
    "districts": [
      "5c45a346f2320d359c3aa928",
      "5c45a346f2320d359c3aa92b",
      "5c45a346f2320d359c3aa92d",
      "5c45a346f2320d359c3aa934",
      "5c45a346f2320d359c3aa93b",
      "5c45a346f2320d359c3aa93f"
    ],
    "_id": "5c46d5aac0a607159d6001fd",
    "__v": 2
  },
  {
    "properties": {
      "name": "Central Region"
    },
    "polygons": [
      "5c46d5f521c0a71664d7b304",
      "5c46d5f521c0a71664d7b305",
      "5c46d5f521c0a71664d7b306",
      "5c46d5f521c0a71664d7b307",
      "5c46d5f521c0a71664d7b308",
      "5c46d5f521c0a71664d7b309"
    ],
    "districts": [
      "5c45a346f2320d359c3aa929",
      "5c45a346f2320d359c3aa92a",
      "5c45a346f2320d359c3aa92c",
      "5c45a346f2320d359c3aa92e",
      "5c45a346f2320d359c3aa931",
      "5c45a346f2320d359c3aa936",
      "5c45a346f2320d359c3aa938",
      "5c45a346f2320d359c3aa939",
      "5c45a346f2320d359c3aa93c"
    ],
    "_id": "5c46d5aac0a607159d6001fe",
    "__v": 2
  },
  {
    "properties": {
      "name": "Southern Region"
    },
    "polygons": [
      "5c46d5f521c0a71664d7b30a",
      "5c46d5f521c0a71664d7b30b",
      "5c46d5f521c0a71664d7b30c",
      "5c46d5f521c0a71664d7b30d",
      "5c46d5f521c0a71664d7b30e"
    ],
    "districts": [
      "5c45a346f2320d359c3aa924",
      "5c45a346f2320d359c3aa925",
      "5c45a346f2320d359c3aa926",
      "5c45a346f2320d359c3aa927",
      "5c45a346f2320d359c3aa92f",
      "5c45a346f2320d359c3aa930",
      "5c45a346f2320d359c3aa932",
      "5c45a346f2320d359c3aa933",
      "5c45a346f2320d359c3aa935",
      "5c45a346f2320d359c3aa937",
      "5c45a346f2320d359c3aa93a",
      "5c45a346f2320d359c3aa93d",
      "5c45a346f2320d359c3aa93e"
    ],
    "_id": "5c46d5aac0a607159d6001ff",
    "__v": 2
  }
]
```
get the _id and and use it ase the uid (unique identifier) in the other endpoints

### Querying for a specific region

Here is an **example** of how to query for region's districts in url under the ***/regions/:uid*** endpoint

```
/regions/5c46d5aac0a607159d6001ff
```
the result will be something like this:
```

  "properties": {
    "name": "Southern Region"
  },
  "polygons": [
    {
      "geometry": {
        "coordinates": [Array]
      }
    }
    ... more polygons
  ],
  "districts": [
    "5c45a346f2320d359c3aa924",
    "5c45a346f2320d359c3aa925",
    "5c45a346f2320d359c3aa926",
    "5c45a346f2320d359c3aa927",
    "5c45a346f2320d359c3aa92f",
    "5c45a346f2320d359c3aa930",
    "5c45a346f2320d359c3aa932",
    "5c45a346f2320d359c3aa933",
    "5c45a346f2320d359c3aa935",
    "5c45a346f2320d359c3aa937",
    "5c45a346f2320d359c3aa93a",
    "5c45a346f2320d359c3aa93d",
    "5c45a346f2320d359c3aa93e"
  ],
  "_id": "5c46d5aac0a607159d6001ff",
  "__v": 2
}
    
```

### Querying for region's districts

Here is an **example** of how to query for region polygons in url under the ***/regions/:uid/polygons*** endpoint

```
/regions/5c46d5aac0a607159d6001ff/districts
```
the response will be something like this:
```
[
  {
    "properties": {
      "name": "Balaka"
    },
    "centroids": {
      "lat": -15.036430710286124,
      "lng": 35.05619110015966
    },
    "marepCenters": [Array],
    "polygons": [Array],
    "distributionLines": [Arrar],
    "_id": "5c45a346f2320d359c3aa924",
    "__v": 2
  },
  ... more districts
]
```

## Calling District Endpoints
Here is an **example** of how to query for district name in url under the ***/districts*** endpoint
```
/districts?name=Zomba
```
the result will be something like this:

```
{
  "properties": {
    "name": "Zomba"
  },
  "centroids": {
    "lat": -15.398793800428265,
    "lng": 35.42695315385985
  },
  "marepCenters": [
    
  ],
  "polygons": [
    "5c45aedba5ec703926750f78"
  ],
  "distributionLines": [
    "5c45a35bc7b06935e347041b",
    "5c45a35bc7b06935e347041c",
    "5c45a35bc7b06935e347041d",
    "5c45a35bc7b06935e347041e",
    "5c45a35bc7b06935e347041f",
    ...many more
  ]
  "_id": "5c45a346f2320d359c3aa93e",
  "__v": 2
}
```
get the _id and and use it ase the uid (unique identifier) in the other endpoints

### Querying for distrtict marep centers

Here is an **example** of how to query for district marep centers in url under the ***/districts/:uid/marep-centers*** endpoint

```
/districts/5c45a346f2320d359c3aa93e/marep-centers
```

### Querying for distrtict polygons

Here is an **example** of how to query for district polygons in url under the ***/districts/:uid/polygons*** endpoint

```
/districts/5c45a346f2320d359c3aa93e/polygons
```

### Querying for distrtict distribution lines

Here is an **example** of how to query for district distribution in url under the ***/districts/:uid/distribution-lines***endpoint

```
/districts/5c45a346f2320d359c3aa93e/distribution-lines
```