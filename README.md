# auzmor_search
Above Repository is node js app, which provides rest api service for basic page indexing and query searching

<b>Install Repository Files </b>  
To start the above app follow the below steps:
1. git clone https://github.com/anupam587/auzmor_search.git
2. cd auzmor_search
3. npm install

Above steps will install all the required modules from global npm repository

<b>MongoDB Database </b>  
Now install the MongoDB in your local machine   
Default setting for mongoDb database is   
portNumber: 27017   
accessUrl: mongodb://localhost:27017   
create database with <b> db_name: 'page_keyword'</b>   
creaate collection in above database with <b> collection_name: 'keywords'</b>   

<b>Start App </b>  
Now Above app is ready to start with database     
To start above app   
node bin/www  
above app will by default start on 7001 port number 

<b>App config </b>  
In above app <b>config/index.js </b> we have the configuration for above rest api service    

DATABASES:    
   
    DATABASES: {
            url: 'mongodb://localhost:27017',
            db_name: 'page_keyword',
            collection_name: 'keywords'
    },

OTHER SETTINGS:

    MAX_WEIGHT: 8,
    SHOW_MAX_PAGES: 5,
    APP_PORT: 7001
    
<b> Rest Services </b>  

<b> Get Request </b>  
     
    url : 'http://localhost:7001/':  
    Result : {title: 'AuzmorSearch'}


<b> POST Request </b> 

<b> /index_page </b>

    url:  http://localhost:7001/index_page
    Content-Type: 'text/plain'
    Payload : "P1 Ford Car Review"

    Responses:
    Based on the payload differnt responses will come.    
    {
      "status": 200,
      "message": "P1 is added for indexing"
    }
    
   
<b> /search </b>

    url:  http://localhost:7001/search
    Content-Type: 'text/plain'
    Payload : "Ford Car"
    
    Responses:
    Based on the payload differnt responses will come.
    
    [
      {
          "name": "P1"
      },
      {
          "name": "P3"
      },
      {
          "name": "P6"
      },
      {
          "name": "P2"
      },
      {
          "name": "P4"
      }
  ]
    
    
    
    
