<template>
    <order ref="order"/>
</template>

<script>
import Order from '../../components/Order.vue';
import order from '../../components/mixins/order';
import hasOuts from '../../components/mixins/hasOuts';

export default {
    name: 'PurchaseReturn',

    components: { Order },

    mixins: [order, hasOuts],

    inject: ['i18n', 'route'],

    methods: {
        downloadDeliveryNote() {
            window.open(this.route(`commercial.${this.type}s.deliveryNote`, this.$route.params), '_blank');
        },
        downloadStockRemoval() {
            window.open(this.route(`commercial.${this.type}s.stockRemoval`, this.$route.params), '_blank');
        },
        downloadOrder() {
            window.open(this.route(`commercial.${this.type}s.order`, this.$route.params), '_blank');
        },
    },

    provide() {
        return {
            order: this.order,

            removeFromStock: this.removeFromStock,
            undoStockRemoval: this.undoStockRemoval,
            noneRemovedFromStock: this.noneRemovedFromStock,
            someRemovedFromStock: this.someRemovedFromStock,
            someInStock: this.someInStock,
            allRemovedFromStock: this.allRemovedFromStock,
            insertable: this.insertable,
            removable: this.removable,
            fullyReserved: this.fullyReserved,

            downloadDeliveryNote: this.downloadDeliveryNote,
            downloadStockRemoval: this.downloadStockRemoval,
            downloadOrder: this.downloadOrder,
        };
    },
};
</script>
