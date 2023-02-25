<template>
  <div class="overflow-y-auto donation-sidebar text-sm" v-if="checksingleDonationAmount === true">
    <div class="text-xl mb-6 header-6">{{ getLabel("My Donation Basket") }}</div>
    <!--<transition name="fade">-->
    <div v-if="singleDonations.length > 0">
      <div class="bg-white shadow-lg rounded mb-4 overflow-hidden">
        <div
          class="p-4 header-6 uppercase text-xs font-semibold tracking-widest"
        >
          {{ getLabel("Single Payments") }}

          <hr class="mt-4 pb-0 mb-0" />
        </div>

        <div
          v-for="donation in singleDonations"
          :key="donation.name + donation.id"
          class="p-4 pt-0"
          :class="{ hidden: donation.amount <= 0 }"
        >
          <div v-if="donation.id == 0">
            <zakat-sidebar :thankYou="thankYou"></zakat-sidebar>
          </div>

          <div v-else-if="donation.amount && donation.id !== 3 && donation.id !== 9">
            <div class="flex justify-between w-full">
              <div class="flex flex-col">
                <span
                  class="header-6 cursor-pointer"
                  @click="setRouteTab(donation.name)"
                >
                  {{ donation.name }}
                </span>

                <span
                  class="text-sm text-gray-300"
                  v-if="donation.name === donationNames.sad"
                >
                  (vrijwillige donaties)
                </span>
                
                <span
                  class="text-sm text-gray-300"
                  v-if="donation.name === donationNames.rib"
                >
                  (rente)
                </span>
              </div>

              <div>
                <div style="text-align: end !important">
                  <span class="header-6">
                    {{ format(donation.amount) }}
                  </span>
                </div>

                <div
                  @click.prevent="remove(donation.id)"
                  class="remove-item"
                  v-if="!thankYou && !isPaymentPage && donation.id !== 9"
                >
                  Verwijder
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr v-if="checksingleDonationAmount === true" />

        
        <div v-if="checksingleDonationAmount === true" class="p-4 pt-0 flex justify-between bold-dark">
          <span>{{ getLabel("Transactiekosten") }}</span>
          <span>{{ format(0.29) }}</span>
        </div>
        <hr />
        <div class="p-4 pt-0 flex justify-between bold-dark">
          <span>{{ getLabel("Subtotal") }}</span>
          <span>{{ format(localSingleDonationsTotal) }}</span>
        </div>
      </div>
    </div>
    <!--</transition>-->

    <!--<transition name="fade">-->
    <div v-if="regularDonations.length > 0">
      <div class="bg-white shadow-lg rounded mb-4 overflow-hidden">
        <div
          class="
            p-4
            text-black
            uppercase
            text-xs
            font-semibold
            tracking-widest
          "
        >
          <!-- {{getLabel('Regular Payments')}} -->
          <!-- {{getLabel('Every Month Payment')}} -->
          {{ getLabel("Regular Payment") }}

          <hr class="mt-4 pb-0 mb-0" />
        </div>

        <div
          v-for="donation in regularDonations"
          :key="donation.name + donation.id"
          :class="{
            'p-4': donation.amount > 0,
            'pt-0': donation.amount > 0,
          }"
        >
          <div v-if="donation.id == 0">
            <zakat-sidebar type="regular" :thankYou="thankYou"></zakat-sidebar>
          </div>

          <div v-else-if="donation.amount && donation.id !== 3">
            <div class="flex justify-between w-full">
              <div class="flex flex-col">
                <span
                  class="text-blue-100 font-semibold cursor-pointer"
                  @click="setRouteTab(donation.name)"
                >
                  {{ donation.name }}
                </span>

                <span
                  class="text-sm text-blue-100 font-semibold"
                  v-if="donation.name === donationNames.sad"
                >
                  (voluntary donation)
                </span>
                <span
                  class="text-sm text-blue-100 font-semibold"
                  v-if="donation.name === donationNames.rib"
                >
                  (interest)
                </span>
              </div>

              <div class="flex flex-col">
                <span class="bold-dark">{{ format(donation.amount) }}</span>

                <div
                  @click="remove(donation.id)"
                  class="remove-item"
                  v-if="!thankYou && !isPaymentPage"
                >
                  Remove
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div class="p-4 pt-0 bold-dark flex justify-between">
          <span>{{ getLabel("Subtotal") }}</span>
          {{ format(localRegularDonationsTotal) }}
        </div>
      </div>
    </div>
    <!--</transition>-->

    <span v-if="thankYou">
      <!-- Put extra data in sidebar if only needs to be displayed on thank you page -->
    </span>

    <div class="mb-4">
      <div v-if="localSingleDonationsTotal > 0">
        <div class="flex justify-between text-xl header-6">
          <span>{{ getLabel("Total") }}</span>
          <span>{{ format(localSingleDonationsTotal) }}</span>
        </div>
      </div>

      <transition name="fade">
        <!--Change text-sm to text-md -->
        <div v-if="localGiftAid" class="text-sm mt-6">
          {{
            getLabel(
              "An extra 25% will be added to your donation total through Gift Aid at no expense to you"
            )
          }}
        </div>
      </transition>
    </div>

    <hr />

    <div>
      <!--Change text-xs to text-sm -->
      <p class="text-xs">
        Wij zorgen ervoor dat Nederlandse moslims jouw Zakat binnen één maanjaar
        ontvangen. Heb je nog vragen? Stuur ons een e-mail op
        <a href="mailto:vragen@nationaalzakatfonds.nl" class="text-red-300"
          >vragen@nationaalzakatfonds.nl</a
        >
        en we helpen je graag verder met al jouw vragen.
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { currencyFormat } from "../utils/helpers";
import { EventBus } from "../utils/eventBus";
import {
  paymentTypes,
  donationNames,
  paths,
  deliveryFeeText,
} from "../utils/GlobalVars";
import { mapFields } from "vuex-map-fields";
import ZakatSidebar from "./ZakatSidebar";
// import GiftAidSidebar from './GiftAidSidebar';
const BigNumber = require("bignumber.js");

export default {
  name: "DonationSidebar",
  components: { ZakatSidebar /*GiftAidSidebar*/ },
  props: ["thank-you"],
  data() {
    return {
      localDonationTypes: [],
      localAddress: {},
      localAccountNumber: {},
      localCardNumber: {},
    };
  },
  methods: {
    setRouteTab(step) {
      if (!this.thankYou) {
        let activeStep = 0;
        if (step == "Koop een 'Eid pakket") {
          activeStep = 1;
        } else if (step == "Fidyah/Kaffarah") {
          activeStep = 1;
        } else if (step == "Sadaqah (vrijwillige donaties)") {
          activeStep = 2;
        } else if (step == "Riba (rente)") {
          activeStep = 2;
        }
        if (activeStep == 1 && this.calculatorProgress !== 1) {
          this.$store.dispatch("setProgressBar", {
            step: activeStep,
          });
          this.$router.push({ path: "geef-zakat" });
        } else if (activeStep == 2 && this.calculatorProgress !== 2) {
          this.$store.dispatch("setProgressBar", {
            step: activeStep,
          });
          this.$router.push({ path: "support" });
        }
      }
    },
    format(num) {
      return num ? currencyFormat(num) : "";
    },
    remove(id) {
      if (!this.thankYou) {
        // this.$store.commit('REMOVE_BASKET_ITEM', {id})
        this.$store.dispatch("deleteDonation", id);
      }
      EventBus.$emit("resetSelect", {
        name: id,
        val: paymentTypes.single,
      });
    },
  },
  computed: {
    allocationText() {
      if (this.allocation == "nzf") {
        return "Most needed";
      } else if (this.allocation == "even") {
        return "Allocate evenly";
      }

      return false;
    },
    hiddenCardNumber() {
      let num = String(this.localCardNumber.cardNumber);
      return num.substring(num.length - 3);
    },
    hiddenAccountNumber() {
      // let num = String(this.accountNumber)
      // return num.substring(num.length - 3)

      return this.localAccountNumber.accountNumber;
    },
    donationNames() {
      return donationNames;
    },
    paths() {
      return paths;
    },
    regularDonations() {
      if (!this.thankYou) {
        return this.getRegularDonations();
      } else {
        return this.localDonationTypes.filter((el) => {
          return el.paymentType == paymentTypes.regular && el.amount > 0;
        });
      }
    },
    localRegularDonationsTotal() {
      if (!this.thankYou) {
        return this.getRegularDonationsTotal();
      }

      let localRegularDonations = this.localDonationTypes.filter((el) => {
        return el.paymentType == paymentTypes.regular && el.amount > 0;
      });

      if (localRegularDonations.length > 0) {
        return localRegularDonations
          .map((el, index) => {
            if (el.id === 3) {
              if (el.name === deliveryFeeText) {
                return el.amount;
              } else {
                return 0;
              }
            } else {
              return el.amount;
            }
          })
          .reduce((acc, cur) => {
            return new BigNumber(acc).plus(new BigNumber(cur));
          });
      }

      return [];
    },
    singleDonations() {
      if (!this.thankYou) {
        return this.getSingleDonations();
      } else if (this.localDonationTypes.length > 0) {
        return this.localDonationTypes.filter((el) => {
          return el.paymentType == paymentTypes.single && el.amount > 0;
        });
      } else {
        return [];
      }
    },
    checksingleDonationAmount() {
      let result = this.getSingleDonations();
      let check = false
      result.filter(element => {
        if(element.id !== 9 && element.amount > 0){
          check = true;
        }
      });
      return check;
    },
    localSingleDonationsTotal() {
      if (!this.thankYou) {
        return this.getSingleDonationsTotal();
      }

      let localSingleDonations = this.localDonationTypes.filter((el) => {
        return el.paymentType == paymentTypes.single && el.amount > 0;
      });

      if (localSingleDonations.length > 0) {
        return localSingleDonations
          .map((el, index) => {
            if (el.id === 3) {
              if (el.name === deliveryFeeText) {
                return el.amount;
              } else {
                return 0;
              }
            } else {
              return el.amount;
            }
          })
          .reduce((acc, cur) => {
            return new BigNumber(acc).plus(new BigNumber(cur));
          });
      }

      return [];
    },
    localGiftAid() {
      if (localStorage.getItem("giftAid") && this.thankYou) {
        return JSON.parse(localStorage.getItem("giftAid")).giftAid;
      }

      return this.giftAid;
    },
    ...mapState({
      // donationTypes: state => state.donation.donationTypes,
      donationSplit: (state) => state.donation.donationSplit,
      allocation: (state) => state.donation.allocation,
      total: (state) => state.donation.totalChargeable,
      totalDonation: (state) => state.donation.totalDonation,
      giftAid: (state) => state.donation.giftAid,
      address: (state) => state.user.paymentDetails.address,
      postCode: (state) => state.user.paymentDetails.postCode,
      cardNumber: (state) => state.user.paymentDetails.cardNumber,
      accountNumber: (state) => state.user.paymentDetails.accountNumber,
      paymentTypeDescription: (state) =>
        state.user.cardDetails.paymenttypedescription,
      cardDetails: (state) => state.user.cardDetails,
      calculatorProgress: (state) => state.calculatorProgress,
    }),
    ...mapGetters([
      "getSingleDonations",
      "getRegularDonations",
      "getTotalDonation",
      "getRegularDonationsTotal",
      "getSingleDonationsTotal",
      "getLabel",
    ]),
    ...mapFields([
      "user.paymentDetails",
      "transitions.isNavOpen",
      "donation.donationTypes",
      "user.assets",
      "user.reccommendZakat",
    ]),
    isPaymentPage() {
      return this.$route.name === "payment";
    },
  },
  beforeMount() {
    if (localStorage.getItem("basket") && this.thankYou) {
      this.localDonationTypes = JSON.parse(localStorage.getItem("basket"));
    }

    if (localStorage.getItem("address") && this.thankYou) {
      this.localAddress = JSON.parse(localStorage.getItem("address"));
    }

    if (localStorage.getItem("accountNumber") && this.thankYou) {
      this.localAccountNumber = JSON.parse(
        localStorage.getItem("accountNumber")
      );
    }

    if (localStorage.getItem("cardNumber") && this.thankYou) {
      this.localCardNumber = JSON.parse(localStorage.getItem("cardNumber"));
    }
  },
};
</script>
