/* AK COLLECTION — CMS bridge */
(function () {
  function getText(url) { try { var x = new XMLHttpRequest(); x.open('GET', url, false); x.send(null); return x.status >= 200 && x.status < 300 ? x.responseText : null; } catch (e) { return null; } }
  function hashId(s) { var h = 0; for (var i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0; return Math.abs(h) || 1; }
  function normalizeImage(path) { if (!path) return ''; if (/^(https?:)?\/\//.test(path)) return path; return path.indexOf('media/') === 0 ? '/' + path : path; }
  var products = [];
  var listing = getText('https://api.github.com/repos/akcollection/akcollection.github.io/contents/data/products?ref=main');
  if (listing) { try { JSON.parse(listing).filter(function (f) { return /\.json$/i.test(f.name); }).forEach(function (f) { var raw = getText('data/products/' + f.name); if (!raw) return; try { var p = JSON.parse(raw); if (p.active === false) return; products.push({ id: hashId(f.name), name: p.name || f.name.replace(/\.json$/i, ''), type: p.category || 'Watches', price: Number(p.price) || 0, image: normalizeImage(p.image), description: p.description || '' }); } catch (e) {} }); } catch (e) {} }
  if (products.length) window.__AK_PRODUCTS__ = products;
  var siteRaw = getText('data/site.json'); if (siteRaw) { try { window.__AK_SITE__ = JSON.parse(siteRaw); } catch (e) {} }
  var categoriesRaw = getText('data/categories.json'); if (categoriesRaw) { try { window.__AK_CATEGORIES__ = JSON.parse(categoriesRaw); } catch (e) {} }
  function renderCategories() {
    var grid = document.getElementById('categoryGrid'), cats = window.__AK_CATEGORIES__ || [];
    if (!grid) return;
    grid.innerHTML = cats.map(function (c) { return '<a class="category-card" href="' + (c.link || '#collection') + '"><div class="category-image"><img src="' + normalizeImage(c.image) + '" alt="' + (c.name || '') + '"></div><div class="category-card-name">' + (c.label || c.name || '') + '</div><span>SHOP NOW →</span></a>'; }).join('');
  }
  function applySite() { var s = window.__AK_SITE__; if (!s) return; var q = function (sel) { return document.querySelector(sel); }, set = function (sel, value) { var el = q(sel); if (el && value != null) el.textContent = value; }; set('.announcement-bar span', s.announcement); var ship = q('.shipping-bar'); if (ship && s.shipping) ship.textContent = s.shipping; set('.hero-copy > span', s.hero_label); set('.hero-copy h1', s.hero_title); var he = q('.hero-copy h1 em'); if (he) he.textContent = s.hero_emphasis || ''; set('.hero-copy p', s.hero_text); set('.hero-shop-btn', s.hero_button); set('.about > span', s.about_label); set('.about h2', s.about_title); var ae = q('.about h2 em'); if (ae) ae.textContent = s.about_emphasis || ''; set('.about p', s.about_text); set('.contact span', s.contact_label); set('.contact h2', s.contact_title); set('.contact p', s.contact_text); }
  var filters = document.querySelector('.filters'); if (filters) filters.innerHTML = ['All','Watches','Bracelets','Wallets','Caps'].map(function (c, i) { return '<button class="filter' + (i === 0 ? ' active' : '') + '" data-filter="' + c + '">' + c.toUpperCase() + '</button>'; }).join('');
  var scriptRaw = getText('script.js'); if (!scriptRaw) return; scriptRaw = scriptRaw.replace('const products = [', 'const products = window.__AK_PRODUCTS__ || ['); var s = document.createElement('script'); s.text = scriptRaw; document.body.appendChild(s); renderCategories(); applySite();
})();
