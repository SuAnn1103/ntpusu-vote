import { RateLimiter } from "limiter";

const tokensPerInterval = 150
const interval = 'hour'
const limiter = new RateLimiter({
    tokensPerInterval,
    interval,
    fireImmediately: true,
})

const superLimitList = [
    '/api/getResult',
    '/api/vote',
    '/api/voterSession',
]

const limitList = [
    '/api/addVS',
    '/api/archiveVS',
    '/api/checkAdmin',
    '/api/checkLogin',
    '/api/getBallot',
    '/api/getGroup',
    '/api/getLoginCnt',
    '/api/getVoter',
    '/api/getVS',
    '/api/unarchiveVS',
]

export default defineEventHandler(async (event) => {
    if (event.node.req.url) {
        if (superLimitList.includes(event.node.req.url)) {
            if (await limiter.removeTokens(5) < 0) {
                event.node.res.writeHead(429, { 'Content-Type': 'text/plain;charset=UTF-8' })
                event.node.res.end('429 Too Many Requests - your IP is being rate limited')
            }
        }
        else if (limitList.includes(event.node.req.url)) {
            if (await limiter.removeTokens(1) < 0) {
                event.node.res.writeHead(429, { 'Content-Type': 'text/plain;charset=UTF-8' })
                event.node.res.end('429 Too Many Requests - your IP is being rate limited')
            }
        }
    }
})