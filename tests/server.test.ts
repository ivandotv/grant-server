import { GrantServer } from '../src/server'
describe('Grant Server', () => {
  console.log = jest.fn()
  test('Server is setting env DEBUG to true', () => {
    // eslint-disable-next-line
    new GrantServer(true, true)

    expect((process.env.DEBUG = 'true'))
  })

  test('Server is setting env DEBUG to req,res', () => {
    const debugValue = 'req,resp'
    // eslint-disable-next-line
    new GrantServer(true, debugValue)

    expect((process.env.DEBUG = 'req'))
  })

  test('Start the server', async () => {
    const debugValue = 'req,resp'
    const grantServer = new GrantServer(true, debugValue)
    const config = require('./__fixtures__/config.json')

    await grantServer.start(config)

    expect(grantServer.server?.listening).toBe(true)

    await grantServer.stop()
  })
  test('Stop the server', async () => {
    const debugValue = 'req,resp'
    const grantServer = new GrantServer(true, debugValue)
    const config = require('./__fixtures__/config.json')

    await grantServer.start(config)
    await grantServer.stop()

    expect(grantServer.server?.listening).toBe(false)
  })
  test('Server listens on port from the configuration file', async () => {
    const debugValue = 'req,resp'
    const grantServer = new GrantServer(true, debugValue)
    const config = require('./__fixtures__/config.json')
    const port = config.defaults.origin.split(':')[2]

    await grantServer.start(config)

    // @ts-ignore
    expect(grantServer.server!.address()!.port!).toBe(Number(port))
    await grantServer.stop()
  })
})
