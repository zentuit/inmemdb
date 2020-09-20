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