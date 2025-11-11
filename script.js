/* SH Foods — Frontend interactions (no backend)
   Features:
   - full list of 40 Indian dishes
   - search, category filter, sort
   - add to cart, cart stored in localStorage
   - native BarcodeDetector QR scanning (fallback instructions)
*/

const DATA = (function makeData(){
  // 40 popular Indian dishes across categories
  return [
    // Starters
    { id:'i1', cat:'Starters', name:'Paneer Tikka', desc:'Smoky, marinated paneer chunks', price:220, veg:true },
    { id:'i2', cat:'Starters', name:'Chicken 65', desc:'Spicy fried chicken — South Indian classic', price:240, veg:false },
    { id:'i3', cat:'Starters', name:'Fish Amritsari', desc:'Crispy, spiced batter fish', price:260, veg:false },
    { id:'i4', cat:'Starters', name:'Hara Bhara Kebab', desc:'Spinach & peas cutlets', price:180, veg:true },
    { id:'i5', cat:'Starters', name:'Pav Bhaji', desc:'Buttery veg mash with pav', price:160, veg:true },

    // Mains - Curries
    { id:'i6', cat:'Mains', name:'Butter Chicken', desc:'Rich tomato & butter gravy', price:345, veg:false },
    { id:'i7', cat:'Mains', name:'Paneer Butter Masala', desc:'Creamy tomato paneer curry', price:320, veg:true },
    { id:'i8', cat:'Mains', name:'Rogan Josh', desc:'Kashmiri lamb curry', price:385, veg:false },
    { id:'i9', cat:'Mains', name:'Dal Makhani', desc:'Slow-cooked black lentils', price:240, veg:true },
    { id:'i10', cat:'Mains', name:'Chole Bhature', desc:'Spiced chickpea curry & fried bread', price:210, veg:true },

    // Biryani
    { id:'i11', cat:'Biryani', name:'Hyderabadi Dum Biryani (Chicken)', desc:'Layered, aromatic dum biryani', price:400, veg:false },
    { id:'i12', cat:'Biryani', name:'Kolkata Biryani (Mutton)', desc:'Light, fragrant with potatoes', price:420, veg:false },
    { id:'i13', cat:'Biryani', name:'Veg Biryani', desc:'Fragrant basmati with seasonal veg', price:300, veg:true },
    { id:'i14', cat:'Biryani', name:'Bombay Biryani (Beef-style)', desc:'Spicy, tangy biryani', price:390, veg:false },

    // Breads / Rice / Sides
    { id:'i15', cat:'Breads', name:'Garlic Naan', desc:'Buttery garlic-flavoured naan', price:55, veg:true },
    { id:'i16', cat:'Breads', name:'Tandoori Roti', desc:'Whole wheat tandoor roti', price:35, veg:true },
    { id:'i17', cat:'Breads', name:'Lachha Paratha', desc:'Flaky layered paratha', price:70, veg:true },
    { id:'i18', cat:'Sides', name:'Jeera Rice', desc:'Cumin-scented long-grain rice', price:95, veg:true },
    { id:'i19', cat:'Sides', name:'Raita', desc:'Cooling yoghurt with cucumber', price:60, veg:true },

    // Regional Specials
    { id:'i20', cat:'Regional', name:'Masala Dosa', desc:'Crispy dosa with spiced potato', price:150, veg:true },
    { id:'i21', cat:'Regional', name:'Prawn Malabar', desc:'Coconut-based Kerala prawn curry', price:380, veg:false },
    { id:'i22', cat:'Regional', name:'Laal Maas', desc:'Rajasthani fiery mutton curry', price:420, veg:false },
    { id:'i23', cat:'Regional', name:'Sarso Ka Saag & Makki Roti', desc:'Punjabi mustard greens & corn roti', price:250, veg:true },

    // Street Food / Snacks
    { id:'i24', cat:'Street', name:'Vada Pav', desc:'Mumbai favourite — potato fritter in bun', price:80, veg:true },
    { id:'i25', cat:'Street', name:'Samosa Chaat', desc:'Crispy samosa with tangy chaat', price:110, veg:true },
    { id:'i26', cat:'Street', name:'Kathi Roll (Chicken)', desc:'Flaky paratha roll with kebab', price:200, veg:false },
    { id:'i27', cat:'Street', name:'Pani Puri (Gol gappa)', desc:'Crispy hollow puris with tangy water', price:90, veg:true },

    // Kebabs & Grill
    { id:'i28', cat:'Grill', name:'Seekh Kebab', desc:'Minced spiced meat on skewer', price:320, veg:false },
    { id:'i29', cat:'Grill', name:'Tandoori Pomfret', desc:'Smoky marinated fish', price:420, veg:false },
    { id:'i30', cat:'Grill', name:'Malai Tikka', desc:'Creamy chicken tikka', price:360, veg:false },

    // Sweets / Desserts
    { id:'i31', cat:'Desserts', name:'Gulab Jamun', desc:'Soft syrup-soaked balls', price:120, veg:true },
    { id:'i32', cat:'Desserts', name:'Rasmalai', desc:'Soft cheese in sweet milk', price:140, veg:true },
    { id:'i33', cat:'Desserts', name:'Kulfi Falooda', desc:'Creamy Indian ice cream with vermicelli', price:160, veg:true },

    // Fusion / Popular
    { id:'i34', cat:'Popular', name:'Butter Paneer Pizza', desc:'Paneer + butter masala on thin crust', price:420, veg:true },
    { id:'i35', cat:'Popular', name:'Tandoori Chicken Burger', desc:'Smoky chicken patty with raita', price:220, veg:false },

    // Healthy / Salads
    { id:'i36', cat:'Healthy', name:'Quinoa Tadka Salad', desc:'Quinoa, roasted veggies & chaat masala', price:260, veg:true },
    { id:'i37', cat:'Healthy', name:'Sprouts Sundal', desc:'South Indian style sprouted legumes', price:140, veg:true },

    // Beverages
    { id:'i38', cat:'Beverages', name:'Masala Chai', desc:'Spiced Indian tea', price:40, veg:true },
    { id:'i39', cat:'Beverages', name:'Lassi (Sweet/Salted)', desc:'Traditional yogurt drink', price:90, veg:true },
    { id:'i40', cat:'Beverages', name:'Filter Coffee', desc:'South Indian filter coffee', price:70, veg:true }
  ];
})();

/* app state */
let CART = JSON.parse(localStorage.getItem('shfoods_cart') || '[]');
const menuEl = document.getElementById('menu');
const categoriesEl = document.getElementById('categories');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const cartList = document.getElementById('cartList');
const cartTotalEl = document.getElementById('cartTotal');
const toast = document.getElementById('toast');
const scanBtn = document.getElementById('scanBtn');
const shareBtn = document.getElementById('shareBtn');

const ALL_CATS = Array.from(new Set(DATA.map(d=>d.cat)));
let activeCat = 'All';
let query = '';
let currentSort = 'popular';

/* helper functions */
function money(n){ return '₹' + n; }
function showToast(msg, time=2000){
  toast.textContent = msg; toast.classList.remove('hidden');
  setTimeout(()=> toast.classList.add('hidden'), time);
}
function saveCart(){ localStorage.setItem('shfoods_cart', JSON.stringify(CART)); renderCart(); }

/* render categories */
function renderCategories(){
  categoriesEl.innerHTML = '';
  const allBtn = document.createElement('button');
  allBtn.className = 'cat' + (activeCat==='All'?' active':''); allBtn.textContent = 'All';
  allBtn.onclick = ()=>{ activeCat='All'; renderAll(); };
  categoriesEl.appendChild(allBtn);

  ALL_CATS.forEach(c=>{
    const b = document.createElement('button');
    b.className = 'cat' + (activeCat===c?' active':'');
    b.textContent = c;
    b.onclick = ()=>{ activeCat=c; renderAll(); };
    categoriesEl.appendChild(b);
  });
}

/* filter, sort */
function getFiltered(){
  let out = DATA.filter(d=>{
    if(activeCat !== 'All' && d.cat !== activeCat) return false;
    if(query && !(d.name.toLowerCase().includes(query) || d.desc.toLowerCase().includes(query) || d.cat.toLowerCase().includes(query))) return false;
    return true;
  });

  if(currentSort === 'price-asc') out.sort((a,b)=>a.price-b.price);
  else if(currentSort === 'price-desc') out.sort((a,b)=>b.price-a.price);
  else if(currentSort === 'name') out.sort((a,b)=>a.name.localeCompare(b.name));
  // popular: we keep original order (curated)
  return out;
}

/* render menu */
function renderMenu(){
  const items = getFiltered();
  menuEl.innerHTML = '';
  items.forEach(it=>{
    const el = document.createElement('article'); el.className = 'item card';
    el.innerHTML = `
      <div class="thumb" aria-hidden>${(it.veg? '🌿' : '🍗')}</div>
      <div class="item-body">
        <h4>${it.name}</h4>
        <p class="meta">${it.desc}</p>
        <div class="item-foot">
          <div class="meta">${it.cat}</div>
          <div class="price">${money(it.price)}</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
        <button class="btn" data-id="${it.id}">Add</button>
      </div>
    `;
    menuEl.appendChild(el);
  });

  // wire add buttons
  menuEl.querySelectorAll('button[data-id]').forEach(b=>{
    b.addEventListener('click', ()=> {
      const id = b.getAttribute('data-id');
      addToCart(id);
    });
  });
}

/* cart logic */
function addToCart(id){
  const item = DATA.find(d=>d.id===id);
  if(!item) return;
  const existing = CART.find(c=>c.id===id);
  if(existing) existing.qty += 1;
  else CART.push({ id:item.id, name:item.name, price:item.price, qty:1});
  saveCart();
  showToast(`${item.name} added to cart`);
}
function removeFromCart(id){
  CART = CART.filter(c => c.id !== id);
  saveCart();
}
function changeQty(id, delta){
  const it = CART.find(c=>c.id===id); if(!it) return;
  it.qty += delta; if(it.qty < 1) removeFromCart(id);
  saveCart();
}
function renderCart(){
  cartList.innerHTML = '';
  if(CART.length === 0) cartList.innerHTML = '<div class="meta">Your cart is empty</div>';
  let total = 0;
  CART.forEach(c=>{
    total += c.qty * c.price;
    const row = document.createElement('div'); row.className = 'cart-row';
    row.innerHTML = `
      <div>
        <div style="font-weight:700">${c.name}</div>
        <div class="meta">${c.qty} × ${money(c.price)}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
        <div class="qty">${c.qty}</div>
        <div style="display:flex;gap:6px">
          <button class="btn ghost small" data-act="dec" data-id="${c.id}">−</button>
          <button class="btn ghost small" data-act="inc" data-id="${c.id}">+</button>
          <button class="btn ghost small" data-act="rm" data-id="${c.id}">Remove</button>
        </div>
      </div>
    `;
    cartList.appendChild(row);
  });

  cartTotalEl.textContent = money(total);
  // wire cart controls
  cartList.querySelectorAll('button[data-act]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.getAttribute('data-id');
      const act = b.getAttribute('data-act');
      if(act === 'dec') changeQty(id, -1);
      if(act === 'inc') changeQty(id, +1);
      if(act === 'rm') removeFromCart(id);
    });
  });
}

/* interactions */
function renderAll(){ renderCategories(); renderMenu(); renderCart(); }
searchInput.addEventListener('input', (e)=>{ query = e.target.value.trim().toLowerCase(); renderAll(); });
sortSelect.addEventListener('change', (e)=>{ currentSort = e.target.value; renderAll(); });

document.getElementById('checkoutBtn').addEventListener('click', ()=>{
  if(CART.length === 0) return showToast('Cart is empty');
  // Mock checkout: save order to localStorage
  const orders = JSON.parse(localStorage.getItem('shfoods_orders') || '[]');
  const order = { id:'ORD' + Date.now(), items:CART, total: CART.reduce((s,i)=>s+i.qty*i.price,0), created: new Date().toISOString() };
  orders.push(order); localStorage.setItem('shfoods_orders', JSON.stringify(orders));
  CART = []; saveCart();
  showToast('Order placed — ' + order.id);
});

/* share */
shareBtn.addEventListener('click', async ()=>{
  const shareData = { title: 'SH Foods — Menu', text: 'Order from SH Foods — amazing Indian cuisine', url: location.href };
  if(navigator.share){ await navigator.share(shareData).catch(()=>{}); }
  else { await navigator.clipboard.writeText(location.href); showToast('Menu link copied'); }
});

/* QR Scan — BarcodeDetector API (fast native) */
async function startQRScan(){
  // If native BarcodeDetector is supported
  if('BarcodeDetector' in window){
    try{
      const formats = await BarcodeDetector.getSupportedFormats();
      // prefer QR_CODE
      const detector = new BarcodeDetector({ formats: ['qr_code'] });
      const video = document.getElementById('video');
      video.style.display = 'block';
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }});
      video.srcObject = stream;
      await video.play();

      // continuous scan
      const scanLoop = async ()=>{
        try{
          const barcodes = await detector.detect(video);
          if(barcodes.length){
            const data = barcodes[0].rawValue || barcodes[0].rawData;
            stopStream(stream);
            video.style.display = 'none';
            handleScannedData(data);
            return;
          }
        }catch(e){
          // detection errors — ignore
        }
        requestAnimationFrame(scanLoop);
      };
      scanLoop();
    }catch(err){
      alert('Camera access denied or not available. You can open the menu by visiting this page on your phone.');
    }
  } else {
    // Fallback: prompt user to upload a QR image (decode not implemented here)
    // Best fallback: instruct user to use phone camera — most phones open the link directly when QR scanned.
    alert('QR native scan is not supported in this browser. For best results: open this page on your phone and let your camera scan the QR code. Alternatively, upload a QR image with a dedicated QR app.');
  }
}
function stopStream(stream){
  stream.getTracks().forEach(t=>t.stop());
}
function handleScannedData(data){
  // If QR contains URL to this menu, show success; otherwise open link
  try{
    const url = new URL(data);
    // if same origin, do nothing; otherwise navigate
    if(url.origin === location.origin){
      showToast('Menu opened — welcome to SH Foods');
    } else {
      // redirect to scanned URL
      location.href = data;
    }
  }catch(e){
    showToast('Scanned: ' + data);
  }
}
scanBtn.addEventListener('click', startQRScan);

/* initial render */
renderAll();
