const express = require('express')

const logger = require('./services/logging-service')

let app = express()
const port = 7239

app.use(express.json())

app.post('/', async (req, res) => {
    let pushbulletService = require('./services/pushbullet')
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    if (req.body.authCode && req.body.authCode == process.env.HTTPS_AUTHENTICATION_SECRET) {
        if (req.body.deviceName && req.body.action) {
            let response
            switch (req.body.action) {
                case 'pushNote':
                    if (req.body.noteTitle && req.body.noteBody) {
                        response = await pushbulletService.pushNote(req.body.deviceName, req.body.noteTitle, req.body.noteBody)
                    } else {
                        response = 'Missing required parameters'
                    }

                    break
                case 'pushLink':
                    if (req.body.linkName && req.body.linkUrl && req.body.linkBody) {
                        response = await pushbulletService.pushLink(req.body.deviceName, req.body.linkName, req.body.linkUrl, req.body.linkBody)
                    } else {
                        response = 'Missing required parameters'
                    }

                    break
                default:
                    response = `Invalid action: ${req.body.action}`
            }
            logger.info(response);
            res.write(response)
        }
    }
    res.end()
})

app.listen(port, function () {
    logger.info(`app listening on port ${port}`)
})