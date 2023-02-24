<template>
    <div class="progress-calculator" v-if="steps > 0">
        <div class="flex flex-row-reverse md:flex-col justify-center items-center md:bg-white md:shadow-lg md:py-8 md:px-6 rounded md:mb-8  transition-all">
            <p class="w-3/12 md:w-full md:mb-6 flex justify-end md:justify-start text-black font-semibold text-lg">
                Stap {{calculatorStep ? calculatorStep : 0}} van de {{steps}}
            </p>

            <progress-bar class="w-9/12 md:w-full md:pb-1" :width="calculatorProgress"></progress-bar>
        </div>
        <div class="hidden md:block">
            <p class="text-xs mt-12">Heb je nog vragen? Stuur ons een e-mail op <a href="mailto:vragen@nationaalzakatfonds.nl" class="text-red-300">vragen@nationaalzakatfonds.nl</a> en we helpen je graag verder met al jouw vragen.</p>
        </div>
    </div>
</template>

<script>
    import ProgressBar from './ProgressBar';
    import { mapFields } from 'vuex-map-fields';

    export default {
        name: "ProgressCalc",
        components: {ProgressBar},
        props: {
            useHeight: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            ...mapFields([
                'calculatorProgress',
                'user.assets',
                'calculatorFilter',
                'calculatorStep'
            ]),
            progress(){
                return this.calculatorProgress/10;
            },
            steps(){
                return this.calculatorFilter.selected.length;
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
