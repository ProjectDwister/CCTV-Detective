(() => {
  const CAMERA_KEYS = ['lobby','hallway','elevator','stairwell','rooftop'];
  const CAMERA_DEFS = {
    lobby: {
      id:'lobby', name:'Lobby', label:'CAM 01', base:'22:24',
      note:'Grand lobby — the treasure was last seen near the display case.',
      tip:'The clue is pinned immediately. You can tap it right away, or use the marker to jump to the moment it becomes obvious.',
      video:'assets/videos/lobby.mp4', hotspot:{left:'52%', top:'56%'},
      tracks:[{from:[20,78],to:[62,56]},{from:[72,80],to:[56,58]},{from:[12,56],to:[35,44]}]
    },
    hallway: {
      id:'hallway', name:'Hallway', label:'CAM 02', base:'22:26',
      note:'Second-floor hallway — the route brushes past the framed paintings.',
      tip:'Watch the center-right of the frame. The clue sits near where a guest slows down.',
      video:'assets/videos/hallway.mp4', hotspot:{left:'65%', top:'52%'},
      tracks:[{from:[16,72],to:[73,56]},{from:[77,64],to:[44,52]},{from:[18,52],to:[48,60]}]
    },
    elevator: {
      id:'elevator', name:'Elevator', label:'CAM 03', base:'22:27',
      note:'Service elevator — somebody used a restricted access shortcut.',
      tip:'The marker jumps to the suspicious elevator stop, but tapping the clue will collect it immediately.',
      video:'assets/videos/elevator.mp4', hotspot:{left:'48%', top:'44%'},
      tracks:[{from:[38,82],to:[50,42]},{from:[62,42],to:[45,80]},{from:[20,75],to:[36,44]}]
    },
    stairwell: {
      id:'stairwell', name:'Stairwell', label:'CAM 04', base:'22:29',
      note:'Rear stairwell — a perfect place to switch routes in a hurry.',
      tip:'The stairwell clue is easy to miss if you only watch the top landing. Tap the highlight whenever you’re ready.',
      video:'assets/videos/stairwell.mp4', hotspot:{left:'57%', top:'60%'},
      tracks:[{from:[22,78],to:[70,38]},{from:[70,36],to:[36,78]},{from:[10,60],to:[38,52]}]
    },
    rooftop: {
      id:'rooftop', name:'Rooftop', label:'CAM 05', base:'22:32',
      note:'Moonlit rooftop garden — the trail often ends here, but not always.',
      tip:'Look near the planters and twinkling lights. The final clue always points to the hiding spot.',
      video:'assets/videos/rooftop.mp4', hotspot:{left:'68%', top:'42%'},
      tracks:[{from:[28,74],to:[72,52]},{from:[72,52],to:[42,68]},{from:[18,70],to:[48,54]}]
    }
  };

  const SUSPECTS = {
    Nico:{name:'Nico', role:'Bellhop', emoji:'🛎️', color:'#62d5ad'},
    Mia:{name:'Mia', role:'Housekeeping', emoji:'🧹', color:'#79b9ff'},
    Mira:{name:'Mira', role:'Magician', emoji:'🎩', color:'#ff87c7'},
    Manager:{name:'Manager', role:'Hotel Manager', emoji:'🗝️', color:'#f5cb59'}
  };

  const ITEMS = [
    {name:'Moonstone Tiara', emoji:'💎'},
    {name:'Golden Music Box', emoji:'🎼'},
    {name:'Star Ruby Brooch', emoji:'🔴'},
    {name:'Emerald Compass', emoji:'🧭'},
    {name:'Pearl Mask', emoji:'🎭'},
    {name:'Sunset Sapphire', emoji:'🔷'}
  ];

  const ROUTES = [
    ['lobby','hallway','elevator','stairwell','rooftop'],
    ['lobby','elevator','hallway','stairwell','rooftop'],
    ['hallway','lobby','elevator','stairwell','rooftop'],
    ['lobby','hallway','stairwell','elevator','rooftop'],
    ['elevator','hallway','lobby','stairwell','rooftop'],
    ['stairwell','elevator','hallway','lobby','rooftop'],
    ['rooftop','stairwell','elevator','hallway','lobby'],
    ['hallway','elevator','stairwell','rooftop','lobby']
  ];

  const DIFFICULTIES = {
    junior:{label:'Junior Detective', unlock:3, hintBoost:true, finalHint:'The culprit appears with a glowing gold outline in the speech hints.'},
    detective:{label:'Detective', unlock:4, hintBoost:true, finalHint:'You have enough evidence once four clues are found.'},
    master:{label:'Master Detective', unlock:5, hintBoost:false, finalHint:'No shortcuts: collect all five clues before the route puzzle unlocks.'}
  };

  const CLUE_LIBRARY = {
    lobby:[
      {icon:'🎀', title:'Purple Ribbon'},
      {icon:'📜', title:'Guest List Slip'},
      {icon:'🧾', title:'Lobby Receipt'},
      {icon:'🪪', title:'Welcome Badge'}
    ],
    hallway:[
      {icon:'🏷️', title:'Room Tag'},
      {icon:'🖼️', title:'Crooked Painting Note'},
      {icon:'🧵', title:'Velvet Thread'},
      {icon:'💌', title:'Folded Card'}
    ],
    elevator:[
      {icon:'🗝️', title:'Master Key'},
      {icon:'🪙', title:'Brass Token'},
      {icon:'📇', title:'Access Card'},
      {icon:'🔘', title:'Fingerprint Smudge'}
    ],
    stairwell:[
      {icon:'🧤', title:'White Glove'},
      {icon:'👞', title:'Shoe Print'},
      {icon:'🪜', title:'Landing Mark'},
      {icon:'🧣', title:'Scarf Thread'}
    ],
    rooftop:[
      {icon:'✨', title:'Silver Glitter'},
      {icon:'🌙', title:'Moonlit Dust'},
      {icon:'🎈', title:'Reveal Ribbon'},
      {icon:'🌿', title:'Planter Soil Trace'}
    ]
  };

  const MOTIVES = [
    'planned a surprise midnight reveal, but the explanation note blew away',
    'hid it for safekeeping after a mix-up during the evening show',
    'moved it during preparations for a rooftop celebration',
    'set up a secret clue trail for the hotel guests, then forgot to tell the staff'
  ];

  const HERO_HINTS = [
    'I can tap the clue right away now — no more waiting for the perfect second.',
    'The CLUE marker on the timeline jumps close to the important moment if you want extra help.',
    'Every new case shuffles the route, culprit, and missing treasure.',
    'Watch the suspect badges moving through each camera: the guilty one appears along the whole route.'
  ];

  const state = {
    screen:'titleScreen',
    caseCounter:1,
    currentCase:null,
    camera:'lobby',
    found:new Set(),
    route:[],
    playing:false,
    sound:true,
    difficulty:'detective',
    cluePeeked:new Set()
  };

  const screens = ['titleScreen','gameScreen','puzzleScreen','finalScreen','winScreen'];
  const $ = (id) => document.getElementById(id);
  const feedVideo = $('feedVideo');

  function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
  function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
  function showScreen(id){ state.screen=id; screens.forEach(s => $(s).classList.toggle('active', s===id)); window.scrollTo({top:0, behavior:'smooth'}); }

  function beep(freq=620,dur=.07){
    if(!state.sound) return;
    try{
      const A = window.AudioContext || window.webkitAudioContext;
      const ctx = new A();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = freq; o.type = 'sine';
      g.gain.setValueAtTime(.08, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + dur);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur);
      setTimeout(() => ctx.close(), 250);
    }catch(e){}
  }

  function toast(msg){
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._hide);
    t._hide = setTimeout(() => t.classList.remove('show'), 2200);
  }

  function fmt(sec){ return `00:${String(Math.max(0, Math.round(sec))).padStart(2,'0')}`; }

  function clock(base, sec){
    const [h,m] = base.split(':').map(Number);
    const d = new Date(2000,0,1,h,m,0);
    d.setSeconds(Math.round(sec));
    return [d.getHours(), d.getMinutes(), d.getSeconds()].map(n => String(n).padStart(2,'0')).join(':');
  }

  function currentTimelineSec(){
    if(!feedVideo.duration || !Number.isFinite(feedVideo.duration)) return 0;
    return (feedVideo.currentTime / feedVideo.duration) * 60;
  }

  function setTimelineSec(sec){
    if(!feedVideo.duration || !Number.isFinite(feedVideo.duration)) return;
    const bounded = Math.max(0, Math.min(60, sec));
    feedVideo.currentTime = (bounded / 60) * feedVideo.duration;
    updateFeed();
  }

  function routeNames(routeIds){ return routeIds.map(id => CAMERA_DEFS[id].name); }

  function uniqueCaseCode(){ return `GH-${String(state.caseCounter).padStart(3,'0')}`; }

  function generateCase(){
    const culprit = rand(Object.keys(SUSPECTS));
    const item = rand(ITEMS);
    const route = [...rand(ROUTES)];
    const routeDisplay = routeNames(route);
    const clueData = {};
    const actorData = {};
    const times = shuffle([9, 16, 24, 36, 48]);

    CAMERA_KEYS.forEach((camId, idx) => {
      const clue = {...rand(CLUE_LIBRARY[camId])};
      clue.time = times[idx] + Math.floor(Math.random()*3);
      clueData[camId] = clue;

      const def = CAMERA_DEFS[camId];
      const culpritTrack = def.tracks[0];
      const redA = def.tracks[1];
      const redB = def.tracks[2];
      actorData[camId] = [
        makeTrack(culprit, culpritTrack, 8 + idx*2, 34 + idx*2),
        makeTrack(rand(otherSuspects(culprit)), redA, 12 + ((idx+2)%5)*2, 26 + ((idx+2)%5)*2),
        makeTrack(rand(otherSuspects(culprit)), redB, 32, 52)
      ];
    });

    const hideLocation = route[route.length-1];
    const motive = rand(MOTIVES);
    const lastSeen = clock(CAMERA_DEFS[route[0]].base, clueData[route[0]].time);

    return {
      code: uniqueCaseCode(),
      title: `The Missing ${item.name}`,
      item,
      culprit,
      route,
      routeDisplay,
      hideLocation,
      lastSeen,
      motive,
      clues: clueData,
      actors: actorData,
      suspectOrder: shuffle(Object.keys(SUSPECTS)),
      summary: `${SUSPECTS[culprit].name} ${motive}. The route ends at the ${CAMERA_DEFS[hideLocation].name}.`
    };
  }

  function makeTrack(suspect, path, start, end){
    return { suspect, start, end, from:path.from, to:path.to };
  }

  function otherSuspects(except){
    return Object.keys(SUSPECTS).filter(k => k !== except);
  }

  function startNewCase(goToTitle=false){
    state.currentCase = generateCase();
    state.caseCounter += 1;
    state.camera = 'lobby';
    state.found = new Set();
    state.route = [];
    state.cluePeeked = new Set();
    state.playing = false;
    feedVideo.pause();
    feedVideo.currentTime = 0;
    $('playBtn').textContent = '▶';
    $('finalMessage').textContent = 'Choose your answer.';
    document.querySelectorAll('#choiceGrid button').forEach(b => b.disabled = false);
    document.querySelectorAll('.room').forEach(b => b.classList.remove('selected'));
    $('routePath').setAttribute('d','');
    $('routePicks').textContent = 'Choose the first location…';
    populateCaseUI();
    buildTabs();
    buildClues();
    buildSuspects();
    updateProgress();
    loadCamera(state.camera, true);
    if(goToTitle) showScreen('titleScreen');
  }

  function populateCaseUI(){
    const c = state.currentCase;
    $('titleCaseCode').textContent = `CASE ${c.code} • GRAND HOTEL`;
    $('titleCaseName').textContent = c.title;
    $('caseCodeEyebrow').textContent = `CASE ${c.code}`;
    $('caseTitleTop').textContent = c.title;
    $('factLastSeen').textContent = c.lastSeen;
    $('factMissing').textContent = c.item.name;
    $('factDifficulty').textContent = DIFFICULTIES[state.difficulty].label;
    $('finalEmoji').textContent = c.item.emoji;
    $('winEmoji').textContent = c.item.emoji;
    $('finalTitle').textContent = `Who moved the ${c.item.name.toLowerCase()}?`;
    $('finalSubcopy').textContent = `The evidence suggests the missing ${c.item.name.toLowerCase()} travelled through five locations.`;
    $('detectiveSpeech').textContent = `A fresh case! The missing ${c.item.name.toLowerCase()} was last seen at ${c.lastSeen}. Start anywhere, but the Lobby is a good first clue.`;
    $('puzzleCopy').textContent = `Tap the five locations in the order the missing ${c.item.name.toLowerCase()} travelled.`;
    $('winSummary').textContent = c.summary;
    $('scoreText').textContent = `0/5 clues found`;
    $('cameraTip').textContent = HERO_HINTS[0];
  }

  function buildTabs(){
    $('cameraTabs').innerHTML = '';
    CAMERA_KEYS.forEach(id => {
      const def = CAMERA_DEFS[id];
      const b = document.createElement('button');
      b.type = 'button';
      b.className = id === state.camera ? 'active' : '';
      b.textContent = `${def.label.replace('CAM ','')} · ${def.name}`;
      b.addEventListener('click', () => loadCamera(id, true));
      $('cameraTabs').appendChild(b);
    });
  }

  function buildClues(){
    $('clueGrid').innerHTML = '';
    CAMERA_KEYS.forEach(id => {
      const found = state.found.has(id);
      const clue = state.currentCase.clues[id];
      const card = document.createElement('div');
      card.className = `clue-card ${found ? 'found' : ''}`;
      card.innerHTML = found
        ? `<span>${clue.icon}</span><b>${clue.title}</b><small>${CAMERA_DEFS[id].name}</small>`
        : `<span>?</span><b>Hidden clue</b><small>${CAMERA_DEFS[id].name}</small>`;
      $('clueGrid').appendChild(card);
    });
  }

  function buildSuspects(){
    $('suspectRow').innerHTML = '';
    state.currentCase.suspectOrder.forEach(key => {
      const s = SUSPECTS[key];
      const d = document.createElement('div');
      d.className = 'suspect';
      d.innerHTML = `<span>${s.emoji}</span><small>${s.name}</small>`;
      $('suspectRow').appendChild(d);
    });

    $('choiceGrid').innerHTML = '';
    state.currentCase.suspectOrder.forEach(key => {
      const s = SUSPECTS[key];
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.answer = key;
      b.innerHTML = `${s.emoji}<b>${s.name}</b><small>${s.role}</small>`;
      $('choiceGrid').appendChild(b);
    });
  }

  function loadCamera(id, resetTime=false){
    state.camera = id;
    buildTabs();
    const def = CAMERA_DEFS[id];
    $('camLabel').textContent = `${def.label} — ${def.name.toUpperCase()}`;
    $('cameraNote').textContent = def.note;
    $('cameraTip').textContent = def.tip;
    $('feed').dataset.camera = id;
    $('clueHotspot').style.left = def.hotspot.left;
    $('clueHotspot').style.top = def.hotspot.top;
    $('clueHotspot').classList.toggle('found', state.found.has(id));
    $('markerBtn').style.left = `${(state.currentCase.clues[id].time / 60) * 100}%`;
    const currentSrc = feedVideo.getAttribute('src');
    const applyReset = () => {
      if(resetTime) setTimelineSec(state.currentCase.clues[id].time * 0.3);
      if(state.playing) feedVideo.play().catch(()=>{});
      updateFeed();
    };
    if(currentSrc !== def.video){
      feedVideo.addEventListener('loadedmetadata', function once(){
        feedVideo.removeEventListener('loadedmetadata', once);
        applyReset();
      });
      feedVideo.src = def.video;
      feedVideo.load();
    }else{
      applyReset();
    }
  }

  function renderActors(){
    const t = currentTimelineSec();
    const tracks = state.currentCase.actors[state.camera];
    $('actorsLayer').innerHTML = tracks.map(track => {
      const active = t >= track.start && t <= track.end;
      if(!active) return '';
      const ratio = (t - track.start) / Math.max(1, (track.end - track.start));
      const x = track.from[0] + (track.to[0] - track.from[0]) * ratio;
      const y = track.from[1] + (track.to[1] - track.from[1]) * ratio;
      const suspect = SUSPECTS[track.suspect];
      return `<div class="actor-badge" style="left:${x}%; top:${y}%; --actor:${suspect.color}">${suspect.emoji}<b>${suspect.name}</b></div>`;
    }).join('');
  }

  function updateFeed(){
    const def = CAMERA_DEFS[state.camera];
    const clue = state.currentCase.clues[state.camera];
    const t = currentTimelineSec();
    $('timestamp').textContent = clock(def.base, t);
    $('timeline').value = Math.round(t);
    $('timeReadout').textContent = fmt(t);
    renderActors();

    const found = state.found.has(state.camera);
    $('clueHotspot').classList.toggle('show', !found);
    $('clueHotspot').classList.toggle('found', found);
    if(found){
      $('feedHint').textContent = '✓ Clue collected from this camera';
    }else if(Math.abs(t - clue.time) < 6){
      $('feedHint').textContent = 'Clue in view — tap it now!';
    }else{
      $('feedHint').textContent = 'Tap the glowing clue any time, or use the CLUE marker to jump nearby.';
    }
  }

  function togglePlay(){
    state.playing = !state.playing;
    if(state.playing){
      feedVideo.play().catch(()=>{});
      $('playBtn').textContent = '❚❚';
      toast('Footage playing');
      beep(650,.05);
    }else{
      feedVideo.pause();
      $('playBtn').textContent = '▶';
      beep(360,.05);
    }
  }

  function collectClue(){
    const id = state.camera;
    if(state.found.has(id)) return;
    const clue = state.currentCase.clues[id];
    setTimelineSec(clue.time);
    state.found.add(id);
    buildClues();
    updateProgress();
    updateFeed();
    const remaining = CAMERA_KEYS.length - state.found.size;
    toast(`${clue.icon} ${clue.title} collected!`);
    beep(900,.12);
    $('detectiveSpeech').textContent = remaining
      ? `Great catch. ${remaining} clue${remaining === 1 ? '' : 's'} left. ${rand(HERO_HINTS)}`
      : 'Excellent — every clue is collected. Rebuild the route and name the culprit.';
  }

  function updateProgress(){
    const n = state.found.size;
    $('progressLabel').textContent = `${n} / 5 clues`;
    $('progressBar').style.width = `${n*20}%`;
    $('analyzeBtn').disabled = n < DIFFICULTIES[state.difficulty].unlock;
    $('scoreText').textContent = `${n}/5 clues found`;
  }

  function useHint(){
    const difficulty = DIFFICULTIES[state.difficulty];
    if(state.found.size === CAMERA_KEYS.length){
      $('detectiveSpeech').textContent = 'You already have every clue. Try the route puzzle next.';
      toast('All clues already found');
      return;
    }
    const currentClue = state.currentCase.clues[state.camera];
    if(!state.found.has(state.camera)){
      setTimelineSec(currentClue.time);
      $('detectiveSpeech').textContent = `Hint: the ${currentClue.title.toLowerCase()} belongs to the ${CAMERA_DEFS[state.camera].name.toLowerCase()} camera.`;
      toast('Jumped close to the clue moment');
      beep(700,.05);
      return;
    }
    const nextCam = CAMERA_KEYS.find(id => !state.found.has(id));
    if(nextCam){
      loadCamera(nextCam, true);
      $('detectiveSpeech').textContent = difficulty.hintBoost
        ? `Try the ${CAMERA_DEFS[nextCam].name} camera next.`
        : `A fresh clue remains elsewhere in the hotel.`;
      toast(`Hint: check ${CAMERA_DEFS[nextCam].name}`);
    }
  }

  function resetRoute(){
    state.route = [];
    document.querySelectorAll('.room').forEach(b => b.classList.remove('selected'));
    $('routePicks').textContent = 'Choose the first location…';
    $('checkRoute').disabled = true;
    drawRoute();
  }

  function pickRoom(place, btn){
    if(state.route.includes(place) || state.route.length >= state.currentCase.routeDisplay.length) return;
    state.route.push(place);
    btn.classList.add('selected');
    $('routePicks').textContent = state.route.join(' → ');
    $('checkRoute').disabled = state.route.length !== state.currentCase.routeDisplay.length;
    drawRoute();
    beep(520 + state.route.length*70, .05);
  }

  function drawRoute(){
    const map = $('hotelMap');
    const pts = state.route.map(p => {
      const b = map.querySelector(`[data-place="${p}"]`);
      const r = b.getBoundingClientRect();
      const mr = map.getBoundingClientRect();
      return { x:(r.left + r.width/2 - mr.left) / mr.width * 800, y:(r.top + r.height/2 - mr.top) / mr.height * 420 };
    });
    $('routePath').setAttribute('d', pts.length ? `M ${pts.map(p => `${p.x} ${p.y}`).join(' L ')}` : '');
  }

  function checkRoute(){
    const answer = state.currentCase.routeDisplay;
    const ok = answer.every((x,i) => state.route[i] === x);
    if(ok){
      toast('Route solved!');
      beep(980,.15);
      setTimeout(() => showScreen('finalScreen'), 650);
    }else{
      toast(`Not quite. Compare the clue order again.`);
      beep(180,.14);
      setTimeout(resetRoute, 850);
    }
  }

  function finalChoice(answer){
    if(answer === state.currentCase.culprit){
      $('finalMessage').textContent = `✓ Correct! ${SUSPECTS[answer].name} appears through the entire route.`;
      document.querySelectorAll('#choiceGrid button').forEach(b => b.disabled = true);
      beep(980,.18);
      setTimeout(win, 900);
    }else{
      $('finalMessage').textContent = `${SUSPECTS[answer].name} appears on camera, but the full route points elsewhere.`;
      beep(160,.12);
    }
  }

  function makeConfetti(){
    const c = $('confetti');
    c.innerHTML = '';
    for(let i=0;i<70;i++){
      const e = document.createElement('i');
      e.style.left = Math.random()*100 + '%';
      e.style.animationDuration = (2.4 + Math.random()*2.5) + 's';
      e.style.animationDelay = (Math.random()*.8) + 's';
      e.style.background = ['#f5cb59','#a95aed','#62d5ad','#ff7da5','#79b9ff'][i%5];
      c.appendChild(e);
    }
  }

  function win(){
    showScreen('winScreen');
    makeConfetti();
    $('winSummary').textContent = `${SUSPECTS[state.currentCase.culprit].name} ${state.currentCase.motive}. The route ended at the ${CAMERA_DEFS[state.currentCase.hideLocation].name}.`;
  }

  function replayCase(){
    state.found = new Set();
    state.route = [];
    state.playing = false;
    feedVideo.pause();
    $('playBtn').textContent = '▶';
    document.querySelectorAll('#choiceGrid button').forEach(b => b.disabled = false);
    $('finalMessage').textContent = 'Choose your answer.';
    buildClues();
    updateProgress();
    loadCamera('lobby', true);
    resetRoute();
    showScreen('gameScreen');
    $('detectiveSpeech').textContent = `Replaying ${state.currentCase.title}. Start investigating again.`;
  }

  // Events
  $('startBtn').addEventListener('click', () => {
    showScreen('gameScreen');
    beep(700,.07);
    setTimeout(() => state.playing && feedVideo.play().catch(()=>{}), 120);
  });
  $('newCaseTitleBtn').addEventListener('click', () => startNewCase(true));
  $('newCaseBtn').addEventListener('click', () => { startNewCase(false); showScreen('gameScreen'); });
  $('nextCaseBtn').addEventListener('click', () => { startNewCase(false); showScreen('gameScreen'); });
  $('replayBtn').addEventListener('click', replayCase);
  $('playBtn').addEventListener('click', togglePlay);
  $('rewindBtn').addEventListener('click', () => { setTimelineSec(currentTimelineSec() - 10); beep(440,.04); });
  $('timeline').addEventListener('input', (e) => setTimelineSec(Number(e.target.value)));
  $('markerBtn').addEventListener('click', () => { setTimelineSec(state.currentCase.clues[state.camera].time); toast('Jumped to clue moment'); beep(620,.05); });
  $('clueHotspot').addEventListener('click', collectClue);
  $('soundBtn').addEventListener('click', () => { state.sound = !state.sound; $('soundBtn').textContent = state.sound ? '🔊' : '🔇'; if(state.sound) beep(620,.04); });
  $('hintBtn').addEventListener('click', useHint);
  $('analyzeBtn').addEventListener('click', () => { showScreen('puzzleScreen'); resetRoute(); });
  $('backToCctv').addEventListener('click', () => showScreen('gameScreen'));
  $('hotelMap').addEventListener('click', (e) => {
    const b = e.target.closest('.room');
    if(b) pickRoom(b.dataset.place, b);
  });
  $('resetRoute').addEventListener('click', resetRoute);
  $('checkRoute').addEventListener('click', checkRoute);
  $('choiceGrid').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-answer]');
    if(b) finalChoice(b.dataset.answer);
  });
  $('difficultySelect').addEventListener('change', (e) => {
    state.difficulty = e.target.value;
    if(state.currentCase){
      $('factDifficulty').textContent = DIFFICULTIES[state.difficulty].label;
      updateProgress();
      $('detectiveSpeech').textContent = `${DIFFICULTIES[state.difficulty].label} mode selected. ${DIFFICULTIES[state.difficulty].finalHint}`;
    }
  });
  window.addEventListener('resize', () => { if(state.screen === 'puzzleScreen') drawRoute(); });
  feedVideo.addEventListener('timeupdate', updateFeed);
  feedVideo.addEventListener('ended', () => { if(state.playing) feedVideo.play().catch(()=>{}); });

  // Init
  startNewCase(true);
})();