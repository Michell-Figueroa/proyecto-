document.addEventListener('DOMContentLoaded',()=>{
  const user=loadCurrentUser(); if(!user || (user.role!=='mesero' && user.role!=='admin')){ location.href='../index.html'; return; }
  const params=new URLSearchParams(location.search); const mesaNum=parseInt(params.get('mesa')||'0',10); if(!mesaNum){ location.href='mesas.html'; return; }
  document.getElementById('mesaTitle').textContent=`Pedido para mesa ${mesaNum}`;
  const productsContainer=document.getElementById('productsContainer');
  const orderItemsDiv=document.getElementById('orderItems'); const notesInput=document.getElementById('notes'); const totalEl=document.getElementById('total');
  const sendBtn=document.getElementById('sendBtn'); const payBtn=document.getElementById('payBtn'); const cancelBtn=document.getElementById('cancelBtn'); const backBtn=document.getElementById('backBtn');
  let products=loadProducts(); let orders=loadOrders();
  let current=orders.find(o=>parseInt(o.mesa)===mesaNum && o.status!=='paid' && o.status!=='cancelled');
  if(!current){ current={id:generateId(),mesa:mesaNum,items:[],status:'draft',notes:'',waiter:user.username,payment:null,total:0,createdAt:Date.now(),amountPaid:0}; orders.push(current); saveOrders(orders); }
  // marcar mesa ocupada
  (function occupy(){ const sts=loadTableStatus(); const idx=sts.findIndex(s=>s.mesa===mesaNum); if(idx>=0){ sts[idx].status='occupied'; saveTableStatus(sts);} })();
  function renderProducts(){
    productsContainer.innerHTML='';
    const cats={}; for(const p of products){ (cats[p.category]=cats[p.category]||[]).push(p); }
    Object.keys(cats).forEach(cat=>{
      const h=document.createElement('h3'); h.textContent=cat; productsContainer.appendChild(h);
      const grid=document.createElement('div'); grid.className='products';
      cats[cat].forEach(p=>{
        const card=document.createElement('div'); card.className='product-card';
        const img=document.createElement('img'); img.src = p.image.startsWith('assets') ? ('../'+p.image) : p.image; img.alt=p.name; card.appendChild(img);
        const nm=document.createElement('p'); nm.textContent=p.name; card.appendChild(nm);
        const pr=document.createElement('p'); pr.textContent=`$${p.price.toFixed(2)}`; card.appendChild(pr);
        if(p.stock<=0){ const s=document.createElement('p'); s.style.color='#ff8080'; s.textContent='Agotado'; card.appendChild(s); card.style.opacity='0.6'; }
        card.addEventListener('click',()=>{ if(p.stock>0) add(p.id); card.classList.add('animate'); setTimeout(()=>card.classList.remove('animate'),800); });
        grid.appendChild(card);
      });
      productsContainer.appendChild(grid);
    });
  }
  function add(pid){ const it=current.items.find(i=>i.productId===pid); const prod=products.find(p=>p.id===pid); if(!prod||prod.stock<=0) return; if(it) it.quantity+=1; else current.items.push({productId:pid,quantity:1}); renderOrder(); }
  function qty(pid,delta){ const it=current.items.find(i=>i.productId===pid); if(!it) return; it.quantity+=delta; if(it.quantity<=0) current.items=current.items.filter(i=>i.productId!==pid); renderOrder(); }
  function renderOrder(){
    orderItemsDiv.innerHTML=''; let total=0;
    current.items.forEach(it=>{ const p=products.find(pp=>pp.id===it.productId); const row=document.createElement('div'); row.className='order-item';
      const name=document.createElement('span'); name.textContent=`${it.quantity} x ${p.name}`;
      const ctr=document.createElement('div'); ctr.className='order-item-controls';
      const m=document.createElement('button'); m.textContent='-'; m.style.width='35px'; m.onclick=()=>qty(it.productId,-1);
      const plus=document.createElement('button'); plus.textContent='+'; plus.style.width='35px'; plus.onclick=()=>qty(it.productId,1);
      ctr.appendChild(m); ctr.appendChild(plus); row.appendChild(name); row.appendChild(ctr); orderItemsDiv.appendChild(row); total+=p.price*it.quantity; });
    current.total=total; totalEl.textContent=`Total: $${total.toFixed(2)}`; notesInput.value=current.notes||'';
    if(current.status==='draft'){ sendBtn.style.display='block'; cancelBtn.style.display='block'; payBtn.style.display='none'; }
    else if(current.status==='in_kitchen'||current.status==='preparing'){ sendBtn.style.display='none'; cancelBtn.style.display='none'; payBtn.style.display='none'; }
    else if(current.status==='ready'){ sendBtn.style.display='none'; cancelBtn.style.display='none'; payBtn.style.display='block'; }
  }
  sendBtn.onclick=()=>{ if(current.items.length===0){ alert('No hay productos en la orden.'); return; } current.status='in_kitchen'; current.notes=notesInput.value.trim(); orders=orders.map(o=>o.id===current.id?current:o); saveOrders(orders); alert('Orden enviada a cocina.'); location.href='mesas.html'; };
  payBtn.onclick=()=>{ location.href=`pagos.html?id=${current.id}`; };
  cancelBtn.onclick=()=>{ if(confirm('¿Cancelar la orden?')){ orders=orders.filter(o=>o.id!==current.id); saveOrders(orders); alert('Orden cancelada.'); location.href='mesas.html'; } };
  backBtn.onclick=()=>{ location.href='mesas.html'; };
  renderProducts(); renderOrder();
  window.addEventListener('storage',e=>{
    if(e.key==='ordersTimestamp'){ orders=loadOrders(); const up=orders.find(o=>o.id===current.id); if(up){ current=up; renderOrder(); } else { alert('La orden ya no existe.'); location.href='mesas.html'; } }
    if(e.key==='productsTimestamp'){ products=loadProducts(); renderProducts(); renderOrder(); }
  });
});