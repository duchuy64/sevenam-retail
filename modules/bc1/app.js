(() => {
'use strict';

const BASE={w:1023,h:1537};
const EXPORT_2K={w:2046,h:3074,tag:'2K'};
const EXPORT_4K={w:4092,h:6148,tag:'4K'};
const STORAGE='sevenam-bxh-daily-v6';
const WORK_START=8;
const WORK_TOTAL=13.5;

const C={
  navy:'#061543',navy2:'#0b2668',navy3:'#123878',white:'#ffffff',paper:'#fbfcff',ink:'#07143d',muted:'#56617a',
  line:'#d9dee6',track:'#edf0f2',purple:'#5a149d',purpleDark:'#431076',green:'#55b52c',greenDark:'#1f952f',blue:'#188bd8',
  orange:'#f59e0b',red:'#ee1717',gray:'#747a83',gold:'#f5b51b',gold2:'#ef8b00',footer:'#041438'
};

const FIXED=[
  {code:'HĐ',name:'Hà Đông',aliases:['HĐ','HD','HA DONG']},
  {code:'TĐT',name:'Tôn Đức Thắng',aliases:['TĐT','TDT','TON DUC THANG']},
  {code:'TB',name:'Thái Bình',aliases:['TB','THAI BINH']},
  {code:'VP',name:'Vĩnh Phúc',aliases:['VP','VINH PHUC']},
  {code:'VI',name:'Vinh',aliases:['VI','VINH']},
  {code:'TDH',name:'Trần Duy Hưng',aliases:['TDH','TRAN DUY HUNG']},
  {code:'LH',name:'Láng Hạ',aliases:['LH','LANG HA']},
  {code:'HP',name:'Hải Phòng',aliases:['HP','HAI PHONG']},
  {code:'NĐ',name:'Nam Định',aliases:['NĐ','ND','NAM DINH']},
  {code:'THO',name:'Thanh Hóa',aliases:['THO','THANH HOA']},
  {code:'NB',name:'Ninh Bình',aliases:['NB','NINH BINH']},
  {code:'HAD',name:'Hải Dương',aliases:['HAD','HAI DUONG']},
  {code:'TN',name:'Thái Nguyên',aliases:['TN','THAI NGUYEN']},
  {code:'LLQ',name:'Lạc Long Quân',aliases:['LLQ','LAC LONG QUAN']},
  {code:'HOB',name:'Hòa Bình',aliases:['HOB','HOA BINH']},
  {code:'VT',name:'Việt Trì',aliases:['VT','VIET TRI']}
];

const SAMPLE=`| **Khung giờ** | **17** |
| :-----------: | :----: |
| **SR** | **% Hoàn thành TG ngày** |
| **HĐ** | **50,00%** |
| **TĐT** | **60,00%** |
| **TB** | **55,00%** |
| **VP** | **33,00%** |
| **VI** | **66,00%** |
| **TDH** | **44,00%** |
| **LH** | **88,00%** |
| **HP** | **99,00%** |
| **NĐ** | **11,00%** |
| **THO** | **22,00%** |
| **NB** | **33,00%** |
| **HAD** | **44,00%** |
| **TN** | **55,00%** |
| **LLQ** | **25,00%** |
| **HOB** | **88,00%** |
| **VT** | **136,00%** |
| **Tổng** | **99,00%** |`;

const $=id=>document.getElementById(id);
const els={
  data:$('dataInput'),parse:$('parseBtn'),sample:$('sampleBtn'),time:$('timeOverride'),date:$('reportDate'),
  export2k:$('export2k'),export4k:$('export4k'),validation:$('validation'),canvas:$('canvas'),wrap:$('canvasWrap'),scroll:$('scroll'),meta:$('meta'),toast:$('toast'),
  modal:$('modal'),modalBadge:$('modalBadge'),modalTitle:$('modalTitle'),modalSummary:$('modalSummary'),modalIssues:$('modalIssues'),modalClose:$('modalClose'),modalOk:$('modalOk')
};
let model=null;

function strip(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toUpperCase().trim();}
function clean(s){return String(s??'').replace(/\*\*/g,'').replace(/__/g,'').replace(/`/g,'').replace(/<[^>]*>/g,'').trim();}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function clamp(v,a,b){return Math.min(b,Math.max(a,v));}
function fmtPct(v,d=1){return (Number(v)||0).toLocaleString('vi-VN',{minimumFractionDigits:d,maximumFractionDigits:d})+'%';}
function fmtPctSmart(v){const n=Number(v)||0;const d=Math.abs(n-Math.round(n))<.045?0:1;return fmtPct(n,d);}
function fmtNum(v,d=1){return (Number(v)||0).toLocaleString('vi-VN',{minimumFractionDigits:d,maximumFractionDigits:d});}
function pad2(n){return String(n).padStart(2,'0');}
function dateVN(d){return `${pad2(d.getDate())}/${pad2(d.getMonth()+1)}/${d.getFullYear()}`;}
function iso(d){return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;}
function splitLine(line){
  const s=String(line||'');
  if(s.includes('|'))return s.split('|').map(clean).filter(Boolean);
  if(s.includes('\t'))return s.split('\t').map(clean);
  if(s.includes(';'))return s.split(';').map(clean);
  return s.trim().split(/\s{2,}/).map(clean);
}
function isSeparatorLine(line){return /^[\s|:\-]+$/.test(String(line||''));}
function parseNumberToken(raw){
  let s=clean(raw).replace(/%/g,'').replace(/\s/g,'');
  const m=s.match(/-?\d[\d.,]*/);
  if(!m)return NaN;
  s=m[0];
  if(s.includes(',')&&s.includes('.')){
    if(s.lastIndexOf(',')>s.lastIndexOf('.'))s=s.replace(/\./g,'').replace(',','.');
    else s=s.replace(/,/g,'');
  }else if(s.includes(',')){
    const parts=s.split(',');
    s=parts.length===2?parts[0]+'.'+parts[1]:s.replace(/,/g,'');
  }else if((s.match(/\./g)||[]).length>1){
    const parts=s.split('.');
    const last=parts.pop();
    s=(last.length<=2?parts.join('')+'.'+last:parts.join('')+last);
  }
  const n=Number(s);
  return Number.isFinite(n)?n:NaN;
}
function extractNumbers(s){
  const matches=clean(s).match(/-?\d[\d.,]*/g)||[];
  return matches.map(parseNumberToken).filter(Number.isFinite);
}
function canonicalFromText(text){
  const n=' '+strip(text).replace(/[^A-Z0-9 ]/g,' ')+' ';
  let best=null,bestLen=-1;
  FIXED.forEach(store=>store.aliases.forEach(alias=>{
    const a=strip(alias);
    const re=new RegExp(`(^|\\s)${a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(?=\\s|$)`);
    if(re.test(n)&&a.length>bestLen){best=store;bestLen=a.length;}
  }));
  return best;
}
function extractStoreValue(line,store){
  const cells=splitLine(line);
  let si=-1;
  for(let i=0;i<cells.length;i++){
    const c=canonicalFromText(cells[i]);
    if(c&&c.code===store.code){si=i;break;}
  }
  if(si>=0){
    // Ưu tiên ô có dấu % sau mã showroom.
    for(let i=si+1;i<cells.length;i++)if(cells[i].includes('%')){
      const n=parseNumberToken(cells[i]); if(Number.isFinite(n)&&n>=0&&n<=9999)return n;
    }
    // Nếu thiếu %, lấy số hợp lệ cuối cùng sau mã showroom.
    for(let i=cells.length-1;i>si;i--){
      const nums=extractNumbers(cells[i]);
      if(nums.length){const n=nums[nums.length-1];if(n>=0&&n<=9999)return n;}
    }
  }
  // Fallback: lấy số cuối dòng, bỏ số STT đầu dòng.
  const nums=extractNumbers(line);
  if(!nums.length)return NaN;
  const n=nums[nums.length-1];
  return n>=0&&n<=9999?n:NaN;
}
function isTotalLine(line){
  const cells=splitLine(line).map(strip);
  if(cells.some(c=>c==='TONG'||c==='TOTAL'||c==='TONG HE THONG'||c==='TONG CONG'))return true;
  return /(^|\s)TONG($|\s)/.test(strip(line).replace(/[^A-Z0-9 ]/g,' '));
}
function extractTotal(line){
  const cells=splitLine(line);
  for(let i=0;i<cells.length;i++)if(cells[i].includes('%')){const n=parseNumberToken(cells[i]);if(Number.isFinite(n))return n;}
  const nums=extractNumbers(line);return nums.length?nums[nums.length-1]:NaN;
}
function parseClockToken(raw){
  const s=clean(raw).toLowerCase().replace(/giờ/g,'h').replace(/gio/g,'h').trim();
  let m=s.match(/(?:^|\D)(\d{1,2})\s*[:h]\s*(\d{1,2})(?:\D|$)/);
  if(m){const h=+m[1],min=+m[2];if(h>=0&&h<=23&&min>=0&&min<60)return h+min/60;}
  m=s.match(/(?:^|\D)(\d{1,2}(?:[.,]\d+)?)\s*h?(?:\D|$)/);
  if(m){const h=Number(m[1].replace(',','.'));if(h>=0&&h<=23.99)return h;}
  return NaN;
}
function detectReportHour(text){
  if(clean(els.time.value)){
    const h=parseClockToken(els.time.value);
    if(Number.isFinite(h))return {hour:h,source:'Mốc giờ nhập thủ công'};
  }
  const lines=String(text||'').replace(/\r/g,'').split('\n');
  const keys=['KHUNG GIO','MOC GIO','GIO BAO CAO','THOI DIEM','CAP NHAT','CHOT LUC','CHOT GIO'];
  for(const line of lines){
    const n=strip(line);
    if(keys.some(k=>n.includes(k))){
      const h=parseClockToken(line);
      if(Number.isFinite(h))return {hour:h,source:'Tự nhận diện từ dữ liệu'};
    }
  }
  const now=new Date();
  return {hour:now.getHours()+now.getMinutes()/60,source:'Không thấy mốc giờ: tạm dùng giờ hiện tại trên máy',fallback:true};
}
function detectReportDate(text){
  if(els.date.value){const d=new Date(els.date.value+'T00:00:00');if(!Number.isNaN(d.getTime()))return {date:d,source:'Ngày nhập thủ công'};}
  const s=String(text||'');
  let m=s.match(/\b(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})\b/);
  if(m){const d=new Date(+m[3],+m[2]-1,+m[1]);if(!Number.isNaN(d.getTime()))return {date:d,source:'Tự nhận diện ngày từ dữ liệu'};}
  const now=new Date();return {date:new Date(now.getFullYear(),now.getMonth(),now.getDate()),source:'Ngày hiện tại trên máy'};
}
function formatClock(hour){
  let h=Math.floor(hour),m=Math.round((hour-h)*60);
  if(m===60){h++;m=0;}
  return `${pad2((h+24)%24)}:${pad2(m)}`;
}
function stateFor(pct,timeProgress){
  if(pct<=0)return {key:'gray',label:'CHƯA PHÁT SINH',short:'Chưa phát sinh doanh thu',color:C.gray};
  const diff=pct-timeProgress;
  if(diff < -10)return {key:'red',label:'CHẬM NHIỀU',short:'Chậm nhiều',color:C.red};
  if(diff < 0)return {key:'orange',label:'CHẬM',short:'Chậm',color:C.orange};
  if(diff <= 10)return {key:'blue',label:'KỊP',short:'Kịp',color:C.blue};
  return {key:'green',label:'VƯỢT NHIỀU',short:'Vượt nhiều',color:C.green};
}
function parseData(text){
  const lines=String(text||'').replace(/\r/g,'').split('\n').filter(x=>x.trim()&&!isSeparatorLine(x));
  if(!lines.length)throw new Error('Chưa có dữ liệu để phân tích.');
  const issues=[],found=new Map();let total=NaN,totalLines=0;

  lines.forEach((line,idx)=>{
    if(isTotalLine(line)){
      const n=extractTotal(line);totalLines++;
      if(Number.isFinite(n))total=n; else issues.push({type:'err',text:`Dòng ${idx+1}: nhận ra dòng Tổng nhưng không tìm thấy giá trị hoàn thành.`});
      return;
    }
    const store=canonicalFromText(line);if(!store)return;
    const value=extractStoreValue(line,store);
    if(!Number.isFinite(value)){
      issues.push({type:'err',text:`Dòng ${idx+1}: nhận ra ${store.code} nhưng không tìm thấy % hoàn thành TG ngày.`});return;
    }
    if(found.has(store.code))issues.push({type:'err',text:`Trùng showroom ${store.code}. Tool đang dùng giá trị xuất hiện sau cùng: ${fmtPctSmart(value)}.`});
    found.set(store.code,{...store,pct:value,sourceLine:idx+1});
  });

  FIXED.filter(s=>!found.has(s.code)).forEach(s=>issues.push({type:'err',text:`Thiếu showroom ${s.code} – ${s.name}.`}));
  if(found.size!==16)issues.push({type:'err',text:`Tool cố định 16 showroom nhưng hiện đọc được ${found.size}/16 showroom.`});
  if(totalLines>1)issues.push({type:'warn',text:`Phát hiện ${totalLines} dòng có chữ “Tổng”. Tool dùng giá trị Tổng xuất hiện sau cùng.`});
  if(!Number.isFinite(total))issues.push({type:'err',text:'Thiếu dòng Tổng hệ thống. Cần có Tổng để tính đúng tiến độ toàn hệ thống/ngày.'});

  const rt=detectReportHour(text),rd=detectReportDate(text);
  if(clean(els.time.value)&&!Number.isFinite(parseClockToken(els.time.value)))issues.push({type:'err',text:'Mốc giờ nhập thủ công không hợp lệ. Ví dụ hợp lệ: 17, 17:00 hoặc 17:30.'});
  if(rt.fallback)issues.push({type:'warn',text:'Không tìm thấy “Khung giờ” trong dữ liệu nên tool tạm dùng giờ hiện tại trên máy. Nên nhập mốc giờ thủ công để báo cáo chính xác.'});
  if(rt.hour<WORK_START||rt.hour>WORK_START+WORK_TOTAL)issues.push({type:'warn',text:`Mốc ${formatClock(rt.hour)} nằm ngoài khung vận hành 08:00–21:30. Tiến độ thời gian sẽ được giới hạn trong 0–100%.`});

  const elapsed=clamp(rt.hour-WORK_START,0,WORK_TOTAL);
  const timeProgress=elapsed/WORK_TOTAL*100;
  const rows=FIXED.map(s=>{
    const r=found.get(s.code),pct=r?r.pct:0,diff=pct-timeProgress,st=stateFor(pct,timeProgress);
    return {...s,pct,diff,status:st,missing:!r};
  });
  const fixedOrder=new Map(FIXED.map((s,i)=>[s.code,i]));
  const sorted=[...rows].sort((a,b)=>b.pct-a.pct || fixedOrder.get(a.code)-fixedOrder.get(b.code));
  const groups={green:[],blue:[],orange:[],red:[],gray:[]};
  sorted.forEach(r=>groups[r.status.key].push(r));
  const totalDiff=Number.isFinite(total)?total-timeProgress:0,totalState=stateFor(Number.isFinite(total)?total:0,timeProgress);
  const achievedCount=groups.green.length+groups.blue.length;

// CHẬM TIẾN ĐỘ = Chậm + Chậm nhiều + Chưa phát sinh
const slowCount=groups.orange.length+groups.red.length+groups.gray.length;

const zeroCount=groups.gray.length;

const achievedPct=achievedCount/FIXED.length*100;
const slowPct=slowCount/FIXED.length*100;

  return {rows,sorted,total,groups,issues,reportHour:rt.hour,timeSource:rt.source,reportDate:rd.date,dateSource:rd.source,elapsed,timeProgress,totalDiff,totalState,achievedCount,slowCount,zeroCount,achievedPct,slowPct};
}

function renderValidation(){
  const m=model,errs=m.issues.filter(x=>x.type==='err'),warns=m.issues.filter(x=>x.type==='warn'),out=[];
  out.push(`<div class="ok">✓ Đọc ${m.rows.filter(x=>!x.missing).length}/16 showroom cố định</div>`);
  out.push(`<div class="ok">✓ Mốc báo cáo: ${formatClock(m.reportHour)} • ${fmtNum(m.elapsed,1)}/${fmtNum(WORK_TOTAL,1)} giờ = ${fmtPct(m.timeProgress,1)}</div>`);
  if(Number.isFinite(m.total))out.push(`<div class="ok">✓ Tổng hệ thống/ngày: ${fmtPctSmart(m.total)} • Chênh lệch: ${m.totalDiff>=0?'+':''}${fmtPct(m.totalDiff,1)}</div>`);
  out.push(`<div class="muted">Nguồn giờ: ${esc(m.timeSource)} • Ngày: ${dateVN(m.reportDate)} (${esc(m.dateSource)})</div>`);
  if(errs.length||warns.length)out.push(`<div class="section">${errs.length} lỗi • ${warns.length} cảnh báo</div>`);
  [...errs,...warns].forEach(x=>out.push(`<div class="${x.type}">${x.type==='err'?'✕':'⚠'} ${esc(x.text)}</div>`));
  if(!errs.length&&!warns.length)out.push('<div class="ok">✓ Dữ liệu hợp lệ, có thể xuất ảnh.</div>');
  els.validation.innerHTML=out.join('');
  els.meta.textContent=`16 showroom • ${formatClock(m.reportHour)} • ${errs.length} lỗi • ${warns.length} cảnh báo`;
  els.export2k.disabled=errs.length>0;els.export4k.disabled=errs.length>0;
}
function showIssues(){
  const errs=model.issues.filter(x=>x.type==='err'),warns=model.issues.filter(x=>x.type==='warn');if(!errs.length&&!warns.length)return;
  els.modalBadge.textContent=errs.length?'PHÁT HIỆN LỖI':'CÓ CẢNH BÁO';
  els.modalTitle.textContent=errs.length?'Dữ liệu chưa đủ để xuất ảnh':'Có dữ liệu cần kiểm tra';
  els.modalSummary.textContent=`${errs.length} lỗi • ${warns.length} cảnh báo. ${errs.length?'Hãy sửa lỗi trước khi xuất ảnh.':'Dashboard vẫn có thể xuất.'}`;
  els.modalIssues.innerHTML=[...errs,...warns].map(x=>`<div class="issue ${x.type}">${x.type==='err'?'✕':'⚠'} ${esc(x.text)}</div>`).join('');
  els.modal.classList.add('show');els.modal.setAttribute('aria-hidden','false');
}
function closeModal(){els.modal.classList.remove('show');els.modal.setAttribute('aria-hidden','true');}
function toast(s){els.toast.textContent=s;els.toast.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>els.toast.classList.remove('show'),1800);}

// ===== CANVAS HELPERS =====
// Dashboard uses the same font family as the original monthly tool.
const FONT='Arial, sans-serif';
function font(ctx,size,w=700){ctx.font=`${w>=600?700:400} ${size}px ${FONT}`;ctx.textBaseline='top';}
function txt(ctx,s,x,y,size=16,color=C.ink,w=700,align='left'){ctx.save();font(ctx,size,w);ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(String(s),x,y);ctx.restore();}
function mid(ctx,s,x,y,size=16,color=C.ink,w=700,align='center'){ctx.save();ctx.font=`${w>=600?700:400} ${size}px ${FONT}`;ctx.textBaseline='middle';ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(String(s),x,y);ctx.restore();}
function fit(ctx,s,x,y,maxW,size,color=C.ink,w=700,align='left',min=9){let z=size;ctx.save();while(z>min){font(ctx,z,w);if(ctx.measureText(String(s)).width<=maxW)break;z-=.5;}ctx.restore();txt(ctx,s,x,y,z,color,w,align);}
function fitMid(ctx,s,x,y,maxW,size,color=C.ink,w=700,align='center',min=9){let z=size;ctx.save();while(z>min){ctx.font=`${w>=600?700:400} ${z}px ${FONT}`;if(ctx.measureText(String(s)).width<=maxW)break;z-=.5;}ctx.restore();mid(ctx,s,x,y,z,color,w,align);}
function fitMidOutlined(ctx,s,x,y,maxW,size,fill=C.ink,stroke='#07143d',strokeW=1.15,w=700,align='center',min=9){let z=size;ctx.save();while(z>min){ctx.font=`${w>=600?700:400} ${z}px ${FONT}`;if(ctx.measureText(String(s)).width<=maxW)break;z-=.5;}ctx.font=`${w>=600?700:400} ${z}px ${FONT}`;ctx.textBaseline='middle';ctx.textAlign=align;ctx.lineJoin='round';ctx.strokeStyle=stroke;ctx.lineWidth=strokeW;ctx.strokeText(String(s),x,y);ctx.fillStyle=fill;ctx.fillText(String(s),x,y);ctx.restore();}
function rr(ctx,x,y,w,h,r,fill,stroke=null,lw=1){ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}ctx.restore();}
function line(ctx,x1,y1,x2,y2,color,lw=1){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();}
function circle(ctx,x,y,r,fill,stroke=null,lw=1){ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}ctx.restore();}
function progress(ctx,x,y,w,h,pct,color,marker=null){
  rr(ctx,x,y,w,h,h/2,C.track);
  const fw=w*clamp(pct,0,100)/100;
  if(fw>0)rr(ctx,x,y,fw,h,h/2,color);
  if(Number.isFinite(marker)){
    const mx=x+w*clamp(marker,0,100)/100;
    ctx.save();ctx.strokeStyle='#9aa3af';ctx.lineWidth=2.4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(mx,y-3);ctx.lineTo(mx,y+h+3);ctx.stroke();ctx.restore();
  }
}
function panelHead(ctx,x,y,w,h,title){ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,[10,10,0,0]);ctx.fillStyle=C.navy;ctx.fill();ctx.restore();if(title)fitMid(ctx,title,x+w/2,y+h/2,w-18,22,'#fff',700,'center',15);}

function drawGrowthIcon(ctx,cx,cy,s){
  ctx.save();
  ctx.lineCap='round';
  ctx.lineJoin='round';

  // ===== SHADOW =====
  // Giữ đổ bóng để icon có chiều sâu,
  // nhưng hơi gọn hơn để không bị cảm giác "lơ lửng".
  ctx.globalAlpha=.11;
  ctx.fillStyle='#061543';
  ctx.beginPath();
  ctx.ellipse(
    cx,
    cy+s*.43,
    s*.46,
    s*.085,
    0,
    0,
    Math.PI*2
  );
  ctx.fill();
  ctx.globalAlpha=1;

  // ===== BADGE TRÒN =====
  circle(
    ctx,
    cx,
    cy-s*.02,
    s*.46,
    '#ffffff',
    '#d8dfec',
    s*.017
  );

  // ===== GRADIENT CỘT =====
  const blue=ctx.createLinearGradient(
    cx-s*.34,
    cy+s*.20,
    cx+s*.22,
    cy-s*.26
  );

  blue.addColorStop(0,'#0b2f73');
  blue.addColorStop(1,'#188bd8');

  const gold=ctx.createLinearGradient(
    cx-s*.10,
    cy+s*.18,
    cx+s*.34,
    cy-s*.20
  );

  gold.addColorStop(0,'#f59e0b');
  gold.addColorStop(1,'#ffd24a');

  // ===== 3 CỘT =====
  rr(
    ctx,
    cx-s*.29,
    cy+s*.06,
    s*.13,
    s*.22,
    s*.025,
    blue
  );

  rr(
    ctx,
    cx-s*.08,
    cy-s*.05,
    s*.13,
    s*.33,
    s*.025,
    blue
  );

  rr(
    ctx,
    cx+s*.13,
    cy-s*.18,
    s*.13,
    s*.46,
    s*.025,
    gold
  );

  // ===== BASELINE =====
  line(
    ctx,
    cx-s*.34,
    cy+s*.30,
    cx+s*.34,
    cy+s*.30,
    '#aeb9ca',
    s*.018
  );

  // ===== ĐƯỜNG TĂNG TRƯỞNG =====
  const green='#1f952f';

  ctx.save();
  ctx.strokeStyle=green;

  // Bản cũ .055 hơi nặng.
  // .047 vẫn rõ nhưng cân hơn với các cột.
  ctx.lineWidth=s*.047;
  ctx.lineCap='round';
  ctx.lineJoin='round';

  ctx.beginPath();

  ctx.moveTo(
    cx-s*.30,
    cy-s*.03
  );

  ctx.lineTo(
    cx-s*.10,
    cy-s*.18
  );

  ctx.lineTo(
    cx+s*.05,
    cy-s*.09
  );

  ctx.lineTo(
    cx+s*.285,
    cy-s*.325
  );

  ctx.stroke();

  // ===== ĐẦU MŨI TÊN =====
  // Điểm quan trọng:
  // tam giác được xoay đúng theo hướng của đoạn tăng cuối,
  // không còn cảm giác méo/lệch như bản cũ.
  ctx.fillStyle=green;

  ctx.beginPath();

  // Tip
  ctx.moveTo(
    cx+s*.315,
    cy-s*.355
  );

  // Góc dưới/phải
  ctx.lineTo(
    cx+s*.275,
    cy-s*.205
  );

  // Góc trên/trái
  ctx.lineTo(
    cx+s*.165,
    cy-s*.295
  );

  ctx.closePath();
  ctx.fill();

  ctx.restore();


  // ===== DẤU "+" ĐIỂM NHẤN =====
  // Vẫn giữ dấu +, nhưng:
  // - nhỏ hơn
  // - hai nhánh cân nhau
  // - cách cột vàng một khoảng rõ ràng
  // - không sát viền badge
  //
  // Nhìn vào sẽ hiểu đây là accent có chủ ý,
  // không phải phần tử bị đặt sai vị trí.
  const plusX = cx+s*.315;
  const plusY = cy+s*.015;
  const plusR = s*.052;

  ctx.save();

  ctx.strokeStyle='#f5b51b';
  ctx.lineWidth=s*.022;
  ctx.lineCap='round';

  // Nhánh dọc
  ctx.beginPath();
  ctx.moveTo(
    plusX,
    plusY-plusR
  );
  ctx.lineTo(
    plusX,
    plusY+plusR
  );
  ctx.stroke();

  // Nhánh ngang
  ctx.beginPath();
  ctx.moveTo(
    plusX-plusR,
    plusY
  );
  ctx.lineTo(
    plusX+plusR,
    plusY
  );
  ctx.stroke();

  ctx.restore();

  ctx.restore();
}
function drawMedal(ctx,cx,cy,rank){
  // Huy chương 2D gọn: không glow/đổ bóng, số ở giữa luôn rõ.
  const pal=rank===1?{fill:'#f5b51b',edge:'#b87500',text:'#5f3900'}:rank===2?{fill:'#aeb6c0',edge:'#6d7781',text:'#26313c'}:{fill:'#b85a2b',edge:'#7b3217',text:'#ffffff'};
  ctx.save();ctx.lineJoin='round';
  // Ribbon nhỏ, nằm gọn phía trên vòng huy chương để không che số.
  ctx.fillStyle=pal.edge;
  ctx.beginPath();ctx.moveTo(cx-8,cy-12);ctx.lineTo(cx-3,cy-20);ctx.lineTo(cx+1,cy-12);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(cx+2,cy-12);ctx.lineTo(cx+7,cy-20);ctx.lineTo(cx+10,cy-12);ctx.closePath();ctx.fill();
  circle(ctx,cx,cy,14.5,pal.fill,pal.edge,2);
  mid(ctx,rank,cx,cy+.5,15.5,pal.text,700);
  ctx.restore();
}
function drawCalendar(ctx,cx,cy,s,color='#fff'){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=s*.075;ctx.lineCap='round';rr(ctx,cx-s*.42,cy-s*.32,s*.84,s*.68,s*.07,null,color,s*.065);line(ctx,cx-s*.42,cy-s*.10,cx+s*.42,cy-s*.10,color,s*.065);line(ctx,cx-s*.20,cy-s*.43,cx-s*.20,cy-s*.25,color,s*.065);line(ctx,cx+s*.20,cy-s*.43,cx+s*.20,cy-s*.25,color,s*.065);for(const dx of [-.20,0,.20])for(const dy of [.07,.25])circle(ctx,cx+s*dx,cy+s*dy,s*.035,color);ctx.restore();}
function drawClock(ctx,cx,cy,s,color=C.navy){circle(ctx,cx,cy,s*.40,null,color,s*.075);line(ctx,cx,cy,cx,cy-s*.23,color,s*.075);line(ctx,cx,cy,cx+s*.19,cy+s*.10,color,s*.075);}
function drawArrow(ctx,cx,cy,s,color='#fff',up=true){ctx.save();ctx.fillStyle=color;ctx.beginPath();if(up){ctx.moveTo(cx,cy-s*.48);ctx.lineTo(cx+s*.36,cy-s*.06);ctx.lineTo(cx+s*.14,cy-s*.06);ctx.lineTo(cx+s*.14,cy+s*.48);ctx.lineTo(cx-s*.14,cy+s*.48);ctx.lineTo(cx-s*.14,cy-s*.06);ctx.lineTo(cx-s*.36,cy-s*.06);}else{ctx.moveTo(cx,cy+s*.48);ctx.lineTo(cx+s*.36,cy+s*.06);ctx.lineTo(cx+s*.14,cy+s*.06);ctx.lineTo(cx+s*.14,cy-s*.48);ctx.lineTo(cx-s*.14,cy-s*.48);ctx.lineTo(cx-s*.14,cy+s*.06);ctx.lineTo(cx-s*.36,cy+s*.06);}ctx.closePath();ctx.fill();ctx.restore();}
function drawCheck(ctx,cx,cy,s,color=C.green){circle(ctx,cx,cy,s*.45,color);ctx.save();ctx.strokeStyle='#fff';ctx.lineWidth=s*.10;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(cx-s*.20,cy);ctx.lineTo(cx-s*.05,cy+s*.16);ctx.lineTo(cx+s*.24,cy-s*.18);ctx.stroke();ctx.restore();}
function drawWarning(ctx,cx,cy,s,color=C.red){ctx.save();ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(cx,cy-s*.48);ctx.lineTo(cx+s*.46,cy+s*.40);ctx.lineTo(cx-s*.46,cy+s*.40);ctx.closePath();ctx.fill();ctx.restore();mid(ctx,'!',cx,cy+s*.10,s*.42,'#fff',700);}
function drawDonut(ctx,cx,cy,r,pct,color=C.navy){ctx.save();ctx.lineWidth=r*.26;ctx.strokeStyle='#e8e9ec';ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();ctx.strokeStyle=color;ctx.lineCap='butt';ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*clamp(pct,0,100)/100);ctx.stroke();ctx.restore();}
function textOnStatus(key){return key==='orange'?'#07143d':'#ffffff';}
function signedPoint(v){const n=Number(v)||0;return `${n>0?'+':''}${fmtNum(n,1)} ĐIỂM %`;}

function drawOuter(ctx){ctx.fillStyle='#f8f9fc';ctx.fillRect(0,0,BASE.w,BASE.h);rr(ctx,2,2,BASE.w-4,BASE.h-4,15,'#fff',C.navy,4);}
function drawHeader(ctx,m){
  drawGrowthIcon(ctx,94,82,126);
  fit(ctx,'BẢNG XẾP HẠNG DOANH SỐ NGÀY',180,22,800,48,C.navy,700,'left',37);

  const ux=184,uy=91,uw=462,uh=68;
  rr(ctx,ux,uy,uw,uh,8,C.navy,'#15285f',2);
  drawCalendar(ctx,222,125,39,'#fff');
  // Dòng cập nhật giữ bố cục V8, riêng mốc giờ nhấn màu cam để đọc nhanh.
  {
    const prefix='CẬP NHẬT: ';
    const hourText=formatClock(m.reportHour);
    const suffix=` - ${dateVN(m.reportDate)}`;
    let z=24;
    ctx.save();
    while(z>20){
      ctx.font=`700 ${z}px ${FONT}`;
      if(ctx.measureText(prefix+hourText+suffix).width<=374)break;
      z-=.5;
    }
    ctx.font=`700 ${z}px ${FONT}`;
    ctx.textBaseline='middle';
    ctx.textAlign='left';
    let tx=257;
    ctx.fillStyle='#fff';ctx.fillText(prefix,tx,127);tx+=ctx.measureText(prefix).width;
    ctx.fillStyle=C.orange;ctx.fillText(hourText,tx,127);tx+=ctx.measureText(hourText).width;
    ctx.fillStyle='#fff';ctx.fillText(suffix,tx,127);
    ctx.restore();
  }
  fit(ctx,`(Số liệu chốt đến thời điểm ${formatClock(m.reportHour)} ngày ${dateVN(m.reportDate)})`,190,168,455,20,C.navy,700,'left',15.5);

  // Card góc trên: tên khối cố định + số giờ đã chạy. % thời gian nằm ở block so sánh hệ thống bên dưới.
  const x=666,y=78,w=314,h=126;
  rr(ctx,x,y,w,h,9,'#fff','#244a9e',1.5);
  fitMid(ctx,'TIẾN ĐỘ THỜI GIAN',x+w/2,y+31,w-26,23,C.navy,700,'center',19);
  drawClock(ctx,x+48,y+83,43,C.navy);
  fitMid(ctx,`${fmtNum(m.elapsed,1)} / ${fmtNum(WORK_TOTAL,1)} giờ`,x+199,y+83,205,31,C.orange,700,'center',23);
}
function systemBannerText(m){
  const label=m.totalState.key==='gray'?'CHƯA PHÁT SINH':m.totalState.label;
  return {line1:label,line2:signedPoint(m.totalDiff),up:m.totalDiff>=0};
}
function drawSystemComparison(ctx,m){
  const x=14,y=218,w=995,h=230,headH=43;
  rr(ctx,x,y,w,h,10,'#fff','#aeb9d3',1.5);
  panelHead(ctx,x,y,w,headH,'TIẾN ĐỘ TOÀN HỆ THỐNG – SO VỚI TIẾN ĐỘ THỜI GIAN');
  const bodyY=y+headH,stateColor=m.totalState.color;

  drawDonut(ctx,x+94,bodyY+91,61,m.total,stateColor);
  fitMid(ctx,fmtPctSmart(m.total),x+94,bodyY+91,108,28,stateColor,700,'center',22);

  const bx=x+188,bw=505;
  fitMid(ctx,'TIẾN ĐỘ HỆ THỐNG',bx,bodyY+39,260,23,C.navy,700,'left',18);
  fitMid(ctx,fmtPctSmart(m.total),bx+bw,bodyY+39,132,32,stateColor,700,'right',25);
  progress(ctx,bx,bodyY+59,bw,18,m.total,stateColor);

  fitMid(ctx,'TIẾN ĐỘ THỜI GIAN',bx,bodyY+116,260,23,C.navy,700,'left',18);
  fitMid(ctx,fmtPct(m.timeProgress,1),bx+bw,bodyY+116,132,32,C.navy,700,'right',25);
  progress(ctx,bx,bodyY+136,bw,18,m.timeProgress,C.blue);

  const b=systemBannerText(m),cx=x+716,cy=bodyY+16,cw=260,ch=151,fg=textOnStatus(m.totalState.key);
  rr(ctx,cx,cy,cw,ch,8,stateColor,stateColor,1);
  drawArrow(ctx,cx+42,cy+76,50,fg,b.up);
  fitMid(ctx,b.line1,cx+157,cy+53,187,30,fg,700,'center',24);
  fitMid(ctx,b.line2,cx+157,cy+101,187,27,fg,700,'center',20);
}
function drawRankTable(ctx,m){
  const x=14,y=458,w=995,h=804,headH=48,totalH=54,rowH=(h-headH-totalH)/16;
  rr(ctx,x,y,w,h,8,'#fff','#aeb9d3',1.5);
  panelHead(ctx,x,y,w,headH,'');

  // Bố cục 6 cột: Xếp hạng | Cửa hàng | Thanh tiến độ | % | +/- | Trạng thái.
  // V9: XẾP HẠNG và CỬA HÀNG rộng bằng nhau, cùng căn giữa; vùng progress được kéo dài nhẹ.
  const c1=x+118,c2=x+236,c3=x+614,c4=x+708,c5=x+810;
  line(ctx,c1,y,c1,y+h-totalH,'#d9dfeb',1);
  line(ctx,c2,y,c2,y+h-totalH,'#d9dfeb',1);
  line(ctx,c3,y,c3,y+h-totalH,'#d9dfeb',1);
  line(ctx,c4,y,c4,y+h-totalH,'#d9dfeb',1);
  line(ctx,c5,y,c5,y+h-totalH,'#d9dfeb',1);

  fitMid(ctx,'XẾP HẠNG',(x+c1)/2,y+headH/2,c1-x-8,17,'#fff',700,'center',13);
  fitMid(ctx,'CỬA HÀNG',(c1+c2)/2,y+headH/2,c2-c1-10,19,'#fff',700,'center',15);
  fitMid(ctx,'TIẾN ĐỘ THỰC HIỆN NGÀY',(c2+c3)/2,y+headH/2,c3-c2-16,18,'#fff',700,'center',14);
  mid(ctx,'%',(c3+c4)/2,y+headH/2,19,'#fff');
  mid(ctx,'+/-',(c4+c5)/2,y+headH/2,19,'#fff');
  fitMid(ctx,'TRẠNG THÁI',(c5+x+w)/2,y+headH/2,x+w-c5-10,18,'#fff',700,'center',14);

  m.sorted.forEach((r,i)=>{
    const yy=y+headH+i*rowH,cy=yy+rowH/2;
    if(i)line(ctx,x+1,yy,x+w-1,yy,'#e1e5ee',1);

    const rankX=(x+c1)/2;
    if(i<3)drawMedal(ctx,rankX,cy,i+1);
    else{circle(ctx,rankX,cy,16.5,C.navy2);mid(ctx,i+1,rankX,cy+.5,16,'#fff',700);}

    // Mã cửa hàng căn giữa đồng nhất với cột XẾP HẠNG.
    fitMid(ctx,r.code,(c1+c2)/2,cy,c2-c1-18,28,C.navy,700,'center',22);

    // Thanh progress kéo dài nhẹ và bắt đầu sát hơn sau cột CỬA HÀNG để dễ gióng ngang.
    const barX=c2+10,barW=(c3-c2)-30;
    progress(ctx,barX,cy-7,barW,14,r.pct,r.status.color,m.timeProgress);

    fitMid(ctx,fmtPctSmart(r.pct),(c3+c4)/2,cy,c4-c3-12,28,C.navy,700,'center',22);
    const diffText=`${r.diff>0?'+':''}${fmtNum(r.diff,1)}`;
    fitMid(ctx,diffText,(c4+c5)/2,cy,c5-c4-12,22,C.navy,700,'center',17);

    let label=r.status.label;
    if(r.status.key==='gray')label='CHƯA PHÁT SINH';
    fitMid(ctx,label,(c5+x+w)/2,cy,x+w-c5-14,20,r.status.color,700,'center',13);
  });

  const ty=y+h-totalH;
  ctx.fillStyle=C.navy;ctx.fillRect(x,ty,w,totalH);
  // Tên Tổng và % Tổng dùng cùng cỡ chữ để cân hàng; % vẫn luôn trắng trên nền navy.
  fitMid(ctx,'TỔNG HỆ THỐNG',x+26,ty+totalH/2,c3-x-48,30,'#fff',700,'left',25);
  fitMid(ctx,fmtPctSmart(m.total),(c3+c4)/2,ty+totalH/2,c4-c3-12,30,'#fff',700,'center',25);
  const totalDiffText=`${m.totalDiff>0?'+':''}${fmtNum(m.totalDiff,1)}`;
  fitMid(ctx,totalDiffText,(c4+c5)/2,ty+totalH/2,c5-c4-12,20,'#fff',700,'center',16);
  const totalLabel=m.totalState.key==='gray'?'CHƯA PHÁT SINH':m.totalState.label;
  fitMid(ctx,totalLabel,(c5+x+w)/2,ty+totalH/2,x+w-c5-14,18,'#fff',700,'center',13);
}
function drawStoreMetrics(ctx,m){
  // Hai KPI cửa hàng đặt ngay dưới bảng xếp hạng.
  const y=1272,h=106,gap=10,w=(995-gap)/2,x1=14,x2=x1+w+gap;

  rr(ctx,x1,y,w,h,9,'#f4fff0',C.green,1.9);
  drawCheck(ctx,x1+48,y+52,49,C.green);
  fitMid(ctx,'CỬA HÀNG ĐẠT TIẾN ĐỘ',x1+90,y+22,w-105,18,C.navy,700,'left',15);
  fitMid(ctx,`${m.achievedCount}/16`,x1+91,y+58,145,37,C.greenDark,700,'left',31);
  fitMid(ctx,fmtPct(m.achievedPct,1),x1+w-24,y+58,145,37,C.greenDark,700,'right',31);
  fitMid(ctx,'Kịp + Vượt nhiều',x1+91,y+88,w-115,14,C.muted,700,'left',12);

  rr(ctx,x2,y,w,h,9,'#fff4f2',C.red,1.9);
  drawWarning(ctx,x2+48,y+52,45,C.red);
  fitMid(ctx,'CỬA HÀNG CHẬM TIẾN ĐỘ',x2+90,y+22,w-105,18,C.navy,700,'left',15);
  fitMid(ctx,`${m.slowCount}/16`,x2+91,y+58,145,37,C.red,700,'left',31);
  fitMid(ctx,fmtPct(m.slowPct,1),x2+w-24,y+58,145,37,C.red,700,'right',31);
  fitMid(ctx,'Chậm + Chậm nhiều',x2+91,y+88,w-115,14,C.muted,700,'left',12);
}
function thresholdText(key){
  if(key==='green')return '> +10 điểm %';
  if(key==='blue')return '0 đến +10 điểm %';
  if(key==='orange')return '−10 đến < 0 điểm %';
  if(key==='red')return '< −10 điểm %';
  return '0%';
}
function drawLegend(ctx,m){
  // Khôi phục chiều cao chú thích để màu + luật quy ước dễ đọc hơn.
  const x=14,y=1388,w=995,h=106,headH=34;
  rr(ctx,x,y,w,h,8,'#fff','#aeb9d3',1.5);
  panelHead(ctx,x,y,w,headH,'CHÚ THÍCH MÀU TIẾN ĐỘ');
  const defs=[['green','VƯỢT NHIỀU'],['blue','KỊP'],['orange','CHẬM'],['red','CHẬM NHIỀU'],['gray','CHƯA PHÁT SINH']];
  const cw=w/5;
  defs.forEach((d,i)=>{
    const xx=x+i*cw,cy=y+headH+38;
    if(i)line(ctx,xx,y+headH,xx,y+h,'#d9dee6',1);
    circle(ctx,xx+18,cy,9,C[d[0]]);
    fitMid(ctx,d[1],xx+34,cy-9,cw-42,15.5,C.navy,700,'left',12);
    fitMid(ctx,thresholdText(d[0]),xx+34,cy+17,cw-42,14.5,C.navy,700,'left',11);
  });
}
function drawFooter(ctx){const y=1501,h=34;ctx.fillStyle=C.footer;ctx.fillRect(14,y,995,h);fitMid(ctx,'MỤC TIÊU CHUNG',105,y+h/2,165,14,'#fff',700,'center',12);fitMid(ctx,'HOÀN THÀNH 100% KẾ HOẠCH NGÀY',510,y+h/2,540,17,C.gold,700,'center',14);fitMid(ctx,'BÁM SÁT TIẾN ĐỘ THỜI GIAN',858,y+h/2,275,11,'#fff',700,'center',9);}
function drawDashboard(ctx,m){drawOuter(ctx);drawHeader(ctx,m);drawSystemComparison(ctx,m);drawRankTable(ctx,m);drawStoreMetrics(ctx,m);drawLegend(ctx,m);drawFooter(ctx);}

function fitPreview(){
  const maxW=Math.max(320,els.scroll.clientWidth-34),maxH=Math.max(400,els.scroll.clientHeight-34),s=Math.min(maxW/BASE.w,maxH/BASE.h,1);
  const w=Math.round(BASE.w*s),h=Math.round(BASE.h*s);els.canvas.style.width=w+'px';els.canvas.style.height=h+'px';els.wrap.style.width=w+'px';els.wrap.style.height=h+'px';
}
function render(){const c=els.canvas;c.width=BASE.w;c.height=BASE.h;drawDashboard(c.getContext('2d',{alpha:false}),model);fitPreview();}
function run(show=true){
  try{
    model=parseData(els.data.value);
    localStorage.setItem(STORAGE,JSON.stringify({data:els.data.value,time:els.time.value,date:els.date.value}));
    renderValidation();render();
    if(show){if(model.issues.length)showIssues();else toast('Dữ liệu hợp lệ • BXH ngày đã cập nhật');}
  }catch(e){
    model=null;els.export2k.disabled=true;els.export4k.disabled=true;els.validation.innerHTML=`<div class="err">✕ ${esc(e.message)}</div>`;
    if(show){els.modalBadge.textContent='DỮ LIỆU KHÔNG HỢP LỆ';els.modalTitle.textContent='Không thể tạo BXH';els.modalSummary.textContent=e.message;els.modalIssues.innerHTML='';els.modal.classList.add('show');}
  }
}
function blob(canvas){return new Promise((res,rej)=>canvas.toBlob(b=>b?res(b):rej(new Error('Không tạo được PNG')),'image/png'));}
function download(b,name){const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},900);}
async function exportPng(spec,btn){
  if(!model)return;const errs=model.issues.filter(x=>x.type==='err');if(errs.length){showIssues();return;}
  const old=btn.innerHTML;
  try{
    els.export2k.disabled=true;els.export4k.disabled=true;btn.innerHTML=`<strong>Đang xuất ${spec.tag}…</strong><small>${spec.w} × ${spec.h}</small>`;
    const c=document.createElement('canvas');c.width=spec.w;c.height=spec.h;const ctx=c.getContext('2d',{alpha:false});ctx.setTransform(spec.w/BASE.w,0,0,spec.h/BASE.h,0,0);drawDashboard(ctx,model);
    const b=await blob(c);download(b,`BXH-Doanh-So-Ngay-${iso(model.reportDate)}-${formatClock(model.reportHour).replace(':','h')}-${spec.tag}.png`);toast(`Đã xuất PNG ${spec.tag}`);
  }catch(e){console.error(e);toast('Xuất ảnh thất bại');}
  finally{btn.innerHTML=old;renderValidation();}
}
function load(){
  try{const s=JSON.parse(localStorage.getItem(STORAGE)||'{}');els.data.value=s.data||SAMPLE;els.time.value=s.time||'';els.date.value=s.date||'';}catch(_){els.data.value=SAMPLE;}
}

els.parse.addEventListener('click',()=>run(true));
els.sample.addEventListener('click',()=>{els.data.value=SAMPLE;els.time.value='';els.date.value='';run(true);});
els.time.addEventListener('change',()=>run(false));els.date.addEventListener('change',()=>run(false));
els.export2k.addEventListener('click',()=>exportPng(EXPORT_2K,els.export2k));els.export4k.addEventListener('click',()=>exportPng(EXPORT_4K,els.export4k));
els.modalClose.addEventListener('click',closeModal);els.modalOk.addEventListener('click',closeModal);els.modal.addEventListener('click',e=>{if(e.target===els.modal)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});window.addEventListener('resize',fitPreview);

load();run(false);
})();
