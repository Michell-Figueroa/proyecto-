document.addEventListener('DOMContentLoaded',()=>{
  const user=loadCurrentUser(); if(!user || (user.role!=='mesero' && user.role!=='admin')){ location.href='../index.html'; return; }
  const params=new URLSearchParams(location.search); const id=params.get('id'); let orders=loadOrders(); let products=loadProducts(); let order=orders.find(o=>o.id===id);
  if(!order||order.status==='paid'){ location.href='mesas.html'; return; }
  const pagoTitle=document.getElementById('pagoTitle'); const orderDetail=document.getElementById('orderDetail'); const paymentSection=document.getElementById('paymentSection');
  pagoTitle.textContent=`Pago de mesa ${order.mesa}`;
  function renderOrder(){
    orderDetail.innerHTML='';
    const ul=document.createElement('ul'); ul.style.listStyle='none'; ul.style.padding='0';
    order.items.forEach(it=>{ const p=products.find(pp=>pp.id===it.productId); const li=document.createElement('li'); li.textContent=`${it.quantity} x ${p.name} ($${(p.price*it.quantity).toFixed(2)})`; ul.appendChild(li); });
    orderDetail.appendChild(ul);
    const tot=document.createElement('p'); tot.style.fontWeight='bold'; const rest=order.total-(order.amountPaid||0); tot.textContent=`Total: $${order.total.toFixed(2)} | Pagado: $${(order.amountPaid||0).toFixed(2)} | Restante: $${rest.toFixed(2)}`; orderDetail.appendChild(tot);
  }
  function finalize(method){
    // descontar inventario
    const prods=loadProducts();
    order.items.forEach(it=>{ const idx=prods.findIndex(p=>p.id===it.productId); if(idx>=0){ prods[idx].stock=Math.max(0,(prods[idx].stock||0)-it.quantity); } });
    saveProducts(prods);
    order.status='paid'; order.payment=method; orders=orders.map(o=>o.id===order.id?order:o); saveOrders(orders);
    // mesa sucia
    const sts=loadTableStatus(); const i=sts.findIndex(s=>s.mesa===order.mesa); if(i>=0){ sts[i].status='dirty'; saveTableStatus(sts); }
    alert('Pago registrado.');
    location.href='mesas.html';
  }
  document.getElementById('efectivoBtn').onclick=()=>{
    paymentSection.innerHTML=''; const label=document.createElement('label'); label.textContent='Monto recibido (MXN)';
    const input=document.createElement('input'); input.type='number'; input.min='0'; input.placeholder='Cantidad pagada';
    const confirm=document.createElement('button'); confirm.textContent='Confirmar pago';
    confirm.onclick=()=>{ const amt=parseFloat(input.value||'0'); const rest=order.total-(order.amountPaid||0);
      if(isNaN(amt)||amt<=0){ alert('Ingresa un monto válido.'); return; } if(amt<rest){ order.amountPaid=(order.amountPaid||0)+amt; orders=orders.map(o=>o.id===order.id?order:o); saveOrders(orders); alert(`Pago parcial de $${amt.toFixed(2)} registrado.`); renderOrder(); paymentSection.innerHTML=''; return; }
      const cambio=amt-rest; if(cambio>0) alert(`Cambio: $${cambio.toFixed(2)}`); finalize('efectivo');
    };
    paymentSection.appendChild(label); paymentSection.appendChild(input); paymentSection.appendChild(confirm);
  };
  document.getElementById('qrBtn').onclick=async ()=>{
    paymentSection.innerHTML = '<p>Generando código QR...</p>';
    try {
        console.log("Creating Mercado Pago order...");
        const rest = order.total - (order.amountPaid || 0);
        const externalReference = `order-${order.id}-${Date.now()}`;
        const mpOrder = await createMercadoPagoOrder(rest, `Pedido ${order.id}`, externalReference);
        console.log("Mercado Pago order created:", mpOrder);

        paymentSection.innerHTML = '';
        const p = document.createElement('p');
        p.textContent = 'Escanea el código para pagar:';
        const img = document.createElement('img');
        img.src = mpOrder.qr_data;
        img.alt = 'QR de Mercado Pago';
        img.style.display = 'block';
        img.style.margin = '10px auto';

        const statusP = document.createElement('p');
        statusP.textContent = 'Esperando pago...';
        paymentSection.appendChild(p);
        paymentSection.appendChild(img);
        paymentSection.appendChild(statusP);

        // Polling for payment status
        const intervalId = setInterval(async () => {
            try {
                const updatedOrder = await getMercadoPagoOrderStatus(mpOrder.id);
                if (updatedOrder.status === 'paid') {
                    clearInterval(intervalId);
                    finalize('qr');
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
                statusP.textContent = 'Error al verificar el pago.';
                clearInterval(intervalId);
            }
        }, 5000); // Poll every 5 seconds
    } catch (error) {
        paymentSection.innerHTML = '<p>Error al generar el código QR. Inténtalo de nuevo.</p>';
    }
  };
  document.getElementById('backPagos').onclick=()=>{ location.href='mesas.html'; };
  renderOrder();
});