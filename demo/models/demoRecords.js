const demoRecords =[

    {
        id: 1,
        patientId: 1,
        CreatedDate: "2022-3-17",
        data: {
            bgl: {
                name: "Blood Glucose Level (nmol/L)",
                status: "recorded",
                recordedAt: new Date().toString(),
                value: 5,
                comment: "Good",
                createdDate: null,
            },
            doit: {
                name: "Doses of Insulin Taken (units)",
                status: "Not Required",
                value: 0,
                comment: " ",
                createdDate: null,
            },
            exercise: {
                name: "Exercise (steps)",
                status: "Not Required",
                value: 0,
                comment: " ",
                createdDate: null,
            },
            weight: {
                name: "Weight (kg)",
                status: "Not Required",
                value: 0,
                comment: " ",
                createdDate: null,
            }
        }

    },
    {
        id: 2,
        patientId: 1,
        CreatedDate: "2022-3-18",
        data: {
            bgl: {
                name: "Blood Glucose Level (nmol/L)",
                status: "recorded",
                recordedAt: new Date().toString(),
                value: 4,
                comment: "Good",
                createdDate: null,
            },
            doit: {
                name: "Doses of Insulin Taken (units)",
                status: "recorded",
                recordedAt: new Date().toString(),
                value: 2,
                comment: "Good",
                createdDate: null,
            },
            exercise: {
                name: "Exercise (steps)",
                status: "Not Required",
                value: 0,
                comment: " ",
                createdDate: null,
            },
            weight: {
                name: "Weight (kg)",
                status: "Not Required",
                value: 0,
                comment:" ",
                createdDate: null,
            }
        }

    },
    {
        id: 3,
        patientId: 2,
        CreatedDate: "2022-3-17",
        data: {
            bgl: {
                name: "Blood Glucose Level (nmol/L)",
                status: "recorded",
                recordedAt: new Date().toString(),
                value: 6,
                comment: "Great!",
                createdDate: null,
            },
            doit: {
                name: "Doses of Insulin Taken (units)",
                status: "unrecorded",
                recordedAt: "",
                value: 0,
                comment: null,
                createdDate: null,
            },
            exercise: {
                name: "Exercise (steps)",
                status: "unrecorded",
                recordedAt: "",
                value: 0,
                comment: null,
                createdDate: null,
            },
            weight: {
                name: "Weight (kg)",
                status: "No need",
                recordedAt: "",
                value: 0,
                comment: null,
                createdDate: null,
            }
        }
    }
]
module.exports =demoRecords