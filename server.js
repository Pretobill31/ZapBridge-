const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());

// API KEY GROQ
const API_KEY = process.env.GROQ_API_KEY;

// HISTÓRICO
const historico = [];

// ROTA PRINCIPAL
app.get("/", (req, res) => {
  res.send("ZapBridge IA Online 🚀");
});

// WEBHOOK IA
app.post("/webhook", async (req, res) => {

  try {

    const nome = req.body.nome || "Cliente";
    const mensagem = req.body.mensagem || "Olá";

    console.log("Mensagem recebida:");
    console.log(nome);
    console.log(mensagem);

    // HISTÓRICO CONTEXTO
    const contexto = historico
      .slice(-5)
      .map(item =>
        `Usuário: ${item.mensagem}\nIA: ${item.resposta}`
      )
      .join("\n");

    // CHAMADA IA
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
              content: `
Você é a IA oficial do ZapBridge.

Regras:
- Responda de forma humana e natural
- Não repita sempre a mesma saudação
- Seja inteligente
- Responda exatamente o que o usuário perguntou
- Seja útil e moderna
- Respostas curtas e profissionais
- Fale português do Brasil

Contexto anterior:
${contexto}
              `
            },
            {
              role: "user",
              content: `
Usuário: ${nome}

Mensagem:
${mensagem}
              `
            }
          ],
          temperature: 0.9,
          max_tokens: 500
        })
      }
    );

    const data = await response.json();

    console.log(JSON.stringify(data, null, 2));

    // RESPOSTA IA
    const resposta =
      data?.choices?.[0]?.message?.content;

    // ERRO IA
    if (!resposta) {

      return res.status(500).json({
        status: "erro",
        detalhes: data
      });

    }

    // SALVAR HISTÓRICO
    historico.push({
      nome,
      mensagem,
      resposta,
      data: new Date()
    });

    // SUCESSO
    res.json({
      status: "ok",
      resposta
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      status: "erro",
      mensagem: "Erro interno servidor"
    });

  }

});

// HISTÓRICO
app.get("/historico", (req, res) => {

  res.json({
    total: historico.length,
    conversas: historico
  });

});

// START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando porta ${PORT}`);
});
