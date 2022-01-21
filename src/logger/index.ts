import logger from "pino";
import dayjs from "dayjs";

const _logger = logger({
    transport: {
        target: 'pino-pretty'
    },
    base: {
        pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default _logger;
