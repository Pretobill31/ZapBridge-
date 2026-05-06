const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();

app.use(express.json());

// Configuração do cliente WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Exibe o QR Code no Log do Render
client.on('qr', (qr) => {
    console.log('--- ZAPBRIDGE: ESCANEIE O QR CODE ABAIXO ---');
    qrcode.generate(qr, { small: true });
});

// Aviso de conexão
client.on('ready', () => {
    console.log('ZapBridge está ONLINE e conectado! ✅');
});

// Rota POST para receber dados do Requex.me
// O link final será: https://seu-app.onrender.com/enviar
app.post('/enviar', async (req, res) => {
    const { telefone, mensagem } = req.body;

    if (!telefone || !mensagem) {
        return res.status(400).send({ error: "Faltam dados (telefone ou mensagem)" });
    }

    try {
        // Formata o número para o padrão do WhatsApp
        const chatId = telefone.includes('@c.us') ? telefone : `${telefone}@c.us`;
        await client.sendMessage(chatId, mensagem);
        
        console.log(`Mensagem enviada para ${telefone}`);
        res.status(200).send({ status: "Sucesso!", enviada: true });
    } catch (error) {
        console.error("Erro ao enviar:", error);
        res.status(500).send({ error: "Falha no envio", detalhe: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    client.initialize();
    console.log(`Servidor ZapBridge rodando na porta ${PORT}`);
});
