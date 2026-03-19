import type winston from 'winston'
import { isDebuggingEnabled } from '@mannercode/nest-testing'
import { readFile } from 'fs/promises'
import { sleep } from '../../utils/functions'
import { Path } from '../../utils/path'
import { createWinstonLogger } from '../create-winston-logger'

describe('createWinstonLogger', () => {
    let logger: winston.Logger
    let tempDir: string

    beforeEach(async () => {
        tempDir = await Path.createTempDirectory()

        logger = createWinstonLogger({
            consoleLogLevel: isDebuggingEnabled() ? 'verbose' : 'silent',
            daysToKeepLogs: '1d',
            directory: tempDir,
            fileLogLevel: 'verbose'
        })
    })

    afterEach(async () => {
        logger.close()
        await Path.delete(tempDir)
    })

    async function getLogEntry() {
        const content = await readFile(Path.join(tempDir, 'current.log'), 'utf-8')
        const entry = JSON.parse(content)
        return entry
    }

    // 일반 로그 항목을 기록한다
    it('writes a general log entry', async () => {
        const message = 'test message'

        logger.info(message)
        await sleep(200)

        const entry = await getLogEntry()

        expect(entry).toEqual({ level: 'info', message, timestamp: expect.any(String) })
    })

    // HTTP 로그 항목을 기록한다
    it('writes an HTTP log entry', async () => {
        const message = 'test message'
        const logDetails = {
            contextType: 'http',
            request: { body: 'body', method: 'GET', url: '/exception' },
            response: { code: 'ERR_CODE', message: 'message' },
            stack: 'stack...',
            statusCode: 500
        }

        logger.info(message, [logDetails])
        await sleep(200)

        const entry = await getLogEntry()

        expect(entry).toEqual({
            '0': logDetails,
            level: 'info',
            message,
            timestamp: expect.any(String)
        })
    })

    // RPC 로그 항목을 기록한다
    it('writes an RPC log entry', async () => {
        const message = 'test message'
        const logDetails = {
            context: { args: ['subject'] },
            contextType: 'rpc',
            data: {},
            response: { code: 'ERR_CODE', message: 'message' },
            stack: 'stack...'
        }

        logger.info(message, [logDetails])
        await sleep(200)

        const entry = await getLogEntry()

        expect(entry).toEqual({
            '0': logDetails,
            level: 'info',
            message,
            timestamp: expect.any(String)
        })
    })
})
