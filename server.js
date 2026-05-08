const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ZapBridge Online 🚀");
});

app.post("/webhook", (req, res) => {

  console.log(req.body);

  res.json({
    status: "ok",
    recebido: req.body
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando");
});
