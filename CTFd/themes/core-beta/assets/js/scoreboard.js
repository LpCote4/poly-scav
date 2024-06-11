import Alpine from "alpinejs";
import CTFd from "./index";
import { getOption, getTenLast } from "./utils/graphs/echarts/scoreboard";
import { embed } from "./utils/graphs/echarts";
import * as echarts from 'echarts';

window.Alpine = Alpine;
window.CTFd = CTFd;
window.ScoreboardDetail = 0;
window.standings = 0;
window.scoreboardListLoaded = false;
window.allImages = [];
window.maxCount = 0;
window.maxCountIncrease = 1;
window.imageInit = false;

Alpine.data("ScoreboardDetail", () => ({
  data: {},
  show: true,
  
  async init() {
    window.standings = await CTFd.pages.scoreboard.getScoreboard();
    window.ScoreboardDetail = await CTFd.pages.scoreboard.getScoreboardDetail(window.standings.length)
    console.log(window.ScoreboardDetail);
    console.log(window.standings);
    let option = getOption(CTFd.config.userMode, window.standings);
    var chartDom = document.getElementById('score-graph');
    embed(chartDom, option);
    
    this.show = window.standings.length > 0;
    
  },
}));

Alpine.data("ScoreboardList", () => ({
  standings: [],
  brackets: [],
  activeBracket: null,

  async init() {
    
    let responseBrackets = await CTFd.fetch(`/api/v1/brackets?type=${CTFd.config.userMode}`, {
      method: "GET",
    });
    const bodyBrackets = await responseBrackets.json();
    this.brackets = bodyBrackets["data"];
    

    let responseChallenges= await CTFd.fetch(`/api/v1/challenges`, {
      method: "GET",

    });
    const bodyChallenges = await responseChallenges.json();
    console.log(bodyChallenges);
  
    let ChallengeIdToChallengeName = {}
    for (let i = 0; i < bodyChallenges["data"].length; i++){
      ChallengeIdToChallengeName[bodyChallenges["data"][i]["id"]] = bodyChallenges["data"][i]["name"];
    }
   
    let last = getTenLast(window.ScoreboardDetail, window.standings, ChallengeIdToChallengeName);
    for (let i = 0; i < last.length; i++){
      this.standings[i] = last[i];
    }
    
  },
}));





Alpine.data("LogImage", () => ({
  
  async init() {
    window.allImages.push(this.id);
    console.log(window.allImages);
    if (window.allImages.length > window.maxCount){
      document.getElementById(this.id).hidden = true
    }
    
    if (window.allImages.length == window.maxCountIncrease){
      if (!window.imageInit){
        console.log(window.imageInit);
        window.imageInit = true;
        self.show10More();
      }
      
      
      
    }
  },
}));

this.show10More = async function(){
  let imageToPull = [];
  for (let i = window.maxCount; i < window.maxCount+window.maxCountIncrease; i++){
    imageToPull.push(window.allImages[i]);
    document.getElementById(window.allImages[i]).hidden = false;
  }
  
  let responseChallengesMedia= await CTFd.fetch(`/api/v1/challenges?ids=`+JSON.stringify(imageToPull), {
    method: "GET",
  });
  const bodyChallengesMedia = await responseChallengesMedia.json();
  console.log(bodyChallengesMedia);
  //for (let i = 0; i < window.maxCountIncrease; i++){
    //let img = document.createElement("img");
    //document.getElementById(window.allImages[i]).querySelector("#img").src = "data:text/plain;base64," + atob(bodyChallengesMedia["data"][1]["provided"]);
  //}
  window.maxCount += window.maxCountIncrease;
};



Alpine.start();
