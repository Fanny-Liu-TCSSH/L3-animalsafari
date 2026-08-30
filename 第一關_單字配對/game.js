(() => {
  const $ = id => document.getElementById(id);
  const rounds = [
    {name:'SAVANNA BASE CAMP', seconds:45, sets:[
      ['wonder','amazing','average','therefore','nap','float','avoid','surface'],
      ['breathe','awake','impressive','distance','journey','flight','variety','creature'],
      ['expert','survive','wonder','average','nap','avoid','journey','creature'] ]},
    {name:'DERIVATIVE TRAIL', seconds:45, sets:[
      ['amaze','amazement','breath','impress','impression','distant','vary','various'],
      ['survival','amaze','amazement','breath','impress','impression','distant','vary'] ]},
    {name:'SURVIVAL PHRASE ZONE', seconds:45, sets:[
      ['hold on to','look out for','be on the lookout for','for example','according to','up to','hibernate','mammal'],
      ['curl','predator','sea otter','paw','migratory bird','Alpine swift','Africa','hold on to'] ]}
  ];
  const all = [...vocabularyPool.production,...vocabularyPool.derivatives,...vocabularyPool.phrases,...vocabularyPool.recognition]
    .reduce((map,[en,zh,family]) => (map[en]={en,zh,family},map),{});
  let state={round:0,set:0,matched:0,selected:[],timer:null,left:45,locked:false};
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const say=(html,ms=1400)=>{const t=$('toast');t.innerHTML=html;t.classList.add('show');clearTimeout(say.id);say.id=setTimeout(()=>t.classList.remove('show'),ms)};
  function overlay(title,text,label,fn){$('overlayTitle').textContent=title;$('overlayText').textContent=text;$('overlayButton').textContent=label;$('overlayButton').onclick=()=>{$('overlay').classList.add('hidden');fn()};$('overlay').classList.remove('hidden')}
  function title(){const r=rounds[state.round];$('roundNo').textContent=`ROUND ${state.round+1} / 3`;$('roundName').textContent=r.name;$('trailLabel').textContent=`${r.name} · TRAIL ${state.set+1} / ${r.sets.length}`}
  function cards(){const terms=rounds[state.round].sets[state.set];const pairCards=terms.flatMap((en,i)=>[{...all[en],side:'en',id:`${i}-en`},{...all[en],side:'zh',id:`${i}-zh`}]);const grid=$('grid');grid.innerHTML='';shuffle(pairCards).forEach(item=>{const b=document.createElement('button');b.className='card';b.type='button';b.dataset.en=item.en;b.dataset.side=item.side;b.textContent=item.side==='en'?item.en:item.zh;b.onclick=()=>choose(b);grid.append(b)});$('matched').textContent='MATCHED : 0 / 8'}
  function startTimer(){clearInterval(state.timer);state.left=rounds[state.round].seconds;updateTime();state.timer=setInterval(()=>{state.left--;updateTime();if(state.left<=0){clearInterval(state.timer);state.locked=true;overlay("TIME'S UP!",'這一 Round 的時間到了。重新整理腳步後，再挑戰一次。','重新挑戰本關',()=>{state.set=0;startRound()})}},1000)}
  function updateTime(){const el=$('timer');el.textContent=`TIME : ${String(Math.max(0,state.left)).padStart(2,'0')}`;el.classList.toggle('warning',state.left<=10);el.classList.toggle('pulse',state.left<=5&&state.left>0)}
  function startRound(){state.matched=0;state.selected=[];state.locked=false;title();cards();startTimer()}
  function choose(card){if(state.locked||card.classList.contains('matched')||card.classList.contains('selected'))return;card.classList.add('selected');state.selected.push(card);if(state.selected.length<2)return;state.locked=true;const [a,b]=state.selected;const match=a.dataset.en===b.dataset.en&&a.dataset.side!==b.dataset.side;if(match){setTimeout(()=>{[a,b].forEach(x=>x.classList.add('matched'));state.matched++;$('matched').textContent=`MATCHED : ${state.matched} / 8`;const fam=all[a.dataset.en].family;if(fam)say(`WORD FAMILY FOUND!<small>${fam}</small>`,1450);else say('TRAIL MATCHED!');state.selected=[];state.locked=false;if(state.matched===8)setTimeout(cleared,700)},180)}else{setTimeout(()=>{[a,b].forEach(x=>x.classList.add('wrong'));setTimeout(()=>{[a,b].forEach(x=>x.classList.remove('wrong','selected'));state.selected=[];state.locked=false},640)},100)}}
  function cleared(){clearInterval(state.timer);const r=rounds[state.round];const isLastSet=state.set===r.sets.length-1;if(!isLastSet){overlay('Trail Cleared!',`剩餘 ${state.left} 秒。下一段路徑已準備好。`,'下一個小矩陣',()=>{state.set++;state.matched=0;cards()})}else if(state.round<2){overlay('ROUND CLEARED!',`Safari Badge 已取得！剩餘 ${state.left} 秒。`,'前往下一 Round',()=>{state.round++;state.set=0;startRound()})}else{localStorage.setItem('safariExpedition.vocabularyComplete','1');overlay('VOCABULARY EXPEDITION COMPLETE!','取得 Safari Vocabulary Badge！你已完成 Lesson 3 的全部指定字彙複習。','再次挑戰',reset)}}
  function reset(){clearInterval(state.timer);state={round:0,set:0,matched:0,selected:[],timer:null,left:45,locked:false};rounds.forEach(r=>r.sets.forEach(s=>s.sort(()=>Math.random()-.5)));startRound()}
  overlay('Welcome, Explorer!','配對英文與繁體中文。每一 Round 會重新計時，完成全部路徑即可取得 Safari Vocabulary Badge。','開始探險',reset);
})();
