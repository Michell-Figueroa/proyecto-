// Datos por defecto
const DEFAULT_PRODUCTS = [
  { id: 'guiso1', category: 'Guisos', name: 'Pollo a la mexicana', price: 70, stock: 20, image: 'assets/images/placeholder.png' },
  { id: 'guiso2', category: 'Guisos', name: 'Asado de puerco', price: 75, stock: 18, image: 'assets/images/placeholder.png' },
  { id: 'guiso3', category: 'Guisos', name: 'Bistec en salsa roja', price: 80, stock: 15, image: 'assets/images/placeholder.png' },
  { id: 'guiso4', category: 'Guisos', name: 'Rajas con queso', price: 65, stock: 22, image: 'assets/images/placeholder.png' },
  { id: 'plat1',  category: 'Platillos', name: 'Picada sencilla de frijoles', price: 55, stock: 25, image: 'assets/images/placeholder.png' },
  { id: 'plat2',  category: 'Platillos', name: 'Picada con queso de hebra',   price: 60, stock: 25, image: 'assets/images/placeholder.png' },
  { id: 'plat3',  category: 'Platillos', name: 'Picada con pollo',            price: 65, stock: 25, image: 'assets/images/placeholder.png' },
  { id: 'plat4',  category: 'Platillos', name: 'Torta ahogada',               price: 70, stock: 12, image: 'assets/images/placeholder.png' },
  { id: 'beb1',   category: 'Bebidas',  name: 'Agua del día',                 price: 25, stock: 40, image: 'assets/images/placeholder.png' }
];
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