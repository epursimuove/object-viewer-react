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
        },
        bridget: {
            uuid: 5543,
            fullName: "Bridget Gray",
            age: 14,
        },
        christine: {
            uuid: 1128,
            fullName: "Christine Gray",
            age: 5,
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
        permanent: true,
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
    timestamps: [
        "1970-01-01T00:00:00Z",
        "2025-12-24T14:00:00Z",
        "2000-01-01T00:00:00Z",
        "2069-08-10T12:00:00Z",
        now.subtract({minutes: 45}),
        now.add({minutes: 45}),
        now.subtract({hours: 15}),
        now.add({hours: 15}),
    ],
    longerText: "An example of what will happen if the text in a string property is a bit longer than the normal small examples. Hopefully it will wrap nicely depending on the width of the browser window. The text will be at least minimum width wide and not wider than maximum width. Perhaps the text should be truncated in some way, if it is really long? Though, I like the current solution.",
    currentLocalTime: "21:05:20",
};

export const exampleArray = [exampleObject, exampleObject];