import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Server is running");
});

// ⚠️ Important change
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});