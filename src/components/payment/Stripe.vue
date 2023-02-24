<template>
  <!-- Ideal element -->
  <div class="sr-root">
    <div class="sr-main">
      <div class="sr-picker">
        <!-- <button class="sr-pm-button selected" id="ideal-button">iDEAL</button>
        <button class="sr-pm-button" id="card-button">
          Creditcard
        </button>  
             -->
        <!-- <button class="sr-pm-button" id="stripe-button">
          SEPA Direct Debit
        </button> -->
        <!-- <button class="sr-pm-button" id="stripe-button">
          Credit Card
        </button> -->
      </div>
      <!-- stripe iban payments -->
      <!-- <div class="sr-payment-form card">
        <div class="sr-combo-inputs-row">
          <div
            class="
              sr-input sr-element sr-iban-element
              StripeElement StripeElement--empty
              form-control
            "
            id="iban-element"
          >
           
          </div>
        </div>
        <div id="bank-name" class="text-success pt-3"></div>
        <div class="sr-field-error" id="iban-errors" role="alert"></div>
      </div> -->
       <!-- stripe iban payments end--> 
       <div class="relative">        
            <form id="payment-form">
              <div id="payment-element">
                <!--Stripe.js injects the Payment Element-->
              </div>
              <button id="submit">
                <div class="spinner hidden" id="spinner"></div>
              </button>
              <div id="payment-message" class="hidden"></div>
            </form>
        </div>   

      <!-- stripe elemts payment  -->
     
      <!-- stripe elemts payment end -->
      <!-- <div class="error-container text-red-100 mt-4" id="card-errors"></div> -->
      <!-- <div class="sr-result hidden">
        <p>Betaling voltooid<br /></p>
        <pre>
          <code></code>
        </pre>
      </div> -->
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
      
      stripe: window.Stripe("pk_live_xFuwqUNr7pWlJVb9CWsLwt9Y00g7rBDjxH", {
        locale: 'nl',
      }),
      card: null,
      cardBrand: '',
      //new added for elemts
      getElements : "",
      cardElement: "",
      //new added for elemts
      
      stripeOptions: {
        // see https://stripe.com/docs/stripe.js#element-options for details
        paymentMethodOrder: ['card','sepa_debit'],        
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
      console.log('adil loadStripeElem')
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
                          var clientSecret =res.data.client_secret;                        
                          const appearance = {
                          theme: 'stripe',
                          labels: 'floating'
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

                          paymentElement.mount("#payment-element");                        
                          // ********END**********
                        }
                      } else {
                        console.log('4')
                        if (typeof res.data.message !== "undefined") {
                          this.errorMsg(res.data.message);
                        } else {
                          this.errorMsg("Error processing payment details");
                        }
                      }
                    })
                    .catch((e) => {
                      console.log('5')
                      console.log(e)
                      if (typeof e.message !== "undefined") {
                        // this.errorMsg(e.message);
                        //Request failed with status code 422
                        this.errorMsg("Request failed");
                      } else {
                        this.errorMsg("Error processing payment details");
                      }
                    });
      }
    },
  //   loadStripeIban() {
  //   var stripe = this.stripe;
  //   var elements = stripe.elements();
  //   var style = {
  //     base: {
  //       color: "#32325d",
  //       fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
  //       fontSmoothing: "antialiased",
  //       fontSize: "16px",
  //       "::placeholder": {
  //         color: "#aab7c4",
  //       },
  //     },
  //     invalid: {
  //       color: "#fa755a",
  //       iconColor: "#fa755a",
  //     },
  //   };
  //   var styleIdeal = { ...style, ...{ base: { padding: "10px 12px" } } };
  //   // Create an instance of the iban Element.
  //   var iban = elements.create("iban", {
  //     style: styleIdeal,
  //     supportedCountries: ["SEPA"],
  //   });
  //   // Add an instance of the iban Element into the `iban-element` <div>.
  //   iban.mount("#iban-element");
  //   this.stripeIban = iban;
  //   var errorMessage = document.getElementById("iban-errors");
  //   var bankName = document.getElementById("bank-name");
  //   iban.on("change", (event) => {
  //     // Handle real-time validation errors from the iban Element.
  //     if (event.error) {
  //       errorMessage.textContent = event.error.message;
  //       errorMessage.classList.add("visible");
  //       this.stripeError = true;
  //     } else {
  //       errorMessage.classList.remove("visible");
  //       this.stripeError = false;
  //     }

  //     // Display bank name corresponding to IBAN, if available.
  //     if (event.bankName) {
  //       bankName.textContent = event.bankName;
  //       this.bankName = event.brand;
  //       bankName.classList.add("visible");
  //     } else {
  //       bankName.classList.remove("visible");
  //     }
  //   });
  // },
    
  },
  

  mounted() {
    this.loadStripeElem();
    //this.loadStripeIban();


   

    // var stripe = this.stripe;
    // var elements = stripe.elements();
    // var style = {
    //   base: {
    //     color: '#32325d',
    //     fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    //     fontSmoothing: 'antialiased',
    //     fontSize: '16px',
    //     '::placeholder': {
    //       color: '#aab7c4',
    //     },
    //   },
    //   invalid: {
    //     color: '#fa755a',
    //     iconColor: '#fa755a',
    //   },
    // };
    // var styleIdeal = { ...style, ...{ base: { padding: '10px 12px' } } };
    // this.card = elements.create('card', {
    //   style: style,
    //   hidePostalCode: true,
    // });
    // this.card.mount('#card-element');

    // this.ideal = elements.create('idealBank', { style: styleIdeal });
    // this.ideal.mount('#ideal-bank-element');

    // document.querySelectorAll('.sr-pm-button').forEach((el) => {
    //   el.addEventListener('click', (evt) => {
    //     var id = evt.target.id;
    //     if (id === 'card-button') {
    //       this.showElement('#card-element');
    //       this.hideElement('#ideal-bank-element');
    //       document.querySelector('#card-button').classList.add('selected');
    //       document.querySelector('#ideal-button').classList.remove('selected');
    //       document.querySelector('#stripe-button').classList.remove('selected');
    //     } else if(id === 'ideal-button') {
    //       this.hideElement('#card-element');
    //       this.showElement('#ideal-bank-element');
    //       document.querySelector('#card-button').classList.remove('selected');
    //       document.querySelector('#ideal-button').classList.add('selected');
    //       document.querySelector('#stripe-button').classList.remove('selected');
    //     } else {
    //       this.hideElement('#card-element');
    //       this.showElement('#ideal-bank-element');
    //       document.querySelector('#card-button').classList.remove('selected');
    //       document.querySelector('#ideal-button').classList.remove('selected');
    //       document.querySelector('#stripe-button').classList.add('selected');
    //     }
    //   });
    // });

    // var cardElement = elements.getElement('card');
    // cardElement.on('change', (event) => {
    //   let displayError = document.getElementById('card-errors');
    //   if (event.complete) {
    //     // enable payment button
    //     this.cardBrand = event.brand
    //     displayError.textContent = '';
    //   } else if (event.error) {
    //     displayError.textContent = event.message;
    //   }
    // });
  },
};
</script>

<style lang="scss">

button#submit {
    display: none !important;
}


/* Ideal web element */
/* Variables */
:root {
  --body-color: rgb(247, 250, 252);
  --accent-color: #1d9868;
  --secondary-color: rgb(30, 166, 114);
  --link-color: #ffffff;
  --font-color: rgb(105, 115, 134);
  --body-font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  --radius: 6px;
  --form-width: 400px;
}

/* Layout */
.sr-root {
  .sr-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    align-self: center;
    padding: 50px;
    background: var(--body-color);
    border-radius: var(--radius);
    box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
      0px 2px 5px 0px rgba(50, 50, 93, 0.1),
      0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
  }

  .sr-picker {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
    button {
      background: none !important;
      border: none;
      padding: 0 !important;
      /*optional*/
      font-family: arial, sans-serif;
      /*input has OS specific font-family*/
      color: #c11718;
      cursor: pointer;
      width: 100%;
      box-shadow: none;
      border-radius: 0;
    }
  }
  .sr-picker button:hover,
  .sr-picker button:focus,
  .sr-picker button.selected {
    outline: none;
    box-shadow: none;
    border-radius: 0;
  }
  .sr-picker button {
    border-bottom: 2px solid #ccc;
  }

  .sr-picker button:hover,
  .sr-picker button:focus {
    border-bottom: 2px solid #c11718;
  }
  .sr-picker button.selected {
    border-bottom: 2px solid #c11718;
  }
  .sr-field-error {
    color: var(--font-color);
    text-align: left;
    font-size: 13px;
    line-height: 17px;
    margin-top: 12px;
  }
}

/* Inputs */
.sr-input,
.sr-root input[type='text'] {
  border: 1px solid var(--gray-border);
  border-radius: var(--radius);
  padding: 5px 12px;
  height: 44px;
  width: 100%;
  transition: box-shadow 0.2s ease;
  background: white;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
}
.sr-root .sr-input:focus,
.sr-root input[type='text']:focus,
.sr-root button:focus,
.sr-root .focused {
  box-shadow: 0 0 0 1px rgba(50, 151, 211, 0.3), 0 1px 1px 0 rgba(0, 0, 0, 0.07),
    0 0 0 4px rgba(50, 151, 211, 0.3);
  outline: none;
  z-index: 9;
}
.sr-input::placeholder,
.sr-root input[type='text']::placeholder {
  color: var(--gray-light);
}
.sr-result {
  height: 44px;
  -webkit-transition: height 1s ease;
  -moz-transition: height 1s ease;
  -o-transition: height 1s ease;
  transition: height 1s ease;
  color: var(--font-color);
  overflow: auto;
}
.sr-result code {
  overflow: scroll;
}
.sr-result.expand {
  height: 350px;
}

.sr-combo-inputs-row {
  box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
    0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
  border-radius: 7px;
}

/* Buttons and links */
.sr-root button {
  background: var(--accent-color);
  border-radius: var(--radius);
  color: white;
  border: 0;
  padding: 12px 16px;
  margin-top: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: block;
  box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
  width: 100%;
}
.sr-root button:hover {
  filter: contrast(115%);
}
.sr-root button:active {
  transform: translateY(0px) scale(0.98);
  filter: brightness(0.9);
}
.sr-root button:disabled {
  opacity: 0.5;
  cursor: none;
}

.sr-root a {
  color: var(--link-color);
  text-decoration: none;
  transition: all 0.2s ease;
}

.sr-root a:hover {
  filter: brightness(0.8);
}

.sr-root a:active {
  filter: brightness(0.5);
}

/* Code block */
.sr-root code,
pre {
  font-family: 'SF Mono', 'IBM Plex Mono', 'Menlo', monospace;
  font-size: 12px;
}

/* Stripe Element placeholder */
.sr-card-element {
  padding-top: 12px;
}

/* Responsiveness */
@media (max-width: 720px) {
  .sr-root {
    flex-direction: column;
    justify-content: flex-start;
    padding: 48px 20px;
    min-width: 320px;
  }

  .sr-header__logo {
    background-position: center;
  }

  .sr-payment-summary {
    text-align: center;
  }

  .sr-content {
    display: none;
  }

  .sr-main {
    width: 100%;
    height: 305px;
    background: rgb(247, 250, 252);
    box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
      0px 2px 5px 0px rgba(50, 50, 93, 0.1),
      0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
    border-radius: 6px;
  }
}

/* todo: spinner/processing state, errors, animations */

.sr-root .spinner,
.spinner:before,
.spinner:after {
  border-radius: 50%;
}
.spinner {
  color: #ffffff;
  font-size: 22px;
  text-indent: -99999px;
  margin: 0px auto;
  position: relative;
  width: 20px;
  height: 20px;
  box-shadow: inset 0 0 0 2px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}
.spinner:before,
.spinner:after {
  position: absolute;
  content: '';
}
.spinner:before {
  width: 10.4px;
  height: 20.4px;
  background: var(--accent-color);
  border-radius: 20.4px 0 0 20.4px;
  top: -0.2px;
  left: -0.2px;
  -webkit-transform-origin: 10.4px 10.2px;
  transform-origin: 10.4px 10.2px;
  -webkit-animation: loading 2s infinite ease 1.5s;
  animation: loading 2s infinite ease 1.5s;
}
.spinner:after {
  width: 10.4px;
  height: 10.2px;
  background: var(--accent-color);
  border-radius: 0 10.2px 10.2px 0;
  top: -0.1px;
  left: 10.2px;
  -webkit-transform-origin: 0px 10.2px;
  transform-origin: 0px 10.2px;
  -webkit-animation: loading 2s infinite ease;
  animation: loading 2s infinite ease;
}

@-webkit-keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

/* Animated form */

.sr-root {
  animation: 0.4s form-in;
  animation-fill-mode: both;
  animation-timing-function: ease;
}

.sr-root .hidden {
  display: none;
}

@keyframes field-in {
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
}

@keyframes form-in {
  0% {
    opacity: 0;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

// stripe styleing css 

/* Variables */
* {
  box-sizing: border-box;
}


#payment-message {
  color: rgb(105, 115, 134);
  font-size: 16px;
  line-height: 20px;
  padding-top: 12px;
  text-align: center;
}

#payment-element {
  margin-bottom: 24px;
}

/* Buttons and links */
button {
 /* background: #5469d4; */
  font-family: Arial, sans-serif;
  color: #ffffff;
  border-radius: 4px;
  border: 0;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: none;
  transition: all 0.2s ease;
  /* box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07); */
  width: 100%;
}
button:hover {
  filter: contrast(115%);
}
button:disabled {
  opacity: 0.5;
  cursor: default;
}

/* spinner/processing state, errors */
.spinner,
.spinner:before,
.spinner:after {
  border-radius: 50%;
}
.spinner {
  color: #ffffff;
  font-size: 22px;
  text-indent: -99999px;
  margin: 0px auto;
  position: relative;
  width: 20px;
  height: 20px;
  box-shadow: inset 0 0 0 2px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}
.spinner:before,
.spinner:after {
  position: absolute;
  content: "";
}
.spinner:before {
  width: 10.4px;
  height: 20.4px;
  background: #5469d4;
  border-radius: 20.4px 0 0 20.4px;
  top: -0.2px;
  left: -0.2px;
  -webkit-transform-origin: 10.4px 10.2px;
  transform-origin: 10.4px 10.2px;
  -webkit-animation: loading 2s infinite ease 1.5s;
  animation: loading 2s infinite ease 1.5s;
}
.spinner:after {
  width: 10.4px;
  height: 10.2px;
  background: #5469d4;
  border-radius: 0 10.2px 10.2px 0;
  top: -0.1px;
  left: 10.2px;
  -webkit-transform-origin: 0px 10.2px;
  transform-origin: 0px 10.2px;
  -webkit-animation: loading 2s infinite ease;
  animation: loading 2s infinite ease;
}
.__PrivateStripeElement {
  height: 220px;
}
@-webkit-keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@media only screen and (max-width: 600px) {
  form {
    width: 80vw;
    min-width: initial;
  }
}




#payment-message {
  color: rgb(105, 115, 134);
  font-size: 16px;
  line-height: 20px;
  padding-top: 12px;
  text-align: center;
}

#payment-element {
  margin-bottom: 24px;
}

/* Buttons and links */
button {
 /* background: #5469d4; */
  font-family: Arial, sans-serif;
  color: #ffffff;
  border-radius: 4px;
  border: 0;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: none;
  transition: all 0.2s ease;
  /* box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07); */
  width: 100%;
}
button:hover {
  filter: contrast(115%);
}
button:disabled {
  opacity: 0.5;
  cursor: default;
}

/* spinner/processing state, errors */
.spinner,
.spinner:before,
.spinner:after {
  border-radius: 50%;
}
.spinner {
  color: #ffffff;
  font-size: 22px;
  text-indent: -99999px;
  margin: 0px auto;
  position: relative;
  width: 20px;
  height: 20px;
  box-shadow: inset 0 0 0 2px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}
.spinner:before,
.spinner:after {
  position: absolute;
  content: "";
}
.spinner:before {
  width: 10.4px;
  height: 20.4px;
  background: #5469d4;
  border-radius: 20.4px 0 0 20.4px;
  top: -0.2px;
  left: -0.2px;
  -webkit-transform-origin: 10.4px 10.2px;
  transform-origin: 10.4px 10.2px;
  -webkit-animation: loading 2s infinite ease 1.5s;
  animation: loading 2s infinite ease 1.5s;
}
.spinner:after {
  width: 10.4px;
  height: 10.2px;
  background: #5469d4;
  border-radius: 0 10.2px 10.2px 0;
  top: -0.1px;
  left: 10.2px;
  -webkit-transform-origin: 0px 10.2px;
  transform-origin: 0px 10.2px;
  -webkit-animation: loading 2s infinite ease;
  animation: loading 2s infinite ease;
}
.__PrivateStripeElement {
  height: 220px;
}
@-webkit-keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@media only screen and (max-width: 600px) {
  form {
    width: 80vw;
    min-width: initial;
  }
}

</style>
