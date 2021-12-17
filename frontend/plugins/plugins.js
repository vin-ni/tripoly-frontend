import Vue from 'vue'
import VueSlideToggle from 'vue-slide-toggle'

import VueSweetalert2 from 'vue-sweetalert2'

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css'

import 'vue-dice-roller/dist/vue-dice-roller.css'
import { DiceRoller } from 'vue-dice-roller/dist/vue-dice-roller.common'
Vue.use(VueSweetalert2)

Vue.use(DiceRoller)

Vue.use(VueSlideToggle)
