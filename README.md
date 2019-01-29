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
    "polygons": [Array],
    "districts": [Array],
    "_id": "5c46d5aac0a607159d6001fd",
    "__v": 2
  },
  {
    "properties": {
      "name": "Central Region"
    },
    "polygons": [Array],
    "districts": [Array],
    "_id": "5c46d5aac0a607159d6001fe",
    "__v": 2
  },
  {
    "properties": {
      "name": "Southern Region"
    },
    "polygons": [Array],
    "districts": [Array],
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
  "districts": [Aray],
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
  "distributionLines": [Array]
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

Here is an **example** of how to query for district distribution in url under the ***/districts/:uid/distribution-lines*** endpoint

```
/districts/5c45a346f2320d359c3aa93e/distribution-lines
```

### Querying for district transformers

Here is an **example** of how to query for district transformers in url under the ***/districts/:uid/transformers*** endpoint

```
/districts/5c45a346f2320d359c3aa93e/transformers
```
## Calling files endpoints
Behold, the endpoints for files

### To get all the files
Make a get request to this endpoint
```
/files
```

### To get a file by uid
Make a get request to this endpoint
```
/files/:uid
```

### To upload a file
Make a post request to this endpoint
```
/files/upload
```
### To download a file
Make a get request to this endpoint
```
/files/:uid/download
```
Heres's an example of how request body should look like
```
{
  name: String,
  file: [File]
}
```

## Calling Caregories Endpoints
### To get all categories
Make a get request to this endpoint
```
/categories
```

###To get a category by id
Make a get request to this endpoint
```
/categories/uid
```

###To create a new category
Make a post request to this endpoint
```
/categories
```

Heres's an example of how request body should look like
```
{
  name: String,
  about: String
}
```

###To create add a subcategory to an existing category
Make a post request to this endpoint
```
/categories/:uid/sub-categories
```

Heres's an example of how request body should look like
```
{
  name: String,
  about: String
}
```

### To get subcategories under a category
Make a get request to this endpoint
```
/categories/:uid/sub-categories
```

### To add a document to a category
Make a post request to this endpoint
```
/categories/:uid/documents
```

Heres's an example of how request body should look like
```
{
  name: String,
  file: [File]
}
```

