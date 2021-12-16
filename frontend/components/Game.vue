<template>
  <section class="game">
    <div class="game-wrapper">
      <div class="title">
        <h1>Game</h1>
        <div class="gamge-triggers">
          <button>Sync</button>
          <button>Join</button>
          <button>Leave</button>
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
    return {}
  },
  computed: {},
  mounted() {},
  created() {},
  methods: {},
}
</script>
