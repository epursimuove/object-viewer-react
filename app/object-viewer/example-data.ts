import {
    now,
    regExpLocalDate,
    regExpLocalTime,
    regExpTimestamp,
    regExpTimeZone,
    systemTimeZone,
} from "~/util/dateAndTime";
import {
    regExpExpandedIPv6,
    regExpInsecureURL,
    regExpIPv4,
    regExpLocalhostURL,
    regExpPartialCanonicalIPv6,
    regExpSecureURL,
} from "~/util/http";
import {
    regExpAbsolutePath,
    regExpArrayIndexString,
    regExpCountryCode,
    regExpEmailAddress,
    regExpHexColorRGB,
    regExpLocale,
    regExpRegularExpression,
    regExpRelativePath,
    regExpRGBColorRGB,
} from "~/util/util";

// let counter = 1;

// const createLabel = (label: string) => {
//     return `${counter++} - ${label}`;
// }

export const exampleObject: {} = {
    "1 - Documentation": {
        _README: "Basic documentation is found here in the actual object tree.",
        "1.1 - Primitives": {
            "1.1.1 - Strings": {
                _README:
                    "Strings can often be treated as something else than just random characters. So educated guesses are made and some properties therefore get enhanced types.",
                text: "Some text value",
                extraSpaces: "Text containing  extra space characters will be flagged",
                "1.1.1.1 - Enhanced property types from strings": {
                    localDate: "1970-01-01",
                    localTime: "08:22",
                    timestamp: "2000-01-01T00:00Z",
                    timeZone: "America/New_York",
                    countryCode: "SE",
                    locale: "en_GB",
                    email: "john@doe.com",
                    url: "https://foo.com",
                    color: "#ff00ff",
                    color2: "rgb(0, 255, 255)",
                    color3: "white",
                    semanticVersioning: "1.2.3",
                    phone: "+460701234567",
                    ipv4: "127.0.0.1",
                    ipv6: "1234::1",
                    httpMethod: "POST",
                    httpStatus: 200,
                    epochSeconds: 1234567890,
                    epochMilliSeconds: 1234567890987,
                    absolutePath: "/my/directory",
                    relativePath: "./my/directory",
                    regularExpression: "^a+b+c$",
                    "1.1.1.1.1 - Date and time": {
                        _README:
                            "We can differentiate timestamps, local dates, local times and time zones.",
                        timestamps: ["2015-12-24T14:00:00Z", "2030-12-24T14:00:00Z"],
                        localDates: ["2024-12-24", "2038-05-06"],
                        localTimes: ["14:00:00", "21:45:30"],
                        timeZones: ["UTC", systemTimeZone],
                    },
                },
            },
            "1.1.2 - Booleans": {
                true: true,
                false: false,
            },
            "1.1.3 - Numbers": {
                _README:
                    "Numbers are represented by the 'number' type, but we enhance by indicating if it is an integer, a floating point number or an epoch value.",
                "1.1.3.1 - Enhanced property types from numbers": {
                    integer: 42,
                    zero: 0,
                    epoch: 1000000000,
                },

                "1.1.3.2 - Integers": {
                    negative: -123,
                    zero: 0,
                    positive: 456,
                },
                "1.1.3.3 - Floating points": {
                    negative: -123.456,
                    zero: 0.0,
                    positive: 456.789,
                },
                "1.1.3.4 - Epoch values": {
                    epochInSeconds: 1755103899,
                    epochInMilliseconds: 1671897600000,
                },
            },
        },
        "1.2 - Objects": {
            emptyObject: {},
            objectWithProperties: {
                bar: 1,
                baz: 2,
            },
        },
        "1.3 - Arrays": {
            emptyArray: [],
            arrayWithStrings: ["first", "second"],
            arrayWithIntegers: [-1, 0, 1],
            arrayWithIntegers2: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
            arrayWithNumbers: [3.1415927, 2.718, 9.81],
        },
        "1.4 - 'Nada' values": {
            _README:
                "Values that often are the default value and may not contain 'valuable' information, can be indicated (and hidden).",
            nadaEmptyString: "",
            nadaZero: 0,
            nadaZeroAgain: 0.0,
            nadaFalse: false,
            nadaNull: null,
            nadaUndefinedWillBeIgnored: undefined,
        },
        "1.5 - Ignored values": {
            _README:
                "The property types 'undefined', 'function', 'bigint' and 'symbol' will be ignored, since they by default are not valid JSON values.",
            thisIsUndefinedWillBeIgnored: undefined, // undefined is not valid JSON value, will be ignored.
            // thisIsBigInt: 1n, // BigInt not supported out-of-the-box by JSON.
            thisIsSymbol: Symbol("test"), // Symbol is not valid JSON value, will be ignored.
            thisIsFunction: (a: number, b: number) => a + b, // Function is not valid JSON value, will be ignored.
        },
        "1.6 - Sets and Maps": {
            _README:
                "Using a Set or Map object will result in an empty JSON object, since that is the default representation for Sets and Maps in JSON.",
            thisIsASet: new Set(["a", "b", "c", "d", "e"]), // A Set is as default represented as empty object.
            "thisIsAnotherSet<SET>": new Set(["a", "b", "c", "d", "e"]), // A Set is as default represented as empty object.
            thisIsAMap: new Map([
                // A Map is as default represented as empty object.
                [1, "one"],
                [2, "two"],
                [3, "three"],
            ]),
            "thisIsAnotherMap<MAP>": new Map([
                // A Map is as default represented as empty object.
                [1, "one"],
                [2, "two"],
                [3, "three"],
            ]),
        },

        "1.7 - Convenient identifiers": {
            _README:
                "For many objects we can collect information from the properties and display convenient identifiers for those objects.",
            ids: [
                {
                    id: 123456,
                },
                {
                    uuid: "99-22-00-33",
                },
            ],
            names: [
                {
                    name: "Linda",
                },
                {
                    firstName: "Nicolina",
                    lastName: "Johnson",
                },
            ],
            address: [
                {
                    city: "New York",
                    country: "United States",
                },
            ],
            mathAndPhysics: [
                {
                    x: 50,
                    y: 60,
                    z: 70,
                },
                {
                    x: -90,
                    y: 450,
                },
                {
                    depth: 50,
                    width: 60,
                    height: 70,
                },
            ],
        },

        "1.8 - Misc": {},
    },
    "2 - Examples": {
        "2.1 - Person": {
            john: {
                id: 123456789,
                guid: "9988-3344-2233",
                created: "2025-05-01T05:20:00Z",
                firstName: "John",
                lastName: "Doe",
                married: true,
                retired: false,
                parents: {
                    caroline: {
                        UUID: 36284,
                        fullName: " Caroline Johnson",
                        age: 105,
                    },
                    lars: {
                        uuid: 785,
                        fullName: "Lars Östberg ",
                        age: 96,
                    },
                },
                children: {
                    adam: {
                        uuid: 9238,
                        fullName: "Adam Gray",
                        age: 23,
                        characteristics: [
                            {
                                propertyName: "heightInCentimeter",
                                propertyValue: 173,
                            },
                            {
                                propertyName: "eyeColor",
                                propertyValue: "brown",
                            },
                        ],
                    },
                    bridget: {
                        uuid: 5543,
                        fullName: "Bridget Gray",
                        age: 14,
                        characteristics: [
                            {
                                propertyName: "heightInCentimeter",
                                propertyValue: 182,
                            },
                            {
                                propertyName: "eyeColor",
                                propertyValue: "green",
                            },
                        ],
                    },
                    christine: {
                        uuid: 1128,
                        fullName: "Christine Gray",
                        age: 5,
                        characteristics: [
                            {
                                propertyName: "heightInCentimeter",
                                propertyValue: 127,
                            },
                            {
                                propertyName: "eyeColor",
                                propertyValue: "blue",
                            },
                        ],
                    },
                },
                children2: [
                    {
                        name: "Adam",
                        age: 23,
                    },
                    {
                        name: "Bridget",
                        age: 14,
                    },
                    {
                        name: "Christine",
                        age: 5,
                    },
                ],
                phones: ["012-34567", "070-987654321"],
                phones2: { home: "012-34567", mobile: "070-987654321" },
                dateOfBirth: "1983-11-07",
                timestampOfBirth: "1983-11-07T16:40:00Z",
                dateOfGraduation: "2005-06-07",
                address: {
                    registered: "2025-05-24T07:15:00Z",
                    type: "residence",
                    street: "Långgatan 123",
                    postCode: "111 22",
                    city: "Stockholm",
                    country: "Sweden",
                    countryCode: "SE",
                    coordinates: {
                        latitude: 98765,
                        longitude: 4567,
                    },
                },
                preferredLocale: "en_SE",
                secondaryLocale: "sv_SE",
                emailPrimary: "john.doe@example.com",
                emailSecondary: "john@doe.se",
                emailWork: "john.s.doe@the.special.company.org",
                currentLocalTime: "21:05:20",
            },
        },
        "2.2 - Math": {
            vector3D: {
                x: 9.3,
                y: 102.34,
                z: 0.29,
            },
            vector2D: {
                x: 0,
                y: 4711,
            },
            dimension: {
                depth: 80,
                width: 300,
                height: 150,
            },
            numbers: [-12345, -1234, -123, -12, -1, 0, 1, 12, 123, 1234, 12345],
        },
        "2.3 - Texts": {
            longerText:
                "An example of what will happen if the text in a string property is a bit longer than the normal small examples. Hopefully it will wrap nicely depending on the width of the browser window. The text will be at least minimum width wide and not wider than maximum width. Perhaps the text should be truncated in some way, if it is really long? Though, I like the current solution.",
            textWithNewlines:
                "You can also\nuse newlines\nin your texts that will be formatted\na little bit different.",
            suspiciousString: " A lot  of extra spaces ",
        },
        "2.4 - Nested arrays and objects": {
            deeplyNestedObject: {
                firstLevel: {
                    secondLevel: {
                        thirdLevel: {
                            fourthLevel: {
                                fifthLevel: {
                                    sixthLevel: {
                                        seventhLevel: {
                                            eighthLevel: {
                                                ninthLevel: {
                                                    tenthLevel: {
                                                        eleventhLevel: {
                                                            theAnswerToEverything: 42,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            deeplyNestedArray: [[[[[[[[4711]]]]]]]],
            arraysWithinArrays: [
                [
                    456,
                    789,
                    "abc",
                    "xyz",
                    [],
                    [
                        "List of countries",
                        [
                            "SE",
                            "DK",
                            "FI",
                            "NO",
                            "IS",
                            "GB",
                            "BR",
                            "US",
                            "JP",
                            "AU",
                            "NZ",
                            "ES",
                            "AR",
                            "FR",
                            "DE",
                            "CH",
                            "NL",
                            "BE",
                        ],
                        { city: "Malmö", temperatureCelsius: -23 },
                        "Some text containing extra  spaces",
                    ],
                ],
                [{ hours: 23, minutes: 34, seconds: 27 }],
            ],
        },
        "2.5 - Date and time": {
            dateAndTime: {
                timestamps: [
                    "1970-01-01T00:00:00Z",
                    "2025-12-24T14:00:00Z",
                    "2025-12-24T14:00:00.123Z",
                    "2000-01-01T00:00:00Z",
                    "2069-08-10T12:00:00Z",
                    now.subtract({ minutes: 45 }),
                    now.add({ minutes: 45 }),
                    now.subtract({ hours: 15 }),
                    now.add({ hours: 15 }),
                    now.toZonedDateTimeISO("UTC").startOfDay().toInstant(),
                    now
                        .toZonedDateTimeISO("UTC")
                        .with({ hour: 23, minute: 59, second: 59 })
                        .toInstant(),
                    now
                        .toZonedDateTimeISO("UTC")
                        .with({ month: 1, day: 1 })
                        .startOfDay()
                        .toInstant(),
                    now
                        .toZonedDateTimeISO("UTC")
                        .with({ month: 12, day: 31, hour: 23, minute: 59, second: 59 })
                        .toInstant(),
                ],
                localDates: [
                    "1969-07-20",
                    now.toString().slice(0, 10),
                    now.add({ hours: 24 }).toString().slice(0, 10),
                    now
                        .add({ hours: 24 * 20 })
                        .toString()
                        .slice(0, 10),
                ],
                localTimes: ["08:25:30", "21:40:00", "14:05"],
                timeZones: [
                    "UTC",
                    "Etc/UTC",
                    "Europe/London",
                    "Europe/Stockholm",
                    "Asia/Tokyo",
                    "Pacific/Kiritimati",
                    "Australia/Adelaide",
                    "Australia/Lord_Howe",
                    "Asia/Kolkata",
                    "Asia/Kathmandu",
                    "America/Los_Angeles",
                    "America/Anchorage",
                    "America/Santiago",
                    "Africa/Tunis",
                    "Africa/Nairobi",
                    "Africa/Unknown",
                ],
                epochValues: [
                    now.epochMilliseconds,
                    now.epochMilliseconds / 1000,
                    Math.floor(now.epochMilliseconds / 1000),
                    1000000000,
                    3000000000,
                ],
            },
        },
        "2.6 - Misc": {
            flights: [
                {
                    from: {
                        airport: "ABC",
                        departureTime: "2035-12-10T20:45Z",
                    },
                    to: {
                        airport: "XYZ",
                        arrivalTime: "2035-12-11T07:22Z",
                    },
                },
                {
                    from: {
                        airport: "XYZ",
                        departureTime: "2036-01-07T08:10Z",
                    },
                    to: {
                        airport: "ABC",
                        arrivalTime: "2036-01-07T23:57Z",
                    },
                },
            ],
            urls: [
                "https://www.foobar.com",
                "http://www.foobar.com",
                "localhost:1234",
                "localhost:1234/project",
                "https://foobar.com/more/and/more",
                "https://theexamplecompany.com/containing/long/url/structure/that/is/deeply/nested",
            ],
            locales: [
                "en_US",
                "en_GB",
                "en_IN",
                "en-AU",
                "ja-JP",
                "fi-FI",
                "en_IE",
                "it_IT",
                "fr_FR",
            ],
            colors: [
                "#ff0000",
                "#00ff00",
                "#0000FF",
                "#00FFFF",
                "#FFFF00",
                "#FFFFFF",
                "#000000",
                "#2468ac",
                "#ca8642",
                "rgb(0, 255, 255)",
                "rgb(255, 0, 255)",
                "rgb(255, 255, 0)",
                "rgb(50, 150, 250)",
                "rgb(250, 150, 50)",
                "red",
                "green",
                "blue",
            ],
            semanticVersioning: ["9.8.7", "15.16.17", "0.101.9999"],
            ipNumbers: [
                "192.0.5.234",
                "127.0.0.1",
                "ABCD:EF01::",
                "::",
                "::1",
                "1234:5678:90ab:cdef:1234:5678:90ab:cdef",
                "1:2:3:4:5:6:7:8",
                "1:2::8",
            ],
            theUser: {
                username: "angus",
            },
            phoneNumbers: ["+46701112223", "+460709876543"],
            numbers: [0, 0, 0, 0],
            booleans: [false, false, true],
            httpMethods: [
                "CONNECT",
                "DELETE",
                "GET",
                "HEAD",
                "OPTIONS",
                "PATCH",
                "POST",
                "PUT",
                "TRACE",
            ],
            httpStatusCodes: [100, 200, 201, 301, 400, 401, 404, 500],
            absolutePaths: ["/foo", "/foo/", "/foo/bar", "/"],
            relativePaths: [
                "./foo",
                "../foo",
                "./foo/",
                "../foo/",
                "./foo/bar",
                "../foo/bar",
                "./",
                "../",
                "../../../foo/bar",
            ],
            regularExpressions: [
                "^\\d$",
                "/^\\d$/",
                "/\\d/",
                "^\\d+$",
                "^[A-Z0-9]$",
                "^([A-Z0-9]+)?_42$",
                "^\\w+\\s$",
                "^d(b+)d$",
                "^a\\*b$",
                "^abc$",
                "/^abc$/",
                "/abc/", // Will be treated as an AbsolutePath.
                {
                    dateAndTime: {
                        timestamp: regExpTimestamp.toString(),
                        localDate: regExpLocalDate.toString(),
                        localTime: regExpLocalTime.toString(),
                        timeZone: regExpTimeZone.toString(),
                    },
                    web: {
                        IPv4: regExpIPv4.toString(),
                        expandedIPv6: regExpExpandedIPv6.toString(),
                        partialCanonicalIPv6: regExpPartialCanonicalIPv6.toString(),
                        https: regExpSecureURL.toString(),
                        http: regExpInsecureURL.toString(),
                        localhost: regExpLocalhostURL.toString(),
                    },
                    misc: {
                        countryCode: regExpCountryCode.toString(),
                        locale: regExpLocale.toString(),
                        emailAddress: regExpEmailAddress.toString(),
                        arrayIndex: regExpArrayIndexString.toString(),
                        colorHex: regExpHexColorRGB.toString(),
                        colorRGB: regExpRGBColorRGB.toString(),
                        absolutePath: regExpAbsolutePath.toString(),
                        relativePath: regExpRelativePath.toString(),
                        regularExpression: regExpRegularExpression.toString(),
                    },
                },
            ],
        },
        "2.7 - Gotchas": {
            evilPropertiesObject: {
                "[0]": true,
                "[1]": false,
                a: true,
                z: true,
                A: false,
                Z: false,
                0: false,
                1: false,
                UUID: true,
                Uuid: true,
                uuid: false,
                "first name": "David",
                "last name": "Jones",
            },
            evilPropertiesObject2: {
                name: {
                    first: "Lisa",
                    last: "Doe",
                },
            },
            evilPropertiesObject3: {
                false: true,
                true: false,
            },
            evilPropertiesObject4: {
                foo: "bar",
                " foo": "bar",
                "foo ": "bar",
            },
        },
    },
    // largeNumbers: [ // BigInt not supported out-of-the-box by JSON.
    //     1n,
    //     -1n,
    //     12345678901234567890n,
    // ],
    "3 - Copyright": {
        firstName: "Anders",
        lastName: "Gustafson",
        url: "https://anders.nemonisimors.com",
    },
};

export const exampleArray = [exampleObject, exampleObject];
