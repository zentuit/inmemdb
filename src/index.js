const readline = require('readline')
const { InMemDB } = require('./inMemDB')
const { parse } = require('./commandParser')

const inMemDB = require('./inMemDB').InMemDB



const run = () => {
    const db = new InMemDB()

    const reader = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>> '
    })

    const commandMap = {
        'delete': 'remove',
        'begin': 'startTransaction',
        'commit': 'commitTransaction',
        'rollback': 'rollbackTransaction',
    }

    reader.prompt()

    reader.on('line', (line) => {
      const statement = parse(line)
      const command = statement.command.toLowerCase()
      if ( command == 'end') {
          reader.close()
      } else {
          dbFunc = commandMap[command] || command
          let result = db[dbFunc](statement.key, statement.value)
          if (command == 'get') {
            if (result == null) {
              result = 'NULL'
            }
          }
          if (!(result == null)) {
            console.log(result)
          }
      }
      reader.prompt()
    }).on('close', () => {
      shutdown()
    })
}

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', () => {
	console.info('Got SIGINT. Graceful shutdown ', new Date().toISOString())
  shutdown()
})

// quit properly on docker stop
process.on('SIGTERM', () => {
  console.info('Got SIGTERM. Graceful shutdown ', new Date().toISOString())
  shutdown()
})

// shut down server
function shutdown(err) {
  if (err) {
    console.error(err)
    process.exitCode = 1
  }
  process.exit()
}

run()