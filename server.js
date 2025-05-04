const express = require("express")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const {connectDb} = require("./src/config/database")
const authRouter = require("./src/routers/auth")
const customerRouter = require("./src/routers/customer")
const loanRouter = require("./src/routers/loans") 
const repaymentRouter = require("./src/routers/repayment")
const summaryRouter = require("./src/routers/summary")
const receiptRouter = require("./src/routers/reciept")
const PORT = 3000 

const app = express()

app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.json())


app.use("/", authRouter)
app.use("/",customerRouter)
app.use("/",loanRouter)
app.use("/",repaymentRouter)
app.use("/",summaryRouter)
app.use("/", receiptRouter)



connectDb().then(() => {
    console.log("database connected succesfully!!")
    app.listen(PORT, () => {
        console.log("server is running on the http://localhost:3000")
    })
}).catch((err) => {
    console.log("Failed to connect database", err)
})



