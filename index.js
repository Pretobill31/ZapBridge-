const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();

app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: '/usr/bin/google-chrome', // Caminho padrão do Render
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']
    }
});

client.on('qr', (qr) => {
    console.log('--- ESCANEIE O QR CODE ABAIXO ---');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('ZapBridge ONLINE! ✅');
});

app.post('/enviar', async (req, res) => {
    const { telefone, mensagem } = req.body;
    try {
        const chatId = telefone.includes('@c.us') ? telefone : `${telefone}@c.us`;
        await client.sendMessage(chatId, mensagem);
        res.status(200).send({ status: "Sucesso!" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    client.initialize();
    console.log(`Rodando na porta ${PORT}`);
});
