<template>
    <div class="border border-gray-100 rounded w-16 text-center overflow-hidden"
         :class="{'pointer-events-none': allocation !== 'custom'}">

        <input type="text" class="w-full h-full text-center py-2 pt-2 slider-amount"
               :value="value" @blur="inputUpdated($event)"/>


    </div>
</template>

<script>
    import {mapFields} from 'vuex-map-fields';

    export default {
        name: "SliderAmountInput",
        props: ['value', 'item'],
        methods: {
            inputUpdated(event){

                this.$emit('update', {
                    item: this.item,
                    val:event.target.value
                })

            }
        },
        computed:{
            ...mapFields([
                'donation.allocation'
            ])
        }
    }
</script>

<style scoped>

</style>
