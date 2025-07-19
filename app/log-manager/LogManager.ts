enum LogLevel {
    OFF,
    ERROR,
    WARNING,
    INFO,
    DEBUG,
    TRACE,
}

type LogSignature = (message?: any, ...optionalParams: any[]) => void;

const NO_OP: LogSignature = () => {};

interface Logger {
    error: LogSignature;
    warning: LogSignature;
    info: LogSignature;
    debug: LogSignature;
    trace: LogSignature;
}

interface LogConfiguration {
    level: LogLevel;
}

const globalLogLevel: LogLevel | undefined = LogLevel.TRACE; // TODO

const loggerNames = [
    "LogManager",
    "HistoryContext.tsx",
    "object-viewer.tsx",
    "tool-bar.tsx",
    "util.ts",
] as const;
type LoggerName = (typeof loggerNames)[number];

class LogManager {
    static configuration: Record<LoggerName, LogConfiguration> = {
        LogManager: { level: LogLevel.INFO },
        "HistoryContext.tsx": { level: LogLevel.OFF },
        "object-viewer.tsx": { level: LogLevel.OFF },
        "tool-bar.tsx": { level: LogLevel.OFF },
        "util.ts": { level: LogLevel.OFF },
    };

    static numberOfActiveLoggers: number = loggerNames.filter(
        (loggerName: LoggerName) =>
            LogManager.configuration[loggerName].level !== LogLevel.OFF &&
            loggerName !== "LogManager"
    ).length;

    static someActive: boolean = this.numberOfActiveLoggers > 0;
}

const getStyleWhiteText = (backgroundColor: string): string => {
    return `background-color: ${backgroundColor}; color: white; border-radius: 10%; padding: 3px; font-weight: bold;`;
};

const getStyleBlackText = (backgroundColor: string): string => {
    return `background-color: ${backgroundColor}; color: black; border-radius: 10%; padding: 3px; font-weight: bold;`;
};

const buildLogPrefix = (backgroundColor: string, logger: string, context?: string): string[] => {
    const loggerLabel: string = logger.padEnd(20);

    if (context) {
        const contextLabel: string = context?.padEnd(20);
        return [
            `%c${loggerLabel}%c %c${contextLabel}`,
            getStyleWhiteText(`${backgroundColor}`),
            ``,
            getStyleBlackText("lightgray"),
        ];
    } else {
        return [`%c${loggerLabel}`, getStyleWhiteText(`${backgroundColor}`)];
    }
};

export function useLog(logger: LoggerName, context?: string): Logger {
    const matchingLogger: LogConfiguration | undefined = LogManager.configuration[logger];

    if (!matchingLogger) {
        throw new Error("Misconfiguration");
    }

    const loggerLabel: string = logger.padEnd(20);
    const contextLabel: string | undefined = context?.padEnd(20);

    const createLogger = (logLevel: LogLevel, backgroundColor: string): LogSignature => {
        if (matchingLogger.level >= logLevel) {
            const logPrefixLabel: string[] = buildLogPrefix(
                backgroundColor,
                loggerLabel,
                contextLabel
            );

            const log: LogSignature = console.info.bind(
                // TODO Can also use console.???, but then you get another look in browser console.
                console,
                ...logPrefixLabel
            );

            return log;
        }

        return NO_OP;
    };

    return {
        error: createLogger(LogLevel.ERROR, "red"),

        warning: createLogger(LogLevel.WARNING, "orange"),

        info: createLogger(LogLevel.INFO, "blue"),

        debug: createLogger(LogLevel.DEBUG, "green"),

        trace: createLogger(LogLevel.TRACE, "brown"),
    };
}

export const logInfoPretty = (message: string, start?: boolean) => {
    if (!LogManager.someActive) {
        return;
    }

    if (start !== undefined && start) {
        console.info("");
    }
    console.info(
        `%c===== ${message} ======`,
        "background-color: black; color: white; padding: 2px; border-radius: 10%;"
    );
    if (start !== undefined && !start) {
        console.info("");
    }
};

const { debug, error, info, trace, warning } = useLog("LogManager");

if (LogManager.someActive) {
    info(`Created - There are ${LogManager.numberOfActiveLoggers} activated loggers`);

    console.table(LogManager.configuration);
    info(`Enjoy the LogManager`);
} else {
    warning(`Created - Everything inactivated`);
}
