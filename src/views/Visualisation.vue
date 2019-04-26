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
      <button class="btn btn-primary mr-1" @click="main">
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
    <h1>{{this.texte}}</h1>
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
      localTab: [],
      shiftTab: [],
      borderTab: [],
      tab: []
    };
  },
  methods: {
    visualize() {},
    nextStep() {},
    reset() {
      this.texte = "";
      this.motif = "";
      this.index = -1;
      this.localTab = [];
      this.shiftTab = [];
      this.borderTab = [];
      this.tab = [];
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
      var shift = 0;
      while (shift <= l_texte - l_motif) {
        var j = l_motif - 1;
        while (j >= 0 && this.motif[j] === this.texte[shift + j]) {
          j--;
        }
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
      this.halfReset();
    }
  }
};
</script>
