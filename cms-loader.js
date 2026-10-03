/* AK COLLECTION CMS runtime */
(function(){
  function getText(url){
    try{var x=new XMLHttpRequest();x.open('GET',url,false);x.send(null);return x.status>=200&&x.status<300?x.responseText:null}catch(e){return null}
  }
  function img(p){
    if(!p)return '';
    if(p.indexOf('http://')===0||p.indexOf('https://')===0||p.indexOf('//')===0)return p;
    return p.charAt(0)==='/'?p:'/'+p;
  }
  function safe(v){return String(v==null?'':v).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  var site={},theme={},cats=[],products=[];
  var raw=getText('data/site.json'); if(raw)try{site=JSON.parse(raw)}catch(e){}
  raw=getText('data/theme.json'); if(raw)try{theme=JSON.parse(raw)}catch(e){}
  raw=getText('data/categories.json'); if(raw)try{cats=JSON.parse(raw)}catch(e){}
  window.__AK_SITE__=site;window.__AK_CATEGORIES__=cats;window.__AK_THEME__=theme;

  function setText(sel,v){var e=document.querySelector(sel);if(e&&v!=null)e.textContent=v}
  function applyContent(){
    setText('.announcement-bar span',site.announcement||'100% QUALITY CHECKED GUARANTEE');
    var ship=document.querySelector('.shipping-bar');
    if(ship)ship.innerHTML=(site.shipping||'FREE DELIVERY ON ALL ORDERS • PREMIUM WATCH COLLECTION • 24/7 CUSTOMER SUPPORT').split('•').map(function(x){return '<span>'+safe(x.trim())+'</span>'}).join('<span>•</span>');
    setText('.hero-copy > span',site.hero_label||'AK COLLECTION');
    var h=document.querySelector('.hero-copy h1');if(h){h.textContent=site.hero_title||'TIMELESS';var em=document.createElement('em');em.textContent=site.hero_emphasis||'WATCHES';h.appendChild(em)}
    setText('.hero-copy p',site.hero_text||'Premium designs made to complete your presence');setText('.hero-shop-btn',site.hero_button||'SHOP COLLECTION');
    var pairs=[['.category-heading span',site.category_label],['.collection-header>div:first-child>span',site.collection_label],['.collection-header h2',site.collection_title],['.about>span',site.about_label],['.about p',site.about_text],['.contact span',site.contact_label],['.contact h2',site.contact_title],['.contact p',site.contact_text],['.contact-btn',site.contact_button],['.footer-logo strong',site.footer_brand],['.footer-logo span',site.footer_subtitle],['footer p',site.footer_copyright]];
    pairs.forEach(function(a){if(a[1])setText(a[0],a[1])});
    var ch=document.querySelector('.category-heading h2');if(ch){ch.textContent=site.category_title||'SHOP BY ';var ce=document.createElement('em');ce.textContent=site.category_emphasis||'CATEGORY';ch.appendChild(ce)}
    var ah=document.querySelector('.about h2');if(ah){ah.textContent=site.about_title||'YOUR TIME. ';var ae=document.createElement('em');ae.textContent=site.about_emphasis||'YOUR STYLE.';ah.appendChild(ae)}
    if(site.browser_title)document.title=site.browser_title;
    var md=document.querySelector('meta[name="description"]');if(md&&site.browser_description)md.content=site.browser_description;
    [['.trust-bar',site.show_trust],['.category-showcase',site.show_categories],['.collection',site.show_collection],['.about',site.show_about],['.contact',site.show_contact]].forEach(function(a){var e=document.querySelector(a[0]);if(e)e.style.display=a[1]===false?'none':''});
  }
  function renderCategories(){
    var g=document.getElementById('categoryGrid');if(!g)return;
    g.innerHTML=cats.slice(0,4).map(function(c){
      return '<a class="category-card" href="'+safe(c.link||'#collection')+'"><div class="category-image">'+(c.image?'<img src="'+img(c.image)+'" alt="'+safe(c.name||c.label||'')+'">':'')+'</div><div class="category-card-name">'+safe(c.label||c.name||'CATEGORY')+'</div><span>'+safe(c.button||site.category_button||'SHOP NOW →')+'</span></a>';
    }).join('');
  }
  function applyTheme(){
    var t=theme,root=document.documentElement,n=function(v,d){var z=Number(v);return isFinite(z)?z:d};
    var css=':root{--ak-page-bg:'+(t.page_background||'#f5f5f3')+';--ak-text:'+(t.text_color||'#191919')+';--ak-accent:'+(t.accent_color||'#191919')+'}';
    css+='body{background:var(--ak-page-bg)!important;color:var(--ak-text)!important}';
    css+='.category-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:'+n(t.category_gap,18)+'px!important}';
    css+='.category-image{height:'+n(t.category_desktop_height,280)+'px!important}.category-image img{width:100%;height:100%;object-fit:cover}';
    css+='@media(max-width:699px){.category-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}.category-image{height:'+n(t.category_mobile_height,165)+'px!important}}';
    if(t.hero_desktop_height)css+='.luxury-hero{min-height:'+n(t.hero_desktop_height,720)+'px!important}';
    if(t.hero_title_desktop_size)css+='.hero-copy h1{font-size:'+n(t.hero_title_desktop_size,94)+'px!important}';
    if(t.header_height_desktop)css+='.header-main{height:'+n(t.header_height_desktop,70)+'px!important}';
    if(t.product_columns_desktop)css+='.products-grid{grid-template-columns:repeat('+n(t.product_columns_desktop,4)+',1fr)!important}';
    if(t.category_columns_desktop)css+='.category-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}';
    if(t.header_background)css+='.main-header{background:'+t.header_background+'!important}';
    if(t.header_text_color)css+='.main-header{color:'+t.header_text_color+'!important}';
    var old=document.getElementById('ak-visual-theme');if(old)old.remove();var st=document.createElement('style');st.id='ak-visual-theme';st.textContent=css;document.head.appendChild(st);
    if(t.logo)document.querySelectorAll('.header-logo img,.mobile-menu-logo,.footer-logo img').forEach(function(e){e.src=img(t.logo)});
    if(t.hero_background)root.style.setProperty('--ak-hero-bg','url("'+img(t.hero_background)+'")');
    var acc=document.querySelector('.hero-accessories');if(acc&&t.hero_accessories)acc.src=img(t.hero_accessories);
  }
  renderCategories();applyContent();applyTheme();
  var rawScript=getText('script.js');
  if(rawScript){
    rawScript=rawScript.replace('const products = [','const products = window.__AK_PRODUCTS__ || [');
    var s=document.createElement('script');s.text=rawScript;document.body.appendChild(s);
  }
})();