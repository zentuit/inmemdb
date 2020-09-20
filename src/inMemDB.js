
const KEY_INDEX = 0
const VALUE_INDEX = 1

const ACTIVE = true
const DELETED = false

class InMemDB {


    constructor() {
        // choosing a Map here instead of a Red-Black Tree
        // as Map will give O(1) unless a rehash happens
        // vs Red-Black Tree's O(logn) which is the upper limit
        // we should do some large scale performance testing to see
        // when the rehashing is problematic
        this.keyMap = new Map()
        // use a value Map to make Count sub O(logn)
        this.valueMap = new Map()
        this.transactions = [
            [this.keyMap, this.valueMap]
        ]
    }

    isInTransaction() {
        return this.transactions.length > 1
    }

    last() {
        return this.transactions.length - 1
    }

    set(key, value) {
        // first add key
        console.log('%%%%%%')
        console.log('all: ')
        console.log(this.transactions)
        console.log(this.transactions[this.last()])
        console.log('...........')
        const [keyDB, valueDB] = this.transactions[this.last()]
        keyDB.set(key, [value, ACTIVE])
        // then add value
        const listOfKeys = valueDB.get(key) || []
        if (listOfKeys.indexOf(key) < 1) {
            listOfKeys.push([key, ACTIVE])
        }
        valueDB.set(value, listOfKeys)
        console.log(this.transactions)
        console.log(this.transactions[this.last()])
        console.log('..... %%%%%%')
    }

    get(key) {
        const RESULT_ACTIVE_INDEX = 1
        const RESULT_VALUE_INDEX = 0
        // work through transactions; the transactions won't have the
        // entire dataset so we'll first check the current transaction
        // for an value then check if its ACTIVE or DELETED
        // otherwise go to next transaction and repeat
        console.log('-- getting ' + key)
        console.log(this.transactions)
        let result = null
        console.log(this.transactions.length - 1)
        for (let index = this.transactions.length - 1; index >= 0; index--) {
            console.log('index: ' + index)
            const [keyDB, valueDB] = this.transactions[index]
            console.log({ keyDB, valueDB })
            const value = keyDB.get(key)
            console.log(value)
            if (value) {
                result = value
                break;
            }
        }
        const x = result && result[RESULT_ACTIVE_INDEX] ? result[RESULT_VALUE_INDEX] : null
        // console.log('result: ' + result)
        // console.log(result)
        // console.log('result[active]: ' + result[RESULT_ACTIVE_INDEX] + " :: " + result[RESULT_VALUE_INDEX] + ' --- ' + x)

        return x
    }

    startTransaction() {
        this.transactions.push([new Map(), new Map()])

    }

    commitTransaction() {
        // work through transactions
        for (let index = this.transactions.length - 1; index >= 0; index--) {
            const [keyDB, valueDB, deleteList] = this.transactions[index]
            
        }
    }

    rollbackTransaction() {
        if (!this.isInTransaction()) {
            throw TRANSACTION_NOT_FOUND
        }
        // remove maps at end
        this.transactions.pop()
    }

    count(value) {

    }

}

class TransactionError extends Error {
    constructor(message) {
        super(message)
    }
}

const TRANSACTION_NOT_FOUND = new TransactionError('TRANSACTION NOT FOUND')

module.exports = {
    InMemDB,
    TransactionError
}