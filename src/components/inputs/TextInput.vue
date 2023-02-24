<template>
  <div
    class="flex flex-col justify-start align-center mb-4 md:mb-8 z-10 transition-border text-input"
  >
  
   <label
      v-if="name && !tooltip"
      class="mb-1 text-gray font-semibold sm:text-lg font-heading-2"
      :for="identity"
      v-text="label ? label : name"
    ></label>
    <div class="w-full flex justify-start" v-if="tooltip">
      <label
        v-if="name"
        class="mb-1 text-gray font-semibold sm:text-lg font-heading-2"
        :for="identity"
        v-text="label ? label : name"
      ></label>
      <div class="pl-4 donation-tool-tip"><slot name="toolTip"></slot></div>
    </div>

    <div class="relative">
      <input
        v-if="!currency"
        class="focus:outline-none w-full input-container"
        :class="{
          error: $v.value.$error,
          '-large': !small,
          '-small': small,
          'pt-0-5': small,
        }"
        type="text"
        :disabled="disabled"
        :id="identity"
        :inputmode="type == 'number' ? 'numeric' : 'text'"
        :name="name"
        :value="value"
        :ref="'input' + id"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        @input="updateValue"
      />
      <input
        v-else
        class="focus:outline-none w-full input-container -currency"
        :class="{
          error: $v.value.$error || parentError,
          '-large': !small,
          '-small': small,
        }"
        
        type="number"
        title=""
        :disabled="disabled"
        :id="identity"
        :name="name"
        :value="value"
        :ref="'input' + id"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        @input="updateValue"
      />

      <span class="text-xl currency-icon " v-if="currency">
        <span>
          <span v-if="icon.length">
            {{ icon }}
          </span>
          <span v-else>
            €
          </span>
        </span>
      </span>
    </div>

    <div
      class="error-container text-red-100 mt-4"
      v-if="$v.value.$error || parentError"
    >
      <div>
        {{ errormessage }}
      </div>
    </div>
    
  </div>
</template>

<script>
import { EventBus } from '../../utils/eventBus.js';
// import { numCheck } from '../../utils/validators';
// const isNumber = require('is-number');
// var currencyFormatter = require('currency-formatter');

export default {
  props: {
    label: {
      type: String,
      required: false,
    },
    name: {
      type: String,
    },
    id: {
      type: String,
    },
    value: {
      default: '',
    },
    placeholder: {
      type: String,
      required: false,
    },
    maxlength: {
      type: String,
      required: false,
    },
    autocomplete: {
      type: String,
      required: false,
    },
    currency: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    validators: {
      type: [Array, Object, String],
      required: false,
    },
    errormessage: {
      type: String,
      required: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    parentError: {
      default: false,
    },
    type: {
      default: '',
      required: false,
    },
    tooltip: {
      default: '',
      required: false,
    }
  },
  data() {
    return {
      identity: null,
    };
  },
  created() {
    this.initID();
  },
  validations() {
    return {
      value: {
        ...this.validators,
      },
    };
  },
  methods: {
    updateValue(event) {
      var value = event.target.value;
      
      if (this.validators) {
        this.updateValidation();
      }
      
      this.$emit('input', value);
      //Needed for donation list item component
      this.$emit('update', {
        name: this.name ? this.name : this.id,
        value,
      });
    },
    initID() {
      this.identity = 'input' + this._uid;
    },
    updateValidation() {
      this.$v.value.$touch();

      setTimeout(() => {
        let payload = {
          id: this.identity,
        };

        if (this.$v.value.$error) {
          payload = {
            ...payload,
            error: true,
            message: this.errormessage,
          };
        }
        this.$emit('errors', payload);
      }, 1);
    },
    errorCheck() {
      this.updateValidation();
    },
    clear() {
      let inputId = 'input' + this.id;
      this.$refs[inputId].value = '';
    },
  },
  mounted() {
    EventBus.$on('checkValidation', this.errorCheck);
    EventBus.$on('globalClear', this.clear);
  },
  destroyed() {
    EventBus.$off('checkValidation', this.errorCheck);
    EventBus.$off('globalClear', this.clear);
  },
};
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
