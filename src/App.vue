<template>
  <div 
    id="app"
    style="overflow: hidden !important"
    class="w-full h-full"
    :class="{ 'nav-open': isNavOpen }"
    v-if="loadingText"
  >
    <ie-detect></ie-detect>

    <div>
      <nav-bar></nav-bar>
    </div>

    <div class="flex container justify-center m-auto left">
      <!--Left-->
      <div class="hidden md:block w-full sm:w-3/12 hidden md:block">
        <sticky>
          <transition name="fade">
            <router-view name="left"></router-view>
          </transition>
        </sticky>
      </div>

      <!--Center-->
      <div class="h-full w-full md:w-9/12 lg:w-6/12">
        <transition name="fade" mode="out-in">
          <router-view name="center" class="center layout"></router-view>
        </transition>

        <flash-container>
          <transition name="fade">
            <error-message v-if="globalErrors.length">
              <span>
                {{ globalErrors[0] }}
              </span>
            </error-message>
          </transition>
        </flash-container>
      </div>

      <!--Right-->
      <div
        class="
          hidden
          lg:block
          w-full w-full
          sm:w-3/12
          pl-12
          right
          pt-nav-height
          relative
        "
      >
        <sticky>
          <transition name="fade" mode="out-in">
            <router-view name="right"></router-view>
          </transition>
        </sticky>
      </div>

      <!--<div class="triple-circle">-->
      <!--<img class="hidden sm:block" src="/static/img/triple-circle.png" alt="triple-circle-image">-->
      <!--<img class="sm:hidden" src="/static/img/triple-circle-small.png" alt="triple-circle-image">-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import NavBar from "./components/NavBar";
import Sticky from "./components/Sticky";
import queryString from "query-string";
import { mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
import {
  paths,
  paymentTypes,
  sadaqahDisplayName,
  campainDisplayName,
  ribbahDisplayName,
  deliveryFeeTextNoAddOn,
  deliveryPercent,
} from "./utils/GlobalVars";
import ErrorMessage from "./components/ErrorMessage";
import FlashContainer from "./components/containers/FlashContainer";
import IeDetect from "./components/IeDetect";
import { calcPercentOfNum, findOption } from "./utils/helpers";

const BigNumber = require("bignumber.js");

export default {
  metaInfo: {
    meta: [
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
      },
    ],
  },
  name: "app",
  components: {
    NavBar,
    Sticky,
    ErrorMessage,
    FlashContainer,
    IeDetect,
  },
  methods: {
    setZakat(amount) {
      let zakat = this.donationTypes.filter((el) => el.id === 0);

      zakat[0].amount = amount;
      this.userZakat = amount;

      this.$store.dispatch("updateZakat", {
        name: "Zakat",
        amount: amount,
        paymentType: paymentTypes.single,
        id: 0,
      });

      let deliveryFee = new BigNumber(
        calcPercentOfNum(this.userZakat, deliveryPercent)
      );
      this.$store.dispatch("addDonation", {
        name: deliveryFeeTextNoAddOn,
        amount: deliveryFee,
        id: 3,
        paymentType: this.donationTypes[0].paymentType,
      });
    },
    setSession(status) {
      // if (location.search !== '' && location.search !== null) {
      fetch("https://api.ipify.org?format=json")
        .then((x) => x.json())
        .then(({ ip }) => {
          let payload = {
            _ip: ip,
            _uetsid: localStorage.getItem("_uetsid"),
            _uetsid_exp: localStorage.getItem("_uetsid_exp"),
            _uetvid: localStorage.getItem("_uetvid"),
            _uetvid_exp: localStorage.getItem("_uetvid_exp"),
            firstname: "",
            lastname: "",
            email: "",
            customerRef: "",
            URLString: location.search,
            dataObject: JSON.stringify(queryString.parse(location.search)),
            journyStatus: status,
          };
          this.$store.dispatch("submitSessionData", payload);
        });
      // }
    },
  },
  computed: {
    ...mapState({
      isNavOpen: (state) => state.transitions.isNavOpen,
      loadingText: (state) => state.loadingText,
      globalErrors: (state) => state.errors.globalErrors,
      PaymentMethod: (state) => state.settings.PaymentMethod,
      options: (state) => state.options,
    }),
    ...mapFields([
      "donation.donationTypes",
      "user.userZakat",
      "donation.donationSplit",
    ]),
    paths() {
      return paths;
    },
  },
  mounted() {
    // http://localhost:3001/geef-sadaqah?fast&zakat=12&sadaqah=23&riba=23
    this.setSession("Pending");
    let path = "";
    // if (
    //   window.location.href == 'http://localhost:3001/' ||
    //   window.location.href == 'http://192.168.1.115'
    // ) {
    //   this.$router.push({ path: '/bereken' });
    // } else {
    //   this.$router.push({ path: '/bereken' });
    // }
    let fast = "fast" in queryString.parse(location.search);
    let queryParams = "";
    if (fast) {
      queryParams = location.search;
    }
    if (location.pathname == "/") {
      this.$router.push({ path: "/bereken" + queryParams });
      path = "bereken";
    }
    if (location.pathname === "/bereken") {
      this.$store.dispatch("setProgressBar", {
        step: 0,
      });
      path = "bereken";
    } else if (location.pathname === "/geef-zakat") {
      this.$store.dispatch("setProgressBar", {
        step: 1,
      });
      path = "geef-zakat";
    } else if (location.pathname === "/geef-sadaqah") {
      this.$store.dispatch("setProgressBar", {
        step: 1,
        // step: 2,
      });
      path = "geef-sadaqah";
    } else if (location.pathname === "/geef-energiecompensatie") {
      this.$store.dispatch("setProgressBar", {
        step: 2,
      });
      if (findOption(this.options, "geef-energiecompensatie")) {
        path = "geef-energiecompensatie";
      } else {
        path = "geef-sadaqah";
      }
    } else if (location.pathname === "/betaling") {
      this.$store.dispatch("setProgressBar", {
        step: 3,
      });
      path = "betaling";
    }
    if (location.pathname === "/st-payment") {
      this.$router.push({ name: "st-payment-error" });
    }

    if ("zakat" in queryString.parse(location.search)) {
      let amount = queryString.parse(location.search).zakat;
      this.setZakat(amount);
    }

    if ("sadaqah" in queryString.parse(location.search)) {
      let amount = queryString.parse(location.search).sadaqah;

      this.$store.dispatch("addDonation", {
        name: sadaqahDisplayName,
        amount: amount,
        paymentType: paymentTypes.single,
        id: "2-sadaqah",
      });
    }

    if ("energiecompensatie" in queryString.parse(location.search)) {
      let amount = queryString.parse(location.search).energiecompensatie;

      this.$store.dispatch("addDonation", {
        name: campainDisplayName,
        amount: amount,
        paymentType: paymentTypes.single,
        id: "3-energiecompensatie",
      });
    }

    if ("riba" in queryString.parse(location.search)) {
      let amount = queryString.parse(location.search).riba;

      this.$store.dispatch("addDonation", {
        name: ribbahDisplayName,
        amount: amount,
        paymentType: paymentTypes.single,
        id: "3-riba",
      });
    }
    if (fast) {
      let amount = this.userZakat;
      window.addEventListener("load", (event) => {
        this.setZakat(amount);
        this.$store.dispatch("setRecommendedDonation", this.donationSplit);

        if (fast && path !== "betaling") {
          this.$store.dispatch("setProgressBar", {
            step: 3,
          });
          this.$router.push({ path: "/betaling" + queryParams });
        }
      });
    }
    if ("payment_intent" in queryString.parse(location.search)) {
      this.setSession("Completed");
      let amount = this.userZakat;
      this.setZakat(amount);
      let query = queryString.parse(location.search);
      if (
        typeof query.redirect_status !== "undefined" &&
        query.redirect_status == "succeeded"
      ) {
        this.$router.push({
          path: "/bedankt-voor-jouw-betaling" + queryParams,
        });
      } else if (
        typeof query.redirect_status !== "undefined" &&
        query.redirect_status == "failed"
      ) {
        this.$store.dispatch("setProgressBar", {
          step: 3,
        });
        this.$router.push({ path: "/betaling" + queryParams });
        this.globalErrors.push(
          "Er ging iets mis met de betaling. Probeer het opnieuw of neem contact met ons op."
        );
      }
      let that = this;
      window.addEventListener("load", (event) => {
        that.setZakat(amount);
      });
    }
  },
  beforeCreate() {
    let check = "payment_intent" in queryString.parse(location.search);
    if (check) {
      this.$store.dispatch("updateUserJourny");
    } else {
      if ("calculate" in queryString.parse(location.search)) {
        let ref = queryString.parse(location.search).ref;
        this.$store.dispatch("getCalculationJourny", { ref }).then((res) => {
          this.$store.dispatch("fetchData");
        });
      }
      localStorage.removeItem("journyData");
    }
    this.$store.dispatch("fetchData");

    let stripeScriptElement = document.createElement("script");
    stripeScriptElement.setAttribute("src", "https://js.stripe.com/v3/");
    document.head.appendChild(stripeScriptElement);
    
  },
};
</script>

<style lang="scss">
/*DO NOT DELETE ME */
</style>
