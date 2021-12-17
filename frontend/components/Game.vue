<template>
  <section class="game">
    <div class="game-wrapper">
      <div class="title">
        <h1>Game</h1>
        <div class="game-triggers">
          <button @click="sync()">
            <p>Sync</p>
          </button>
          <button :disabled="!wallet.connected" @click="join()">
            <p>Join</p>
          </button>
          <button :disabled="!wallet.connected" @click="leave()">
            <!-- <button :disabled="!gameState.gameJoined" @click="leave()"> -->
            <p>Leave</p>
          </button>
          <button :disabled="!wallet.connected" @click="clock()">
            <!-- <button :disabled="!gameState.gameJoined" @click="leave()"> -->
            <p>Clock</p>
          </button>
        </div>
      </div>
      <div class="gaming-field">
        <div class="gamer-wrapper">
          <div class="gamer">
            <h3>{{ gameState.player.name }}</h3>
            <p>Current Position: {{ gameState.player.position }}</p>
            <p>Saved CO2 in kilo: {{ gameState.player.savedc02 }}</p>
            <p>Last dice roll: {{ gameState.player.last_dice_roll }}</p>
            <button @click="increasePlayerPosition(1)">
              Next Field Animation
            </button>
          </div>
        </div>
        <div class="board-wrapper">
          <div class="board-outer">
            <img
              ref="boardgame"
              src="@/assets/img/gamefield.svg"
              alt="game field"
            />
            <div class="board-players">
              <div ref="player" class="player"></div>
            </div>
          </div>
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
      <div class="dice-wrapper">
        <img ref="dice" src="/1.png" alt="" />
        <button :disabled="gameState.blockDice" @click="roll()">
          <p>Roll Dice</p>
        </button>
      </div>
      <div v-if="wallet.connected" class="connected-account">
        <p>
          Active Account: {{ wallet.address }} {{ wallet.networkType }}
          {{ wallet.originType }}
        </p>
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
import { gsap, Power4 } from 'gsap'
import { DiceRoller } from 'vue-dice-roller'
import gamefielddata from '@/assets/js/gamefielddata.json'

export default {
  name: 'GameComp',
  // eslint-disable-next-line vue/no-unused-components
  components: { DiceRoller },
  props: {},
  data() {
    return {
      client: null,
      params: {
        useSampleData: true,
        contract: 'KT1PZNb78PUiDRXmFGXPEyGaiocpk623CkEJ',
        gamefielddata,
      },
      wallet: {
        connected: false,
        address: '',
        networkType: '',
        originType: '',
      },
      gameState: {
        gameJoined: false,
        blockDice: true,
        diceValue: 0,
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
  head: {
    script: [
      {
        src: '/js/walletbeacon.min.js',
      },
    ],
  },
  computed: {},
  mounted() {
    if (this.params.useSampleData) {
      this.useSampleData()
    }

    this.resetData()
    this.setUpBeaconClient()
  },
  created() {},
  methods: {
    useSampleData() {
      // this.gameState.player = this.sampleData.player
      this.gameState.otherPlayers = this.sampleData.otherPlayers
    },

    resetData() {
      this.gameState.player.position = 0
      this.movePlayerToCurrentField()
    },

    movePlayerToCurrentField() {
      const currentPosition = this.gameState.player.position

      // calculate coordinates
      const coordinates = this.params.gamefielddata.positions[currentPosition]
      const offset = this.$refs.player.offsetWidth / 2
      const divisor = this.params.gamefielddata.divisor
      const gameSize = this.$refs.boardgame.offsetWidth

      const newCoordinates = {
        x: (parseInt(coordinates.x) / divisor) * gameSize - offset,
        y: (parseInt(coordinates.y) / divisor) * gameSize - offset,
      }

      this.movePlayerToPosition(this.$refs.player, newCoordinates)
    },

    // movePlayerToNextField() {
    //   const positions = Object.keys(this.params.gamefielddata.positions).length

    //   let newPosition = this.gameState.player.position + 1
    //   if (newPosition >= positions) {
    //     newPosition = newPosition - positions
    //   }
    //   this.gameState.player.position = newPosition

    //   // calculate coordinates
    //   const coordinates = this.params.gamefielddata.positions[newPosition]
    //   const offset = this.$refs.player.offsetWidth / 2
    //   const divisor = this.params.gamefielddata.divisor
    //   const gameSize = this.$refs.boardgame.offsetWidth

    //   const newCoordinates = {
    //     x: (parseInt(coordinates.x) / divisor) * gameSize - offset,
    //     y: (parseInt(coordinates.y) / divisor) * gameSize - offset,
    //   }

    //   this.movePlayerToPosition(this.$refs.player, newCoordinates)
    // },

    increasePlayerPosition(diceValue) {
      const positions = Object.keys(this.params.gamefielddata.positions).length

      let newPosition = this.gameState.player.position + diceValue
      if (newPosition >= positions) {
        newPosition = newPosition - positions
      }
      this.gameState.player.position = newPosition

      // calculate coordinates
      const coordinates = this.params.gamefielddata.positions[newPosition]
      const offset = this.$refs.player.offsetWidth / 2
      const divisor = this.params.gamefielddata.divisor
      const gameSize = this.$refs.boardgame.offsetWidth

      const newCoordinates = {
        x: (parseInt(coordinates.x) / divisor) * gameSize - offset,
        y: (parseInt(coordinates.y) / divisor) * gameSize - offset,
      }

      this.movePlayerToPosition(this.$refs.player, newCoordinates)
    },

    movePlayerToPosition(player, position) {
      gsap.to(player, {
        duration: 0.4,
        x: position.x,
        y: position.y,
        ease: Power4.easeInOut,
        onComplete: () => {
          player.style.opacity = 1
        },
      })
    },

    roll() {
      this.gameState.blockDice = true

      const number = Math.floor(Math.random() * 6) + 1
      const newUrl = `${number}.png`

      this.gameState.player.diceValue = number

      gsap.to(this.$refs.dice, {
        duration: 2,
        rotation: '+=720',
        transformOrigin: 'center center',
        ease: Power4.easeInOut,
        onComplete: () => {
          this.gameState.blockDice = false
          this.logDice()
        },
      })

      gsap.to(this.$refs.dice, {
        duration: 1,
        onComplete: () => {
          this.$refs.dice.src = newUrl
        },
      })
    },

    // Marcel's codes
    setUpBeaconClient() {
      window.beaconSdkDebugEnabled = true

      // eslint-disable-next-line no-undef
      if (beacon && this.client === null) {
        // var addr = 'empty'
        // Initiate DAppClient
        // eslint-disable-next-line no-undef
        this.client = new beacon.DAppClient({
          name: 'Tripoly TzConnect Hackathon', // Name of the DApp,
          disclaimerText: 'This is an optional <b>disclaimer</b>.',
        })
        console.log('created client')
      } else if (this.client === null) {
        setTimeout(() => {
          console.log('waiting for beacon to load')
          this.setUpBeaconClient()
        }, 100)
      }
    },

    // used to be RequestPermisson
    sync(callback) {
      this.client
        .requestPermissions({
          network: {
            // eslint-disable-next-line no-undef
            type: beacon.NetworkType.HANGZHOUNET,
            name: 'hangzhounet',
            rpcUrl: 'https://rpc.hangzhounet.teztnets.xyz',
          },
        })
        .then((permissions) => {
          console.log('permissions', permissions)
          if (callback) {
            callback(permissions)
          }
          this.updateActiveAccount()
        })
        .catch((error) => {
          console.log('error during permission request', error)
        })
    },

    updateActiveAccount() {
      this.client.getActiveAccount().then((activeAccount) => {
        if (activeAccount) {
          this.gameState.blockDice = false
          this.wallet.address = activeAccount.address
          this.wallet.networkType = activeAccount.network.type
          this.wallet.originType = activeAccount.origin.type
          this.wallet.connected = true
        } else {
          this.wallet.address = ''
          this.wallet.networkType = ''
          this.wallet.originType = ''
          this.wallet.connected = false
        }
      })
    },

    async join() {
      const { value: name } = await this.$swal.fire({
        title: "What's your name?",
        input: 'text',
        confirmButtonColor: '#2ba5eb',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write something!'
          }
        },
      })

      if (name) {
        this.gameState.player.name = name
        // this.$swal.fire(`Your IP address is ${name}`)

        this.client
          .requestOperation({
            operationDetails: [
              {
                // eslint-disable-next-line no-undef
                kind: beacon.TezosOperationType.TRANSACTION,
                amount: '0',
                destination: this.params.contract,
                parameters: {
                  entrypoint: 'join',
                  value: {
                    string: name, // should be entered via UI
                  },
                },
              },
            ],
          })
          .then((response) => {
            console.log(response)
            this.gameState.gameJoined = true
          })
          .catch((error) => console.log(error))
      }
    },

    leave() {
      this.client
        .requestOperation({
          operationDetails: [
            {
              // eslint-disable-next-line no-undef
              kind: beacon.TezosOperationType.TRANSACTION,
              amount: '0',
              destination: this.params.contract,
              parameters: {
                entrypoint: 'leave',
                value: {
                  prim: 'Unit',
                },
              },
            },
          ],
        })
        .then((response) => {
          console.log(response)
          this.gameState.gameJoined = false
        })
        .catch((error) => console.log(error))
    },

    logDice() {
      console.log(this.gameState.player.diceValue)

      // send player to new position
      this.increasePlayerPosition(this.gameState.player.diceValue)

      this.client
        .requestOperation({
          operationDetails: [
            {
              // eslint-disable-next-line no-undef
              kind: beacon.TezosOperationType.TRANSACTION,
              amount: '0',
              destination: this.params.contract,
              parameters: {
                entrypoint: 'dice',
                value: {
                  int: '' + this.gameState.player.diceValue + '',
                },
              },
            },
          ],
        })
        .then((response) => console.log(response))
        .catch((error) => console.log(error))
    },

    clock() {
      console.log('clock')
      this.client
        .requestOperation({
          operationDetails: [
            {
              // eslint-disable-next-line no-undef
              kind: beacon.TezosOperationType.TRANSACTION,
              amount: '0',
              destination: this.params.contract,
              parameters: {
                entrypoint: 'clock',
                value: {
                  prim: 'Unit',
                },
              },
            },
          ],
        })
        .then((response) => {
          console.log(response)
        })
        .catch((error) => console.log(error))
    },
  },
}
</script>
