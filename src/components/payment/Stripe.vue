<template>
  <!-- Ideal element -->
  <div class="sr-root">

      
      <!-- stripe iban payments -->
       <!-- stripe iban payments end--> 
       <div class="relative">        
            <form id="payment-form">
              <div id="payment-element" :class="selected">
                <!--Stripe.js injects the Payment Element-->
              </div>
              <button id="submit">
                <div class="spinner hidden" id="spinner"></div>
              </button>
              <div id="payment-message" class="hidden"></div>
            </form>
        </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { EventBus } from "../../utils/eventBus.js";

// import { stripeKey, stripeOptions } from './stripeConfig.json'
// NZF Stripe Live Public Key
// pk_live_wTfcMP8T9UV1J2nquSuWw4a5
// pk_test_9vHHKISJgifkLvJBlEp9Xe5m00LjBegDwA

export default {
  data() {
    return {
      complete: false,
      stripe: window.Stripe("pk_test_51MUeTFF12CvoVfz6wpiI18ny7cPgxkaJS9S3mFekdR6URKi3CRVMpJRa4mXF9v6jJDfTtZEYjV0XkZUF5Y7JJ8fu00aSIE4CW2"),
      // stripe: window.Stripe("pk_live_xFuwqUNr7pWlJVb9CWsLwt9Y00g7rBDjxH", {
      //   locale: 'nl',
      // }),working key
      card: null,
      cardBrand: '',
      //new added for elemts
      getElements : "",
      cardElement: "",
      selected: "card",
      //new added for elemts
      
      stripeOptions: {
        // see https://stripe.com/docs/stripe.js#element-options for details
        paymentMethodOrder: ['card','sepa_debit'],
        fields: {
          billingDetails: {
            name: 'never',
            email: 'never',
            address: 'never'
          }
        }   
        //hidePostalCode: true,
        // hideEmail: true,
        // hideLocality: true,
        // hideAddressLine2: true,
        // hideAddressLine1: true,
        // hideaddressLine1: true,
        //hidecountry: false,
        //hideCountry: false,
      },

      // stripe iban 
      bankName: "",
      stripeIban: null,
    };
  },
  methods: {
    errorMsg(msg) {
      //this.loading = false;
      this.errors = true;
      this.msg = msg;

      setTimeout(() => {
        this.errors = false;
        this.msg = "";
      }, 5000);
    },
  ...mapState({
    stripeError: (state) => state.stripeError,
  }),

    showElement(query) {
      document.querySelector(query).classList.remove('hidden');
    },
    hideElement(query) {
      document.querySelector(query).classList.add('hidden');
    },
    loadStripeElem(){
      //console.log("loading strip from stripe componenet")
    
      var stripe = this.stripe;
      var gg =false;
      if(!gg){     
      
        let payload = {};    
        this.$store.dispatch("loadStripePyamentIntent", payload)
        .then((res) => {
          if (res.status == 200) {
            
            if (typeof res.data.message !== "undefined") {                        
              this.errorMsg(res.data.message);
            } else {
              var clientSecret = res.data.client_secret;                        
              const appearance = {
                theme: 'flat',
                variables: {
                  fontWeightNormal: '500',
                  borderRadius: '2px',
                  colorBackground: 'white',
                  colorPrimary: '#C11718',
                  colorPrimaryText: 'white',
                  spacingGridRow: '15px'
                },
                rules: {
                  '.Label': {
                    marginBottom: '6px'
                  },
                  '.Tab, .Input, .Block': {
                    boxShadow: '0px 3px 10px rgba(18, 42, 66, 0.08)',
                    padding: '12px',
                  }
                }
              };
            this.getElements = stripe.elements({clientSecret, appearance});
              const elements = this.getElements;
              EventBus.$emit("changeTitle",elements);
              EventBus.$emit("emitClientSecret",clientSecret);                      
              // const paymentElementOptions = {
              //   layout: "tabs",
              //   paymentMethodOrder: ['apple_pay', 'google_pay', 'card', 'klarna']
              // };

              // const paymentElement = elements.create("payment", paymentElementOptions);
              const paymentElement = elements.create('payment', this.stripeOptions);
              const that = this;

              paymentElement.mount("#payment-element");
              paymentElement.on('change', function(event) {
                console.log(event)
                that.selected = event.value.type;
                if (event.complete) {
                  // enable payment button
                  that.stripeError = false;
                } else {
                  that.stripeError = true;
                }
              });
              // ********END**********
            }
          } else {
            if (typeof res.data.message !== "undefined") {
              this.errorMsg(res.data.message);
            } else {
              this.errorMsg("Error processing payment details");
            }
          }
        })
        .catch((e) => {
          console.log(e)
          if (typeof e.message !== "undefined") {
            this.errorMsg("Request failed");
          } else {
            this.errorMsg("Error processing payment details");
          }
        });
      }
    },
  },
  

  mounted() {
    this.loadStripeElem();
  },
};
</script>

<style lang="scss">
button#submit {
    display: none !important;
}

.card {
  .__PrivateStripeElement iframe {
    height: 250px !important;
  }
}
.sepa_debit {
  .__PrivateStripeElement iframe {
    height: 360px !important;
  }
}

@media only screen and (max-width: 767px) {
  .card {
    .__PrivateStripeElement iframe {
      height: 300px !important;
    }
  }
  .sepa_debit {
    .__PrivateStripeElement iframe {
      height: 550px !important;
    }
  }
}

</style>
