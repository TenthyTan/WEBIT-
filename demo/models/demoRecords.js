const demoRecords =[

    {
        id: 1,
        patientId: 1,
        CreatedDate: "2022-3-17",
        data: {
            bgl: {
                category: "Blood Glucose Level (nmol/L)",
                status: "recorded",
                recordedAt: new Date().toString(),
                value: 7200000,
                comment: "Good"
            },
            doit: {
                category: "Doses of Insulin Taken (doses)",
                status: "No need",
                recordedAt: "",
                value: null,
                comment: null
            },
            exercise: {
                category: "Exercise (steps)",
                status: "No need",
                recordedAt: "",
                value: null,
                comment: null
            },
            weight: {
                category: "Weight (kg)",
                status: "No need",
                recordedAt: "",
                value: null,
                comment: null
            }
        }

    },
    {
        id: 2,
        patientId: 1,
        CreatedDate: "2022-3-18",
        data: {
            bgl: {
                category: "Blood Glucose Level (nmol/L)",
                status: "recorded",
                recordedAt: new Date().toString(),
                value: 7200500,
                comment: "Good"
            },
            doit: {
                category: "Doses of Insulin Taken (doses)",
                status: "recorded",
                recordedAt: new Date().toString(),
                value: 2,
                comment: "Good"
            },
            exercise: {
                category: "Exercise (steps)",
                status: "No need",
                recordedAt: "",
                value: null,
                comment: null
            },
            weight: {
                category: "Weight (kg)",
                status: "No need",
                recordedAt: "",
                value: null,
                comment: null
            }
        }

    },
    {
        id: 3,
        patientId: 2,
        CreatedDate: "2022-3-17",
        data: {
            bgl: {
                category: "Blood Glucose Level (nmol/L)",
                status: "recorded",
                recordedAt: new Date().toString(),
                value: 7150000,
                comment: "Great!"
            },
            doit: {
                category: "Doses of Insulin Taken (doses)",
                status: "unrecorded",
                recordedAt: "",
                value: null,
                comment: null
            },
            exercise: {
                category: "Exercise (steps)",
                status: "unrecorded",
                recordedAt: "",
                value: null,
                comment: null
            },
            weight: {
                category: "Weight (kg)",
                status: "No need",
                recordedAt: "",
                value: null,
                comment: null
            }
        }
    }
]
module.exports =demoRecords