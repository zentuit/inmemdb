const VALUEDB_INDEX = 1

const ACTIVE = true
const DELETED = false

const USE_VALUE_DB = true

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
            { keyDB: this.keyMap, valueDB: this.valueMap }
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
        const { keyDB, valueDB } = this.transactions[this.last()]
        keyDB.set(key, { value, active:ACTIVE })
        // then add value
        const listOfKeys = this._getFullRecord(value, USE_VALUE_DB) || []
        if (listOfKeys.indexOf(key) < 1) {
            listOfKeys.push({ key, active: ACTIVE })
        }
        valueDB.set(value, listOfKeys)
        console.log(this.transactions)
        console.log(this.transactions[this.last()].keyDB)
        console.log(this.transactions[this.last()].valueDB)
        console.log('..... %%%%%%')
    }

    get(key) {
        const result = this._getFullRecord(key)
        console.log('result: ' + result)

        return result && result.active ? result.value : null
    }

    remove(key) {
        // set deleted flag for value in keydb
        const result = this._getFullRecord(key)
        if (result) {
            result.active = false
            // set deleted flag for key in valuedb
            console.log('key ==> ' + result.active)
            const listOfKeys = this._getFullRecord(result.value, USE_VALUE_DB)
            console.log('listOfKeys ==> ' + listOfKeys)
            const keyIndex = listOfKeys.findIndex((element) => element.key == key)
            console.log('keyIndex ==> ' + keyIndex)
            if (keyIndex < 0) {
                throw new DatabaseError('Corrupted key/value matching')
            }
            listOfKeys[keyIndex] = { key, active: DELETED }
        }
    }

    startTransaction() {
        this.transactions.push({ keyDB: new Map(), valueDB: new Map() })

    }

    commitTransaction() {
        // work through transactions
        for (let index = this.transactions.length - 1; index >= 0; index--) {
            const {keyDB, valueDB} = this.transactions[index]
            
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
        const result = this._getFullRecord(value, USE_VALUE_DB)
        console.log(result)
        if (!result) {
            return 0
        }

        const activeKeys = result.filter(({ key, active }) => active) || []
        console.log(' ... count: activeKeys = ' + activeKeys)
        return activeKeys.length
    }


    _getFullRecord(key, useValueDB = false) {
        // work through transactions; the transactions won't have the
        // entire dataset so we'll first check the current transaction
        // for an value then check if its ACTIVE or DELETED
        // otherwise go to next transaction and repeat
        console.log('-- getting ' + key + ' :: using value db? ' + useValueDB)
        console.log(this.transactions)
        let result = null
        console.log(this.transactions.length - 1)
        for (let index = this.transactions.length - 1; index >= 0; index--) {
            console.log('index: ' + index)
            const { keyDB, valueDB } = this.transactions[index]
            console.log(keyDB)
            console.log(valueDB)
            const value = useValueDB ? valueDB.get(key) : keyDB.get(key)
            console.log(value)
            if (value) {
                result = value
                break;
            }
        }
        return result
    }

}

class TransactionError extends Error {
    constructor(message) {
        super(message)
    }
}

class DatabaseError extends Error {
    constructor(message) {
        super(message)
    }
}

const TRANSACTION_NOT_FOUND = new TransactionError('TRANSACTION NOT FOUND')

module.exports = {
    InMemDB,
    TransactionError,
    DatabaseError,
}