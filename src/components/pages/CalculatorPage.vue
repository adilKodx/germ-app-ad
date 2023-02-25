<template>
  <div class="page">
    <section>
      <modal-component></modal-component>
      <scroll-container @scroll="updatePercent">
        <!--START-->
        <full-page-slide
          v-show="!calculatorFilter.hideWelcome"
          gtagId="get-started"
          class="sm:-mt-20 -first"
          :nextBtn="{
            text: 'Start berekening',
            skip: false,
            conditional: true,
            nextStep: 0,
            align: 'left',
            active: false
          }"
          :additionalBtn="{
            text: 'Ga naar Geef Zakat',
            path: getNextPageUrl,
            conditional: true,
            gtagId: 'skip-to-give-zakat',
            active: true
          }"
        >
          <h1 class="header-2 header mb-4 md:mb-12">
            {{
              getLabel(
                "Well help you calculate your Zakat to donate to worthy people in need"
              )
            }}
          </h1>
          <!-- Change sm:text-lg to sm:text-xl -->
          <p class="mb-4 md:mb-10 text-base sm:text-lg">
            {{ getLabel("Well Help You Paragraph") }}
          </p>
        </full-page-slide>

        <full-page-slide
          gtagId="filter"
          class="sm:-mt-20 -first"
          sectionId="filter-section"
          id="filter-section"
          :nextBtn="{
            text: 'Start berekening',
            skip: false,
            conditional: calculatorFilter.selected.length > 0,
            nextStep: 1,
            align: 'left',
          }"
        >
          <calculator-filter></calculator-filter>
        </full-page-slide>

        <full-page-slide
          v-show="checkId('cash-valuation')"
          sectionId="section-1"
          id="section-1"
          :saveLabel="true"
          gtagId="cash-valuation"
          :nextBtn="{
            conditional: true,
            nextStep: nextStepCalc('cash-valuation'),
            prevStep: prevStepCalc('cash-valuation'),
          }"
          :saveCalculation="{
            text: 'Sla op',
            path: '',
            conditional: true,
            padding: true,
            gtagId: 'save-zakat-calculation',
          }"
        >
          <div class="flex justify-between items-start w-full">
            <h3 class="mb-2 md:mb-4 header-2 header">
              {{ getLabel("Cash Valuation") }}
            </h3>

            <div class="ml-2 mt-4 h-8 w-4 md:hidden -tool-tip-container">
              <learn-more :offset="16">
                <template v-slot:label>
                  <div
                    class="
                      bg-gray-200
                      w-4
                      h-4
                      flex
                      justify-center
                      items-center
                      rounded-full
                      -mt-2
                      cursor-pointer
                      relative
                      z-50
                    "
                  >
                    <span
                      class="icon-container -blue h-full overflow-hidden h-full"
                    >
                      <i
                        class="
                          ion-ios-help
                          text-white
                          help-icon
                          h-full
                          flex
                          items-center
                        "
                      ></i>
                    </span>
                  </div>
                </template>

                {{ getLabel("Cash Tool Tip") }}
              </learn-more>
            </div>
          </div>
          <!-- Change body-text to sm:text-xl -->
          <p class="mb-3 md:mb-6 body-text">
            {{
              getLabel(
                "Enter in the amount of cash you own This includes stocks and shares and even savings under your mattress"
              )
            }}
          </p>

          <learn-more class="hidden md:block">
            <template v-slot:label>
              <div>
                {{ getLabel("Need help") }}
              </div>
            </template>

            {{ getLabel("Cash Tool Tip") }}
          </learn-more>

          <div class="flex flex-row flex-wrap justify-between w-full mt-6">
            <div class="w-full">
              <text-input
                placeholder="Vul bedrag in"
                :name="getLabel('Cash in hand')"
                :validators="{ amountCheck: v.amountCheck }"
                errormessage="Vul een geldige waarde in"
                v-model="userCash.inHand"
                @input="updateCash('inHand', $event)"
                class="w-full"
              ></text-input>
            </div>

            <div class="w-full">
              <text-input
                placeholder="Vul bedrag in"
                :name="getLabel('Cash in bank accounts')"
                :validators="{ amountCheck: v.amountCheck }"
                errormessage="Vul een geldige waarde in"
                v-model="userCash.inBank"
                @input="updateCash('inBank', $event)"
              ></text-input>
            </div>
          </div>

          <add-another-field
            :other-fields="userCash.other"
            asset-name="cash"
            :show="checkId('cash-valuation')"
          ></add-another-field>
         
        </full-page-slide>

        <full-page-slide
          v-show="checkId('money-owed-to-you')"
          sectionId="money-owed-to-you"
          gtagId="money-owed-to-you"
          :saveLabel="true"
          :nextBtn="{
            conditional: true,
            nextStep: nextStepCalc('money-owed-to-you'),
            prevStep: prevStepCalc('money-owed-to-you'),
          }"
          :saveCalculation="{
            text: 'Sla op',
            path: '',
            conditional: true,
            padding: true,
            gtagId: 'save-zakat-calculation',
          }"
        >
          <div class="flex justify-between w-full">
            <h3 class="text-3xl mb-2 md:mb-4 header-2 header">
              {{ getLabel("Money owed to you") }}
            </h3>

            <div class="ml-2 mt-4 h-8 w-4 sm:hidden">
              <learn-more :offset="16">
                <template v-slot:label>
                  <div
                    class="
                      bg-gray-200
                      w-4
                      h-4
                      flex
                      justify-center
                      items-center
                      rounded-full
                      -mt-2
                      cursor-pointer
                      relative
                      z-50
                    "
                  >
                    <span
                      class="icon-container -blue h-full overflow-hidden h-full"
                    >
                      <i
                        class="
                          ion-ios-help
                          text-white
                          help-icon
                          h-full
                          flex
                          items-center
                        "
                      ></i>
                    </span>
                  </div>
                </template>

                {{ getLabel("Money Owed Tool Tip") }}
              </learn-more>
            </div>
          </div>
          <!-- Change body-text to sm:text-lg -->
          <p class="mb-6 body-text">
            {{ getLabel("Money Owed Paragraph") }}
          </p>

          <learn-more class="hidden sm:block">
            <template v-slot:label>
              <div>
                {{ getLabel("Need help") }}
              </div>
            </template>

            {{ getLabel("Money Owed Tool Tip") }}
          </learn-more>

          <div
            class="
              flex flex-row flex-wrap
              justify-between
              w-full
              mt-4
              md:mt-8
              mb-2
              md:mb-4
            "
          >
            <div class="w-full">
              <text-input
                placeholder="Vul bedrag in"
                :name="getLabel('Loan')"
                :validators="{ amountCheck: v.amountCheck }"
                errormessage="Vul een geldige waarde in"
                v-model="userCash.loanOwedToYou"
                @input="updateCash('loanOwedToYou', $event)"
              ></text-input>
            </div>

            <div class="w-full">
              <text-input
                placeholder="Vul bedrag in"
                :name="getLabel('Something I have sold')"
                :validators="{ amountCheck: v.amountCheck }"
                errormessage="Vul een geldige waarde in"
                v-model="userCash.soldOwedToYou"
                @input="updateCash('soldOwedToYou', $event)"
              ></text-input>
            </div>
          </div>

          <add-another-field
            :other-fields="userAssets.moneyOwed.other"
            asset-name="moneyOwed"
            :show="checkId('money-owed-to-you')"
          ></add-another-field>
        </full-page-slide>

        <full-page-slide
          v-show="checkId('gold-and-silver')"
          sectionId="gold-and-silver"
          gtagId="gold-and-silver"
          :saveLabel="true"
          :nextBtn="{
            conditional: true,
            nextStep: nextStepCalc('gold-and-silver'),
            prevStep: prevStepCalc('gold-and-silver'),
          }"
          :saveCalculation="{
            text: 'Sla op',
            path: '',
            conditional: true,
            padding: true,
            gtagId: 'save-zakat-calculation',
          }"
        >
          <!--<div class="step">{{getLabel('Scroll up for previous question')}}</div>-->

          <div class="flex justify-between w-full">
            <h3 class="text-3xl mb-2 md:mb-4 header-2 header">
              {{ getLabel("Gold & Silver valuation") }}
            </h3>

            <div class="ml-2 mt-4 h-8 w-4 md:hidden -tool-tip-container">
              <learn-more :offset="16">
                <template v-slot:label>
                  <div
                    class="
                      bg-gray-200
                      w-4
                      h-4
                      flex
                      justify-center
                      items-center
                      rounded-full
                      -mt-2
                      cursor-pointer
                      relative
                      z-50
                    "
                  >
                    <span
                      class="icon-container -blue h-full overflow-hidden h-full"
                    >
                      <i
                        class="
                          ion-ios-help
                          text-white
                          help-icon
                          h-full
                          flex
                          items-center
                        "
                      ></i>
                    </span>
                  </div>
                </template>

                {{ getLabel("Gold Tool Tip") }}
              </learn-more>
            </div>
          </div>
          <!-- Change body-text to sm:text-lg -->
          <p class="mb-3 md:mb-6 body-text">
            {{ getLabel("Gold Paragraph") }}
          </p>

          <learn-more class="hidden md:block">
            <template v-slot:label>
              <div>
                {{ getLabel("Need help") }}
              </div>
            </template>

            {{ getLabel("Gold Tool Tip") }}
          </learn-more>

          <gold-silver-inputs></gold-silver-inputs>

          <add-another-field
            :other-fields="userAssets.goldSilver.other"
            asset-name="goldSilver"
          ></add-another-field>
        </full-page-slide>

        <full-page-slide
          v-show="checkId('shares-and-investments')"
          sectionId="shares-and-investments"
          gtagId="shares-and-investments"
          :saveLabel="true"
          :nextBtn="{
            conditional: true,
            nextStep: nextStepCalc('shares-and-investments'),
            prevStep: prevStepCalc('shares-and-investments'),
          }"
          :saveCalculation="{
            text: 'Sla op',
            path: '',
            conditional: true,
            padding: true,
            gtagId: 'save-zakat-calculation',
          }"
        >
          <!--<div class="step">{{getLabel('Scroll up for previous question')}}</div>-->

          <div class="flex justify-between w-full">
            <h3 class="text-3xl mb-4 header-2 header">
              {{ getLabel("Shares private equity investments") }}
            </h3>

            <div class="ml-2 mt-4 h-8 w-4 md:hidden -tool-tip-container">
              <learn-more :offset="16">
                <template v-slot:label>
                  <div
                    class="
                      bg-gray-200
                      w-4
                      h-4
                      flex
                      justify-center
                      items-center
                      rounded-full
                      -mt-2
                      cursor-pointer
                      relative
                      z-50
                    "
                  >
                    <span
                      class="icon-container -blue h-full overflow-hidden h-full"
                    >
                      <i
                        class="
                          ion-ios-help
                          text-white
                          help-icon
                          h-full
                          flex
                          items-center
                        "
                      ></i>
                    </span>
                  </div>
                </template>

                {{ getLabel("Shares Tool Tip") }}
              </learn-more>
            </div>
          </div>
          <!-- Change body-text to sm:text-lg -->
          <p class="mb-3 md:mb-6 body-text">
            {{ getLabel("Shares Paragraph") }}
          </p>

          <learn-more class="hidden md:block">
            <template v-slot:label>
              <div>
                {{ getLabel("Need help") }}
              </div>
            </template>

            {{ getLabel("Shares Tool Tip") }}
          </learn-more>

          <div
            class="
              flex flex-row flex-wrap
              justify-between
              w-full
              mt-4
              md:mt-8
              mb-2
            "
          >
            <div class="w-full">
              <text-input
                placeholder="Vul bedrag in"
                :name="getLabel('Shares bought to resell for capital gain')"
                :validators="{ amountCheck: v.amountCheck }"
                errormessage="Vul een geldige waarde in"
                v-model="userCash.sharesCapital"
                @input="updateCash('sharesCapital', $event)"
              >
              </text-input>
            </div>

            <div class="w-full">
              <text-input
                placeholder="Vul bedrag in"
                :name="
                  getLabel(
                    'Shares bought as a long term investment for dividend income'
                  )
                "
                :validators="{ amountCheck: v.amountCheck }"
                errormessage="Vul een geldige waarde in"
                v-model="userCash.sharesDividend"
                @input="updateCash('sharesDividend', $event)"
              >
              </text-input>
            </div>
          </div>
        </full-page-slide>

        <full-page-slide
          v-show="checkId('pensions')"
          sectionId="pensions"
          gtagId="pensions"
          :saveLabel="true"
          :nextBtn="{
            conditional: true,
            nextStep: nextStepCalc('pensions'),
            prevStep: prevStepCalc('pensions'),
          }"
          :saveCalculation="{
            text: 'Sla op',
            path: '',
            conditional: true,
            padding: true,
            gtagId: 'save-zakat-calculation',
          }"
          class="pension-container"
        >
          <div class="flex justify-between w-full">
            <h3 class="text-3xl mb-4 header-2 header">
              {{ getLabel("Pensions") }}
            </h3>

            <div class="ml-2 mt-4 h-8 w-4 md:hidden -tool-tip-container">
              <learn-more :offset="16">
                <template v-slot:label>
                  <div
                    class="
                      bg-gray-200
                      w-4
                      h-4
                      flex
                      justify-center
                      items-center
                      rounded-full
                      -mt-2
                      cursor-pointer
                      relative
                      z-50
                    "
                  >
                    <span
                      class="icon-container -blue h-full overflow-hidden h-full"
                    >
                      <i
                        class="
                          ion-ios-help
                          text-white
                          help-icon
                          h-full
                          flex
                          items-center
                        "
                      ></i>
                    </span>
                  </div>
                </template>

                {{ getLabel("Pension Tool Tip") }}
              </learn-more>
            </div>
          </div>
          <!-- Change body-text to sm:text-lg -->
          <p class="mb-3 md:mb-6 body-text">
            {{ getLabel("Pension Paragraph") }}
          </p>

          <learn-more class="hidden md:block">
            <template v-slot:label>
              <div>
                {{ getLabel("Need help") }}
              </div>
            </template>

            {{ getLabel("Pension Tool Tip") }}
          </learn-more>

          <div
            class="
              flex flex-row flex-wrap
              justify-between
              w-full
              mt-5
              md:mt-10
              mb-4
            "
          >
            <radio
              :buttons="[
                {
                  name: getLabel('I know the Zakatable amount of my pension'),
                  value: 1,
                  selected: calculationSettings.pensionKnown == 1,
                },
                {
                  name: getLabel(
                    'I don’t know the Zakatable amount of my pension'
                  ),
                  value: 2,
                  selected: calculationSettings.pensionKnown == 2,
                },
              ]"
              @change="togglePension"
              :required="false"
              :full-width="true"
              :border="true"
              :largeLabel="false"
            ></radio>
          </div>

          <slide-up-down
            :active="calculationSettings.pensionKnown == 1"
            class="flex w-full"
            :key="2"
          >
            <div class="w-full">
              <text-input
                placeholder="Vul bedrag in"
                amount:name="getLabel('Full amount')"
                :validators="{ amountCheck: v.amountCheck }"
                errormessage="Vul een geldige waarde in"
                v-model="userAssets.cash.pension"
                @input="updateCash('pension', $event)"
              >
              </text-input>
            </div>
          </slide-up-down>
          <slide-up-down
            :active="calculationSettings.pensionKnown == 2"
            class="flex w-full flex-col sm:flex-row"
            :key="1"
          >
            <div class="w-full sm:w-1/2 sm:mr-2 pb-4 md:pb-8 sm:pb-0 z-10">
              <div class="mb-1 text-gray font-semibold sm:text-lg">
                {{ getLabel("Type of pension scheme") }}
              </div>

              <select-input
                :options="pensionOptions"
                @click="selectPension"
                name="pensionSelect"
                :value="zakatCalculation.selectedPension"
              >
              </select-input>
            </div>

            <div class="w-full sm:w-1/2 sm:ml-2 z-0">
              <text-input
                placeholder="Vul bedrag in"
                :name="getLabel('Full amount')"
                :validators="{ amountCheck: v.amountCheck }"
                errormessage="Vul een geldige waarde in"
                v-model="userAssets.cash.pension"
                @input="updateCash('pension', $event)"
              >
              </text-input>
            </div>
          </slide-up-down>
        </full-page-slide>

        <full-page-slide
          v-show="checkId('isas')"
          sectionId="isas"
          gtagId="isas"
          :saveLabel="true"
          :nextBtn="{
            conditional: true,
            nextStep: nextStepCalc('isas'),
            prevStep: prevStepCalc('isas'),
          }"
          :saveCalculation="{
            text: 'Sla op',
            path: '',
            conditional: true,
            padding: true,
            gtagId: 'save-zakat-calculation',
          }"
        >
          <!--<div class="step">{{getLabel('Scroll up for previous question')}}</div>-->

          <div class="flex justify-between w-full">
            <h3 class="text-3xl mb-4 header-2 header">
              {{ getLabel("ISA’s, junior ISA’s & child trust funds") }}
            </h3>

            <div class="ml-2 mt-4 h-8 w-4 md:hidden -tool-tip-container">
              <learn-more :offset="16">
                <template v-slot:label>
                  <div
                    class="
                      bg-gray-200
                      w-4
                      h-4
                      flex
                      justify-center
                      items-center
                      rounded-full
                      -mt-2
                      cursor-pointer
                      relative
                      z-50
                    "
                  >
                    <span
                      class="icon-container -blue h-full overflow-hidden h-full"
                    >
                      <i
                        class="
                          ion-ios-help
                          text-white
                          help-icon
                          h-full
                          flex
                          items-center
                        "
                      ></i>
                    </span>
                  </div>
                </template>

                {{ getLabel("ISA Tool Tip") }}
              </learn-more>
            </div>
          </div>
          <!-- Change body-text to sm:text-lg -->
          <p class="mb-3 md:mb-6 body-text">
            {{ getLabel("ISA Paragraph") }}
          </p>

          <learn-more class="hidden md:block">
            <template v-slot:label>
              <div>
                {{ getLabel("Need help") }}
              </div>
            </template>

            {{ getLabel("ISA Tool Tip") }}
          </learn-more>

          <div
            class="flex flex-row flex-wrap justify-between w-full mt-4 md:mt-8"
          >
            <div class="w-full">
              <text-input
                placeholder="Vul bedrag in"
                :name="getLabel('Stocks & shares ISA/CTF')"
                :validators="{ amountCheck: v.amountCheck }"
                errormessage="Vul een geldige waarde in"
                v-model="userCash.sharesInvestments"
                @input="updateCash('sharesInvestments', $event)"
              >
              </text-input>
            </div>

            <div class="w-full">
              <text-input
                placeholder="Vul bedrag in"
                :name="getLabel('Cash ISA')"
                :validators="{ amountCheck: v.amountCheck }"
                errormessage="Vul een geldige waarde in"
                v-model="userCash.cashIsa"
                @input="updateCash('cashIsa', $event)"
              >
              </text-input>
            </div>
          </div>

          <add-another-field
            :other-fields="userAssets.investment.other"
            asset-name="investment"
            :show="checkId('isas')"
          ></add-another-field>
        </full-page-slide>

        <full-page-slide
          v-show="checkId('crypto')"
          sectionId="crypto"
          gtagId="crypto"
          :saveLabel="true"
          :nextBtn="{
            conditional: true,
            nextStep: nextStepCalc('crypto'),
            prevStep: prevStepCalc('crypto'),
          }"
          :saveCalculation="{
            text: 'Sla op',
            path: '',
            conditional: true,
            padding: true,
            gtagId: 'save-zakat-calculation',
          }"
        >
          <div class="flex justify-between w-full">
            <h3 class="text-3xl mb-4 header-2 header">
              {{ getLabel("Crypto assets") }}
            </h3>

            <div class="ml-2 mt-4 h-8 w-4 md:hidden -tool-tip-container">
              <learn-more :offset="16">
                <template v-slot:label>
                  <div
                    class="
                      bg-gray-200
                      w-4
                      h-4
                      flex
                      justify-center
                      items-center
                      rounded-full
                      -mt-2
                      cursor-pointer
                      relative
                      z-50
                    "
                  >
                    <span
                      class="icon-container -blue h-full overflow-hidden h-full"
                    >
                      <i
                        class="
                          ion-ios-help
                          text-white
                          help-icon
                          h-full
                          flex
                          items-center
                        "
                      ></i>
                    </span>
                  </div>
                </template>

                {{ getLabel("Crypto Tool Tip") }}
              </learn-more>
            </div>
          </div>
          <!-- Change body-text to sm:text-lg -->
          <p class="mb-3 md:mb-6 body-text">
            {{ getLabel("Crypto Paragraph") }}
          </p>

          <learn-more class="hidden md:block">
            <template v-slot:label>
              <div>
                {{ getLabel("Need help") }}
              </div>
            </template>

            {{ getLabel("Crypto Tool Tip") }}
          </learn-more>

          <div
            class="flex flex-row flex-wrap justify-between w-full mt-4 md:mt-8"
          >
            <div class="w-full">
              <text-input
                placeholder="Vul bedrag in"
                :name="getLabel('Current cash valuation')"
                :validators="{ amountCheck: v.amountCheck }"
                errormessage="Vul een geldige waarde in"
                v-model="userCash.crypto"
                @input="updateCash('crypto', $event)"
              >
              </text-input>
            </div>
          </div>

          <add-another-field
            :other-fields="userAssets.crypto.other"
            asset-name="crypto"
            :show="checkId('crypto')"
          ></add-another-field>
        </full-page-slide>

        <full-page-slide
          v-show="checkId('business-assets')"
          sectionId="business-assets"
          gtagId="business-assets"
          :saveLabel="true"
          :nextBtn="{
            conditional: true,
            nextStep: nextStepCalc('business-assets'),
            prevStep: prevStepCalc('business-assets'),
          }"
          :saveCalculation="{
            text: 'Sla op',
            path: '',
            conditional: true,
            padding: true,
            gtagId: 'save-zakat-calculation',
          }"
        >
          <!--<div class="step">{{getLabel('Scroll up for previous question')}}</div>-->

          <div class="flex justify-between w-full">
            <h3 class="text-3xl mb-4 header-2 header">
              {{ getLabel("Business Assets") }}
            </h3>

            <div class="ml-2 mt-4 h-8 w-4 md:hidden -tool-tip-container">
              <learn-more :offset="16">
                <template v-slot:label>
                  <div
                    class="
                      bg-gray-200
                      w-4
                      h-4
                      flex
                      justify-center
                      items-center
                      rounded-full
                      -mt-2
                      cursor-pointer
                      relative
                      z-50
                    "
                  >
                    <span
                      class="icon-container -blue h-full overflow-hidden h-full"
                    >
                      <i
                        class="
                          ion-ios-help
                          text-white
                          help-icon
                          h-full
                          flex
                          items-center
                        "
                      ></i>
                    </span>
                  </div>
                </template>

                {{ getLabel("Business Tool Tip") }}
              </learn-more>
            </div>
          </div>
          <!-- Change body-text to sm:text-lg -->
          <p class="mb-3 md:mb-6 body-text">
            {{ getLabel("Business Paragraph") }}
          </p>

          <learn-more class="hidden md:block">
            <template v-slot:label>
              <div>
                {{ getLabel("Need help") }}
              </div>
            </template>

            {{ getLabel("Business Tool Tip") }}
          </learn-more>

          <div
            class="flex flex-row flex-wrap justify-between w-full mt-4 md:mt-8"
          >
            <div class="w-full">
              <text-input
                placeholder="Vul bedrag in"
                :name="getLabel('Cash')"
                :validators="{ amountCheck: v.amountCheck }"
                errormessage="Vul een geldige waarde in"
                v-model="userBusinessAssets.cash"
                @input="updateBusiness('cash', $event)"
              >
              </text-input>
            </div>

            <div class="w-full">
              <text-input
                placeholder="Vul bedrag in"
                :name="getLabel('Receivables')"
                :validators="{ amountCheck: v.amountCheck }"
                errormessage="Vul een geldige waarde in"
                v-model="userBusinessAssets.receivables"
                @input="updateBusiness('receivables', $event)"
              >
              </text-input>
            </div>

            <div class="w-full">
              <text-input
                placeholder="Vul bedrag in"
                :name="getLabel('Stock')"
                :validators="{ amountCheck: v.amountCheck }"
                errormessage="Vul een geldige waarde in"
                v-model="userBusinessAssets.stock"
                @input="updateBusiness('stock', $event)"
              >
              </text-input>
            </div>
          </div>

          <add-another-field
            :other-fields="userBusinessAssets.other"
            asset-name="businessAssets"
            :show="checkId('business-assets')"
          ></add-another-field>
        </full-page-slide>

        <full-page-slide
          v-show="checkId('liabilities')"
          sectionId="liabilities"
          gtagId="liabilities"
          :saveLabel="true"
          :nextBtn="{
            conditional: true,
            nextStep: nextStepCalc('liabilities'),
            prevStep: prevStepCalc('liabilities'),
          }"
          :saveCalculation="{
            text: 'Sla op',
            path: '',
            conditional: true,
            padding: true,
            gtagId: 'save-zakat-calculation',
          }"
        >
          <!--<div class="step">{{getLabel('Scroll up for previous question')}}</div>-->

          <div class="flex justify-between w-full">
            <h3 class="text-3xl mb-4 header-2 header">
              {{ getLabel("liabilitiesmoney You Owe") }}
            </h3>

            <div class="ml-2 mt-4 h-8 w-4 md:hidden -tool-tip-container">
              <learn-more :offset="16">
                <template v-slot:label>
                  <div
                    class="
                      bg-gray-200
                      w-4
                      h-4
                      flex
                      justify-center
                      items-center
                      rounded-full
                      -mt-2
                      cursor-pointer
                      relative
                      z-50
                    "
                  >
                    <span
                      class="icon-container -blue h-full overflow-hidden h-full"
                    >
                      <i
                        class="
                          ion-ios-help
                          text-white
                          help-icon
                          h-full
                          flex
                          items-center
                        "
                      ></i>
                    </span>
                  </div>
                </template>

                {{ getLabel("Liabilities Tool Tip") }}
              </learn-more>
            </div>
          </div>
          <!-- Change body-text to sm:text-lg -->
          <p class="mb-6 body-text">
            {{ getLabel("Liabilities Paragraph") }}
          </p>

          <learn-more class="hidden md:block">
            <template v-slot:label>
              <div>
                {{ getLabel("Need help") }}
              </div>
            </template>

            {{ getLabel("Liabilities Tool Tip") }}
          </learn-more>

          <div class="w-full mt-4 md:mt-8">
            <div class="flex w-full flex-wrap">
              <div class="w-full">
                <text-input
                  placeholder="Vul bedrag in"
                  :name="getLabel('Mortgage')"
                  :validators="{ amountCheck: v.amountCheck }"
                  errormessage="Vul een geldige waarde in"
                  v-model="userLiabilities.housePayments"
                  @input="updateLiabilities('housePayments', $event)"
                >
                </text-input>
              </div>

              <div class="w-full">
                <text-input
                  placeholder="Vul bedrag in"
                  :name="getLabel('Utility bills')"
                  :validators="{ amountCheck: v.amountCheck }"
                  errormessage="Vul een geldige waarde in"
                  v-model="userLiabilities.bills"
                  @input="updateLiabilities('bills', $event)"
                >
                </text-input>
              </div>
            </div>

            <div class="flex w-full flex-wrap sm:flex-no-wrap">
              <div class="w-full">
                <text-input
                  placeholder="Vul bedrag in"
                  :name="getLabel('Personal loans')"
                  :validators="{ amountCheck: v.amountCheck }"
                  errormessage="Vul een geldige waarde in"
                  v-model="userLiabilities.borrowed"
                  @input="updateLiabilities('borrowed', $event)"
                >
                </text-input>
              </div>
            </div>
          </div>

          <add-another-field
            :other-fields="userLiabilities.other"
            asset-name="liabilities"
            :show="checkId('liabilities')"
          ></add-another-field>
        </full-page-slide>

        <full-page-slide
          v-show="calculatorFilter.selected.length > 0"
          gtagId="your-zakat-calculation"
          sectionId="display-zakat-section"
          :saveLabel="true"
          :nextBtn="zakatNextButton"
          class="-z-40"
          :saveCalculation="{
            text: 'Sla op',
            path: '',
            conditional: true,
            padding: true,
            gtagId: 'save-zakat-calculation',
          }"
        >
          <display-zakat></display-zakat>
        </full-page-slide>
      </scroll-container>
    </section>
  </div>
</template>

<script>
import Radio from "../inputs/Radio";
import GoldSilverInputs from "../GoldSilverInputs";
import ScrollContainer from "../scroll/ScrollContainer";
import SelectInput from "../inputs/SelectInput";
import TextInput from "../inputs/TextInput";
import LearnMore from "../inputs/LearnMorePopUp";
import { mapFields } from "vuex-map-fields";
import { mapGetters, mapState } from "vuex";
import AddAnotherField from "../AddAnotherField";
import FullPageSlide from "../FullPageSlide";
import { paths } from "../../utils/GlobalVars.js";
// import { calcPercentOfNum } from '../../utils/helpers.js';
import { EventBus } from "../../utils/eventBus.js";
import DisplayZakat from "../DisplayZakat";
import CalculatorFilter from "../CalculatorFilter";

import validators from "../../utils/validators";
import { paymentTypes } from "../../utils/GlobalVars";
import ModalComponent from "../ModalComponent";
const BigNumber = require("bignumber.js");

export default {
  metaInfo: {
    title: "Zakat Calculator | Nationaal Zakat Fonds",
    meta: [
      {
        name: "description",
        content:
          "Gebruik de eenvoudige calculator van het Nationaal Zakat Fonds om uit te zoeken wat je aan Zakat verschuldigd bent. Bereken hier jouw Zakat.",
      },
    ],
  },
  name: "CalculatorPage",
  components: {
    FullPageSlide,
    AddAnotherField,
    TextInput,
    Radio,
    SelectInput,
    ScrollContainer,
    LearnMore,
    GoldSilverInputs,
    DisplayZakat,
    CalculatorFilter,
    ModalComponent,
  },
  data() {
    return {
      selected: "",
      localCash: {},
      pensionKnown: 0,
      showPension: false,
      progress: 0,
      cash: {
        inHand: null,
      },
    };
  },
  methods: {
    // openZakchat(){
    //     window.openZakChat('national-zakat-foundation-uk')
    // },
    togglePension(val) {
      this.calculationSettings.showPension =
        val == 1 || val == 2 ? true : false;
      this.calculationSettings.pensionKnown = val;
      this.userAssets.cash.pension = "";

      if (this.calculationSettings.pensionKnown == 1) {
        this.selectedPension = "";
      } else if (val == 2) {
        this.selectedPension = "Obligaties";

        EventBus.$emit("resetSelect", {
          name: "pensionSelect",
          val: this.selectedPension,
        });
      }
    },
    selectPension(val) {
      this.selectedPension = val;
    },
    updatePercent(val) {
      this.progress = val * 10;
    },
    updateCash(name, value) {
      // value = value.replace(',','')
      this.$store.commit("SET_CASH", {
        name,
        value,
      });
    },
    updateLiabilities(name, value) {
      // value = value.replace(',','')
      this.$store.commit("SET_LIABILITIES", {
        name,
        value,
      });
    },
    updateBusiness(name, value) {
      // value = value.replace(',','')
      this.$store.commit("SET_BUSINESS", {
        name,
        value,
      });
    },
    updateUserAsset(name, value) {
      // value = value.replace(',','')
      this.$store.commit("SET_ASSET", {
        name,
        value,
      });
    },
    showRound() {
      return false;
      // return this.getZakatCalc() % 10;
    },
    checkId(id) {
      let check = this.calculatorFilter.selected
        .map((el) => el.name)
        .includes(id);

      this.clear(check, id);

      return check;
    },
    clear(check, id) {
      if (!check) {
        if (id == "cash-valuation") {
          this.userCash.inHand = "";
          this.userCash.inBank = "";
        } else if (id == "pensions") {
          this.userAssets.cash.pension = "";
          this.$store.commit("CLEAR_PENSION_TYPE");
        } else if (id == "isas") {
          this.$store.commit("CLEAR_INVESTMENTS");
        } else if (id == "gold-and-silver") {
          this.userAssets.gold = "";
          this.userAssets.silver = "";
        } else if (id == "crypto") {
          this.userCash.crypto = "";
        } else if (id == "money-owed-to-you") {
          this.userCash.loanOwedToYou = "";
          this.userCash.soldOwedToYou = "";
        } else if (id == "shares-and-investments") {
          this.userCash.sharesCapital = "";
          this.userCash.sharesDividend = "";
        } else if (id == "business-assets") {
          this.userBusinessAssets.cash = "";
          this.userBusinessAssets.receivables = "";
          this.userBusinessAssets.stock = "";
        } else if (id == "liabilities") {
          this.userLiabilities.housePayments = "";
          this.userLiabilities.bills = "";
          this.userLiabilities.borrowed = "";
          this.userLiabilities.overdraft = "";
          this.userLiabilities.credit = "";
          this.userLiabilities.tax = "";
        }
      }
    },
    nextStepCalc(id) {
      let calcArr = this.calculatorFilter.selected.map((el) => el.name);

      if (calcArr.length > 0 && calcArr.indexOf(id) > -1) {
        let next = calcArr.indexOf(id) + 2;

        return next;
      }
    },
    prevStepCalc(id) {
      let calcArr = this.calculatorFilter.selected.map((el) => el.name);

      if (calcArr.length > 0 && calcArr.indexOf(id) > -1) {
        let next = calcArr.indexOf(id);

        if (next < 0) {
          next = 0;
        }

        return next;
      }
    },
  },
  computed: {
    getNextPageUrl(){
      let checkNext = localStorage.getItem('last-route');
      if(checkNext === '/'){
        checkNext = '/geef-zakat';
      }
      return checkNext
    },
    pensionOptions() {
      return Object.keys(this.pensions);
    },
    ...mapFields({
      userAssets: "user.assets",
      userCash: "user.assets.cash",
      userOwed: "user.assets.owedToYou",
      userBusinessAssets: "user.assets.businessAssets",
      userLiabilities: "user.assets.liabilities",
      labels: "labels",
      pensions: "zakatCalculation.pensions",
      selectedPension: "zakatCalculation.selectedPension",
      calculationSettings: "calculationSettings",
      transitions: "transitions",
      deliveryCost: "calculationSettings.deliveryCost",
      userZakat: "user.userZakat",
    }),
    ...mapGetters(["getLabel", "getOriginalZakat", "getZakatCalc", "getZakat"]),
    ...mapState({
      zakatCalculation: (state) => state.zakatCalculation,
      calculatorFilter: (state) => state.calculatorFilter,
    }),
    zakatNextButton() {
      // console.log(this.showRound())
      // if (this.showRound()) {
      //   return {
      //     conditional: true,
      //     nextStep: this.calculatorFilter.selected.length,
      //     prevStep: this.calculatorFilter.selected.length,
      //   };
      // } else {
        return {
          text: "Ga verder",
          skip: false,
          path: "/geef-zakat",
          conditional: true,
        };
      // }
    },
    paths() {
      return paths;
    },
    v() {
      return { ...validators };
    },
  },
  mounted() {
    window.scrollTo(0, 0);
    localStorage.setItem('last-route', '/bereken');
    this.$store.dispatch("deleteDonation", 3);

    this.deliveryCost = 2;

    EventBus.$emit("setValue", {
      id: "deliver-btns",
      val: 2,
    });

    if (
      this.calculationSettings.pensionKnown == 2 &&
      this.selectedPension.length == 0
    ) {
      EventBus.$emit("resetSelect", {
        name: "pensionSelect",
        val: "Obligaties",
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    this.userZakat = this.getZakat();
    let zakat = {
      name: "Zakat",
      amount: 0,
      id: 0,
      paymentType: paymentTypes.single,
    };

    // if(this.deliveryCost == 2){
    //     zakat.amount = (new BigNumber(this.userZakat)).minus(new BigNumber(calcPercentOfNum(this.userZakat, deliveryPercent))).toFixed();
    // }
    zakat.amount = new BigNumber(this.userZakat); //.minus(new BigNumber(calcPercentOfNum(this.userZakat, deliveryPercent))).toFixed();

    this.$store.dispatch("updateZakat", zakat);

    next();
  },
};
</script>

<style scoped></style>
