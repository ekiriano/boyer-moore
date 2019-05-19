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
      steps_index: 0,
      userIndex: 0,
      steps: [],
      calledBySteps: 0,
      explications: ""
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
      this.steps_index = 0;
      this.steps = [];
      this.printtxt = "";
      this.userIndex = 0;
      this.calledBySteps = 0;
      this.explications = "";

      // new impl
      this.tableDecalage = [];
      this.tableChar = [];
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

        console.log(
          "J arrivé de " + (l_motif - 1) + " à " + j + " -- SHIFT : " + shift
        );
        this.steps[this.steps_index++] = [j, shift];

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

    visuNextStep() {
      this.nextStep();
    },

    visuComplete() {
      this.nextStep();
      while (this.userIndex <= this.steps.length - 1) {
        this.sleep(750);
        this.visuNextStep();
        console.log("called");
      }
    },
    // NEW VERSION OF IMPLEMENTATION BELOW
    /*
     *  Retourne l'index dans cette chaîne de la première occurrence de la sous-chaîne spécifiée. Si ce n'est pas une sous-chaîne, retourne -1.
     * */
    indexOf() {
      if (this.motif.length === 0) {
        return 0;
      }
      this.constCharTable();
      this.constDecalageTable();
      for (var i = this.motif.length - 1, j; i < this.texte.length; ) {
        for (
          j = this.motif.length - 1;
          this.motif[j] == this.texte[i];
          --i, --j
        ) {
          if (j == 0) {
            return i;
          }
        }
        i += Math.max(
          this.tableDecalage[this.motif.length - 1 - j],
          this.tableChar[this.texte[i]]
        );
      }
    },
    /*
     * Crée la table de saut en fonction des informations de lettres(char) incompatibles.
     */
    constCharTable() {
      this.tableChar = new Array(256);
      for (var i = 0; i < this.tableChar.length; ++i) {
        this.tableChar[i] = this.motif.length;
      }
      for (var i = 0; i < this.motif.length - 1; ++i) {
        this.tableChar[this.motif[i]] = this.motif.length - 1 - i;
      }
    },
    constDecalageTable() {
      this.tableDecalage = new Array(this.motif.length);
      var lastPrefixPosition = this.motif.length;
      for (var i = this.motif.length; i > 0; --i) {
        if (isPrefix(this.motif, i)) {
          lastPrefixPosition = i;
        }
        table[this.motif.length - i] =
          lastPrefixPosition - i + this.motif.length;
      }
      for (var i = 0; i < this.motif.length - 1; ++i) {
        var slen = suffixLength(this.motif, i);
        table[slen] = this.motif.length - 1 - i + slen;
      }
    },
    /*
     * Motif [p: end] est-il un préfixe de motif?
     */
    estPrefixe(p) {
      for (var i = p, j = 0; i < this.motif.length; ++i, ++j) {
        if (this.motif[i] != this.motif[j]) {
          return false;
        }
      }
      return true;
    },
    /*
     * Retourne la longueur maximale de la sous-chaîne se termine à p et est un suffixe.
     */
    longeurSuffixe() {
      var len = 0;
      for (
        var i = p, j = this.motif.length - 1;
        i >= 0 && this.motif[i] == this.motif[j];
        --i, --j
      ) {
        len += 1;
      }
      return len;
    }
  }
};
</script>
