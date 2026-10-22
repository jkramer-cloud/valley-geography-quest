'use strict';
// Valley Geography Quest V2 — local-only educational geography practice.
const $ = id => document.getElementById(id);
const KEY = 'valley_geo_quest_profiles_v1'; // Preserve V1 progress.
const defaultRecord = () => ({attempts:0,correct:0,bestStreak:0,sessions:0,stars:0,history:{},scores:{},lastSeen:{},grade:'6-8',theme:'night'});
const readSaved=()=>{try{const x=JSON.parse(localStorage.getItem(KEY));return x&&typeof x==='object'?x:null}catch{return null}};
let saved=readSaved()||{active:'Explorer',people:{Explorer:defaultRecord()}};
if(!saved.people || !Object.keys(saved.people).length) saved={active:'Explorer',people:{Explorer:defaultRecord()}};
if(!saved.people[saved.active]) saved.active=Object.keys(saved.people)[0];
const player=()=>saved.people[saved.active];
function persist(){try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(e){console.warn('Local storage unavailable',e)}}
const norm=s=>String(s||'').toLowerCase().replace(/\bst\.?\b/g,'saint').replace(/[^a-z0-9]/g,'').trim();
const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const make=(tag,txt,cls)=>{const x=document.createElement(tag);if(txt!=null)x.textContent=txt;if(cls)x.className=cls;return x};
const fmtTime=seconds=>`${Math.floor(Math.max(0,seconds)/60)}:${String(Math.floor(Math.max(0,seconds)%60)).padStart(2,'0')}`;
let mode='locate',round=[],index=0,correct=0,wrong=0,streak=0,started=0,elapsed=0,timeLimit=0,mistakeLimit=0;
let timer=null,advanceTimer=null,roundNonce=0,locked=false,finished=false,bankPick=null,options=[],pnwMarkers=[],practice=false;
let uiStates={};
let active=false,roundResults={}; // Review marks are scoped to the current round.
const mapFeedbackOn=()=>['locate','sprint'].includes(mode)&&$('mapMarks').value==='on';
function showModal(title,body,extra=''){$('modalTitle').textContent=title;$('modalBody').textContent=body;$('modalExtra').innerHTML=extra;$('modal').hidden=false}
$('modalClose').onclick=()=>$('modal').hidden=true;
function profileOptions(){const sel=$('profile');sel.replaceChildren();Object.keys(saved.people).forEach(n=>sel.add(new Option(n,n)));sel.value=saved.active;$('grade').value=player().grade||'6-8';$('theme').value=player().theme||'night';$('mapMarks').value=player().mapMarks==='off'?'off':'on';document.body.dataset.theme=$('theme').value;drawPassport()}
$('profile').onchange=e=>{saved.active=e.target.value;persist();profileOptions();resetRound()};
$('newPlayer').onclick=()=>{const name=prompt('Explorer nickname (no full student names):')?.trim().slice(0,22);if(!name)return;if(!saved.people[name])saved.people[name]=defaultRecord();saved.active=name;persist();profileOptions();resetRound()};
$('grade').onchange=e=>{player().grade=e.target.value;persist();resetRound()};
$('theme').onchange=e=>{player().theme=e.target.value;document.body.dataset.theme=e.target.value;persist()};
$('region').onchange=resetRound;
$('length').onchange=resetRound;
$('playStyle').onchange=resetRound;
$('mapMarks').onchange=e=>{player().mapMarks=e.target.value;persist();resetRound()};
$('startRound').onclick=startRound;
$('helpButton').onclick=()=>showModal('How to play',MODES.find(m=>m.id===mode).detail+'\n\nChallenge has a time limit and a limited number of misses. Practice has unlimited misses and lets you retry a wrong choice. Your accuracy still reflects the attempts you make.','<p>Find the State advances automatically after a correct answer. For PNW Explorer, click the numbered marker; each symbol represents a city, waterway, or mountain.</p>');
$('resetButton').onclick=()=>{if(active&&(correct+wrong)>0&&!finished&&!confirm('Return to setup? The current round will reset; previous completed results remain saved.'))return;resetRound()};
$('fullscreenButton').onclick=async()=>{try{if(document.fullscreenElement){await document.exitFullscreen()}else await $('playPanel').requestFullscreen()}catch{showModal('Fullscreen unavailable','Try F11 to enter browser fullscreen.')}};
$('hintButton').onclick=()=>{const q=round[index];if(!q||finished||!active)return;if(mode==='pnw')feedback(`Look for the ${categoryLabel(q)} symbol. All map markers are approximate reference points.`,'');else feedback(`Region: ${q.region}. ${mode==='capital'?'The capital may not be its largest city.':'Use bordering states and nearby geographic features.'}`,'')};
$('reveal').onclick=()=>{if(!active||locked||finished||mode==='study')return;checkAnswer(null,true)};
$('next').onclick=()=>{if(!active||!locked||finished)return;advanceQuestion()};
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({nickname:saved.active,exported:new Date().toISOString(),...player()},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='valley_geography_progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)};
function modeList(){const root=$('modeButtons');root.replaceChildren();MODES.forEach(m=>{const b=make('button',null,'modeButton');b.dataset.mode=m.id;b.setAttribute('aria-current',String(m.id===mode));b.append(make('span',m.label),make('em',({'locate':'⌖','name':'⌨','bank':'▦','capital':'★','sprint':'⏱','pnw':'⛰','study':'◉'})[m.id]||'◉'));b.title=m.detail;b.onclick=()=>{mode=m.id;modeList();resetRound()};root.append(b)})}
function mapSvg(){const paths=$('mapPaths');paths.replaceChildren();uiStates={};for(const s of STATES){const shape=STATE_SHAPES[s.ab];if(!shape)continue;const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',shape.path);p.setAttribute('class','state');p.setAttribute('data-ab',s.ab);p.setAttribute('tabindex','0');p.setAttribute('role','button');p.setAttribute('aria-label',`Select ${s.name}`);p.setAttribute('fill-rule','evenodd');p.addEventListener('click',()=>stateClick(s.ab));p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();stateClick(s.ab)}});paths.append(p);uiStates[s.ab]=p}}
function visibleStates(){return STATES.filter(s=>$('region').value==='All'||s.region===$('region').value)}
function chooseRound(){const qpool=mode==='pnw'?PNW_PLACES:visibleStates();const max=mode==='sprint'?Math.min(50,qpool.length):Math.min(Number($('length').value),qpool.length);const hist=player().history[mode+'|'+$('region').value]||{};return shuffle(qpool).sort((a,b)=>(hist[a.name]||0)-(hist[b.name]||0)).slice(0,max)}
function allowedMistakes(){const base=round.length<=10?4:round.length<=25?7:10;const adjustment=$('grade').value==='9-12'?2:$('grade').value==='6-8'?1:0;return Math.max(2,base-adjustment)}
function allowedSeconds(){const base=round.length<=10?210:round.length<=25?450:800;const factor=$('grade').value==='3-5'?1.2:$('grade').value==='9-12'?.9:1;return Math.round(base*factor)}
function resetRound(){roundNonce++;clearInterval(timer);timer=null;clearTimeout(advanceTimer);advanceTimer=null;
 active=false;roundResults={};elapsed=0;started=0;correct=wrong=streak=index=0;locked=false;finished=false;bankPick=null;round=chooseRound();practice=$('playStyle').value==='practice';
 mistakeLimit=practice?Infinity:allowedMistakes();timeLimit=mode==='sprint'&&!practice?90:practice||mode==='study'?Infinity:allowedSeconds();
 $('region').disabled=['study','pnw'].includes(mode);$('length').disabled=['sprint','study'].includes(mode);$('playStyle').disabled=mode==='study';$('mapMarks').disabled=!['locate','sprint'].includes(mode);
 const m=MODES.find(m=>m.id===mode);$('missionTag').textContent=mode==='pnw'?'PNW REGIONAL GEOGRAPHY':mode==='sprint'?'TIMED ATLAS RACE':'U.S. ATLAS · '+$('grade').value;
 $('missionTitle').textContent=m.label;$('missionDesc').textContent=m.detail;
 $('map').setAttribute('viewBox',mode==='pnw'?'63 43 167 147':'0 0 1100 660');$('mapNote').textContent=mode==='pnw'?'Numbered choices · Dynamic map zoom':'Alaska & Hawaii shown as insets';$('mapLegendLeft').textContent=mode==='pnw'?'● Places  ▲ Peaks  ≋ Waterways':'◉ Tap a state';$('map').parentElement.classList.toggle('pnwArea',mode==='pnw');
 $('pins').replaceChildren();$('mapReviewMarks').replaceChildren();$('next').disabled=true;$('modal').hidden=true;$('mapHUD').className='mapHUD';mapSvg();
 $('roundReady').hidden=mode==='study';$('reveal').hidden=true;$('hintButton').hidden=true;$('inputArea').replaceChildren();
 if(mode==='study'){active=true;questionStudy()}else{
  $('instruction').textContent='BEFORE YOU BEGIN';$('question').textContent='Choose your settings, then press Start Round';
  $('subquestion').textContent='You can examine the map now. The first question and timer begin together.';
  $('fieldGuide').textContent='Choose a game mode, grade, region, round length, and play style. When ready, select Start Round.';
  $('readySummary').textContent=`${m.label} · Grades ${$('grade').value} · ${mode==='pnw'?'Pacific Northwest':$('region').value==='All'?'All 50 States':$('region').value} · ${round.length} questions · ${practice?'Practice (no deadline)':`Challenge (${fmtTime(timeLimit)} countdown; ${mistakeLimit} misses allowed)`}${mapFeedbackOn()?' · Review Map ON':''}`;
  feedback('Round is ready. No time has elapsed. Press Start Round when prepared.','');
 }
 paintScore();drawPassport()}
function startRound(){
 if(active||mode==='study')return;
 active=true;finished=false;locked=false;started=Date.now();elapsed=0;roundNonce++;
 $('roundReady').hidden=true;loadQuestion();timer=setInterval(tick,200);paintScore();
}

function tick(){if(!active||finished||mode==='study')return;elapsed=(Date.now()-started)/1000;if(elapsed>=timeLimit){elapsed=timeLimit;finishRound('time');return}paintScore()}
function paintScore(){const attempts=correct+wrong;const remaining=round.length-Math.min(index+(locked?1:0),round.length);
 $('score').textContent=String(correct*100);$('accuracy').textContent=attempts?Math.round(correct/attempts*100)+'%':'—';$('streak').textContent=String(streak);
 $('progress').textContent=`${Math.min(index+(locked?1:0),round.length)}/${round.length}`;
 const countdown=Number.isFinite(timeLimit);const t=countdown?Math.ceil(Math.max(0,timeLimit-elapsed)):Math.floor(elapsed);
 $('time').textContent=mode==='study'||!active?'—':fmtTime(t);$('hudClock').textContent=finished?'DONE':mode==='study'?'—':!active?'READY':fmtTime(t);
 $('hudClockLabel').textContent=mode==='study'?'':finished?'ROUND COMPLETE':!active?'WAITING FOR START':countdown?'TIME LEFT':'PRACTICE TIME';
 $('hudRemaining').textContent=mode==='study'?'':`${remaining} LEFT / ${round.length}`;
 $('hudLives').textContent=mode==='study'?'':practice?'NO MISTAKE LIMIT':`${Math.max(0,mistakeLimit-wrong)} MISSES LEFT`;
 $('hudBar').style.width=mode==='study'?'100%':countdown?Math.max(0,100*(timeLimit-elapsed)/timeLimit)+'%':Math.min(100,100*(index+(locked?1:0))/Math.max(1,round.length))+'%';
 $('mapHUD').className='mapHUD'+(mode==='study'?' study':!active?' ready':finished?' done':countdown&&timeLimit-elapsed<=20?' urgent':'')}
function feedback(text,type){const f=$('feedback');f.textContent=text;f.className='feedback'+(type?' '+type:'')}
function cleanMap(){Object.values(uiStates).forEach(p=>p.setAttribute('class','state'));$('pins').replaceChildren();$('mapReviewMarks').replaceChildren()}
function drawReviewMarks(){
 const layer=$('mapReviewMarks');layer.replaceChildren();if(!mapFeedbackOn())return;
 for(const [ab,result] of Object.entries(roundResults)){
  const statePath=uiStates[ab],shape=STATE_SHAPES[ab];if(!statePath||!shape?.center)continue;
  statePath.classList.add(result==='correct'?'review-correct':'review-wrong');
  const [x,y]=shape.center;const grp=regionNode('g'),circle=regionNode('circle'),symbol=regionNode('text');
  grp.setAttribute('class','reviewMark '+(result==='correct'?'correct':'missed'));
  grp.setAttribute('transform',`translate(${x} ${y})`);
  circle.setAttribute('r','11');symbol.setAttribute('y','1');symbol.textContent=result==='correct'?'✓':'×';
  grp.append(circle,symbol);layer.append(grp);
 }
}

function mark(ab,cls){uiStates[ab]?.classList.add(cls)}
function questionStudy(){cleanMap();locked=false;$('instruction').textContent='FREE EXPLORATION';$('question').textContent='Click any state';$('subquestion').textContent='Explore its capital, region, and geography facts. No time limit or penalties.';$('inputArea').replaceChildren();$('next').disabled=true;$('reveal').hidden=true;$('hintButton').hidden=true;feedback('Select a state on the map to learn about it.','')}
function loadQuestion(){if(!active||finished)return;if(!round[index]){finishRound('complete');return}cleanMap();drawReviewMarks();locked=false;bankPick=null;const q=round[index];$('next').disabled=true;$('reveal').hidden=false;$('hintButton').hidden=false;$('instruction').textContent=`CHALLENGE ${index+1} OF ${round.length}`;$('inputArea').replaceChildren();$('fieldGuide').textContent='Answer the prompt. The correct state or landmark will be highlighted afterward.';
 if(mode==='locate'||mode==='sprint'){$('question').textContent=`Find ${q.name}`;$('subquestion').textContent='Click its location. Correct answers automatically advance.';}
 else if(mode==='name'){$('question').textContent='What state is highlighted?';$('subquestion').textContent='Type the state name. Case does not matter.';mark(q.ab,'target');addTextAnswer()}
 else if(mode==='bank'){$('question').textContent='Name the highlighted state';$('subquestion').textContent='Select a name, then click the glowing state.';mark(q.ab,'target');options=shuffle([q,...shuffle(STATES.filter(x=>x.ab!==q.ab)).slice(0,3)]);for(const s of options){const b=make('button',s.name,'choice');b.draggable=true;b.dataset.name=s.name;b.onclick=()=>selectBank(s.name);b.addEventListener('dragstart',e=>{bankPick=s.name;e.dataTransfer.setData('text/plain',s.name);e.dataTransfer.effectAllowed='copy'});$('inputArea').append(b)}}
 else if(mode==='capital'){$('question').textContent=`What is the capital of ${q.name}?`;$('subquestion').textContent=$('grade').value==='9-12'?'Type its capital.':'Choose the correct capital.';mark(q.ab,'target');if($('grade').value==='9-12')addTextAnswer();else{options=shuffle([q,...shuffle(STATES.filter(x=>x.capital!==q.capital)).slice(0,3)]);for(const s of options){const b=make('button',s.capital,'choice');b.onclick=()=>checkAnswer(s.capital);$('inputArea').append(b)}}}
 else if(mode==='pnw'){$('question').textContent=`Find ${q.name}`;$('subquestion').textContent=`${categoryLabel(q)} · Select its numbered marker. The map zooms in to the choices.`;pnwMarkers=choosePNWMarkers(q);renderPins()}
 feedback(practice?'Practice mode — unlimited mistakes. Try again if you miss.':'Challenge mode — watch your time and remaining mistakes.','');paintScore()}
const PNW_FAMILY={City:'place',Town:'place',Capital:'place',Metro:'place',Mountain:'mountain',Mountains:'mountain',Pass:'mountain',River:'water',Lake:'water',Water:'water',Landmark:'water'};
const family=q=>PNW_FAMILY[q.type]||'place';
const categoryLabel=q=>family(q)==='mountain'?'Mountain / mountain pass':family(q)==='water'?'Waterway / water feature':'City / community';
const gap=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function choosePNWMarkers(q){
 const count=$('grade').value==='3-5'?4:$('grade').value==='6-8'?5:6;
 const candidates=shuffle(PNW_PLACES.filter(x=>x.name!==q.name));
 const same=candidates.filter(x=>family(x)===family(q));
 const other=candidates.filter(x=>family(x)!==family(q));
 const result=[q];
 for(const minGap of [17,12,9]){
   for(const list of [same,other]){
     for(const spot of list){if(result.length>=count)break;if(result.some(x=>x.name===spot.name))continue;if(result.every(x=>gap(x,spot)>=minGap))result.push(spot)}
     if(result.length>=count)break;
   }
   if(result.length>=count)break;
 }
 // Never produce a one-answer question; even close-quarters PNW locations offer at least four choices.
 if(result.length<count){for(const spot of candidates){if(result.length>=count)break;if(!result.some(x=>x.name===spot.name))result.push(spot)}}
 return shuffle(result.slice(0,count))
}
function pnwView(){if(!pnwMarkers.length){$('map').setAttribute('viewBox','63 43 167 147');return}
 const xs=pnwMarkers.map(p=>p.x),ys=pnwMarkers.map(p=>p.y);let minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
 const w=Math.min(167,Math.max(64,maxX-minX+32));const h=Math.min(147,Math.max(62,maxY-minY+32));
 const midX=(minX+maxX)/2,midY=(minY+maxY)/2;
 const x=Math.max(63,Math.min(230-w,midX-w/2)),y=Math.max(43,Math.min(190-h,midY-h/2));
 $('map').setAttribute('viewBox',`${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`)
}
function regionNode(tag){return document.createElementNS('http://www.w3.org/2000/svg',tag)}
function renderPins(){pnwView();const g=$('pins');g.replaceChildren();const key=make('div',null,'markerChoices');
 pnwMarkers.forEach((spot,i)=>{
 const grp=regionNode('g'),outer=regionNode('circle'),inner=regionNode('circle'),num=regionNode('text'),icon=regionNode('text'),hit=regionNode('circle');
 const f=family(spot);grp.setAttribute('class',`regionPin ${f}`);grp.setAttribute('role','button');grp.setAttribute('tabindex','0');grp.setAttribute('aria-label',`Location ${i+1}, ${categoryLabel(spot)}`);grp.setAttribute('transform',`translate(${spot.x} ${spot.y})`);
 outer.setAttribute('r','5');outer.setAttribute('class','pinBorder');inner.setAttribute('r','4');inner.setAttribute('class','pinCore');
 num.setAttribute('class','pinNumber');num.setAttribute('y','.5');num.textContent=String(i+1);
 icon.setAttribute('class','pinIcon');icon.setAttribute('y','-6.1');icon.textContent=f==='mountain'?'▲':f==='water'?'≈':'●';
 hit.setAttribute('r','6.7');hit.setAttribute('class','hitTarget');
 grp.append(outer,inner,num,icon,hit);grp.addEventListener('click',()=>checkAnswer(spot.name));grp.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();checkAnswer(spot.name)}});grp.dataset.name=spot.name;g.append(grp);
 const k=make('span',`${i+1} ${f==='mountain'?'▲ Peak':f==='water'?'≈ Water':'● Place'}`,'markerKey');key.append(k);
 });$('inputArea').append(key)
}
function addTextAnswer(){const inp=make('input');inp.className='answerInput';inp.autocomplete='off';inp.spellcheck=false;inp.placeholder=mode==='capital'?'Enter capital city':'Enter state name';inp.maxLength=48;inp.setAttribute('aria-label','Your answer');const btn=make('button','Check answer','primary');const submit=()=>checkAnswer(inp.value);btn.onclick=submit;inp.onkeydown=e=>{if(e.key==='Enter')submit()};$('inputArea').append(inp,btn);setTimeout(()=>{if(document.contains(inp))inp.focus()},40)}
function selectBank(name){if(!active||locked||finished)return;bankPick=name;document.querySelectorAll('.choice').forEach(b=>b.classList.toggle('selected',b.dataset.name===name));feedback('Selected '+name+'. Now click the highlighted state.','')}
$('map').addEventListener('dragover',e=>{if(mode==='bank')e.preventDefault()});
$('map').addEventListener('drop',e=>{if(!active||mode!=='bank'||locked||finished)return;e.preventDefault();const name=e.dataTransfer.getData('text/plain')||bankPick;const el=e.target.closest?.('[data-ab]');if(el?.dataset.ab===round[index]?.ab&&name)checkAnswer(name)});
function stateClick(ab){const s=BY_AB[ab];if(!s||finished)return;if(mode==='study'){Object.values(uiStates).forEach(p=>p.classList.remove('target'));mark(ab,'target');showFact(s);feedback(`${s.name} · Capital: ${s.capital}`,'success');return}
 if(!active||locked||mode==='pnw')return;const q=round[index];if(!q)return;
 if(mode==='locate'||mode==='sprint')checkAnswer(s.name);
 else if(mode==='bank'){if(ab!==q.ab){feedback('Click the highlighted state after selecting a name.','error');return}if(!bankPick){feedback('Choose a name from the word bank first.','error');return}checkAnswer(bankPick)}
}
function actualAnswer(){const q=round[index];return mode==='capital'?q.capital:q.name}
function showFact(s){const out=$('fieldGuide');out.replaceChildren();out.append(make('div',s.name,'facttitle'));for(const line of [`Capital: ${s.capital}`,`Postal abbreviation: ${s.ab}`,`Region: ${s.region}`,s.fact])out.append(make('div',line,'factline'))}
function setQuestionHistory(q){const rec=player();const hkey=mode+'|'+$('region').value;rec.history[hkey]??={};rec.history[hkey][q.name]=(rec.history[hkey][q.name]||0)+1;rec.lastSeen[q.name]=Date.now()}
function highlightAnswer(q,value,pass,showCorrect){if(mode==='pnw'){
 for(const el of document.querySelectorAll('.regionPin')){if(el.dataset.name===q.name&&showCorrect)el.classList.add('good');else if(el.dataset.name===value&&!pass)el.classList.add('bad')}
 if(showCorrect){const lbl=regionNode('text');lbl.setAttribute('x',q.x+7);lbl.setAttribute('y',q.y-4);lbl.setAttribute('class','pinLabel');lbl.textContent=q.name;$('pins').append(lbl)}
 if(showCorrect)$('fieldGuide').textContent=`${q.name} · ${q.type}. Approximate learning map location.`
 }else if(showCorrect){mark(q.ab,pass?'good':'bad');if((mode==='locate'||mode==='sprint')&&!pass){const bad=STATES.find(s=>s.name===value);if(bad)mark(bad.ab,'bad')}showFact(q)}
 document.querySelectorAll('.choice').forEach(b=>{if(showCorrect)b.disabled=true;if(showCorrect&&norm(b.textContent)===norm(actualAnswer()))b.classList.add('correct');if(norm(b.textContent)===norm(value)&&!pass)b.classList.add('wrong')});
 if(showCorrect)document.querySelectorAll('.answerInput').forEach(inp=>inp.disabled=true)
}
function scheduleAdvance(delay){clearTimeout(advanceTimer);const nonce=roundNonce;advanceTimer=setTimeout(()=>{if(nonce===roundNonce&&locked&&!finished)advanceQuestion()},delay)}
function checkAnswer(value,skip=false){if(!active||locked||finished||mode==='study'||!round[index])return;const q=round[index],ans=actualAnswer();if(!skip&&!String(value||'').trim()){feedback('Enter or choose an answer first, or select Reveal / Skip.','error');return}
 const pass=!skip&&norm(value)===norm(ans);const rec=player();rec.attempts++;rec.correct+=Number(pass);wrong+=Number(!pass);correct+=Number(pass);streak=pass?streak+1:0;rec.bestStreak=Math.max(rec.bestStreak,streak);
 // Practice: a wrong answer may be tried again without using a life or ending the round.
 if(practice&&!pass&&!skip){highlightAnswer(q,value,false,false);feedback(`Not quite. Try again — there is no mistake limit in Practice.`, 'error');persist();paintScore();drawPassport();return}
 locked=true;$('next').disabled=false;setQuestionHistory(q);highlightAnswer(q,value,pass,true);if(['locate','sprint'].includes(mode)){roundResults[q.ab]=pass?'correct':'missed';drawReviewMarks()}persist();paintScore();drawPassport();
 feedback(pass?`Correct! ${ans}. +100 points.`:`${skip?'Skipped.':'Not quite.'} The correct answer is ${ans}.`,pass?'success':'error');
 if(!practice&&wrong>=mistakeLimit){scheduleAdvance(1200);return}
 if(['locate','sprint','pnw'].includes(mode)){scheduleAdvance(pass?760:1200)}
}
function advanceQuestion(){if(!active||finished||!locked)return;clearTimeout(advanceTimer);advanceTimer=null;index++;
 if(!practice&&wrong>=mistakeLimit){finishRound('mistakes');return}
 if(index>=round.length){finishRound('complete');return}
 if(elapsed>=timeLimit){finishRound('time');return}
 loadQuestion()}
function finishRound(reason='complete'){
 if(!active||finished)return;finished=true;clearInterval(timer);timer=null;clearTimeout(advanceTimer);advanceTimer=null;locked=true;$('next').disabled=true;
 const rec=player();if(mode==='study')return;rec.sessions++;
 const attempts=correct+wrong,pct=attempts?Math.round(correct/attempts*100):0;
 const key=mode+'|'+$('region').value;rec.scores[key]=Math.max(rec.scores[key]||0,correct*100);
 const stars=pct>=95?3:pct>=80?2:pct>=60?1:0;rec.stars+=stars;persist();drawPassport();
 const head=reason==='mistakes'?'Mistake limit reached':reason==='time'?'Time is up!':'Round complete!';
 const used=Math.round(elapsed);const reviewNote=mapFeedbackOn()?' Close the results to see your completed map (✓ correct, × missed).':'';const msg=`${correct} correct · ${wrong} mistakes · ${pct}% accuracy · ${fmtTime(used)} played.${reviewNote} ${stars?`You earned ${stars} passport star${stars===1?'':'s'}!`:'Keep practicing to earn passport stars.'}`;
 $('question').textContent=head;$('subquestion').textContent=msg;$('inputArea').replaceChildren();feedback('Select New round to try again, or choose another practice mode.','success');paintScore();
 showModal(`${correct*100} points — ${head}`,msg,`<div style="font-size:30px;color:#ffd47c;text-align:center">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>`);if(stars===3)celebrate()
}
function celebrate(){const el=$('confetti');el.replaceChildren();for(let i=0;i<45;i++){const s=make('span',null,'flake');s.style.left=Math.random()*100+'%';s.style.background=['#4de2b3','#ffd071','#7bb9ff','#f9a4aa'][i%4];s.style.animationDelay=Math.random()*.5+'s';el.append(s)}setTimeout(()=>el.replaceChildren(),2600)}
function drawPassport(){const p=player();$('passport').innerHTML=`<strong>${esc(saved.active)}</strong><div>Correct responses: <b>${p.correct||0}</b> / ${p.attempts||0}</div><div>Finished sessions: <b>${p.sessions||0}</b></div><div>Longest streak: <b>${p.bestStreak||0}</b></div><div>Passport stars: <b>${p.stars||0} ★</b></div><div>Play multiple modes to strengthen geography knowledge.</div>`}
modeList();profileOptions();resetRound();
