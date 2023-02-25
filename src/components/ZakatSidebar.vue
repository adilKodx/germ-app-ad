<template>
  <div class="text-sm">
    <div class="pb-2">
      <div v-for="donation in localSplit" :key="donation.name">
        <div class="flex justify-between mb-2 text-sm">
          <div class="pr-4">
            <div class="text-gray-300">{{ donation.name }}</div>
          </div>

          <div>{{ currencyFormat(donation.amount) }}</div>
        </div>
      </div>
      <!-- Hide Support Cost -->
      <!-- <div class="flex justify-between mb-2 text-sm" v-if="deliveryCostCalc == 2">
                <div class="pr-4">
                    <div class="text-gray-300">{{ grantSupportCostText }}</div>
                </div>

                <div>{{ currencyFormat(this.localZakatDeliveryCost) }}</div>
            </div> -->
    </div>

    <div class="flex justify-between h-12">
      <div class="flex flex-col">
        <span class="header-6 cursor-pointer" @click="setRouteTab(1)"
          >Zakat</span
        >

        <!--<div v-if="allocationText">-->
        <!--<div class="text-sm text-gray-300">-->
        <!--{{ allocationText }}-->
        <!--</div>-->
        <!--</div>-->
      </div>

      <div>
        <span class="fix-zakat-spacing header-6">{{ localZakat }}</span>

        <div
          class="cursor-pointer text-xs text-right text-gray-500 font-semibold"
          @click="removeZakat"
          v-if="!thankYou && !isPaymentPage"
        >
          Verwijder
        </div>
      </div>
    </div>

    <div v-if="deliveryFee && deliveryFee.paymentType" class="pt-2">
      <div class="flex justify-between">
        <div class="bold-dark pr-2">{{ deliveryFee.name }}</div>

        <div class="bold-dark">
          {{ currencyFormat(deliveryFee.amount) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
import { currencyFormat } from "../utils/helpers";
import { EventBus } from "../utils/eventBus";
import { paymentTypes } from "../utils/GlobalVars";
import { deliveryFeeText, deliveryFeeTextNoAddOn } from "../utils/GlobalVars";

export default {
  name: "ZakatSidebar",
  props: ["type", "thankYou"],
  data() {
    return {
      localDonationTypes: [],
      localDonationSplit: [],
    };
  },
  methods: {
    setRouteTab(step) {
      if (!this.thankYou) {
        if (this.calculatorProgress !== 1) {
          this.$store.dispatch("setProgressBar", {
            step: step,
          });
          this.$router.push({ path: "geef-zakat" });
        }
      }
    },
    format(num) {
      return currencyFormat(num);
    },
    currencyFormat(amount) {
      return !amount ? "€0" : currencyFormat(amount);
    },
    removeZakat() {
      this.$store.dispatch("updateZakat", {
        name: "Zakat",
        amount: 0,
        id: 0,
        paymentType: paymentTypes.single,
      });

      EventBus.$emit("setValue", {
        id: "deliver-btns",
        val: 2,
      });

      EventBus.$emit("zakatUpdated", 0);
      EventBus.$emit("zakatUpdateDonationItem", "");

      //Reset zakat donation list item payment type
      EventBus.$emit("resetSelect", {
        name: "zakat-item",
        val: paymentTypes.single,
      });

      //reset allocation radio buttons
      EventBus.$emit("setValue", {
        id: "allocation",
        val: "1",
      });

      //Delete delivery fee daontion item
      this.$store.dispatch("deleteDonation", 3);
      this.deliveryCost = 2;

      //Reset sliders
      this.$store.commit("SET_ALLOCATION", "nzf");
      this.$store.dispatch("setRecommendedDonation", this.donationSplit);

      //this.$store.dispatch('deleteDonation', 3);
    },
    removeZakatDelivery() {
      this.$store.dispatch("deleteDonation", 3);

      this.deliveryCost = 2;

      EventBus.$emit("setValue", {
        id: "deliver-btns",
        val: 2,
      });
    },
    filterDeliveryFee(el) {
      if (el.id == 3 && el.name === deliveryFeeText) {
        return true;
      }
      return false;
    },
  },
  computed: {
    allocationText() {
      if (this.allocation == "nzf") {
        return this.getLabel("Where its most needed");
      } else if (this.allocation == "even") {
        return this.getLabel("Allocate evenly");
      }

      return false;
    },
    deliveryFee() {
      if (this.thankYou) {
        return this.localDonationTypes.filter((el) => {
          return this.filterDeliveryFee(el);
        })[0];
      }

      return this.donationTypes.filter((el) => {
        return this.filterDeliveryFee(el);
      })[0];
    },
    deliveryCostCalc() {
      let cost = 1;
      if (this.thankYou) {
        this.localDonationTypes.forEach((el) => {
          if (el.name === deliveryFeeTextNoAddOn) {
            cost = 2;
          }
        });
      } else {
        cost = this.getDonationCostType();
      }
      return cost;
    },
    ...mapFields([
      "calculationSettings.deliveryCost",
      "donation.donationTypes",
      "donation.donationSplit",
    ]),
    ...mapState({
      allocation: (state) => state.donation.allocation,
      donationSplit: (state) => state.donation.donationSplit,
      calculatorProgress: (state) => state.calculatorProgress,
      // donationTypes: state => state.donation.donationTypes,
    }),
    ...mapGetters([
      "getZakat",
      "getTotalDonation",
      "getRegularDonationsTotal",
      "getTotalSplit",
      "getLabel",
      "getZakatDeliveryCost",
      "getAllocatableZakat",
      "getDonationCostType",
    ]),
    localSplit() {
      if (this.thankYou) {
        return this.localDonationSplit;
      }

      return this.donationSplit;
    },
    localZakat() {
      if (this.thankYou && this.localDonationTypes[0].id == 0) {
        return this.format(this.localDonationTypes[0].amount);
      }

      return this.format(this.donationTypes[0].amount);
    },
    localZakatDeliveryCost() {
      let cost = 0;
      if (this.thankYou) {
        this.localDonationTypes.forEach((el) => {
          if (el.name === deliveryFeeTextNoAddOn && el.id === 3) {
            cost = el.amount;
          }
        });
      } else {
        cost = this.getZakatDeliveryCost();
      }
      return cost;
    },
    grantSupportCostText() {
      return deliveryFeeTextNoAddOn;
    },
    isPaymentPage() {
      return this.$route.name === "payment";
    },
  },
  beforeMount() {
    if (localStorage.getItem("basket") && this.thankYou) {
      this.localDonationTypes = JSON.parse(localStorage.getItem("basket"));
    }

    if (localStorage.getItem("donationSplit") && this.thankYou) {
      this.localDonationSplit = JSON.parse(
        localStorage.getItem("donationSplit")
      );
    }
  },
};
</script>

<style scoped>
.fix-zakat-spacing {
  padding-left: 20px;
}
</style>
