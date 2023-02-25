<template>
  <div class="weight-input relative" :class="{ 'error-container': errors }">
    <div class="relative">
      <div class="mb-1 text-gray font-semibold sm:text-lg">
        {{ name }}
      </div>

      <div class="relative overflow-hidden mb-8 rounded">
        <text-input
          class="-no-container"
          v-if="!weight"
          placeholder="Vul bedrag in"
          :value="value"
          @input="emitInput"
        ></text-input>
        <text-input
          class="-no-container"
          v-else
          placeholder="Vul Waarde"
          :value="value"
          icon="g"
          @input="emitInput"
        ></text-input>

        <span
          @click="toggle"
          class="absolute top-0 bottom-0 right-0 flex items-center hover:text-black weight-toggle-text"
        >
          <div class="space-bar"></div>

          <span class="weight-change-btn" v-if="!weight">
            <span class="hidden sm:block">Wijzig naar gram</span>
            <span class="sm:hidden flex items-center justify-center">
              g

              <i class="ion-ios-arrow-down ml-2 -mb-1"></i>
            </span>
          </span>
          <span class="weight-change-btn h-full flex items-center" v-else>
            <span class="hidden sm:block">Wijzig naar €</span>
            <span class="sm:hidden flex items-center justify-center">
              € <i class="ion-ios-arrow-down ml-2 -mb-1"></i
            ></span>
          </span>
        </span>
      </div>
    </div>

    <div
      class="error-container text-red-100 mb-4"
      v-if="errors"
      style="margin-top: -20px"
    >
      <div>
        Vul een geldige waarde in
      </div>
    </div>
  </div>
</template>

<script>
import TextInput from './TextInput';
import { mapState } from 'vuex';
import { amountCheck } from '../../utils/validators';
import BigNumber from 'bignumber.js';
import { roundToTwo } from '../../utils/helpers';

export default {
  name: 'WeightInput',
  components: { TextInput },
  props: ['name', 'value', 'metal'],
  data() {
    return {
      errors: false,
    };
  },
  methods: {
    emitInput(val) {
      let calcVal = val;

      if (this.weight) {
        calcVal = this.weightToCash(val);

        this.$store.commit('SET_WEIGHT_VALUE', {
          name: this.metal,
          val: val,
        });
      }

      this.$emit('input', calcVal);

      this.errors = !amountCheck(val);
    },
    toggle() {
      this.$emit('toggle', '');

      this.$store.commit('SET_WEIGHT_SELECT', {
        name: this.metal,
        val: !this.weight,
      });

      this.errors = false;
    },
    weightToCash(val) {
      let cash;
      let b = new BigNumber(val);
      if (this.metal == 'gold') {
        cash = b.multipliedBy(this.nissab.gold_price);
      } else {
        cash = b.multipliedBy(this.nissab.silver_price);
      }

      return roundToTwo(cash);
    },
  },
  computed: {
    ...mapState({
      nissab: (state) => state.nissab,
      settings: (state) => state.goldSilverWeightSettings,
    }),
    weight() {
      return this.settings[this.metal];
    },
  },
};
</script>

<style scoped></style>
