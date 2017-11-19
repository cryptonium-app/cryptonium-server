# Cryptonium-Server

Server APIs for cryptonium extension. 

## Getting Started 

### Prerequisites

* Node 8 or above
* MySQL database server 
* Redis Server
   
## Installing 

* Create a sql database using ``create.sql``. 
* Enter your local mySQL db password and username in ``local.json`` 
* npm install
* Run ``NODE_ENV=local node app.js``
* Use the APIs listed below

## API List
 

### Scam 

* ```GET``` ```/api/scam/analyis```

### Report 


* ```POST``` ```/api/report/insert```

Request Example : 

```
{
	"url" : "https//scam-site.com", 
	"coin" : "Bitcoin" , 
	"wallet_address" : "",
	"reason" : "I think this is a phishing site for bitcoin wallet"
}
```
### ICO 

* ```GET``` ```/api/scam/analysis```
