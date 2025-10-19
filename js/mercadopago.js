// DANGER: Do not expose your Mercado Pago access token in client-side code.
// This is a placeholder and should be handled by a secure backend server.
const MERCADOPAGO_ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN'; // TODO: Replace with a secure way to handle the token

async function createMercadoPagoOrder(amount, description, external_reference) {
    if (window.MERCADOPAGO_TEST_MODE) {
        return window.createMercadoPagoOrder_mock(amount, description, external_reference);
    }

    const response = await fetch('https://api.mercadopago.com/v1/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
            'X-Idempotency-Key': external_reference,
        },
        body: JSON.stringify({
            total_amount: amount,
            description: description,
            external_reference: external_reference,
            notification_url: 'https://your-webhook-url.com/webhook', // TODO: Replace with your webhook URL
            qr: {
                type: 'qr_code',
            },
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Error creating Mercado Pago order:', error);
        throw new Error('Failed to create Mercado Pago order');
    }

    return await response.json();
}

async function getMercadoPagoOrderStatus(orderId) {
    if (window.MERCADOPAGO_TEST_MODE) {
        return window.getMercadoPagoOrderStatus_mock(orderId);
    }

    const response = await fetch(`https://api.mercadopago.com/v1/orders/${orderId}`, {
        headers: {
            'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Error getting Mercado Pago order status:', error);
        throw new Error('Failed to get Mercado Pago order status');
    }

    return await response.json();
}