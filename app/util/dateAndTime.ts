import { Temporal } from "@js-temporal/polyfill";
import { useLog } from "~/log-manager/LogManager";

const { trace } = useLog("dateAndTime.ts");

const getNow = (): Temporal.Instant => Temporal.Now.instant();

export const now: Temporal.Instant = getNow();

const buildTime: Temporal.Instant = Temporal.Instant.from(__BUILD_TIME__);

export const prettifiedBuildTime: string = buildTime.toString().slice(0, 16) + "Z";

export const systemTimeZone: string = Temporal.Now.timeZoneId();

export const regExpTimestamp: RegExp = /^(\d\d\d\d-\d\d-\d\d)T(\d\d:\d\d(:\d\d(\.\d+)?)?)Z$/;

export const regExpLocalDate: RegExp = /^\d\d\d\d-\d\d-\d\d$/;

export const regExpLocalTime: RegExp = /^\d\d:\d\d(:\d\d)?$/;

export const regExpTimeZone: RegExp =
    /^((Etc\/)?UTC)|((Africa|America|Antarctica|Atlantic|Asia|Australia|Europe|Indian|Pacific)\/[A-Z][A-Za-z_-]+)$/;

export const isTimestamp = (s: string): boolean => {
    const isTimestamp: boolean = regExpTimestamp.test(s);
    return isTimestamp;
};

export const isLocalDate = (s: string): boolean => {
    const isLocalDate: boolean = regExpLocalDate.test(s);
    return isLocalDate;
};

export const isLocalTime = (s: string): boolean => {
    const isLocalTime: boolean = regExpLocalTime.test(s);
    return isLocalTime;
};

export const isTimeZone = (s: string): boolean => {
    const isTimeZone: boolean = regExpTimeZone.test(s);
    return isTimeZone;
};

export const isEpoch = (n: number): boolean =>
    (1000000000 <= n && n <= 3000000000) || (1000000000000 <= n && n <= 3000000000000);

export const padTimestampToMilliseconds = (timestamp: Temporal.Instant): string =>
    timestamp.toString().padEnd(24);

export const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const prettifiedDuration = (duration: Temporal.Duration): string => {
    let durationPart: string = "??????";
    let inThePast: boolean = true;

    if (duration.years !== 0) {
        durationPart = `${Math.abs(duration.years)} years`;
        inThePast = duration.years > 0;
    } else if (duration.months !== 0) {
        durationPart = `${Math.abs(duration.months)} months`;
        inThePast = duration.months > 0;
    } else if (duration.days !== 0) {
        durationPart = `${Math.abs(duration.days)} days`;
        inThePast = duration.days > 0;
    } else if (duration.hours !== 0) {
        durationPart = `${Math.abs(duration.hours)} hours`;
        inThePast = duration.hours > 0;
    } else if (duration.minutes !== 0) {
        durationPart = `${Math.abs(duration.minutes)} minutes`;
        inThePast = duration.minutes > 0;
    } else if (duration.seconds !== 0) {
        durationPart = `${Math.abs(duration.seconds)} seconds`;
        inThePast = duration.seconds > 0;
    } else {
        return "Just now";
    }

    return inThePast ? `More than ${durationPart} ago` : `In about ${durationPart}`;
};

function getRoundedDuration(duration: Temporal.Duration): Temporal.Duration {
    const roundedDuration: Temporal.Duration = duration.round({
        largestUnit: "years",
        // roundingMode: "ceil",
        // Use the ISO calendar; you can convert to another calendar using
        // withCalendar()
        relativeTo: now.toZonedDateTimeISO("UTC"),
    });

    return roundedDuration;
}

export function durationRelativeToNowForTimestamp(timestampString: string): string {
    const timestamp: Temporal.Instant = Temporal.Instant.from(timestampString);

    const duration: Temporal.Duration = now.since(timestamp);

    return `${prettifiedDuration(getRoundedDuration(duration))}`;
}

export function durationRelativeToNowForLocalDate(localDateString: string): string {
    const localDate: Temporal.PlainDate = Temporal.PlainDate.from(localDateString);

    const duration: Temporal.Duration = now
        .toZonedDateTimeISO("UTC")
        .since(localDate.toZonedDateTime("UTC"));

    return `${prettifiedDuration(getRoundedDuration(duration))}`;
}

export function durationRelativeToNowForEpoch(epochValue: number): string {
    const epochMilliSeconds = epochValue >= 1000000000000 ? epochValue : epochValue * 1000;

    const timestamp: Temporal.Instant = Temporal.Instant.fromEpochMilliseconds(epochMilliSeconds);

    const duration: Temporal.Duration = now.since(timestamp);

    trace(`TIMESTAMP ${timestamp} and NOW ${now} => ${duration}`);
    return `${padTimestampToMilliseconds(timestamp)} - ${prettifiedDuration(getRoundedDuration(duration))}`;
}

export function assembleTimeZoneInformation(timeZoneString: string): string {
    try {
        const zonedDateTime: Temporal.ZonedDateTime = now.toZonedDateTimeISO(timeZoneString);
        const localDateTime: Temporal.PlainDateTime = zonedDateTime.toPlainDateTime();

        const { dayOfWeek, day, month } = localDateTime;
        const localTimeString: string = localDateTime.toPlainTime().toString().slice(0, 5);

        return `${weekDays[dayOfWeek - 1]} ${day} ${
            monthNames[month - 1]
        } ${localTimeString} [${zonedDateTime.offset}]`;
    } catch (error) {
        if (error instanceof RangeError) {
            return `RangeError: ${error.message}`;
        } else if (error instanceof Error) {
            return `Error: ${error.message}`;
        } else {
            return `Unknown Error: ${error}`;
        }
    }
}
