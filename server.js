const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());

// SUA API KEY GEMINI
const API_KEY = "AIzaSyB21sXHAu4sCqd4cpm-S3LTMbZN9kZGxf8";

// ROTA PRINCIPAL
app.get("/", (req, res) => {
  res.send("ZapBridge IA Online 🚀");
});

// WEBHOOK
app.post("/webhook", async (req, res) => {

  try {

    const nome = req.body.nome || "Cliente";
    const mensagem = req.body.mensagem || "Olá";

    console.log("Mensagem recebida:");
    console.log(nome, mensagem);

    // CHAMANDO GEMINI
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
                  text: `Responda como um atendimento profissional para o cliente ${nome}: ${mensagem}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log(data);

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

// INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
