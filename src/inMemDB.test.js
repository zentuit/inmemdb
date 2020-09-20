const { TestScheduler } = require('jest')
const inMemDB = require('./inMemDB')

let db

beforeEach(() => {
    db = new inMemDB.InMemDB()
})

// test('in transaction', () => {
//     expect(db.isInTransaction()).toBe(false)
// })

// test('set of empty db', () => {
//     db.set('a', 123)
//     expect(db.get('a')).toEqual(123)
// })

// test('get of empty db', () => {
//     expect(db.get('a')).toBeNull
// })

// test('get key not in db', () => {
//     db.set('a', 123)
//     expect(db.get('b')).toBeNull
// })

// test('get key with multiple entries db', () => {
//     db.set('a', 123)
//     db.set('b', 4)
//     db.set('A', 5)
//     console.log('----> ' + db.get('b'))
//     expect(db.get('b')).toEqual(4)
// })

// test('startTransaction adds to transaction list', () => {
//     db.startTransaction()
//     expect(db.transactions.length).toEqual(2)
// })

// test('rollback when not in transaction throws error', () => {
//     expect(() => {
//         db.rollbackTransaction()
//     }).toThrow(inMemDB.TransactionError)
// })

// test('rollback one level', () => {
//     db.set('a', 123)
//     db.startTransaction()
//     db.set('a', 456)
//     expect(db.get('a')).toEqual(456)
//     db.rollbackTransaction()
//     expect(db.get('a')).toEqual(123)
// })

// test('rollback multiple levels', () => {
//     db.set('a', 123)
//     db.startTransaction()
//     db.set('a', 456)
//     db.startTransaction()
//     db.set('a', 789)
//     db.startTransaction()
//     db.set('a', 10)
//     expect(db.get('a')).toEqual(10)
//     db.rollbackTransaction()
//     expect(db.get('a')).toEqual(789)
//     db.rollbackTransaction()
//     expect(db.get('a')).toEqual(456)
//     db.rollbackTransaction()
//     expect(db.get('a')).toEqual(123)
// })

// test('remove', () => {
//     db.set('a', 1)
//     expect(db.get('a')).toEqual(1)
//     expect(db.count(1)).toEqual(1)
//     db.remove('a')
//     expect(db.get('a')).toBeNull
//     expect(db.count(1)).toEqual(0)
// })

// test('remove and readd in same transaction', () => {
//     db.set('a', 1)
//     expect(db.get('a')).toEqual(1)
//     db.remove('a')
//     expect(db.get('a')).toBeNull
//     db.set('a', 1)
//     expect(db.get('a')).toEqual(1)
// })

// test('count of empty database', () => {
//     expect(db.count(123)).toEqual(0)
// })


// test('count of used database', () => {
//     db.set('a', 123)
//     db.set('b', 456)
//     db.set('A', 789)
//     db.set('e', 123)
//     db.set('g', 987)
//     expect(db.count(123)).toEqual(2)
// })


// test('count of used database', () => {
//     db.set('a', 123)
//     db.set('b', 456)
//     db.set('A', 789)
//     db.set('e', 123)
//     db.set('g', 987)
//     expect(db.count(123)).toEqual(2)
// })


test('count when transactions', () => {
    db.set('a', 123)
    db.set('b', 456)
    db.startTransaction()
    db.set('A', 789)
    db.set('e', 123)
    db.startTransaction()
    db.set('g', 987)
    expect(db.count(123)).toEqual(2)
})

test('count when transactions with deletes', () => {
    db.set('a', 123)
    db.set('b', 456)
    db.startTransaction()
    db.set('A', 789)
    db.set('e', 123)
    db.startTransaction()
    db.set('g', 987)
    db.remove('a')
    expect(db.count(123)).toEqual(1)
})

test('count when transactions with deletes and readds', () => {
    db.set('a', 123)
    db.set('b', 456)
    db.startTransaction()
    db.set('A', 789)
    db.set('e', 123)
    db.startTransaction()
    db.set('g', 987)
    db.remove('a')
    db.startTransaction()
    db.set('a', 123)
    expect(db.count(123)).toEqual(2)
})
