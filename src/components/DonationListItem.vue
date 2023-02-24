<template>
  <div class="w-full" :class="{ 'sm:flex': row, 'items-center': row }">
    <div
      class="sm:pr-4 text-black text-xl sm:text-2xl font-semibold flex"
      :class="{
        'w-1/5': row,
        'w-full': !row,
        'mb-2 sm:mb-4': row,
        'mb-2': !row,
      }"
      v-if="showTitle"
    >
      <div class="w-full flex justify-start">
        <!--<span class="mr-2 header header-3">{{text}}</span>-->
        <span class="mr-2 font-heading-2">{{ text }}</span>
        <div class="donation-tool-tip"><slot name="toolTip"></slot></div>
      </div>

      <!--<div class="w-40 sm:w-1/2 flex justify-start"></div>-->
    </div>

    <div :class="{ 'donation-item-border': border }">
      <slot name="preset"></slot>

      <div class="donation-list-item-inputs" :class="{ 'w-full': row }">
        <div
          class="text-input-container"
          :class="{
            'error-container': validationErrors,
            'w-full': donationType == 'single',
            'w-full sm:w-1/2': donationType !== 'single',
            // 'sm:pr-2 ': donationType !== 'single',
          }"
        >
          <!--<div class="font-semibold text-lg text-gray-500">{{getLabel('Donation Amount')}}</div>-->

          <text-input
            @update="updateDonation"
            :id="text"
            :value="value"
            placeholder="Vul bedrag in"
          >
          </text-input>

          <div
            class="error-container donation-item-error text-red-100 mb-6"
            v-if="errors || validationErrors"
          >
            <div>Vul een geldige waarde in</div>
          </div>
        </div>

        <div
          v-if="donationType !== 'single'"
          class="w-full sm:pl-2 sm:w-1/2 select-input-container"
          :class="{ 'mb-4 md:mb-0': !border }"
        >

          <div class="relative block" v-if="donationType !== 'single'">
            <select-input
              @click="updateSelect"
              :options="selectOptions"
              :value="paymentType"
              :name="name"
            >
            </select-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TextInput from "./inputs/TextInput";
import SelectInput from "./inputs/SelectInput";
import validators from "../utils/validators";
import { mapGetters, mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
import _ from "lodash";
import { deliveryFeeText, paymentTypes } from "../utils/GlobalVars";
import { EventBus } from "../utils/eventBus.js";
import { amountCheck } from "../utils/validators";

export default {
  components: { TextInput, SelectInput },
  props: [
    "value",
    "text",
    "id",
    "showTitle",
    "name",
    "row",
    "donationType",
    "border",
  ],
  data() {
    return {
      selectOptions: [paymentTypes.single],
      donation: {
        name: "",
        amount: "",
        paymentType: "",
        id: null,
      },
      errors: false,
      localPaymentType: "",
      validationErrors: false,
    };
  },
  methods: {
    updateDonation(val) {
      // EventBus.$emit('clearPresets', this.name);

      this.donation = {
        ...this.donation,
        amount: val.value.replace(",", ""),
        name: val.name,
        paymentType: this.calcPaymentType,
        selectedPaymentType: this.calcPaymentType,
      };

      if (this.donation.amount >= 0) {
        // _.debounce(() => {
        this.$emit("update", this.donation);
        // }, 100);
      }

      this.validationErrors = !amountCheck(this.donation.amount);
    },
    updateSelect(val) {
      // EventBus.$emit('clearPresets', this.name);

      this.donation = {
        ...this.donation,
        // amount: this.getValue(this.donation.id) > 0 ? this.getValue(this.donation.id) : '',
        amount: this.value,
        paymentType: val,
        selectedPaymentType: val,
      };

      this.localPaymentType = val;

      // if(this.donation.amount > 0){
      this.$emit("update", this.donation);
      // }
    },
    getValue(id) {
      let index = _.findIndex(this.donationTypes, (el) => {
        return el.id == id;
      });

      return this.donationTypes[index] ? this.donationTypes[index].amount : "";
    },
    setSelect(payload) {
      if (payload.name == this.id) {
        this.localPaymentType = payload.val;
      }
    },
    clearError() {
      setTimeout(() => {
        this.globalErrors = [];
      }, 5000);
    },
  },
  computed: {
    calcPaymentType() {
      if (this.id != "0") {
        return this.localPaymentType || this.paymentType;
      } else {
        return this.paymentType;
      }
    },
    v() {
      return { ...validators };
    },
    ...mapGetters(["getLabel", "getRegularDonations"]),
    ...mapState({
      donationTypes: (state) => state.donation.donationTypes,
    }),
    ...mapFields(["errors.globalErrors"]),
    localRegulation() {
      return this.getRegularDonations().filter((el) => el.id !== 0);
    },
    regularDonationNoZakat() {
      let regDonations = this.getRegularDonations();

      if (regDonations.length > 0) {
        return regDonations
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
      } else {
        return false;
      }
    },
    paymentType() {
      let item = this.donationTypes.find((x) => x.id == this.id);

      return item ? item.paymentType : paymentTypes.single;
    },
    paymentTypes() {
      return paymentTypes;
    },
  },
  mounted() {
    this.donation = {
      ...this.donation,
      name: this.text,
      amount: this.value,
      id: this.id ? this.id : this._uid,
      paymentType: this.paymentType,
    };

    this.localPaymentType = this.paymentType;
    this.$store.dispatch("setPaymentType", {
      selectedPaymentType: this.paymentType,
    });

    EventBus.$on("resetSelect", this.setSelect);
  },
  destroyed() {
    EventBus.$off("resetSelect", this.setSelect);
  },
};
</script>

<style scoped>
</style>
