<template>
  <div class="w-full">
    <div class="mb-8" v-if="isZakat">
      <h1 class="header header-2 mb-2">
        {{ getLabel('Your donations and payment types') }}
      </h1>
      <!-- Add sm:text-lg -->
      <p class="text text-gray-400">
        {{
          getLabel(
            'Select your type of donation and how you would like to pay below'
          )
        }}
      </p>
    </div>
    <div class="mb-8" v-if="isSadaqah">
      <h3 class="header header-2 mb-2">
        {{ getLabel('How you can help NZF go even further') }}
      </h3>
      <!-- Change sub-text to sm:text-lg -->
      <p class="sub-text">
        {{ getLabel('Support Paragraph') }}
      </p>
    </div>

    <div class="gift-table flex flex-col mb-4">
      <!--<accordion-item title="Zakat" :open="true">-->
      <div class="flex relative z-20" v-if="isZakat">
        <donation-list-item
          :showTitle="true"
          text="Zakat"
          name="zakat-item"
          donationType="single"
          :value="zakatInit"
          id="0"
          @update="updateDonations"
        >
        </donation-list-item>
      </div>

      <div class="flex relative z-20" v-if="isSadaqah">
              <donation-list-item
                :text="sadaqahDisplayName"
                id="2-sadaqah"
                :showTitle="true"
                :value="getValue('2-sadaqah')"
                name="2-sadaqah"
                :border="false"
                @update="updateDonations"
                donationType="single"
              >
                <template v-slot:toolTip>
                  <tool-tip
                    :text="getLabel('Sadaqah Tool Tip')"
                    class="flex justify-start"
                    :width="'50%'"
                  >
                    <div
                      class="bg-gray-200 w-4 h-4 flex justify-center items-center rounded-full cursor-pointer relative z-50"
                    >
                      <span
                        class="icon-container -blue h-full overflow-hidden h-full"
                      >
                        <i
                          class="ion-ios-help text-white help-icon h-full flex items-center"
                        ></i>
                      </span>
                    </div>
                  </tool-tip>
                </template>

                <template v-slot:preset>
                  <preset-donation
                    id="2-sadaqah"
                    :name="donationNames.sad + ' (vrijwillige donaties)'"
                  ></preset-donation>
                </template>
              </donation-list-item>
            </div>
      <!--</accordion-item>-->

      <hr v-if="zakatUlFitr" />

      <div class="flex relative z-10" slot="item" v-if="zakatUlFitr">
        <donation-list-item
          text="Koop een 'Eid pakket"
          @update="updateDonations"
          id="3-zakat-ul-fitir"
          :value="getValue('3-zakat-ul-fitir')"
          donationType="single"
          :showTitle="true"
          :row="false"
          :border="false"
        >
          <template v-slot:toolTip>
            <tool-tip
              :text="getLabel('Eid Pakket Tool Tip')"
              class="flex justify-start"
              :width="'50%'"
            >
              <div
                class="bg-gray-200 w-4 h-4 flex justify-center items-center rounded-full cursor-pointer relative z-50"
              >
                <span
                  class="icon-container -blue h-full overflow-hidden h-full"
                >
                  <i
                    class="ion-ios-help text-white help-icon h-full flex items-center"
                  ></i>
                </span>
              </div>
            </tool-tip>
          </template>

          <template v-slot:preset>
            <preset-donation-eid
              id="3-zakat-ul-fitir"
              :name="'Koop een \'Eid pakket'"
            ></preset-donation-eid>
          </template>
        </donation-list-item>
      </div>

      <!-- <hr /> -->

      <!-- <accordion-item
        title="Fidyah/Kaffarah"
        :open="getValue('4-kaffarah') > 0 ? true : false"
      >
        <template v-slot="toolTip">
          <tool-tip
            :text="getLabel('Fidyah Kaffarah Tool Tip')"
            class="flex justify-end"
            :width="'50%'"
          >
            <div
              class="bg-gray-200 w-4 h-4 flex justify-center items-center rounded-full cursor-pointer relative z-50"
            >
              <span class="icon-container -blue h-full overflow-hidden h-full">
                <i
                  class="ion-ios-help text-white help-icon h-full flex items-center"
                ></i>
              </span>
            </div>
          </tool-tip>
        </template>

        <div class="flex relative" slot="item">
          <donation-list-item
            text="Fidyah/Kaffarah"
            @update="updateDonations"
            id="4-kaffarah"
            :value="getValue('4-kaffarah')"
            donationType="single"
          >
          </donation-list-item>
        </div>
      </accordion-item> -->
      <!-- new tabs  -->
      <donation-tabs>
        <template v-slot:Zakat>
          <div class="flex relative z-20">
            <donation-list-item
              :showTitle="true"
              text="Zakat"
              name="zakat-item"
              donationType="single"
              :value="zakatInit"
              id="0"
              @update="updateDonations"
            >
            </donation-list-item>
          </div>
        </template>
        <template v-slot:Sadaqah>
          <div class="flex relative z-20" >
              <donation-list-item
                :text="sadaqahDisplayName"
                id="2-sadaqah"
                :showTitle="true"
                :value="getValue('2-sadaqah')"
                name="2-sadaqah"
                :border="false"
                @update="updateDonations"
                donationType="single"
              >
                <template v-slot:toolTip>
                  <tool-tip
                    :text="getLabel('Sadaqah Tool Tip')"
                    class="flex justify-start"
                    :width="'50%'"
                  >
                    <div
                      class="bg-gray-200 w-4 h-4 flex justify-center items-center rounded-full cursor-pointer relative z-50"
                    >
                      <span
                        class="icon-container -blue h-full overflow-hidden"
                      >
                        <i
                          class="ion-ios-help text-white help-icon h-full flex items-center"
                        ></i>
                      </span>
                    </div>
                  </tool-tip>
                </template>

                <template v-slot:preset>
                  <preset-donation
                    id="2-sadaqah"
                    :name="donationNames.sad + ' (vrijwillige donaties)'"
                  ></preset-donation>
                </template>
              </donation-list-item>
            </div>
        </template>
        <template v-slot:Fidyah_Kaffarah>

                        <div class="flex relative" slot="item">
                          <donation-list-item
                            text="Fidyah/Kaffarah"
                            :showTitle="true"
                            :border="false"
                            @update="updateDonations"
                            id="4-kaffarah"
                            :value="getValue('4-kaffarah')"
                            donationType="single"
                          >
                          <template v-slot:toolTip>
                          <tool-tip
                            :text="getLabel('Fidyah Kaffarah Tool Tip')"
                            class="flex justify-start"
                            :width="'50%'"
                          >
                            <div
                              class="bg-gray-200 w-4 h-4 flex justify-center items-center rounded-full cursor-pointer relative z-50"
                            >
                              <span
                                class="icon-container -blue h-full overflow-hidden h-full"
                              >
                                <i
                                  class="ion-ios-help text-white help-icon h-full flex items-center"
                                ></i>
                              </span>
                            </div>
                          </tool-tip>
                        </template>
                          </donation-list-item>
                        </div>
        </template>
        <template v-slot:Riba>
          <div class="relative z-10" >
              <donation-list-item
                :text="ribbahDisplayName"
                id="3-riba"
                :showTitle="true"
                name="3-riba"
                donationType="single"
                :value="getValue('3-riba')"
                @update="updateDonations"
              >
                <template v-slot:toolTip>
                  <tool-tip
                    :text="getLabel('Riba Tool Tip')"
                    class="flex justify-start"
                    :width="'50%'"
                  >
                    <div
                      class="bg-gray-200 w-4 h-4 flex justify-center items-center rounded-full cursor-pointer relative z-50"
                    >
                      <span
                        class="icon-container -blue h-full overflow-hidden h-full"
                      >
                        <i
                          class="ion-ios-help text-white help-icon h-full flex items-center"
                        ></i>
                      </span>
                    </div>
                  </tool-tip>
                </template>
              </donation-list-item>
            </div>
        </template>
      </donation-tabs>

      <!-- new tabs end -->
      <!--<div class="flex mt-4 mb-12">-->
      <!--<router-link to="/support" class="text-blue-100 text-sm font-semibold cursor-pointer">-->
      <!--{{ getLabel('I want to give Sadaqah or Riba') }}-->
      <!--</router-link>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import DonationListItem from './DonationListItem';
import DonationTabs from './DonationTabs.vue';
// import AccordionItem from './AccordionItem';
// import UpsellList from './UpsellList.vue';
// import TabsItems from './TabsItems.vue';
import { mapFields } from 'vuex-map-fields';
import {
  paymentTypes,
  deliveryFeeText,
  deliveryPercent,
  sadaqahDisplayName,
  ribbahDisplayName,
  donationNames,
  deliveryFeeTextNoAddOn,
} from '../utils/GlobalVars';
import { calcPercentOfNum } from '../utils/helpers';
import _ from 'lodash';
import { EventBus } from '../utils/eventBus';
import ToolTip from '../components/inputs/ToolTip';
import PresetDonationEid from '../components/PresetDonationEid';
import PresetDonation from '../components/PresetDonation';
import PerfectScrollbar from 'perfect-scrollbar';
import queryString from "query-string";
const BigNumber = require('bignumber.js');

export default {
  components: { DonationTabs, DonationListItem, ToolTip, PresetDonationEid, PresetDonation },
  data() {
    return {
      donation: 0,
      zakatValue: 0,
      zakatInit: '',
      msg: 'error!',
      errors: false,
      isSadaqah: false,
      isZakat: false
    };
  },
  methods: {
    setActiveTab(e, link, index) {
                let ps;

                const tabsContainer = document.querySelector("#tabs-container");
                ps = new PerfectScrollbar(tabsContainer);

        e.preventDefault();

        this.activeTab = link;
        if (ps) {
          ps.update();
        }

        document.querySelector(
          "#indicator"
          /* TODO: use link (width / 2 ) */
        ).style.transform = `translateX(calc(${96 * index}px))`;
      },
    deleteDonation(id) {
      this.$store.dispatch('deleteDonation', id);
    },
    updateDonations(val) {
      // val.amount = val.amount.replace(',','')
      val.amount =
        val.amount < 1 && val.amount ? parseFloat(val.amount) : val.amount;

      if (val && val.id == 0) {
        this.zakatInit = val.amount
        let deliveryFee;

        // Calc amount based on delivery option
        if (this.deliveryCost == 2) {
          // Store raw value in userZakat

          this.userZakat = val.amount;
          // Use userZakat for delivery fee calculation
          deliveryFee = new BigNumber(
            calcPercentOfNum(this.userZakat, deliveryPercent)
          );

          let amount = new BigNumber(val.amount).toFixed();
          val.amount = amount;

          this.$store.dispatch('addDonation', {
            name: deliveryFeeTextNoAddOn,
            amount: deliveryFee,
            id: 3,
            paymentType: this.donationTypes[0].paymentType,
          });
          // Deduct Delivery fee from amount
          // val.amount = amount.minus(deliveryFee).toFixed();
        } else {
          // If delivery fee is bing added back on then re add delivery fee to zakat
          this.userZakat = new BigNumber(val.amount).toFixed();
          // Calc delivery fee
          deliveryFee = new BigNumber(
            calcPercentOfNum(this.userZakat, deliveryPercent)
          );

          // Set Delivery Fee
          this.$store.dispatch('addDonation', {
            name: deliveryFeeText,
            amount: deliveryFee,
            id: 3,
            paymentType: this.donationTypes[0].paymentType,
          });
        }

        // Update Zakat and donation split
        this.$store.dispatch('updateZakat', val);
        this.$store.dispatch('updateDonationsAmount', this.donationSplit);

        EventBus.$emit('zakatUpdated', this.getAllocatableZakat());

        if (this.donationTypes.find((el) => el.id === 3)) {
          this.donationTypes.find((el) => el.id === 3).paymentType =
            val.paymentType;
        }

        return false;
      }

      if (
        val &&
        val.amount == 0 &&
        this.donationTypes.some((el) => el.id == val.id)
      ) {
        this.$store.dispatch('deleteDonation', val.id);
      } else {
        this.$store.dispatch('addDonation', val);
      }
    },
    getValue(id) {
      let index = _.findIndex(this.donationTypes, (el) => {
        return el.id == id;
      });

      return this.donationTypes[index] ? this.donationTypes[index].amount : '';
    },
    setZakat(val) {
      this.zakatInit = val ? val : '';
      this.userZakat = this.zakatInit;
    },
  },
  computed: {
    selectOptions() {
      return [paymentTypes.single];
    },
    ...mapState({
      donationTypes: (state) => state.donation.donationTypes,
      zakatUlFitr: (state) => (state.settings.zakatulfitr == 1 ? true : false),
    }),
    ...mapGetters([
      'getZakat',
      'getLabel',
      'getSingleDonations',
      'getSingleDonationsTotal',
      'getZakatDeliveryCost',
      'getOriginalZakat',
      'getAllocatableZakat',
    ]),
    ...mapFields([
      'donation.donationTypes',
      'donation.donationSplit',
      'calculationSettings.deliveryCost',
      'user.userZakat',
    ]),
    donationNames() {
      return donationNames;
    },
    ribbahDisplayName() {
      return ribbahDisplayName;
    },
    sadaqahDisplayName() {
      return sadaqahDisplayName;
    },
  },
  mounted() {
    this.zakatInit = this.userZakat > 0 ? this.userZakat : '';
    const sadaqah = "/geef-sadaqah" in queryString.parse(location.pathname);

    if(sadaqah) {
      this.activeInput = "Sadaqah"
      this.isZakat = false;
      this.isSadaqah = true;
    } else {
      this.activeInput = "Zakat"
      this.isSadaqah = false;
      this.isZakat = true;
    }
    EventBus.$on('zakatUpdateDonationItem', this.setZakat);
  },
  destroyed() {
    EventBus.$off('zakatUpdatedChart', this.setZakat);
  },
};
</script>

<style scoped></style>
