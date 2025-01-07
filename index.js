import { app, server } from "./app.js";
import { connectDb } from "./db/db.js";
import authRouter from "./routes/authRoutes.js"
import chatRouter from "./routes/chatRoutes.js"




app.get("/", (req, res) => {
    res.send("Hello, World!");
})

app.use("/api/auth", authRouter)
app.use("/api/chat", chatRouter)
connectDb().then(() => {
    server.listen(5000, () => {
        console.log("Server is running on port 5000");
    })
})
