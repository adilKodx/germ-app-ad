<template>
  <div>
    <scroll-container>
      <full-page-slide
        gtagId="nzf-further"
        :next-btn="{
          skip: false,
          text: 'Ga verder',
          path: '/betaling',
          conditional: true,
        }"
        class="-first"
      >
        <upsell-list></upsell-list>
      </full-page-slide>

      <!-- <full-page-slide
        gtagId="gift-aid"
        :next-btn="{
          text: 'Ga verder3w33333333333333',
          path: '/betaling',
          conditional: giftAidClicked,
        }"
      >
        <p>
          <gift-aid @select="giftAidClicked = true"></gift-aid>
        </p>
      </full-page-slide> -->
    </scroll-container>
  </div>
</template>

<script>
import UpsellList from '../UpsellList';
import ScrollContainer from '../scroll/ScrollContainer';
import FullPageSlide from '../FullPageSlide';
// import GiftAid from '../GiftAid';
import { mapGetters } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import {
  zakatableAssets,
  totalLiabilities,
  roundToTwo,
  numberWithCommas,
} from '../../utils/helpers';

export default {
  metaInfo: {
    title: 'Geef Sadaqah | Sadaqah doneren | Nationaal Zakat Fonds',
    meta: [
      {
        name: 'description',
        content:
          'Nationaal Zakat Fonds biedt moslims in Nederland financiële ondersteuning en bijstand. Geef Sadaqah aan het Nationaal Zakat Fonds en maak het verschil!',
      },
    ],
  },
  name: 'DonationPage',
  components: { FullPageSlide, UpsellList, ScrollContainer /*GiftAid*/ },
  data() {
    return {
      zakatableAssets: numberWithCommas(zakatableAssets()).toLocaleString(),
      totalLiabilities: numberWithCommas(totalLiabilities()),
      show: false,
    };
  },
  methods: {
    netAssets() {
      return roundToTwo(zakatableAssets() - totalLiabilities());
    },
    total() {
      return (
        parseFloat(this.getRegularDonationsTotal()) +
        parseFloat(this.getSingleDonationsTotal())
      );
    },
  },
  computed: {
    ukTaxPayer() {
      return 'I am a UK tax payer';
    },
    notUkTaxPayer() {
      return 'I am not a UK tax payer';
    },
    ...mapGetters([
      'getZakatDeliveryCost',
      'getZakat',
      'getTotalDonation',
      'getRegularDonationsTotal',
      'getSingleDonationsTotal',
      'getLabel',
    ]),
    ...mapFields(['donation.giftAidClicked', 'donation.giftAid']),
    formatZakat() {
      return numberWithCommas(this.getZakat());
    },
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  beforeMount() {
    // this.$store.dispatch('updateZakat', {amount:zakatCalc()});
  },
};
</script>

<style scoped></style>
