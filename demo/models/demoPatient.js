const demoPatient =[

    {
        id: 1,
        name: "Pat",
        username: "ppaatt",
        yearOfBirth: "1959",
        doctor: "Chris",
        role: "patient",
        email: "pat@hmail.com",
        support: "You can do it!",
        prate: 0.8,
        data: {
            bgl: {
                max: 7300000,
                min: 7000000
            }
        }

    },
    {
        id: 2,
        name: "David Li",
        username: "D_Li",
        yearOfBirth: "1960",
        doctor: "Chris",
        role: "patient",
        email: "davidli@hmail.com",
        support: "Trust yourself!",
        prate: 0.99,
        data: {
            bgl: {
                max: 7300000,
                min: 7000000
            },
            doit: {
                max: 3,
                min: 3
            }
        }
    }
]
module.exports =demoPatient