<template>
  <div>
    <div class="index">
      <h1>Tripoly</h1>
      <section class="five-row">
        <div class="text columns-two span-four">
          <p>
            We want to create a decentralized board-game on Tezos, toeducate
            people about renewable and sustainable projects ina playful and
            interactive way. We want to disrupt the game idea of Monopoly and
            turn itsvalues around, from capitalism and re-shape it for the
            futureof web3 to an open source knowledge game using theconventions
            and the features of the metaverse.
            <br />
            For this game, named Tripoly , we forget the bank, the loans,and the
            race to become rich #capitalism. We revisit theMonopoly's mechanism,
            we take inspiration from it to makethe project funny and
            interactive. Some of you may think about this other game :
            Anti-Monopoly. Let's say that Tripoly is the NFT's sibling of the
            Anti.
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
            <ul>
              <li>People can join the game</li>
              <li>Sync their profile to the game</li>
              <li>
                Roll the dice Step forward on the board game, clockwise, only on
                the edge of the board
              </li>
              <li>
                Once the player steps on a field, they have access to the
                content of thisfield.
              </li>
              <li>In Tripoly, each field is a sustainable project</li>
              <li>
                At this point, people discover the project and have different
                options ofsupporting it
              </li>
              <li>
                Each project has 3 levels of support: Research, Prototype,
                Start-up
              </li>
              <li>Each level of support has a different price</li>
              <li>
                Each project has its specific value based on how much the
                project needs tobe supported
              </li>
              <li>
                Player is shown the project which is saved at each position of
                the boardgame when rolling the dice and steping on each field
              </li>
              <li>
                Player supports the project by buying the NFT related to its
                position
              </li>
              <li>Player also receives Co2 balance certificates</li>
              <li>
                When the player keeps playing and goes over the start, they are
                rewarded by two bounties:
                <ul>
                  <li>Tezos liquidity</li>
                  <li>
                    Co2 saved balance: depending of how many projects player
                    supported, how many NFT bought
                  </li>
                  <li>
                    Player can leave and join the game as much as they want.
                  </li>
                </ul>
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
