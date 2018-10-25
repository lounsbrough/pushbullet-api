var PushBullet = require('pushbullet')
var pusher = new PushBullet(process.env.PUSHBULLET_ACCESS_TOKEN)

const logErrorIfPresent = (error) => {
    if (error || '' != '') {
        console.log(error)
    }
}

const findDevicesByName = async (deviceName) => {
    let matchedDevices = []

    await pusher.devices((error, response) => {
        logErrorIfPresent(error)
        response.devices.forEach(device => {
            if (device.nickname.toLowerCase() == deviceName.toLowerCase()) {
                matchedDevices.push(device)
            }
        })
    });

    return matchedDevices
}

const deviceIdFromDevice = (device) => {
    return device.iden
}

const pushNote = async (deviceName, noteTitle, noteBody) => {
    const devicesFound = await findDevicesByName(deviceName)

    if (!Array.isArray(devicesFound) || devicesFound.length == 0) {
        return `No devices found for {${deviceName}}`
    }

    const deviceId = deviceIdFromDevice(devicesFound[0])

    await pusher.note(deviceId, noteTitle, noteBody, (error, response) => {
        logErrorIfPresent(error)
    });

    return 'Note pushed successfully';
}

const pushLink = async (deviceName, linkName, linkUrl, linkBody) => {
    const devicesFound = await findDevicesByName(deviceName)

    if (!Array.isArray(devicesFound) || devicesFound.length == 0) {
        return `No devices found for {${deviceName}}`
    }

    const deviceId = deviceIdFromDevice(devicesFound[0])

    await pusher.link(deviceId, linkName, linkUrl, linkBody, (error, response) => {
        logErrorIfPresent(error)
    });

    return 'Link pushed successfully';
}

module.exports = {
    pushLink,
    pushNote
}