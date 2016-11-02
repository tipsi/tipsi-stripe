import http from 'http'

export default function appiumIsRunning(host, port) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      method: 'GET',
      host,
      port,
      path: '/wd/hub/status',
    }, (res) => {
      if (res.statusCode !== 200) {
        return reject(`Appium is not running on: ${host}:${port}`)
      }
      return resolve()
    })

    req.on('error', () => {
      reject(`Appium is not running on: ${host}:${port}`)
    })

    req.end()
  })
}
