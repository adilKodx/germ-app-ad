<template>
  <div>
    <scroll-container :class="{ 'single-page': !manageZakatVisible }">
      <full-page-slide
        gtagId="donations-and-types"
        class="-first"
        :nextBtn="{
          skip: false,
          conditional: true,
          text: 'Ga verder',
          // path: '/geef-sadaqah',
          // text: this.getZakat() > 0 ? 'Ga verder' : 'Ga naar Geef Sadaqah',
          path: '/betaling',
          text: this.getZakat() > 0 ? 'Ga verder' : 'Ga verder',
        }"
        :additionalBtn="{
          text: 'Kies hoe de Zakat wordt gebruikt',
          gtagId: 'fast-forward-payment',
          next: true,
          conditional: this.getZakat() > 0,
          size: 'large',
          active: false
        }"
        @additionalClick="manageZakatVisible = true"
      >
        <donation-list></donation-list>
      </full-page-slide>
      <!-- 
      <full-page-slide
        v-show="manageZakatVisible"
        gtagId="zakat-delivery"
        :nextBtn="{ conditional: getTotalSplit() == 1 }"
      >
        <h3 class="header header-2 mb-4">
          {{
            getLabel(
              'How I’d like NZF to cover the cost of delivering my Zakat.'
            )
          }}
        </h3>
        
        <p class="mb-8 ">
          {{ getLabel('nzf Delivery Paragraph') }}
        </p>

        <delivery-cost-radio-btns></delivery-cost-radio-btns>

        <div
          v-if="getTotalSplit() < 1 && allocation == 'custom'"
          class="text-dark text-red-100 mb-4"
        >
          
        </div>
      </full-page-slide> -->

      <full-page-slide
        v-show="manageZakatVisible"
        gtagId="zakat-distribution"
        class="-z-40"
        :nextBtn="{ path: '/betaling', conditional: getTotalSplit() == 1 }"
      >
        <sliders></sliders>
      </full-page-slide>
    </scroll-container>

    <flash-container>
      <transition name="fade">
        <error-message
          v-if="allocation == 'custom' && errors.show"
          type="amber"
        >
          {{ getLabel("You have allocated 100 of your donation total") }}
        </error-message>
      </transition>
    </flash-container>
  </div>
</template>

<script>
import DonationList from "../DonationList";
import ScrollContainer from "../scroll/ScrollContainer";
import Sliders from "../Sliders";
import FullPageSlide from "../FullPageSlide";
import ErrorMessage from "../ErrorMessage";
// import DeliveryCostRadioBtns from '../DeliveryCostRadioBtns';
import FlashContainer from "../containers/FlashContainer";
import { mapGetters, mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
import {
  zakatableAssets,
  totalLiabilities,
  numberWithCommas,
  isMd,
} from "../../utils/helpers";
import { EventBus } from "../../utils/eventBus";
// import { paymentTypes} from "../../utils/GlobalVars";

export default {
  metaInfo: {
    title: "Geef Zakat | Zakat betalen | Nationaal Zakat Fonds",
    meta: [
      {
        name: "description",
        content:
          "Ook in Nederland leven veel moslims in armoede. Dit kan anders. Zakat is het antwoord. Doe mee en geef dit jaar jouw Zakat aan het Nationaal Zakat Fonds!",
      },
    ],
  },
  name: "DonationPage",
  components: {
    FullPageSlide,
    Sliders,
    DonationList,
    ScrollContainer,
    ErrorMessage,
    // DeliveryCostRadioBtns,
    FlashContainer,
  },
  data() {
    return {
      zakatableAssets: numberWithCommas(zakatableAssets()).toLocaleString(),
      totalLiabilities: numberWithCommas(totalLiabilities()),
      show: false,
    };
  },
  methods: {
    clearDonations() {
      this.$store.commit("CLEAR_SINGLE_DONATIONS");
    },
    hideCheck(val) {
      if (val == 0) {
        this.manageZakatVisible = false;
      }
    },
    widthCheck() {
      if (this.manageZakatVisible) {
        return true;
      } else {
        return !isMd();
      }
    },
  },
  computed: {
    ...mapGetters([
      "getZakatDeliveryCost",
      "getZakat",
      "getTotalSplit",
      "getLabel",
      "getSingleDonations",
      "getRegularDonations",
    ]),
    ...mapState({
      allocation: (state) => state.donation.allocation,
      errors: (state) => state.errors,
      donationTypes: (state) => state.donation.donationTypes,
      donationSplit: (state) => state.donation.donationSplit,
    }),
    ...mapFields(["calculationSettings.deliveryCost", "manageZakatVisible"]),
    formatZakat() {
      return numberWithCommas(this.getZakat());
    },
  },
  mounted() {
    window.scrollTo(0, 0);

    EventBus.$on("zakatUpdated", this.hideCheck);
  },
  destroyed() {
    EventBus.$on("zakatUpdated", this.hideCheck);
  },
};
</script>

<style scoped>
#fast-forward-payment{
  background-color: transparent;
}
</style>
