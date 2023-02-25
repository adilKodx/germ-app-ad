<template>
    <div class="flex items-center icon-container">
        <a :href="facebookPath" target="_blank">
            <div class="w-12 h-12 p-3 border border-gray-100 ion-wrapper rounded-full flex justify-center items-center bg-white">
                <div class="w-full h-full">
                    <facebook-logo></facebook-logo>
                </div>
            </div>
        </a>

        <a :href="emailLink" target="_blank">
            <div class="w-12 h-12 p-2 border border-gray-100 ion-wrapper rounded-full flex justify-center items-center bg-white">
                <div class="w-full">
                    <gmail-logo></gmail-logo>
                </div>
            </div>
        </a>

        <a href="https://wa.me/?text=Ik heb zojuist mijn Zakat afgedragen aan het Nationaal Zakat Fonds | NZF. Meer informatie op www.nationaalzakatfonds.nl" target="_blank">
            <div class="w-12 h-12 p-3 border border-gray-100 ion-wrapper rounded-full flex justify-center items-center bg-white">
                <div class="w-full h-full">
                    <whatsapp-logo></whatsapp-logo>
                </div>
            </div>
        </a>
    </div>
</template>

<script>
    import facebookLogo from './icons/facebookLogo'
    import gmailLogo from './icons/gmailLogo'
    import whatsappLogo from './icons/whatsappLogo'

    export default {
        name: "SocialIcons",
        components: { facebookLogo, gmailLogo, whatsappLogo },
        computed: {
            emailLink() {
                return 'mailto:?subject=NZF -' + encodeURI(" Ik heb net gedoneerd met NZF") + '&body=Ik heb zojuist mijn Zakat afgedragen aan het Nationaal Zakat Fonds | NZF. Meer informatie op ' + 'www.nationaalzakatfonds.nl';
            },
            facebookPath() {
                return 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURI('www.nationaalzakatfonds.nl');
            }
        }
    }
</script>

<style scoped lang="scss">
    .icon-container {
        margin: 0 -10px;

        .ion-wrapper {
            margin: 5px;
        }
    }
</style>
