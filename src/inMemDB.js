
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

    set(key, value) {
        // first add key
        const [keyDB, valueDB] = this.transactions[0]
        keyDB.set(key, [value, ACTIVE])
        // then add value
        const listOfKeys = valueDB.get(key) || []
        if (listOfKeys.indexOf(key) < 1) {
            listOfKeys.push([key, ACTIVE])
        }
        valueDB.set(value, listOfKeys)
        console.log(this.transactions[0])
    }

    get(key) {
        const RESULT_ACTIVE_INDEX = 1
        const RESULT_VALUE_INDEX = 0
        // work through transactions; the transactions won't have the
        // entire dataset so we'll first check the current transaction
        // for an value then check if its ACTIVE or DELETED
        // otherwise go to next transaction and repeat
        console.log('-- getting ' + key)
        let result = null
        for (let index = 0; index < this.transactions.length; index++) {
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

    }

    commitTransaction() {
        // work backwards through transactions
        for (let index = this.transactions.length - 1; index < 0; index--) {
            const [keyDB, valueDB, deleteList] = this.transactions[index]
            
        }
    }

    rollbackTransaction() {

    }

    count(value) {

    }

}

module.exports = {
    InMemDB,
}