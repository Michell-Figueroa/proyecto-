const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    console.log('Received Mercado Pago webhook notification:');
    console.log(JSON.stringify(req.body, null, 2));

    // TODO: Implement logic to handle the notification, e.g., update order status in the database.

    res.status(200).send('Webhook received');
});

app.listen(port, () => {
    console.log(`Webhook server listening at http://localhost:${port}`);
});