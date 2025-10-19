document.addEventListener('DOMContentLoaded',()=>{
  const f=document.getElementById('loginForm'); if(!f) return;
  f.addEventListener('submit',e=>{
    e.preventDefault();
    const u=document.getElementById('username').value.trim();
    const p=document.getElementById('password').value.trim();
    const r=document.getElementById('role').value;
    const emp=loadEmployees().find(x=>x.username===u && x.password===p && x.role===r);
    const err=document.getElementById('loginError');
    if(!emp){ err.textContent='Credenciales incorrectas.'; return; }
    saveCurrentUser({id:emp.id,name:emp.name,username:emp.username,role:emp.role});
    if(r==='mesero') location.href='pages/mesas.html';
    else if(r==='cocina') location.href='pages/cocina.html';
    else location.href='pages/admin.html';
  });
});