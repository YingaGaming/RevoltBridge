const fs = require('fs')

if (!fs.existsSync('./config.js')) {
    console.error('Could not find config.js - Please make sure to rename config.default.js')
    process.exit()
}

const config = require('../config')

let revolt = require('./clients/revolt').login(config.keys.revolt)
let discord = require('./clients/discord').login(config.keys.discord)

loadEvents()

async function loadEvents() {

    fs.readdir('./src/events/revolt', (err, files) => {
        files.forEach(file => {
            if (!file.endsWith('.js')) return
            let name = file.split('.')[0]
            let event = require(`./events/revolt/${file}`)
            revolt.on(name, event.bind(null, revolt, discord))
        })
    })

    fs.readdir('./src/events/discord', (err, files) => {
        files.forEach(file => {
            if (!file.endsWith('.js')) return
            let name = file.split('.')[0]
            let event = require(`./events/discord/${file}`)
            discord.on(name, event.bind(null, revolt, discord))
        })
    })

}