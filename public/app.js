(function(){
'use strict';

/* ---------- constants ---------- */
const KEY='kas-saku.v1', HKEY='kas-saku.hide', IKEY='kas-saku.inst-hide';
const MONTHS=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const MON3=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const DAYS=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const CATS_OUT=[
  {k:'makan',n:'Makan & Minum',i:'cup',c:1,t:'out'},
  {k:'transport',n:'Transportasi',i:'car',c:2,t:'out'},
  {k:'belanja',n:'Belanja',i:'bag',c:3,t:'out'},
  {k:'tagihan',n:'Tagihan',i:'bolt',c:4,t:'out'},
  {k:'hiburan',n:'Hiburan',i:'play',c:5,t:'out'},
  {k:'kesehatan',n:'Kesehatan',i:'plus',c:6,t:'out'},
  {k:'pendidikan',n:'Pendidikan',i:'book',c:7,t:'out'},
  {k:'lain_out',n:'Lainnya',i:'dots',c:8,t:'out'}
];
const CATS_IN=[
  {k:'gaji',n:'Gaji',i:'cash',c:3,t:'in'},
  {k:'bonus',n:'Bonus',i:'star',c:5,t:'in'},
  {k:'usaha',n:'Usaha',i:'brief',c:1,t:'in'},
  {k:'hadiah',n:'Hadiah',i:'gift',c:4,t:'in'},
  {k:'lain_in',n:'Lainnya',i:'dots',c:8,t:'in'}
];
const CAT={}; CATS_OUT.concat(CATS_IN).forEach(c=>{CAT[c.k]=c;});
const WALLETS=[
  {k:'tunai',n:'Tunai',g:'Tunai'},
  {k:'bri',n:'BRI',g:'Bank'},{k:'btn',n:'BTN',g:'Bank'},{k:'bca',n:'BCA',g:'Bank'},
  {k:'spay',n:'ShopeePay',g:'E-Wallet'},{k:'dana',n:'DANA',g:'E-Wallet'},{k:'gopay',n:'GoPay',g:'E-Wallet'}
];
const W={}; WALLETS.forEach(w=>{W[w.k]=w.n;});
const WM={
  tunai:{bg:'var(--accent)',fg:'var(--on-accent)',t:''},
  bri:{bg:'#0B5CBE',fg:'#FFFFFF',t:'BRI'}, btn:{bg:'#F2A900',fg:'#2B1E00',t:'BTN'}, bca:{bg:'#0A66C2',fg:'#FFFFFF',t:'BCA'},
  spay:{bg:'#EE4D2D',fg:'#FFFFFF',t:'SP'}, dana:{bg:'#118EEA',fg:'#FFFFFF',t:'DANA'}, gopay:{bg:'#00A86B',fg:'#FFFFFF',t:'GP'}
};
const LEG={bank:'bca',ewallet:'gopay'};
const wk=k=>W[k]?k:(LEG[k]||'tunai');
const zeroOpen=()=>{const o={};WALLETS.forEach(w=>{o[w.k]=0;});return o;};
const normOpen=s=>{const o=zeroOpen();Object.keys(s||{}).forEach(k=>{const t=W[k]?k:LEG[k];if(t)o[t]+=Number(s[k])||0;});return o;};

const PATHS={
  cup:'M5 8h12v6a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8z M17 10h2a2 2 0 0 1 0 4h-2 M8 3v2 M12 3v2',
  car:'M5 16V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8 M3 16h18v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2z M8 13h.01 M16 13h.01',
  bag:'M6 7h12l1 13H5L6 7z M9 7a3 3 0 0 1 6 0',
  bolt:'M13 3L5 14h6l-1 7 8-11h-6l1-7z',
  play:'M5 4h14v16H5z M10 9l5 3-5 3V9z',
  plus:'M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z',
  book:'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z M8 7h7',
  dots:'M5 12h.01 M12 12h.01 M19 12h.01',
  cash:'M3 7h18v10H3z M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  star:'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z',
  brief:'M4 8h16v11H4z M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2',
  gift:'M4 11h16v9H4z M3 7.5h18V11H3z M12 7.5V20 M12 7.5C10.5 4 7.5 4.5 8.5 6.5c.5 1 2 1 3.5 1 M12 7.5c1.5-3.5 4.5-3 3.5-1-.5 1-2 1-3.5 1',
  home:'M3 11l9-8 9 8 M5 10v10h14V10 M10 20v-6h4v6',
  list:'M8 6h13 M8 12h13 M8 18h13 M3.5 6h.01 M3.5 12h.01 M3.5 18h.01',
  chart:'M5 20V11 M12 20V4 M19 20v-6',
  sliders:'M4 7h10 M18 7h2 M4 17h2 M10 17h10 M16 4v6 M8 14v6',
  add:'M12 5v14 M5 12h14',
  chevL:'M15 5l-7 7 7 7',
  chevR:'M9 5l7 7-7 7',
  search:'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20 20l-4-4',
  close:'M6 6l12 12 M18 6L6 18',
  down:'M12 5v14 M6 13l6 6 6-6',
  up:'M12 19V5 M6 11l6-6 6 6',
  eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeoff:'M3 3l18 18 M10.6 5.1A9.7 9.7 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 4 M6.6 6.6A17 17 0 0 0 2 12s4 7 10 7a9.6 9.6 0 0 0 4-.9 M9.9 9.9a3 3 0 0 0 4.2 4.2',
  note:'M6 3h9l4 4v14H6z M14 3v5h5 M9 13h7 M9 17h5',
  share:'M12 3v12 M8 7l4-4 4 4 M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7',
  phone:'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01'
};
const icon=(n,s)=>'<svg viewBox="0 0 24 24" width="'+(s||20)+'" height="'+(s||20)+'" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+PATHS[n]+'"/></svg>';
const badge=k=>{const m=WM[k]||WM.tunai;return '<span class="wb" style="background:'+m.bg+';color:'+m.fg+'">'+(m.t?m.t:icon('cash',16))+'</span>';};
const GUIL=(function(){
  let g=''; for(let i=0;i<30;i++) g+='<ellipse cx="150" cy="150" rx="116" ry="38" transform="rotate('+(i*6)+' 150 150)"/>';
  for(let r=24;r<=132;r+=36) g+='<circle cx="150" cy="150" r="'+r+'"/>';
  return '<svg class="guil" viewBox="0 0 300 300" fill="none" stroke="currentColor" stroke-width=".7" aria-hidden="true">'+g+'</svg>';
})();

/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtN=new Intl.NumberFormat('id-ID',{maximumFractionDigits:0});
const rp=n=>'Rp\u00a0'+fmtN.format(Math.round(Math.abs(n)));
const pad=n=>String(n).padStart(2,'0');
const ymd=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const today=()=>ymd(new Date());
const curMonth=()=>today().slice(0,7);
const uid=()=>Math.random().toString(36).slice(2,9)+Date.now().toString(36);
const trimZero=s=>s.replace(/\.0$/,'').replace('.',',');
function compact(n){
  const a=Math.abs(n);
  if(a>=1e9) return trimZero((n/1e9).toFixed(1))+' M';
  if(a>=1e6) return trimZero((n/1e6).toFixed(1))+' jt';
  if(a>=1e3) return Math.round(n/1e3)+' rb';
  return String(Math.round(n));
}
function niceMax(v){
  if(v<=0) return 0;
  const p=Math.pow(10,Math.floor(Math.log10(v))), f=v/p;
  return (f<=1?1:f<=2?2:f<=4?4:f<=5?5:10)*p;
}
const catOf=t=>CAT[t.cat]||{k:'x',n:'Lainnya',i:'dots',c:8,t:t.type};
const cmp=(a,b)=>a.date<b.date?1:a.date>b.date?-1:(b.ts||0)-(a.ts||0);
const sums=list=>{let i=0,o=0;list.forEach(t=>{if(t.type==='in')i+=t.amt;else o+=t.amt;});return {i,o};};
const getAmt=el=>Number((el.value||'').replace(/\D/g,''))||0;
const greet=()=>{const h=new Date().getHours();return h<11?'Selamat pagi':h<15?'Selamat siang':h<18?'Selamat sore':'Selamat malam';};

/* ---------- PWA & platform detection ---------- */
const isStandalone=()=>
  (window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||
  window.navigator.standalone===true;
const isIOS=()=>{
  const ua=window.navigator.userAgent||'';
  return /iPhone|iPad|iPod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
};
let deferredInstallPrompt=null;
let installDismissed=false;
try{ installDismissed=localStorage.getItem(IKEY)==='1'; }catch(e){}

/* ---------- state + storage ---------- */
const S={tx:[],settings:{opening:zeroOpen(),budget:0,demo:false},
  ui:{tab:'home',month:curMonth(),filter:'all',q:'',stype:'out',confirm:'',imp:null,hide:false,counted:false}};
let mem=null, storageOK=true, DL=null, lastDel=null, lastWallet='tunai';

function loadStored(){
  try{ const r=localStorage.getItem(KEY); if(r) return JSON.parse(r); }catch(e){ storageOK=false; }
  return mem;
}
function persist(){
  const payload={tx:S.tx,settings:S.settings};
  mem=payload;
  try{ localStorage.setItem(KEY,JSON.stringify(payload)); }catch(e){ storageOK=false; }
}

function demoData(){
  const out=[]; let n=0, seed=7;
  const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  const pick=a=>a[Math.floor(rnd()*a.length)];
  const now=new Date();
  const add=(d,type,amt,cat,note,wallet)=>{out.push({id:'d'+(++n),ts:1000+n,type,amt,cat,note,date:ymd(d),wallet,demo:true});};
  for(let off=5;off>=0;off--){
    const base=new Date(now.getFullYear(),now.getMonth()-off,1);
    const last=new Date(base.getFullYear(),base.getMonth()+1,0).getDate();
    const maxDay=off===0?now.getDate():last;
    const D=d=>new Date(base.getFullYear(),base.getMonth(),Math.min(d,maxDay));
    add(D(1),'in',8500000,'gaji','Gaji bulanan','bca');
    if(off%2===1&&maxDay>=15) add(D(15),'in',1500000+Math.round(rnd()*10)*100000,'usaha','Proyek freelance','bri');
    if(maxDay>=2) add(D(2),'out',1800000,'tagihan','Sewa kos','bca');
    if(maxDay>=5) add(D(5),'out',450000,'tagihan','Listrik dan internet','dana');
    for(let d=1;d<=maxDay;d++){
      if(rnd()<.7) add(D(d),'out',Math.round((18000+rnd()*42000)/1000)*1000,'makan',pick(['Makan siang','Kopi','Sarapan','Makan malam']),'tunai');
      if(rnd()<.3) add(D(d),'out',Math.round((10000+rnd()*40000)/1000)*1000,'transport',pick(['Ojek online','Bensin','Parkir']),'gopay');
      if(rnd()<.08) add(D(d),'out',Math.round((80000+rnd()*320000)/10000)*10000,'belanja',pick(['Belanja bulanan','Pakaian','Perlengkapan rumah']),'spay');
      if(rnd()<.05) add(D(d),'out',Math.round((50000+rnd()*100000)/10000)*10000,'hiburan',pick(['Nonton bioskop','Langganan streaming']),'btn');
    }
  }
  return out;
}

(function init(){
  const st=loadStored();
  if(st&&Array.isArray(st.tx)){
    S.tx=st.tx;
    S.tx.forEach(t=>{t.wallet=wk(t.wallet);});
    const s=st.settings||{};
    S.settings={opening:normOpen(s.opening),budget:Number(s.budget)||0,demo:!!s.demo};
    persist();
  }else{
    S.tx=demoData();
    S.settings={opening:Object.assign(zeroOpen(),{tunai:5500000,bri:5000000,btn:3200000,bca:6000000,spay:3500000,dana:3200000,gopay:2200000}),budget:5000000,demo:true};
    persist();
  }
  try{ S.ui.hide=localStorage.getItem(HKEY)==='1'; }catch(e){}
})();

/* ---------- derived ---------- */
const monthTx=k=>S.tx.filter(t=>t.date.startsWith(k));
const walletBal=k=>{const s=sums(S.tx.filter(t=>t.wallet===k));return (S.settings.opening[k]||0)+s.i-s.o;};
const totalBal=()=>WALLETS.reduce((a,w)=>a+walletBal(w.k),0);
const monthParts=k=>k.split('-').map(Number);
const signed=n=>(n<0?'−':'')+rp(n);
const hid=s=>S.ui.hide?'Rp\u00a0••••••':s;

function dateLabel(s){
  if(s===today()) return 'Hari ini';
  const y=new Date(); y.setDate(y.getDate()-1);
  if(s===ymd(y)) return 'Kemarin';
  const p=s.split('-').map(Number), d=new Date(p[0],p[1]-1,p[2]);
  return DAYS[d.getDay()]+', '+p[2]+' '+MON3[p[1]-1];
}

/* ---------- views ---------- */
function head(title,sub,withMonth){
  const p=monthParts(S.ui.month);
  const mp=withMonth?'<div class="mpill"><button data-act="mprev" aria-label="Bulan sebelumnya">'+icon('chevL',18)+'</button><span>'+MON3[p[1]-1]+' '+p[0]+'</span><button data-act="mnext" aria-label="Bulan berikutnya">'+icon('chevR',18)+'</button></div>':'';
  return '<header class="top"><div>'+(sub?'<p class="hi">'+esc(sub)+'</p>':'')+'<h1>'+esc(title)+'</h1></div>'+mp+'</header>';
}
function installBanner(inSettings){
  if(isStandalone()) return '';
  if(!inSettings&&installDismissed) return '';
  const ios=isIOS();
  if(!ios&&!deferredInstallPrompt&&!inSettings) return '';
  const title=ios?'Pasang di iPhone / iPad':'Pasang Aplikasi';
  const sub=ios?'Simpan ke Layar Utama Safari agar bisa dibuka offline seperti aplikasi.'
    :(deferredInstallPrompt?'Pasang Kas Saku ke layar utama perangkat untuk akses cepat.':'Buka di Safari iOS lalu pilih Bagikan → Tambah ke Layar Utama.');
  const btnAct=deferredInstallPrompt?'inst-prompt':'inst-guide';
  const btnLabel=deferredInstallPrompt?'Pasang':'Cara pasang';
  return '<div class="inst-card"><div class="inst-info"><span class="inst-ic">'+icon('phone',20)+'</span><div class="inst-txt"><b>'+title+'</b><span>'+sub+'</span></div></div><div class="inst-act"><button class="btn primary sm" data-act="'+btnAct+'">'+btnLabel+'</button>'+
    (!inSettings?'<button class="icon-btn" data-act="inst-dismiss" aria-label="Tutup saran pasang" style="width:34px;height:34px">'+icon('close',16)+'</button>':'')+'</div></div>';
}
function notices(){
  let h='';
  if(!storageOK) h+='<p class="notice">Penyimpanan di perangkat ini tidak tersedia, jadi catatan hilang saat halaman ditutup.</p>';
  if(S.tx.some(t=>t.demo)) h+='<p class="notice">Data yang tampil adalah contoh. <button class="link" data-act="rm-demo">Hapus data contoh</button> untuk mulai dari nol.</p>';
  return h;
}
function row(t){
  const c=catOf(t);
  return '<button class="row" data-act="edit" data-id="'+esc(t.id)+'">'+
    '<span class="ico c'+c.c+'">'+icon(c.i,20)+'</span>'+
    '<span class="rmain"><span class="rt">'+esc(t.note||c.n)+'</span><span class="rs">'+esc(c.n)+' · '+esc(W[t.wallet]||'Tunai')+'</span></span>'+
    '<span class="amt num '+t.type+'">'+(t.type==='in'?'+':'−')+rp(t.amt)+'</span></button>';
}
function ring(p){
  const R=36, C=2*Math.PI*R, f=Math.min(1,p);
  return '<svg class="ring" viewBox="0 0 88 88" role="img" aria-label="'+Math.round(p*100)+' persen anggaran terpakai"><circle cx="44" cy="44" r="'+R+'" fill="none" stroke-width="10" style="stroke:var(--surface2)"/>'+
    '<circle class="rg" cx="44" cy="44" r="'+R+'" fill="none" stroke-width="10" stroke-linecap="round" stroke-dasharray="'+(f*C).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 44 44)"/>'+
    '<text x="44" y="50" text-anchor="middle" class="rt-t">'+Math.round(p*100)+'%</text></svg>';
}
function emptyBox(msg){return '<div class="card empty"><span class="empty-ic">'+icon('note',24)+'</span><span>'+msg+'</span></div>';}

function vHome(){
  const mk=S.ui.month, s=sums(monthTx(mk)), budget=S.settings.budget, bal=totalBal(), p=monthParts(mk), m3=MON3[p[1]-1];
  let bud;
  if(budget>0){
    const pct=s.o/budget, cls=pct>=1?'over':pct>=.8?'warn':'';
    let hint='';
    if(mk===curMonth()&&s.o<budget){
      const last=new Date(p[0],p[1],0).getDate(), left=last-new Date().getDate()+1;
      hint='<span class="s h">Sekitar <b class="num">'+rp((budget-s.o)/left)+'</b> per hari sampai akhir bulan</span>';
    }
    bud='<div class="card bud '+cls+'">'+ring(pct)+'<div class="bud-r"><span class="l">'+(s.o>budget?'Melebihi anggaran':'Sisa anggaran')+'</span>'+
      '<b class="v '+(s.o>budget?'out':'')+'">'+rp(budget-s.o)+'</b><span class="s">dari '+rp(budget)+' · terpakai '+rp(s.o)+'</span>'+hint+'</div></div>';
  }else{
    bud='<div class="card empty"><span class="hint">Tetapkan batas pengeluaran per bulan supaya sisa uangmu terlihat jelas.</span><button class="btn ghost" data-act="tab" data-tab="settings">Atur anggaran</button></div>';
  }
  const wl='<div class="wscroll">'+WALLETS.map(w=>{const b=walletBal(w.k);
    return '<div class="wcard"><div class="wn">'+badge(w.k)+'<span>'+w.n+'</span></div><b>'+hid(signed(b))+'</b></div>';}).join('')+'</div>';
  const recent=S.tx.slice().sort(cmp).slice(0,5);
  const rec=recent.length?'<div class="card list">'+recent.map(row).join('')+'</div>':emptyBox('Belum ada transaksi. Ketuk tombol + untuk mencatat yang pertama.');
  return head('Kas Saku',greet(),true)+notices()+installBanner(false)+
    '<section class="hero">'+GUIL+
    '<div class="hero-top"><span class="lbl">Saldo total</span><button class="eye" data-act="hide" aria-label="'+(S.ui.hide?'Tampilkan saldo':'Sembunyikan saldo')+'">'+icon(S.ui.hide?'eyeoff':'eye',20)+'</button></div>'+
    '<div class="big" data-count="'+bal+'">'+hid(signed(bal))+'</div>'+
    '<div class="hero-row"><div class="hpill hi"><small>'+icon('down',14)+'Pemasukan '+m3+'</small><b class="num">'+hid(rp(s.i))+'</b></div>'+
    '<div class="hpill ho"><small>'+icon('up',14)+'Pengeluaran '+m3+'</small><b class="num">'+hid(rp(s.o))+'</b></div></div></section>'+
    '<h2 class="sec">Anggaran</h2>'+bud+
    '<h2 class="sec">Dompet</h2>'+wl+
    '<h2 class="sec"><span>6 Bulan Terakhir</span><button class="link" data-act="tab" data-tab="stats">Statistik</button></h2>'+
    '<div class="card d3-card" id="home-d3-card"></div>'+
    '<h2 class="sec"><span>Terbaru</span><button class="link" data-act="tab" data-tab="history">Lihat semua</button></h2>'+rec;
}

function filtered(){
  let list=monthTx(S.ui.month);
  if(S.ui.filter!=='all') list=list.filter(t=>t.type===S.ui.filter);
  const q=S.ui.q.trim().toLowerCase();
  if(q) list=list.filter(t=>(t.note||'').toLowerCase().includes(q)||catOf(t).n.toLowerCase().includes(q));
  return list;
}
function historyList(){
  const list=filtered().sort(cmp);
  if(!list.length) return '<div style="margin-top:14px">'+emptyBox(S.ui.q?'Tidak ada transaksi yang cocok.':'Belum ada transaksi di bulan ini.')+'</div>';
  const s=sums(list), m=new Map();
  list.forEach(t=>{if(!m.has(t.date))m.set(t.date,[]);m.get(t.date).push(t);});
  let h='<div class="sumline"><span>Masuk <b class="in num">'+rp(s.i)+'</b></span><span>Keluar <b class="out num">'+rp(s.o)+'</b></span></div>';
  m.forEach((items,d)=>{
    const x=sums(items), n=x.i-x.o;
    h+='<div class="gh"><span>'+dateLabel(d)+'</span><span class="num">'+(n>=0?'+':'−')+rp(n)+'</span></div><div class="card list">'+items.map(row).join('')+'</div>';
  });
  return h;
}
function vHistory(){
  const f=S.ui.filter;
  const seg=[['all','Semua'],['out','Keluar'],['in','Masuk']].map(a=>'<button data-act="filter" data-v="'+a[0]+'" class="'+(f===a[0]?'on':'')+'">'+a[1]+'</button>').join('');
  return head('Riwayat','',true)+'<div class="seg">'+seg+'</div>'+
    '<div class="search">'+icon('search',18)+'<input id="q" type="search" placeholder="Cari catatan atau kategori" value="'+esc(S.ui.q)+'" autocomplete="off" aria-label="Cari transaksi"></div>'+
    '<div id="hlist">'+historyList()+'</div>';
}

function donut(items,total){
  const R=70, C=2*Math.PI*R, gap=items.length>1?2:0;
  let off=0, segs='';
  items.forEach(it=>{
    const len=(it.v/total)*C, vis=Math.max(0,len-gap);
    segs+='<circle cx="100" cy="100" r="'+R+'" fill="none" stroke-width="26" style="stroke:var(--c'+it.cat.c+')" stroke-dasharray="'+vis.toFixed(2)+' '+(C-vis).toFixed(2)+'" stroke-dashoffset="'+(-off).toFixed(2)+'" transform="rotate(-90 100 100)"/>';
    off+=len;
  });
  return '<svg class="donut" viewBox="0 0 200 200" role="img" aria-label="Rincian per kategori"><circle cx="100" cy="100" r="'+R+'" fill="none" stroke-width="26" style="stroke:var(--surface2)"/>'+segs+
    '<text x="100" y="95" text-anchor="middle" class="dn-l">Total</text><text x="100" y="117" text-anchor="middle" class="dn-v">Rp '+compact(total)+'</text></svg>';
}
function trendChart(){
  const p=monthParts(S.ui.month), arr=[];
  for(let i=5;i>=0;i--){
    const d=new Date(p[0],p[1]-1-i,1), key=d.getFullYear()+'-'+pad(d.getMonth()+1), s=sums(monthTx(key));
    arr.push({key:key,lab:MON3[d.getMonth()],i:s.i,o:s.o});
  }
  const mx=niceMax(Math.max.apply(null,arr.map(a=>Math.max(a.i,a.o))));
  if(!mx) return '<div class="empty">Belum ada data untuk enam bulan terakhir.</div>';
  const Wd=360,H=200,L=42,B=24,T=10,R=6, iw=Wd-L-R, ih=H-T-B, gw=iw/6, bw=Math.min(16,gw/2-4);
  const y=v=>T+ih-(v/mx)*ih;
  let g='';
  [0,.5,1].forEach(f=>{
    const v=mx*f;
    g+='<line x1="'+L+'" x2="'+(Wd-R)+'" y1="'+y(v).toFixed(1)+'" y2="'+y(v).toFixed(1)+'"/><text x="'+(L-6)+'" y="'+(y(v)+3).toFixed(1)+'" text-anchor="end">'+compact(v)+'</text>';
  });
  arr.forEach((a,idx)=>{
    const cx=L+gw*idx+gw/2, hi=(a.i/mx)*ih, ho=(a.o/mx)*ih;
    g+='<rect x="'+(cx-bw-1).toFixed(1)+'" y="'+(T+ih-hi).toFixed(1)+'" width="'+bw+'" height="'+hi.toFixed(1)+'" rx="4" style="fill:var(--in)"/>'+
       '<rect x="'+(cx+1).toFixed(1)+'" y="'+(T+ih-ho).toFixed(1)+'" width="'+bw+'" height="'+ho.toFixed(1)+'" rx="4" style="fill:var(--out)"/>'+
       '<text x="'+cx.toFixed(1)+'" y="'+(H-8)+'" text-anchor="middle" class="'+(a.key===S.ui.month?'cur':'')+'">'+a.lab+'</text>';
  });
  return '<svg class="chart" viewBox="0 0 '+Wd+' '+H+'" role="img" aria-label="Pemasukan dan pengeluaran enam bulan terakhir">'+g+'</svg>'+
    '<div class="legend"><span><i style="background:var(--in)"></i>Pemasukan</span><span><i style="background:var(--out)"></i>Pengeluaran</span></div>';
}
function vStats(){
  const mk=S.ui.month, type=S.ui.stype, all=monthTx(mk), s=sums(all);
  const mt=all.filter(t=>t.type===type), total=mt.reduce((a,t)=>a+t.amt,0), by={};
  mt.forEach(t=>{by[t.cat]=(by[t.cat]||0)+t.amt;});
  const items=Object.keys(by).map(k=>({cat:CAT[k]||{k:k,n:'Lainnya',i:'dots',c:8},v:by[k]})).sort((a,b)=>b.v-a.v);
  const seg='<div class="seg"><button data-act="stype" data-v="out" class="t-out '+(type==='out'?'on':'')+'">Pengeluaran</button><button data-act="stype" data-v="in" class="t-in '+(type==='in'?'on':'')+'">Pemasukan</button></div>';
  let body;
  if(!total){
    body=emptyBox('Belum ada '+(type==='out'?'pengeluaran':'pemasukan')+' di bulan ini.');
  }else{
    const list=items.map(it=>{
      const pc=it.v/total*100;
      return '<div class="crow c'+it.cat.c+'"><div class="crow-top"><span class="sw"></span><span class="cn">'+esc(it.cat.n)+'</span><span class="cp">'+Math.round(pc)+'%</span><span class="cv num">'+rp(it.v)+'</span></div><div class="cbar"><i style="width:'+pc.toFixed(1)+'%"></i></div></div>';
    }).join('');
    const biggest=mt.slice().sort((a,b)=>b.amt-a.amt)[0];
    let extra='<div class="kv"><span>Transaksi terbesar</span><b>'+esc(biggest.note||catOf(biggest).n)+' · <span class="num">'+rp(biggest.amt)+'</span></b></div>';
    if(type==='out'){
      const p=monthParts(mk), last=new Date(p[0],p[1],0).getDate(), days=mk===curMonth()?new Date().getDate():last;
      extra='<div class="kv"><span>Rata-rata per hari</span><b class="num">'+rp(total/days)+'</b></div>'+extra;
    }
    body='<div class="card"><div class="donut-wrap">'+donut(items,total)+'</div>'+list+'</div><div class="card list" style="margin-top:12px">'+extra+'</div>';
  }
  const net=s.i-s.o;
  return head('Statistik','',true)+
    '<div class="card list" style="margin-bottom:12px"><div class="kv"><span>Selisih bulan ini</span><b class="disp '+(net>=0?'in':'out')+'">'+(net>=0?'+':'−')+rp(net)+'</b></div></div>'+
    seg+'<div style="height:12px"></div>'+body+
    '<h2 class="sec">Enam bulan terakhir</h2><div class="card">'+trendChart()+'</div>';
}

function vSettings(){
  const st=S.settings, c=S.ui.confirm;
  const opens=WALLETS.map(w=>'<label class="frow"><span class="wn">'+badge(w.k)+w.n+'</span><span class="mi"><i>Rp</i><input class="money" inputmode="numeric" data-set="open-'+w.k+'" value="'+fmtN.format(st.opening[w.k]||0)+'" aria-label="Saldo awal '+w.n+'"></span></label>').join('');
  let data='<div class="btn-row"><button class="btn ghost" data-act="exp-csv">Ekspor CSV</button><button class="btn ghost" data-act="exp-json">Simpan cadangan</button></div>';
  data+='<button class="btn ghost block" data-act="imp-pick">Pulihkan dari cadangan</button>';
  if(S.ui.imp) data+='<div class="notice">Ditemukan '+S.ui.imp.tx.length+' transaksi di file. Pulihkan akan mengganti semua data yang ada sekarang.<div class="btn-row" style="margin-top:10px"><button class="btn primary" data-act="imp-yes">Ganti data</button><button class="btn ghost" data-act="imp-no">Batal</button></div></div>';
  if(S.tx.some(t=>t.demo)) data+='<button class="btn ghost block" data-act="rm-demo">Hapus data contoh</button>';
  data+= c==='reset'
    ? '<div class="notice">Semua transaksi dan pengaturan akan dihapus dan tidak bisa dikembalikan.<div class="btn-row" style="margin-top:10px"><button class="btn danger" data-act="reset-yes">Ya, hapus semua</button><button class="btn ghost" data-act="reset-no">Batal</button></div></div>'
    : '<button class="btn danger block" data-act="reset-ask">Hapus semua data</button>';
  const inst=installBanner(true);
  return head('Pengaturan','',false)+
    (inst?'<h2 class="sec" style="margin-top:8px">Aplikasi di Perangkat</h2>'+inst:'')+
    '<h2 class="sec" style="margin-top:'+(inst?'24px':'8px')+'">Anggaran bulanan</h2><div class="card form"><label class="frow"><span>Batas pengeluaran</span><span class="mi"><i>Rp</i><input class="money" inputmode="numeric" data-set="budget" value="'+fmtN.format(st.budget||0)+'" aria-label="Anggaran bulanan"></span></label><p class="hint">Isi 0 untuk menonaktifkan.</p></div>'+
    '<h2 class="sec">Saldo awal dompet</h2><div class="card form">'+opens+'<p class="hint">Saldo sebelum transaksi pertama yang kamu catat.</p></div>'+
    '<h2 class="sec">Data</h2><div class="card form"><div class="btns">'+data+'</div></div>'+
    '<p class="hint" style="margin:18px 4px">Catatan tersimpan lokal di perangkat ini sehingga tetap bekerja offline. Di iPhone/iPad, simpan cadangan CSV atau JSON ke aplikasi File secara berkala.</p>';
}

function sixMonthSeries(){
  const p=monthParts(S.ui.month), arr=[];
  for(let i=5;i>=0;i--){
    const d=new Date(p[0],p[1]-1-i,1);
    const key=d.getFullYear()+'-'+pad(d.getMonth()+1);
    const s=sums(monthTx(key));
    arr.push({key:key,lab:MON3[d.getMonth()],full:MONTHS[d.getMonth()]+' '+d.getFullYear(),i:s.i,o:s.o});
  }
  return arr;
}
function renderHomeD3Chart(){
  const card=$('#home-d3-card');
  if(!card) return;
  const arr=sixMonthSeries();
  const maxRaw=arr.reduce((m,a)=>Math.max(m,a.i,a.o),0);
  if(maxRaw<=0||typeof window.d3==='undefined'){
    card.className='card empty';
    card.innerHTML='<span class="empty-ic">'+icon('chart',24)+'</span><span>Belum ada data pemasukan atau pengeluaran untuk 6 bulan terakhir.</span>';
    return;
  }
  card.className='card d3-card';
  card.innerHTML=
    '<div class="d3-inspect" id="d3-inspect"></div>'+
    '<div class="d3-host" id="home-d3-host"></div>'+
    '<div class="d3-foot">'+
      '<div class="legend"><span><i style="background:var(--in)"></i>Pemasukan</span><span><i style="background:var(--out)"></i>Pengeluaran</span></div>'+
      '<span class="d3-tip-hint">Ketuk bulan untuk rincian</span>'+
    '</div>';

  const d3=window.d3;
  const Wd=460, H=205, M={top:10,right:8,bottom:26,left:44};
  const iw=Wd-M.left-M.right, ih=H-M.top-M.bottom;
  const yMax=niceMax(maxRaw);
  const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const x0=d3.scaleBand().domain(arr.map(d=>d.key)).range([0,iw]).paddingInner(0.24).paddingOuter(0.08);
  const x1=d3.scaleBand().domain(['i','o']).range([0,x0.bandwidth()]).padding(0.16);
  const y=d3.scaleLinear().domain([0,yMax]).range([ih,0]);

  const svg=d3.select('#home-d3-host')
    .append('svg')
    .attr('class','d3-svg')
    .attr('viewBox','0 0 '+Wd+' '+H)
    .attr('role','img')
    .attr('aria-label','Grafik batang D3 perbandingan pemasukan dan pengeluaran 6 bulan terakhir');

  const g=svg.append('g').attr('transform','translate('+M.left+','+M.top+')');

  g.append('g')
    .attr('class','d3-grid')
    .call(d3.axisLeft(y).tickValues([0,yMax*0.5,yMax]).tickSize(-iw).tickFormat(''));

  g.append('g')
    .attr('class','d3-axis d3-y')
    .call(d3.axisLeft(y).tickValues([0,yMax*0.5,yMax]).tickFormat(v=>v===0?'0':compact(v)));

  const xAxis=g.append('g')
    .attr('class','d3-axis d3-x')
    .attr('transform','translate(0,'+ih+')')
    .call(d3.axisBottom(x0).tickFormat(k=>{
      const item=arr.find(d=>d.key===k);
      return item?item.lab:k;
    }));
  xAxis.selectAll('text')
    .classed('is-cur',k=>k===S.ui.month);

  const inspectEl=$('#d3-inspect');
  function updateInspect(d){
    if(!inspectEl) return;
    inspectEl.innerHTML=
      '<span class="d3-mo">'+esc(d.full)+'</span>'+
      '<div class="d3-vals">'+
        '<span>Masuk <b class="in num">'+hid(rp(d.i))+'</b></span>'+
        '<span>Keluar <b class="out num">'+hid(rp(d.o))+'</b></span>'+
      '</div>';
    g.selectAll('.d3-group').classed('is-active',item=>item.key===d.key);
  }

  const groups=g.selectAll('.d3-group')
    .data(arr,d=>d.key)
    .enter()
    .append('g')
    .attr('class','d3-group')
    .attr('transform',d=>'translate('+x0(d.key)+',0)')
    .attr('tabindex','0')
    .attr('role','button')
    .attr('aria-label',d=>d.full+': pemasukan '+rp(d.i)+', pengeluaran '+rp(d.o))
    .on('click',function(_,d){ updateInspect(d); })
    .on('mouseenter',function(_,d){ updateInspect(d); })
    .on('keydown',function(ev,d){ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); updateInspect(d); } });

  groups.append('rect')
    .attr('class','d3-bg')
    .attr('x',-4)
    .attr('y',-4)
    .attr('width',x0.bandwidth()+8)
    .attr('height',ih+8)
    .attr('rx',10);

  const inBars=groups.append('rect')
    .attr('class','d3-bar-in')
    .attr('x',x1('i'))
    .attr('width',x1.bandwidth())
    .attr('rx',4)
    .attr('y',reduceMotion?d=>y(d.i):ih)
    .attr('height',reduceMotion?d=>Math.max(0,ih-y(d.i)):0);

  const outBars=groups.append('rect')
    .attr('class','d3-bar-out')
    .attr('x',x1('o'))
    .attr('width',x1.bandwidth())
    .attr('rx',4)
    .attr('y',reduceMotion?d=>y(d.o):ih)
    .attr('height',reduceMotion?d=>Math.max(0,ih-y(d.o)):0);

  if(!reduceMotion){
    inBars.transition().duration(480).ease(d3.easeCubicOut)
      .attr('y',d=>y(d.i))
      .attr('height',d=>Math.max(0,ih-y(d.i)));
    outBars.transition().duration(480).delay(60).ease(d3.easeCubicOut)
      .attr('y',d=>y(d.o))
      .attr('height',d=>Math.max(0,ih-y(d.o)));
  }

  updateInspect(arr[arr.length-1]);
}
function afterRender(){
  renderHomeD3Chart();
  const el=document.querySelector('[data-count]');
  if(!el||S.ui.counted) return;
  S.ui.counted=true;
  if(S.ui.hide||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  const to=Number(el.dataset.count)||0; if(!to) return;
  const from=to*.9, t0=performance.now();
  const step=now=>{
    const k=Math.min(1,(now-t0)/700), e=1-Math.pow(1-k,3), v=from+(to-from)*e;
    el.textContent=signed(v);
    if(k<1&&document.body.contains(el)) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function render(){
  const t=S.ui.tab;
  $('#main').innerHTML=t==='home'?vHome():t==='history'?vHistory():t==='stats'?vStats():vSettings();
  document.querySelectorAll('.tab').forEach(b=>{
    const on=b.dataset.tab===t; b.classList.toggle('on',on);
    if(on) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
  });
  afterRender();
}
function buildTabs(){
  const T=[['home','home','Beranda'],['history','list','Riwayat']];
  const U=[['stats','chart','Statistik'],['settings','sliders','Atur']];
  const tb=a=>'<button class="tab" data-act="tab" data-tab="'+a[0]+'">'+icon(a[1],22)+'<span>'+a[2]+'</span></button>';
  $('#tabs').innerHTML=T.map(tb).join('')+'<button class="addbtn" data-act="add" aria-label="Catat transaksi">'+icon('add',26)+'</button>'+U.map(tb).join('');
}

/* ---------- toast ---------- */
let tT;
function toast(msg,label,act){
  const el=$('#toast');
  el.innerHTML='<span>'+esc(msg)+'</span>'+(label?'<button class="link" data-act="'+act+'">'+esc(label)+'</button>':'');
  el.hidden=false; clearTimeout(tT);
  tT=setTimeout(()=>{el.hidden=true;},label?5000:2200);
}

/* ---------- sheet (transaction + iOS install guide) ---------- */
let SH=null, guideOpen=false;
function sheetHTML(){
  const cats=SH.type==='out'?CATS_OUT:CATS_IN;
  const chips=cats.map(c=>'<button type="button" class="chip" data-act="cat" data-k="'+c.k+'" aria-pressed="'+(SH.cat===c.k)+'"><span class="ico c'+c.c+'">'+icon(c.i,20)+'</span>'+esc(c.n)+'</button>').join('');
  const wsel=WALLETS.map(w=>'<button type="button" class="wsel" data-act="wal" data-k="'+w.k+'" aria-pressed="'+(SH.wallet===w.k)+'">'+badge(w.k)+w.n+'</button>').join('');
  const quick=[10000,20000,50000,100000].map(v=>'<button type="button" data-act="quick" data-v="'+v+'">+'+compact(v)+'</button>').join('');
  return '<div class="grab"></div><div class="sh-head"><h2>'+(SH.id?'Ubah transaksi':'Catat transaksi')+'</h2><button class="icon-btn" data-act="close" aria-label="Tutup">'+icon('close')+'</button></div>'+
    '<div class="form"><div class="seg"><button type="button" data-act="stype-sheet" data-v="out" class="t-out '+(SH.type==='out'?'on':'')+'">Pengeluaran</button><button type="button" data-act="stype-sheet" data-v="in" class="t-in '+(SH.type==='in'?'on':'')+'">Pemasukan</button></div>'+
    '<label class="amt-field"><span>Rp</span><input id="f-amt" class="money" inputmode="numeric" autocomplete="off" placeholder="0" value="'+(SH.amt?fmtN.format(SH.amt):'')+'" aria-label="Jumlah"></label>'+
    '<div class="quick">'+quick+'</div>'+
    '<div><div class="lab" style="margin-bottom:8px">Kategori</div><div class="chips">'+chips+'</div></div>'+
    '<div><div class="lab" style="margin-bottom:8px">Dompet</div><div class="wsel-row">'+wsel+'</div></div>'+
    '<label class="fld"><span class="l">Tanggal</span><input type="date" id="f-date" value="'+esc(SH.date)+'"></label>'+
    '<label class="fld"><span class="l">Catatan</span><input id="f-note" maxlength="80" placeholder="Opsional, mis. makan siang" value="'+esc(SH.note)+'" autocomplete="off"></label>'+
    '<p class="err" id="f-err" role="alert" hidden></p>'+
    '<div class="sh-actions">'+(SH.id?'<button type="button" class="btn danger" id="f-del" data-act="del">Hapus</button>':'')+'<button type="button" class="btn primary" data-act="save">Simpan</button></div></div>';
}
function openInstallGuide(){
  SH=null; guideOpen=true;
  $('#sheet').setAttribute('aria-label','Cara pasang di iPhone dan iPad');
  $('#sheet').innerHTML=
    '<div class="grab"></div>'+
    '<div class="sh-head"><h2>Pasang Kas Saku di iOS</h2><button class="icon-btn" data-act="close" aria-label="Tutup">'+icon('close')+'</button></div>'+
    '<div class="form">'+
      '<p class="hint">Pasang lewat browser <b>Safari</b> agar Kas Saku muncul di Layar Utama dan bisa dibuka kapan saja tanpa internet:</p>'+
      '<div class="ios-steps">'+
        '<div class="ios-step"><span class="ios-num">1</span><p>Buka halaman ini di <b>Safari</b>, lalu ketuk tombol <b>Bagikan (Share)</b> <span class="inline-ic">'+icon('share',18)+'</span> di bilah menu Safari.</p></div>'+
        '<div class="ios-step"><span class="ios-num">2</span><p>Gulir daftar opsi ke bawah dan pilih <b>Tambah ke Layar Utama</b> (<i>Add to Home Screen</i>).</p></div>'+
        '<div class="ios-step"><span class="ios-num">3</span><p>Ketuk <b>Tambah</b> di pojok kanan atas. Ikon <b>Kas Saku</b> akan langsung terpasang.</p></div>'+
      '</div>'+
      '<button type="button" class="btn primary block" data-act="close">Mengerti</button>'+
    '</div>';
  $('#scrim').hidden=false; document.body.style.overflow='hidden';
}
function syncSheet(){
  if(!SH||!$('#f-amt')) return;
  SH.amt=getAmt($('#f-amt')); SH.note=$('#f-note').value; SH.date=$('#f-date').value;
}
function openSheet(id){
  guideOpen=false;
  const t=id?S.tx.find(x=>x.id===id):null;
  SH=t?{id:t.id,type:t.type,cat:t.cat,wallet:t.wallet,date:t.date,amt:t.amt,note:t.note||'',del:false}
      :{id:null,type:'out',cat:'makan',wallet:lastWallet,date:today(),amt:0,note:'',del:false};
  $('#sheet').setAttribute('aria-label',SH.id?'Ubah transaksi':'Catat transaksi');
  $('#sheet').innerHTML=sheetHTML();
  $('#scrim').hidden=false; document.body.style.overflow='hidden';
  setTimeout(()=>{const a=$('#f-amt'); if(a&&!SH.id) a.focus();},60);
}
function closeSheet(){
  $('#scrim').hidden=true; document.body.style.overflow=''; SH=null; guideOpen=false;
}
function saveSheet(){
  syncSheet();
  const err=m=>{const e=$('#f-err'); e.textContent=m; e.hidden=false;};
  if(!(SH.amt>0)) return err('Isi jumlah lebih dari nol.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(SH.date)) return err('Pilih tanggal transaksi.');
  const data={type:SH.type,amt:SH.amt,cat:SH.cat,wallet:SH.wallet,date:SH.date,note:SH.note.trim().slice(0,80)};
  if(SH.id){ const t=S.tx.find(x=>x.id===SH.id); if(t) Object.assign(t,data); }
  else S.tx.push(Object.assign({id:uid(),ts:Date.now()},data));
  lastWallet=SH.wallet; S.ui.month=SH.date.slice(0,7);
  persist(); closeSheet(); render(); toast('Tersimpan');
}
function deleteSheet(){
  const b=$('#f-del');
  if(!SH.del){ SH.del=true; b.textContent='Ketuk lagi untuk menghapus'; return; }
  const i=S.tx.findIndex(x=>x.id===SH.id);
  if(i>-1){ lastDel=S.tx.splice(i,1)[0]; persist(); }
  closeSheet(); render(); toast('Transaksi dihapus','Batalkan','undo');
}

/* ---------- export / import (iOS Safari & universal browser) ---------- */
const stamp=()=>today();
async function saveFile(name,data,mime){
  if(DL){
    try{ await DL.save({filename:name,data:data}); toast('File siap disimpan'); return; }
    catch(e){ if(e&&e.code==='declined') return; }
  }
  const type=mime||'application/octet-stream';
  const blob=new Blob([data],{type:type});
  // On iOS Safari & standalone PWA, Web Share File API lets users save directly to Apple Files / iCloud Drive
  if(isIOS()&&typeof File==='function'&&navigator.share){
    try{
      const file=new File([blob],name,{type:type});
      if(!navigator.canShare||navigator.canShare({files:[file]})){
        await navigator.share({files:[file],title:name});
        toast('Pilih Simpan ke File');
        return;
      }
    }catch(e){
      if(e&&e.name==='AbortError') return;
    }
  }
  // Standard Blob anchor download fallback
  try{
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download=name; a.rel='noopener';
    a.style.display='none';
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{
      if(a.parentNode) a.parentNode.removeChild(a);
      URL.revokeObjectURL(url);
    },60000);
    toast('File siap diunduh');
  }catch(e){
    toast('File tidak bisa diunduh di tampilan ini');
  }
}
function exportCSV(){
  const q=v=>'"'+String(v).replace(/"/g,'""')+'"';
  const safe=v=>/^[=+\-@\t\r]/.test(v)?"'"+v:v;
  const rows=[['Tanggal','Jenis','Kategori','Dompet','Catatan','Jumlah']].concat(
    S.tx.slice().sort(cmp).map(t=>[t.date,t.type==='in'?'Pemasukan':'Pengeluaran',catOf(t).n,W[t.wallet]||'',safe(t.note||''),t.amt]));
  saveFile('kas-saku-'+stamp()+'.csv','\ufeff'+rows.map(r=>r.map(q).join(',')).join('\r\n'),'text/csv;charset=utf-8');
}
function exportJSON(){
  saveFile('kas-saku-cadangan-'+stamp()+'.json',JSON.stringify({app:'kas-saku',v:1,exportedAt:new Date().toISOString(),settings:S.settings,tx:S.tx},null,1),'application/json');
}
function cleanTx(a){
  const ok=[];
  (Array.isArray(a)?a:[]).forEach(t=>{
    if(!t||typeof t!=='object') return;
    const type=t.type==='in'?'in':t.type==='out'?'out':null, amt=Math.round(Number(t.amt));
    if(!type||!isFinite(amt)||amt<=0||!/^\d{4}-\d{2}-\d{2}$/.test(String(t.date))) return;
    const cat=CAT[t.cat]&&CAT[t.cat].t===type?t.cat:(type==='in'?'lain_in':'lain_out');
    ok.push({id:uid(),ts:Number(t.ts)||Date.now(),type:type,amt:amt,cat:cat,wallet:wk(t.wallet),note:String(t.note||'').slice(0,80),date:String(t.date)});
  });
  return ok;
}
function readImport(file){
  const r=new FileReader();
  r.onload=()=>{
    try{
      const o=JSON.parse(String(r.result)), tx=cleanTx(o&&o.tx);
      if(!o||o.app!=='kas-saku'||!tx.length) throw new Error('bad');
      S.ui.imp={tx:tx,settings:o.settings||{}}; render();
    }catch(e){ toast('File cadangan tidak dikenali'); }
  };
  r.onerror=()=>toast('File tidak bisa dibaca');
  r.readAsText(file);
}

/* ---------- events ---------- */
function shift(d){
  const p=monthParts(S.ui.month), dt=new Date(p[0],p[1]-1+d,1);
  S.ui.month=dt.getFullYear()+'-'+pad(dt.getMonth()+1); render();
}
document.addEventListener('click',async e=>{
  if(e.target.id==='scrim'){ closeSheet(); return; }
  const el=e.target.closest('[data-act]'); if(!el) return;
  const d=el.dataset;
  switch(d.act){
    case 'tab': S.ui.tab=d.tab; S.ui.confirm=''; render(); window.scrollTo(0,0); break;
    case 'add': openSheet(null); break;
    case 'edit': openSheet(d.id); break;
    case 'close': closeSheet(); break;
    case 'hide':
      S.ui.hide=!S.ui.hide;
      try{ localStorage.setItem(HKEY,S.ui.hide?'1':'0'); }catch(x){}
      render(); break;
    case 'inst-guide': openInstallGuide(); break;
    case 'inst-dismiss':
      installDismissed=true;
      try{ localStorage.setItem(IKEY,'1'); }catch(x){}
      render(); break;
    case 'inst-prompt':
      if(deferredInstallPrompt){
        deferredInstallPrompt.prompt();
        try{
          const choice=await deferredInstallPrompt.userChoice;
          if(choice&&choice.outcome==='accepted') deferredInstallPrompt=null;
        }catch(err){}
        render();
      }else{
        openInstallGuide();
      }
      break;
    case 'stype-sheet': {
      syncSheet(); SH.type=d.v;
      const list=d.v==='out'?CATS_OUT:CATS_IN;
      if(!list.some(c=>c.k===SH.cat)) SH.cat=list[0].k;
      $('#sheet').innerHTML=sheetHTML(); break; }
    case 'cat':
      SH.cat=d.k; document.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.k===d.k))); break;
    case 'wal':
      SH.wallet=d.k; document.querySelectorAll('.wsel').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.k===d.k))); break;
    case 'quick': {
      syncSheet(); SH.amt=Math.min(999999999999,(SH.amt||0)+Number(d.v));
      $('#f-amt').value=fmtN.format(SH.amt); break; }
    case 'save': saveSheet(); break;
    case 'del': deleteSheet(); break;
    case 'mprev': shift(-1); break;
    case 'mnext': shift(1); break;
    case 'filter': S.ui.filter=d.v; render(); break;
    case 'stype': S.ui.stype=d.v; render(); break;
    case 'undo':
      if(lastDel){ S.tx.push(lastDel); lastDel=null; persist(); render(); $('#toast').hidden=true; } break;
    case 'rm-demo':
      S.tx=S.tx.filter(t=>!t.demo);
      if(S.settings.demo){ S.settings={opening:zeroOpen(),budget:0,demo:false}; }
      persist(); render(); toast('Data contoh dihapus'); break;
    case 'exp-csv': exportCSV(); break;
    case 'exp-json': exportJSON(); break;
    case 'imp-pick': $('#imp').click(); break;
    case 'imp-yes': {
      const im=S.ui.imp; if(!im) break;
      S.tx=im.tx;
      S.settings={opening:normOpen(im.settings&&im.settings.opening),budget:Number(im.settings&&im.settings.budget)||0,demo:false};
      S.ui.imp=null; persist(); render(); toast('Data dipulihkan'); break; }
    case 'imp-no': S.ui.imp=null; render(); break;
    case 'reset-ask': S.ui.confirm='reset'; render(); break;
    case 'reset-no': S.ui.confirm=''; render(); break;
    case 'reset-yes':
      S.tx=[]; S.settings={opening:zeroOpen(),budget:0,demo:false}; S.ui.confirm='';
      persist(); render(); toast('Semua data dihapus'); break;
  }
});
document.addEventListener('input',e=>{
  const el=e.target;
  if(el.classList&&el.classList.contains('money')){
    const dg=el.value.replace(/\D/g,'').slice(0,12);
    el.value=dg?fmtN.format(Number(dg)):'';
  }else if(el.id==='q'){
    S.ui.q=el.value; const h=$('#hlist'); if(h) h.innerHTML=historyList();
  }
});
document.addEventListener('change',e=>{
  const el=e.target;
  if(el.id==='imp'){ if(el.files&&el.files[0]) readImport(el.files[0]); el.value=''; return; }
  const k=el.dataset&&el.dataset.set; if(!k) return;
  const v=getAmt(el);
  if(k==='budget') S.settings.budget=v; else S.settings.opening[k.slice(5)]=v;
  S.settings.demo=false; persist(); toast('Tersimpan');
});
document.addEventListener('focusin',e=>{
  if(e.target.classList&&e.target.classList.contains('money')&&e.target.id!=='f-amt'){ const el=e.target; setTimeout(()=>{try{el.select();}catch(x){}},0); }
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&(SH||guideOpen)) closeSheet(); });

/* ---------- connectivity & PWA lifecycle ---------- */
function syncOnline(){
  const bar=$('#offline-bar');
  if(bar) bar.hidden=navigator.onLine!==false;
}
window.addEventListener('online',syncOnline);
window.addEventListener('offline',syncOnline);
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  deferredInstallPrompt=e;
  if(S.ui.tab==='home'||S.ui.tab==='settings') render();
});
window.addEventListener('appinstalled',()=>{
  deferredInstallPrompt=null;
  render();
  toast('Kas Saku berhasil dipasang');
});

/* ---------- start ---------- */
buildTabs(); render(); syncOnline();
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  });
}
(async()=>{
  try{
    if(window.claude&&window.claude.use){
      DL=await window.claude.use('downloads');
    }
  }catch(e){ DL=null; }
})();
})();
