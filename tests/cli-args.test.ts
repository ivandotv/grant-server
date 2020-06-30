import { main } from '../src/main'
import commander from 'commander'
import path from 'path'

jest.mock('fs')
let args: string[], program: commander.Command, configPath: string

beforeEach(() => {
  jest.clearAllMocks()
  args = ['node_exec', 'path_to_file']
  program = new commander.Command()
  configPath = 'path/to/config-1.json'
})

describe('CLI args', () => {
  test('if no config file is passed, look at the current directory', () => {
    program.exitOverride()

    try {
      main(args, program)
    } catch {
      expect(program.config).toBe(path.resolve(process.cwd(), 'config.json'))
    }
  })
  test('If configuration file is passed, use it', () => {
    program.exitOverride()
    const filePath = '/test/config.json'
    args.push('-c', filePath)

    try {
      main(args, program)
    } catch {
      expect(program.config).toBe(filePath)
    }
  })
  test('If debug flag is used set default debug values', () => {
    program.exitOverride()
    args.push('-d')
    args.push('-c', configPath)

    try {
      main(args, program)
    } catch {
      expect(program.debug).toBe('res,json')
    }
  })
  test('If debug options are passed, use them', () => {
    program.exitOverride()
    const debugOpts = 'res,req,body,json'
    args.push('-d', debugOpts)
    args.push('-c', configPath)

    try {
      main(args, program)
    } catch {
      expect(program.debug).toBe(debugOpts)
    }
  })
  test('If trust-proxy flag is used, set it to true', () => {
    program.exitOverride()
    args.push('-p')
    args.push('-c', configPath)

    try {
      main(args, program)
    } catch (e) {
      console.log('E ', e)
      expect(program.trustProxy).toBe(true)
    }
  })
  test('If trust-proxy options are passed, use them', () => {
    program.exitOverride()
    const proxyOpts = 'loopback, 123.123.123.123'
    args.push('-p', proxyOpts)
    args.push('-c', configPath)

    try {
      main(args, program)
    } catch {
      expect(program.trustProxy).toBe(proxyOpts)
    }
  })
  test('Version number is the same as the package.json version number', () => {
    const fs = jest.requireActual('fs')
    const version = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../package.json')).toString()
    ).version
    program.exitOverride()
    args.push('--version')

    expect(() => {
      main(args, program)
    }).toThrow(version)
  })
})
