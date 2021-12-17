<template>
  <div class="other-player">
    <div class="head" @click="open = !open">
      <p>{{ info.name }}</p>
      <img
        ref="togglebtn"
        src="@/assets/img/togglearrowdown.svg"
        alt="toggle arrow"
        :class="{ open: open }"
      />
    </div>
    <VueSlideToggle :open="open" tag="section" :duration="500">
      <div class="additional-info">
        <p>Current Position: {{ info.position }}</p>
        <p>Saved CO2 in kilo: {{ info.savedc02 }}</p>
        <p>Last dice roll: {{ info.last_dice_roll }}</p>
      </div>
    </VueSlideToggle>
    <div class="border"></div>
  </div>
</template>

<script>
export default {
  name: 'OtherPlayer',
  props: {
    info: {
      type: Object,
      default() {
        return {
          name: '',
          savedc02: '',
          position: '',
          last_dice_roll: '',
          walletID: '',
          supportedGameFields: [],
        }
      },
    },
  },
  data() {
    return {
      open: false,
    }
  },
  computed: {},
  mounted() {},
  created() {},
  methods: {},
}
</script>
