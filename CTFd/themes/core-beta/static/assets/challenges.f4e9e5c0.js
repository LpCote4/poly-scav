import{m as h,C as o,h as m,T as d,d as p,M as u,a as w}from"./index.5095421b.js";import{V as f,C as b,h as y}from"./CommentBox.687d086b.js";window.values=[];function g(e){let s=new DOMParser().parseFromString(e,"text/html");return s.querySelectorAll('a[href*="://"]').forEach(n=>{n.setAttribute("target","_blank")}),s.documentElement.outerHTML}window.Alpine=h;h.store("challenge",{data:{view:""}});h.data("Hint",()=>({id:null,html:null,async showHint(e){if(e.target.open){let s=(await o.pages.challenge.loadHint(this.id)).data;if(s.content)this.html=g(s.html);else if(await o.pages.challenge.displayUnlock(this.id)){let n=await o.pages.challenge.loadUnlock(this.id);if(n.success){let l=(await o.pages.challenge.loadHint(this.id)).data;this.html=g(l.html)}else e.target.open=!1,o._functions.challenge.displayUnlockError(n)}else e.target.open=!1}}}));h.data("Challenge",()=>({id:null,next_id:null,submission:"",tab:null,solves:[],response:null,share_url:null,async init(){m()},getStyles(){let e={"modal-dialog":!0};try{switch(o.config.themeSettings.challenge_window_size){case"sm":e["modal-sm"]=!0;break;case"lg":e["modal-lg"]=!0;break;case"xl":e["modal-xl"]=!0;break;default:break}}catch(t){console.log("Error processing challenge_window_size"),console.log(t)}return e},async init(){m()},async showChallenge(){new d(this.$el).show()},async showSolves(){this.solves=await o.pages.challenge.loadSolves(this.id),console.log(this.solves),this.solves.forEach(e=>(e.date=p(e.date).format("MMMM Do, h:mm:ss A"),e)),new d(this.$el).show()},async showComments(){const e=f.extend(b);let t=document.createElement("div");console.log(window),document.querySelector("#comment-box").appendChild(t),new e({propsData:{type:"team",id:window.TEAM_ID,challenge_id:this.id}}).$mount(t),new d(this.$el).show()},getNextId(){return h.store("challenge").data.next_id},async nextChallenge(){let e=u.getOrCreateInstance("[x-ref='challengeWindow']");e._element.addEventListener("hidden.bs.modal",t=>{h.nextTick(()=>{this.$dispatch("load-challenge",this.getNextId())})},{once:!0}),e.hide()},async getShareUrl(){let e={type:"solve",challenge_id:this.id};const a=(await(await o.fetch("/api/v1/shares",{method:"POST",body:JSON.stringify(e)})).json()).data.url;this.share_url=a},copyShareUrl(){navigator.clipboard.writeText(this.share_url);let e=w.getOrCreateInstance(this.$el);e.enable(),e.show(),setTimeout(()=>{e.hide(),e.disable()},2e3)},async submitChallenge(){console.log(this.submission),this.response=await o.pages.challenge.submitChallenge(this.id,this.submission),await this.renderSubmissionResponse()},async renderSubmissionResponse(){this.response.data.status==="correct"&&(this.submission=""),this.$dispatch("load-challenges")},async submitManualChallenge(){this.submission=document.getElementById("challenge-input").value,console.log(this.submission),this.response=await o.pages.challenge.submitChallenge(this.id,this.submission),this.response.success&&(this.response.data.status="correct",this.response.data.message="succesfuly send!"),this.$dispatch("load-challenges")},compressAnImage(e,t){const s=new Image;s.src=e,s.onerror=function(){URL.revokeObjectURL(this.src),console.log("Cannot load image")},s.onload=function(){URL.revokeObjectURL(this.src);const[n,i]=a(s,400,400),l=document.createElement("canvas");l.width=n,l.height=i,l.getContext("2d").drawImage(s,0,0,n,i),l.toBlob(r=>t(r),"image/png",.7)};function a(n,i,l){let c=n.width,r=n.height;return c>r?c>i&&(r=Math.round(r*i/c),c=i):r>l&&(c=Math.round(c*l/r),r=l),[c,r]}},uploadFile(e){for(let s=0;s<e.srcElement.files.length;s++){var t=e.srcElement.files[s];const a=URL.createObjectURL(t);let n=function(i){var l=new FileReader;l.onloadend=function(){var c=l.result.split(",")[1],r=btoa(c);window.values.push(r),document.getElementById("challenge-input").value=JSON.stringify(window.values)},l.readAsDataURL(i)};this.compressAnImage(a,n)}}}));h.data("ChallengeBoard",()=>({loaded:!1,challenges:[],challenge:null,async init(){window.TEAM_ID=o.team.id;let e={};e.team_id=window.TEAM_ID;let t=e;t.page=1,t.per_page=1e4,this.challenges=await o.pages.challenges.getChallenges();let s=await o.pages.scoreboard.getScoreboard();await o.pages.scoreboard.getScoreboardDetail(s.length),this.comments=await y.comments.get_comments(t),this.maxScore=0,this.solveScore=0,this.submitScore=0;for(let a in this.challenges){let n=this.challenges[a].value;this.challenges[a].solved_by_me?this.solveScore+=n:this.challenges[a].submited&&(this.submitScore+=n),this.maxScore+=n}document.getElementById("scoreProgressTitle").textContent=this.solveScore+this.submitScore+" points",document.getElementById("scoreProgressBar").value=100*((this.solveScore+this.submitScore)/this.maxScore),document.getElementById("scoreProgressText").textContent=""+parseInt(100*(this.submitScore/(this.solveScore+this.submitScore)))+"% des points en approbations",this.commentsChallengeDict={};for(let a in this.comments.data){let n=this.comments.data[a].content;if(n.search("#")!=-1){n=n.split("#")[1];let i=n.search(":"),l=0;i!=-1,l=parseInt(n.split(":")[0]),this.commentsChallengeDict[l]!=null?this.commentsChallengeDict[l]=this.commentsChallengeDict[l]+1:this.commentsChallengeDict[l]=1}}for(let a in this.commentsChallengeDict)document.getElementById(a+"a").className="fas fa-comments float-end",document.getElementById(a).textContent=this.commentsChallengeDict[a]>99?99:this.commentsChallengeDict[a];if(this.loaded=!0,window.location.hash){let a=decodeURIComponent(window.location.hash.substring(1)),n=a.lastIndexOf("-");if(n>=0){let l=[a.slice(0,n),a.slice(n+1)][1];await this.loadChallenge(l)}}},getCategories(){const e=[];this.challenges.forEach(t=>{const{category:s}=t;e.includes(s)||e.push(s)});try{const t=o.config.themeSettings.challenge_category_order;if(t){const s=new Function(`return (${t})`);e.sort(s())}}catch(t){console.log("Error running challenge_category_order function"),console.log(t)}return e},getChallenges(e){let t=this.challenges;e!==null&&(t=this.challenges.filter(s=>s.category===e));try{const s=o.config.themeSettings.challenge_order;if(s){const a=new Function(`return (${s})`);t.sort(a())}}catch(s){console.log("Error running challenge_order function"),console.log(s)}return t},async loadChallenges(){this.challenges=await o.pages.challenges.getChallenges(),console.log(this.comments)},async loadChallenge(e){await o.pages.challenge.displayChallenge(e,t=>{t.data.view=g(t.data.view),h.store("challenge").data=t.data,h.nextTick(()=>{let s=u.getOrCreateInstance("[x-ref='challengeWindow']");s._element.addEventListener("hidden.bs.modal",a=>{history.replaceState(null,null," ")},{once:!0}),s.show(),history.replaceState(null,null,`#${t.data.name}-${e}`)})})}}));h.start();