<template>
    <div class="px-8 pt-4 pb-3 rounded flex justify-between text-white bg-green-200 shadow items-center">
        <div class="w-11/12">
            <slot></slot>
        </div>

        <div class="w-1/12 flex justify-end">
            <div class="text-3xl close-btn-container">
                <span @click="closeSuccess" class="ion-ios-close-circle cursor-pointer"></span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SuccessMessage",
        methods: {
            closeSuccess(){
                this.$store.commit('SET_SUCCESS_MSG', '');
            }
        }
    }
</script>

<style scoped>

</style>
