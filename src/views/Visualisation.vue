<template>
<div class="visualisation">
<div>
<label>
Motif :
<input type="text" placeholder="Motif" v-model="motif">
</label>
<label>
Texte :
<input type="text" placeholder="Texte" v-model="texte">
</label>
</div>
<div>
<button class="btn btn-primary mr-1" @click="visuComplete">
Visualisation Complete
<i class="fas fa-play"></i>
</button>
<button class="btn btn-success mr-1" @click="nextStepUsingPhase">
Etape Par Etape
<i class="fas fa-forward"></i>
</button>
<button class="btn btn-danger mr-1" @click="reset">
Reset
<i class="fas fa-undo"></i>
</button>


<!--
<button class="btn btn-danger mr-1" @click="generateTimes">
Générer
<i class="fas fa-dna"></i>
</button>
-->








<div class="custom-control custom-checkbox" style="margin-top:10px;">
<input v-model="caseSensitive" type="checkbox" class="custom-control-input" id="customCheck1">
<label class="custom-control-label" for="customCheck1">Sensible à la casse</label>
</div>

</div>

<br>

<label>
Vitesse d'animation
</label>

<vue-slider width = '25%' style='margin: 0 auto;' :min="1" :max="100" v-model="sliderValue" />



<div v-html="errors"></div>

<hr>

<div>

<h1 style="font-family: monospace;white-space: nowrap;" v-html="tableauMotifHelper" ></h1>
<div v-html = "tableau"></div>
<br>
<div v-html = "tableauExplications"></div>  

</div>


<hr v-if="phase >= 1">

<div>

<div v-if="phase >= 1">
<div id="toScrollLeft" >
<h1 style="  font-family: monospace; white-space: nowrap;">{{this.texte}}</h1>
</div>
<br>
<div style="margin-top : -40px;white-space: nowrap;" v-html="printtxt" id="fillMe"></div>
</div>
<div v-html="explications"></div>

</div>

<hr v-if="phase >= 2">

<div v-if="phase >= 2">
<div v-html="compTemps"></div>
</div>


</div>

</template>

<script>
// @ is an alias to /src

import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';

import VuePlotly from '@statnett/vue-plotly';




export default {
  name: "home",
  components: {
    VueSlider,
    VuePlotly,

  },

  data() {
    return {

      errors : "",


      motif: "",
      texte: "",

      printtxt : "&nbsp",
      explications: "&nbsp",

      caseSensitive : 0,

      steps_index: 0,
      userIndex: 0,
      steps: [],

      results : [],
      resultsIndex : 0,

      tabSteps : [],
      tabStepsIndex : 0,
      tableau : "&nbsp",
      tableauExplications : "&nbsp",
      userTabStepsIndex : 0,
      tableauMotifHelper :"&nbsp",

      lastTab : [],
      shift : [],
      bpos : [],

      phase : 0,

      calledOnce : false,
      timer : null,
      resetTimer : false,

      sliderValue : 50,

      tempsBM : -1,
      tempsNAIF : -1,
      compTemps : "",

      nbCompBM : 0,
      nbCompNAIF : 0,
    };
  },
  methods: {
    visualize() {},

    nextStep() {

      if(!this.calledOnce){
        this.calledOnce = true;
        this.find();
        this.findNaif();
      }

      if(this.userIndex >= this.steps.length){
        this.phase = 2;

        this.compTemps = "<table class='table table-bordered' style='max-width: 25%; margin: 0 auto;'> <tr> <th>Algorithme</th</th> <th>Temps (en ms)</th> <th>Nombre Comparaisons</th></tr> <tr>";
        this.compTemps += "<td>" + "Boyer Moore "+ "</td>" + "<td>" + this.tempsBM +"ms</td> <td> "+this.nbCompBM+"</td></tr> <tr>";
        this.compTemps += "<td>" + "Naïf "+ "</td>" + "<td>" + this.tempsNAIF +"ms</td> <td> "+this.nbCompNAIF+"</td></tr>";
        this.compTemps += "</table>";
        this.compTemps += "<a href='https://www.desmos.com/calculator/0oh4g0maji'>Comparaison en fonction de |motif|</a><br>";
        this.compTemps += "<a href= 'https://www.desmos.com/calculator/qtpi9gtwm1'>Comparaison d'algos sur le nombre de comparaisons</a>";


        clearTimeout(this.timer);
        this.resetTimer = true;
        return;
      }

      let step = this.steps[this.userIndex];

      console.log(step);

      let i = step[1];
      let j = step[2];
      let m  = this.motif.length;

      let newText = "<h1  style='font-family: monospace;'>";

      let sft = i;
      for (let k = 0; k < sft; k++) {
        newText += '&nbsp';
      }

      this.explications = "";

      if(step[0] == 0){ //Occurence, avance le mot
        newText += "<span style='background-color: green'>" + this.motif + "</span>";
        for (let k = i+m; k < this.texte.length; k++) {
          newText += '&nbsp';
        }

        this.explications = "`" + this.motif[j] +"`"+ " = " + "`" +this.texte[i+j] +"`" + ", il y a une correspondance."

        if(this.userIndex != this.steps.length-1){
         this.explications += "<br>On a un match, on décale le mot de 1 ";
       }
       


      }else if(step[0] == 1){//Avance dans la comparaison

        for(let k = 0;k<j;k++){
          newText+=this.motif[k];
        }
        newText += "<span style='background-color: green'>";
        for(let k = j;k<m;k++){
          newText+=this.motif[k];
        }
        newText += "</span>";
        for (let k = i+m; k < this.texte.length; k++) {
          newText += '&nbsp';
        }

        this.explications = "`" + this.motif[j] +"`"+ " = " + "`" +this.texte[i+j] +"`" + ", il y a une correspondance, l’algorithme vérifie donc si le précédent caractère du motif correspond à celui du texte."


      }else if(step[0] == 2){//Mismatch, avance le mot
       for(let k = 0;k<j;k++){
        newText+=this.motif[k];
      }
      newText += "<span style='background-color: red'>" + this.motif[j] + "</span>";
      newText += "<span style='background-color: green'>";
      for(let k = j+1;k<m;k++){
        newText+=this.motif[k];
      }
      newText += "</span>";
      for (let k = i+m; k < this.texte.length; k++) {
        newText += '&nbsp';
      }


      this.explications = "`" + this.motif[j] +"`"+ " != " + "`" +this.texte[i+j] +"`" + ", ce caractère correspond au chiffre "+this.last(this.texte[i+j])+" dans le tableau, on saute donc " + this.last(this.texte[i+j]) + " caractère.";

    }

    if(this.userIndex == this.steps.length-1){
     this.explications += "<br>On est arrivé à la fin du texte";

     if(this.results.length == 0){
       this.explications += "<br>Aucune occurence n'a été trouvée ! ";
     }else{
      this.explications += "<br>Nous avons trouvé " + this.results.length + " occurences ! ";
    }

  }





  newText += ' </h1>';
  this.printtxt = newText;


  this.userIndex++;



},
reset() {
  this.motif =  "" ;
  this.texte=  "";
  this.steps_index= 0;
  this.userIndex= 0;
  this.steps= [];
  this.results = [];
  this.resultsIndex = 0;
  this.tabSteps = [];
  this.tabStepsIndex = 0;
  this.printtxt = "";
  this.explications= "";
  this.lastTab = [];
  this.phase = 0;
  this.calledOnce = false;
  this.tableau = "";
  this.tableauExplications = "";
  this.userTabStepsIndex = 0;
  this.tableauMotifHelper = "";

  this.errors = "";
  this.caseSensitive = 0;
  this.shift = [];
  this.bpos = [];

  this.timer = null;
  this.resetTimer = false;

  this.tempsBM = 0;
  this.tempsNAIF = 0;
  this.compTemps = "";

  this.nbCompBM = 0;
  this.nbCompNAIF = 0;

},

fillTabPhaseTab(){
  this.tabSteps[this.tabStepsIndex++] = [ {} ,'On va créer un tableau contenant tous les caracètres différents dans le motif, et y associer une valeur de décalage' ,-1];

  let lst = {'<i class="fa fa-times" aria-hidden="true"></i>' : this.motif.length};

  let ccc = Object.assign({}, lst);
  this.tabSteps[this.tabStepsIndex++] = [ ccc ,'Les caractères n\'y figurant pas prennent en valeur la longueur de motif, ainsi  <i class="fa fa-times" aria-hidden="true"></i>  représente un caractère ne figurant pas dans ' + this.motif ,-1];

  if(this.caseSensitive){
    for(let k = 0; k < this.motif.length;k++){
      let rrr = Math.max(this.motif.length - 1 - k,1);
      if(lst[this.motif[k]] == null){
        //Première rencontre
        lst[this.motif[k]] = rrr;
        let clone = Object.assign({}, lst);
        this.tabSteps[this.tabStepsIndex++] = [ clone ,'On rencontre le caractère ' + this.motif[k] + ' , on met donc la valeur à Max(1,' + this.motif.length + ' - 1 - ' + k +')'+ ' = ' + rrr,k];
      }else{
        lst[this.motif[k]] = rrr;
        let clone = Object.assign({}, lst);
        this.tabSteps[this.tabStepsIndex++] = [ clone ,'On met à jour le caractère ' + this.motif[k] + ' , on met donc la valeur à Max(1,' + this.motif.length + ' - 1 - ' + k +')'+ ' = ' + rrr,k];
      }
    }

  }else{
    for(let k = 0; k < this.motif.length;k++){
     let rrr = Math.max(this.motif.length - 1 - k,1);
     if(lst[this.motif[k].toLowerCase()] == null){
        //Première rencontre
        lst[this.motif[k].toLowerCase()] = rrr;
        let clone = Object.assign({}, lst);
        this.tabSteps[this.tabStepsIndex++] = [ clone ,'On rencontre le caractère ' + this.motif[k] + ' , on met donc la valeur à Max(1,' + this.motif.length + ' - 1 - ' + k +')'+ ' = ' + rrr + '',k];
      }else{
        lst[this.motif[k].toLowerCase()] = rrr;
        let clone = Object.assign({}, lst);
        this.tabSteps[this.tabStepsIndex++] = [ clone ,'On met à jour le caractère ' + this.motif[k] + ' , on met donc la valeur à Max(1,' + this.motif.length + ' - 1 - ' + k +')'+ ' = ' + rrr + '',k];
      }
    }

  }






},

checkLastTabVal(letter, value){
  if(this.caseSensitive){
   return this.lastTab[letter.charCodeAt(0)] == value;
 }else{
  return this.lastTab[letter.toLowerCase().charCodeAt(0)] == value;
}
},

makeLastTab(){
  this.lastTab = new Array(256);

  for (let i = 0; i < this.lastTab.length; i++) {
   this.lastTab[i] = -1;
 }

 for (let i = 0; i < this.motif.length; i++) {
  if(this.checkLastTabVal(this.motif[i],-1)){
          //Première rencontre
          this.lastTab[this.motif[i].charCodeAt(0)] = Math.max(this.motif.length - 1 - i,1);
        }else{
          //Seconde rencontre
          this.lastTab[this.motif[i].charCodeAt(0)] = Math.max(this.motif.length - 1 - i,1);
        }
      }

      for (let i = 0; i < this.lastTab.length; i++) {
       if(this.lastTab[i] == -1){
         this.lastTab[i] = this.motif.length;
       }
     }

   },




   last(letter){
    if(this.caseSensitive){
      return this.lastTab[letter.charCodeAt(0)];
    }else{
      return this.lastTab[letter.toLowerCase().charCodeAt(0)];
    }
  },


  find(){
    let t1 = performance.now();
    if (this.motif.length === 0) {
      return 0;
    }



    let m = this.motif.length;
    let n = this.texte.length;

    let i = 0;
    let j = m - 1;

    this.makeLastTab();

    let arr = [];
    for (let w = 0; w < this.lastTab.length; w++) {
      if(this.lastTab[w] != this.motif.length)
        arr[String.fromCharCode(w)] = this.lastTab[w];
    }

    while(i <= n - m){
     if(this.compareChar(this.motif[j],this.texte[i+j])){

      if(j == 0){
        this.results.push(i+j);
        this.steps[this.steps_index++] = [0,i,j,this.last(this.texte[i+j])];
        i += Math.min(j+1,this.last(this.texte[i+j]));
        j = m-1;
      }else{
        this.steps[this.steps_index++] = [1,i,j,this.last(this.texte[i+j])];
        j--;
      }
    }else{
      this.steps[this.steps_index++] = [2,i,j,this.last(this.texte[i+j])];
      i += Math.min(j+1,this.last(this.texte[i+j]));
      j = m - 1;
    }
  }

  this.tempsBM = performance.now()-t1;


},

compareChar(a,b){
  this.nbCompBM++;

 if(this.caseSensitive){
  return a == b;
}else{
  return a.toLowerCase() == b.toLowerCase();
}
},

sleep(ms) {
  let start = new Date().getTime(), expire = start + ms;
  while (new Date().getTime() < expire) { }
    return;
},


visuComplete(){

  console.log(this.tabSteps);

  if(this.motif.length > this.texte.length){
    this.errors += "Le motif ne peut pas être plus grand que la texte !";
    return;
  }


  this.nextStepFromMain();
},
nextStepUsingPhase(){

  if(this.motif.length > this.texte.length){
    this.errors = "Le motif ne peut pas être plus grand que la texte !";
    return;
  }


  if(this.tabSteps.length == 0){
    this.fillTabPhaseTab();
  }

  if(this.phase == 0){
    this.nextStepTab();
  }else if (this.phase == 1){
    console.log(this.temps);
    this.nextStep();
  }else if(this.phase == 2){

  }


},
nextStepTab(){


  if(this.userTabStepsIndex >= this.tabSteps.length){
    this.phase = 1;
    return;
  }

  let t = "<table class='table table-bordered' style='max-width: 25%; margin: 0 auto;'> <tr> ";
  let ts = this.tabSteps[this.userTabStepsIndex];

  let l = ts[0];
  let ex = ts[1];
  let pc = ts[2];


  let mm = "";
  if(pc >= 0){
   for (let i = 0; i < pc; i++) {
    mm += this.motif[i];
  }
  mm+= "<span style='background-color: aqua'>"+this.motif[pc]+"</span>";
  for (let i = pc+1; i < this.motif.length; i++) {
    mm += this.motif[i];
  }
}else{
  mm = this.motif;
}


this.tableauMotifHelper = mm;


let t1 = "";
let t2 = "";

for (let key in l) {
  let value = l[key];
  if(pc >= 0 && this.compareChar(key,this.motif[pc])){
    t1 += "<th style='background-color: aqua;'   >"+key+"</th>";
    t2 += "<td style= 'background-color: aqua;'  >"+value+"</td>";
  }else if(pc >= 0 && key == '<i class="fa fa-times" aria-hidden="true"></i>'){
    t1 += "<th>"+key+"</th>";
    t2 += "<td>"+value+"</td>";
  }else{
   t1 += "<th>"+key+"</th>";
   t2 += "<td>"+value+"</td>";
 }

}

t += t1;
t+= "</tr><tr>";
t+= t2;
t+= "</tr></table>";


this.tableau = t;
this.tableauExplications = ex;

this.userTabStepsIndex++;


},

nextStepFromMain(){

  if(this.resetTimer){
    clearTimeout(this.timer);
    this.resetTimer = false;
  }else{
    this.nextStepUsingPhase();
    this.timer = setTimeout(() => this.nextStepFromMain(), ((this.sliderValue-1)/(100-1) * (0-1000) + 1000));
  }
  
},

generateTimes(){

  for (let i = 0; i < 1000000; i+=1000) {
    this.reset();

    this.motif = "tains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they li";
    let rep = "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar. The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksg";
    this.texte = "";

    for (let k = 0; k<(i/1000); k++) {
      this.texte += rep;
    }

    //this.findNaif();
    this.find();

    console.log(i + ";" + this.nbCompBM);
    this.nbCompBM = 0;
  }
},

premierCasSuffixeTable(){
  let  m = this.motif.length;
  let i = m;
  let j = m+1;

  this.bpos[i] = j;

  while(i > 0){
    while (j <= m && this.motif[i-1] != this.motif[j-1]){
      if(this.shift[j] == 0){
          this.shift[j] = j - i;
      }

      j = this.bpos[j];
    }

    i--;
    j--;
    this.bpos[i] = j;
  }
},

deuxiemeCasSuffixeTable(){
  let i, j;
  j = this.bpos[0];
  for(i = 0;i <= m; i++){
    if(this.shift[i] == 0){
      this.shift[i] = j;
    }
    if(i == j){
      j = this.bpos[j];
    }
  }
},

findNaif(){

  let t1 = performance.now();
  let arr = [];
  let pos = 0;
  let cpt = 0;

  for (let i = 0; i < this.texte.length - this.motif.length; i++) {
      let j;
      for(j = 0; j < this.motif.length; j++){
        if(this.motif[j] != this.texte[i+j]){
          break;
        }
        this.nbCompNAIF++;
      }
      if(j == this.motif.length){
        arr[pos++] = i-this.motif.length;
      }
       this.nbCompNAIF++;
  }


  this.tempsNAIF = performance.now()-t1;


}



}
};
</script>
