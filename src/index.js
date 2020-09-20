const { InMemDB } = require('./inMemDB')

const inMemDB = require('./inMemDB').InMemDB


const run = () => {
    console.log("up and running")
    const db = new InMemDB()
}

run()