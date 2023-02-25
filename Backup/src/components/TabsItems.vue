<template>
    <div
      class="flex flex-col items-center justify-center  antialiased"
    >
    <div v-data="tabs" class="overflow-hidden rounded-2xl" v-cloak>
        <!-- Tabs -->
        <div
          v-show="isTabsActive"
          v-collapse
          class="bg-white border-t-4 border-green border-x-4 rounded-t-2xl"
        >
          <div id="tabs-container" class="relative h-64 overflow-hidden">
            <ul class="p-6">
              <div v-for="(tab, index) in tabs" :key="index">
                <li v-show="activeTab == tab.title" class="space-y-4">
                  <h2
                    v-text="(new String(tab.title)).replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))"
                    class="text-3xl text-gray-700"
                  ></h2>
                  <p
                    class="max-w-md text-base text-gray-500"
                    v-text="tab.content"
                  ></p>
                </li>
              </div>
            </ul>
          </div>
        </div>
  
        <div
          class="relative flex items-center overflow-hidden bg-white border-4 border-green rounded-b-2xl"
        >
          <nav class="flex items-center justify-center h-20 gap-8 px-6">
            <div v-for="(link, index) in links" :key="index">
              <a
                href="#"
                @click="setActiveTab($event, link.title, index)"
                class="grid w-16 h-16 grid-cols-1 grid-rows-1"
              >
                <span class="sr-only" v-text="link.title"></span>
                <div
                  class="col-[1/1] row-[1/1] flex items-center justify-center w-16 h-16 transition-opacity duration-300"
                  :class="activeTab != link.title ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
                  v-html="link.inActiveIcon"
                ></div>
                <div
                  class="col-[1/1] row-[1/1] flex items-center justify-center w-16 h-16 transition-opacity duration-300"
                  :class="activeTab == link.title ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
                  v-html="link.activeIcon"
                ></div>
              </a>
            </div>
          </nav>
  
          <!-- Show/Hide button -->
          <button
            @click="isTabsActive = !isTabsActive"
            class="absolute z-10 flex items-center justify-center gap-2 transition-all bg-green"
            :class="isTabsActive ? 'left-0 top-0 w-8 h-8 rounded-br-lg' : 'w-full h-full inset-0'"
          >
            <svg
              v-show="!isTabsActive"
              class="w-6 h-6 text-white animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
  
            <svg
              v-show="isTabsActive"
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
  
            <span v-show="!isTabsActive" class="text-white">Click to Open</span>
          </button>
  
           <!-- Indicator -->
      <div
           id="indicator"
           class="absolute w-6 h-8 transition-all duration-300 bg-green rounded-full -bottom-4 left-11"
           >
        <div
             style="box-shadow: rgb(39 163 80) 0px 10px 0px"
             class="absolute w-5 h-5 bg-white -left-4 bottom-1/2 rounded-br-3xl"
             ></div>
        <div
             style="box-shadow: rgb(39 163 80) 0px 10px 0px"
             class="absolute w-5 h-5 bg-white -right-4 bottom-1/2 rounded-bl-3xl"
             ></div>
      </div>
        </div>
      </div>
    </div>
</template>
  
  <script>
  import PerfectScrollbar from 'perfect-scrollbar';
//   import AccordionItem from './AccordionItem.vue';
    // console.log(init)
export default {
    
          name: "TabsItems",
  
          props: {
              title: {
                  type: String
              },
              open: {
                  type: Boolean,
                  default: () => {
                      return screen.width > 751
                  }
              }
          },
          data(){
              return {
                  
                  show: true,
                  isTabsActive: true,
                  activeTab: "Fidyah/Kaffarah",
                  links: [
                        {
                        title: "Fidyah/Kaffarah",
                        inActiveIcon: `
                        
                        Fidyah
                                `,
                        activeIcon: `
                        Fidyah
                                `,
                        },
                        {
                        title: "Sadaqah",
                        inActiveIcon: `
                        Sadaqah
                                `,
                        activeIcon: `
                        Sadaqah
                                `,
                        },
                        {
                        title: "Riba",
                        inActiveIcon: `
                        Riba
                                `,
                        activeIcon: `
                        Riba
                                `,
                        },
                       
                    ],
                  tabs: [
                        {
                        title: "Fidyah/Kaffarah",
                        content:
                        "Input data",
                        },
                        {
                        title: "Sadaqah",
                        content:
                        "Input data",
                        },
                        {
                        title: "Riba",
                        content:
                        "Input data.",
                        },
                        
                    ],
  
              }
          },
          methods: {
  
              toggle(){
                  if(this.title !== "Koop een 'Eid pakket"){
                      this.show = !this.show;
                  } else {
                      this.show = true
                  }
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
  
          beforeMount(){
              this.show = this.open;
          },
        
  
      }
  </script>
  
  <style scoped></style>
  