// Datos por defecto
const DEFAULT_PRODUCTS = [];
const DEFAULT_EMPLOYEES = [
  { id: 1, name: 'Mesero Demo',    username: 'mesero', password: '1234', role: 'mesero' },
  { id: 2, name: 'Cocinero Demo',  username: 'cocina', password: '1234', role: 'cocina' },
  { id: 3, name: 'Administrador',  username: 'admin',  password: '1234', role: 'admin'  }
];
function loadProducts(){ try{const s=localStorage.getItem('products'); return s?JSON.parse(s):[...DEFAULT_PRODUCTS];}catch(e){return[...DEFAULT_PRODUCTS];} }
function saveProducts(list){ localStorage.setItem('products', JSON.stringify(list)); localStorage.setItem('productsTimestamp', Date.now().toString()); }
function loadEmployees(){ try{const s=localStorage.getItem('employees'); return s?JSON.parse(s):[...DEFAULT_EMPLOYEES];}catch(e){return[...DEFAULT_EMPLOYEES];} }
function saveEmployees(list){ localStorage.setItem('employees', JSON.stringify(list)); localStorage.setItem('employeesTimestamp', Date.now().toString()); }
function loadOrders(){ try{const s=localStorage.getItem('orders'); return s?JSON.parse(s):[];}catch(e){return[];} }
function saveOrders(list){ localStorage.setItem('orders', JSON.stringify(list)); localStorage.setItem('ordersTimestamp', Date.now().toString()); }
function loadCurrentUser(){ const s=localStorage.getItem('currentUser'); return s?JSON.parse(s):null; }
function saveCurrentUser(u){ localStorage.setItem('currentUser', JSON.stringify(u)); }
function clearCurrentUser(){ localStorage.removeItem('currentUser'); }
function generateId(){ return 'ord-'+Date.now()+'-'+Math.floor(Math.random()*1000); }
// Estado de mesas
const DEFAULT_TABLE_STATUSES = Array.from({length:10},(_,i)=>({mesa:i+1,status:'free'}));
function loadTableStatus(){ try{const s=localStorage.getItem('tableStatuses'); return s?JSON.parse(s):[...DEFAULT_TABLE_STATUSES];}catch(e){return[...DEFAULT_TABLE_STATUSES];} }
function saveTableStatus(list){ localStorage.setItem('tableStatuses', JSON.stringify(list)); localStorage.setItem('tableStatusTimestamp', Date.now().toString()); }