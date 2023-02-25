<template>
  <div>
    <div class="mb-6">
      <!-- Add sm:text-lg -->
      <p class="mb-4">{{ getLabel("Filter Sub Text") }}</p>

      <div class="header-2 header mb-4 md:mb-12">Mijn bezittingen</div>

      <checkbox
        class="mb-8 header"
        @update="selectSectionOwned"
        :checkboxes="sectionsAssets"
        :cols="2"
      >
      </checkbox>
    </div>

    <div>
      <div class="header-2 header mb-4 md:mb-12">Mijn schulden</div>

      <checkbox
        class="mb-8 header"
        @update="selectSectionOwed"
        :checkboxes="sectionsOwed"
        :fullWidth="true"
      >
      </checkbox>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Checkbox from "./inputs/Checkbox";
import _ from "lodash";

export default {
  name: "CalculatorFilter",
  components: { Checkbox },
  data() {
    return {
      assetsArr: [],
      owedArr: [],
    };
  },
  methods: {
    selectSectionOwned(val) {
      this.assetsArr = val;

      this.assetsArr = this.assetsArr.map((el) => {
        return {
          name: el,
          step: this.sectionsAssetsList.filter((item) => item.id == el)[0].step,
        };
      });

      this.assetsArr = _.sortBy(this.assetsArr, function (o) {
        return o.step;
      });

      let arr = _.sortBy(this.owedArr.concat(this.assetsArr), function (o) {
        return o.step;
      });

      this.$store.commit("SET_SECTIONS", arr);
      this.$store.commit("CLEAR_CALC_STEP");
    },
    selectSectionOwed(val) {
      this.owedArr = val;

      this.owedArr = this.owedArr.map((el) => {
        return {
          name: el,
          step: this.sectionsOwedList.filter((item) => item.id == el)[0].step,
        };
      });

      let arr = _.sortBy(this.owedArr.concat(this.assetsArr), function (o) {
        return o.step;
      });

      this.$store.commit("SET_SECTIONS", arr);
      this.$store.commit("SET_SECTIONS", arr);
      this.$store.commit("CLEAR_CALC_STEP");
    },
  },
  computed: {
    ...mapState({
      calculatorFilter: (state) => state.calculatorFilter,
    }),
    ...mapGetters(["getLabel"]),
    sectionsAssets() {
      return this.sectionsAssetsList.map((el, index) => {
        let isSelected = this.calculatorFilter.selected;

        isSelected = _.flatMap(isSelected, function (el) {
          return el.name;
        });

        return {
          name: el.name,
          value: el.id,
          step: el.step,
          selected: isSelected.includes(el.id),
        };
      });
    },
    sectionsOwed() {
      return this.sectionsOwedList.map((el, index) => {
        let isSelected = this.calculatorFilter.selected;

        isSelected = _.flatMap(isSelected, function (el) {
          return el.name;
        });

        return {
          name: el.name,
          value: el.id,
          step: el.step,
          selected: isSelected.includes(el.id),
        };
      });
    },
    sectionsAssetsList() {
      return [
        {
          name: "Geld",
          id: "cash-valuation",
          step: 1,
        },
        {
          name: "Pensioenen",
          id: "pensions",
          step: 5,
        },
        {
          name: "Te ontvangen gelden",
          id: "money-owed-to-you",
          step: 2,
        },
        {
          name: "Goud en Zilver",
          id: "gold-and-silver",
          step: 3,
        },
        {
          name: "Crypto bezittingen",
          id: "crypto",
          step: 7,
        },
        {
          name: "Aandelen",
          id: "shares-and-investments",
          step: 4,
        },
        {
          name: "Bedrijfsmiddelen",
          id: "business-assets",
          step: 8,
        },
      ];
    },
    sectionsOwedList() {
      return [
        {
          name: "Verschuldigde bedragen op schulden, achterstallige rekeningen, creditcards etc.",
          id: "liabilities",
          step: 9,
        },
      ];
    },
  },
  mounted() {
    this.assetsArr = this.sectionsAssets
      .filter((el) => el.selected)
      .map((el) => {
        return {
          name: el.value,
          step: el.step,
        };
      });

    this.owedArr = this.sectionsOwed
      .filter((el) => el.selected)
      .map((el) => {
        return {
          name: el.value,
          step: el.step,
        };
      });
  },
};
</script>

<style scoped></style>
