<template>
    <full-page-slide class="-first" :btns="false">
            <div>
              <h1 class="header-2 header mb-6">
                {{ getLabel("Thank you for your donation") }}
              </h1>
      
              <p class="sub-text mb-8">
                {{
                  getLabel("See how your money can directly help Muslims in the UK")
                }}
              </p>
      
              <p class="sub-text mb-8">
                {{ getLabel("Thank You Paragraph") }}
      
                <span
                  class="block mt-4 flex flex-col lg:hidden"
                  v-if="localSingleDonationsTotal > 0"
                >
                  <span v-if="localSingleDonationsTotal > 0">
                    <span class="bold-dark">Your one-off total is:</span> €{{
                      localSingleDonationsTotal
                    }}
                  </span>
                </span>
              </p>
      
              <p class="bold sub-text mb-8">
                <strong>{{ getLabel("Zakat ambassador") }} </strong>
              </p>
      
              <hr class="border-gray-100 mb-8" />
      
              <p class="sub-text mb-2">
                {{ getLabel("Share Paragraph") }}
              </p>
      
              <p class="sub-text mb-2">
                {{ getLabel("Share to encourage others to donate their zakat") }}
              </p>
      
              <div class="mb-8">
                <social-icons></social-icons>
              </div>
      
              <hr class="border-gray-100 mb-10" />
              <div class="flex w-full set-display">
                <div class="mb-8" style="width: 100%">
                  <span
                    @click="home"
                    class="btn -active -feedback font-semibold sm:text-lg"
                  >
                    <div class="px-4 inner-btn-text font-heading-2 whitespace-nowrap">
                      Naar homepage
                    </div>
                  </span>
                </div>
                <a href="https://nl.surveymonkey.com/r/MDB2Z7V" target="blank">
                  <div class="pl-4 sm:pl-2 sm:w-full">
                    <div class="bg-white">
                      <div
                        class="
                          flex flex-wrap
                          preset-btn-container
                          flex-grow
                          sm:justify-center
                        "
                        style="width: 100%"
                      >
                        <div
                          class="
                            -middle
                            fix-size
                            text-center
                            py-2
                            rounded
                            border border-green-200
                            cursor-pointer
                            button-size
                          "
                        >
                          <v-icon
                            style="color: green; background-color: white"
                            class="header-icon"
                            scale="1.5"
                            name="regular/heart"
                          />
                          <div
                            class="
                              px-4
                              -mb-1
                              font-heading-2
                              inner-btn-text
                              fix-padding
                              text-lg
                            "
                          >
                            Mezelf voorstellen
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
    </full-page-slide>
    </template>
      <script>
      import FullPageSlide from "../components/FullPageSlide.vue";
      import SocialIcons from "../components/SocialIcons.vue";
      import { mapGetters, mapState } from "vuex";
      import * as Cookies from "js-cookie";
      import { deliveryFeeText, paymentTypes } from "../utils/GlobalVars";
      import _ from "lodash";
      import { roundToTwo, numberWithCommas } from "../utils/helpers";
      import queryString from "query-string";
      
      export default {
        name: "ThankYouForBoth",
        components: { SocialIcons, FullPageSlide },
        data() {
          return {
            localDonationTypes: {},
            shareCode: "",
          };
        },
        methods: {
          home() {
            window.location = "https://nationaalzakatfonds.nl/";
          },
        },
        computed: {
          ...mapGetters([
            "getLabel",
            "getSingleDonations",
            "getSingleDonationsTotal",
            "getRegularDonationsTotal",
            "getRegularDonations",
          ]),
          ...mapState({
            customerRef: (state) => state.customerRef,
          }),
          localSingleDonationsTotal() {
            if (_.isEmpty(this.localDonationTypes)) {
              return false;
            }
      
            let localSingleDonations = this.localDonationTypes.filter((el) => {
              return el.paymentType == paymentTypes.single && el.amount > 0;
            });
      
            if (localSingleDonations.length > 0) {
              let t = localSingleDonations
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
                .reduce((acc, cur) => parseFloat(acc) + parseFloat(cur));
              return numberWithCommas(roundToTwo(t).toFixed(2));
            }
      
            return 0.0;
          },
        },
        mounted() {
          window.scrollTo(0, 0);
      
          this.$store.dispatch("clearStore");
          Cookies.remove("vuex");
          localStorage.removeItem("journyData");
        },
        beforeMount() {
          if (localStorage.getItem("basket")) {
            this.localDonationTypes = JSON.parse(localStorage.getItem("basket"));
          }
          let query = queryString.parse(location.search);
          if (
            typeof query.redirect_status !== "undefined" &&
            query.redirect_status == "succeeded"
          ) {
            let payload = {
              method: "IDEAL",
              PI: query.payment_intent,
            };
            this.$store.dispatch("MarkPaymentInCMS", payload);
          }
        },
        beforeRouteLeave(to, from, next) {
          this.$store.dispatch("clearStore");
          next();
        },
      };
      </script>
      
      <style scoped>
      .fix-padding {
        height: 48px;
        padding: 8px 48px 0px 31px;
      }
      .button-size {
        width: 100%;
      }
      .set-display {
        flex-direction: row;
      }
      @media (max-width: 750px) {
        .fix-padding {
          height: 48px;
          padding: 8px 48px 0px 48px;
        }
        .button-size {
          margin-left: -8px;
        }
        .fix-size {
          max-width: 327px !important;
        }
        .set-display {
          flex-direction: column;
        }
      }
      </style>
      