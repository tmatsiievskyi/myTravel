// import * as winston from "winston";
// import * as morgan from "morgan";

// export const logger = winston.createLogger({
//   transports: [
//     new winston.transports.Console({
//       level: 'debug',
//       handleExceptions: true,
//       format: winston.format.combine(
//         winston.format.timestamp({ format: 'HH:mm:ss:ms' }),
//         winston.format.colorize(),
//         winston.format.printf(
//           (info) => `${info.timestamp} ${info.level}: ${info.message}`,
//         ),
//         //  winston.format.simple(),
//       ),
//     }),
//   ],
//   exitOnError: false,
// });

// if (process.env.NODE_ENV === "dev") {
//   logger.add(
//     new winston.transports.File({
//       level: 'info',
//       filename: './logs/all-logs.log',
//       handleExceptions: true,
//       format: winston.format.combine(
//         winston.format.timestamp({
//           format: 'YYYY-MM-DD HH:mm:ss',
//         }),
//         winston.format.errors({ stack: true }),
//         winston.format.printf(
//           (info) => `${info.timestamp} ${info.level}: ${info.message}`,
//         ),
//         // winston.format.splat(),
//         // winston.format.json()
//       ),
//       maxsize: 5242880, //5MB
//       maxFiles: 5,
//     }));
// }
// logger.info("logging started");

// app.use(morgan(function (tokens, req, res) {
//     const msg = [
//         tokens.method(req, res),
//         tokens.url(req, res),
//         tokens.status(req, res),
//         tokens.res(req, res, 'content-length'), '-',
//         tokens['response-time'](req, res), 'ms',
//     ].join(' ');
//     logger.http(msg);
//     return null;
//     // return msg;
// })
// );
