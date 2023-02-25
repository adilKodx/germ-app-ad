<template>
        
    <div class="flex flex-col items-center justify-center antialiased">
      <div  class="overflow-hidden rounded-2xl w-full" v-cloak>
        <!-- Tabs -->
        <div
          v-show="isTabsActive"
          class="bg-white border-t border-l border-r border-gray-200 rounded-t-2xl"
        >
          <div id="tabs-container" class="relative h-40 overflow-hidden transition-all" :class="{'h-64': activeTab === 'Sadaqah'}">
            <ul class="p-6">
              <div v-for="(tab, index) in tabs" :key="index">
                <li v-show="activeTab == tab.title" class="space-y-4">
                  <slot name="Zakat" v-if="tab.title == 'Zakat'"></slot>
                  <slot name="Sadaqah" v-if="tab.title == 'Sadaqah'"></slot>
                  <slot name="Fidyah_Kaffarah" v-if="tab.title == 'Fidyah/Kaffarah'"></slot>
                  <slot name="Riba" v-if="tab.title == 'Riba'"></slot>
                </li>
              </div>
            </ul>
          </div>
        </div>
        <div
          class="relative flex items-center overflow-hidden bg-white border-t border-l border-r border-gray-200">
          <div class="flex items-center justify-center h-12 lg:gap-4 gap-14 xs:gap-5 lg:px-6 px-2 w-full text-sm"
          >
            <p v-if="sadaqah == true" class="header-6 text-center font-bold" :class="{'text-black': activeTab === 'Zakat'}">Zakat <span class="block">{{ format(singleDonationsAmount.zakat) }} </span> </p>
            <p v-if="sadaqah == false" class="header-6 text-center font-bold" :class="{'text-black': activeTab === 'Sadaqah'}">Sadaqah  <span class="block">{{ format(singleDonationsAmount.sadaqah) }}</span> </p>
            <p  class="header-6 text-center font-bold" :class="{'text-black': activeTab === 'Fidyah/Kaffarah'}">Fidyah <span class="block ">{{ format(singleDonationsAmount.fidyah) }}
            </span>
          </p>
            <p  class="header-6 text-center font-bold" :class="{'text-black': activeTab === 'Riba'}">Riba<span class="block"> {{ format(singleDonationsAmount.riba) }}</span></p>
          </div>
        </div>
        <div
          class="relative flex items-center overflow-hidden bg-white border border-gray-200 rounded-b-2xl"
        >
          <nav class="flex items-center justify-center h-20 gap-4 px-6 w-full">
            <div v-for="(link, index) in tabs" :key="index">
              <a
                href="#"
                @click="setActiveTab($event, link.title, index)"
                class="grid w-20 h-16 grid-cols-1 grid-rows-1"
              >
                <span class="sr-only" v-text="link.title"></span>
                <div
                  class="grid-row flex items-center justify-center w-20 h-12 transition-opacity duration-300 border shadow-lg rounded-xl "
                  :class="activeTab != link.title ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
                  v-html="link.inActiveIcon"
                ></div>
                <div
                  class="grid-row flex items-center justify-center w-20 h-12 transition-opacity duration-300 header text-black border border-red-300 shadow-md rounded-xl "
                  :class="activeTab == link.title ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
                  v-html="link.activeIcon"
                ></div>
              </a>
            </div>
          </nav>
          <!-- Indicator -->
          <div
            id="indicator"
            class="absolute w-6 h-8 transition-all duration-300 bg-red-300 rounded-full bottom-4  lg:left-44 md:left-60 left-16"
          >
            <div
              class="slide-left absolute w-5 h-5 bg-white -left-4 bottom-1/2 rounded-br-3xl"
            ></div>
            <div
              class="slide-right absolute w-5 h-5 bg-white -right-4 bottom-1/2 rounded-bl-3xl"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </template>
<script>
import PerfectScrollbar from 'perfect-scrollbar';
import queryString from "query-string";
import { mapGetters } from "vuex";
import { currencyFormat } from "../utils/helpers";
export default {
  name: "DonationTabs",
  data() {
          
            return {
                isTabsActive: true,
                activeTab: "",
                sadaqah : "",
                tabs: [],
                newData : [],
            }
        },  
        props: {
            fullHeight: {
                default: true,
                type: Boolean
            },
        },
        methods: {
            format(num) {
              return num ? currencyFormat(num) : "";
            },
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
        },  
        mounted() {
           this.sadaqah = "/geef-sadaqah" in queryString.parse(location.pathname);

          if(this.sadaqah) {
            this.activeTab = "Zakat"
            this.tabs = [
                        {
                            title: "Zakat",
                            content:"Input data",
                            inActiveIcon: `<img src="/static/img/zakat.png" class="p-4 w-16 h-16" alt="Zakat" />`,
                            activeIcon: `<img src="/static/img/zakatActive.png" class="p-4 w-16 h-16" alt="Zakat" />`,
                        },
                        {
                            title: "Fidyah/Kaffarah",
                            content:"Input data",
                            inActiveIcon: `<img src="/static/img/iconfidyah.png" class="p-4 w-16 h-16" alt="Fidyah / Kaffarah" />`,
                            activeIcon: `<img src="/static/img/iconactivefidyah.png" class="p-4 w-16 h-16" alt="Fidyah / Kaffarah" />`,
                        },
                        {
                            title: "Riba",
                            content:"Input data.",
                            inActiveIcon: `<img src="/static/img/iconriba.png" class="p-4 w-16 h-16" alt="Riba / Interest" />`,
                            activeIcon: `<img src="/static/img/iconactiveriba.png" class="p-4 w-16 h-16" alt="Riba / Interest" />`,
                        },

                    ];
          } else {
            this.activeTab = "Sadaqah"
            this.tabs = [
                        {
                            title: "Sadaqah",
                            content:"Input data",
                            inActiveIcon: `<img src="/static/img/iconsadaqah.png" class="p-4 w-16 h-16" alt="Sadaqah" />`,
                            activeIcon: `<img src="/static/img/iconactivesadaqah.png" class="p-4 w-16 h-16" alt="Sadaqah" />`,
                        },
                        {
                            title: "Fidyah/Kaffarah",
                            content:"Input data",
                            inActiveIcon: `<img src="/static/img/iconfidyah.png" class="p-4 w-16 h-16" alt="Fidyah / Kaffarah" />`,
                            activeIcon: `<img src="/static/img/iconactivefidyah.png" class="p-4 w-16 h-16" alt="Fidyah / Kaffarah" />`,
                        },
                        {
                            title: "Riba",
                            content:"Input data.",
                            inActiveIcon: `<img src="/static/img/iconriba.png" class="p-4 w-16 h-16" alt="Riba / Interest" />`,
                            activeIcon: `<img src="/static/img/iconactiveriba.png" class="p-4 w-16 h-16" alt="Riba / Interest" />`,
                        },
                    ];
          }
          
        },
        computed: {
            id(){
                return this.sectionId || 'page' + this._uid;
            },
            singleDonationsAmount() {
              return this.getSingleDonationAmountDetails();
            },
            ...mapGetters([
              "getSingleDonationAmountDetails",
            ]),
        }
    }
</script>
<style scoped>
.grid {
  display: grid;
  grid-template-rows: repeat(1, minmax(0, 1fr));
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}
.gap-4 {
  gap: 1rem;
}
.gap-14 {
  gap: 3.5rem;
}
.grid-row {
  grid-row: 1;
  grid-column: 1;
}
.slide-left {
  box-shadow: rgb(193 23 24) 0px 10px 0px; left: -1rem;
}
.slide-right {
  box-shadow: rgb(193 23 24) 0px 10px 0px; right: -1rem;
}
#indicator {
  bottom: -1rem;
}
</style>
