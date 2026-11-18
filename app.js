const $ = s => document.querySelector(s);
const today = () => new Date().toISOString().slice(0,10);
const uid = () => Math.random().toString(36).slice(2,10);
const seed = {
  trees:[{id:"pine",name:"Pin noir",species:"Pinus thunbergii",date:today(),place:"Extérieur",notes:"Mon premier compagnon de jardin.",photo:"",created:Date.now()}],
  events:[{id:uid(),treeId:"pine",type:"Observation",date:today(),note:"Bienvenue dans le jardin. Pense à observer l'humidité du substrat."}],
  tasks:[{id:uid(),title:"Observer l'humidité du substrat",treeId:"pine",date:today(),done:false}]
};
let db = load();
let page="home", filter="Tous", selectedTreeId=null, detailTab="soins";
function load(){try{return JSON.parse(localStorage.getItem("bonsai-kevin-v1"))||seed}catch{return seed}}
function save(){localStorage.setItem("bonsai-kevin-v1",JSON.stringify(db))}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function fmt(d){if(!d)return "Date inconnue";return new Date(d+"T12:00:00").toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}
function age(d){if(!d)return "Âge non renseigné";let n=Math.max(0,Math.floor((Date.now()-new Date(d+"T12:00:00"))/86400000));return n===0?"Acquis aujourd'hui":`Depuis ${n} jour${n>1?"s":""}`}
function tree(id){return db.trees.find(t=>t.id===id)}
function icon(type){return ({Arrosage:"💧",Taille:"✂️",Fertilisation:"🌱",Rempotage:"🪴",Observation:"♡"})[type]||"日"}
function toast(msg){let el=$("#toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2300)}
function empty(title,desc,action="Ajouter un bonsaï",fn="tree"){return `<div class="empty"><div class="empty-icon">盆栽</div><strong>${title}</strong><p>${desc}</p><button class="btn primary" data-open="${fn}">${action}</button></div>`}
function treeCard(t){let events=db.events.filter(e=>e.treeId===t.id);let last=events.sort((a,b)=>b.date.localeCompare(a.date))[0];return `<article class="tree-card tree-card-clickable" data-tree-open="${t.id}" role="button" tabindex="0" aria-label="Ouvrir la fiche de ${esc(t.name)}"><div class="tree-thumb">${t.photo?`<img src="${t.photo}" alt="${esc(t.name)}">`:`<span class="tree-emoji">🌳</span>`}</div><div class="tree-info"><h3>${esc(t.name)}</h3><p>${esc(t.species||"Espèce non renseignée")} · ${esc(t.place||"")}</p><div class="tree-meta"><span class="pill">${age(t.date)}</span><span class="pill">${events.length?`${events.length} soin${events.length>1?"s":""} noté${events.length>1?"s":""}`:"À découvrir"}</span></div><div class="tree-actions"><button class="mini-btn" data-care="${t.id}">＋ Soin</button><button class="mini-btn" data-edit="${t.id}">Modifier</button><button class="mini-btn" data-delete="${t.id}">Supprimer</button></div></div></article>`}
function eventRow(e){let t=tree(e.treeId);return `<div class="event"><div class="event-icon">${icon(e.type)}</div><div><h3>${esc(e.type)} · ${esc(t?.name||"Arbre supprimé")}</h3><p>${e.type==="Fertilisation"?`Engrais ${esc((e.fertilizerKind||"").toLowerCase())}${e.product?" · "+esc(e.product):""}${e.amount?" · "+esc(e.amount):""}${e.note?" · "+esc(e.note):""}`:esc(e.note||"Aucun commentaire")}</p><time>${fmt(e.date)}</time></div></div>`}
function pageHeader(kicker,title,sub){return `<div class="page-intro"><div class="eyebrow">${kicker}</div><h2>${title}</h2><p>${sub}</p></div>`}
function renderHome(){let latest=[...db.events].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);return `
  <section class="hero"><div class="hero-art"></div><div class="hero-top"><div><div class="eyebrow">盆栽 · L'ART DU TEMPS</div><h2>Un jardin, une<br>histoire vivante.</h2><div class="hero-meta">${db.trees.length} arbre${db.trees.length>1?"s":""} dans ta collection</div></div><span style="font-size:28px">🌿</span></div><div class="hero-bottom"><div class="hero-quote">« La patience est la première taille du bonsaï. »</div><button class="hero-cta" data-open="tree">＋ Ajouter</button></div></section>
  <div class="stats"><div class="stat"><span class="symbol">🌳</span><strong>${db.trees.length}</strong><span>Bonsaïs</span></div><div class="stat"><span class="symbol">💧</span><strong>${db.events.filter(e=>e.type==="Arrosage").length}</strong><span>Arrosages notés</span></div><div class="stat"><span class="symbol">日</span><strong>${db.events.length}</strong><span>Soins consignés</span></div></div>
  <div class="section-head"><div><h2>Les gestes du jour</h2><p>Prends soin de tes compagnons</p></div></div>
  <div class="quick-actions"><button class="quick" data-quick="Arrosage"><span>💧</span><small>Arroser</small></button><button class="quick" data-quick="Taille"><span>✂️</span><small>Tailler</small></button><button class="quick" data-quick="Fertilisation"><span>🌱</span><small>Nourrir</small></button><button class="quick" data-quick="Rempotage"><span>🪴</span><small>Rempoter</small></button></div>
  <div class="section-head"><div><h2>Mes arbres</h2><p>Chaque arbre a son propre rythme</p></div><button class="text-btn" data-page="collection">Tout voir →</button></div>
  ${db.trees.length?`<div class="tree-list">${db.trees.slice(0,2).map(treeCard).join("")}</div>`:empty("Ton jardin attend son premier arbre","Ajoute ton premier bonsaï pour commencer à suivre son histoire.")}
  <div class="section-head"><div><h2>Derniers instants</h2><p>Les traces de tes soins</p></div><button class="text-btn" data-page="journal">Journal →</button></div>
  ${latest.length?`<div class="timeline">${latest.map(eventRow).join("")}</div>`:empty("Le journal est encore vierge","Tes gestes apparaîtront ici.")}
  <div class="garden-note">庭 — Un bonsaï ne se presse pas. Il s'observe, s'écoute et grandit au fil des saisons.</div>`}
function renderCollection(){let list=filter==="Tous"?db.trees:db.trees.filter(t=>t.place===filter);return `${pageHeader("盆栽 · COLLECTION","Ma collection","Chaque arbre, une silhouette et une histoire.")}<div class="filter-row">${["Tous","Extérieur","Intérieur lumineux","Serre froide"].map(f=>`<button class="filter-chip ${filter===f?"active":""}" data-filter="${f}">${f}</button>`).join("")}</div>${list.length?`<div class="tree-list">${list.map(treeCard).join("")}</div>`:empty("Aucun arbre ici","Ajoute un bonsaï ou change de filtre.")}<button class="fab" data-open="tree" aria-label="Ajouter un bonsaï">＋</button>`}
function renderJournal(){let events=[...db.events].sort((a,b)=>b.date.localeCompare(a.date));return `${pageHeader("成長の記録 · MÉMOIRE","Le journal","Garde une trace de chaque geste et de chaque saison.")}<div class="stats"><div class="stat"><span class="symbol">✂️</span><strong>${db.events.filter(e=>e.type==="Taille").length}</strong><span>Tailles</span></div><div class="stat"><span class="symbol">🌱</span><strong>${db.events.filter(e=>e.type==="Fertilisation").length}</strong><span>Fertilisations</span></div><div class="stat"><span class="symbol">🪴</span><strong>${db.events.filter(e=>e.type==="Rempotage").length}</strong><span>Rempotages</span></div></div><div class="section-head"><div><h2>Chronologie</h2><p>${events.length} entrée${events.length>1?"s":""} enregistrée${events.length>1?"s":""}</p></div><button class="text-btn" data-open="care">＋ Ajouter</button></div>${events.length?`<div class="timeline">${events.map(eventRow).join("")}</div>`:empty("Pas encore de souvenir","Enregistre ton premier soin pour démarrer le journal.","Noter un soin","care")}<button class="fab" data-open="care" aria-label="Ajouter un soin">＋</button>`}
function renderTasks(){let tasks=[...db.tasks].sort((a,b)=>a.date.localeCompare(b.date));let done=tasks.filter(t=>t.done).length;return `${pageHeader("予定 · ORGANISATION","Les attentions à venir","Un petit rappel pour accompagner chaque arbre.")}<div class="stat" style="margin-bottom:18px"><span class="symbol">🌿</span><strong>${done}/${tasks.length}</strong><span>Tâches accomplies</span><div class="progress"><span style="width:${tasks.length?done/tasks.length*100:0}%"></span></div></div><div class="section-head"><div><h2>Mon carnet</h2><p>À ton rythme, sans précipitation</p></div><button class="text-btn" data-open="task">＋ Ajouter</button></div>${tasks.length?tasks.map(t=>`<div class="task ${t.done?"done":""}"><input type="checkbox" data-task="${t.id}" ${t.done?"checked":""}><div class="task-main"><strong>${esc(t.title)}</strong><small>${esc(tree(t.treeId)?.name||"Tous les arbres")} · ${fmt(t.date)}</small></div><button class="icon-btn" data-task-delete="${t.id}" aria-label="Supprimer">×</button></div>`).join(""):empty("Aucune tâche prévue","Ajoute une attention à ne pas oublier.","Créer une tâche","task")}<button class="fab" data-open="task" aria-label="Ajouter une tâche">＋</button>`}

function renderTreeDetail(){
 let t=tree(selectedTreeId); if(!t){page="collection";return renderCollection()}
 let events=db.events.filter(e=>e.treeId===t.id).sort((a,b)=>b.date.localeCompare(a.date));
 let tasks=db.tasks.filter(x=>x.treeId===t.id).sort((a,b)=>a.date.localeCompare(b.date));
 let photos=[...(t.photos||[])]; if(t.photo&&!photos.some(p=>p.src===t.photo))photos.unshift({src:t.photo,date:t.date||today()});
 let tabs=[["infos","Infos"],["calendrier","Calendrier"],["photos","Photos"],["soins","Soins"]];
 let content="";
 if(detailTab==="infos") content=`
  <div class="detail-panel"><div class="detail-photo">${t.photo?`<img src="${t.photo}" alt="${esc(t.name)}">`:"<span>🌳</span>"}</div>
   <div class="detail-facts"><div><small>Espèce</small><strong>${esc(t.species||"Non renseignée")}</strong></div><div><small>Emplacement</small><strong>${esc(t.place||"Non renseigné")}</strong></div><div><small>Acquis le</small><strong>${fmt(t.date)}</strong></div><div><small>Dans le jardin</small><strong>${age(t.date)}</strong></div></div>
   <div class="detail-notes"><span class="eyebrow">NOTES PERSONNELLES</span><p>${esc(t.notes||"Aucune note pour le moment.")}</p></div>
   <button class="btn secondary" data-edit="${t.id}">Modifier les informations</button>
  </div>`;
 if(detailTab==="calendrier") content=`
  <div class="section-head"><div><h2>Historique et échéances</h2><p>Les dates de ${esc(t.name)}</p></div><button class="text-btn" data-open-task-tree="${t.id}">＋ Rappel</button></div>
  ${tasks.length?`<h3 class="subheading">Rappels</h3>${tasks.map(x=>`<div class="task ${x.done?"done":""}"><input type="checkbox" data-task="${x.id}" ${x.done?"checked":""}><div class="task-main"><strong>${esc(x.title)}</strong><small>${fmt(x.date)}</small></div><button class="icon-btn" data-task-delete="${x.id}" aria-label="Supprimer">×</button></div>`).join("")}`:`<div class="empty compact-empty"><strong>Aucun rappel prévu</strong><p>Ajoute une prochaine intervention à ne pas oublier.</p><button class="btn primary" data-open-task-tree="${t.id}">Créer un rappel</button></div>`}
  <h3 class="subheading">Interventions réalisées</h3>
  ${events.length?`<div class="timeline">${events.map(eventRow).join("")}</div>`:`<p class="muted">Aucune intervention enregistrée pour cet arbre.</p>`}`;
 if(detailTab==="photos") content=`
  <div class="section-head"><div><h2>Évolution en images</h2><p>${photos.length} photo${photos.length>1?"s":""} dans le carnet</p></div><button class="text-btn" data-add-photo="${t.id}">＋ Ajouter</button></div>
  <input id="tree-photo-add" type="file" accept="image/*" hidden>
  ${photos.length?`<div class="photo-grid">${photos.map((p,i)=>`<figure><img src="${p.src}" alt="Photo ${i+1} de ${esc(t.name)}"><figcaption>${fmt(p.date||today())}</figcaption></figure>`).join("")}</div>`:`<div class="empty"><div class="empty-icon">写真</div><strong>Le carnet photo est vide</strong><p>Ajoute une photo pour suivre l'évolution de ton bonsaï au fil des saisons.</p><button class="btn primary" data-add-photo="${t.id}">Ajouter une photo</button></div>`}`;
 if(detailTab==="soins") content=`
  <div class="detail-care-summary"><div><strong>${events.length}</strong><small>Soins notés</small></div><div><strong>${events.filter(e=>e.type==="Arrosage").length}</strong><small>Arrosages</small></div><div><strong>${events.filter(e=>e.type==="Fertilisation").length}</strong><small>Fertilisations</small></div></div>
  <div class="section-head"><div><h2>Noter une intervention</h2><p>Un carnet dédié à ${esc(t.name)}</p></div></div>
  <div class="quick-actions detail-quick"><button class="quick" data-care="${t.id}" data-care-type="Arrosage"><span>💧</span><small>Arroser</small></button><button class="quick" data-care="${t.id}" data-care-type="Taille"><span>✂️</span><small>Tailler</small></button><button class="quick" data-care="${t.id}" data-care-type="Fertilisation"><span>🌱</span><small>Nourrir</small></button><button class="quick" data-care="${t.id}" data-care-type="Rempotage"><span>🪴</span><small>Rempoter</small></button></div>
  <div class="section-head"><div><h2>Historique des soins</h2><p>${events.length} intervention${events.length>1?"s":""}</p></div></div>
  ${events.length?`<div class="timeline">${events.map(eventRow).join("")}</div>`:`<div class="empty"><div class="empty-icon">盆栽</div><strong>Aucun soin enregistré</strong><p>Les interventions de ${esc(t.name)} apparaîtront ici.</p></div>`}`;
 return `${pageHeader("盆栽 · CARNET INDIVIDUEL",esc(t.name),`${esc(t.species||"Espèce non renseignée")} · ${esc(t.place||"")}`)}
  <button class="back-link" data-back-collection>← Retour à la collection</button>
  <div class="detail-tabs">${tabs.map(([id,label])=>`<button class="detail-tab ${detailTab===id?"active":""}" data-detail-tab="${id}">${label}</button>`).join("")}</div>
  ${content}`;
}
function render(){let view=$("#view");view.innerHTML=({home:renderHome,collection:renderCollection,journal:renderJournal,tasks:renderTasks,detail:renderTreeDetail})[page]();document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.page===page))}

function openTree(id){let t=id?tree(id):null;$("#tree-form").reset();$("#tree-id").value=t?.id||"";$("#tree-modal-title").textContent=t?"Modifier l'arbre":"Ajouter un bonsaï";$("#tree-name").value=t?.name||"";$("#tree-species").value=t?.species||"";$("#tree-date").value=t?.date||today();$("#tree-place").value=t?.place||"Extérieur";$("#tree-notes").value=t?.notes||"";$("#tree-photo").value="";$("#tree-dialog").showModal()}
function openCare(treeId,type){$("#care-form").reset();$("#care-tree").innerHTML=db.trees.map(t=>`<option value="${t.id}">${esc(t.name)}</option>`).join("");if(treeId)$("#care-tree").value=treeId;$("#care-type").value=type||"Arrosage";$("#care-date").value=today();$("#fertilizer-fields").hidden=$("#care-type").value!=="Fertilisation";$("#fertilizer-kind").value="Liquide";$("#care-product").value="";$("#care-amount").value="";$("#care-next-date").value="";$("#care-dialog").showModal()}
function openTask(treeId=""){$("#task-form").reset();$("#task-tree").innerHTML='<option value="">Tous les arbres</option>'+db.trees.map(t=>`<option value="${t.id}">${esc(t.name)}</option>`).join("");$("#task-date").value=today();if(treeId)$("#task-tree").value=treeId;$("#task-dialog").showModal()}
document.addEventListener("click",e=>{let card=e.target.closest("[data-tree-open]");if(card&&!e.target.closest("button")){selectedTreeId=card.dataset.treeOpen;detailTab="soins";page="detail";render()}});
document.addEventListener("click",e=>{
 let b=e.target.closest("button");if(!b)return;
 if(b.dataset.page){page=b.dataset.page;render();return}
 if(b.dataset.treeOpen){selectedTreeId=b.dataset.treeOpen;detailTab="soins";page="detail";render();return}
 if(b.dataset.detailTab){detailTab=b.dataset.detailTab;render();return}
 if(b.hasAttribute("data-back-collection")){page="collection";render();return}
 if(b.dataset.openTaskTree){openTask(b.dataset.openTaskTree);return}
 if(b.dataset.addPhoto){$("#tree-photo-add").click();return}

 if(b.dataset.open==="tree"){openTree();return}if(b.dataset.open==="care"){openCare();return}if(b.dataset.open==="task"){openTask();return}
 if(b.dataset.close){$("#"+b.dataset.close).close();return}
 if(b.dataset.quick){openCare(null,b.dataset.quick);return}
 if(b.dataset.care){openCare(b.dataset.care,b.dataset.careType||"Arrosage");return}
 if(b.dataset.edit){openTree(b.dataset.edit);return}
 if(b.dataset.delete){let t=tree(b.dataset.delete);if(confirm(`Supprimer ${t.name} et son historique ?`)){db.trees=db.trees.filter(x=>x.id!==t.id);db.events=db.events.filter(x=>x.treeId!==t.id);db.tasks=db.tasks.filter(x=>x.treeId!==t.id);save();render();toast("Arbre supprimé")};return}
 if(b.dataset.filter){filter=b.dataset.filter;render();return}
 if(b.dataset.taskDelete){db.tasks=db.tasks.filter(t=>t.id!==b.dataset.taskDelete);save();render();toast("Tâche supprimée");return}
});
document.addEventListener("change",e=>{
 if(e.target.dataset.task){let t=db.tasks.find(x=>x.id===e.target.dataset.task);if(t){t.done=e.target.checked;save();render()}}
 if(e.target.dataset.taskDelete){db.tasks=db.tasks.filter(t=>t.id!==e.target.dataset.taskDelete);save();render()}
});
$("#tree-form").addEventListener("submit",async e=>{e.preventDefault();let id=$("#tree-id").value;let old=tree(id);let photo=old?.photo||"";let file=$("#tree-photo").files[0];if(file){photo=await new Promise((resolve,reject)=>{let r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
 let t={id:id||uid(),name:$("#tree-name").value.trim(),species:$("#tree-species").value.trim(),date:$("#tree-date").value,place:$("#tree-place").value,notes:$("#tree-notes").value.trim(),photo,photos:old?.photos||[],created:old?.created||Date.now()};if(old)db.trees=db.trees.map(x=>x.id===id?t:x);else db.trees.unshift(t);save();$("#tree-dialog").close();render();toast(old?"Arbre mis à jour":"Bienvenue dans le jardin")});
$("#care-form").addEventListener("submit",e=>{e.preventDefault();let type=$("#care-type").value;let event={id:uid(),treeId:$("#care-tree").value,type,date:$("#care-date").value,note:$("#care-note").value.trim()};if(type==="Fertilisation"){event.fertilizerKind=$("#fertilizer-kind").value;event.product=$("#care-product").value.trim();event.amount=$("#care-amount").value.trim();event.nextDate=$("#care-next-date").value;if(event.nextDate){db.tasks.push({id:uid(),title:`Fertilisation (${event.fertilizerKind.toLowerCase()})${event.product?" · "+event.product:""}`,treeId:event.treeId,date:event.nextDate,done:false})}}db.events.unshift(event);save();$("#care-dialog").close();render();toast("Soin ajouté au carnet de l'arbre")});
$("#task-form").addEventListener("submit",e=>{e.preventDefault();db.tasks.push({id:uid(),title:$("#task-title").value.trim(),treeId:$("#task-tree").value,date:$("#task-date").value,done:false});save();$("#task-dialog").close();render();toast("Tâche ajoutée")});
$("#care-type").addEventListener("change",()=>{$("#fertilizer-fields").hidden=$("#care-type").value!=="Fertilisation"});
$("#fertilizer-kind").addEventListener("change",()=>{$("#care-amount-label").textContent=$("#fertilizer-kind").value==="Liquide"?"Dosage / quantité":"Quantité de granulés ou boulettes"});
document.addEventListener("change",async e=>{if(e.target.id==="tree-photo-add"){let file=e.target.files[0];if(!file)return;let t=tree(selectedTreeId);if(!t)return;let src=await new Promise((resolve,reject)=>{let r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});t.photos=t.photos||[];t.photos.unshift({src,date:today()});if(!t.photo)t.photo=src;save();render();toast("Photo ajoutée au carnet") }});
$("#open-settings").addEventListener("click",()=>$("#settings-dialog").showModal());
$("#export-data").addEventListener("click",()=>{let blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"});let a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="bonsai-de-kevin-sauvegarde.json";a.click();URL.revokeObjectURL(a.href);toast("Sauvegarde exportée")});
$("#import-data").addEventListener("change",async e=>{let f=e.target.files[0];if(!f)return;try{let data=JSON.parse(await f.text());if(!Array.isArray(data.trees)||!Array.isArray(data.events)||!Array.isArray(data.tasks))throw Error();db=data;save();render();$("#settings-dialog").close();toast("Sauvegarde importée")}catch{alert("Fichier de sauvegarde invalide.")}});
$("#reset-data").addEventListener("click",()=>{if(confirm("Effacer toutes les données de ce jardin ? Cette action est irréversible.")){db={trees:[],events:[],tasks:[]};save();render();$("#settings-dialog").close();toast("Jardin réinitialisé")}});
render();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
