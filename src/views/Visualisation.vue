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
      printtxt: "",
      index: -1,
      localTab: [],
      shiftTab: [],
      borderTab: [],
      tab: [],
      steps_index : 0,
      userIndex : 0,
      steps : [],
      calledBySteps : 0,
      explications : "",
    };
  },
  methods: {
    sleep(ms) {
      let start = new Date().getTime(), expire = start + ms;
      while (new Date().getTime() < expire) { }
        return;
    },
    setMotifView(txt){
      document.getElementById('fillMe').innerHTML = txt;
    },
    visualize() {},
    nextStep() {
      if(this.calledBySteps == 0){
        this.main();
        this.calledBySteps = 1;
      }

      if(this.userIndex >= this.steps.length)
        return;

      let newText = "<h1  style='font-family: monospace;'>";

      let sft =  this.steps[this.userIndex][1];
      //Shift
      for (let i = 0; i < sft; i++) {
        newText += '_';
      }
      //Mot en noir, pas selectionné
      newText += this.motif.substring(0, this.steps[this.userIndex][0]+1);
      newText += "<span style='color: red'>";
      newText += this.motif.substring( this.steps[this.userIndex][0] == -1 ? 0 : this.steps[this.userIndex][0]+1, this.motif.length);
      newText += "</span>";

      for (let i = sft+this.motif.length; i < this.texte.length; i++) {
        newText += '_';
      }

      newText += "</h1>";


      this.printtxt = newText;


      this.explications = "";

      let pos_end = this.steps[this.userIndex][0];
      console.log(this.shiftTab);
      let sfttab  = { ...this.shiftTab };
      console.log(sfttab);
      if(pos_end == -1){
        this.explications += "| On a trouvé une occurence du motif à la position " + sft + " | <br>";
        this.explications += " | La table du shift sur la lettre " + this.motif[pos_end+1] +" vaut " +  this.borderTab[pos_end+1] + ", donc on shift de ce nombe vers la droite | <br>";
      }else{
        this.explications += "| On a un suffixe correct de taille " + (this.motif.length - (pos_end + 1)) + " | <br>";
        this.explications += " | La table du shift sur la lettre " + this.motif[pos_end] +" vaut " +  (this.shiftTab[pos_end+1]) + ", donc on shift de ce nombe vers la droite | <br>";
      }





      if(this.steps.length-1 > this.userIndex){

      }else{
       this.explications += "| On est arrivé à la fin du texte | <br>";
     }

     this.userIndex++;

     

   },
   reset() {
    this.texte = "";
    this.motif = "";
    this.index = -1;
    this.localTab = [];
    this.shiftTab = [];
    this.borderTab = [];
    this.tab = [];
    this.steps_index = 0;
    this.steps = [];
    this.printtxt = "";
    this.userIndex = 0;
    this.calledBySteps = 0;
    this.explications = "";
  },
  halfReset() {
    this.index = -1;
    this.localTab = [];
    this.shiftTab = [];
    this.borderTab = [];
    this.tab = [];
  },

  matchCompletSuffixe() {
    var n = this.motif.length;
    var i = n;
    var j = n + 1;
    this.borderTab[i] = j;
    while (i > 0) {
      while (j <= n && this.motif[i - 1] !== this.motif[j - 1]) {
        if (this.shiftTab[j] === 0) this.shiftTab[j] = j - i;
        j = this.borderTab[j];
      }
      i--;
      j--;
      this.borderTab[i] = j;
    }
  },

  matchSuffixePartiel() {
    var n = this.motif.length;
    var j;
    j = this.borderTab[0];
    for (var i = 0; i < n; i++) {
      if (this.shiftTab[i] === 0) {
        this.shiftTab[i] = j;
      }
      if (i === j) {
        j = this.borderTab[j];
      }
    }
  },

  rechercheMotif() {
    var l_motif = this.motif.length;
    var l_texte = this.texte.length;
    this.borderTab[l_motif + 1];
    this.shiftTab[l_motif + 1];

    for (var i = 0; i <= l_motif; i++) {
      this.shiftTab[i] = 0;
    }

    this.matchCompletSuffixe();
    this.matchSuffixePartiel();

      /*
      console.log("-----------SHIFT :" + shift+"-------------");
      console.log("BORDER TABLE : ");
      console.log(this.borderTab.slice(0));
      console.log("SHIFT TABLE : ");
      console.log(this.shiftTab.slice(0));
      */

      var shift = 0;
      
      while (shift <= l_texte - l_motif) {
        var j = l_motif - 1;
        while (j >= 0 && this.motif[j] === this.texte[shift + j]) {
          j--;
        }

        console.log("J arrivé de " + (l_motif-1) + " à " + j + " -- SHIFT : " + shift);
        this.steps[this.steps_index++] = [j,shift];

        if (j < 0) {
          this.index++;
          this.localTab[this.index] = shift;
          shift += this.shiftTab[0];
        } else {
          shift += this.shiftTab[j + 1];
        }
      }
    },

    main() {
      this.rechercheMotif();
      if (this.index === -1) {
        console.log("Motif non trouvé");
      } else {
        for (var i = 0; i <= this.index; i++) {
          console.log("Motif trouvé a la position " + this.localTab[i]);
        }
      }

      console.log(this.steps);
      //this.halfReset();
    },

    visuNextStep(){
       this.nextStep();
    },


    visuComplete(){
     this.nextStep();
     while(this.userIndex <= this.steps.length-1){
       this.sleep(750);
        this.visuNextStep();
       console.log("called");
     }
   },
 }
};
</script>
