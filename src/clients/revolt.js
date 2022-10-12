const { Client } = require('revolt.js')

let revolt = new Client()

module.exports.login = (token) => {
    revolt.loginBot(token)
    return revolt
}

module.exports.get = () => {
    return revolt
}