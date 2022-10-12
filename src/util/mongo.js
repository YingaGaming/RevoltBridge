// Copyright (C) 2022  Marcus Huber (Xenorio)

// This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>.


var MongoClient = require('mongodb').MongoClient;

const server = 'mongodb://127.0.0.1:27017';

const db_name = 'RevoltBridge'

let db

MongoClient.connect(server)
    .then(s => {
        db = s.db(db_name)
    })

module.exports.insert = (collection, obj) => {
    return new Promise((resolve, reject) => {
        db.collection(collection).insertOne(obj)
            .then(res => resolve(res))
    })
}

module.exports.query = (collection, query) => {
    return new Promise((resolve, reject) => {
        let res = db.collection(collection).find(query)
        if (!res) return resolve()
        res.toArray()
            .then(resArray => resolve(resArray))
    })
}

module.exports.queryOne = (collection, query) => {
    return new Promise((resolve, reject) => {
        db.collection(collection).findOne(query)
            .then(res => {
                if (!res) return resolve()
                resolve(res)
            })
    })
}

module.exports.update = (collection, query, newvals) => {
    return new Promise((resolve, reject) => {
        let obj = { $set: newvals }
        db.collection(collection).updateOne(query, obj)
            .then(res => resolve(res))
    })
}

module.exports.delete = (collection, query) => {
    return new Promise((resolve, reject) => {
        db.collection(collection).deleteOne(query)
            .then(res => resolve(res))
    })
}