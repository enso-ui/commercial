<template>
    <order ref="order">
        <cancel-invoice :show="order.cancelInvoiceModal"
            @confirm="cancelInvoice"
            @close="order.cancelInvoiceModal = false"
            v-if="order.cancelInvoiceModal"/>
    </order>
</template>

<script>
import { mapState } from 'vuex';
import Order from '../../components/Order.vue';
import CancelInvoice from '../../sales/components/CancelInvoice.vue';
import order from '../../components/mixins/order';
import hasIns from '../../components/mixins/hasIns';

export default {
    name: 'SaleReturn',

    components: { Order, CancelInvoice },

    mixins: [order, hasIns],

    inject: ['i18n', 'route'],

    computed: {
        ...mapState(['enums']),
        invoiceId() {
            return this.form
                && this.form.field('invoice_id').value;
        },
    },

    created() {
        this.$set(this.order, 'cancelInvoiceModal', false);
    },

    methods: {
        updateVersion(version) {
            this.form.field('version').value = version;
        },
        issueProforma() {
            this.issueInvoice(true);
        },
        issueInvoice(proforma = false) {
            axios.post(
                this.route(
                    `commercial.${this.type}s.invoices.store`,
                    this.$route.params,
                ), { version: this.version, proforma },
            ).then(({ data }) => {
                const { invoice, version } = data;
                this.form.field('invoice_id').value = invoice.id;
                this.form.field('invoice').value = invoice;
                this.form.field('invoice_emailed_at').value = null;
                this.form.field('invoice_emailer').value = null;
                this.updateVersion(version);
            }).catch(this.errorHandler);
        },
        cancelInvoice() {
            this.order.cancelInvoiceModal = false;

            axios.patch(
                this.route(
                    `commercial.${this.type}s.invoices.cancel`,
                    this.$route.params,
                ), { version: this.version },
            ).then(({ data }) => {
                this.form.field('invoice_id').value = null;
                this.form.field('invoice').value = null;
                this.updateVersion(data.version);
            }).catch(this.errorHandler);
        },
        emailInvoice() {
            this.order.processing = true;

            axios.post(
                this.route(
                    `commercial.${this.type}s.emailInvoice`,
                    this.$route.params,
                ), { version: this.version },
            ).then(({ data }) => {
                this.order.processing = false;
                const { invoice_emailed_at, invoice_emailer, version } = data;
                this.form.field('invoice_emailed_at').value = invoice_emailed_at;
                this.form.field('invoice_emailer').value = invoice_emailer;
                this.form.field('version').value = version;
            }).catch((error) => {
                this.order.processing = false;
                this.errorHandler(error);
            });
        },
        downloadGrn() {
            window.open(this.route('commercial.saleReturns.grn', this.$route.params), '_blank');
        },
        downloadOffer() {
            window.open(this.route('commercial.saleReturns.offer', this.$route.params), '_blank');
        },
        downloadInvoice() {
            window.open(this.route('financials.clients.invoices.pdf', this.invoiceId), '_blank');
        },
        hasProforma() {
            return this.form
                && this.form.field('invoice').value
                && `${this.form.field('invoice').value.type}` === this.enums.invoiceTypes.Proforma;
        },
        hasInvoice() {
            return this.form
                && this.form.field('invoice').value
                && `${this.form.field('invoice').value.type}` === this.enums.invoiceTypes.Fiscal;
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

            issueProforma: this.issueProforma,
            issueInvoice: this.issueInvoice,
            cancelInvoice: this.cancelInvoice,
            hasProforma: this.hasProforma,
            hasInvoice: this.hasInvoice,
            emailInvoice: this.emailInvoice,
            downloadOffer: this.downloadOffer,
            downloadGrn: this.downloadGrn,
            downloadInvoice: this.downloadInvoice,
        };
    },
};
</script>
