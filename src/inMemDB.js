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
        // use a value Map to make Count sub O(logn)
        this.transactions = [
            { keyDB: new Map(), valueDB: new Map() }
        ]
    }

    isInTransaction() {
        return this.transactions.length > 1
    }

    last() {
        return this.transactions.length - 1
    }

    set(key, value) {
        const { keyDB, valueDB } = this.transactions[this.last()]

        // we need to update the previous value so we can keep the valuedb up to date
        const originalValue = this._getFullRecord(key)
        if (originalValue && originalValue.active) {
            this._decrementKeyCount(originalValue.value)
        }

        // now update the key and value maps
        keyDB.set(key, { value, active:ACTIVE })
        // then add value
        this._incrementKeyCount(value)
    }

    get(key) {
        const result = this._getFullRecord(key)
        return result && result.active ? result.value : null
    }

    remove(key) {
        // we have 2 options, we have this key in current transaction or not
        // if it is we flip the flag otherwise we see if its in previous
        // transactions and decrement the count (if exists)
        const { keyDB, valueDB } = this.transactions[this.last()]
        const result = keyDB.get(key)
        if (result) {
            result.active = false
            this._decrementKeyCount(result.value)
        } else {
            const prevResults = this._getFullRecord(key)
            if (prevResults && prevResults.active) {
                keyDB.set(key, { value: prevResults.value, active: DELETED })
                this._decrementKeyCount(prevResults.value)
            }
        }
    }

    startTransaction() {
        this.transactions.push({ keyDB: new Map(), valueDB: new Map() })

    }

    commitTransaction() {
        if (!this.isInTransaction()) {
            // skip out of any processing if we're not in a transaction
            return
        }

        // reduce the transactions down to one set of maps
        const merged = this.transactions.reduceRight((accum, { keyDB, valueDB }) => {
            return {
                keyDB: new Map([...keyDB, ...accum.keyDB]),
                valueDB: new Map([...valueDB, ...accum.valueDB]),
            }
        }, { keyDB: new Map(), valueDB: new Map() })
        this.transactions = [merged]
    }

    rollbackTransaction() {
        if (!this.isInTransaction()) {
            throw TRANSACTION_NOT_FOUND
        }
        // remove last transaction maps at end
        this.transactions.pop()
    }

    count(value) {
        const result = this._getFullRecord(value, USE_VALUE_DB)
        return result || 0
    }


    _getFullRecord(key, useValueDB = false) {
        // work through transactions; the transactions won't have the
        // entire dataset so we'll first check the current transaction
        // for an value otherwise go to next transaction and repeat
        let result = null
        for (let index = this.transactions.length - 1; index >= 0; index--) {
            const { keyDB, valueDB } = this.transactions[index]
            const value = useValueDB ? valueDB.get(key) : keyDB.get(key)
            if (!(value == null)) {
                result = value
                break;
            }
        }
        return result
    }

    _decrementKeyCount(value) {
        let count = this._getFullRecord(value, USE_VALUE_DB)
        this.transactions[this.last()].valueDB.set(value, --count)
    }

    _incrementKeyCount(value) {
        let count = this._getFullRecord(value, USE_VALUE_DB)
        this.transactions[this.last()].valueDB.set(value, ++count)
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