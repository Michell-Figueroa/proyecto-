document.addEventListener('DOMContentLoaded',()=>{
  const user=loadCurrentUser(); if(!user || user.role!=='admin'){ location.href='../index.html'; return; }
  document.getElementById('adminWelcome').textContent=`Bienvenido, ${user.name}`;
  const menuNav=document.getElementById('menuNav'), empNav=document.getElementById('employeesNav'), repNav=document.getElementById('reportsNav'), out=document.getElementById('logoutAdmin');
  const menuS=document.getElementById('menuSection'), empS=document.getElementById('employeesSection'), repS=document.getElementById('reportsSection');
  out.onclick=(e)=>{ e.preventDefault(); clearCurrentUser(); location.href='../index.html'; };
  function show(n){ menuS.classList.remove('active'); empS.classList.remove('active'); repS.classList.remove('active'); ({menu:menuS,employees:empS,reports:repS})[n].classList.add('active'); }
  let products=loadProducts(), employees=loadEmployees(), orders=loadOrders();
  function renderMenu(){ products=loadProducts(); menuS.innerHTML='';
    const table=document.createElement('table'); table.className='table';
    const thead=document.createElement('thead'); const trh=document.createElement('tr'); ['Categoría','Nombre','Precio','Acciones'].forEach(h=>{ const th=document.createElement('th'); th.textContent=h; trh.appendChild(th); }); thead.appendChild(trh); table.appendChild(thead);
    const tbody=document.createElement('tbody');
    products.forEach((p,idx)=>{ const r=document.createElement('tr');
      const ctd=document.createElement('td'); const sel=document.createElement('select'); ['Guisos','Platillos','Bebidas'].forEach(c=>{ const o=document.createElement('option'); o.value=c;o.textContent=c; if(p.category===c) o.selected=true; sel.appendChild(o); }); ctd.appendChild(sel); r.appendChild(ctd);
      const ntd=document.createElement('td'); const nin=document.createElement('input'); nin.type='text'; nin.value=p.name; ntd.appendChild(nin); r.appendChild(ntd);
      const ptd=document.createElement('td'); const pin=document.createElement('input'); pin.type='number'; pin.min='0'; pin.step='0.5'; pin.value=p.price; ptd.appendChild(pin); r.appendChild(ptd);
      const atd=document.createElement('td'); const del=document.createElement('button'); del.type='button'; del.textContent='Eliminar'; del.className='secondary'; del.onclick=()=>{ if(confirm('¿Eliminar producto?')){ products.splice(idx,1); saveProducts(products); renderMenu(); } }; atd.appendChild(del); r.appendChild(atd);
      tbody.appendChild(r);
    });
    const nr=document.createElement('tr');
    const ncat=document.createElement('td'); const nsel=document.createElement('select'); ['Guisos','Platillos','Bebidas'].forEach(c=>{ const o=document.createElement('option'); o.value=c;o.textContent=c; nsel.appendChild(o); }); ncat.appendChild(nsel); nr.appendChild(ncat);
    const nname=document.createElement('td'); const ninp=document.createElement('input'); ninp.type='text'; ninp.placeholder='Nuevo producto'; nname.appendChild(ninp); nr.appendChild(nname);
    const nprice=document.createElement('td'); const pinp=document.createElement('input'); pinp.type='number'; pinp.min='0'; pinp.step='0.5'; pinp.placeholder='Precio'; nprice.appendChild(pinp); nr.appendChild(nprice);
    const nact=document.createElement('td'); const add=document.createElement('button'); add.type='button'; add.textContent='Agregar'; add.onclick=()=>{ const cat=nsel.value, nm=ninp.value.trim(), pr=parseFloat(pinp.value||'0'); if(!nm||isNaN(pr)) { alert('Completa nombre y precio'); return; } const id=`${cat.toLowerCase()}-${Date.now()}`; products.push({id,category:cat,name:nm,price:pr,image:'assets/images/placeholder.png'}); saveProducts(products); renderMenu(); }; nact.appendChild(add); nr.appendChild(nact);
    tbody.appendChild(nr); table.appendChild(tbody);
    const save=document.createElement('button'); save.type='button'; save.textContent='Guardar cambios'; save.onclick=()=>{ const rows=[...tbody.children]; const updated=[]; rows.slice(0,rows.length-1).forEach((row,idx)=>{ const cat=row.children[0].firstChild.value; const nm=row.children[1].firstChild.value.trim(); const pr=parseFloat(row.children[2].firstChild.value); updated.push({...products[idx],category:cat,name:nm,price:pr}); }); products=updated; saveProducts(products); alert('Productos actualizados.'); renderMenu(); };
    menuS.appendChild(table); menuS.appendChild(save);
  }
  function renderEmployees(){ employees=loadEmployees(); empS.innerHTML=''; const t=document.createElement('table'); t.className='table';
    const th=document.createElement('tr'); ['Nombre','Usuario','Rol','Acciones'].forEach(h=>{ const thd=document.createElement('th'); thd.textContent=h; th.appendChild(thd); }); const thead=document.createElement('thead'); thead.appendChild(th); t.appendChild(thead);
    const tb=document.createElement('tbody'); employees.forEach((e,idx)=>{ const r=document.createElement('tr');
      const n=document.createElement('td'); const ni=document.createElement('input'); ni.type='text'; ni.value=e.name; n.appendChild(ni); r.appendChild(n);
      const u=document.createElement('td'); const ui=document.createElement('input'); ui.type='text'; ui.value=e.username; u.appendChild(ui); r.appendChild(u);
      const ro=document.createElement('td'); const rs=document.createElement('select'); ['mesero','cocina','admin'].forEach(v=>{ const o=document.createElement('option'); o.value=v;o.textContent=v; if(e.role===v) o.selected=true; rs.appendChild(o); }); ro.appendChild(rs); r.appendChild(ro);
      const a=document.createElement('td'); const d=document.createElement('button'); d.type='button'; d.textContent='Eliminar'; d.className='secondary'; d.onclick=()=>{ if(confirm('¿Eliminar empleado?')){ employees.splice(idx,1); saveEmployees(employees); renderEmployees(); } }; a.appendChild(d); r.appendChild(a);
      tb.appendChild(r);
    });
    const nr=document.createElement('tr'); const n1=document.createElement('td'); const ni=document.createElement('input'); ni.type='text'; ni.placeholder='Nombre'; n1.appendChild(ni); nr.appendChild(n1);
    const n2=document.createElement('td'); const ui=document.createElement('input'); ui.type='text'; ui.placeholder='Usuario'; n2.appendChild(ui); nr.appendChild(n2);
    const n3=document.createElement('td'); const rs=document.createElement('select'); ['mesero','cocina','admin'].forEach(v=>{ const o=document.createElement('option'); o.value=v;o.textContent=v; rs.appendChild(o); }); n3.appendChild(rs); nr.appendChild(n3);
    const n4=document.createElement('td'); const add=document.createElement('button'); add.type='button'; add.textContent='Agregar'; add.onclick=()=>{ const nm=ni.value.trim(), un=ui.value.trim(), ro=rs.value; if(!nm||!un){ alert('Completa nombre y usuario.'); return; } const pwd=prompt('Contraseña:'); if(!pwd){ alert('Sin contraseña.'); return; } const id=employees.length?Math.max(...employees.map(e=>e.id))+1:1; employees.push({id,name:nm,username:un,password:pwd,role:ro}); saveEmployees(employees); renderEmployees(); }; n4.appendChild(add); nr.appendChild(n4);
    tb.appendChild(nr); t.appendChild(tb);
    const save=document.createElement('button'); save.type='button'; save.textContent='Guardar cambios'; save.onclick=()=>{ const rows=[...tb.children]; const upd=[]; rows.slice(0,rows.length-1).forEach((row,idx)=>{ const nm=row.children[0].firstChild.value.trim(); const un=row.children[1].firstChild.value.trim(); const ro=row.children[2].firstChild.value; upd.push({...employees[idx],name:nm,username:un,role:ro}); }); employees=upd; saveEmployees(employees); alert('Empleados actualizados.'); };
    empS.appendChild(t); empS.appendChild(save);
  }
  function renderReports(){ orders=loadOrders(); employees=loadEmployees(); products=loadProducts(); repS.innerHTML='';
    const controls=document.createElement('div'); const sL=document.createElement('label'); sL.textContent='Desde:'; const sI=document.createElement('input'); sI.type='date';
    const eL=document.createElement('label'); eL.textContent='Hasta:'; const eI=document.createElement('input'); eI.type='date'; const btn=document.createElement('button'); btn.textContent='Aplicar filtro'; btn.onclick=()=>load(sI.value,eI.value);
    controls.appendChild(sL);controls.appendChild(sI);controls.appendChild(eL);controls.appendChild(eI);controls.appendChild(btn); repS.appendChild(controls);
    const content=document.createElement('div'); content.id='reportContent'; repS.appendChild(content);
    function load(a,b){ const div=document.getElementById('reportContent'); div.innerHTML=''; let filtered=orders.filter(o=>o.status==='paid'); if(a){ const d=new Date(a); filtered=filtered.filter(o=>new Date(o.createdAt)>=d);} if(b){ const d=new Date(b); d.setDate(d.getDate()+1); filtered=filtered.filter(o=>new Date(o.createdAt)<d);} const total=filtered.reduce((s,o)=>s+o.total,0);
      const p1=document.createElement('p'); p1.textContent='Ventas totales: $'+total.toFixed(2); div.appendChild(p1);
      const eTot=filtered.filter(o=>o.payment==='efectivo').reduce((s,o)=>s+o.total,0); const qTot=filtered.filter(o=>o.payment==='qr').reduce((s,o)=>s+o.total,0);
      const t=document.createElement('table'); t.className='table'; const h=document.createElement('tr'); ['Tipo de pago','Total'].forEach(x=>{ const th=document.createElement('th'); th.textContent=x; h.appendChild(th); }); t.appendChild(h);
      const r1=document.createElement('tr'); r1.innerHTML='<td>Efectivo</td><td>$'+eTot.toFixed(2)+'</td>'; const r2=document.createElement('tr'); r2.innerHTML='<td>Código QR</td><td>$'+qTot.toFixed(2)+'</td>'; t.appendChild(r1); t.appendChild(r2); div.appendChild(t);
      const counts={}; filtered.forEach(o=>o.items.forEach(it=>counts[it.productId]=(counts[it.productId]||0)+it.quantity)); const top=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([id,c])=>({name:(products.find(p=>p.id===id)||{name:id}).name,count:c}));
      const th2=document.createElement('h3'); th2.textContent='Productos más vendidos'; div.appendChild(th2);
      const tp=document.createElement('table'); tp.className='table'; const hh=document.createElement('tr'); ['Producto','Veces vendido'].forEach(x=>{ const th=document.createElement('th'); th.textContent=x; hh.appendChild(th); }); tp.appendChild(hh);
      top.forEach(it=>{ const tr=document.createElement('tr'); tr.innerHTML='<td>'+it.name+'</td><td>'+it.count+'</td>'; tp.appendChild(tr); }); div.appendChild(tp);
      const sbm={}; filtered.forEach(o=>{ sbm[o.waiter]=sbm[o.waiter]||{count:0,total:0}; sbm[o.waiter].count++; sbm[o.waiter].total+=o.total; });
      const th3=document.createElement('h3'); th3.textContent='Ventas por mesero'; div.appendChild(th3);
      const mt=document.createElement('table'); mt.className='table'; const mh=document.createElement('tr'); ['Mesero','Órdenes','Total'].forEach(x=>{ const th=document.createElement('th'); th.textContent=x; mh.appendChild(th); }); mt.appendChild(mh);
      Object.keys(sbm).forEach(u=>{ const emp=employees.find(e=>e.username===u); const tr=document.createElement('tr'); tr.innerHTML='<td>'+(emp?emp.name:u)+'</td><td>'+sbm[u].count+'</td><td>$'+sbm[u].total.toFixed(2)+'</td>'; mt.appendChild(tr); }); div.appendChild(mt);
    }
    load();
  }
  function nav(){ menuNav.onclick=(e)=>{e.preventDefault(); renderMenu(); show('menu');}; empNav.onclick=(e)=>{e.preventDefault(); renderEmployees(); show('employees');}; repNav.onclick=(e)=>{e.preventDefault(); renderReports(); show('reports');}; }
  renderMenu(); show('menu'); nav();
  window.addEventListener('storage',e=>{ if(e.key==='productsTimestamp'&&menuS.classList.contains('active')) renderMenu(); if(e.key==='employeesTimestamp'&&empS.classList.contains('active')) renderEmployees(); if(e.key==='ordersTimestamp'&&repS.classList.contains('active')) renderReports(); });
});