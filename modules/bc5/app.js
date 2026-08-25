(() => {
'use strict';

const BASE={w:1536,h:1024};
const EXPORT_2K={w:2048,h:1365,tag:'2K'};
const EXPORT_4K={w:4096,h:2731,tag:'4K'};
const STORAGE='sevenam-system-operation-dashboard-v1';
const REPORT_MODE_STORAGE='sevenam-system-operation-dashboard-report-mode-v1';
const FONT='Arial, "Helvetica Neue", Helvetica, sans-serif';
const MONEY_UNIT_LABEL='nghìn đồng';
const MONEY_UNIT_MULTIPLIER=1000;
const C={navy:'#07113f',navy2:'#0c2f6d',blue:'#1249b8',blue2:'#0d3b88',green:'#0b6b20',green2:'#16962d',greenDark:'#075819',orange:'#f19a00',orange2:'#ef5b13',red:'#e2111c',redDark:'#b90913',purple:'#6e188d',ink:'#0b143d',body:'#111111',text:'#202737',muted:'#667182',line:'#cfd7e2',light:'#f4f7fb',white:'#fff',gray:'#e7eaee'};

// Source of truth cho mọi trạng thái hoàn thành dùng chung trong Store/KPI/Legend.
const STATUS_RULES=[
  {key:'good',label:'TỐT',legend:'Tốt: ≥ 110,0%',min:110,color:'#075819'},
  {key:'met',label:'ĐẠT',legend:'Đạt: 100,0% - 109,9%',min:100,color:'#149B25'},
  {key:'improve',label:'CẦN CẢI THIỆN',legend:'Cần cải thiện: 70,0% - 99,9%',min:70,color:'#F19A00'},
  {key:'push',label:'CẦN ĐẨY MẠNH',legend:'Cần đẩy mạnh: 50,0% - 69,9%',min:50,color:'#EF5B13'},
  {key:'risk',label:'RỦI RO CAO',legend:'Rủi ro cao: < 50,0%',min:-Infinity,color:'#E2111C'}
];

const TYPE={
  mainTitle:{size:34,weight:700},reportTitle:{size:16,weight:700},sectionTitle:{size:17.5,weight:700},
  kpiTitle:{size:13,weight:700},kpiValue:{size:25,weight:700},kpiTarget:{size:13.2,weight:700},kpiMeta:{size:10.8,weight:700},
  tableHead:{size:9.8,weight:700},tableBody:{size:10.2,weight:700},tableNumber:{size:10.2,weight:700},
  managementBody:{size:8.8,weight:600},insightTitle:{size:14,weight:700},insightBody:{size:10.2,weight:600},legend:{size:9.6,weight:600}
};
const TABLE_STYLE={border:'#B6C3D1',grid:'#D1D9E2',headSize:9.8,headWeight:700,bodySize:10.2,bodyWeight:700,numberWeight:700,cellPadX:6};
const KPI_ICON_SIZE={money:45,cart:47,people:47,target:47,clipboard:45,chart:47,user:45};
const KPI_Y={title:15,actual:38,target:64,ring:112,growth:151,prior:172};

const $=id=>document.getElementById(id);
const els={dataInput:$('dataInput'),parseBtn:$('parseBtn'),sampleBtn:$('sampleBtn'),validationBox:$('validationBox'),previewCanvas:$('previewCanvas'),canvasWrap:$('canvasWrap'),previewScroll:$('previewScroll'),previewMeta:$('previewMeta'),export2kBtn:$('export2kBtn'),export4kBtn:$('export4kBtn'),toast:$('toast'),managerImage1:$('managerImage1'),managerImage2:$('managerImage2'),managerPreview1:$('managerPreview1'),managerPreview2:$('managerPreview2'),managerEmpty1:$('managerEmpty1'),managerEmpty2:$('managerEmpty2'),managerChooseText1:$('managerChooseText1'),managerChooseText2:$('managerChooseText2'),managerClear1:$('managerClear1'),managerClear2:$('managerClear2'),managerZoom1:$('managerZoom1'),managerZoom2:$('managerZoom2'),managerY1:$('managerY1'),managerY2:$('managerY2'),managerZoomValue1:$('managerZoomValue1'),managerZoomValue2:$('managerZoomValue2'),managerYValue1:$('managerYValue1'),managerYValue2:$('managerYValue2')};
let model=null;
let reportMode='TUẦN';
let reportModeSelect=null;
let managerImages=[null,null];
let managerImageLoading=[null,null];
let managerImageView=[{zoom:1.15,y:0},{zoom:1.15,y:0}];

const SAMPLE=`[BÁO CÁO]
Từ ngày	Đến ngày	Ngày cập nhật	Tháng Target	Từ ngày nhân sự	Đến ngày nhân sự
10/08/2026	16/08/2026	17/08/2026	08/2026	11/08/2026	16/08/2026

[KPI HỆ THỐNG]
Chỉ số	Thực đạt (nghìn đồng nếu là tiền)	Target (nghìn đồng nếu là tiền)	So sánh kỳ trước (nghìn đồng nếu là tiền)	Tăng trưởng hiển thị	Hoàn thành hiển thị	Tiến độ hiển thị
DOANH THU	1389610	7010000	2281441			
SỐ ĐƠN	776	2804	1084			
TRAFFIC	1010	3505	1328			
TỶ LỆ CHUYỂN ĐỔI		75	81			
TB BILL		2500	2105			
TB DOANH THU/NGÀY		233667	253493			
TB KHÁCH/NGÀY		117	148			

[NGUỒN KHÁCH HÀNG]
Nguồn	Tên hiển thị	SL KH	SL KH Mua	Doanh thu (nghìn đồng)
NVBH CHĂM SÓC	Do NVBH chăm sóc	388	321	679096
CSKH	DS CSKH phòng CSKH	63	50	99898
MARKETING	Marketing	446	331	610616

[CỬA HÀNG]
SR	Doanh thu thực đạt (nghìn đồng)	Target tháng (nghìn đồng)	Doanh thu cùng kỳ (nghìn đồng)	SL đơn	Traffic	Tăng trưởng hiển thị	% đạt hiển thị	Tỷ lệ chốt hiển thị	Nhóm bar	Thứ tự bar	Nhóm bảng	Thứ tự bảng
HĐ	551737	1050000	229890	369	551							
TĐT	358340	600000	125294	369	358							
TB	317083	500000	164292	194	317							
VP	332397	600000	142147	203	332							
VI	353841	600000	182392	248	354							
TDH	210560	400000	136402	141	211							
LH	194827	360000	125239	128	195							
HP	183428	400000	119045	121	183							
NĐ	168291	400000	106298	112	168							
THO	156482	350000	92435	101	156							
NB	144951	350000	51954	120	145							
LLQ	142705	260000	44310	101	143							
TN	122971	300000	49785	101	123							
HAD	116404	300000	92719	92	116							
HOB	112053	270000	58442	79	112							
VT	107285	260000	50782	87	107							

[HIỆU QUẢ NHÂN SỰ]
Nhân sự	Tên hiển thị	SR	Vai trò	Doanh thu (nghìn đồng)	SL đơn	Nhóm	Thứ tự
Nguyễn Thị Kim Anh	Nguyễn Thị Kim Anh - SR TĐT	TĐT	Sale	72168	41	TOP	1
Bùi Thị Hoa	Bùi Thị Hoa	HĐ	Sale	75090	42	TOP	2
Vũ Thị Bích Giang	Vũ Thị Bích Giang	VP	Sale	62371	35	TOP	3
Trần Thị Thanh Hà	Trần Thị Thanh Hà	TB	Sale	51291	27	TOP	4
Bùi Kim Anh	Bùi Kim Anh	VI	Sale	53765	31	TOP	5
Lê Vân Anh	Lê Vân Anh - HAD	HAD	Sale	12044	8	YẾU	1
Chu Thanh Thủy	Chu Thanh Thủy - SR TĐT	TĐT	Sale	5092	5	YẾU	2
Dương Thu Hoài	Dương Thu Hoài - SR TN	TN	Sale	5247	2	YẾU	3
Ngô Thị Hồng	Ngô Thị Hồng	HOB	Sale	3499	3	YẾU	4
Trần Thị Khánh Ly	Trần Thị Khánh Ly - SRVT	TĐT	SRVT	2023	2	YẾU	5

[ĐIỂM SÁNG QUẢN TRỊ]
Nhân sự	Vai trò	SR	Vai trò hiển thị	Ảnh	Điểm mạnh	Điểm cần cải thiện
Nguyễn Thị Kim Anh	QL	TĐT	QL - TĐT và team TĐT	assets/manager1.png	Khuấy động phong trào SR tốt; Nhân sự tương tác mạnh	Tinh thần teamwork tốt; CSKH ra SR tốt
Trần Thị Khánh Ly	SRVT	TĐT	SRVT	assets/manager2.png	Sát sao với các chỉ số SR; Bám sát khách hàng; Ổn định doanh số	Sát sao các chỉ số quản trị; Ổn định DS các tháng

[THIẾU NHÂN SỰ]
SR	Tên hiển thị	Vị trí	Số lượng thiếu
HP	HẢI PHÒNG	NVBH	1
LLQ	LẠC LONG QUÂN	NVBH	1
HOB	HÒA BÌNH	NVBH	1
HAD	HẢI DƯƠNG	QUẢN LÝ	1

[GHI CHÚ QUẢN TRỊ]
Nhóm	Nội dung
HÀNH ĐỘNG	Tập trung nâng TB Bill thông qua bán kèm
HÀNH ĐỘNG	Coaching chuyên sâu cho Bottom 5 Store
HÀNH ĐỘNG	Gia tăng data CSKH để cải thiện tỷ lệ chuyển đổi
HÀNH ĐỘNG	Theo dõi sát hiệu suất nhân sự yếu
HÀNH ĐỘNG	Tiếp tục đẩy mạnh Marketing và CSKH`;

function clean(v){return String(v??'').replace(/\*\*/g,'').replace(/`/g,'').trim();}
function norm(v){return clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().replace(/\s+/g,' ').trim();}
function parseNum(v){let s=clean(v).replace(/\s/g,'').replace(/%/g,'').replace(/[^0-9,.-]/g,''); if(!s||s==='-'||s===','||s==='.')return NaN; const neg=s.startsWith('-'); s=s.replace(/-/g,''); let n; if(s.includes(',')&&s.includes('.')){const lastComma=s.lastIndexOf(','),lastDot=s.lastIndexOf('.'); if(lastComma>lastDot)n=Number(s.replace(/\./g,'').replace(',','.')); else n=Number(s.replace(/,/g,''));} else if(s.includes(',')){const parts=s.split(','); n=parts.length===2&&parts[1].length<=2?Number(parts[0].replace(/\./g,'')+'.'+parts[1]):Number(s.replace(/,/g,''));} else if(/^\d{1,3}(\.\d{3})+$/.test(s)) n=Number(s.replace(/\./g,'')); else n=Number(s); return neg?-n:n;}
function round1(v){return Math.round(((Number(v)||0)+Number.EPSILON)*10)/10;}
function fmt(v,d=0){return (Number(v)||0).toLocaleString('vi-VN',{minimumFractionDigits:d,maximumFractionDigits:d});}
function fmtMoney(v){return fmt(Math.round(Number(v)||0),0);}
function fmtPctNumber(v){return round1(v).toLocaleString('vi-VN',{minimumFractionDigits:1,maximumFractionDigits:1});}
function fmtPct(v){return `${fmtPctNumber(v)}%`;}
function signedPct(v){const n=round1(v);return `${n>0?'+':''}${fmtPct(n)}`;}
function fmtGrowth(v){const n=round1(v);if(n>0)return `▲ +${fmtPctNumber(n)}%`;if(n<0)return `▼ ${fmtPctNumber(n)}%`;return fmtPct(0);}
function calculateGrowth(current,previous){const c=Number(current),p=Number(previous);if(!Number.isFinite(c)||!Number.isFinite(p)||p===0)return 0;return (c-p)/p*100;}
function getSalesBarWidth(value,scaleMax,maxWidth){const v=Math.max(0,Number(value)||0),m=Math.max(0,Number(scaleMax)||0);return m>0?maxWidth*(v/m):0;}
function shortRangeVN(a,b){if(!a||!b)return '';return `${String(a.getDate()).padStart(2,'0')}-${String(b.getDate()).padStart(2,'0')}/${String(b.getMonth()+1).padStart(2,'0')}`;}
function clamp(v,a,b){return Math.min(b,Math.max(a,v));}
function sum(arr,fn=x=>x){return arr.reduce((a,x)=>a+(Number(fn(x))||0),0);}
function parseDate(v){const m=clean(v).match(/(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/); if(!m)return null; const d=new Date(+m[3],+m[2]-1,+m[1]); return isNaN(d)?null:d;}
function dateVN(d){return d?`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`:'';}
function daysInclusive(a,b){return a&&b?Math.max(1,Math.round((b-a)/86400000)+1):1;}
function splitLine(line){if(line.includes('\t'))return line.split('\t').map(clean); if(line.includes('|'))return line.split('|').map(clean).filter((x,i,a)=>!(x===''&&(i===0||i===a.length-1))); return line.split(/\s{2,}/).map(clean);}
function mapRows(rows){if(!rows.length)return[]; const headers=rows[0].map(norm); return rows.slice(1).filter(r=>r.some(Boolean)).map(r=>{const o={};headers.forEach((h,i)=>o[h]=clean(r[i]??''));return o;});}
function parseBlocks(text){const lines=String(text||'').replace(/\r/g,'').split('\n'); const blocks={}; let current=''; lines.forEach(line=>{const cells=splitLine(line),first=clean(cells[0]||''); if(/^\[[^\]]+\]$/.test(first)){current=norm(first.replace(/[\[\]]/g,'')); blocks[current]=[]; return;} if(current&&cells.some(Boolean))blocks[current].push(cells);}); return blocks;}
function findField(obj,keys){for(const k of keys){const kk=Object.keys(obj).find(x=>x===k||x.includes(k)); if(kk!=null)return obj[kk];} return '';}
function findFieldKey(obj,keys){for(const k of keys){const kk=Object.keys(obj||{}).find(x=>x===k||x.includes(k));if(kk!=null)return kk;}return '';}
function detectMoneyUnit(header){const h=norm(header);if(h.includes('nghin dong'))return 'thousand_vnd';if(/(^|\s|\()dong($|\s|\))/.test(h)||h.endsWith(' dong'))return 'vnd';return 'unknown';}
function looksLikeRawVnd(values){const valid=values.filter(Number.isFinite).map(Math.abs).filter(v=>v>0).sort((a,b)=>a-b);if(!valid.length)return false;const median=valid[Math.floor(valid.length/2)];return median>=10000000;}
function makeMoneyNormalizer(rows,keys,context,issues,moneyStats,filterFn=()=>true){
  const key=findFieldKey(rows[0]||{},keys);
  const unit=detectMoneyUnit(key);
  const rawValues=rows.filter(filterFn).map(r=>parseNum(key?r[key]:findField(r,keys))).filter(Number.isFinite);
  const inferredRaw=unit!=='vnd'&&looksLikeRawVnd(rawValues);
  const convert=unit==='vnd'||inferredRaw;
  if(convert&&rawValues.length){
    moneyStats.converted+=rawValues.length;
    moneyStats.contexts.add(context);
    if(unit==='vnd')issues.push({type:'warn',text:`Dữ liệu tiền ${context} đang nhập theo đơn vị đồng. Hệ thống đã tự quy đổi ${rawValues.length} giá trị sang nghìn đồng.`});
    else issues.push({type:'warn',text:`Phát hiện dữ liệu ${context} có khả năng đang thừa 3 số so với đơn vị nghìn đồng. Hệ thống đã tự chia 1.000 và làm tròn sang nghìn đồng.`});
  }
  return r=>{const n=parseNum(key?r[key]:findField(r,keys));if(!Number.isFinite(n))return NaN;return Math.round(convert?n/MONEY_UNIT_MULTIPLIER:n);};
}
function listItems(v){return clean(v).split(';').map(x=>x.trim()).filter(Boolean);}
function allocate100(values){const total=sum(values); if(total<=0)return values.map(()=>0); const raw=values.map(v=>v/total*100),rounded=raw.map(round1); let diff=round1(100-sum(rounded)); if(Math.abs(diff)>=0.05){let idx=0; for(let i=1;i<values.length;i++)if(values[i]<values[idx])idx=i; rounded[idx]=round1(rounded[idx]+diff);} return rounded;}
function allocate100Int(values){const total=sum(values);if(total<=0)return values.map(()=>0);const rounded=values.map(v=>Math.round(v/total*100));let diff=100-sum(rounded);if(diff){let idx=0;for(let i=1;i<values.length;i++)if(values[i]<values[idx])idx=i;rounded[idx]+=diff;}return rounded;}

function normalizeReportMode(v){return norm(v).includes('thang')?'THÁNG':'TUẦN';}
function nearlyEqual(a,b,tolerance=0){const x=Number(a),y=Number(b);if(!Number.isFinite(x)||!Number.isFinite(y))return false;return Math.abs(x-y)<=Math.max(0,Number(tolerance)||0);}
function addConsistencyCheck(list,issues,{scope='LOGIC',label,actual,expected,tolerance=0,format=fmt,warnText=''}){
  const a=Number(actual),e=Number(expected);if(!Number.isFinite(a)||!Number.isFinite(e))return;
  const ok=nearlyEqual(a,e,tolerance),detail=`${format(a)} ↔ ${format(e)}`;
  list.push({scope,ok,label,actual:a,expected:e,detail});
  if(!ok)issues.push({type:'warn',text:warnText||`${scope} — ${label} chưa khớp: ${detail}.`});
}
function sourceRevenueEquation(rows){
  const vals=(rows||[]).map(r=>Number(r.revenue)).filter(Number.isFinite);
  if(!vals.length)return '';
  return `${vals.map(fmtMoney).join(' + ')} = ${fmtMoney(sum(vals))}`;
}
function initReportModeControl(){
  try{reportMode=normalizeReportMode(localStorage.getItem(REPORT_MODE_STORAGE)||'TUẦN');}catch(_){reportMode='TUẦN';}
  const host=els.parseBtn&&els.parseBtn.parentElement;if(!host)return;
  let wrap=document.getElementById('reportModeControl');
  if(!wrap){
    wrap=document.createElement('label');wrap.id='reportModeControl';
    wrap.style.cssText='display:inline-flex;align-items:center;gap:8px;padding:7px 10px;border:1px solid #cfd7e2;border-radius:8px;background:#fff;color:#0b143d;font:700 13px Arial,Helvetica,sans-serif;white-space:nowrap;';
    const cap=document.createElement('span');cap.textContent='Loại báo cáo';
    reportModeSelect=document.createElement('select');reportModeSelect.id='reportModeSelect';reportModeSelect.style.cssText='border:1px solid #aebbc9;border-radius:6px;padding:6px 28px 6px 9px;background:#f8fafc;color:#07113f;font:700 13px Arial,Helvetica,sans-serif;cursor:pointer;';
    [['TUẦN','Báo cáo tuần'],['THÁNG','Báo cáo tháng']].forEach(([value,label])=>{const o=document.createElement('option');o.value=value;o.textContent=label;reportModeSelect.appendChild(o);});
    wrap.appendChild(cap);wrap.appendChild(reportModeSelect);
    host.insertBefore(wrap,els.parseBtn);
  }else reportModeSelect=document.getElementById('reportModeSelect');
  if(reportModeSelect){reportModeSelect.value=reportMode;reportModeSelect.addEventListener('change',()=>{reportMode=normalizeReportMode(reportModeSelect.value);try{localStorage.setItem(REPORT_MODE_STORAGE,reportMode);}catch(_){}if(model)run(true);});}
}

function buildModel(text,selectedReportMode=reportMode){
  const blocks=parseBlocks(text),issues=[],moneyStats={converted:0,contexts:new Set()},consistencyChecks=[];
  const reportType=normalizeReportMode(selectedReportMode);
  const priorPeriodLabel=reportType==='THÁNG'?'Tháng trước':'Tuần trước';
  const actionPeriodLabel=reportType==='THÁNG'?'HÀNH ĐỘNG THÁNG TỚI':'HÀNH ĐỘNG TUẦN TỚI';
  const reportRows=mapRows(blocks['bao cao']||[]),report=reportRows[0]||{};
  const from=parseDate(findField(report,['tu ngay'])),to=parseDate(findField(report,['den ngay'])),update=parseDate(findField(report,['ngay cap nhat'])),staffFrom=parseDate(findField(report,['tu ngay nhan su']))||from,staffTo=parseDate(findField(report,['den ngay nhan su']))||to;
  if(!from||!to)issues.push({type:'err',text:'Thiếu hoặc sai Từ ngày / Đến ngày trong [BÁO CÁO].'});
  const reportDays=daysInclusive(from,to);

  // MONEY PIPELINE: INPUT -> detect header unit -> normalize -> MODEL (always thousand VND).
  const kpiRows=mapRows(blocks['kpi he thong']||[]),kpiMap={};
  const isMoneyKpiRow=r=>{const n=norm(findField(r,['chi so']));return n==='doanh thu'||n==='tb bill'||n.includes('tb doanh thu/ngay');};
  const kpiMoneyActual=makeMoneyNormalizer(kpiRows,['thuc dat'],'[KPI HỆ THỐNG] Thực đạt',issues,moneyStats,isMoneyKpiRow);
  const kpiMoneyTarget=makeMoneyNormalizer(kpiRows,['target'],'[KPI HỆ THỐNG] Target',issues,moneyStats,isMoneyKpiRow);
  const kpiMoneyPrior=makeMoneyNormalizer(kpiRows,['so sanh ky truoc'],'[KPI HỆ THỐNG] So sánh kỳ trước',issues,moneyStats,isMoneyKpiRow);
  kpiRows.forEach(r=>{
    const name=norm(findField(r,['chi so']));
    if(!name)return;
    const isMoney=isMoneyKpiRow(r);
    const dg=parseNum(findField(r,['tang truong hien thi'])),dc=parseNum(findField(r,['hoan thanh hien thi'])),dp=parseNum(findField(r,['tien do hien thi']));
    kpiMap[name]={
      name:findField(r,['chi so']),
      actual:isMoney?kpiMoneyActual(r):parseNum(findField(r,['thuc dat'])),
      target:isMoney?kpiMoneyTarget(r):parseNum(findField(r,['target'])),
      prior:isMoney?kpiMoneyPrior(r):parseNum(findField(r,['so sanh ky truoc'])),
      displayGrowth:Number.isFinite(dg)?round1(dg):NaN,
      displayComplete:Number.isFinite(dc)?round1(dc):NaN,
      displayProgress:Number.isFinite(dp)?round1(dp):NaN
    };
  });
  const getK=q=>{const key=Object.keys(kpiMap).find(k=>k===q||k.includes(q));return key?kpiMap[key]:{actual:NaN,target:NaN,prior:NaN,displayGrowth:NaN,displayComplete:NaN,displayProgress:NaN};};
  const revenueK=getK('doanh thu'),ordersK=getK('so don'),trafficK=getK('traffic'),convK=getK('ty le chuyen doi'),billK=getK('tb bill'),revDayK=getK('tb doanh thu/ngay'),custDayK=getK('tb khach/ngay');
  const revenue=revenueK.actual,orders=ordersK.actual,traffic=trafficK.actual;
  if(!Number.isFinite(revenue)||!Number.isFinite(orders)||!Number.isFinite(traffic))issues.push({type:'err',text:'[KPI HỆ THỐNG] cần có Thực đạt của DOANH THU, SỐ ĐƠN và TRAFFIC.'});
  const conversion=traffic>0?orders/traffic*100:0,avgBill=orders>0?revenue/orders:0,avgRevDay=reportDays?revenue/reportDays:0,avgCustDay=reportDays?traffic/reportDays:0;
  const metricDefs=[
    ['revenue','DOANH THU','money',revenue,revenueK,'num'],['orders','SỐ ĐƠN BÁN','cart',orders,ordersK,'num'],['traffic','TRAFFIC','people',traffic,trafficK,'num'],
    ['conversion','TỶ LỆ CHUYỂN ĐỔI','target',conversion,convK,'pct'],['bill','TB BILL','clipboard',avgBill,billK,'num'],['revday','DOANH THU TB/NGÀY','chart',avgRevDay,revDayK,'num'],['custday','TB KHÁCH/NGÀY','user',avgCustDay,custDayK,'num']
  ];
  const metrics=metricDefs.map(([key,label,icon,actual,k,kind])=>{
    const complete=k.target>0?actual/k.target*100:0,growth=calculateGrowth(actual,k.prior);
    // Logic dashboard luôn lấy từ dữ liệu gốc; các cột override cũ chỉ được giữ để tương thích input nhưng không chi phối KPI.
    return {key,label,icon,actual,target:k.target,prior:k.prior,kind,complete,growth,displayComplete:round1(complete),displayGrowth:round1(growth),displayProgress:round1(complete)};
  });

  // BLOCK 1 — kiểm tra các KPI dẫn xuất nếu người dùng có nhập Thực đạt ở các dòng này.
  if(Number.isFinite(convK.actual))addConsistencyCheck(consistencyChecks,issues,{scope:'BLOCK 1',label:'Tỷ lệ chuyển đổi = Số đơn / Traffic',actual:convK.actual,expected:conversion,tolerance:.15,format:fmtPct,warnText:`BLOCK 1: Tỷ lệ chuyển đổi nhập ${fmtPct(convK.actual)} chưa khớp ${fmt(orders,0)} / ${fmt(traffic,0)} = ${fmtPct(conversion)}.`});
  else consistencyChecks.push({scope:'BLOCK 1',ok:true,label:'Tỷ lệ chuyển đổi tự tính',detail:`${fmt(orders,0)} / ${fmt(traffic,0)} = ${fmtPct(conversion)}`});
  if(Number.isFinite(billK.actual))addConsistencyCheck(consistencyChecks,issues,{scope:'BLOCK 1',label:'TB Bill = Doanh thu / Số đơn',actual:billK.actual,expected:avgBill,tolerance:1,format:fmtMoney,warnText:`BLOCK 1: TB Bill nhập ${fmtMoney(billK.actual)} chưa khớp ${fmtMoney(revenue)} / ${fmt(orders,0)} = ${fmtMoney(avgBill)} nghìn đồng.`});
  else consistencyChecks.push({scope:'BLOCK 1',ok:true,label:'TB Bill tự tính',detail:`${fmtMoney(revenue)} / ${fmt(orders,0)} = ${fmtMoney(avgBill)} nghìn đồng`});
  if(Number.isFinite(revDayK.actual))addConsistencyCheck(consistencyChecks,issues,{scope:'BLOCK 1',label:'Doanh thu TB/ngày = Doanh thu / Số ngày',actual:revDayK.actual,expected:avgRevDay,tolerance:1,format:fmtMoney,warnText:`BLOCK 1: Doanh thu TB/ngày nhập ${fmtMoney(revDayK.actual)} chưa khớp ${fmtMoney(revenue)} / ${reportDays} = ${fmtMoney(avgRevDay)}.`});
  else consistencyChecks.push({scope:'BLOCK 1',ok:true,label:'Doanh thu TB/ngày tự tính',detail:`${fmtMoney(revenue)} / ${reportDays} = ${fmtMoney(avgRevDay)} nghìn đồng`});
  if(Number.isFinite(custDayK.actual))addConsistencyCheck(consistencyChecks,issues,{scope:'BLOCK 1',label:'TB khách/ngày = Traffic / Số ngày',actual:custDayK.actual,expected:avgCustDay,tolerance:1,format:v=>fmt(v,0),warnText:`BLOCK 1: TB khách/ngày nhập ${fmt(custDayK.actual,0)} chưa khớp ${fmt(traffic,0)} / ${reportDays} = ${fmt(avgCustDay,0)}.`});
  else consistencyChecks.push({scope:'BLOCK 1',ok:true,label:'TB khách/ngày tự tính',detail:`${fmt(traffic,0)} / ${reportDays} = ${fmt(avgCustDay,0)}`});

  const sourceRaw=mapRows(blocks['nguon khach hang']||[]);
  const sourceMoney=makeMoneyNormalizer(sourceRaw,['doanh thu'],'[NGUỒN KHÁCH HÀNG] Doanh thu',issues,moneyStats);
  const sourceRows=sourceRaw.map(r=>({name:findField(r,['nguon']),displayName:findField(r,['ten hien thi'])||findField(r,['nguon']),customers:parseNum(findField(r,['sl kh'])),buyers:parseNum(findField(r,['sl kh mua'])),revenue:sourceMoney(r)})).filter(x=>x.name);
  const sourceShares=allocate100(sourceRows.map(x=>x.revenue));sourceRows.forEach((x,i)=>{x.share=round1(sourceShares[i]);});

  // BLOCK 2 — một nguồn dữ liệu duy nhất cho bảng + donut; kiểm tra nội bộ và đối chiếu Block 1/Funnel.
  const sourceRevenueTotal=sum(sourceRows,r=>r.revenue),sourceCustomerTotal=sum(sourceRows,r=>r.customers),sourceBuyerTotal=sum(sourceRows,r=>r.buyers),sourceShareTotal=round1(sum(sourceRows,r=>r.share));
  sourceRows.forEach(r=>{
    if(!Number.isFinite(r.customers)||r.customers<0)issues.push({type:'warn',text:`BLOCK 2: SL KH của nguồn ${r.name} không hợp lệ.`});
    if(!Number.isFinite(r.buyers)||r.buyers<0)issues.push({type:'warn',text:`BLOCK 2: SL KH mua của nguồn ${r.name} không hợp lệ.`});
    if(Number.isFinite(r.customers)&&Number.isFinite(r.buyers)&&r.buyers>r.customers)issues.push({type:'warn',text:`BLOCK 2: ${r.name} có SL KH mua ${fmt(r.buyers,0)} lớn hơn SL KH ${fmt(r.customers,0)}.`});
    if(!Number.isFinite(r.revenue)||r.revenue<0)issues.push({type:'warn',text:`BLOCK 2: Doanh thu của nguồn ${r.name} không hợp lệ.`});
  });
  addConsistencyCheck(consistencyChecks,issues,{scope:'BLOCK 2 ↔ BLOCK 1',label:'Tổng doanh thu bảng nguồn = Doanh thu hệ thống/Funnel',actual:sourceRevenueTotal,expected:revenue,tolerance:1,format:fmtMoney,warnText:`BLOCK 2: Tổng doanh thu các nguồn ${fmtMoney(sourceRevenueTotal)} chưa khớp Doanh thu Block 1/Funnel ${fmtMoney(revenue)} nghìn đồng.`});
  addConsistencyCheck(consistencyChecks,issues,{scope:'BLOCK 2',label:'Tổng % doanh thu nguồn',actual:sourceShareTotal,expected:100,tolerance:.05,format:fmtPct,warnText:`BLOCK 2: Tổng tỷ trọng nguồn đang là ${fmtPct(sourceShareTotal)}, phải bằng 100,0%.`});
  consistencyChecks.push({scope:'BLOCK 2',ok:true,label:'Bảng và biểu đồ cơ cấu dùng cùng dữ liệu nguồn',detail:`Tổng bảng ${fmtMoney(sourceRevenueTotal)} • Donut ${fmtPct(sourceShareTotal)} • SL KH ${fmt(sourceCustomerTotal,0)} • SL KH mua ${fmt(sourceBuyerTotal,0)}`});

  const storeRaw=mapRows(blocks['cua hang']||[]);
  const storeActualMoney=makeMoneyNormalizer(storeRaw,['doanh thu thuc dat'],'[CỬA HÀNG] Doanh thu thực đạt',issues,moneyStats);
  const storeTargetMoney=makeMoneyNormalizer(storeRaw,['target thang'],'[CỬA HÀNG] Target tháng',issues,moneyStats);
  const storePriorMoney=makeMoneyNormalizer(storeRaw,['doanh thu cung ky'],'[CỬA HÀNG] Doanh thu cùng kỳ',issues,moneyStats);
  const storeRows=storeRaw.map((r,i)=>({
    sr:findField(r,['sr']),actual:storeActualMoney(r),target:storeTargetMoney(r),prior:storePriorMoney(r),orders:parseNum(findField(r,['sl don'])),traffic:parseNum(findField(r,['traffic'])),inputOrder:i,
    displayGrowth:parseNum(findField(r,['tang truong hien thi'])),displayComplete:parseNum(findField(r,['phan tram dat hien thi','% dat hien thi'])),displayCloseRate:parseNum(findField(r,['ty le chot hien thi'])),
    barGroup:norm(findField(r,['nhom bar'])),barOrder:parseNum(findField(r,['thu tu bar'])),tableGroup:norm(findField(r,['nhom bang'])),tableOrder:parseNum(findField(r,['thu tu bang']))
  })).filter(x=>x.sr);
  storeRows.forEach(r=>{
    r.complete=r.target>0?r.actual/r.target*100:0;
    r.growth=calculateGrowth(r.actual,r.prior);
    r.closeRate=r.traffic>0?r.orders/r.traffic*100:0;
    r.displayComplete=round1(r.complete);r.displayGrowth=round1(r.growth);r.displayCloseRate=round1(r.closeRate);r.state=storeState(r.complete);
  });
  // Một nguồn xếp hạng duy nhất: chart và table dùng đúng cùng danh sách Top/Bottom.
  const byRevenueDesc=[...storeRows].sort((a,b)=>(Number(b.actual)||0)-(Number(a.actual)||0)||a.inputOrder-b.inputOrder);
  const byRevenueAsc=[...storeRows].sort((a,b)=>(Number(a.actual)||0)-(Number(b.actual)||0)||a.inputOrder-b.inputOrder);
  const top5Bar=byRevenueDesc.slice(0,5),bottom5Bar=byRevenueAsc.slice(0,5);
  const top5Table=top5Bar,bottom5Table=bottom5Bar;
  const salesBarScaleMax=Math.max(1,...[...top5Bar,...bottom5Bar].map(r=>Number(r.actual)||0));

  const staffRaw=mapRows(blocks['hieu qua nhan su']||[]);
  const staffMoney=makeMoneyNormalizer(staffRaw,['doanh thu'],'[HIỆU QUẢ NHÂN SỰ] Doanh thu',issues,moneyStats);
  const staffRows=staffRaw.map((r,i)=>({name:findField(r,['nhan su']),displayName:findField(r,['ten hien thi']),sr:findField(r,['sr']),role:findField(r,['vai tro']),revenue:staffMoney(r),orders:parseNum(findField(r,['sl don'])),group:norm(findField(r,['nhom'])),order:parseNum(findField(r,['thu tu'])),inputOrder:i})).filter(x=>x.name);
  staffRows.forEach(r=>r.aov=r.orders>0?r.revenue/r.orders:0);
  const groupTop=staffRows.filter(r=>r.group==='top').sort((a,b)=>(Number.isFinite(a.order)?a.order:999)-(Number.isFinite(b.order)?b.order:999)||a.inputOrder-b.inputOrder),groupWeak=staffRows.filter(r=>r.group==='yeu'||r.group==='weak'||r.group==='bottom').sort((a,b)=>(Number.isFinite(a.order)?a.order:999)-(Number.isFinite(b.order)?b.order:999)||a.inputOrder-b.inputOrder);
  const topStaff=(groupTop.length?groupTop:staffRows.slice(0,5)).slice(0,5),weakStaff=(groupWeak.length?groupWeak:staffRows.slice(5,10)).slice(0,5);

  const managerRows=mapRows(blocks['diem sang quan tri']||[]).map(r=>({name:findField(r,['nhan su']),role:findField(r,['vai tro']),sr:findField(r,['sr']),displayRole:findField(r,['vai tro hien thi']),image:findField(r,['anh']),strength:listItems(findField(r,['diem manh'])),expand:listItems(findField(r,['diem can cai thien']))})).filter(x=>x.name).slice(0,2);
  const shortages=mapRows(blocks['thieu nhan su']||[]).map(r=>({sr:findField(r,['sr']),displayName:findField(r,['ten hien thi']),role:findField(r,['vi tri']),count:parseNum(findField(r,['so luong thieu']))})).filter(x=>x.sr&&x.count>0),shortageTotal=sum(shortages,x=>x.count);
  const notes=mapRows(blocks['ghi chu quan tri']||[]).map(r=>({group:findField(r,['nhom']),text:findField(r,['noi dung'])})).filter(x=>x.text);

  if(storeRows.length<5)issues.push({type:'warn',text:`Mới có ${storeRows.length} cửa hàng; Top/Bottom sẽ dùng số dòng hiện có.`});
  if(staffRows.length<5)issues.push({type:'warn',text:`Mới có ${staffRows.length} nhân sự; Top nhân sự sẽ dùng số dòng hiện có.`});
  if(!sourceRows.length)issues.push({type:'warn',text:'Chưa có [NGUỒN KHÁCH HÀNG].'});

  const revenueComplete=revenueK.target>0?revenue/revenueK.target*100:0,remaining=Math.max(0,(revenueK.target||0)-revenue),revenueMetric=metrics.find(x=>x.key==='revenue');
  const positives=buildPositive(metrics),risks=buildRisks(metrics,bottom5Table,reportType),actions=notes.filter(n=>norm(n.group).includes('hanh dong')).map(n=>n.text).slice(0,5);if(!actions.length)actions.push(...buildActions(metrics));
  const personnel=buildPersonnel(shortageTotal,weakStaff,managerRows);
  return {issues,reportType,priorPeriodLabel,actionPeriodLabel,from,to,update,staffFrom,staffTo,reportDays,metrics,revenue,revenueTarget:revenueK.target,revenueComplete,revenueDisplayComplete:round1(revenueComplete),revenueDisplayProgress:round1(revenueComplete),remaining,orders,traffic,conversion,avgBill,avgRevDay,avgCustDay,sourceRows,sourceRevenueTotal,sourceCustomerTotal,sourceBuyerTotal,sourceShareTotal,sourceRevenueEquation:sourceRevenueEquation(sourceRows),consistencyChecks,storeRows,top5:top5Bar,bottom5:bottom5Bar,top5Bar,bottom5Bar,top5Table,bottom5Table,salesBarScaleMax,staffRows,topStaff,weakStaff,managerRows,shortages,shortageTotal,actions,positives,risks,personnel,moneyUnit:'thousand_vnd',moneyUnitLabel:MONEY_UNIT_LABEL,moneyConversionCount:moneyStats.converted,moneyConversionContexts:[...moneyStats.contexts]};
}
function statusRuleFor(p){const n=Number(p)||0;return STATUS_RULES.find(rule=>n>=rule.min)||STATUS_RULES[STATUS_RULES.length-1];}
function storeState(p){const rule=statusRuleFor(p);return{key:rule.key,label:rule.label,color:rule.color};}
function kpiColor(p){return statusRuleFor(p).color;}
function buildPositive(metrics){const out=[],by=k=>metrics.find(m=>m.key===k);['revenue','orders','traffic'].forEach(k=>{const m=by(k);if(m)out.push(`${m.label.charAt(0)+m.label.slice(1).toLowerCase()} hoàn thành ${fmtPct(m.displayComplete)} kế hoạch.`);});const c=by('conversion');if(c)out.push(`Tỷ lệ chuyển đổi đạt ${fmtPct(c.actual)}${c.actual>=c.target?', vượt KPI.':'.'}`);const d=by('custday');if(d)out.push(`Khách trung bình/ngày đạt ${fmtPct(d.displayComplete)} kế hoạch.`);return out.slice(0,5);}
function buildRisks(metrics,bottom,reportType='TUẦN'){const out=[],periodText=reportType==='THÁNG'?'tháng trước':'tuần trước';metrics.slice(0,3).forEach(m=>{if(m.displayGrowth<0)out.push(`${m.label.charAt(0)+m.label.slice(1).toLowerCase()} giảm ${fmtPct(Math.abs(m.displayGrowth))} so với ${periodText}.`);});const b=metrics.find(m=>m.key==='bill');if(b&&b.displayComplete<100)out.push(`TB Bill chỉ đạt ${fmtPct(b.displayComplete)} kế hoạch${b.displayGrowth<0?` và giảm ${fmtPct(Math.abs(b.displayGrowth))}`:''}.`);const weak=bottom.filter(x=>x.complete<70).map(x=>x.sr).slice(0,5);if(weak.length)out.push(`Các cửa hàng ${weak.join(', ')} đạt thấp.`);return out.slice(0,5);}
function buildActions(metrics){const out=[];const bill=metrics.find(m=>m.key==='bill'),conv=metrics.find(m=>m.key==='conversion'),traffic=metrics.find(m=>m.key==='traffic');if(bill&&bill.complete<100)out.push('Tập trung nâng TB Bill thông qua bán kèm.');out.push('Coaching chuyên sâu cho Bottom 5 Store.');if(conv&&conv.complete<100)out.push('Tăng chất lượng tư vấn để cải thiện tỷ lệ chuyển đổi.');if(traffic&&traffic.complete<100)out.push('Gia tăng traffic từ Marketing và CSKH.');out.push('Theo dõi sát hiệu suất nhân sự yếu.');return out.slice(0,5);}
function buildPersonnel(shortage,weak,managers){const out=[];if(shortage>0)out.push(`Bổ sung đủ ${String(shortage).padStart(2,'0')} nhân sự cho các cửa hàng thiếu.`);if(weak.length)out.push('QL kèm sát nhóm nhân sự hiệu suất thấp.');if(managers.length)out.push('Nhân rộng mô hình quản trị hiệu quả.');out.push('Duy trì tinh thần teamwork trong toàn hệ thống.');return out.slice(0,4);}

// Canvas helpers
function normalizeWeight(weight=400){const n=Number(weight);if(!Number.isFinite(n))return 400;if(n>=700)return 700;if(n>=600)return 600;return 400;}
function setFont(ctx,size,weight=400,baseline='top'){ctx.font=`${normalizeWeight(weight)} ${size}px ${FONT}`;ctx.textBaseline=baseline;}
function font(ctx,size,w=400){setFont(ctx,size,w,'top');}
function text(ctx,s,x,y,size=14,color=C.text,w=400,align='left'){ctx.save();setFont(ctx,size,w,'top');ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(String(s),x,y);ctx.restore();}
function mid(ctx,s,x,y,size=14,color=C.text,w=700,align='center'){ctx.save();setFont(ctx,size,w,'middle');ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(String(s),x,y);ctx.restore();}
function fit(ctx,s,x,y,maxW,size,color=C.text,w=700,align='left',min=8){let z=size;while(z>min){setFont(ctx,z,w,'top');if(ctx.measureText(String(s)).width<=maxW)break;z-=.5;}text(ctx,s,x,y,z,color,w,align);}
function fitMid(ctx,s,x,y,maxW,size,color=C.text,w=700,align='center',min=9){let z=size;while(z>min){setFont(ctx,z,w,'middle');if(ctx.measureText(String(s)).width<=maxW)break;z-=.5;}mid(ctx,s,x,y,z,color,w,align);}
function fitEllipsisMid(ctx,s,x,y,maxW,size,color=C.text,w=700,align='left',min=8.2){let z=size;const raw=String(s);while(z>min){setFont(ctx,z,w,'middle');if(ctx.measureText(raw).width<=maxW){mid(ctx,raw,x,y,z,color,w,align);return;}z-=.4;}z=min;setFont(ctx,z,w,'middle');let out=raw;while(out.length>1&&ctx.measureText(out+'…').width>maxW)out=out.slice(0,-1);mid(ctx,out===raw?raw:out+'…',x,y,z,color,w,align);}
function textWidth(ctx,s,size=14,w=400){ctx.save();setFont(ctx,size,w,'top');const z=ctx.measureText(String(s)).width;ctx.restore();return z;}
function wrapLines(ctx,s,maxW,size=12,w=400,maxLines=4){ctx.save();setFont(ctx,size,w,'top');const words=String(s).split(/\s+/).filter(Boolean),out=[];let line='';for(let i=0;i<words.length;i++){const t=line?line+' '+words[i]:words[i];if(line&&ctx.measureText(t).width>maxW){out.push(line);line=words[i];if(out.length===maxLines-1){let rem=[line,...words.slice(i+1)].join(' ');while(rem.length>2&&ctx.measureText(rem+'…').width>maxW)rem=rem.slice(0,-1);out.push(rem+'…');ctx.restore();return out;}}else line=t;}if(line)out.push(line);ctx.restore();return out.slice(0,maxLines);}
function bullets(ctx,items,x,y,maxW,lineH,size,color=C.text,max=5,weight=600,itemGap=2){let yy=y;items.slice(0,max).forEach(item=>{circle(ctx,x+3,yy+6.5,2.1,color);const lines=wrapLines(ctx,item,maxW-13,size,weight,2);lines.forEach((ln,i)=>text(ctx,ln,x+13,yy+i*lineH,size,color,weight));yy+=Math.max(1,lines.length)*lineH+itemGap;});return yy;}
function panel(ctx,x,y,w,h,title,icon='overview',titleColor=C.ink){rr(ctx,x,y,w,h,10,C.white,TABLE_STYLE.border,1.1);if(title){drawSectionIcon(ctx,x+16,y+16,24,icon);fit(ctx,title,x+40,y+7,w-52,TYPE.sectionTitle.size,titleColor,TYPE.sectionTitle.weight,'left',16.5);}}
function panelWithHeader(ctx,x,y,w,h,title,icon='overview',unitLabel=''){rr(ctx,x,y,w,h,10,C.white,TABLE_STYLE.border,1.1);drawSectionIcon(ctx,x+16,y+16,24,icon);const titleMax=w-(unitLabel?210:52);fit(ctx,title,x+40,y+7,titleMax,TYPE.sectionTitle.size,C.ink,TYPE.sectionTitle.weight,'left',16.5);if(unitLabel)fit(ctx,unitLabel,x+w-12,y+10,158,8.2,C.muted,600,'right',7.4);return y+36;}
function sectionHead(ctx,x,y,w,title,icon='overview'){rr(ctx,x,y,w,32,8,C.white,TABLE_STYLE.border,1);drawSectionIcon(ctx,x+16,y+16,24,icon);fit(ctx,title,x+40,y+6,w-52,TYPE.sectionTitle.size,C.ink,TYPE.sectionTitle.weight,'left',16.5);}
function rr(ctx,x,y,w,h,r,fill,stroke=null,lw=1){ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}ctx.restore();}
function line(ctx,x1,y1,x2,y2,color=C.line,lw=1){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();}
function circle(ctx,x,y,r,fill,stroke=null,lw=1){ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}ctx.restore();}
function wrapLines(ctx,s,maxW,size=12,w=400,maxLines=4){ctx.save();font(ctx,size,w);const words=String(s).split(/\s+/).filter(Boolean),out=[];let line='';for(let i=0;i<words.length;i++){const t=line?line+' '+words[i]:words[i];if(line&&ctx.measureText(t).width>maxW){out.push(line);line=words[i];if(out.length===maxLines-1){let rem=[line,...words.slice(i+1)].join(' ');while(rem.length>2&&ctx.measureText(rem+'…').width>maxW)rem=rem.slice(0,-1);out.push(rem+'…');ctx.restore();return out;}}else line=t;}if(line)out.push(line);ctx.restore();return out.slice(0,maxLines);}
function bullets(ctx,items,x,y,maxW,lineH,size,color=C.text,max=5,weight=600){let yy=y;items.slice(0,max).forEach(item=>{circle(ctx,x+3,yy+6.5,2.1,color);const lines=wrapLines(ctx,item,maxW-13,size,weight,2);lines.forEach((ln,i)=>text(ctx,ln,x+13,yy+i*lineH,size,color,weight));yy+=Math.max(1,lines.length)*lineH+2;});return yy;}
function panel(ctx,x,y,w,h,title,icon='overview',titleColor=C.ink){rr(ctx,x,y,w,h,10,C.white,TABLE_STYLE.border,1.1);if(title){drawSectionIcon(ctx,x+16,y+16,24,icon);text(ctx,title,x+44,y+7,TYPE.sectionTitle.size,titleColor,TYPE.sectionTitle.weight);}}
function panelWithHeader(ctx,x,y,w,h,title,icon='overview',unitLabel=''){rr(ctx,x,y,w,h,10,C.white,TABLE_STYLE.border,1.1);drawSectionIcon(ctx,x+16,y+16,24,icon);text(ctx,title,x+44,y+7,TYPE.sectionTitle.size,C.ink,TYPE.sectionTitle.weight);if(unitLabel)fit(ctx,unitLabel,x+w-12,y+10,160,9,C.muted,700,'right',7.5);return y+36;}
function sectionHead(ctx,x,y,w,title,icon='overview'){rr(ctx,x,y,w,32,8,C.white,TABLE_STYLE.border,1);drawSectionIcon(ctx,x+16,y+16,24,icon);text(ctx,title,x+44,y+6,TYPE.sectionTitle.size,C.ink,TYPE.sectionTitle.weight);}
function drawSectionIcon(ctx,cx,cy,s,type){
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';const lw=Math.max(2.2,s*.095),r=s/2;
  if(type==='positive'){rr(ctx,cx-r,cy-r,s,s,5,C.green2);ctx.strokeStyle='#fff';ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(cx-s*.23,cy);ctx.lineTo(cx-s*.05,cy+s*.18);ctx.lineTo(cx+s*.29,cy-s*.25);ctx.stroke();ctx.restore();return;}
  if(type==='warn'){ctx.fillStyle=C.orange;ctx.beginPath();ctx.moveTo(cx,cy-s*.48);ctx.lineTo(cx+s*.46,cy+s*.38);ctx.lineTo(cx-s*.46,cy+s*.38);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(cx-1.5,cy-s*.20,3,s*.31);circle(ctx,cx,cy+s*.22,2,'#fff');ctx.restore();return;}
  rr(ctx,cx-r,cy-r,s,s,5,C.navy);ctx.strokeStyle='#fff';ctx.fillStyle='#fff';ctx.lineWidth=lw;
  if(type==='overview'){
    const q=s*.24,g=s*.09,left=cx-(q*2+g)/2,top=cy-(q*2+g)/2;
    for(let yy=0;yy<2;yy++)for(let xx=0;xx<2;xx++)rr(ctx,left+xx*(q+g),top+yy*(q+g),q,q,2,xx===1&&yy===1?'#fff':'transparent','#fff',lw*.85);
  }else if(type==='sources'){
    circle(ctx,cx-s*.08,cy,s*.29,'transparent','#fff',lw);ctx.beginPath();ctx.moveTo(cx-s*.08,cy);ctx.lineTo(cx-s*.08,cy-s*.29);ctx.lineTo(cx+s*.17,cy-s*.13);ctx.stroke();
    circle(ctx,cx+s*.32,cy-s*.25,s*.06,'#fff');circle(ctx,cx+s*.35,cy+s*.22,s*.06,'#fff');line(ctx,cx+s*.17,cy-s*.13,cx+s*.29,cy-s*.22,'#fff',lw*.8);line(ctx,cx+s*.18,cy+s*.12,cx+s*.31,cy+s*.20,'#fff',lw*.8);
  }else if(type==='store'){
    ctx.beginPath();ctx.moveTo(cx-s*.34,cy-s*.14);ctx.lineTo(cx-s*.25,cy-s*.36);ctx.lineTo(cx+s*.25,cy-s*.36);ctx.lineTo(cx+s*.34,cy-s*.14);ctx.closePath();ctx.stroke();
    rr(ctx,cx-s*.28,cy-s*.11,s*.56,s*.40,1.5,'transparent','#fff',lw);line(ctx,cx-s*.28,cy-s*.02,cx+s*.28,cy-s*.02,'#fff',lw*.8);rr(ctx,cx-s*.07,cy+s*.04,s*.14,s*.25,1,'#fff');
  }else if(type==='peopleperf'){
    circle(ctx,cx-s*.14,cy-s*.18,s*.105,'#fff');circle(ctx,cx+s*.13,cy-s*.13,s*.09,'#fff');
    ctx.beginPath();ctx.arc(cx-s*.14,cy+s*.19,s*.22,Math.PI,0);ctx.fill();ctx.beginPath();ctx.arc(cx+s*.15,cy+s*.18,s*.18,Math.PI,0);ctx.fill();star(ctx,cx+s*.30,cy-s*.30,s*.085,'#fff');
  }else if(type==='light'){
    ctx.beginPath();ctx.arc(cx,cy-s*.08,s*.22,Math.PI*.12,Math.PI*.88,true);ctx.stroke();line(ctx,cx-s*.10,cy+s*.14,cx+s*.10,cy+s*.14,'#fff',lw);line(ctx,cx-s*.07,cy+s*.25,cx+s*.07,cy+s*.25,'#fff',lw);line(ctx,cx,cy-s*.40,cx,cy-s*.33,'#fff',lw*.8);line(ctx,cx-s*.31,cy-s*.25,cx-s*.24,cy-s*.18,'#fff',lw*.8);line(ctx,cx+s*.31,cy-s*.25,cx+s*.24,cy-s*.18,'#fff',lw*.8);star(ctx,cx+s*.29,cy+s*.23,s*.075,'#fff');
  }else if(type==='staffgap'){
    circle(ctx,cx-s*.16,cy-s*.15,s*.095,'#fff');circle(ctx,cx+s*.08,cy-s*.11,s*.082,'#fff');ctx.beginPath();ctx.arc(cx-s*.16,cy+s*.18,s*.19,Math.PI,0);ctx.fill();ctx.beginPath();ctx.arc(cx+s*.08,cy+s*.17,s*.16,Math.PI,0);ctx.fill();
    line(ctx,cx+s*.22,cy-s*.31,cx+s*.38,cy-s*.31,'#fff',lw);line(ctx,cx+s*.30,cy-s*.39,cx+s*.30,cy-s*.23,'#fff',lw);line(ctx,cx+s*.20,cy+s*.31,cx+s*.38,cy+s*.31,'#fff',lw);
  }else if(type==='target'){
    circle(ctx,cx,cy,s*.29,'transparent','#fff',lw);circle(ctx,cx,cy,s*.13,'transparent','#fff',lw);line(ctx,cx-s*.02,cy+s*.02,cx+s*.34,cy-s*.34,'#fff',lw);
  }else{
    ctx.beginPath();ctx.moveTo(cx-s*.22,cy);ctx.lineTo(cx-s*.05,cy+s*.17);ctx.lineTo(cx+s*.25,cy-s*.23);ctx.stroke();
  }
  ctx.restore();
}
function drawIcon(ctx,type,cx,cy,s,color=C.navy){
  ctx.save();ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=Math.max(2.2,s*.075);ctx.lineCap='round';ctx.lineJoin='round';const r=s/2;
  if(type==='money'){circle(ctx,cx,cy,r*.66,color);mid(ctx,'$',cx,cy+1,s*.62,'#fff',700);}
  else if(type==='cart'){ctx.beginPath();ctx.moveTo(cx-r*.62,cy-r*.42);ctx.lineTo(cx-r*.42,cy-r*.42);ctx.lineTo(cx-r*.25,cy+r*.2);ctx.lineTo(cx+r*.48,cy+r*.2);ctx.lineTo(cx+r*.62,cy-r*.2);ctx.lineTo(cx-r*.32,cy-r*.2);ctx.stroke();circle(ctx,cx-r*.12,cy+r*.42,r*.10,color);circle(ctx,cx+r*.38,cy+r*.42,r*.10,color);}
  else if(type==='people'){circle(ctx,cx,cy-r*.29,r*.18,color);circle(ctx,cx-r*.39,cy-r*.15,r*.14,color);circle(ctx,cx+r*.39,cy-r*.15,r*.14,color);rr(ctx,cx-r*.25,cy-r*.02,r*.50,r*.45,r*.12,color);rr(ctx,cx-r*.63,cy+r*.04,r*.31,r*.36,r*.1,color);rr(ctx,cx+r*.32,cy+r*.04,r*.31,r*.36,r*.1,color);}
  else if(type==='target'){[.63,.41,.18].forEach((f,i)=>circle(ctx,cx,cy,r*f,i===2?color:'transparent',color,2.2));ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+r*.61,cy-r*.61);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+r*.39,cy-r*.61);ctx.lineTo(cx+r*.61,cy-r*.61);ctx.lineTo(cx+r*.61,cy-r*.39);ctx.stroke();}
  else if(type==='clipboard'){rr(ctx,cx-r*.45,cy-r*.48,r*.9,r*.95,3,color);rr(ctx,cx-r*.20,cy-r*.60,r*.40,r*.20,3,color);ctx.strokeStyle='#fff';ctx.lineWidth=2;line(ctx,cx-r*.25,cy-r*.08,cx+r*.23,cy-r*.08,'#fff',2);line(ctx,cx-r*.25,cy+r*.15,cx+r*.23,cy+r*.15,'#fff',2);}
  else if(type==='chart'){rr(ctx,cx-r*.52,cy+r*.08,r*.18,r*.38,1,color);rr(ctx,cx-r*.20,cy-r*.08,r*.18,r*.54,1,color);rr(ctx,cx+r*.12,cy-r*.30,r*.18,r*.76,1,color);ctx.beginPath();ctx.moveTo(cx-r*.52,cy-r*.14);ctx.lineTo(cx-r*.12,cy-r*.42);ctx.lineTo(cx+r*.08,cy-r*.28);ctx.lineTo(cx+r*.52,cy-r*.62);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+r*.29,cy-r*.62);ctx.lineTo(cx+r*.52,cy-r*.62);ctx.lineTo(cx+r*.52,cy-r*.39);ctx.stroke();}
  else if(type==='user'){circle(ctx,cx,cy-r*.30,r*.22,color);ctx.beginPath();ctx.arc(cx,cy+r*.43,r*.45,Math.PI,0);ctx.fill();}
  else if(type==='calendar'){const lw=Math.max(2,s*.055);rr(ctx,cx-r*.76,cy-r*.62,r*1.52,r*1.24,4,'transparent',color,lw);line(ctx,cx-r*.76,cy-r*.27,cx+r*.76,cy-r*.27,color,lw);line(ctx,cx-r*.38,cy-r*.78,cx-r*.38,cy-r*.48,color,lw);line(ctx,cx+r*.38,cy-r*.78,cx+r*.38,cy-r*.48,color,lw);for(let yy=0;yy<2;yy++)for(let xx=0;xx<3;xx++)rr(ctx,cx-r*.47+xx*r*.47,cy-r*.03+yy*r*.34,r*.16,r*.16,1,color);}
  else if(type==='trophy'){rr(ctx,cx-r*.27,cy-r*.43,r*.54,r*.52,r*.06,color);ctx.strokeStyle=color;ctx.lineWidth=Math.max(3,s*.09);ctx.beginPath();ctx.moveTo(cx-r*.27,cy-r*.25);ctx.bezierCurveTo(cx-r*.62,cy-r*.26,cx-r*.56,cy+r*.10,cx-r*.20,cy+r*.02);ctx.moveTo(cx+r*.27,cy-r*.25);ctx.bezierCurveTo(cx+r*.62,cy-r*.26,cx+r*.56,cy+r*.10,cx+r*.20,cy+r*.02);ctx.stroke();rr(ctx,cx-r*.06,cy+r*.10,r*.12,r*.28,2,color);rr(ctx,cx-r*.31,cy+r*.36,r*.62,r*.13,2,color);}
  else if(type==='trend'){ctx.strokeStyle=color;ctx.lineWidth=Math.max(4,s*.13);ctx.beginPath();ctx.moveTo(cx-r*.55,cy+r*.38);ctx.lineTo(cx-r*.12,cy-r*.05);ctx.lineTo(cx+r*.10,cy+r*.13);ctx.lineTo(cx+r*.55,cy-r*.45);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+r*.25,cy-r*.45);ctx.lineTo(cx+r*.55,cy-r*.45);ctx.lineTo(cx+r*.55,cy-r*.15);ctx.stroke();}
  ctx.restore();
}
function ring(ctx,cx,cy,r,p,color,label=null){ctx.save();ctx.lineWidth=7;ctx.strokeStyle='#d8dce2';ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();ctx.strokeStyle=color;ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*clamp(Number(p)||0,0,100)/100);ctx.stroke();ctx.restore();fitMid(ctx,label??fmtPct(p),cx,cy+1,r*1.55,15,color,700,'center',13.5);}
function progress(ctx,x,y,w,h,p,color){rr(ctx,x,y,w,h,h/2,'#e2e5e9');rr(ctx,x,y,w*clamp(p,0,100)/100,h,h/2,color);}
function solidBar(ctx,x,y,w,h,p,color){const fw=w*clamp(Number(p)||0,0,100)/100;if(fw>0)rr(ctx,x,y,fw,h,h/2,color);}
function star(ctx,cx,cy,r,color){ctx.save();ctx.fillStyle=color;ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rrr=i%2===0?r:r*.43;const x=cx+Math.cos(a)*rrr,y=cy+Math.sin(a)*rrr;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fill();ctx.restore();}
function avatar(ctx,cx,cy,r,label){circle(ctx,cx,cy,r,'#eef3f8','#b8c6d6',1);circle(ctx,cx,cy-r*.28,r*.22,C.navy);ctx.fillStyle=C.navy;ctx.beginPath();ctx.arc(cx,cy+r*.38,r*.43,Math.PI,0);ctx.fill();const initials=label.split(/\s+/).filter(Boolean).slice(-2).map(x=>x[0]).join('').toUpperCase();rr(ctx,cx-r*.5,cy+r*.58,r,18,9,C.navy);fitMid(ctx,initials,cx,cy+r*.67,r-8,10,'#fff',700);}

const MANAGER_IMAGE_CACHE={};
function loadManagerImages(rows){const jobs=(rows||[]).filter(r=>r.image).map(r=>new Promise(resolve=>{if(MANAGER_IMAGE_CACHE[r.image])return resolve();const img=new Image();img.crossOrigin='anonymous';img.onload=()=>{MANAGER_IMAGE_CACHE[r.image]=img;resolve();};img.onerror=()=>resolve();img.src=r.image;}));return Promise.all(jobs);}
function drawImageCover(ctx,img,x,y,w,h,positionY=.15,zoom=1,offsetY=0){const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height;if(!iw||!ih)return false;const baseScale=Math.max(w/iw,h/ih),scale=baseScale*Math.max(1,Number(zoom)||1),sw=w/scale,sh=h/scale,sx=(iw-sw)/2;let sy=(ih-sh)*positionY-(Number(offsetY)||0)/scale;sy=Math.max(0,Math.min(ih-sh,sy));ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);return true;}
function managerImageFor(r,slot){const uploaded=managerImages[slot];if(uploaded&&uploaded.complete&&(uploaded.naturalWidth||uploaded.width))return uploaded;const img=r&&r.image?MANAGER_IMAGE_CACHE[r.image]:null;return img&&img.complete&&(img.naturalWidth||img.width)?img:null;}
function drawManagerPortrait(ctx,r,slot,x,y,w,h){const img=managerImageFor(r,slot),view=managerImageView[slot]||{zoom:1.15,y:0};if(img){ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,5);ctx.clip();drawImageCover(ctx,img,x,y,w,h,.08,view.zoom,view.y);ctx.restore();return;}avatar(ctx,x+w/2,y+h*.47,Math.min(w,h)*.33,r?r.name:'');}
async function ensureManagerImagesReady(){await loadManagerImages(model?model.managerRows:[]);await Promise.all(managerImageLoading.filter(Boolean).map(p=>Promise.resolve(p).catch(()=>null)));}
function updateManagerUploadUI(slot){const img=managerImages[slot],preview=slot===0?els.managerPreview1:els.managerPreview2,empty=slot===0?els.managerEmpty1:els.managerEmpty2,txt=slot===0?els.managerChooseText1:els.managerChooseText2,clear=slot===0?els.managerClear1:els.managerClear2;if(preview){if(img){preview.src=img.src;preview.hidden=false;}else{preview.removeAttribute&&preview.removeAttribute('src');preview.hidden=true;}}if(empty)empty.hidden=!!img;if(txt)txt.textContent=img?'Thay ảnh':'Chọn ảnh';if(clear)clear.disabled=!img;}
function updateManagerViewUI(slot){const view=managerImageView[slot]||{zoom:1.15,y:0},z=slot===0?els.managerZoomValue1:els.managerZoomValue2,yy=slot===0?els.managerYValue1:els.managerYValue2;if(z)z.textContent=`${Number(view.zoom).toFixed(2)}×`;if(yy)yy.textContent=`${Math.round(view.y)} px`;}
function setManagerView(slot,key,value){const v=managerImageView[slot]||(managerImageView[slot]={zoom:1.15,y:0});v[key]=Number(value);updateManagerViewUI(slot);if(model)renderPreview();}

function setManagerUpload(slot,file){if(!file)return;const input=slot===0?els.managerImage1:els.managerImage2;managerImageLoading[slot]=new Promise(resolve=>{try{const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{managerImages[slot]=img;managerImageLoading[slot]=null;updateManagerUploadUI(slot);if(model)renderPreview();toast(`Đã cập nhật ảnh quản lý ${slot+1}`);resolve();};img.onerror=()=>{managerImageLoading[slot]=null;toast('Ảnh không hợp lệ • dùng avatar mặc định');resolve();};img.src=reader.result;};reader.onerror=()=>{managerImageLoading[slot]=null;toast('Không đọc được ảnh');resolve();};reader.readAsDataURL(file);}catch(_){managerImageLoading[slot]=null;resolve();}});return managerImageLoading[slot];}
function clearManagerUpload(slot){managerImages[slot]=null;managerImageLoading[slot]=null;const input=slot===0?els.managerImage1:els.managerImage2;if(input)input.value='';updateManagerUploadUI(slot);if(model)renderPreview();}
function metricCompleteLabel(k){return fmtPct(k.displayComplete);}
function isMoneyMetric(k){return ['revenue','bill','revday'].includes(k.key);}
function metricActualLabel(k){return k.kind==='pct'?fmtPct(k.actual):(isMoneyMetric(k)?fmtMoney(k.actual):fmt(k.actual,0));}
function metricTargetLabel(k){return k.kind==='pct'?fmtPct(k.target):(isMoneyMetric(k)?fmtMoney(k.target):fmt(k.target,0));}
function metricPriorLabel(k){return k.kind==='pct'?fmtPct(k.prior):(isMoneyMetric(k)?fmtMoney(k.prior):fmt(k.prior,0));}
const STORE_LABEL={HP:'HẢI PHÒNG',LLQ:'LẠC LONG QUÂN',HOB:'HÒA BÌNH',HAD:'HẢI DƯƠNG'};
function drawDashboard(ctx,m){
  ctx.fillStyle=C.navy;ctx.fillRect(0,0,BASE.w,BASE.h);
  text(ctx,'DASHBOARD ĐIỀU HÀNH HỆ THỐNG BÁN LẺ',BASE.w/2,7,TYPE.mainTitle.size,'#fff',TYPE.mainTitle.weight,'center');
  fit(ctx,`BÁO CÁO ${m.reportType}: ${dateVN(m.from)} - ${dateVN(m.to)}  •  ĐVT TIỀN TỆ: NGHÌN ĐỒNG`,BASE.w/2,45,900,14,'#fff',700,'center',12);
  rr(ctx,1270,7,246,48,7,'transparent','#fff',1.2);drawIcon(ctx,'calendar',1297,31,40,'#fff');text(ctx,'THỜI GIAN BÁO CÁO',1324,14,11,'#fff',700);fit(ctx,`${dateVN(m.from)} - ${dateVN(m.to)}`,1324,31,178,13,'#fff',700,'left',11);

  // BLOCK 1 — shared vertical rhythm for all 7 KPI cards.
  rr(ctx,10,62,1516,291,10,C.white,TABLE_STYLE.border,1.1);drawSectionIcon(ctx,26,78,24,'overview');text(ctx,'1. TỔNG QUAN TOÀN HỆ THỐNG',50,68,TYPE.sectionTitle.size,C.ink,TYPE.sectionTitle.weight);
  const topY=94,cardH=191,gap=7,left=18,cardW=(1500-gap*6)/7;
  m.metrics.forEach((k,i)=>{
    const x=left+i*(cardW+gap),col=kpiColor(k.complete),iconCol=(k.key==='conversion'||k.key==='revday'||k.key==='custday')?C.green:C.navy;
    rr(ctx,x,topY,cardW,cardH,8,'#fff','#92a5bb',1);
    drawIcon(ctx,k.icon,x+35,topY+27,KPI_ICON_SIZE[k.icon]||45,iconCol);
    fit(ctx,k.label,x+cardW/2+10,topY+KPI_Y.title,cardW-94,TYPE.kpiTitle.size,C.ink,TYPE.kpiTitle.weight,'center',10.5);
    fit(ctx,metricActualLabel(k),x+cardW/2,topY+KPI_Y.actual,cardW-28,TYPE.kpiValue.size,col,TYPE.kpiValue.weight,'center',20);
    fit(ctx,`/ ${metricTargetLabel(k)}`,x+cardW/2,topY+KPI_Y.target,cardW-36,TYPE.kpiTarget.size,C.ink,TYPE.kpiTarget.weight,'center',10.5);
    ring(ctx,x+cardW/2,topY+KPI_Y.ring,29,k.displayComplete,col,metricCompleteLabel(k));
    text(ctx,'Tăng trưởng:',x+38,topY+KPI_Y.growth,TYPE.kpiMeta.size,C.ink,TYPE.kpiMeta.weight);fit(ctx,fmtGrowth(k.displayGrowth),x+cardW-18,topY+KPI_Y.growth-1,78,TYPE.kpiMeta.size+1,k.displayGrowth>0?C.green:k.displayGrowth<0?C.red:C.navy,700,'right',10);
    text(ctx,`${m.priorPeriodLabel}:`,x+38,topY+KPI_Y.prior,TYPE.kpiMeta.size,C.ink,TYPE.kpiMeta.weight);fit(ctx,metricPriorLabel(k),x+cardW-18,topY+KPI_Y.prior-1,96,TYPE.kpiMeta.size,C.ink,700,'right',9.5);
  });
  rr(ctx,18,293,1500,59,8,'#fff','#92a5bb',1);text(ctx,'TIẾN ĐỘ HOÀN THÀNH KẾ HOẠCH DOANH THU',36,301,16,C.ink,700);progress(ctx,36,327,650,12,m.revenueDisplayProgress,C.green2);fit(ctx,fmtPct(m.revenueDisplayComplete),790,298,165,26,C.green,700,'center',20);fit(ctx,'HOÀN THÀNH KẾ HOẠCH',790,329,210,12,C.green,700,'center',10);line(ctx,700,296,700,348,'#9fb0c2',1);line(ctx,1088,296,1088,348,'#9fb0c2',1);line(ctx,1306,296,1306,348,'#9fb0c2',1);[['KẾ HOẠCH',m.revenueTarget,C.navy],['THỰC ĐẠT',m.revenue,C.red],['CÒN THIẾU',m.remaining,C.red]].forEach((a,i)=>{const cx=[994,1197,1411][i];fit(ctx,a[0],cx,302,175,13,C.ink,700,'center',11);fit(ctx,fmtMoney(a[1]),cx,325,175,20,a[2],700,'center',15);});
  ctx.fillStyle=C.navy;ctx.fillRect(10,354,1516,6);

  // BLOCK 2 — unified outer panel.
  panelWithHeader(ctx,10,360,542,310,'2. PHÂN TÍCH NGUỒN KHÁCH HÀNG','sources');
  text(ctx,'CƠ CẤU DOANH THU THEO NGUỒN',26,397,11,C.ink,700);drawDonut(ctx,m.sourceRows,140,470,46);sourceLabels(ctx,m.sourceRows);drawFunnel(ctx,m,335,397,190,154);
  text(ctx,'CHI TIẾT THEO NGUỒN',26,538,10.5,C.ink,700);drawSourceTable(ctx,m.sourceRows,20,552,520,108);

  // Top / Bottom SR bars — both groups share the same left edge and 100% scale.
  panel(ctx,560,360,360,310,'');drawIcon(ctx,'trophy',580,378,40,C.orange);text(ctx,'TOP 5 SR BÁN TỐT',608,365,16,C.ink,700);fit(ctx,'Đơn vị: Nghìn đồng',908,368,130,8.8,C.muted,600,'right',7.8);
  // Chart Top/Bottom dùng cùng grid và cùng thang doanh thu tuyệt đối.
  const storeBarBase={rankX:580,nameX:606,barX:685,maxBarWidth:145,valueX:842,scaleMax:m.salesBarScaleMax};
  drawStoreBars(ctx,m.top5Bar,{...storeBarBase,y:398,h:105,color:C.blue});
  line(ctx,570,511,910,511,'#cfd7e2',1);
  drawIcon(ctx,'trend',580,534,33,C.red);text(ctx,'TOP 5 SR BÁN YẾU',608,522,16,C.ink,700);fit(ctx,'Đơn vị: Nghìn đồng',908,525,130,8.8,C.muted,600,'right',7.8);
  drawStoreBars(ctx,m.bottom5Bar,{...storeBarBase,y:556,h:98,color:C.red});

  // BLOCK 3 — unified panel, compact header rows.
  panelWithHeader(ctx,928,360,598,310,'3. TOP - BOTTOM STORE (QUẢN LÝ HỆ THỐNG)','store');
  drawStoreTable(ctx,m.top5Table,938,395,578,127,'TOP 5 STORE',C.green,m);drawStoreTable(ctx,m.bottom5Table,938,529,578,127,'BOTTOM 5 STORE',C.red,m);

  // BLOCK 4 — unified panel.
  panelWithHeader(ctx,10,677,758,195,'4. HIỆU QUẢ NHÂN SỰ','peopleperf');
  drawStaffTable(ctx,m.topStaff,20,708,360,153,'TOP 5 BEST SELLER',C.green,true);drawStaffTable(ctx,m.weakStaff,388,708,370,153,'TOP NHÂN SỰ YẾU',C.red,false);

  // BLOCK 5 — unified panel, upload/crop support retained.
  panelWithHeader(ctx,776,677,462,195,'5. ĐIỂM SÁNG QUẢN TRỊ','light');drawManagers(ctx,m.managerRows,786,708,442,153);

  // BLOCK 6 — unified panel.
  panelWithHeader(ctx,1246,677,280,195,'6. THIẾU / THỪA NHÂN SỰ','staffgap');drawShortages(ctx,m,1257,710,258,151);

  // Bottom insight strip remains inside BASE.
  panel(ctx,10,879,1516,135,'');drawInsightColumn(ctx,'ĐIỂM TÍCH CỰC',m.positives,24,889,330,C.green,'positive');line(ctx,348,890,348,1004,'#c7d1dc',1);drawInsightColumn(ctx,'RỦI RO',m.risks,365,889,300,C.orange,'warn');line(ctx,676,890,676,1004,'#c7d1dc',1);drawActionColumn(ctx,m.actions,694,889,305,m.actionPeriodLabel);line(ctx,1010,890,1010,1004,'#c7d1dc',1);drawInsightColumn(ctx,'NHÂN SỰ',m.personnel,1027,889,265,C.purple,'people');line(ctx,1300,890,1300,1004,'#c7d1dc',1);drawLegend(ctx,1315,889,196,114);
}
function drawDonut(ctx,rows,cx,cy,r){const colors=[C.blue,C.orange,C.green,C.purple,'#0e7aa3'];let a=95*Math.PI/180;rows.forEach((row,i)=>{const span=Math.PI*2*(row.share||0)/100;ctx.save();ctx.strokeStyle=colors[i%colors.length];ctx.lineWidth=23;ctx.beginPath();ctx.arc(cx,cy,r,a,a+span);ctx.stroke();ctx.restore();a+=span;});circle(ctx,cx,cy,r-18,'#fff');}
function sourceLabels(ctx,rows){const colors=[C.blue,C.orange,C.green],r0=rows[0],r1=rows[1],r2=rows[2];if(r0){fit(ctx,fmtPct(r0.share),31,420,68,22,colors[0],700,'left',16);text(ctx,'Do NVBH',31,448,10,C.ink,700);text(ctx,'chăm sóc',31,463,10,C.ink,700);}if(r1){fit(ctx,fmtPct(r1.share),204,420,68,22,colors[1],700,'left',16);text(ctx,'DS CSKH',204,448,10,C.ink,700);text(ctx,'phòng CSKH',204,463,10,C.ink,700);}if(r2){fit(ctx,fmtPct(r2.share),204,497,68,22,colors[2],700,'left',16);text(ctx,'Marketing',204,525,10,C.ink,700);}}
function drawSourceTable(ctx,rows,x,y,w,h){
  const cols=[0,.28,.48,.68,.87,1].map(v=>x+w*v),headH=21,totalRows=rows.length+1,rh=(h-headH)/Math.max(totalRows,1);
  rr(ctx,x,y,w,h,3,'#fff',TABLE_STYLE.border,1.2);
  ['Nguồn','SL KH','SL KH mua','Doanh thu','% Doanh thu'].forEach((t,i)=>fitMid(ctx,t,(cols[i]+cols[i+1])/2,y+headH/2,cols[i+1]-cols[i]-6,TYPE.tableHead.size,C.ink,TYPE.tableHead.weight,'center',7.8));
  for(let i=1;i<cols.length-1;i++)line(ctx,cols[i],y,cols[i],y+h,TABLE_STYLE.grid,.95);
  line(ctx,x,y+headH,x+w,y+headH,TABLE_STYLE.border,1);
  rows.forEach((r,i)=>{
    const cy=y+headH+rh*(i+.5);
    fitMid(ctx,r.name,cols[0]+6,cy,cols[1]-cols[0]-12,TYPE.tableBody.size,C.body,700,'left',8);
    fitMid(ctx,fmt(r.customers,0),(cols[1]+cols[2])/2,cy,cols[2]-cols[1]-6,TYPE.tableNumber.size,C.body,700);
    fitMid(ctx,fmt(r.buyers,0),(cols[2]+cols[3])/2,cy,cols[3]-cols[2]-6,TYPE.tableNumber.size,C.body,700);
    fitMid(ctx,fmtMoney(r.revenue),(cols[3]+cols[4])/2,cy,cols[4]-cols[3]-6,TYPE.tableNumber.size,C.body,700);
    fitMid(ctx,fmtPct(r.share),(cols[4]+cols[5])/2,cy,cols[5]-cols[4]-6,TYPE.tableNumber.size,C.body,700);
    line(ctx,x,y+headH+rh*(i+1),x+w,y+headH+rh*(i+1),TABLE_STYLE.grid,1);
  });
  const totalCustomers=sum(rows,r=>r.customers),totalBuyers=sum(rows,r=>r.buyers),totalRevenue=sum(rows,r=>r.revenue),cy=y+headH+rh*(rows.length+.5);
  fitMid(ctx,'TỔNG',cols[0]+6,cy,cols[1]-cols[0]-12,10.7,C.body,700,'left');
  fitMid(ctx,fmt(totalCustomers,0),(cols[1]+cols[2])/2,cy,cols[2]-cols[1]-6,10.7,C.body,700);
  fitMid(ctx,fmt(totalBuyers,0),(cols[2]+cols[3])/2,cy,cols[3]-cols[2]-6,10.7,C.body,700);
  fitMid(ctx,fmtMoney(totalRevenue),(cols[3]+cols[4])/2,cy,cols[4]-cols[3]-6,10.7,C.body,700);
  fitMid(ctx,fmtPct(100),(cols[4]+cols[5])/2,cy,cols[5]-cols[4]-6,10.7,C.body,700);
}
function drawFunnel(ctx,m,x,y,w,h){text(ctx,'PHỄU BÁN HÀNG',x+w/2,y-18,11,C.ink,700,'center');const data=[['TRAFFIC',m.traffic,C.blue],['TB KHÁCH/NGÀY',m.avgCustDay,C.green],['ĐƠN HÀNG',m.orders,C.orange],['DOANH THU',m.revenue,C.redDark]],levels=[1,.85,.77,.69];data.forEach((d,i)=>{const top=w*levels[i],next=i<3?levels[i+1]:levels[i]-.05,bot=w*next,yy=y+i*38;ctx.save();ctx.fillStyle=d[2];ctx.beginPath();ctx.moveTo(x+(w-top)/2,yy);ctx.lineTo(x+(w+top)/2,yy);ctx.lineTo(x+(w+bot)/2,yy+34);ctx.lineTo(x+(w-bot)/2,yy+34);ctx.closePath();ctx.fill();ctx.restore();mid(ctx,d[0],x+w/2,yy+10,11,'#fff',700);mid(ctx,d[0]==='DOANH THU'?fmtMoney(d[1]):fmt(d[1],0),x+w/2,yy+25,18,'#fff',700);});}
function drawStoreBars(ctx,rows,opt){
  const {rankX,nameX,barX,maxBarWidth,valueX,scaleMax,y,h,color}=opt;if(!rows.length)return;
  const rh=h/rows.length;
  rows.forEach((r,i)=>{
    const cy=y+rh*(i+.5),value=Math.max(0,Number(r.actual)||0);
    const barW=getSalesBarWidth(value,scaleMax,maxBarWidth);
    fitMid(ctx,i+1,rankX,cy,22,11.2,C.ink,700);
    fitMid(ctx,r.sr,nameX,cy,58,10.9,C.ink,700,'left',8.8);
    if(barW>0)rr(ctx,barX,cy-4.5,barW,9,4.5,color);
    text(ctx,fmtMoney(value),valueX,cy-7.3,10.8,C.body,700,'left');
  });
}

function drawStoreTable(ctx,rows,x,y,w,h,title,color,m){
  rr(ctx,x,y,w,h,4,'#fff',TABLE_STYLE.border,1.1);rr(ctx,x,y,102,18,4,color);fitMid(ctx,title,x+51,y+9,96,10.8,'#fff',700);
  const top=y+20,headH=24,widths=[.07,.20,.20,.16,.14,.13,.10],edges=[x];widths.forEach(v=>edges.push(edges[edges.length-1]+w*v));
  const two=(a,b,i)=>{fitMid(ctx,a,(edges[i]+edges[i+1])/2,top+8,edges[i+1]-edges[i]-4,9.0,C.ink,700,'center',7.8);fitMid(ctx,b,(edges[i]+edges[i+1])/2,top+17,edges[i+1]-edges[i]-4,8.7,C.ink,700,'center',7.5);};
  fitMid(ctx,'STT',(edges[0]+edges[1])/2,top+headH/2,widths[0]*w-3,9.2,C.ink,700);fitMid(ctx,'TÊN CỬA HÀNG',(edges[1]+edges[2])/2,top+headH/2,widths[1]*w-4,8.7,C.ink,700);two('DS THỰC ĐẠT',`(${shortRangeVN(m.from,m.to)})`,2);fitMid(ctx,'DS TARGET',(edges[3]+edges[4])/2,top+headH/2,widths[3]*w-3,9.1,C.ink,700);two('% ĐẠT','TARGET',4);two('TĂNG TRƯỞNG','SO VỚI CÙNG KỲ',5);two('TỶ LỆ','CHỐT',6);
  for(let i=1;i<edges.length-1;i++)line(ctx,edges[i],top,edges[i],y+h,TABLE_STYLE.grid,.9);line(ctx,x,top+headH,x+w,top+headH,TABLE_STYLE.border,1);
  const rh=(h-20-headH)/Math.max(rows.length,1);
  rows.forEach((r,i)=>{
    const cy=top+headH+rh*(i+.5);
    fitMid(ctx,i+1,(edges[0]+edges[1])/2,cy,widths[0]*w-3,TYPE.tableNumber.size,C.body,700);
    fitMid(ctx,r.sr,(edges[1]+edges[2])/2,cy,widths[1]*w-4,TYPE.tableBody.size,C.body,700);
    fitMid(ctx,fmtMoney(r.actual),(edges[2]+edges[3])/2,cy,widths[2]*w-4,TYPE.tableNumber.size,C.body,700);
    fitMid(ctx,fmtMoney(r.target),(edges[3]+edges[4])/2,cy,widths[3]*w-4,TYPE.tableNumber.size,C.body,700);
    const pctLeft=edges[4]+4,pctRight=edges[5]-4;
    fitMid(ctx,fmtPct(r.displayComplete),pctLeft+19,cy,38,TYPE.tableNumber.size,C.body,700);
    rr(ctx,pctLeft+42,cy-3.5,Math.max(2,(pctRight-(pctLeft+46))*clamp(r.displayComplete,0,100)/100),7,3,color);
    fitMid(ctx,fmtPct(r.displayGrowth),(edges[5]+edges[6])/2,cy,widths[5]*w-4,TYPE.tableNumber.size,C.body,700);
    fitMid(ctx,fmtPct(r.displayCloseRate),(edges[6]+edges[7])/2,cy,widths[6]*w-4,TYPE.tableNumber.size,C.body,700);
    if(i<rows.length-1)line(ctx,x,top+headH+rh*(i+1),x+w,top+headH+rh*(i+1),TABLE_STYLE.grid,1);
  });
}
function drawStaffTable(ctx,rows,x,y,w,h,title,color,best){
  star(ctx,x+10,y+8,7.5,color);fit(ctx,title,x+23,y,300,11.7,color,700,'left',9.3);
  const top=y+21,head=21;rr(ctx,x,top,w,h-21,3,'#fff',TABLE_STYLE.border,1.1);
  const ratios=[.08,.38,.22,.12,.20],edges=[x];ratios.forEach(r=>edges.push(edges[edges.length-1]+w*r));
  ['STT','NHÂN SỰ','DOANH THU','SL ĐƠN','AOV'].forEach((t,i)=>fitMid(ctx,t,(edges[i]+edges[i+1])/2,top+head/2,edges[i+1]-edges[i]-5,TYPE.tableHead.size,C.ink,700,'center',7.8));
  for(let i=1;i<edges.length-1;i++)line(ctx,edges[i],top,edges[i],top+h-21,TABLE_STYLE.grid,.9);line(ctx,x,top+head,x+w,top+head,TABLE_STYLE.border,1);
  const rh=(h-42)/Math.max(rows.length,1),pad=6;
  rows.forEach((r,i)=>{
    const cy=top+head+rh*(i+.5),label=r.displayName||r.name;
    fitMid(ctx,i+1,(edges[0]+edges[1])/2,cy,edges[1]-edges[0]-4,TYPE.tableNumber.size,C.body,700);
    fitEllipsisMid(ctx,label,edges[1]+pad,cy,edges[2]-edges[1]-pad*2,TYPE.tableBody.size,C.body,700,'left',8.2);
    fitMid(ctx,fmtMoney(r.revenue),(edges[2]+edges[3])/2,cy,edges[3]-edges[2]-pad*2,TYPE.tableNumber.size,C.body,700,'center',8.4);
    fitMid(ctx,fmt(r.orders,0),(edges[3]+edges[4])/2,cy,edges[4]-edges[3]-8,TYPE.tableNumber.size,C.body,700,'center',8.4);
    fitMid(ctx,fmtMoney(r.aov),(edges[4]+edges[5])/2,cy,edges[5]-edges[4]-pad*2,TYPE.tableNumber.size,C.body,700,'center',8.4);
    if(i<rows.length-1)line(ctx,x,top+head+rh*(i+1),x+w,top+head+rh*(i+1),TABLE_STYLE.grid,1);
  });
}
function drawWrappedCheckBullet(ctx,value,bulletX,textX,y,textW,bottom,{size=8.8,lineHeight=10.8,itemGap=2.3,maxLines=2}={}){
  if(y+lineHeight>bottom)return y;
  let allowed=Math.max(1,Math.min(maxLines,Math.floor((bottom-y)/lineHeight)));
  const lines=wrapLines(ctx,value,textW,size,600,allowed);
  if(!lines.length)return y;
  text(ctx,'✓',bulletX,y,size+0.2,C.green,700);
  lines.forEach((ln,i)=>text(ctx,ln,textX,y+i*lineHeight,size,C.ink,600));
  return y+lines.length*lineHeight+itemGap;
}
function drawManagerBulletGroup(ctx,items,bulletX,textX,startY,textW,bottom,maxItems){
  let yy=startY;for(const item of items.slice(0,maxItems)){if(yy+10.8>bottom)break;yy=drawWrappedCheckBullet(ctx,item,bulletX,textX,yy,textW,bottom,{maxLines:2});}return yy;
}
function drawManagers(ctx,rows,x,y,w,h){
  const gap=6,cw=(w-gap)/2;
  for(let i=0;i<2;i++){
    const r=rows[i],xx=x+i*(cw+gap);rr(ctx,xx,y,cw,h,7,'#fff',TABLE_STYLE.border,1);
    if(!r){fitMid(ctx,'Chưa có dữ liệu quản trị',xx+cw/2,y+h/2,cw-20,10,C.muted,700);continue;}
    fit(ctx,r.name,xx+cw/2,y+4,cw-10,10.5,C.ink,700,'center',8.5);
    fit(ctx,r.displayRole||`${r.role}${r.sr?' - '+r.sr:''}`,xx+cw/2,y+19,cw-10,9,C.ink,700,'center',7.4);
    const photoX=xx+8,photoY=y+33,photoW=76,photoH=112;drawManagerPortrait(ctx,r,i,photoX,photoY,photoW,photoH);
    const textX=photoX+photoW+9,textRight=xx+cw-8,textW=Math.max(70,textRight-textX),contentTop=y+34,contentBottom=y+h-7;
    ctx.save();ctx.beginPath();ctx.rect(textX,contentTop,textW,contentBottom-contentTop);ctx.clip();
    text(ctx,'ĐIỂM MẠNH',textX,contentTop,9.4,C.green,700);
    const strengthStart=contentTop+14;
    const expandItems=r.expand.slice(0,2),expandReserve=14+Math.max(1,expandItems.length)*13.1+2;
    const strengthBottom=Math.max(strengthStart+12,contentBottom-expandReserve);
    let yy=drawManagerBulletGroup(ctx,r.strength,textX,textX+13,strengthStart,textW-13,strengthBottom,3);
    const expandTitleY=Math.min(Math.max(yy+3,strengthStart+29),contentBottom-31);
    text(ctx,'NHÂN RỘNG',textX,expandTitleY,9.2,C.green,700);
    yy=drawManagerBulletGroup(ctx,expandItems,textX,textX+13,expandTitleY+14,textW-13,contentBottom,2);
    ctx.restore();
  }
}
function compactShortageRows(rows){
  const src=(Array.isArray(rows)?rows:[]).filter(r=>r&&Number(r.count)>0);
  if(src.length<=4)return src;

  // Giữ 3 showroom đầu riêng; gộp toàn bộ phần còn lại vào dòng thứ 4
  // để bảng luôn vừa đúng 4 dòng nhưng tổng số lượng thiếu không thay đổi.
  const head=src.slice(0,3);
  const rest=src.slice(3);
  const restCount=rest.reduce((sum,r)=>sum+(Number(r.count)||0),0);
  const sameRole=rest.every(r=>String(r.role||'').trim().toLowerCase()===String(rest[0]?.role||'').trim().toLowerCase());
  const codes=rest.map(r=>String(r.sr||'').trim()).filter(Boolean);
  let displayName='';
  if(codes.length<=3){
    displayName=codes.join(' + ');
  }else{
    displayName=`${codes.length} SR CÒN LẠI`;
  }

  return head.concat([{
    sr:'OTHER',
    displayName,
    role:sameRole?(rest[0]?.role||'NHÂN SỰ'):'NHÂN SỰ',
    count:restCount,
    grouped:true,
    groupedStores:rest
  }]);
}

function drawShortages(ctx,m,x,y,w,h){const tableH=h-27;rr(ctx,x,y,w,tableH,4,'#fff',TABLE_STYLE.border,1.2);const col=x+w*.58,headH=23;fitMid(ctx,'CỬA HÀNG',x+w*.29,y+headH/2,w*.56,10.0,C.ink,700);fitMid(ctx,'SỐ LƯỢNG THIẾU',col+w*.21,y+headH/2,w*.4,9.8,C.ink,700);line(ctx,col,y,col,y+tableH,TABLE_STYLE.grid,1);line(ctx,x,y+headH,x+w,y+headH,TABLE_STYLE.border,1);const rows=compactShortageRows(m.shortages),rh=(tableH-headH)/Math.max(rows.length,1);rows.forEach((r,i)=>{const cy=y+headH+rh*(i+.5),label=(r.displayName||STORE_LABEL[norm(r.sr).toUpperCase()]||STORE_LABEL[r.sr]||r.sr).toUpperCase();fitMid(ctx,label,x+w*.29,cy,w*.54,11.0,C.body,700);fitMid(ctx,`${String(Math.round(r.count)).padStart(2,'0')} ${r.role}`,col+w*.2,cy,w*.38,11.0,C.body,700);if(i<rows.length-1)line(ctx,x,y+headH+rh*(i+1),x+w,y+headH+rh*(i+1),TABLE_STYLE.grid,1);});fitMid(ctx,'TỔNG THIẾU',x+w*.27,y+h-12,w*.5,11.5,C.red,700);fitMid(ctx,`${String(Math.round(m.shortageTotal)).padStart(2,'0')} NHÂN SỰ`,x+w*.78,y+h-12,w*.4,12,C.red,700);}
function drawInsightColumn(ctx,title,items,x,y,w,color,icon){if(icon==='people')drawIcon(ctx,'people',x+12,y+9,29,color);else drawSectionIcon(ctx,x+12,y+9,24,icon);fit(ctx,title,x+31,y-1,w-34,TYPE.insightTitle.size,color,700,'left',11.5);bullets(ctx,items,x+5,y+26,w-8,15,TYPE.insightBody.size,C.text,5,TYPE.insightBody.weight);}
function drawActionColumn(ctx,items,x,y,w,actionLabel='HÀNH ĐỘNG TUẦN TỚI'){fit(ctx,'7. INSIGHT & HÀNH ĐỘNG',x,y-1,w,TYPE.insightTitle.size,C.ink,700,'left',11.5);drawIcon(ctx,'target',x+13,y+26,27,C.blue);fit(ctx,actionLabel,x+32,y+18,w-36,11.5,C.blue,700,'left',9.5);bullets(ctx,items,x+5,y+43,w-8,14,TYPE.insightBody.size,C.text,5,TYPE.insightBody.weight,1);}
function drawLegend(ctx,x,y,w,h){
  fitMid(ctx,'CHÚ THÍCH MÀU',x+w/2,y+6,w,11,C.ink,700);
  STATUS_RULES.forEach((rule,i)=>{const yy=y+24+i*18;rr(ctx,x,yy,22,11,2,rule.color);fit(ctx,rule.legend,x+31,yy-1,w-34,TYPE.legend.size,C.ink,TYPE.legend.weight,'left',8.5);});
}
function renderValidation(){
  if(!model)return;
  const errs=model.issues.filter(x=>x.type==='err'),warns=model.issues.filter(x=>x.type==='warn'),out=[];
  out.push(`<div class="ok">✓ Loại báo cáo trên giao diện: <b>${model.reportType}</b> • Khoảng ngày giữ nguyên từ input: ${dateVN(model.from)} - ${dateVN(model.to)}</div>`);
  out.push(`<div class="ok">✓ ${model.storeRows.length} cửa hàng • ${model.staffRows.length} nhân sự • ${model.sourceRows.length} nguồn khách</div>`);
  out.push(`<div class="ok">✓ Đơn vị tiền chuẩn: ${MONEY_UNIT_LABEL}</div>`);
  if(model.moneyConversionCount>0)out.push(`<div class="warn">⚠ Đã tự quy đổi ${model.moneyConversionCount} giá trị từ đồng/raw VNĐ sang nghìn đồng.</div>`);else out.push(`<div class="ok">✓ Không phát hiện sai lệch đơn vị tiền.</div>`);
  out.push(`<div class="ok">✓ Block 1 — Doanh thu ${fmtMoney(model.revenue)} • Hoàn thành ${fmtPct(model.revenueDisplayComplete)}</div>`);
  out.push(`<div class="ok">✓ Block 2 — Phép cộng doanh thu nguồn: ${model.sourceRevenueEquation} nghìn đồng</div>`);
  out.push(`<div class="ok">✓ Block 2 — Dòng TỔNG bảng nguồn: ${fmtMoney(model.sourceRevenueTotal)} • Donut: ${fmtPct(model.sourceShareTotal)} • Funnel doanh thu: ${fmtMoney(model.revenue)}</div>`);
  if(model.consistencyChecks&&model.consistencyChecks.length){
    ['BLOCK 1','BLOCK 2','BLOCK 2 ↔ BLOCK 1'].forEach(scope=>{
      const checks=model.consistencyChecks.filter(c=>c.scope===scope);if(!checks.length)return;
      out.push(`<div class="ok" style="margin-top:5px"><b>${scope}</b></div>`);
      checks.forEach(c=>out.push(`<div class="${c.ok?'ok':'warn'}">${c.ok?'✓':'⚠'} ${c.label}: ${c.detail}</div>`));
    });
  }
  out.push(`<div class="ok">✓ Top 5: ${model.top5Table.map(r=>r.sr).join(' → ')} • Bottom 5: ${model.bottom5Table.map(r=>r.sr).join(' → ')}</div>`);
  const revenueMetric=model.metrics.find(x=>x.key==='revenue');if(revenueMetric)out.push(`<div class="ok">✓ Tăng trưởng doanh thu: ${fmtGrowth(revenueMetric.growth)}</div>`);
  [...errs,...warns].slice(0,32).forEach(x=>out.push(`<div class="${x.type}">${x.type==='err'?'✕':'⚠'} ${x.text}</div>`));
  els.validationBox.innerHTML=out.join('');
  els.previewMeta.textContent=`${model.reportType} • ${model.storeRows.length} cửa hàng • ${errs.length} lỗi • ${warns.length} cảnh báo`;
}
function clearCanvas(){const c=els.previewCanvas,ctx=c.getContext('2d');ctx.fillStyle=C.navy;ctx.fillRect(0,0,c.width,c.height);fitMid(ctx,'Dán dữ liệu và bấm “Đối chiếu & tạo Dashboard”',c.width/2,c.height/2,c.width-100,22,'#9fb8d1',700);}
function renderPreview(){const c=els.previewCanvas;c.width=BASE.w;c.height=BASE.h;drawDashboard(c.getContext('2d',{alpha:false}),model);fitPreview();}
function fitPreview(){const maxW=Math.max(320,els.previewScroll.clientWidth-36),maxH=Math.max(320,els.previewScroll.clientHeight-36),scale=Math.min(maxW/BASE.w,maxH/BASE.h,1);const w=Math.round(BASE.w*scale),h=Math.round(BASE.h*scale);els.previewCanvas.style.width=w+'px';els.previewCanvas.style.height=h+'px';els.canvasWrap.style.width=w+'px';els.canvasWrap.style.height=h+'px';}
function toast(msg){els.toast.textContent=msg;els.toast.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>els.toast.classList.remove('show'),1800);}
function canvasBlob(c){return new Promise((res,rej)=>c.toBlob(b=>b?res(b):rej(new Error('PNG error')),'image/png'));}
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},700);}
async function exportPng(spec,button){if(!model){toast('Hãy tạo Dashboard trước');return;}const old=button.innerHTML;try{button.disabled=true;button.textContent='Đang xuất...';if(document.fonts&&document.fonts.ready)await document.fonts.ready;await ensureManagerImagesReady();const scale=spec.w/BASE.w;const c=document.createElement('canvas');c.width=spec.w;c.height=spec.h;const ctx=c.getContext('2d',{alpha:false});ctx.setTransform(scale,0,0,scale,0,0);drawDashboard(ctx,model);const b=await canvasBlob(c);download(b,`Dashboard-Dieu-Hanh-${dateVN(model.to).replace(/\//g,'-')}-${spec.tag}.png`);toast(`Đã xuất ${spec.tag} • ${c.width}×${c.height}`);}catch(e){console.error(e);toast('Xuất PNG thất bại');}finally{button.disabled=false;button.innerHTML=old;}}
async function run(showToast=true){try{if(document.fonts&&document.fonts.ready)await document.fonts.ready;model=buildModel(els.dataInput.value,reportMode);localStorage.setItem(STORAGE,els.dataInput.value);await ensureManagerImagesReady();renderValidation();renderPreview();if(showToast)toast(model.issues.some(x=>x.type==='err')?'Dashboard đã tạo nhưng có lỗi dữ liệu':'Dashboard đã cập nhật');}catch(e){console.error(e);model=null;els.validationBox.innerHTML=`<div class="err">✕ ${e.message}</div>`;clearCanvas();if(showToast)toast('Không đọc được dữ liệu');}}
function load(){try{els.dataInput.value=localStorage.getItem(STORAGE)||SAMPLE;}catch(_){els.dataInput.value=SAMPLE;}run(false);}

els.parseBtn.addEventListener('click',()=>run(true));els.sampleBtn.addEventListener('click',()=>{els.dataInput.value=SAMPLE;run(true);});els.export2kBtn.addEventListener('click',()=>exportPng(EXPORT_2K,els.export2kBtn));els.export4kBtn.addEventListener('click',()=>exportPng(EXPORT_4K,els.export4kBtn));
if(els.managerImage1)els.managerImage1.addEventListener('change',e=>setManagerUpload(0,e.target.files&&e.target.files[0]));
if(els.managerImage2)els.managerImage2.addEventListener('change',e=>setManagerUpload(1,e.target.files&&e.target.files[0]));
if(els.managerClear1)els.managerClear1.addEventListener('click',()=>clearManagerUpload(0));
if(els.managerClear2)els.managerClear2.addEventListener('click',()=>clearManagerUpload(1));
if(els.managerZoom1)els.managerZoom1.addEventListener('input',e=>setManagerView(0,'zoom',e.target.value));
if(els.managerZoom2)els.managerZoom2.addEventListener('input',e=>setManagerView(1,'zoom',e.target.value));
if(els.managerY1)els.managerY1.addEventListener('input',e=>setManagerView(0,'y',e.target.value));
if(els.managerY2)els.managerY2.addEventListener('input',e=>setManagerView(1,'y',e.target.value));
initReportModeControl();updateManagerUploadUI(0);updateManagerUploadUI(1);updateManagerViewUI(0);updateManagerViewUI(1);window.addEventListener('resize',fitPreview);load();
})();
