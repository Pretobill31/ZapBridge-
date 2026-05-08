const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());

// API KEY GROQ
const API_KEY = process.env.GROQ_API_KEY;

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
    console.log(nome);
    console.log(mensagem);

    // CHAMADA GROQ
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "Você é um atendente profissional, amigável e rápido."
            },
            {
              role: "user",
              content: `Cliente ${nome}: ${mensagem}`
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log(JSON.stringify(data, null, 2));

    // RESPOSTA IA
    const resposta =
      data?.choices?.[0]?.message?.content;

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

    console.log("ERRO:");
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
