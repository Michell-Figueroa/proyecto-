document.addEventListener('DOMContentLoaded',()=>{
  const user=loadCurrentUser(); if(!user || (user.role!=='cocina' && user.role!=='admin')){ location.href='../index.html'; return; }
  document.getElementById('cocinaWelcome').textContent=`Hola, ${user.name}`;
  const list=document.getElementById('ordersList');
  document.getElementById('logoutCocina').onclick=()=>{ clearCurrentUser(); location.href='../index.html'; };
  let products=loadProducts(); let orders=loadOrders();
  function render(){
    list.innerHTML='';
    const pend=orders.filter(o=>o.status==='in_kitchen'||o.status==='preparing');
    if(pend.length===0){ const p=document.createElement('p'); p.textContent='No hay pedidos pendientes.'; list.appendChild(p); return; }
    pend.forEach(o=>{
      const card=document.createElement('div'); card.className='order-card';
      const t=document.createElement('h4'); t.textContent=`Mesa ${o.mesa} (Orden ${o.id.slice(-4)})`; card.appendChild(t);
      const ul=document.createElement('ul'); o.items.forEach(it=>{ const pr=products.find(pp=>pp.id===it.productId); const li=document.createElement('li'); li.textContent=`${it.quantity} x ${pr.name}`; ul.appendChild(li); }); card.appendChild(ul);
      if(o.notes){ const n=document.createElement('p'); n.style.fontStyle='italic'; n.textContent='Notas: '+o.notes; card.appendChild(n); }
      const btn=document.createElement('button'); if(o.status==='in_kitchen'){ btn.textContent='Preparar'; btn.onclick=()=>{ o.status='preparing'; orders=orders.map(x=>x.id===o.id?o:x); saveOrders(orders); render(); }; } else { btn.textContent='Listo'; btn.onclick=()=>{ o.status='ready'; orders=orders.map(x=>x.id===o.id?o:x); saveOrders(orders); render(); }; }
      card.appendChild(btn); list.appendChild(card);
    });
  }
  render();
  window.addEventListener('storage',e=>{ if(e.key==='ordersTimestamp'||e.key==='productsTimestamp'){ products=loadProducts(); orders=loadOrders(); render(); } });
});