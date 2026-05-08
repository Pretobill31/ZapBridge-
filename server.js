const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "AIzaSyDoZ40ZY1EVXq5k_Lj4fbIHUuc8hT93h_E";

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

    // REQUISIÇÃO GEMINI
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
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
                  text: `Responda como um atendente profissional para ${nome}: ${mensagem}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log(JSON.stringify(data, null, 2));

    // RESPOSTA IA
    const resposta =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // SE DER ERRO
    if (!resposta) {

      return res.status(500).json({
        status: "erro",
        detalhes: data
      });

    }

    // SUCESSO
    res.json({
      status: "ok",
      resposta
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      status: "erro",
      mensagem: "Erro interno no servidor"
    });

  }

});

// START SERVIDOR
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
