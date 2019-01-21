## Calling endpoints
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