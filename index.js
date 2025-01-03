import { app, server } from "./app.js";
import { connectDb } from "./db/db.js";
import authRouter from "./routes/authRoutes.js"
import chatRouter from "./routes/chatRoutes.js"




app.get("/", (req, res) => {
    res.send("Hello, World!");
})

app.use("/auth", authRouter)
app.use("/chat", chatRouter)
connectDb().then(() => {
    server.listen(3000, () => {
        console.log("Server is running on port 3000");
    })
})
