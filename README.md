
# Running the in memory db: #

## From docker ##
* pull the image from docker hub
    * `docker pull zentuit/demo_inmemdb:1.0`
* run the image container
    * `docker run -it zentuit/demo_inmemdb:1.0`

The in memory db is now running and awaiting commands.

## From command line node ##
* application is written assuming **node 14** so ensure you have that version installed
* make directory
    * `mkdir inmemdb`
* copy zip file to `inmemdb` directory
* change to the project root
    * `cd inmemdb`
* extract application
    * `unzip demo_inmemdb.zip`
* run npm
    * `npm install --only=production`
* run node
    * `node ./src/index.js`

The in memory db is now running and awaiting commands.
