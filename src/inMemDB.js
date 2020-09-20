
const KEY_INDEX = 0
const VALUE_INDX = 1
const DELETE_LIST = 2

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
            [this.keyMap, this.valueMap, []]
        ]
    }

    isInTransaction() {
        return this.transactions.length > 1
    }

    set(key, value) {
        // first add key
        const [keyDB, valueDB, deleteList] = this.transactions[0]
        keyDB.set(key, value)
        // then add value
        const listOfKeys = valueDB.get(key) || []
        if (listOfKeys.indexOf(key) < 1) {
            listOfKeys.push(key)
        }
        valueDB.set(value, listOfKeys)

        // if this key is in the delete list remove it as it now has
        // a set during the same transaction
        const updatedDeleteList = deleteList.filter((val) => val !== key)
        this.transactions[0][DELETE_LIST] = updatedDeleteList
        console.log(this.transactions[0])
    }

    get(key) {
        // work through transactions; the transactions won't have the
        // entire dataset so we'll first check the current transaction
        // for a value, otherwise check if it was deleted this transaction,
        // otherwise go to next transaction and repeat
        console.log('-- getting ' + key)
        let result = null
        for (let index = 0; index < this.transactions.length; index++) {
            const [keyDB, valueDB, deleteList] = this.transactions[index]
            console.log({ keyDB, valueDB, deleteList })
            const value = keyDB.get(key)
            if (value) {
                result = value
                break;
            }
            // not found in upserts
            if (deleteList.indexOf(key) > -1) {
                break;
            }
        }
        return result
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