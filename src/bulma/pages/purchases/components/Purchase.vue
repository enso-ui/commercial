<template>
    <order ref="order"/>
</template>

<script>
import Order from '../../components/Order.vue';
import order from '../../components/mixins/order';
import hasIns from '../../components/mixins/hasIns';

export default {
    name: 'Purchase',

    components: { Order },

    mixins: [order, hasIns],

    inject: ['i18n', 'route'],

    methods: {
        downloadGrn() {
            window.open(this.route(`commercial.${this.type}s.grn`, this.$route.params), '_blank');
        },
        downloadOrder(format = 'pdf') {
            const uri = this.route(`commercial.${this.type}s.order`, this.$route.params) + `?format=${format}`;
            window.open(uri, '_blank');
        },
    },

    provide() {
        return {
            order: this.order,

            insertInStock: this.insertInStock,
            undoStockInsertion: this.undoStockInsertion,
            noneInStock: this.noneInStock,
            someInStock: this.someInStock,
            allInStock: this.allInStock,
            insertable: this.insertable,

            downloadOrder: this.downloadOrder,
            downloadGrn: this.downloadGrn,
        };
    },
};
</script>
