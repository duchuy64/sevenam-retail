(() => {
'use strict';

const BASE={w:1193,h:1280};
const EXPORT_2K={w:2046,h:2195,tag:'2K'};
const EXPORT_4K={w:4092,h:4390,tag:'4K'};
const STORAGE='sevenam-bxh16-v1';
const C={
  navy:'#071a47', navy2:'#0b2f73', navy3:'#123d87', white:'#ffffff', ink:'#101724', muted:'#6b7480',
  line:'#d9dee6', track:'#edf0f2', purple:'#5a149d', purple2:'#7d2bc0',
  green:'#55b52c', greenDark:'#1f952f', blue:'#188bd8', orange:'#ff6b0b', red:'#ee1717',
  gold:'#f5b51b', silver:'#9ba4ad', bronze:'#a53a16', footer:'#041438'
};

const FIXED=[
  {code:'HP',name:'Hải Phòng',aliases:['HP','HAI PHONG']},
  {code:'TB',name:'Thái Bình',aliases:['TB','THAI BINH']},
  {code:'TĐT',name:'Tôn Đức Thắng',aliases:['TĐT','TDT','TON DUC THANG']},
  {code:'HOB',name:'Hòa Bình',aliases:['HOB','HOA BINH']},
  {code:'VI',name:'Vinh',aliases:['VI','VINH']},
  {code:'VP',name:'Vĩnh Phúc',aliases:['VP','VINH PHUC']},
  {code:'HĐ',name:'Hà Đông',aliases:['HĐ','HD','HA DONG']},
  {code:'THO',name:'Thanh Hóa',aliases:['THO','THANH HOA']},
  {code:'LLQ',name:'Lạc Long Quân',aliases:['LLQ','LAC LONG QUAN']},
  {code:'NB',name:'Ninh Bình',aliases:['NB','NINH BINH']},
  {code:'VT',name:'Việt Trì',aliases:['VT','VIET TRI']},
  {code:'LH',name:'Láng Hạ',aliases:['LH','LANG HA']},
  {code:'HAD',name:'Hải Dương',aliases:['HAD','HAI DUONG']},
  {code:'NĐ',name:'Nam Định',aliases:['NĐ','ND','NAM DINH']},
  {code:'TN',name:'Thái Nguyên',aliases:['TN','THAI NGUYEN']},
  {code:'TDH',name:'Trần Duy Hưng',aliases:['TDH','TRAN DUY HUNG']}
];

const SAMPLE=`\tBHX DS 12/08
STT\tSR\tHTTG
1\tHP\t54,98%
2\tTB\t50,84%
3\tTĐT\t50,00%
4\tHOB\t48,71%
5\tVI\t47,94%
6\tVP\t41,61%
7\tHĐ\t39,64%
8\tTHO\t36,60%
9\tLLQ\t35,23%
10\tNB\t33,74%
11\tVT\t33,68%
12\tLH\t32,73%
13\tHAD\t32,12%
14\tNĐ\t31,68%
15\tTN\t30,50%
16\tTDH\t29,68%
\tTổng\t43%`;

const $=id=>document.getElementById(id);
const els={
 data:$('dataInput'), parse:$('parseBtn'), sample:$('sampleBtn'), date:$('closingDate'),
 export2k:$('export2k'), export4k:$('export4k'), validation:$('validation'),
 canvas:$('canvas'), wrap:$('canvasWrap'), scroll:$('scroll'), meta:$('meta'), toast:$('toast'),
 modal:$('modal'), modalBadge:$('modalBadge'), modalTitle:$('modalTitle'), modalSummary:$('modalSummary'),
 modalIssues:$('modalIssues'), modalClose:$('modalClose'), modalOk:$('modalOk')
};
let model=null;

function strip(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toUpperCase().trim();}
function clean(s){return String(s??'').replace(/\*\*/g,'').replace(/`/g,'').trim();}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function clamp(v,a,b){return Math.min(b,Math.max(a,v));}
function daysInMonth(y,m){return new Date(y,m,0).getDate();}
function dateVN(d){return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;}
function iso(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function fmtPct(v,d=2){return (Number(v)||0).toLocaleString('vi-VN',{minimumFractionDigits:d,maximumFractionDigits:d})+'%';}
function fmtPct0(v){return Math.round(Number(v)||0).toLocaleString('vi-VN')+'%';}
function parsePct(s){
  const x=clean(s).replace(/\s/g,'');
  const m=x.match(/(-?\d{1,3}(?:[.,]\d{1,3})?)\s*%/);
  if(m)return Number(m[1].replace(',','.'));
  return NaN;
}
function parseLooseNumber(s){
  const m=clean(s).match(/-?\d{1,3}(?:[.,]\d{1,3})?/g);
  if(!m||!m.length)return NaN;
  const n=Number(m[m.length-1].replace(',','.'));
  return n>=0&&n<=100?n:NaN;
}
function status(diff){
  if(diff < -10)return {key:'red',label:'CHẬM NHIỀU',short:'Chậm nhiều',color:C.red};
  if(diff < 0)return {key:'orange',label:'CHẬM',short:'Chậm',color:C.orange};
  if(diff <= 10)return {key:'blue',label:'KỊP',short:'Kịp',color:C.blue};
  return {key:'green',label:'VƯỢT NHIỀU',short:'Vượt nhiều',color:C.green};
}
function splitLine(line){
  if(line.includes('\t'))return line.split('\t').map(clean);
  if(line.includes('|'))return line.split('|').map(clean).filter(Boolean);
  if(line.includes(';'))return line.split(';').map(clean);
  return line.trim().split(/\s{2,}/).map(clean);
}
function canonicalFromText(line){
  const n=' '+strip(line).replace(/[^A-Z0-9 ]/g,' ')+' ';
  let best=null,bestLen=-1;
  FIXED.forEach(s=>{
    s.aliases.forEach(a=>{
      const aa=strip(a);
      const re=new RegExp(`(^|\\s)${aa.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(?=\\s|$)`);
      if(re.test(n) && aa.length>bestLen){best=s;bestLen=aa.length;}
    });
  });
  return best;
}
function detectClosingDate(text){
  if(els.date.value){
    const d=new Date(els.date.value+'T00:00:00');
    if(!Number.isNaN(d.getTime()))return {date:d,source:'Ngày nhập tay'};
  }
  const yearNow=new Date().getFullYear();
  const patterns=[
    /(?:BHX\s*DS|CHỐT|CHOT|SỐ\s*LIỆU|SO\s*LIEU|DS)\s*[:\-]?\s*(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{4}))?/i,
    /(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/
  ];
  for(const re of patterns){
    const m=String(text).match(re);
    if(m){
      const d=+m[1],mo=+m[2],y=+(m[3]||yearNow),dt=new Date(y,mo-1,d);
      if(!Number.isNaN(dt.getTime()))return {date:dt,source:'Tự nhận diện từ tiêu đề dữ liệu'};
    }
  }
  const now=new Date(),dt=new Date(now.getFullYear(),now.getMonth(),now.getDate()-1);
  return {date:dt,source:'Mặc định: chốt hết ngày hôm qua'};
}
function parseData(text){
  const lines=String(text||'').replace(/\r/g,'').split('\n').filter(x=>x.trim());
  if(!lines.length)throw new Error('Chưa có dữ liệu để phân tích.');
  const issues=[], found=new Map();
  let total=NaN;

  lines.forEach((line,idx)=>{
    const n=strip(line);
    if(n.includes('TONG')){
      let p=parsePct(line); if(!Number.isFinite(p))p=parseLooseNumber(line);
      if(Number.isFinite(p))total=p;
      return;
    }
    const store=canonicalFromText(line);
    if(!store)return;
    let p=parsePct(line);
    if(!Number.isFinite(p)){
      const cells=splitLine(line);
      for(let j=cells.length-1;j>=0;j--){
        p=parseLooseNumber(cells[j]); if(Number.isFinite(p))break;
      }
    }
    if(!Number.isFinite(p)){
      issues.push({type:'err',text:`Dòng ${idx+1}: nhận ra ${store.code} nhưng không tìm thấy % HTTG.`});
      return;
    }
    if(found.has(store.code)){
      issues.push({type:'err',text:`Trùng showroom ${store.code}. Tool đang dùng giá trị xuất hiện sau cùng: ${fmtPct(p)}.`});
    }
    found.set(store.code,{...store,pct:p,sourceLine:idx+1});
  });

  const missing=FIXED.filter(s=>!found.has(s.code));
  missing.forEach(s=>issues.push({type:'err',text:`Thiếu showroom ${s.code} – ${s.name}.`}));

  const extraCount=found.size;
  if(extraCount!==16)issues.push({type:'err',text:`Tool fix cứng 16 showroom nhưng hiện đọc được ${extraCount}/16 showroom.`});

  const dc=detectClosingDate(text), closing=dc.date;
  const update=new Date(closing);update.setDate(update.getDate()+1);
  const totalDays=daysInMonth(closing.getFullYear(),closing.getMonth()+1);
  const day=closing.getDate(),timeProgress=day/totalDays*100;

  const rows=FIXED.map(s=>{
    const r=found.get(s.code);
    const pct=r?r.pct:0,diff=pct-timeProgress,st=status(diff);
    return {...s,pct,diff,status:st,missing:!r};
  });
  const sorted=[...rows].sort((a,b)=>b.pct-a.pct || FIXED.findIndex(x=>x.code===a.code)-FIXED.findIndex(x=>x.code===b.code));

  if(!Number.isFinite(total)){
    total=rows.reduce((a,r)=>a+r.pct,0)/rows.length;
    issues.push({type:'warn',text:`Không tìm thấy dòng Tổng. Tool tạm dùng trung bình 16 showroom = ${fmtPct(total)}. Nên dán dòng “Tổng” để đúng số hệ thống.`});
  }

  const groups={green:[],blue:[],orange:[],red:[]};
  sorted.forEach(r=>groups[r.status.key].push(r));
  return {rows,sorted,total,groups,issues,closing,update,dateSource:dc.source,totalDays,day,timeProgress};
}

function renderValidation(){
  const m=model;
  const errs=m.issues.filter(x=>x.type==='err'),warns=m.issues.filter(x=>x.type==='warn');
  const out=[];
  out.push(`<div class="ok">✓ Đọc ${m.rows.filter(x=>!x.missing).length}/16 showroom cố định</div>`);
  out.push(`<div class="ok">✓ Tổng hệ thống: ${fmtPct(m.total,2)} • Tiến độ thời gian: ${fmtPct(m.timeProgress,2)}</div>`);
  out.push(`<div class="ok">✓ Chốt: ${dateVN(m.closing)} • Cập nhật: ${dateVN(m.update)}</div>`);
  out.push(`<div class="muted">Nguồn ngày: ${esc(m.dateSource)}</div>`);
  if(errs.length||warns.length)out.push(`<div class="section">${errs.length} lỗi • ${warns.length} cảnh báo</div>`);
  [...errs,...warns].forEach(x=>out.push(`<div class="${x.type}">${x.type==='err'?'✕':'⚠'} ${esc(x.text)}</div>`));
  if(!errs.length&&!warns.length)out.push(`<div class="ok">✓ Dữ liệu hợp lệ, có thể xuất ảnh.</div>`);
  els.validation.innerHTML=out.join('');
  els.meta.textContent=`16 showroom • ${errs.length} lỗi • ${warns.length} cảnh báo`;
  els.export2k.disabled=errs.length>0;
  els.export4k.disabled=errs.length>0;
}
function showIssues(){
  const errs=model.issues.filter(x=>x.type==='err'),warns=model.issues.filter(x=>x.type==='warn');
  if(!errs.length&&!warns.length)return;
  els.modalBadge.textContent=errs.length?'PHÁT HIỆN LỖI':'CÓ CẢNH BÁO';
  els.modalTitle.textContent=errs.length?'Dữ liệu chưa đủ để xuất ảnh':'Có dữ liệu cần kiểm tra';
  els.modalSummary.textContent=`${errs.length} lỗi • ${warns.length} cảnh báo. ${errs.length?'Hãy sửa lỗi trước khi xuất ảnh.':'Dashboard vẫn có thể xuất.'}`;
  els.modalIssues.innerHTML=[...errs,...warns].map(x=>`<div class="issue ${x.type}">${x.type==='err'?'✕':'⚠'} ${esc(x.text)}</div>`).join('');
  els.modal.classList.add('show');els.modal.setAttribute('aria-hidden','false');
}
function closeModal(){els.modal.classList.remove('show');els.modal.setAttribute('aria-hidden','true');}
function toast(s){els.toast.textContent=s;els.toast.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>els.toast.classList.remove('show'),1700);}

function font(ctx,size,w=700){ctx.font=`${w>=600?700:400} ${size}px Arial, sans-serif`;ctx.textBaseline='top';}
function txt(ctx,s,x,y,size=16,color=C.ink,w=700,align='left'){ctx.save();font(ctx,size,w);ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(String(s),x,y);ctx.restore();}
function mid(ctx,s,x,y,size=16,color=C.ink,w=700,align='center'){ctx.save();ctx.font=`${w>=600?700:400} ${size}px Arial, sans-serif`;ctx.textBaseline='middle';ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(String(s),x,y);ctx.restore();}
function fit(ctx,s,x,y,maxW,size,color=C.ink,w=700,align='left',min=10){let z=size;ctx.save();while(z>min){font(ctx,z,w);if(ctx.measureText(String(s)).width<=maxW)break;z-=.5;}ctx.restore();txt(ctx,s,x,y,z,color,w,align);}
function fitMid(ctx,s,x,y,maxW,size,color=C.ink,w=700,align='left',min=10){let z=size;ctx.save();while(z>min){ctx.font=`${w>=600?700:400} ${z}px Arial, sans-serif`;if(ctx.measureText(String(s)).width<=maxW)break;z-=.5;}ctx.restore();mid(ctx,s,x,y,z,color,w,align);}
function rr(ctx,x,y,w,h,r,fill,stroke=null,lw=1){ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}ctx.restore();}
function line(ctx,x1,y1,x2,y2,color,lw=1){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();}
function circle(ctx,x,y,r,fill,stroke=null,lw=1){ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}ctx.restore();}
function progress(ctx,x,y,w,h,pct,color,marker=null){rr(ctx,x,y,w,h,h/2,C.track);const fw=w*clamp(pct,0,100)/100;if(fw>0)rr(ctx,x,y,fw,h,h/2,color);if(Number.isFinite(marker)){const mx=x+w*clamp(marker,0,100)/100;ctx.save();ctx.strokeStyle='#a3aab4';ctx.lineWidth=2.6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(mx,y-3);ctx.lineTo(mx,y+h+3);ctx.stroke();ctx.restore();}}
function wrapLines(ctx,s,maxW,size=13,w=700,max=3){ctx.save();font(ctx,size,w);const words=String(s).split(/\s+/).filter(Boolean),out=[];let cur='';for(const word of words){const t=cur?cur+' '+word:word;if(cur&&ctx.measureText(t).width>maxW){out.push(cur);cur=word;if(out.length===max-1)break}else cur=t}if(cur&&out.length<max)out.push(cur);ctx.restore();return out;}
function wrap(ctx,s,x,y,maxW,lineH,size=13,color=C.ink,w=700,max=3){const ls=wrapLines(ctx,s,maxW,size,w,max);ls.forEach((l,i)=>txt(ctx,l,x,y+i*lineH,size,color,w));return ls.length;}

function drawTrophy(ctx,cx,cy,s){
  ctx.save();
  ctx.lineCap='round';
  ctx.lineJoin='round';

  const lw=Math.max(1.2,s*.018);

  // =========================================================
  // 1. SHADOW DƯỚI CÚP
  // =========================================================
  ctx.save();
  ctx.globalAlpha=.18;
  ctx.fillStyle='#000';

  ctx.beginPath();
  ctx.ellipse(
    cx,
    cy+s*.405,
    s*.27,
    s*.045,
    0,
    0,
    Math.PI*2
  );
  ctx.fill();

  ctx.restore();


  // =========================================================
  // 2. GLOW VÀNG PHÍA SAU
  // =========================================================
  const glow=ctx.createRadialGradient(
    cx,
    cy-s*.08,
    0,
    cx,
    cy-s*.08,
    s*.50
  );

  glow.addColorStop(0,'rgba(255,212,64,.28)');
  glow.addColorStop(.55,'rgba(255,190,20,.10)');
  glow.addColorStop(1,'rgba(255,180,0,0)');

  ctx.fillStyle=glow;

  ctx.beginPath();
  ctx.arc(
    cx,
    cy-s*.06,
    s*.50,
    0,
    Math.PI*2
  );
  ctx.fill();


  // =========================================================
  // 3. GRADIENT VÀNG CHÍNH
  // =========================================================
  const gold=ctx.createLinearGradient(
    cx-s*.35,
    cy-s*.30,
    cx+s*.32,
    cy+s*.30
  );

  gold.addColorStop(0,'#fff2a7');
  gold.addColorStop(.18,'#ffd94d');
  gold.addColorStop(.48,'#ffb814');
  gold.addColorStop(.75,'#e99400');
  gold.addColorStop(1,'#b96300');

  const goldDark='#a85b00';
  const goldEdge='#c87500';


  // =========================================================
  // 4. TAY CẦM – VẼ SAU THÂN
  // =========================================================
  ctx.save();

  // Viền tối trước
  ctx.strokeStyle=goldDark;
  ctx.lineWidth=Math.max(3,s*.078);

  // Tay trái
  ctx.beginPath();
  ctx.moveTo(
    cx-s*.255,
    cy-s*.235
  );

  ctx.bezierCurveTo(
    cx-s*.50,
    cy-s*.27,

    cx-s*.53,
    cy+s*.025,

    cx-s*.205,
    cy+s*.015
  );

  ctx.stroke();

  // Tay phải
  ctx.beginPath();

  ctx.moveTo(
    cx+s*.255,
    cy-s*.235
  );

  ctx.bezierCurveTo(
    cx+s*.50,
    cy-s*.27,

    cx+s*.53,
    cy+s*.025,

    cx+s*.205,
    cy+s*.015
  );

  ctx.stroke();


  // Lớp vàng sáng phía trong tay cầm
  ctx.strokeStyle='#f9b817';
  ctx.lineWidth=Math.max(2,s*.047);

  ctx.beginPath();

  ctx.moveTo(
    cx-s*.255,
    cy-s*.235
  );

  ctx.bezierCurveTo(
    cx-s*.47,
    cy-s*.255,

    cx-s*.49,
    cy-s*.01,

    cx-s*.205,
    cy+s*.015
  );

  ctx.stroke();


  ctx.beginPath();

  ctx.moveTo(
    cx+s*.255,
    cy-s*.235
  );

  ctx.bezierCurveTo(
    cx+s*.47,
    cy-s*.255,

    cx+s*.49,
    cy-s*.01,

    cx+s*.205,
    cy+s*.015
  );

  ctx.stroke();

  ctx.restore();


  // =========================================================
  // 5. THÂN CÚP – BOWL LỚN
  // =========================================================
  ctx.beginPath();

  // góc trái miệng
  ctx.moveTo(
    cx-s*.285,
    cy-s*.305
  );

  // cạnh trên
  ctx.lineTo(
    cx+s*.285,
    cy-s*.305
  );

  // cạnh phải cong xuống
  ctx.bezierCurveTo(
    cx+s*.27,
    cy-s*.07,

    cx+s*.17,
    cy+s*.075,

    cx+s*.075,
    cy+s*.105
  );

  // đáy thân
  ctx.bezierCurveTo(
    cx+s*.035,
    cy+s*.12,

    cx-s*.035,
    cy+s*.12,

    cx-s*.075,
    cy+s*.105
  );

  // cạnh trái cong lên
  ctx.bezierCurveTo(
    cx-s*.17,
    cy+s*.075,

    cx-s*.27,
    cy-s*.07,

    cx-s*.285,
    cy-s*.305
  );

  ctx.closePath();

  ctx.fillStyle=gold;
  ctx.fill();

  ctx.strokeStyle=goldDark;
  ctx.lineWidth=lw;
  ctx.stroke();


  // =========================================================
  // 6. MIỆNG CÚP – TẠO CẢM GIÁC 3D
  // =========================================================

  // viền ngoài
  ctx.beginPath();
  ctx.ellipse(
    cx,
    cy-s*.305,
    s*.285,
    s*.055,
    0,
    0,
    Math.PI*2
  );

  ctx.fillStyle='#ffca2d';
  ctx.fill();

  ctx.strokeStyle=goldEdge;
  ctx.lineWidth=lw;
  ctx.stroke();


  // lòng trong
  ctx.beginPath();

  ctx.ellipse(
    cx,
    cy-s*.305,
    s*.225,
    s*.032,
    0,
    0,
    Math.PI*2
  );

  ctx.fillStyle='#d98700';
  ctx.fill();


  // highlight mép trước
  ctx.save();

  ctx.strokeStyle='#fff0a0';
  ctx.lineWidth=Math.max(1,s*.012);

  ctx.beginPath();

  ctx.ellipse(
    cx,
    cy-s*.295,
    s*.245,
    s*.035,
    0,
    0,
    Math.PI
  );

  ctx.stroke();

  ctx.restore();


  // =========================================================
  // 7. HIGHLIGHT THÂN CÚP
  // =========================================================
  ctx.save();

  ctx.strokeStyle='rgba(255,255,255,.32)';
  ctx.lineWidth=Math.max(1.5,s*.026);

  ctx.beginPath();

  ctx.moveTo(
    cx-s*.205,
    cy-s*.20
  );

  ctx.bezierCurveTo(
    cx-s*.18,
    cy-s*.07,

    cx-s*.13,
    cy+s*.005,

    cx-s*.09,
    cy+s*.035
  );

  ctx.stroke();

  ctx.restore();


  // =========================================================
  // 8. HUY HIỆU TRUNG TÂM
  // =========================================================
  circle(
    ctx,
    cx,
    cy-s*.09,
    s*.092,
    '#fff0a0',
    '#c97800',
    Math.max(1.3,s*.016)
  );

  // vòng nhỏ trong
  circle(
    ctx,
    cx,
    cy-s*.09,
    s*.068,
    '#ffc72c',
    '#e19100',
    Math.max(1,s*.010)
  );


  // =========================================================
  // 9. NGÔI SAO
  // =========================================================
  ctx.save();

  ctx.fillStyle='#fff8ce';
  ctx.strokeStyle='#c87500';
  ctx.lineWidth=Math.max(1,s*.009);

  ctx.beginPath();

  for(let i=0;i<10;i++){

    const angle=
      -Math.PI/2 +
      i*Math.PI/5;

    const radius=
      i%2===0
        ? s*.050
        : s*.022;

    const px=
      cx +
      Math.cos(angle)*radius;

    const py=
      cy-s*.09 +
      Math.sin(angle)*radius;

    if(i===0){
      ctx.moveTo(px,py);
    }else{
      ctx.lineTo(px,py);
    }
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();


  // =========================================================
  // 10. CỔ CÚP
  // =========================================================
  const stemGrad=ctx.createLinearGradient(
    cx-s*.06,
    cy+s*.09,
    cx+s*.06,
    cy+s*.30
  );

  stemGrad.addColorStop(0,'#f5ad0b');
  stemGrad.addColorStop(1,'#b96800');

  rr(
    ctx,
    cx-s*.052,
    cy+s*.095,
    s*.104,
    s*.20,
    s*.018,
    stemGrad,
    goldDark,
    Math.max(1,s*.010)
  );


  // =========================================================
  // 11. ĐẾ TRÊN
  // =========================================================
  rr(
    ctx,
    cx-s*.14,
    cy+s*.265,
    s*.28,
    s*.065,
    s*.016,
    '#d78300',
    '#a75b00',
    Math.max(1,s*.010)
  );


  // =========================================================
  // 12. ĐẾ CHÍNH
  // =========================================================
  const baseGrad=ctx.createLinearGradient(
    cx,
    cy+s*.30,
    cx,
    cy+s*.405
  );

  baseGrad.addColorStop(0,'#c97800');
  baseGrad.addColorStop(1,'#8f4900');

  rr(
    ctx,
    cx-s*.225,
    cy+s*.32,
    s*.45,
    s*.105,
    s*.025,
    baseGrad,
    '#7e4000',
    Math.max(1,s*.012)
  );


  // highlight đế
  line(
    ctx,
    cx-s*.17,
    cy+s*.342,
    cx+s*.17,
    cy+s*.342,
    'rgba(255,195,54,.55)',
    Math.max(1,s*.010)
  );


  // =========================================================
  // 13. SPARKLES – chỉ vẽ khi icon lớn
  // =========================================================
  if(s>=80){

    function sparkle(x,y,r){

      ctx.save();

      ctx.strokeStyle='#fff1a0';
      ctx.lineWidth=Math.max(1.5,s*.015);
      ctx.lineCap='round';

      ctx.beginPath();
      ctx.moveTo(x,y-r);
      ctx.lineTo(x,y+r);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x-r,y);
      ctx.lineTo(x+r,y);
      ctx.stroke();

      ctx.restore();
    }

    sparkle(
      cx-s*.37,
      cy-s*.33,
      s*.035
    );

    sparkle(
      cx+s*.37,
      cy-s*.17,
      s*.027
    );
  }

  ctx.restore();
}
function drawCalendar(ctx,cx,cy,s,color='#fff'){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=s*.09;ctx.lineCap='round';rr(ctx,cx-s*.42,cy-s*.34,s*.84,s*.72,s*.08,null,color,s*.07);line(ctx,cx-s*.42,cy-s*.10,cx+s*.42,cy-s*.10,color,s*.07);line(ctx,cx-s*.22,cy-s*.46,cx-s*.22,cy-s*.27,color,s*.07);line(ctx,cx+s*.22,cy-s*.46,cx+s*.22,cy-s*.27,color,s*.07);ctx.restore();}
function drawClock(ctx,cx,cy,s,color='#fff'){circle(ctx,cx,cy,s*.39,null,color,s*.075);line(ctx,cx,cy,cx,cy-s*.22,color,s*.075);line(ctx,cx,cy,cx+s*.20,cy+s*.11,color,s*.075);}
function drawChart(ctx,cx,cy,s){
  ctx.save();
  ctx.lineCap='round';
  ctx.lineJoin='round';


  // ===== BAR COLORS =====
  const cols=[
    '#55b52c',
    '#f5b51b',
    '#188bd8'
  ];


  // ===== BARS =====
  const barW=s*.15;
  const baseY=cy+s*.20;

  const heights=[
    s*.25,
    s*.38,
    s*.51
  ];

  const barXs=[
    cx-s*.28,
    cx,
    cx+s*.28
  ];

  barXs.forEach((bx,i)=>{
    rr(
      ctx,
      bx-barW/2,
      baseY-heights[i],
      barW,
      heights[i],
      s*.022,
      cols[i]
    );
  });


  // ===== SMALL BASELINE =====
  // Giúp 3 cột có điểm tựa và nhìn như biểu đồ hoàn chỉnh.
  ctx.globalAlpha=.30;

  line(
    ctx,
    cx-s*.39,
    baseY+s*.015,
    cx+s*.39,
    baseY+s*.015,
    '#b8c8dc',
    Math.max(1,s*.012)
  );

  ctx.globalAlpha=1;


  // ===== GROWTH LINE =====
  // Dùng xanh sáng hơn một chút so với cột cuối
  // để đường trend không bị hòa vào cột.
  const trend='#27a6ea';

  ctx.save();

  ctx.strokeStyle=trend;
  ctx.lineWidth=Math.max(2,s*.048);
  ctx.lineCap='round';
  ctx.lineJoin='round';

  ctx.beginPath();

  ctx.moveTo(
    cx-s*.35,
    cy-s*.16
  );

  ctx.lineTo(
    cx-s*.10,
    cy-s*.35
  );

  ctx.lineTo(
    cx+s*.07,
    cy-s*.23
  );

  ctx.lineTo(
    cx+s*.305,
    cy-s*.455
  );

  ctx.stroke();


  // ===== REAL ARROW HEAD =====
  const tipX=cx+s*.345;
  const tipY=cy-s*.495;

  ctx.fillStyle=trend;

  ctx.beginPath();

  // đầu nhọn
  ctx.moveTo(
    tipX,
    tipY
  );

  // góc trái trên
  ctx.lineTo(
    cx+s*.205,
    cy-s*.47
  );

  // góc phải dưới
  ctx.lineTo(
    cx+s*.32,
    cy-s*.355
  );

  ctx.closePath();
  ctx.fill();

  ctx.restore();

  ctx.restore();
}
function medal(ctx,cx,cy,rank){
  const colors=rank===1?[C.gold,'#b66b00']:rank===2?[C.silver,'#58616a']:[C.bronze,'#6a1d0d'];
  ctx.save();ctx.fillStyle=colors[1];ctx.beginPath();ctx.moveTo(cx-10,cy+11);ctx.lineTo(cx-5,cy+28);ctx.lineTo(cx+1,cy+17);ctx.lineTo(cx+9,cy+28);ctx.lineTo(cx+11,cy+10);ctx.fill();circle(ctx,cx,cy,18,colors[0],colors[1],3);circle(ctx,cx,cy,12,'rgba(255,255,255,.16)');mid(ctx,rank,cx,cy+1,17,rank===1?'#8a4b00':'#fff',700);ctx.restore();
}
function iconBadge(ctx,cx,cy,color,type){
  if(type==='star'){circle(ctx,cx,cy,18,color);mid(ctx,'★',cx,cy+1,21,'#fff',700);return;}
  if(type==='target'){circle(ctx,cx,cy,18,color);circle(ctx,cx,cy,10,null,'#fff',2.8);circle(ctx,cx,cy,4,null,'#fff',2.2);line(ctx,cx,cy,cx+11,cy-11,'#fff',2.8);return;}
  if(type==='chart'){drawChart(ctx,cx,cy+4,38);return;}
  ctx.save();ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(cx,cy-18);ctx.lineTo(cx+17,cy+16);ctx.lineTo(cx-17,cy+16);ctx.closePath();ctx.fill();ctx.restore();mid(ctx,'!',cx,cy+3,21,'#fff',700);
}
function drawHeader(ctx,m){
  ctx.fillStyle=C.navy;ctx.fillRect(0,0,BASE.w,BASE.h);
  drawTrophy(ctx,96,68,145);
  fit(ctx,'BẢNG XẾP HẠNG DOANH SỐ HỆ THỐNG BÁN LẺ',205,28,905,47,'#fff',700,'left',36);
  rr(ctx,202,96,426,57,8,'#d9281f','#9c1a15',2);
  drawCalendar(ctx,250,124,34,'#fff');
txt(ctx,`CẬP NHẬT: ${dateVN(m.update)}`,286,114,25,'#fff',700);

rr(ctx,652,96,447,57,8,'#0b3479','#09285f',2);
drawClock(ctx,696,124,34,'#fff');
fit(ctx,`SỐ CHỐT HẾT NGÀY: ${dateVN(m.closing)}`,725,114,365,23,'#fff',700,'left',23);

drawChart(ctx,1150,118,74);
}
function drawLeft(ctx,m){
  const x=15,y=167,w=678,h=1014;
  rr(ctx,x,y,w,h,12,'#fff','#d6dce5',2.2);
  ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,55,[12,12,0,0]);ctx.fillStyle=C.navy;ctx.fill();ctx.restore();
  mid(ctx,'XH',58,y+28,20,'#fff');mid(ctx,'CỬA HÀNG',210,y+28,21,'#fff');mid(ctx,'TIẾN ĐỘ THỰC HIỆN THÁNG',470,y+28,21,'#fff');
  line(ctx,99,y,99,y+55,'rgba(255,255,255,.28)',1);line(ctx,319,y,319,y+55,'rgba(255,255,255,.20)',1);

  const rowTop=y+57,rowH=56.1;
  m.sorted.forEach((r,i)=>{
    const yy=rowTop+i*rowH;
    if(i)line(ctx,x+8,yy,x+w-8,yy,'#e4e7eb',1);
    if(i<3)medal(ctx,58,yy+28,i+1);
    else{circle(ctx,58,yy+28,17,C.navy2);mid(ctx,i+1,58,yy+28.5,16,'#fff');}
    fitMid(ctx,r.code,119,yy+28,120,24,C.ink,700,'left',20);
    progress(ctx,260,yy+20,302,16,r.pct,r.status.color,m.timeProgress);
    fitMid(ctx,fmtPct(r.pct,2),665,yy+28,108,28,r.status.color,700,'right',22);
  });

  const totalY=y+h-57;
  line(ctx,x+4,totalY,x+w-4,totalY,C.navy,3);
  mid(ctx,'Tổng hệ thống',62,totalY+29,26,C.navy,700,'left');
  fitMid(ctx,fmtPct0(m.total,2),658,totalY+29,150,34,C.navy2,700,'right',28);
}
function drawSystemCard(ctx,m){
  const x=703,y=167,w=475,h=333;
  rr(ctx,x,y,w,h,12,'#fff','#d6dce5',2.2);
  ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,55,[12,12,0,0]);ctx.fillStyle=C.navy;ctx.fill();ctx.restore();
  mid(ctx,'TIẾN ĐỘ DOANH SỐ TOÀN HỆ THỐNG',x+w/2,y+28,20,'#fff');

  // KPI tổng hệ thống
  fit(ctx,fmtPct0(m.total,2),x+w/2,y+64,w-60,96,C.purple,700,'center',80);

  const bx=x+31,bw=w-62;
  // Thanh hoàn thành hệ thống
  mid(ctx,'HOÀN THÀNH HỆ THỐNG',bx,y+174,16.5,C.navy,700,'left');
  fitMid(ctx,fmtPct(m.total,2),x+w-31,y+174,120,18,C.purple,700,'right',15.5);
  progress(ctx,bx,y+191,bw,20,m.total,C.purple2);

  // Thanh tiến độ thời gian song song bên dưới
  mid(ctx,'TIẾN ĐỘ THỜI GIAN',bx,y+234,16.5,C.navy,700,'left');
  fitMid(ctx,`${fmtPct(m.timeProgress,2)}  (${m.day}/${m.totalDays} ngày)`,x+w-31,y+234,215,17,C.blue,700,'right',14);
  progress(ctx,bx,y+251,bw,20,m.timeProgress,C.blue);

  // Dòng kết luận so với tiến độ thời gian
const diff = m.total - m.timeProgress;
const st = status(diff);

const absDiff = Math.abs(diff).toLocaleString(
  'vi-VN',
  {
    minimumFractionDigits:2,
    maximumFractionDigits:2
  }
);

let paceText = '';

if(Math.abs(diff) < 0.005){
  paceText = 'KỊP TIẾN ĐỘ';
}
else if(diff > 0){
  paceText = `VƯỢT ${absDiff} ĐIỂM % SO VỚI TIẾN ĐỘ THỜI GIAN`;
}
else{
  paceText = `CHẬM ${absDiff} ĐIỂM % SO VỚI TIẾN ĐỘ THỜI GIAN`;
}

fitMid(
  ctx,
  paceText,
  x+w/2,
  y+307,
  w-58,
  18,
  st.color,
  700,
  'center',
  14.5
);
}
function drawLegend(ctx,m){
  const x=703,y=511,w=475,h=272;
  rr(ctx,x,y,w,h,12,'#fff','#d6dce5',2.2);
  ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,48,[12,12,0,0]);ctx.fillStyle=C.navy;ctx.fill();ctx.restore();
  mid(ctx,'CHÚ THÍCH',x+w/2,y+24,21,'#fff');

  const rows=[
    [C.green,'Vượt nhiều','> +10 điểm %'],
    [C.blue,'Kịp','0 đến +10 điểm %'],
    [C.orange,'Chậm','−10 đến < 0 điểm %'],
    [C.red,'Chậm nhiều','< −10 điểm %']
  ];
  const top=y+58,rowH=45;
  rows.forEach((r,i)=>{
    const cy=top+i*rowH+13;
    rr(ctx,x+24,cy-10,20,20,4,r[0]);
    mid(ctx,r[1],x+61,cy,18,C.ink,700,'left');
    fitMid(ctx,r[2],x+w-26,cy,195,16,C.ink,700,'right',14);
  });
  mid(ctx,'Chênh lệch = HTTG − tiến độ thời gian',x+26,y+h-23,15,C.muted,700,'left');
}
function groupText(arr){
  if(!arr.length)return 'Không có showroom.';
  return arr.map(r=>`${r.code} (${fmtPct(r.pct,2)})`).join(', ')+'.';
}
function drawComments(ctx,m){
  const x=703,y=794,w=475,h=414;
  rr(ctx,x,y,w,h,12,'#fff','#d6dce5',2.2);
  ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,48,[12,12,0,0]);ctx.fillStyle=C.navy;ctx.fill();ctx.restore();
  mid(ctx,'NHẬN XÉT',x+w/2,y+24,21,'#fff');

  const top5=m.sorted.slice(0,5);
  const onTrack=m.sorted.filter(r=>r.diff>=0);
  const slow=m.groups.orange;
  const critical=m.groups.red;
  const defs=[
    {color:C.purple2,type:'star',title:'NHÓM DẪN ĐẦU',body:`${groupText(top5)} Duy trì nhịp bán và bảo vệ thứ hạng.`},
    {color:C.greenDark,type:'target',title:'NHÓM KỊP / VƯỢT TIẾN ĐỘ',body:`${groupText(onTrack)} Tiếp tục bám mục tiêu và gia tăng khoảng cách.`},
    {color:C.orange,type:'chart',title:'NHÓM CẦN THÚC ĐẨY',body:`${groupText(slow)} Cần tăng tốc để quay lại đúng tiến độ thời gian.`},
    {color:C.red,type:'warn',title:'NHÓM CHẬM NHIỀU',body:`${groupText(critical)} Ưu tiên hành động ngay và theo dõi sát hằng ngày.`}
  ];

  const contentTop=y+54,contentBottom=y+h-9,contentH=contentBottom-contentTop;
  const layouts=defs.map(g=>{
    const lines=wrapLines(ctx,g.body,w-94,12.4,700,3);
    // Chiều cao thật của nội dung: tiêu đề + các dòng mô tả
    const natural=28 + lines.length*16;
    return {g,lines,natural};
  });
  const naturalTotal=layouts.reduce((s,a)=>s+a.natural,0);
  const extra=Math.max(0,contentH-naturalTotal);
  const extraEach=extra/layouts.length;
  let yy=contentTop;

  layouts.forEach((it,i)=>{
    let gh=it.natural+extraEach;
    if(i===layouts.length-1)gh=contentBottom-yy;
    if(i)line(ctx,x+18,yy,x+w-18,yy,'#e1e5e9',1);

    const iconY=yy+gh/2;
    iconBadge(ctx,x+31,iconY,it.g.color,it.g.type);

    // Nội dung được đặt giữa theo chiều cao từng hạng để các hạng dàn đều
    const textH=22 + it.lines.length*16;
    const textTop=yy+(gh-textH)/2;
    txt(ctx,it.g.title,x+60,textTop,15.6,it.g.color,700);
    it.lines.forEach((l,j)=>txt(ctx,l,x+60,textTop+23+j*16,12.4,C.ink,700));
    yy+=gh;
  });
}
function drawFooter(ctx){
  const y=1217;
  ctx.fillStyle=C.footer;ctx.fillRect(0,y,BASE.w,63);
  circle(ctx,69,y+31,25,'#e8292d');circle(ctx,69,y+31,16,'#fff');circle(ctx,69,y+31,8,'#188bd8');line(ctx,69,y+31,86,y+14,'#188bd8',5);
  txt(ctx,'MỤC TIÊU CHUNG:',115,y+11,15,'#fff',700);
  txt(ctx,'Hoàn thành 100% kế hoạch',115,y+31,13,'#fff',700);
  line(ctx,345,y+9,345,y+54,'#c2c8d0',1);
  drawTrophy(ctx,397,y+31,45);
  fit(ctx,'ĐOÀN KẾT – KỶ LUẬT – QUYẾT TÂM – VỀ ĐÍCH!',449,y+16,640,24,'#ffc928',700,'left',20);
  drawChart(ctx,1141,y+44,62);
}
function drawDashboard(ctx,m){
  ctx.save();ctx.fillStyle=C.navy;ctx.fillRect(0,0,BASE.w,BASE.h);ctx.restore();
  drawHeader(ctx,m);drawLeft(ctx,m);drawSystemCard(ctx,m);drawLegend(ctx,m);drawComments(ctx,m);drawFooter(ctx);
}
function fitPreview(){
  const maxW=Math.max(320,els.scroll.clientWidth-34),maxH=Math.max(400,els.scroll.clientHeight-34);
  const s=Math.min(maxW/BASE.w,maxH/BASE.h,1);
  const w=Math.round(BASE.w*s),h=Math.round(BASE.h*s);
  els.canvas.style.width=w+'px';els.canvas.style.height=h+'px';els.wrap.style.width=w+'px';els.wrap.style.height=h+'px';
}
function render(){
  const c=els.canvas;c.width=BASE.w;c.height=BASE.h;
  drawDashboard(c.getContext('2d',{alpha:false}),model);fitPreview();
}
function run(show=true){
  try{
    model=parseData(els.data.value);
    localStorage.setItem(STORAGE,JSON.stringify({data:els.data.value,date:els.date.value}));
    renderValidation();render();
    if(show){
      if(model.issues.length)showIssues();else toast('Dữ liệu hợp lệ • BXH đã cập nhật');
    }
  }catch(e){
    model=null;els.export2k.disabled=true;els.export4k.disabled=true;
    els.validation.innerHTML=`<div class="err">✕ ${esc(e.message)}</div>`;
    if(show){els.modalBadge.textContent='DỮ LIỆU KHÔNG HỢP LỆ';els.modalTitle.textContent='Không thể tạo BXH';els.modalSummary.textContent=e.message;els.modalIssues.innerHTML='';els.modal.classList.add('show');}
  }
}
function blob(canvas){return new Promise((res,rej)=>canvas.toBlob(b=>b?res(b):rej(new Error('Không tạo được PNG')),'image/png'))}
function download(b,name){const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},900)}
async function exportPng(spec,btn){
  if(!model)return;
  const errs=model.issues.filter(x=>x.type==='err');if(errs.length){showIssues();return}
  const old=btn.innerHTML;
  try{
    els.export2k.disabled=true;els.export4k.disabled=true;btn.innerHTML=`<strong>Đang xuất ${spec.tag}…</strong><small>${spec.w} × ${spec.h}</small>`;
    const c=document.createElement('canvas');c.width=spec.w;c.height=spec.h;
    const ctx=c.getContext('2d',{alpha:false});ctx.setTransform(spec.w/BASE.w,0,0,spec.h/BASE.h,0,0);drawDashboard(ctx,model);
    const b=await blob(c);download(b,`BXH-Doanh-So-16-Showroom-${iso(model.closing)}-${spec.tag}.png`);toast(`Đã xuất PNG ${spec.tag}`);
  }catch(e){console.error(e);toast('Xuất ảnh thất bại')}
  finally{btn.innerHTML=old;renderValidation()}
}
function load(){
  try{const s=JSON.parse(localStorage.getItem(STORAGE)||'{}');els.data.value=s.data||SAMPLE;els.date.value=s.date||''}catch(_){els.data.value=SAMPLE}
}

els.parse.addEventListener('click',()=>run(true));
els.sample.addEventListener('click',()=>{els.data.value=SAMPLE;els.date.value='';run(true)});
els.date.addEventListener('change',()=>run(false));
els.export2k.addEventListener('click',()=>exportPng(EXPORT_2K,els.export2k));
els.export4k.addEventListener('click',()=>exportPng(EXPORT_4K,els.export4k));
els.modalClose.addEventListener('click',closeModal);els.modalOk.addEventListener('click',closeModal);els.modal.addEventListener('click',e=>{if(e.target===els.modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});window.addEventListener('resize',fitPreview);

load();run(false);
})();
