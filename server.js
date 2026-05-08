const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// SUA API KEY GEMINI
const API_KEY = "
AIzaSyC8O0wQ9FBhyKpmASkc0pm2VcCn5WhoRc8";

app.get("/", (req, res) => {
  res.send("ZapBridge IA Online 🚀");
});

app.post("/webhook", async (req, res) => {

  try {

    const mensagem = req.body.mensagem || "Olá";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Responda como um atendimento profissional: ${mensagem}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const resposta =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Erro ao gerar resposta";

    res.json({
      status: "ok",
      resposta
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      erro: "Erro na IA"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando");
});
