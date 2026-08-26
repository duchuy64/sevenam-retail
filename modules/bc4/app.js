(() => {
'use strict';

const BASE={w:1536,h:1024};
const EXPORT_2X={w:3072,h:2048,tag:'2X'};
const EXPORT_3X={w:4608,h:3072,tag:'3X'};
const STORAGE='sevenam-bxh-tui-thang-v7';
const C={
  navy:'#071d57',navy2:'#0b3f91',navy3:'#123d87',white:'#ffffff',ink:'#111827',muted:'#5f6875',
  line:'#d5d9df',track:'#d4d9df',green:'#55b52c',greenDark:'#1f952f',blue:'#188bd8',orange:'#f59e0b',
  red:'#ee1717',redDark:'#b31217',gray:'#747a83',gold:'#f5b51b',silver:'#aab1ba',bronze:'#b76732',teal:'#1288a5'
};

const FIXED=[
  {code:'HP',name:'HẢI PHÒNG',aliases:['HP','HAI PHONG']},
  {code:'TB',name:'THÁI BÌNH',aliases:['TB','THAI BINH']},
  {code:'TĐT',name:'TÔN ĐỨC THẮNG',aliases:['TĐT','TDT','TON DUC THANG']},
  {code:'HOB',name:'HÒA BÌNH',aliases:['HOB','HOA BINH']},
  {code:'VI',name:'VINH',aliases:['VI','VINH']},
  {code:'VP',name:'VĨNH PHÚC',aliases:['VP','VINH PHUC']},
  {code:'HĐ',name:'HÀ ĐÔNG',aliases:['HĐ','HD','HA DONG']},
  {code:'THO',name:'THANH HÓA',aliases:['THO','THANH HOA']},
  {code:'LLQ',name:'LẠC LONG QUÂN',aliases:['LLQ','LAC LONG QUAN']},
  {code:'NB',name:'NINH BÌNH',aliases:['NB','NINH BINH']},
  {code:'VT',name:'VIỆT TRÌ',aliases:['VT','VIET TRI']},
  {code:'LH',name:'LÁNG HẠ',aliases:['LH','LANG HA']},
  {code:'HAD',name:'HẢI DƯƠNG',aliases:['HAD','HAI DUONG']},
  {code:'NĐ',name:'NAM ĐỊNH',aliases:['NĐ','ND','NAM DINH']},
  {code:'TN',name:'THÁI NGUYÊN',aliases:['TN','THAI NGUYEN']},
  {code:'TDH',name:'TRẦN DUY HƯNG',aliases:['TDH','TRAN DUY HUNG']}
];

const SAMPLE=`| STT | SR | TỔNG | TG Tháng | Còn thiếu | % Hoàn thành |
| 1 | VP | 21 | 30 | -9 | 70% |
| 2 | HD | 15 | 30 | -15 | 50% |
| 3 | TDT | 11 | 25 | -14 | 44% |
| 4 | ND | 10 | 18 | -8 | 56% |
| 5 | THO | 5 | 15 | -10 | 33% |
| 6 | HAD | 5 | 18 | -13 | 28% |
| 7 | TB | 4 | 20 | -16 | 20% |
| 8 | HOB | 4 | 18 | -14 | 22% |
| 9 | VI | 3 | 18 | -15 | 17% |
| 10 | HP | 3 | 18 | -15 | 17% |
| 11 | TDH | 3 | 15 | -12 | 20% |
| 12 | LH | 3 | 15 | -12 | 20% |
| 13 | TN | 1 | 15 | -14 | 7% |
| 14 | NB | 1 | 15 | -14 | 7% |
| 15 | LLQ | 1 | 15 | -14 | 7% |
| 16 | VT | 0 | 15 | -15 | 0% |
| | TỔNG | 90 | 300 | -210 | 30% |`;

const $=id=>document.getElementById(id);
const els={data:$('dataInput'),parse:$('parseBtn'),sample:$('sampleBtn'),date:$('closingDate'),export2k:$('export2k'),export4k:$('export4k'),validation:$('validation'),canvas:$('canvas'),wrap:$('canvasWrap'),scroll:$('scroll'),meta:$('meta'),toast:$('toast'),modal:$('modal'),modalBadge:$('modalBadge'),modalTitle:$('modalTitle'),modalSummary:$('modalSummary'),modalIssues:$('modalIssues'),modalClose:$('modalClose'),modalOk:$('modalOk')};
let model=null;

function strip(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toUpperCase().trim();}
function clean(s){return String(s??'').replace(/\*\*/g,'').replace(/`/g,'').trim();}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function clamp(v,a,b){return Math.min(b,Math.max(a,v));}
function daysInMonth(y,m){return new Date(y,m,0).getDate();}
function iso(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function dateVN(d){return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;}
function fmt(v,d=0){return Number(v||0).toLocaleString('vi-VN',{minimumFractionDigits:d,maximumFractionDigits:d});}
// Chuẩn BC1–BC4: mọi % động dùng tối đa 1 chữ số sau dấu phẩy ngay từ tầng tính toán.
function round1(v){return Math.round((Number(v)||0)*10)/10;}
function fmtSmart(v){const n=Number(v||0);return n.toLocaleString('vi-VN',{maximumFractionDigits:Number.isInteger(n)?0:2});}
function pct(v,d=1){return fmt(v,d)+'%';} // số tròn vẫn hiện 40,0% khi d=1
function signed(v,d=1){const n=Number(v||0);return `${n>0?'+':''}${fmt(n,d)}`;}
function shortageText(actual,target){
  const balance=Number(target||0)-Number(actual||0);
  if(balance>0)return fmtSmart(balance);
  if(balance<0)return `Vượt +${fmtSmart(Math.abs(balance))}`;
  return '0';
}
function shortageColor(actual,target){
  const balance=Number(target||0)-Number(actual||0);
  if(balance>0)return C.orange;
  if(balance<0)return C.greenDark;
  return C.navy;
}
function numCell(s){const t=clean(s).replace(/\s/g,'').replace(/%/g,'');if(!t)return NaN;let x=t;if(x.includes(',')&&!x.includes('.'))x=x.replace(',','.');else if(x.includes('.')&&x.includes(','))x=x.replace(/\./g,'').replace(',','.');const n=Number(x);return Number.isFinite(n)?n:NaN;}
function splitLine(line){if(line.includes('\t'))return line.split('\t').map(clean);if(line.includes('|'))return line.split('|').map(clean).filter((x,i,a)=>!(x===''&&(i===0||i===a.length-1)));if(line.includes(';'))return line.split(';').map(clean);return line.trim().split(/\s{2,}/).map(clean);}
function canonicalText(text){const n=' '+strip(text).replace(/[^A-Z0-9 ]/g,' ')+' ';let best=null,bestLen=-1;FIXED.forEach(s=>s.aliases.forEach(a=>{const aa=strip(a),re=new RegExp(`(^|\\s)${aa.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(?=\\s|$)`);if(re.test(n)&&aa.length>bestLen){best=s;bestLen=aa.length;}}));return best;}
function todayLocal(){const n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate());}
function getReportDate(){if(els.date.value){const d=new Date(els.date.value+'T00:00:00');if(!Number.isNaN(d.getTime()))return d;}return todayLocal();}
function getClosingDate(){const report=getReportDate();const closing=new Date(report);closing.setDate(closing.getDate()-1);return {report,closing};}
function stateFor(actual,pctComplete,timeProgress){if(actual<=0)return {key:'gray',label:'CHƯA PHÁT SINH',color:C.gray};const diff=pctComplete-timeProgress;if(diff < -10)return {key:'red',label:'CHẬM NHIỀU',color:C.red};if(diff < 0)return {key:'orange',label:'CHẬM',color:C.orange};if(diff <= 10)return {key:'blue',label:'KỊP',color:C.blue};return {key:'green',label:'VƯỢT NHIỀU',color:C.green};}
function headerIndex(cells,names){const a=cells.map(x=>strip(x).replace(/[^A-Z0-9 ]/g,' ').replace(/\s+/g,' ').trim());for(let i=0;i<a.length;i++){for(const n of names){if(a[i]===n||a[i].includes(n))return i;}}return -1;}

function parseData(text){
  const lines=String(text||'').replace(/\r/g,'').split('\n').filter(x=>x.trim());
  if(!lines.length)throw new Error('Chưa có dữ liệu để phân tích.');
  const issues=[],found=new Map();let totalInput=null;
  let hi=-1,idxSR=-1,idxActual=-1,idxTarget=-1;
  for(let i=0;i<lines.length;i++){
    const cells=splitLine(lines[i]);
    const s=cells.map(strip).join(' | ');
    if(s.includes('SR') && s.includes('TONG') && (s.includes('TG THANG')||s.includes('TARGET'))){
      hi=i;idxSR=headerIndex(cells,['SR','CUA HANG','SHOWROOM']);idxActual=headerIndex(cells,['TONG','THUC DAT','DA DAT']);idxTarget=headerIndex(cells,['TG THANG','TARGET','TARGET THANG']);break;
    }
  }
  lines.forEach((line,idx)=>{
    if(idx===hi)return;
    const cells=splitLine(line),norm=strip(line);
    if(/^[-:| ]+$/.test(line.trim()))return;
    if(norm.includes('TONG')){
      let actual=NaN,target=NaN;
      if(hi>=0){actual=numCell(cells[idxActual]);target=numCell(cells[idxTarget]);}
      if(!Number.isFinite(actual)||!Number.isFinite(target)){
        const nums=cells.map(numCell).filter(Number.isFinite);if(nums.length>=2){actual=nums[nums.length-2];target=nums[nums.length-1];}
      }
      if(Number.isFinite(actual)&&Number.isFinite(target))totalInput={actual,target,line:idx+1};
      return;
    }
    let store=null,actual=NaN,target=NaN,displayName='',storeCell=-1;
    if(hi>=0){
      displayName=clean(cells[idxSR]||'');
      store=canonicalText(displayName||line);
      actual=numCell(cells[idxActual]);
      target=numCell(cells[idxTarget]);
      storeCell=idxSR;
    }
    if(!store){
      storeCell=cells.findIndex(c=>canonicalText(c));
      if(storeCell>=0){
        displayName=clean(cells[storeCell]);
        store=canonicalText(cells[storeCell]);
      }else{
        store=canonicalText(line);
      }
    }
    if(!store)return;
    if(!displayName)displayName=clean(cells[storeCell]||store.code);
    if(!Number.isFinite(actual)||!Number.isFinite(target)){
      if(storeCell<0)storeCell=cells.findIndex(c=>canonicalText(c)?.code===store.code);
      const nums=[];for(let j=Math.max(0,storeCell+1);j<cells.length;j++){const n=numCell(cells[j]);if(Number.isFinite(n))nums.push(n);}if(nums.length>=2){actual=nums[0];target=nums[1];}
    }
    if(!Number.isFinite(actual)||!Number.isFinite(target)){issues.push({type:'err',text:`Dòng ${idx+1}: nhận ra ${store.code} nhưng chưa đọc được TỔNG và TG Tháng.`});return;}
    if(target<=0){issues.push({type:'err',text:`Dòng ${idx+1}: TG Tháng của ${store.code} phải lớn hơn 0.`});return;}
    if(found.has(store.code))issues.push({type:'err',text:`Trùng showroom ${store.code}; tool dùng dòng xuất hiện sau cùng.`});
    found.set(store.code,{...store,name:displayName,actual,target,line:idx+1});
  });

  FIXED.filter(s=>!found.has(s.code)).forEach(s=>issues.push({type:'err',text:`Thiếu showroom ${s.code} – ${s.name}.`}));
  if(found.size!==16)issues.push({type:'err',text:`Tool cố định 16 showroom nhưng hiện đọc được ${found.size}/16.`});

  const dates=getClosingDate(),reportDate=dates.report,closing=dates.closing,totalDays=daysInMonth(closing.getFullYear(),closing.getMonth()+1),day=closing.getDate(),daysLeft=Math.max(0,totalDays-day),timeProgress=round1(day/totalDays*100);
  const rows=FIXED.map(s=>{
    const f=found.get(s.code)||{actual:0,target:0};
    const complete=round1(f.target>0?f.actual/f.target*100:0);
    const diff=round1(complete-timeProgress);
    const remaining=Math.max(f.target-f.actual,0);
    const needPerDay=remaining===0?0:(daysLeft>0?remaining/daysLeft:remaining);

    // HÔM NAY CẦN BÁN:
    // - Chỉ khi cửa hàng đã đạt Target tháng (Thực đạt >= Target, remaining === 0) => mặc định 0.
    // - Nếu chưa đạt Target tháng, kể cả đang KỊP/VƯỢT tiến độ thời gian, vẫn tính Còn thiếu / số ngày còn lại.
    // - Luôn làm tròn lên, không số lẻ.
    // - Nếu không còn ngày nào trong tháng => 0 để tránh chia cho 0.
    const todayNeed=remaining===0?0:(daysLeft>0?Math.ceil(remaining/daysLeft):0);

    const currentPace=day>0?f.actual/day:0;
    const paceGap=needPerDay-currentPace;
    const st=stateFor(f.actual,complete,timeProgress);
    return {...s,name:(f.name||s.code),actual:f.actual,target:f.target,complete,diff,remaining,needPerDay,todayNeed,currentPace,paceGap,status:st,missing:!found.has(s.code)};
  });
  const sorted=[...rows].sort((a,b)=>b.complete-a.complete||b.actual-a.actual||FIXED.findIndex(x=>x.code===a.code)-FIXED.findIndex(x=>x.code===b.code));
  const totalActual=rows.reduce((a,r)=>a+r.actual,0),totalTarget=rows.reduce((a,r)=>a+r.target,0),totalComplete=round1(totalTarget?totalActual/totalTarget*100:0),totalDiff=round1(totalComplete-timeProgress),totalRemaining=Math.max(totalTarget-totalActual,0),totalNeedPerDay=totalRemaining===0?0:(daysLeft>0?totalRemaining/daysLeft:totalRemaining),totalTodayNeed=totalRemaining===0?0:(daysLeft>0?Math.ceil(totalRemaining/daysLeft):0),totalState=stateFor(totalActual,totalComplete,timeProgress);
  const forecastUnits=day>0?(totalActual/day*totalDays):0,forecastPct=round1(totalTarget?forecastUnits/totalTarget*100:0);
  const groups={green:[],blue:[],orange:[],red:[],gray:[]};sorted.forEach(r=>groups[r.status.key].push(r));
  const priority=sorted.filter(r=>['orange','red','gray'].includes(r.status.key)).sort((a,b)=>b.paceGap-a.paceGap||a.diff-b.diff).slice(0,4);

  if(totalInput){
    if(Math.abs(totalInput.actual-totalActual)>.001||Math.abs(totalInput.target-totalTarget)>.001)issues.push({type:'warn',text:`Dòng TỔNG nguồn là ${fmtSmart(totalInput.actual)}/${fmtSmart(totalInput.target)}, nhưng cộng 16 showroom = ${fmtSmart(totalActual)}/${fmtSmart(totalTarget)}. Dashboard dùng tổng cộng từ 16 showroom.`});
  }
  return {rows,sorted,groups,priority,issues,reportDate,closing,totalDays,day,daysLeft,timeProgress,totalActual,totalTarget,totalComplete,totalDiff,totalRemaining,totalNeedPerDay,totalTodayNeed,totalState,forecastUnits,forecastPct};
}

function renderValidation(){const m=model,errs=m.issues.filter(x=>x.type==='err'),warns=m.issues.filter(x=>x.type==='warn'),out=[];out.push(`<div class="ok">✓ Đọc ${m.rows.filter(x=>!x.missing).length}/16 showroom cố định</div>`);out.push(`<div class="ok">✓ Tổng: ${fmtSmart(m.totalActual)} / ${fmtSmart(m.totalTarget)} túi = ${pct(m.totalComplete,1)}</div>`);out.push(`<div class="ok">✓ Cập nhật: ${dateVN(m.reportDate)} • Chốt hết ngày: ${dateVN(m.closing)} • Tiến độ TG: ${pct(m.timeProgress,1)} • Còn ${m.daysLeft} ngày</div>`);out.push(`<div class="ok">✓ Cần TB: ${fmt(m.totalNeedPerDay,1)} túi/ngày • Hôm nay cần bán: ${fmtSmart(m.totalTodayNeed)} túi • Forecast: ${pct(m.forecastPct,1)}</div>`);if(errs.length||warns.length)out.push(`<div class="section">${errs.length} lỗi • ${warns.length} cảnh báo</div>`);[...errs,...warns].forEach(x=>out.push(`<div class="${x.type}">${x.type==='err'?'✕':'⚠'} ${esc(x.text)}</div>`));if(!errs.length&&!warns.length)out.push('<div class="ok">✓ Dữ liệu hợp lệ, có thể xuất ảnh.</div>');els.validation.innerHTML=out.join('');els.meta.textContent=`16 showroom • ${errs.length} lỗi • ${warns.length} cảnh báo`;els.export2k.disabled=errs.length>0;els.export4k.disabled=errs.length>0;}
function showIssues(){const errs=model.issues.filter(x=>x.type==='err'),warns=model.issues.filter(x=>x.type==='warn');if(!errs.length&&!warns.length)return;els.modalBadge.textContent=errs.length?'PHÁT HIỆN LỖI':'CÓ CẢNH BÁO';els.modalTitle.textContent=errs.length?'Dữ liệu chưa đủ để xuất ảnh':'Có dữ liệu cần kiểm tra';els.modalSummary.textContent=`${errs.length} lỗi • ${warns.length} cảnh báo.`;els.modalIssues.innerHTML=[...errs,...warns].map(x=>`<div class="issue ${x.type}">${x.type==='err'?'✕':'⚠'} ${esc(x.text)}</div>`).join('');els.modal.classList.add('show');}
function closeModal(){els.modal.classList.remove('show');}
function toast(s){els.toast.textContent=s;els.toast.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>els.toast.classList.remove('show'),1700);}

// ===== CANVAS =====
// V3 FONT LOCK: toàn bộ dashboard Canvas chỉ dùng Arial Regular 400 / Arial Bold 700.
// Không dùng 600/800/900 và không có Inter fallback để tránh trình duyệt giả lập ExtraBold.
// Design system cố định 1536 × 1024; preview chỉ scale toàn canvas, không responsive từng block.
const FONT='Arial';
function canvasWeight(w=700){return Number(w)>=700?700:400;}
function setCanvasFont(ctx,size,w=700,baseline='top'){
  const weight=canvasWeight(w);
  ctx.font=`${weight} ${size}px ${FONT}`;
  ctx.textBaseline=baseline;
  // Các thuộc tính dưới đây chỉ áp dụng nếu trình duyệt hỗ trợ, không ảnh hưởng trình duyệt cũ.
  if('fontKerning' in ctx)ctx.fontKerning='normal';
  if('textRendering' in ctx)ctx.textRendering='optimizeLegibility';
}
function font(ctx,size,w=700){setCanvasFont(ctx,size,w,'top');}
function txt(ctx,s,x,y,size=16,color=C.ink,w=700,align='left'){ctx.save();setCanvasFont(ctx,size,w,'top');ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(String(s),x,y);ctx.restore();}
function mid(ctx,s,x,y,size=16,color=C.ink,w=700,align='center'){ctx.save();setCanvasFont(ctx,size,w,'middle');ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(String(s),x,y);ctx.restore();}
function fitMid(ctx,s,x,y,maxW,size,color=C.ink,w=700,align='center',min=9){
  let z=size;const weight=canvasWeight(w);ctx.save();
  while(z>min){setCanvasFont(ctx,z,weight,'middle');if(ctx.measureText(String(s)).width<=maxW)break;z-=.5;}
  ctx.restore();mid(ctx,s,x,y,z,color,weight,align);
}
function textWidth(ctx,s,size,w=700){ctx.save();setCanvasFont(ctx,size,w,'middle');const width=ctx.measureText(String(s)).width;ctx.restore();return width;}
function wrapWords(ctx,s,maxW,size,w=700,maxLines=2){
  const words=String(s).trim().split(/\s+/).filter(Boolean);if(!words.length)return [];
  ctx.save();setCanvasFont(ctx,size,w,'middle');
  const lines=[];let cur='';
  for(let i=0;i<words.length;i++){
    const next=cur?cur+' '+words[i]:words[i];
    if(cur && ctx.measureText(next).width>maxW){
      lines.push(cur);cur=words[i];
      if(lines.length===maxLines-1){
        if(i+1<words.length)cur+=' '+words.slice(i+1).join(' ');
        break;
      }
    }else cur=next;
  }
  if(cur)lines.push(cur);ctx.restore();
  return lines.slice(0,maxLines);
}
function drawWrappedMid(ctx,s,x,y,maxW,size,color=C.ink,w=700,lineH=21,maxLines=2,min=13){
  let z=size,lines=[];
  while(z>=min){lines=wrapWords(ctx,s,maxW,z,w,maxLines);let ok=true;ctx.save();setCanvasFont(ctx,z,w,'middle');for(const l of lines){if(ctx.measureText(l).width>maxW){ok=false;break;}}ctx.restore();if(ok)break;z-=.5;}
  const totalH=(lines.length-1)*lineH;lines.forEach((l,i)=>mid(ctx,l,x,y-totalH/2+i*lineH,z,color,w,'left'));
}
function rr(ctx,x,y,w,h,r,fill,stroke=null,lw=1){ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}ctx.restore();}
function line(ctx,x1,y1,x2,y2,color,lw=1){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();}
function circle(ctx,x,y,r,fill,stroke=null,lw=1){ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}ctx.restore();}
function progress(ctx,x,y,w,h,pctValue,color,marker=null){rr(ctx,x,y,w,h,h/2,C.track);const fw=w*clamp(pctValue,0,100)/100;if(fw>0)rr(ctx,x,y,fw,h,h/2,color);if(Number.isFinite(marker)){const mx=x+w*clamp(marker,0,100)/100;line(ctx,mx,y-3,mx,y+h+3,'#aeb5be',2);}}
function panelHead(ctx,x,y,w,h,title){ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,[10,10,0,0]);ctx.fillStyle=C.navy;ctx.fill();ctx.restore();fitMid(ctx,title,x+w/2,y+h/2,w-18,22,'#fff',700,'center',15);}

function medal(ctx,cx,cy,rank){
  const p=rank===1?[C.gold,'#9b6500']:rank===2?[C.silver,'#68717b']:[C.bronze,'#7b381a'];
  // Huy chương 2D tối giản: chỉ vòng tròn màu + số, không râu/ribbon, không bóng.
  circle(ctx,cx,cy,14,p[0],p[1],1.8);
  mid(ctx,rank,cx,cy+.4,15,rank===3?'#fff':C.navy,700);
}
function iconCalendar(ctx,cx,cy,s,color=C.navy){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=s*.057;ctx.lineCap='round';rr(ctx,cx-s*.38,cy-s*.30,s*.76,s*.64,s*.07,null,color,s*.057);line(ctx,cx-s*.38,cy-s*.08,cx+s*.38,cy-s*.08,color,s*.057);line(ctx,cx-s*.18,cy-s*.41,cx-s*.18,cy-s*.24,color,s*.057);line(ctx,cx+s*.18,cy-s*.41,cx+s*.18,cy-s*.24,color,s*.057);ctx.restore();}
function iconClock(ctx,cx,cy,s,color=C.navy){circle(ctx,cx,cy,s*.38,null,color,s*.065);line(ctx,cx,cy,cx,cy-s*.21,color,s*.065);line(ctx,cx,cy,cx+s*.18,cy+s*.10,color,s*.065);}
function iconTarget(ctx,cx,cy,s,color=C.navy){circle(ctx,cx,cy,s*.38,null,color,s*.068);circle(ctx,cx,cy,s*.22,null,color,s*.062);circle(ctx,cx,cy,s*.065,color);line(ctx,cx,cy,cx+s*.34,cy-s*.34,color,s*.068);}
function iconBag(ctx,cx,cy,s,color=C.navy){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=s*.064;ctx.lineJoin='round';ctx.beginPath();ctx.roundRect(cx-s*.30,cy-s*.12,s*.60,s*.48,s*.07);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy-s*.12,s*.17,Math.PI,0);ctx.stroke();ctx.restore();}
function iconChart(ctx,cx,cy,s,color=C.navy){rr(ctx,cx-s*.30,cy+s*.08,s*.12,s*.22,2,color);rr(ctx,cx-s*.08,cy-s*.06,s*.12,s*.36,2,color);rr(ctx,cx+s*.14,cy-s*.22,s*.12,s*.52,2,color);ctx.save();ctx.strokeStyle=color;ctx.lineWidth=s*.058;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(cx-s*.30,cy-s*.12);ctx.lineTo(cx-s*.08,cy-s*.28);ctx.lineTo(cx+s*.04,cy-s*.19);ctx.lineTo(cx+s*.30,cy-s*.43);ctx.stroke();ctx.restore();}
function iconAlert(ctx,cx,cy,s,color=C.red){ctx.save();ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(cx,cy-s*.38);ctx.lineTo(cx+s*.36,cy+s*.30);ctx.lineTo(cx-s*.36,cy+s*.30);ctx.closePath();ctx.fill();ctx.restore();mid(ctx,'!',cx,cy+s*.07,s*.35,'#fff',700);}
function drawDonut(ctx,cx,cy,r,segments,total){
  const ringW=31,den=Math.max(total,1);
  ctx.save();ctx.lineCap='butt';
  ctx.lineWidth=ringW;ctx.strokeStyle='#e4e7ea';ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
  let a=-Math.PI/2;const cuts=[];
  segments.forEach(seg=>{
    if(!seg.value)return;
    const span=Math.PI*2*(seg.value/den);
    ctx.strokeStyle=seg.color;ctx.beginPath();ctx.arc(cx,cy,r,a,a+span);ctx.stroke();
    a+=span;cuts.push(a);
  });
  // White separators like the reference image. Draw only through the ring thickness.
  const inner=r-ringW/2-1,outer=r+ringW/2+1;
  ctx.strokeStyle='#fff';ctx.lineWidth=2.2;
  cuts.slice(0,-1).forEach(ang=>{
    ctx.beginPath();ctx.moveTo(cx+Math.cos(ang)*inner,cy+Math.sin(ang)*inner);ctx.lineTo(cx+Math.cos(ang)*outer,cy+Math.sin(ang)*outer);ctx.stroke();
  });
  ctx.restore();
}
function drawGauge(ctx,cx,cy,r,value,color,lineW=23){ctx.save();ctx.lineWidth=lineW;ctx.lineCap='butt';ctx.strokeStyle='#e5e7e9';ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,Math.PI*2);ctx.stroke();const v=clamp(value,0,120)/120;ctx.strokeStyle=color;ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,Math.PI+Math.PI*v);ctx.stroke();ctx.restore();}
function forecastLabel(v){if(v>=100)return 'RẤT CAO';if(v>=90)return 'CAO';if(v>=75)return 'TRUNG BÌNH';return 'THẤP';}
function forecastColor(v){if(v>=100)return C.greenDark;if(v>=90)return C.green;if(v>=75)return C.orange;return C.red;}

function drawHeader(ctx,m){
  ctx.fillStyle='#fff';ctx.fillRect(0,0,BASE.w,BASE.h);
  fitMid(ctx,'BẢNG XẾP HẠNG BÁN TÚI TOÀN HỆ THỐNG',BASE.w/2,34,1210,49,C.navy,700,'center',40);

  iconCalendar(ctx,408,79,29,C.navy);
  const updateLabel='CẬP NHẬT:';
  const updateX=438,metaSize=19,dateSize=23; // ngày lớn hơn xấp xỉ 20%
  mid(ctx,updateLabel,updateX,79,metaSize,C.navy,700,'left');
  const updateDateX=updateX+textWidth(ctx,updateLabel,metaSize,700)+10;
  mid(ctx,dateVN(m.reportDate),updateDateX,79,dateSize,C.greenDark,700,'left');

  line(ctx,747,65,747,94,'#c9ced6',1.5);
  iconClock(ctx,781,79,27,C.navy);
  const closeLabel='SỐ LIỆU CHỐT HẾT NGÀY:';
  const closeX=807;
  mid(ctx,closeLabel,closeX,79,metaSize,C.navy,700,'left');
  const closeDateX=closeX+textWidth(ctx,closeLabel,metaSize,700)+10;
  mid(ctx,dateVN(m.closing),closeDateX,79,dateSize,C.redDark,700,'left');
}

function drawKpiRing(ctx,cx,cy,color,icon){
  ctx.save();ctx.lineWidth=13;ctx.strokeStyle='#e3e6e9';ctx.beginPath();ctx.arc(cx,cy,42,0,Math.PI*2);ctx.stroke();ctx.strokeStyle=color;ctx.beginPath();ctx.arc(cx,cy,42,-Math.PI/2,Math.PI*.72);ctx.stroke();ctx.restore();
  icon(ctx,cx,cy,45,C.navy);
}
function drawKpiCard(ctx,x,y,w,h,title,value,sub,color,icon,valueSize=54){
  rr(ctx,x,y,w,h,16,'#fff','#bfc6cf',1.9);
  const iconCx=x+75,ringR=42;
  drawKpiRing(ctx,iconCx,y+h/2,color,icon);
  // Vùng nội dung được tính từ mép phải vòng icon tới cạnh phải card và tự căn giữa.
  const contentLeft=iconCx+ringR+12,contentRight=x+w-15,contentW=contentRight-contentLeft,contentCx=contentLeft+contentW/2;
  fitMid(ctx,title,contentCx,y+30,contentW,18,color,700,'center',13.5);
  fitMid(ctx,value,contentCx,y+76,contentW,valueSize,color,700,'center',31);
  if(sub)fitMid(ctx,sub,contentCx,y+119,contentW,19,C.navy,700,'center',13.5);
}
function drawKpis(ctx,m){
  const y=101,h=147,g=12,w=(BASE.w-40-g*3)/4,x0=20;
  // Giữ đúng cấu trúc 4 KPI của ảnh mẫu: xanh / xanh navy / cam / đỏ.
  drawKpiCard(ctx,x0,y,w,h,'% HOÀN THÀNH',pct(m.totalComplete,1),`(${fmtSmart(m.totalActual)} / ${fmtSmart(m.totalTarget)})`,C.greenDark,iconTarget,54);
  drawKpiCard(ctx,x0+w+g,y,w,h,'THỰC ĐẠT',fmtSmart(m.totalActual),`/ ${fmtSmart(m.totalTarget)}`,C.navy2,iconBag,55);
  drawKpiCard(ctx,x0+(w+g)*2,y,w,h,'CÒN THIẾU',fmtSmart(m.totalRemaining),'túi',C.orange,iconBag,55);
  drawKpiCard(ctx,x0+(w+g)*3,y,w,h,'CẦN BÁN TRUNG BÌNH/NGÀY',fmt(m.totalNeedPerDay,1),'túi/ngày',C.red,iconChart,52);
}

function drawTable(ctx,m){
  const x=20,y=257,w=920,h=623,titleH=36,headH=33,totalH=44;
  rr(ctx,x,y,w,h,12,'#fff','#d5d9df',1.4);
  panelHead(ctx,x,y,356,titleH,'BẢNG XẾP HẠNG CỬA HÀNG');
  const hy=y+titleH;ctx.fillStyle=C.navy;ctx.fillRect(x,hy,w,headH);

  // Cột CỬA HÀNG co/giãn theo đúng nội dung SR đang nhập.
  // Tên ngắn => cột tên hẹp, thanh tiến độ dài hơn.
  // Tên dài => cột tên nới ra, thanh tiến độ co lại nhưng vẫn có giới hạn hợp lý.
  // Giữ nguyên nguyên tắc giãn cột: tên cửa hàng co/giãn theo nội dung,
  // phần không gian còn lại tự dồn cho thanh TIẾN ĐỘ.
  // Thêm HÔM NAY CẦN BÁN nhưng vẫn giữ khoảng cách gọn giữa các cột.
  const rankW=54,pctW=72,deltaW=82,shortageW=102,todayW=124,statusW=108;
  const longestNamePx=Math.max(
    textWidth(ctx,'CỬA HÀNG',15,700),
    ...m.sorted.map(r=>textWidth(ctx,r.name,17.2,700))
  );
  const nameW=clamp(Math.ceil(longestNamePx+30),98,170);
  const progressW=w-rankW-nameW-pctW-deltaW-shortageW-todayW-statusW;
  const widths=[rankW,nameW,pctW,progressW,deltaW,shortageW,todayW,statusW];
  const edges=[x];widths.forEach(v=>edges.push(edges[edges.length-1]+v));

  ['BXH','CỬA HÀNG','% ĐẠT','TIẾN ĐỘ','+/- TG','CÒN THIẾU','HÔM NAY CẦN BÁN','TRẠNG THÁI'].forEach((t,i)=>
    fitMid(ctx,t,(edges[i]+edges[i+1])/2,hy+headH/2,widths[i]-8,14.5,'#fff',700,'center',9.5)
  );

  const rowTop=hy+headH,rowH=(h-titleH-headH-totalH)/16;
  m.sorted.forEach((r,i)=>{
    const yy=rowTop+i*rowH,cy=yy+rowH/2;
    if(i)line(ctx,x+6,yy,x+w-6,yy,'#e5e8ec',1);
    if(i<3)medal(ctx,(edges[0]+edges[1])/2,cy,i+1);else mid(ctx,i+1,(edges[0]+edges[1])/2,cy,16,C.navy,700);
    fitMid(ctx,r.name,edges[1]+13,cy,widths[1]-24,17.2,C.ink,700,'left',11.5);
    fitMid(ctx,pct(r.complete,1),(edges[2]+edges[3])/2,cy,widths[2]-8,19,C.navy,700,'center',13);
    progress(ctx,edges[3]+14,cy-6.5,widths[3]-28,13,r.complete,r.status.color,m.timeProgress);

    // +/- TG luôn kèm ký hiệu %.
    fitMid(ctx,`${signed(r.diff,1)}%`,(edges[4]+edges[5])/2,cy,widths[4]-10,16,r.status.color,700,'center',11.5);

    // CÒN THIẾU / VƯỢT dùng cùng màu với trạng thái tiến độ của cửa hàng.
    fitMid(ctx,shortageText(r.actual,r.target),(edges[5]+edges[6])/2,cy,widths[5]-10,15.5,r.status.color,700,'center',10);

    // HÔM NAY CẦN BÁN: số nguyên, luôn làm tròn lên; chỉ đạt Target tháng mới = 0.
    fitMid(ctx,fmtSmart(r.todayNeed),(edges[6]+edges[7])/2,cy,widths[6]-10,16.5,r.status.color,700,'center',11);

    fitMid(ctx,r.status.label,(edges[7]+edges[8])/2,cy,widths[7]-8,14.8,r.status.color,700,'center',10);
  });

  const ty=y+h-totalH;ctx.fillStyle='#f8fafc';ctx.fillRect(x+1,ty,w-2,totalH-1);line(ctx,x,ty,x+w,ty,C.navy,2.2);

  // TỔNG HỆ THỐNG: dùng toàn bộ vùng BXH + CỬA HÀNG, căn hẳn về lề trái.
  // Không đặt chữ trong riêng cột tên nữa để tránh chèn sang cột % ĐẠT.
  fitMid(ctx,'TỔNG HỆ THỐNG',x+16,ty+totalH/2,(edges[2]-x)-28,22,C.navy,700,'left',15.5);

  fitMid(ctx,pct(m.totalComplete,1),(edges[2]+edges[3])/2,ty+totalH/2,widths[2]-8,20,C.navy,700,'center',14);
  progress(ctx,edges[3]+14,ty+15.5,widths[3]-28,13,m.totalComplete,m.totalState.color,m.timeProgress);
  fitMid(ctx,`${signed(m.totalDiff,1)}%`,(edges[4]+edges[5])/2,ty+totalH/2,widths[4]-10,17,m.totalState.color,700,'center',12);

  // Tổng CÒN THIẾU / VƯỢT cũng dùng cùng màu trạng thái tiến độ toàn hệ thống.
  fitMid(ctx,shortageText(m.totalActual,m.totalTarget),(edges[5]+edges[6])/2,ty+totalH/2,widths[5]-10,16,m.totalState.color,700,'center',10.5);

  // Tổng HÔM NAY CẦN BÁN: chỉ khi toàn hệ thống đã đạt Target tháng mới = 0.
  fitMid(ctx,fmtSmart(m.totalTodayNeed),(edges[6]+edges[7])/2,ty+totalH/2,widths[6]-10,17,m.totalState.color,700,'center',11);

  fitMid(ctx,m.totalState.label,(edges[7]+edges[8])/2,ty+totalH/2,widths[7]-8,15,m.totalState.color,700,'center',10);
}
function drawGroupCard(ctx,m){
  const x=952,y=427,w=564,h=236;
  rr(ctx,x,y,w,h,12,'#fff','#d5d9df',1.4);panelHead(ctx,x,y,286,36,'PHÂN LOẠI THEO NHÓM');
  const defs=[['green','Vượt nhiều'],['blue','Kịp'],['orange','Chậm'],['red','Chậm nhiều'],['gray','Chưa phát sinh']];
  const segs=defs.map(d=>({value:m.groups[d[0]].length,color:C[d[0]]}));
  // Giữ nguyên vùng donut như V6; chỉ thu phần legend bên phải.
  drawDonut(ctx,x+137,y+140,84,segs,16);
  mid(ctx,'16',x+137,y+132,38,C.navy,700);mid(ctx,'cửa hàng',x+137,y+166,16,C.navy,700);
  defs.forEach((d,i)=>{
    const yy=y+60+i*36.5;
    circle(ctx,x+300,yy,9,C[d[0]]);
    fitMid(ctx,d[1],x+324,yy,154,16.5,C.navy,700,'left',11.5);
    fitMid(ctx,m.groups[d[0]].length,x+w-20,yy,38,20,C[d[0]],700,'right',14);
  });
}
function drawTimeCard(ctx,m){
  const x=952,y=257,w=564,h=158;
  rr(ctx,x,y,w,h,12,'#fff','#d5d9df',1.4);panelHead(ctx,x,y,286,36,'TIẾN ĐỘ THỜI GIAN');
  iconCalendar(ctx,x+62,y+101,52,C.navy);
  fitMid(ctx,pct(m.timeProgress,1),x+112,y+80,176,49,C.navy,700,'left',36);
  // Thanh thời gian hẹp và mỏng hơn; 2 ô ngày giữ nguyên kích thước.
  progress(ctx,x+112,y+116,230,13,m.timeProgress,C.navy2);
  const boxY=y+50,bw=90,bh=92,box1=x+w-188,box2=x+w-90;
  rr(ctx,box1,boxY,bw,bh,9,'#fff0f0','#efc4c4',1.25);fitMid(ctx,'ĐÃ QUA',box1+bw/2,boxY+20,78,14,C.navy,700,'center',10.5);fitMid(ctx,m.day,box1+bw/2,boxY+52,78,33,C.navy,700,'center',26);fitMid(ctx,'ngày',box1+bw/2,boxY+78,78,14,C.navy,700,'center',10.5);
  rr(ctx,box2,boxY,bw,bh,9,'#effbea','#c7e8bb',1.25);fitMid(ctx,'CÒN LẠI',box2+bw/2,boxY+20,78,14,C.navy,700,'center',10.5);fitMid(ctx,m.daysLeft,box2+bw/2,boxY+52,78,33,C.navy,700,'center',26);fitMid(ctx,'ngày',box2+bw/2,boxY+78,78,14,C.navy,700,'center',10.5);
}
function drawForecast(ctx,m){
  const x=952,y=675,w=276,h=205;
  rr(ctx,x,y,w,h,12,'#fff','#d5d9df',1.4);panelHead(ctx,x,y,w,36,'DỰ BÁO CUỐI THÁNG');
  const col=forecastColor(m.forecastPct);
  // Gauge bán nguyệt thu nhỏ để panel gọn và cân đối hơn.
  drawGauge(ctx,x+w/2,y+143,76,m.forecastPct,col,19);
  fitMid(ctx,pct(m.forecastPct,1),x+w/2,y+141,154,45,col,700,'center',32);
  fitMid(ctx,'Khả năng đạt KPI',x+22,y+181,148,14.5,C.navy,700,'left',11);
  rr(ctx,x+w-78,y+165,64,30,5,col);fitMid(ctx,forecastLabel(m.forecastPct),x+w-46,y+180,58,12.5,'#fff',700,'center',9);
}
function drawPriority(ctx,m){
  const x=1240,y=675,w=276,h=205;
  rr(ctx,x,y,w,h,12,'#fff','#d5d9df',1.4);panelHead(ctx,x,y,w,36,'TOP 4 CỬA HÀNG CẦN ƯU TIÊN');
  const arr=m.priority.length?m.priority:m.sorted.slice(-4).reverse();
  arr.slice(0,4).forEach((r,i)=>{
    const yy=y+68+i*36;
    iconAlert(ctx,x+13,yy,21,r.status.key==='gray'?C.gray:r.status.color);
    fitMid(ctx,i+1,x+31,yy,16,14.5,C.navy,700,'center',10.5);
    fitMid(ctx,r.name,x+43,yy,116,14.7,C.navy,700,'left',9.8);
    fitMid(ctx,`${r.paceGap>0?'+':''}${fmt(r.paceGap,1)} túi/ngày`,x+w-8,yy,104,14.3,r.paceGap>0?C.red:C.greenDark,700,'right',9.8);
  });
}
function drawActions(ctx,m){
  const x=20,y=889,w=1496,h=124;
  rr(ctx,x,y,w,h,12,'#fff','#d5d9df',1.4);rr(ctx,x,y,180,h,12,C.navy);
  fitMid(ctx,'ACTION',x+90,y+36,150,30,'#fff',700,'center',23);
  fitMid(ctx,'NHANH',x+90,y+70,150,30,'#fff',700,'center',23);
  iconTarget(ctx,x+145,y+98,39,'#fff');

  const good=m.groups.green.length+m.groups.blue.length,slow=m.groups.orange.length,critical=m.groups.red.length+m.groups.gray.length;
  const items=[
    {title:`${good} cửa hàng`,action:'Duy trì nhịp bán và bứt phá',color:C.green,icon:iconTarget},
    {title:`${slow} cửa hàng`,action:'Tăng tốc bán túi ngay hôm nay',color:C.orange,icon:iconChart},
    {title:`${critical} cửa hàng`,action:'Ưu tiên kéo doanh số ngay',color:C.red,icon:iconAlert},
    {title:`${fmt(m.totalNeedPerDay,1)} túi/ngày`,action:'Bám tối thiểu mỗi ngày',color:C.teal,icon:iconBag},
    {title:`${pct(m.forecastPct,1)}`,action:'Theo sát forecast cuối tháng',color:forecastColor(m.forecastPct),icon:iconTarget}
  ];
  const iw=(w-180)/5;
  items.forEach((it,i)=>{
    const xx=x+180+i*iw;if(i)line(ctx,xx,y+14,xx,y+h-14,'#d7dbe2',1);
    it.icon(ctx,xx+40,y+62,49,it.color);
    const textX=xx+78,textW=iw-88;
    fitMid(ctx,it.title,textX,y+37,textW,28,it.color,700,'left',18);
    // Action dùng tối đa 2 dòng, tự ngắt theo từ hoàn chỉnh; font lớn hơn rõ rệt.
    drawWrappedMid(ctx,it.action,textX,y+82,textW,19.5,C.navy,700,21.5,2,15);
  });
}

function drawDashboard(ctx,m){ctx.fillStyle='#fff';ctx.fillRect(0,0,BASE.w,BASE.h);drawHeader(ctx,m);drawKpis(ctx,m);drawTable(ctx,m);drawGroupCard(ctx,m);drawTimeCard(ctx,m);drawForecast(ctx,m);drawPriority(ctx,m);drawActions(ctx,m);}

function fitPreview(){const maxW=Math.max(320,els.scroll.clientWidth-34),maxH=Math.max(400,els.scroll.clientHeight-34),s=Math.min(maxW/BASE.w,maxH/BASE.h,1),w=Math.round(BASE.w*s),h=Math.round(BASE.h*s);els.canvas.style.width=w+'px';els.canvas.style.height=h+'px';els.wrap.style.width=w+'px';els.wrap.style.height=h+'px';}
function render(){const c=els.canvas;c.width=BASE.w;c.height=BASE.h;drawDashboard(c.getContext('2d',{alpha:false}),model);fitPreview();}
function run(show=true){try{model=parseData(els.data.value);localStorage.setItem(STORAGE,JSON.stringify({data:els.data.value,date:els.date.value}));renderValidation();render();if(show){if(model.issues.length)showIssues();else toast('Dữ liệu hợp lệ • Dashboard đã cập nhật');}}catch(e){model=null;els.export2k.disabled=true;els.export4k.disabled=true;els.validation.innerHTML=`<div class="err">✕ ${esc(e.message)}</div>`;if(show){els.modalBadge.textContent='DỮ LIỆU KHÔNG HỢP LỆ';els.modalTitle.textContent='Không thể tạo Dashboard';els.modalSummary.textContent=e.message;els.modalIssues.innerHTML='';els.modal.classList.add('show');}}}
function blob(canvas){return new Promise((res,rej)=>canvas.toBlob(b=>b?res(b):rej(new Error('Không tạo được PNG')),'image/png'));}
function download(b,name){const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},900);}
async function exportPng(spec,btn){if(!model)return;if(model.issues.some(x=>x.type==='err')){showIssues();return;}const old=btn.innerHTML;try{els.export2k.disabled=true;els.export4k.disabled=true;btn.innerHTML=`<strong>Đang xuất ${spec.tag}…</strong><small>${spec.w} × ${spec.h}</small>`;const c=document.createElement('canvas');c.width=spec.w;c.height=spec.h;const ctx=c.getContext('2d',{alpha:false});ctx.setTransform(spec.w/BASE.w,0,0,spec.h/BASE.h,0,0);drawDashboard(ctx,model);download(await blob(c),`BXH-Ban-Tui-Toan-He-Thong-${iso(model.closing)}-${spec.tag}.png`);toast(`Đã xuất PNG ${spec.tag}`);}catch(e){console.error(e);toast('Xuất ảnh thất bại');}finally{btn.innerHTML=old;renderValidation();}}
function load(){try{const s=JSON.parse(localStorage.getItem(STORAGE)||'{}');els.data.value=s.data||SAMPLE;els.date.value=s.date||iso(todayLocal());}catch(_){els.data.value=SAMPLE;els.date.value=iso(todayLocal());}}

els.parse.addEventListener('click',()=>run(true));els.sample.addEventListener('click',()=>{els.data.value=SAMPLE;els.date.value=iso(todayLocal());run(true);});els.date.addEventListener('change',()=>run(false));els.export2k.addEventListener('click',()=>exportPng(EXPORT_2X,els.export2k));els.export4k.addEventListener('click',()=>exportPng(EXPORT_3X,els.export4k));els.modalClose.addEventListener('click',closeModal);els.modalOk.addEventListener('click',closeModal);els.modal.addEventListener('click',e=>{if(e.target===els.modal)closeModal();});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});window.addEventListener('resize',fitPreview);
load();run(false);
})();
