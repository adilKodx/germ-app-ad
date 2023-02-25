<template>
  <div class="flex flex-row flex-wrap justify-between w-full mt-8 mb-4">
    <div class="w-full">
      <weight-input
        class="error"
        placeholder="Vul bedrag in"
        :name="getLabel('Gold valuation')"
        :value="gold"
        metal="gold"
        @input="updateUserAsset('gold', $event)"
        @toggle="clearAssets('gold')"
      ></weight-input>
    </div>

    <div class="w-full">
      <weight-input
        placeholder="Vul bedrag in"
        :name="getLabel('Silver valuation')"
        :value="silver"
        metal="silver"
        @input="updateUserAsset('silver', $event)"
        @toggle="clearAssets('silver')"
      ></weight-input>
    </div>
  </div>
</template>

<script>
import WeightInput from './inputs/WeightInput';
import { mapFields } from 'vuex-map-fields';
import { mapGetters, mapState } from 'vuex';
import { EventBus } from '../utils/eventBus';
import { roundToTwo } from '../utils/helpers';

export default {
  name: 'GoldSilverInputs',
  components: { WeightInput },
  data() {
    return {
      gold: '',
      silver: '',
    };
  },
  
  methods: {
    updateUserAsset(param, val) {
      
      val = roundToTwo(val);
      this.$store.commit('SET_ASSET', {
        name: param,
        value: val,
      });
      
    },
    clearAssets(name) {
      this[name] = '';

      this.$store.commit('SET_ASSET', {
        name,
        value: '',
      });
    },
    clear() {
      this.clearAssets('silver');
      this.clearAssets('gold');
    },
  },
  computed: {
    ...mapFields({
      userAssets: 'user.assets',
    }),
    ...mapGetters(['getLabel']),
    ...mapState({
      nissab: (state) => state.nissab,
      settings: (state) => state.goldSilverWeightSettings,
    }),
  },
  mounted() {
    if (this.settings.gold) {
      this.gold = this.settings.goldWeight;
    } else {
      this.gold = this.userAssets.gold;
    }

    if (this.settings.silver) {
      this.silver = this.settings.silverWeight;
    } else {
      this.silver = this.userAssets.silver;
    }

    EventBus.$on('globalClear', this.clear);
  },
  destroyed() {
    EventBus.$off('globalClear', this.clear);
  },
};
</script>

<style scoped></style>
