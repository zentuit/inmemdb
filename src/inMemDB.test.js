const { TestScheduler } = require('jest')
const inMemDB = require('./inMemDB')

let db

beforeEach(() => {
    db = new inMemDB.InMemDB()
})

test('in transaction', () => {
    expect(db.isInTransaction()).toBe(false)
})

test('set of empty db', () => {
    db.set('a', 123)
    expect(db.get('a')).toEqual(123)
})

test('get of empty db', () => {
    expect(db.get('a')).toBeNull
})

test('get key not in db', () => {
    db.set('a', 123)
    expect(db.get('b')).toBeNull
})

test('get key with multiple entries db', () => {
    db.set('a', 123)
    db.set('b', 4)
    db.set('A', 5)
    console.log('----> ' + db.get('b'))
    expect(db.get('b')).toEqual(4)
})

test('rollback when not in transaction throws error', () => {
    expect(() => {
        db.rollbackTransaction()
    }).toThrow(inMemDB.TransactionError)
})