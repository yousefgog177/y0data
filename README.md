# Y0data services #

**Please read y0data inc before using it**
**To get database id go to https://data.y0host.net/**
**Your data will save in servers y0data, so no disk will take from your server**

# install y0data

``` js
npm install y0data
```

# Connect Database

``` js
let y0data = require('y0data')
let db = new y0data('DATA BASE ID')
db.connect();
```

# events

```js
db.once('ready', async ()=>{
  console.log(`DataBase Ready`)
})

db.on('error', (err)=>{  
  console.log(`Error: ` + err)
})
```

# setup collection

```js
let customersDB = db.setUpCollection('customers')
```

# functions

## Create
```js
let data = await customersDB.add([{"money": 51}, {"money": 9}]) // example output → '[Accepted Data]'
let data = await customersDB.add({"_id": "123", "money": 5}) // example output → '{Accepted Data} / null'
/*
For free plan 50 array max in same time
For Shared Plan 100 Array max in same time
For Server Plan 500 Array max in same time
*/
```

## find data
```js
let options = {
$gte: {money: 10}, // Get Users have money low of 10
$gt: {money: 50} // get Users have money more of 50
$in: {_id: ['123', '1234']} // get Users have in same _id
}

let data = await customersDB.find(options).exec(); // example output → 'Array'
let data = await customersDB.find(options).limit(20).exec(); // (Get Only 20 data) example output → 'Array'
let data = await customersDB.find(options).skip(20).exec(); // (Skip first 20) example output → 'Array'
let data = await customersDB.find(options).select({money: 1}).exec(); // (Will only see _id and money) example output → 'Array'
let data = await customersDB.find(options).select({money: 0}).exec(); // (Will hide money) example output → 'Array'

let data = await customersDB.findOne(options).exec(); // example output → 'Object/Null'
let data = await customersDB.findOne(options).skip(20).exec(); // (Skip first 20) example output → 'Object/Null'
let data = await customersDB.findOne(options).select({money: 1}).exec(); // (Will only see _id and money) example output → 'Object/Null'
let data = await customersDB.findOne(options).select({money: 0}).exec(); // (Will hide money) example output → 'Object/Null'
```

## Update Data
```js
let options = {
$gte: {money: 10}, // Get Users have money low of 10
$gt: {money: 50} // get Users have money more of 50
$in: {_id: ['123', '1234']} // get Users have in same _id
}

let new_values = {
$inc: {money: 50}, // Add money you can also do -50 to remove

$push: {arr: ["1"]}, // add in array items 
$push: {arr: "1"}, // add in array item

$pull: {arr: ["1"]}, // delete from array items
$pull: {arr: "1"} // delete from array item
}

let data = await customersDB.updateOne(options, new_values) // example output → 'true/false' 

let data = await customersDB.updateMany(options, new_values); // example output → 'true/false' (if update one only will return true always)
```

## Delete Data
```js
let options = {
$gte: {money: 10}, // Get Users have money low of 10
$gt: {money: 50} // get Users have money more of 50
$in: {_id: ['123', '1234']} // get Users have in same _id
}

let data = await customersDB.deleteOne(options) // example output → 'true/false'

let data = await customersDB.deleteMany(options); // example output → 'true/false' (if update one only will return true always)
```

## Other functions will support you
```js
let options = {
$gte: {money: 10}, // Get Users have money low of 10
$gt: {money: 50} // get Users have money more of 50
$in: {_id: ['123', '1234']} // get Users have in same _id
}

let data = await customersDB.countDocuments(options) // example output → 'true/false'

let data = await customersDB.getSize(options); // example output → 'true/false' (if update one only will return true always)
```

## Watch
```js
await cusotmersDB.watch()

db.on('watch', (data)=>{
    console.log('data watch =>', data) // will get name of collection and more data
})
```