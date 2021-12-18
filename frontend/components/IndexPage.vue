<template>
  <div>
    <div class="index">
      <h1>Tripoly</h1>
      <section class="five-row">
        <div class="text columns-two span-four">
          <p>
            Tripoly is a round based, decentralized and multiplayer board-game on the Tezos Blockchain. The aim of 
            this game is to educate about renewable and sustainable projects in a simple, playful and interactive way. 
            <br />
            Some of you may know the Anti-Monopoly games. We love the idea of being Tripoly is another disruptive form 
            of Anti-monopoly. We turn the values game of Monopoly around and re-shape it for the future of web3 : from a 
            capitalistic dynamic to an open source knowledge game using the conventions and the features of the metaverse. 
            <br />
            Are you ready? 
          </p>
        </div>
      </section>
      <hr />
      <div
        class="toggle-howto"
        @click="frontend.howToToggle = !frontend.howToToggle"
      >
        <h2>How to play</h2>
        <img
          class="toggle-arrow"
          :class="{ rotated: frontend.howToToggle }"
          src="~/assets/img/dropdown.svg"
          alt="toggle arrow"
        />
      </div>
      <VueSlideToggle
        :open="frontend.howToToggle"
        tag="section"
        :duration="500"
      >
        <section class="five-row">
          <div class="text columns-two span-four">
            <p>
              The game interface is an equilateral triangle, Composed of 18
              juxtaposed triangular fields. The game is organized as follows:
            </p>
          </div>
        </section>
      </VueSlideToggle>
      <hr />
    </div>
    <Game />
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  props: {},
  data() {
    return {
      frontend: {
        howToToggle: false,
      },
    }
  },
  computed: {},
  mounted() {},
  created() {},
  methods: {},
}
</script>
