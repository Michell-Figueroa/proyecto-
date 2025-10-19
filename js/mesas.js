document.addEventListener('DOMContentLoaded',()=>{
  const user=loadCurrentUser(); if(!user || user.role!=='mesero'){ location.href='../index.html'; return; }
  document.getElementById('welcomeMessage').textContent=`Bienvenido, ${user.name}`;
  const tablesEl=document.getElementById('tables');
  const logoutBtn=document.getElementById('logoutBtn'); logoutBtn.onclick=()=>{ clearCurrentUser(); location.href='../index.html'; };
  function render(){
    tablesEl.innerHTML='';
    const statuses=loadTableStatus();
    for(let i=1;i<=10;i++){
      const st=statuses.find(s=>s.mesa===i)?.status||'free';
      const b=document.createElement('button'); b.className='table-button '+(st==='free'?'available':st==='occupied'?'occupied':'dirty'); b.textContent=i;
      b.onclick=()=>{
        if(st==='free'||st==='occupied'){ location.href=`pedidos.html?mesa=${i}`; }
        else if(st==='dirty'){ if(confirm('¿Marcar mesa como limpia?')){ const s=loadTableStatus().map(x=>x.mesa===i?{...x,status:'free'}:x); saveTableStatus(s); render(); } }
      };
      tablesEl.appendChild(b);
    }
  }
  render();
  window.addEventListener('storage',e=>{ if(e.key==='tableStatusTimestamp'||e.key==='ordersTimestamp') render(); });
});