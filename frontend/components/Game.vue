<template>
  <section class="game">
    <div class="game-wrapper">
      <div class="title">
        <h1>Game</h1>
        <div class="game-triggers">
          <button><p class="active">Sync</p></button>
          <button><p class="active">Join</p></button>
          <button><p>Leave</p></button>
        </div>
      </div>
      <div class="gaming-field">
        <div class="gamer-wrapper">
          <div class="gamer">
            <h3>{{ gameState.player.name }}</h3>
            <p>Current Position: {{ gameState.player.position }}</p>
            <p>Saved CO2 in kilo: {{ gameState.player.savedc02 }}</p>
            <p>Last dice roll: {{ gameState.player.last_dice_roll }}</p>
          </div>
        </div>
        <div class="board-wrapper">
          <p>sample</p>
        </div>
        <div class="other-players-wrapper">
          <div class="other-players">
            <h3>Other players</h3>
            <div v-for="(player, index) in gameState.otherPlayers" :key="index">
              <OtherPlayer :info="player" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="field-info">
      <p>Field 17</p>
    </div>
    <div class="company-info">
      <div class="project content five-row">
        <div class="company span-two-first">
          <h3>Title Company</h3>
          <p>
            For this game, named Tripoly, we forget the bank, the loans,and the
            race to become rich #capitalism. We revisit theMonopoly's mechanism,
            we take inspiration from it to makethe project funny and
            interactive. Some of you may think about this other game :
            Anti-Monopoly. Let's say that Tripoly is the NFT's sibling of
            theAnti.
          </p>
        </div>
        <div class="ar span-two-last">
          <h3>View object in AR</h3>
          <div class="qr-code">
            <img src="@/assets/img/sampleqr.png" alt="" />
            <p>iPhone</p>
          </div>
        </div>
      </div>
      <div class="content cta-text five-row">
        <h3 class="span-four">
          If you like the project and wish to contribute, please support it by
          buying the token.
        </h3>
      </div>
      <div class="content">
        <button>Support</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'GameComp',
  props: {},
  data() {
    return {
      params: {
        useSampleData: true,
      },
      gameState: {
        player: {
          name: '',
          savedc02: '',
          position: '',
          last_dice_roll: '',
          walletID: '',
          supportedGameFields: [],
        },
        otherPlayers: [],
      },
      sampleData: {
        player: {
          name: 'Marcel',
          savedc02: '200',
          position: 15,
          last_dice_roll: '2021-12-14T20:29:29Z',
          walletID: 'tz1dHDTd42M6s18vwcUyYfBydYpCHKChZ5ot',
          supportedGameFields: [],
        },
        otherPlayers: [
          {
            name: 'Player 1',
            savedc02: '200',
            position: 2,
            last_dice_roll: '2021-12-14T20:29:29Z',
            walletID: 'tz1dHDTd42M6s18vwcUyYfBydYpCHKChZ5ot',
            supportedGameFields: [],
          },
          {
            name: 'Player 2',
            savedc02: '150',
            position: 12,
            last_dice_roll: '2021-12-14T20:29:29Z',
            walletID: 'tz1dHDTd42M6s18vwcUyYfBydYpCHKChZ5ot',
            supportedGameFields: [],
          },
          {
            name: 'Player 3',
            savedc02: '550',
            position: 4,
            last_dice_roll: '2021-12-14T20:29:29Z',
            walletID: 'tz1dHDTd42M6s18vwcUyYfBydYpCHKChZ5ot',
            supportedGameFields: [],
          },
        ],
      },
    }
  },
  computed: {},
  mounted() {
    if (this.params.useSampleData) {
      this.useSampleData()
    }
  },
  created() {},
  methods: {
    useSampleData() {
      this.gameState.player = this.sampleData.player
      this.gameState.otherPlayers = this.sampleData.otherPlayers
    },
  },
}
</script>
