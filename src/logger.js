const { createLogger, format, transports, addColors } = require('winston');
const { combine, timestamp, printf, errors } = format;

// Definir niveles personalizados
const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue'
    }
};

// Formato personalizado de log
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

// Configuración del logger
const logger = createLogger({
    levels: customLevels.levels,
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
    ),
    transports: [
        new transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }),
        new transports.File({ filename: 'logs/errors.log', level: 'error' })
    ]
});

addColors(customLevels.colors);

module.exports = logger;

