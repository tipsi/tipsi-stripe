import adb from 'adbkit'

const client = adb.createClient()

export default async function findAndroidDevice() {
  try {
    const devices = await client.listDevices()
    if (!devices.length) {
      throw new Error('Device list is empty')
    }
    // Get first android device
    const device = devices[0]
    // Get device info
    const props = await client.getProperties(device.id)
    return {
      id: device.id,
      type: device.type,
      version: props['ro.build.version.release'],
    }
  } catch (error) {
    throw new Error(`Can not find any android devices: ${error}`)
  }
}
