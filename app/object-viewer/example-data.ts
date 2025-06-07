import {now} from "../util";

export const exampleObject: {} = {
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
    children2: [{
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
    phones2: {home: "012-34567", mobile: "070-987654321"},
    dateOfBirth: "1983-11-07",
    timestampOfBirth: "1983-11-07T16:40:00Z",
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
    vector3D: {
        x: 9.3,
        y: 102.34,
        z: 0.29,
    },
    vector2D: {
        x: 0,
        y: 4711,
    },
    emptyObject: {},
    emptyArray: [],
    thisIsNull: null,
    thisIsUndefinedWillBeIgnored: undefined,
    nadaEmptyString: "",
    nadaZero: 0,
    nadaZeroAgain: 0.0,
    nadaFalse: false,
    nadaNull: null,
    nadaUndefinedWillBeIgnored: undefined,
    thisIsASet: new Set(["a", "b", "c", "d", "e"]), // A Set is as default represented as empty object.
    "thisIsAnotherSet<SET>": new Set(["a", "b", "c", "d", "e"]), // A Set is as default represented as empty object.
    thisIsAMap: new Map([ // A Map is as default represented as empty object.
        [1, "one"],
        [2, "two"],
        [3, "three"],
    ]),
    "thisIsAnotherMap<MAP>": new Map([ // A Map is as default represented as empty object.
        [1, "one"],
        [2, "two"],
        [3, "three"],
    ]),
    arraysWithinArrays: [
        [456, 789, "abc", "xyz", [], ["List of countries", ["SE", "DK", "FI", "NO", "IS", "GB", "BR", "US", "JP", "AU", "NZ", "ES", "AR", "FR", "DE", "CH", "NL", "BE"], {city: "Malmö", temperatureCelsius: -23}, "Some text containing extra  spaces"]],
        [{hours: 23, minutes: 34, seconds: 27}],
    ],
    evilPropertiesObject: {
        "[0]": true,
        "[1]": false,
        "a": true,
        "z": true,
        "A": false,
        "Z": false,
        0: false,
        1: false,
        UUID: true,
        Uuid: true,
        uuid: false,
    },
    evilPropertiesObject2: {
        name: {
            first: "Lisa",
            last: "Doe",
        },
    },
    dateAndTime: {
        timestamps: [
            "1970-01-01T00:00:00Z",
            "2025-12-24T14:00:00Z",
            "2000-01-01T00:00:00Z",
            "2069-08-10T12:00:00Z",
            now.subtract({ minutes: 45 }),
            now.add({ minutes: 45 }),
            now.subtract({ hours: 15 }),
            now.add({ hours: 15 }),
            now.toZonedDateTimeISO("UTC").startOfDay().toInstant(),
            now.toZonedDateTimeISO("UTC").with({ hour: 23, minute: 59, second: 59 }).toInstant(),
            now.toZonedDateTimeISO("UTC").with({ month: 1, day: 1 }).startOfDay().toInstant(),
            now.toZonedDateTimeISO("UTC").with({ month: 12, day: 31, hour: 23, minute: 59, second: 59 }).toInstant(),
        ],
        localDates: [
            "1969-07-20",
            now.toString().slice(0, 10),
            now.add({hours: 24}).toString().slice(0, 10),
            now.add({hours: 24 * 20}).toString().slice(0, 10),
        ],
    },
    longerText: "An example of what will happen if the text in a string property is a bit longer than the normal small examples. Hopefully it will wrap nicely depending on the width of the browser window. The text will be at least minimum width wide and not wider than maximum width. Perhaps the text should be truncated in some way, if it is really long? Though, I like the current solution.",
    preferredLocale: "en_SE",
    secondaryLocale: "sv_SE",
    emailPrimary: "john.doe@example.com",
    emailSecondary: "john@doe.se",
    emailWork: "john.s.doe@the.special.company.org",
    currentLocalTime: "21:05:20",
    dimension: {
        depth: 80,
        width: 300,
        height: 150,
    },
    suspiciousString: " A lot  of extra spaces ",
    // largeNumbers: [ // BigInt not supported out-of-the-box by JSON.
    //     1n,
    //     -1n,
    //     12345678901234567890n,
    // ],
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
    dateOfGraduation: "2005-06-07",
    deeplyNested: {
        firstLevel: {
            secondLevel: {
                thirdLevel: {
                    fourthLevel: {
                        fifthLevel: {
                            sixthLevel: {
                                seventhLevel: {
                                    theHiddenValue: 98765,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    urls: [
        "https://www.foobar.com",
        "http://www.foobar.com",
        "localhost:1234",
        "localhost:1234/project",
        "https://foobar.com/more/and/more",
    ],
};

export const exampleArray = [exampleObject, exampleObject];