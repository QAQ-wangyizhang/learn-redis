const redis = require("redis");
const client = redis.createClient();
const {
    promisify
} = require("util")
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);


module.exports = function (options = {}) {
    const isJSON = options.isJSON === undefined ? true : options.isJSON;
    const ttl = options.ttl || -1;
    return async function (req, res, next) {
        const key = req.originalUrl;
        // console.log(key)
        let content = await getAsync(key);
        if (content) {
            console.log("使用了缓存", key)
            const body = isJSON ? JSON.parse(content) : content;
            res.send(body) // 有缓存
        } else {
            // 没有缓存 如何获取后续响应中的响应体
            // express 写响应体 最终是通过 res.write 函数完成
            const defaultWrite = res.write.bind(res);
            const defalutEnd = res.end.bind(res);
            const chunks = [];
            res.write = function (chunk, ...args) {
                chunks.push(chunk);
                defaultWrite(chunk, ...args);
            };
            res.end = async function (chunk, ...args) {
                if (chunk) {
                    chunks.push(chunk);
                }
                console.log(chunks)
                const body = chunks.map((c) =>
                    c.toString("utf-8")).join()
                console.log(body);
                if (ttl < 0) {
                    // 如果ttl小于0 就设置永不过期 默认为-1
                    setAsync(key, body)
                } else {
                    setAsync(key, body, "EX", ttl)
                }
                console.log(chunks);
                defalutEnd(chunk, ...args);
            };
            next();
        }

    }
}