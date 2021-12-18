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
      <div v-if="params.showDebugButtons">
        <button @click="increasePlayerPosition(1)">Walk to next field</button>
        <button @click="loadNFT()">Load NFT</button>
      </div>
      <div class="gaming-field">
        <div class="gamer-wrapper">
          <div
            v-if="wallet.connected && gameState.playerDataExistent"
            class="gamer"
          >
            <h3>{{ gameState.player.name }}</h3>
            <p>Current Position: {{ gameState.player.position }}</p>
            <p>Saved CO2 in kilo: {{ gameState.player.savedc02 }}</p>
            <p>Last dice roll: {{ gameState.player.last_dice_roll }}</p>
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
              <div
                ref="otherPlayerPieceWrapper"
                class="other-players-gamepiece-wrapper"
              >
                <div
                  v-for="(player, index) in gameState.otherPlayers"
                  :key="index"
                  class="otherPlayer"
                ></div>
              </div>

              <div ref="player" class="player"></div>
            </div>
          </div>
        </div>
        <div class="other-players-wrapper">
          <div v-if="storage" class="other-players">
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
    <div v-if="params.firstNftLoaded" class="field-info">
      <p>Field {{ gameState.player.position }}</p>
    </div>
    <div v-if="params.firstNftLoaded" class="company-info">
      <div v-if="params.nftLoaded">
        <div class="project content five-row">
          <div class="company span-two-first">
            <h3>{{ nft.name }}</h3>
            <p>
              {{ nft.description }}
            </p>
          </div>
          <div class="ar span-two-last">
            <h3>View object in AR</h3>
            <img
              ref="companyimg"
              class="companyimg"
              :src="nft.projectImgUrl"
              alt="company image or logo"
            />
            <div class="qr-code">
              <!-- <img src="@/assets/img/sampleqr.png" alt="" /> -->
              <qrcode-vue
                :value="nft.qrUrl"
                size="160"
                level="H"
                foreground="#2ba5eb"
              />
              <p>iPhone</p>
            </div>
          </div>
        </div>
        <div class="content cta-text five-row">
          <h3 v-if="!nft.alreadyBought" class="span-four">
            If you like the project and wish to contribute, please support it by
            buying the token.
          </h3>
          <h3 v-if="nft.alreadyBought" class="span-four">
            This project has already been supported. The current holder of the
            token is {{ nft.buyer }}.
          </h3>
        </div>
        <div v-if="!nft.alreadyBought" class="content">
          <button @click="support">Support</button>
        </div>
      </div>
      <div v-if="!params.nftLoaded" class="loading-placeholder">
        <p>loading project info <span>.</span><span>.</span><span>.</span></p>
      </div>
    </div>
  </section>
</template>

<script>
import { gsap, Power4 } from 'gsap'
import QrcodeVue from 'qrcode.vue'
import gamefielddata from '@/assets/js/gamefielddata.json'

export default {
  name: 'GameComp',
  // eslint-disable-next-line vue/no-unused-components
  components: { QrcodeVue },
  props: {},
  data() {
    return {
      storage: null,
      client: null,
      params: {
        showDebugButtons: true,
        useSampleData: true,
        contract: 'KT19hqf8T654T3sFxRJpsULTtimqyGYK7Lhk',
        gamefielddata,
        stateLoop: 10, // in seconds
        nftLoaded: false,
        firstNftLoaded: false,
      },
      wallet: {
        connected: false,
        address: '',
        networkType: '',
        originType: '',
      },
      nft: {
        name: '',
        description: '',
        arObj: {},
        projectImgUrl: '',
        qrUrl: '',
        alreadyBought: false,
        buyer: '',
      },
      gameState: {
        gameJoined: false,
        playerDataExistent: false,
        blockDice: true,
        dicePreviousValue: 0,
        diceValue: 0,
        player: {
          name: '',
          savedc02: '',
          position: 0,
          last_dice_roll: '',
          walletID: '',
          supportedGameFields: [],
        },
        otherPlayers: [],
        otherPlayersRaw: [],
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
    this.storageLoop()
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

      let newPosition =
        parseInt(this.gameState.player.position) + parseInt(diceValue)
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

      this.gameState.player.dicePreviousValue = parseInt(
        this.gameState.player.diceValue
      )
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

    async storageLoop() {
      const response = await fetch(
        'https://api.better-call.dev/v1/contract/hangzhou2net/' +
          this.params.contract +
          '/storage'
      )

      const obj = await response.json()
      const cleaned = obj[0].children
      this.storage = cleaned

      // update Player Data
      this.updateAllPlayerData()
      this.redrawPlayerData()

      setTimeout(() => {
        this.storageLoop()
      }, this.params.stateLoop * 1000)
    },

    putMainPlayerOnCorrectPosition() {
      const allPlayers = this.storage[1].children

      const myPlayerData = {}

      for (let i = 0; i < allPlayers.length; i++) {
        const player = allPlayers[i]

        if (player.name === this.wallet.address) {
          player.children.forEach((element) => {
            myPlayerData[element.name] = element.value
          })
        }
      }

      if (myPlayerData.name) {
        this.gameState.player.name = myPlayerData.name
        this.gameState.player.last_dice_roll = myPlayerData.last_dice_roll
        this.gameState.player.savedc02 = myPlayerData.saved_co2_kilos
        this.gameState.player.position = myPlayerData.position

        this.movePlayerToCurrentField()
        this.loadNFT()
      } else {
        console.log('no previous data')
        // still hide the user data if no name existant
        this.gameState.playerDataExistent = false
      }

      // lets update the frontend
      // console.log(myPlayerData)
    },

    calculateBuyerCurrentField() {
      if (this.storage) {
        // console.log('calculating buyer:')
        this.updateAllPlayerData()
        const nftGlobalData =
          this.storage[0]?.children[this.gameState.player.position]
        const nftObj = {
          name: nftGlobalData.name,
        }
        nftGlobalData.children.forEach((element) => {
          nftObj[element.name] = element.value
        })

        const tokenAddressCurrentField = nftObj.token_address

        let owner = false

        // now loop through all player data and check if anyone owns that token
        this.gameState.otherPlayersRaw.forEach((player) => {
          const supportedFields = player.supported_fields
          if (Array.isArray(supportedFields)) {
            supportedFields.forEach((supportedField) => {
              const token = supportedField.token_address
              if (token === tokenAddressCurrentField) {
                owner = player
              }
            })
          }
        })

        if (owner.name) {
          this.nft.buyer = `${owner.name} (${owner.address})`
        } else {
          this.nft.buyer = ''
        }

        // console.log(owner)

        // // console.log(this.storage)
        // console.log('----------------------')
      }
    },
    updateAllPlayerData() {
      if (this.storage) {
        const allPlayers = this.storage[1]
        // console.log(allPlayers)
        const cleanedChildren = []

        allPlayers.children.forEach((child) => {
          const obj = {
            address: child.name,
          }

          child.children.forEach((data) => {
            obj[data.name] = data.value

            // fix for supported_fields that has additinal children
            if (data.name === 'supported_fields' && data.children) {
              obj.supported_fields = []
              const supportedFields = data.children
              // console.log(data.children)
              supportedFields.forEach((sF) => {
                const sFobj = {}
                sF.children.forEach((child) => {
                  sFobj[child.name] = child.value
                })
                obj.supported_fields.push(sFobj)
              })
            }
          })

          cleanedChildren.push(obj)
        })

        this.gameState.otherPlayersRaw = cleanedChildren
        // console.log(this.gameState.otherPlayersRaw)
      }
    },

    redrawPlayerData() {
      const rawData = this.gameState.otherPlayersRaw
      console.log(rawData)

      const currentPlayers = []

      rawData.forEach((player) => {
        const playerFronendObj = {
          name: player.name,
          savedc02: player.saved_co2_kilos,
          position: player.position,
          last_dice_roll: player.last_dice_roll,
          walletID: player.address,
          // add supported fields later
        }

        const ownWalletId = this.wallet.address

        if (ownWalletId !== playerFronendObj.walletID) {
          currentPlayers.push(playerFronendObj)
        }
      })

      this.gameState.otherPlayers = currentPlayers

      this.setPositionOfOtherPlayers()
    },

    setPositionOfOtherPlayers() {
      this.$nextTick(() => {
        const pieces = this.$refs.otherPlayerPieceWrapper.childNodes

        for (let i = 0; i < this.gameState.otherPlayers.length; i++) {
          const player = this.gameState.otherPlayers[i]
          const position = player.position
          const div = pieces[i]

          // calculate coordinates
          const coordinates = this.params.gamefielddata.positions[position]
          const offset = this.$refs.player.offsetWidth / 2
          const divisor = this.params.gamefielddata.divisor
          const gameSize = this.$refs.boardgame.offsetWidth

          const newCoordinates = {
            x: (parseInt(coordinates.x) / divisor) * gameSize - offset,
            y: (parseInt(coordinates.y) / divisor) * gameSize - offset,
          }

          this.movePlayerToPosition(div, newCoordinates)
        }
      })
    },

    removePlayerData() {
      this.gameState.gameJoined = false
      this.gameState.playerDataExistent = false
      this.gameState.player.name = ''
      this.gameState.player.savedc02 = ''
      this.gameState.player.position = ''
      this.gameState.player.last_dice_roll = ''
      this.gameState.player.walletID = ''
      this.gameState.player.walletID = []
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
          console.log('passed active account')
          this.gameState.blockDice = false
          this.wallet.address = activeAccount.address
          this.wallet.networkType = activeAccount.network.type
          this.wallet.originType = activeAccount.origin.type
          this.wallet.connected = true
          this.gameState.playerDataExistent = true

          this.putMainPlayerOnCorrectPosition()
          this.updateAllPlayerData()
          this.redrawPlayerData()
        } else {
          console.log('passed passive account')
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
        this.gameState.playerDataExistent = true
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
          this.removePlayerData()
        })
        .catch((error) => console.log(error))
    },

    logDice() {
      console.log(this.gameState.player.diceValue)

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
        .then((response) => {
          // send player to new position
          this.increasePlayerPosition(this.gameState.player.diceValue)
          this.loadNFT()
          console.log(response)
        })
        .catch((error) => {
          this.gameState.player.diceValue =
            this.gameState.player.dicePreviousValue
          console.log(error)
        })
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

    support() {
      // get data
      // console.log(this.storage)
      if (this.storage) {
        const nftGlobalData =
          this.storage[0]?.children[this.gameState.player.position]

        const nftObj = {
          name: nftGlobalData.name,
        }

        nftGlobalData.children.forEach((element) => {
          nftObj[element.name] = element.value
        })
        // console.log(nftObj)

        const tokenPrice = nftObj.token_price

        this.client
          .requestOperation({
            operationDetails: [
              {
                // eslint-disable-next-line no-undef
                kind: beacon.TezosOperationType.TRANSACTION,
                amount: tokenPrice,
                destination: this.params.contract,
                parameters: {
                  entrypoint: 'support',
                  value: {
                    prim: 'Unit',
                  },
                },
              },
            ],
          })
          .then((response) => console.log(response))
          .catch((error) => console.log(error))
      }
    },

    async loadNFT() {
      // console.log('load nft')
      if (this.storage) {
        this.params.firstNftLoaded = true
        this.params.nftLoaded = false

        const nftGlobalData =
          this.storage[0]?.children[this.gameState.player.position]

        const nftObj = {
          name: nftGlobalData.name,
        }

        nftGlobalData.children.forEach((element) => {
          nftObj[element.name] = element.value
        })
        console.log('NFT Global Data:')
        console.log(nftObj)

        // check if still available and adapt interface
        const currentStock = parseInt(nftObj.current_stock)
        if (currentStock === 0) {
          this.nft.alreadyBought = true
          this.calculateBuyerCurrentField()
        } else {
          this.nft.alreadyBought = false
        }

        let nftMetaData = await fetch(
          'https://api.better-call.dev/v1/contract/hangzhou2net/' +
            nftObj.token_address +
            '/tokens'
        )
        nftMetaData = await nftMetaData.json()
        // const filteredNftMetaData = nftMetaData[nftMetaData.length - 1] there was a bug, we're trying to take the first for now
        const filteredNftMetaData = nftMetaData[0]

        console.log('NFT Filtered Meta Data:')
        console.log(filteredNftMetaData)

        this.nft.name = filteredNftMetaData?.name
        this.nft.description = filteredNftMetaData?.description
        // this.nft.arObj = filteredNftMetaData?.extras

        // return
        // // eslint-disable-next-line no-unreachable
        const arUrl = filteredNftMetaData?.extras['@@empty'].replace(
          'ipfs://',
          ''
        )

        let nftFileData = await fetch(`https://infura-ipfs.io/ipfs/${arUrl}/`)
        nftFileData = await nftFileData.json()

        console.log('NFT File Data:')
        console.log(nftFileData)
        const artifactUri = nftFileData.artifactUri.replace('ipfs://', '')

        // console.log(artifactUri)

        let nftSpecificData = await fetch(
          `https://infura-ipfs.io/ipfs/${artifactUri}/`
        )
        nftSpecificData = await nftSpecificData.json()

        console.log('NFT Image Data:')
        console.log(nftSpecificData)
        this.nft.arObj = nftSpecificData

        // getting the image url
        const nftImage = await fetch(
          `https://infura-ipfs.io/ipfs/${nftSpecificData.Image}/`
        )
        const nftImageUrl = nftImage.url
        this.nft.projectImgUrl = nftImageUrl
        console.log(nftImage)

        // get qr code url
        this.nft.qrUrl = `https://infura-ipfs.io/ipfs/${nftSpecificData.Hash}/${nftSpecificData.Name}`
        console.log(this.nft.qrUrl)
        this.params.nftLoaded = true
      }
    },
  },
}
</script>
