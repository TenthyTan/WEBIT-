if(process.env.NODE_ENV !=='production') {
    require('dotenv').config()
}
const mongoose = require("mongoose");
//url = "mongodb+srv://sugar-free:sugar-free@cluster0.oibut.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(process.env.MONGO_URL , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'demo'
})

const db = mongoose.connection.on('error', err => {
    console.error(err);
    process.exit(1)
});

db.once('open',async()=>{
    console.log(`Mongo connection start on ${db.host}: ${db.port}`)
});

// const btn = document.getElementById('btn');

// btn.addEventListener('click', function onClick(event) {
//     // 👇️ change background color
//     document.body.style.backgroundColor = 'salmon';
//     // 👇️ optionally change text color
//     // document.body.style.color = 'white';
// });

