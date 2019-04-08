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
      texte : ""
    }
  },
  methods : {
    pretraite(texte){

    },
    visualize(){

    },
    nextStep(){

    },
    reset(){
      this.texte = "";
      this.motif = "";
    }
  },
}
</script>
