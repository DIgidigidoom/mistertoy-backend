import { MongoClient } from 'mongodb'

const criteria = {
	ccType: 'MC',
}

const projection = {
	fullName: true,
	balance: true,
	_id: false,
}
const sort = {
	balance: 1,
}
const skip = 2
const limit = 2

const client = await MongoClient.connect('mongodb://localhost:27017/')
const coll = client.db('CaFeb25').collection('customer')

const cursor = coll.find(criteria, { projection, sort, skip, limit })
const result = await cursor.toArray()
