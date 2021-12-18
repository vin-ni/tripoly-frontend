<template>
  <div>
    <div class="index">
      <h1>Game</h1>
      <section class="five-row">
        <div class="text columns-two span-four">
          <p>
            Tripoly is a round based, decentralized and multiplayer board-game on the Tezos Blockchain. The aim of 
            this game is to educate about renewable and sustainable projects in a simple, playful and interactive way. 
            <br />
            <br />
            Some of you may know the Anti-Monopoly games. We love the idea of being Tripoly is another disruptive form 
            of Anti-monopoly. We turn the values game of Monopoly around and re-shape it for the future of web3 : from a 
            capitalistic dynamic to an open source knowledge game using the conventions and the features of the metaverse. 
            <br />
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
              The game interface of tripoly is a triangle composed of 18 triangular fields. In Tripoly, each field is a sustainable project. Each player advances through the game by rolling the dice. The players advance clockwise, only on the edge of the board
            </p>
            <p>
              Once a player steps on a field, they have access to the content of this field.
              As a player, you are are shown the project which is saved at each position 
              At this point, you can discover the project and have different options to support the project.
              Each project has 3 levels of support : Research, Prototype, Start-up
              You can support the project by buying the NFT related to and also receive a CO2 balance certificate.
            </p>
            <p>
              Keep playing and going over the start, players are rewarded by two bounties : 
            </p>
             <ul>
                <li>
                  Tezos (1 tz) 
                </li>
                <li>
                  CO2 saved balance
                </li>
              </ul>
              <br />
            <p>
              NFTs : 
              In Tripoly, the NFTs that players acquire have been designed to be interactive and fun. You can play, manipulate and admire your NFT anywhere and at any time. 

              There is a token on each field which contains an augmented reality world. A different way of owning an NFT that bridges the gap between the real world and the metaverse.
              
              CO2 Balance Certificate : 
              Each project contributes to optimizing consumption and living patterns and tends to help reduce the carbon footprint. 
            </p>
            <br />
            <p>
              The more you support a project, the more you contribute to reducing the carbon footprint. Each contribution made by the players represents a different carbon footprint saving. 
            </p>
            <p>
              The CO2 balance is calculated at each round based on how many projects you support as a player and how many NFT you bought. 
            </p>
            <p>
              INSTALLATION : 
            </p>
             <ul>
                <li>
                  Set up your profile and personal wallet on a dedicated platform (Temple Wallet, Kukai etc) (link to how to settle your wallet) 
                </li>
                <li>
                  Sync your wallet to the game by clicking on “sync”.
                </li>
                <li>
                  Join the game to be listed as a player and be able to roll the dice
                </li>
              </ul>
              <br />
            <p>
              COURSE OF A TOUR
            </p>
            <ul>
                <li>
                  You roll the dice
                </li>
                <li>
                  Your playing figure advances depending of the dice’s number
                </li>
                <li>
                  The NFT shows you which project you have
                </li>
                <li>
                  Read the NFT description below
                </li>
                <li>
                  You can join the AR world by scanning the QR code with your iOS phone/tablet
                </li>
                <li>
                  You can support the project by clicking on the “support” button
                </li>
              </ul>
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
