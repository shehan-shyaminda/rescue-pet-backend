const express = require('express')
const app = express()
const OwnerRouter = require("./routes/owners.routes");
const PetRouter = require("./routes/pets.routes");
const dotenv = require('dotenv')
dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type');
    res.header('Content-Type', 'application/json');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.get('/', function(req, res) {
    res.status(200).send({status: true, message: "Pet Navigation Device: Improving Lost Pet Retrieval Backend"})
})

OwnerRouter.routesConfig(app);
PetRouter.routesConfig(app);
app.listen(process.env.PORT, () => console.log(`App is listening port ${process.env.PORT} and connected to ${process.env.MONGOOSE_CONNECTION}`))