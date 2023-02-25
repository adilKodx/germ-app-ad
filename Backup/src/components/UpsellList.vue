<template>
  <div class="w-full">
    <div class="mb-8">
      <h3 class="header header-2 mb-4">
        {{ getLabel('How you can help NZF go even further') }}
      </h3>
      <!-- Change sub-text to sm:text-lg -->
      <p class="sub-text">
        {{ getLabel('Support Paragraph') }}
      </p>
    </div>

    <div class="gift-table flex flex-col">
      <!-- #START# Campain Input -->
      <div class="flex relative z-20" v-if="getOption('energycampain')">
        <donation-list-item
          :text="campainDisplayName"
          id="3-energiecompensatie"
          :showTitle="true"
          :value="getValue('3-energiecompensatie')"
          name="3-energiecompensatie"
          :border="false"
          @update="updateDonations"
        >
          <template v-slot:toolTip>
            <tool-tip
              :text="getLabel('Campain Tool Tip')"
              class="flex justify-start "
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
              id="3-energiecompensatie"
              :name="'Energiecompensatie'"
            ></preset-donation>
          </template>
        </donation-list-item>
      </div>
      <!-- #END# Campain Input -->
      <div class="flex relative z-20">
        <donation-list-item
          :text="sadaqahDisplayName"
          id="2-sadaqah"
          :showTitle="true"
          :value="getValue('2-sadaqah')"
          name="2-sadaqah"
          :border="false"
          @update="updateDonations"
        >
          <template v-slot:toolTip>
            <tool-tip
              :text="getLabel('Sadaqah Tool Tip')"
              class="flex justify-start "
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

      <div class="relative z-10 mt-8">
        <donation-list-item
          :text="ribbahDisplayName"
          id="3-riba"
          :showTitle="true"
          name="3-riba"
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
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import DonationListItem from './DonationListItem';
import { mapFields } from 'vuex-map-fields';
import {
  paymentTypes,
  donationNames,
  sadaqahDisplayName,
  ribbahDisplayName,
  campainDisplayName
} from '../utils/GlobalVars';
import ToolTip from '../components/inputs/ToolTip';
import PresetDonation from '../components/PresetDonation';
import _ from 'lodash';

export default {
  components: { DonationListItem, ToolTip, PresetDonation },
  data() {
    return {
      donation: 0,
    };
  },
  methods: {
    deleteDonation(id) {
      this.$store.dispatch('deleteDonation', id);
    },
    updateDonations(val) {
      val.amount =
        val.amount > 0 && val.amount ? parseFloat(val.amount) : val.amount;

      if (
        val.amount == 0 &&
        this.donationTypes.some(
          (el) => el.id == val.id && val.amount.indexOf('.') == -1
        )
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
    getOption(val){
        let gate = this.options.filter(itm=>itm.alias == val)
        if(gate.length > 0){                    
            return gate[0].active == 'Yes' ? true : false
        } else {
            return false
        }
    },
  },
  computed: {
    selectOptions() {
      return [
        paymentTypes.single
      ];
    },
    donationNames() {
      return donationNames;
    },
    ...mapState({
      donationTypes: (state) => state.donation.donationTypes,
      options: (state) => state.options,
    }),
    ...mapFields(['donation.donationTypes', 'donation.donationSplit']),
    ...mapGetters([
      'getLabel',
      'getSingleDonations',
      'getSingleDonationsTotal',
    ]),
    campainDisplayName() {
      return campainDisplayName;
    },
    sadaqahDisplayName() {
      return sadaqahDisplayName;
    },
    ribbahDisplayName() {
      return ribbahDisplayName;
    },
  },
};
</script>

<style scoped></style>
