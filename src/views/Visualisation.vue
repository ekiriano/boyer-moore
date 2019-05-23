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
<button class="btn btn-success mr-1" @click="nextStep">
Etape Par Etape
<i class="fas fa-forward"></i>
</button>
<button class="btn btn-danger mr-1" @click="reset">
Reset
<i class="fas fa-undo"></i>
</button>
</div>
<div>
<div>
<h1 style="  font-family: monospace; ">{{this.texte}}</h1>
</div>
<br>
<div style="margin-top : -40px" v-html="printtxt" id="fillMe"></div>
</div>
 
<div v-html="explications"></div>
</div>
</template>
 
<script>
// @ is an alias to /src
 
export default {
  name: "home",
  components: {},
 
  data() {
    return {
      motif: "",
      texte: "",
 
      index: -1,
      steps_index: 0,
      userIndex: 0,
      steps: [],
      calledBySteps: 0,
      results : [],
      resultsIndex : 0,
 
 
      tabSteps : [],
      tabStepsIndex : 0,
      printtxt : "",
      explications: "",
      lastTab : [],
      phase : 0,
      calledOnce : false,
      timer : null,
      resetTimer : false,
    };
  },
  methods: {
    visualize() {},
    nextStep() {
 
      console.log('zutto--');
      if(!this.calledOnce){
        this.calledOnce = true;
        this.find();
        console.log('zutto--3');
      }
      console.log('zutto--2');
      if(this.userIndex >= this.steps.length){
        clearTimeout(this.timer);
        this.resetTimer = true;
        console.log('zutto--4');
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
        newText += "<span style='color: green'>" + this.motif + "</span>";
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
        newText += "<span style='color: green'>";
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
      newText += "<span style='color: red'>" + this.motif[j] + "</span>";
      newText += "<span style='color: green'>";
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
 
  this.index= -1;
  this.steps_index= 0;
  this.userIndex= 0;
  this.steps= [];
  this.calledBySteps= 0;
  this.results = [];
  this.resultsIndex = 0;
 
 
  this.tabSteps = [];
  this.tabStepsIndex = 0;
  this.printtxt = "";
  this.explications= "";
  this.lastTab = [];
  this.phase = 0;
  this.calledOnce = false;
},
 
halfReset() {
  this.index = -1;
},
 
 
    // NEW VERSION OF IMPLEMENTATION BELOW
    /*
     *  Retourne l'index dans cette chaîne de la première occurrence de la sous-chaîne spécifiée. Si ce n'est pas une sous-chaîne, retourne -1.
     * */
 
     fillTabPhaseTab(){
 
      //this.tabSteps.push('<th>*</th>', '<td>'+this.motif.length+'</td>', 'Tous les caractères n\'étant pas présents dans motif ont une valeur de ' + this.motif.length + ' dans ce tableau');
 
 
    },
 
    makeLastTab(){
      this.lastTab = new Array(256);
 
      for (let i = 0; i < this.lastTab.length; i++) {
       this.lastTab[i] = -1;
     }
 
     for (let i = 0; i < this.motif.length; i++) {
      if(this.lastTab[this.motif[i].charCodeAt(0)] == -1){
          //Première rencontre
          this.lastTab[this.motif[i].charCodeAt(0)] = Math.max(this.motif.length - 1 - i,1);
 
           //this.tabSteps.push('<th>*</th>', '<td>'+this.motif.length+'</td>', 'Tous les caractères n\'étant pas présents dans motif ont une valeur de ' + this.motif.length + ' dans ce tableau');
 
 
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
    return this.lastTab[letter.charCodeAt(0)];
  },
 
  find(){
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
 
    console.log(arr);
 
    while(i <= n - m){
     if(this.motif[j] == this.texte[i+j]){
      if(j == 0){
        console.log(i+j);
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
},
sleep(ms) {
  let start = new Date().getTime(), expire = start + ms;
  while (new Date().getTime() < expire) { }
    return;
},
 
 
visuComplete(){
 
 
 
  this.nextStepFromMain();
 
},
 
nextStepFromMain(){
 
  if(this.resetTimer){
    clearTimeout(this.timer);
    this.resetTimer = false;
  }else{
    this.nextStep();
    this.timer = setTimeout(() => this.nextStepFromMain(), 500);
  }
 
}
 
}
};
</script>
