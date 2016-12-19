import { getDevices } from 'node-simctl'

export default async function findiOSDevice(type = 'iPhone 6', version) {
  const result = await getDevices()

  const sdks = Object.keys(result)
  const devices = sdks.reduce(
    (memo, sdk) => {
      const nextDevices = result[sdk].map(
        device => ({ ...device, sdk })
      )
      return [...memo, ...nextDevices]
    },
    []
  )

  if (type && !version) {
    const booted = devices.find(
      device => device.name === type && device.state === 'Booted'
    )

    if (booted) {
      return {
        id: booted.udid,
        type: booted.name,
        version: booted.sdk,
      }
    }

    const sdk = sdks[sdks.length - 1] // Last version of SDK
    const best = result[sdk].find(
      device => device.name === type
    )

    if (best) {
      return {
        id: best.udid,
        type: best.name,
        version: best.sdk,
      }
    }
  }

  if (type && version) {
    const requested = devices.find(
      device => device.name === type && device.sdk === version
    )

    if (requested) {
      return {
        id: requested.udid,
        type: requested.name,
        version: requested.sdk,
      }
    }
  }

  throw new Error(`Can not find any iOS devices with name: ${type}, version: ${version}`)
}
