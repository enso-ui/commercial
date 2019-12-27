<template>
    <order ref="order">
        <template v-slot:actions>
            <slot name="actions"/>
        </template>
        <cancel-invoice :show="order.cancelInvoiceModal"
            @confirm="cancelInvoice"
            @close="order.cancelInvoiceModal = false"
            v-if="order.cancelInvoiceModal"/>
        <cancel-payment :show="order.cancelPaymentModal"
            @confirm="cancelPayment"
            @close="order.cancelPaymentModal = false"
            v-if="order.cancelPaymentModal"/>
        <payment @submit="order.paymentModal = false; updatePayment($event)"
            @close="order.paymentModal = false;"
            v-if="order.paymentModal"/>
    </order>
</template>

<script>
import { mapState } from 'vuex';
import Order from '../../components/Order.vue';
import CancelInvoice from './CancelInvoice.vue';
import CancelPayment from './CancelPayment.vue';
import Payment from './Payment.vue';
import order from '../../components/mixins/order';
import hasOuts from '../../components/mixins/hasOuts';

export default {
    name: 'Sale',

    inject: ['i18n', 'route', 'errorHandler', 'canAccess'],

    components: {
        Order, Payment, CancelInvoice, CancelPayment,
    },

    mixins: [order, hasOuts],

    computed: {
        ...mapState(['enums']),
        invoiceId() {
            return this.form
                && this.form.field('invoice_id').value;
        },
        paymentId() {
            return this.form
                && this.form.field('payment_id').value;
        },
        hasReceipt() {
            return this.paymentId
                && `${this.form.field('payment').value.type}` === this.enums.paymentTypes.Receipt;
        },
    },

    created() {
        this.$set(this.order, 'cancelInvoiceModal', false);
        this.$set(this.order, 'cancelPaymentModal', false);
        this.$set(this.order, 'paymentModal', false);
    },

    methods: {
        updateVersion(version) {
            this.form.field('version').value = version;
        },
        createDifferencesSale() {
            this.order.processing = true;

            axios.post(
                this.route(
                    `commercial.${this.type}s.differences`,
                    this.$route.params,
                ), { version: this.version },
            ).then(() => {
                this.order.processing = false;
                this.form.fetch();
                this.$refs.order.$refs.lines.fetch();
            }).catch((error) => {
                this.order.processing = false;
                this.form.fetch();
                this.errorHandler(error);
            });
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
                this.form.field('invoiceEmailer').value = null;
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
                const { invoice_emailed_at, invoiceEmailer, version } = data;
                this.form.field('invoice_emailed_at').value = invoice_emailed_at;
                this.form.field('invoiceEmailer').value = invoiceEmailer;
                this.form.field('version').value = version;
            }).catch((error) => {
                this.order.processing = false;
                this.errorHandler(error);
            });
        },
        updatePayment({ payment, version }) {
            this.form.field('payment_id').value = payment.id;
            this.form.field('payment').value = payment;
            this.updateVersion(version);
        },
        cancelPayment() {
            axios.patch(
                this.route(
                    `commercial.${this.type}s.payments.cancel`,
                    this.$route.params,
                ), { version: this.version },
            ).then(({ data }) => {
                this.form.field('payment_id').value = null;
                this.order.cancelPaymentModal = false;
                this.updateVersion(data.version);
            }).catch((error) => {
                this.order.cancelPaymentModal = false;
                this.errorHandler(error);
            });
        },
        downloadDeliveryNote() {
            window.open(this.route(`commercial.${this.type}s.deliveryNote`, this.$route.params), '_blank');
        },
        downloadStockRemoval() {
            window.open(this.route(`commercial.${this.type}s.stockRemoval`, this.$route.params), '_blank');
        },
        downloadInvoice() {
            window.open(this.route('financials.clients.invoices.pdf', this.invoiceId), '_blank');
        },
        downloadPayment() {
            if (this.hasReceipt) {
                window.open(this.route('financials.clients.payments.pdf', this.paymentId), '_blank');
            }
        },
        downloadOffer(format = 'pdf') {
            const uri = this.route(`commercial.${this.type}s.offer`, this.$route.params) + `?format=${format}`;
            window.open(uri, '_blank');
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
        hasPayment() {
            return this.paymentId !== null;
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

            createDifferencesSale: this.createDifferencesSale,
            issueProforma: this.issueProforma,
            issueInvoice: this.issueInvoice,
            hasProforma: this.hasProforma,
            hasInvoice: this.hasInvoice,
            hasPayment: this.hasPayment,
            emailInvoice: this.emailInvoice,
            cancelInvoice: this.cancelInvoice,
            cancelPayment: this.cancelPayment,
            downloadOffer: this.downloadOffer,
            downloadStockRemoval: this.downloadStockRemoval,
            downloadDeliveryNote: this.downloadDeliveryNote,
            downloadInvoice: this.downloadInvoice,
            downloadPayment: this.downloadPayment,
        };
    },
};
</script>
