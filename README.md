# Waldo APP

Store EXIF Data for image in DataStore (MongoDB)

## Requirements
- NodeJs 5.0.0 or later. 
- npm 3.0.0 or later
- mongodb

## Installation 
- Make sure mongo db is installed. 
- git clone git@github.com:sgmarghade/waldo-app.git
- cd waldo-app
- npm install
- node index.js  (Server will start with default ports. )
- you can override port or mongo host /port etc by passing env variables eg : server__port=27000 mongo__port=1234 node index.js 

## Technology used 
- NodeJs for backend
- Hapi.js as NodeJs framework
- Mongo as datastore. 

## API
- POST http://localhost:27010/v1/documents   //Will create document from default URL provided. 
- GET http://localhost:27010/v1/documents?criteria[data.image.Make]=NIKON CORPORATION&criteria[data.image.Model]=NIKON D750&limit=2

## Scale / Evolution over time. 
- This app downloads each url in sequence which can be done parallely. We can use queue from where multiple threads can fetch url and load data store. 
- Query API can be enhanced to next level, supporting all fields. 
- This app uses MongoDb as data store, using Mongo or ElasticSearch is sufficient to scale and build query layer over top of it.
- Information is stored at document level and we don't need transactional DB (Through we can use it).  
- Current app cross check API key in DB before fetching. Which will avoid duplicates in case http connection dropout. 

Happy coding!


