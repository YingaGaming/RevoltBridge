const mongo = require('../../util/mongo')
const request = require('cross-fetch')
const config = require('../../../config')
const fs = require('fs')

module.exports = (revolt, discord, message) => {

    if (message.member.user.bot) return

    if (message.content.toLowerCase().startsWith(config.prefix)) {
        if (message.member.user.bot) return
        let args = message.content.split(config.prefix)
        args.shift()
        args = args.join('').split(' ')
        let command = args[0].toLowerCase()
        args.shift()

        if (!fs.existsSync(`./src/commands/revolt/${command}.js`)) return

        require(`../../commands/revolt/${command}.js`).run(revolt, discord, message, args)

        return
    }

    let channelID = message.channel._id
    let content = message.content
    let username = message.member.nickname || message.member.user.username
    let avatar = message.member.generateAvatarURL() || message.member.user.generateAvatarURL()

    mongo.queryOne('Channels', { revolt: channelID })
        .then(channels => {
            let webhook = channels.discordWebhook
            request(webhook, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: content,
                    username: username,
                    avatar_url: avatar
                })
            })
        })
}