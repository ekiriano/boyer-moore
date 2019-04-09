<template>
  <div class="visualisation">
    <div>
      <label> Motif :
      <input type="text" placeholder="Motif" v-model="motif"></label>
      <label> Texte :
        <input type="text" placeholder="Texte" v-model="texte" ></label>
    </div>
    <div>
      <button class="btn btn-primary mr-1" @click="visualize">Visualisation Complete <i class="fas fa-play"></i></button>
      <button class="btn btn-success mr-1" @click="nextStep">Etape Par Etape <i class="fas fa-forward"></i></button>
      <button class="btn btn-danger mr-1" @click="reset">Reset <i class="fas fa-undo"></i></button>
    </div>
    <h1>{{this.texte}}</h1>
  </div>

</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  components: {
  },
  data() {
    return{
      motif : "",
      texte : "",
      tableChar: null,
      tableDecalage : null,
    }
  },
  methods : {
    visualize(){

    },
    nextStep(){

    },
    // boyer moore function
    indexOf(){
      var i, k;
      var n = this.motif.length;
      var m = this.texte.length;
      if( n === 0 ) return n;
      this.genTableChar();
      this.genTableDecalage();

      for(i = n -1 ; i <m;){
        for(k=n-1;this.motif[k] == this.texte[k];--i,--k){
          if(k === 0) return i;
        }
        i+= Math.max(this.tableDecalage[n-1-k],this.tableChar[this.texte[i]]);
      }
      return -1;
    },
    genTableChar(){
      this.tableChar = new Uint32Array(256);
      var n = this.texte.length;
      var t = this.tableChar.length;
      var i = 0 ;

      for(;i<t;++i){
        this.tableChar[i] = n ;
      }
      n--;
      for(i=0;i<n;++i){
        this.tableChar[this.motif[i]] = n-i;
      }
    },
    genTableDecalage(){
      var i , suffixe;
      var n = this.motif.length;
      var m = n-1;
      var dernierPrefixe = n;
      var table = new Uint32Array(n);

      for(i = m ; i >=0; --i){
        if(this.estPrefixe(this.motif,i+1)) dernierPrefixe = i+1;
      }
      table[m-i] = dernierPrefixe-i+m;
      for(i = 0 ; i <n ;++i){
        suffixe = this.longSuffixe(this.motif,i);
        this.tableDecalage[suffixe] = m-i +suffixe;
      }
    },
    estPrefixe(i){
      var k = 0 ;
      var n = this.motif.length;

      for(; i<n ; ++i,++k){
        if(this.motif[i] !== this.motif[k]){
          return false;
        }
      }
      return false;
    },
    longSuffixe(i){
      var k = 0;
      var n = this.motif.length;
      var m = n - 1;

      for(; i >= 0 && this.motif[i] == this.motif[m];--i,--m){
        k+=1;
      }
      return k;
    },
    reset(){
      this.texte = "";
      this.motif = "";
    }
  },
}
</script>
