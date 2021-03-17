<template>
    <div class="wrapper">
        <div class="columns">
            <div class="column">
                <div class="actions has-text-right">
                    <button class="button is-naked"
                        :class="{ 'has-text-danger': hasIns() }"
                        v-tooltip="i18n('Remove From Stock')"
                        :disabled="processing()"
                        @click="removeFromStock"
                        v-if="fulfilled && removable()">
                        <span class="icon">
                            <fa icon="upload"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        :class="{ 'has-text-danger': hasOuts() }"
                        v-tooltip="i18n('Undo Stock Removal')"
                        :disabled="processing()"
                        @click="undoStockRemoval"
                        v-if="fulfilled && insertable()">
                        <span class="icon has-text-danger">
                            <fa icon="download"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="fulfilled
                            ? i18n('Leave Warehouse Mode')
                            : i18n('Enter Warehouse Mode')"
                        :disabled="processing()"
                        v-if="fulfilled && fullyReserved()">
                        <span class="icon"
                            :class="allRemovedFromStock() ? 'has-text-success' : 'has-text-danger'">
                            <fa icon="warehouse"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Create Differences Sale')"
                        :disabled="processing()"
                        @click="createDifferencesSale"
                        v-if="allOrdered() && !fullyReserved()">
                        <span class="icon has-text-danger">
                            <fa icon="ballot-check"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="fulfilled
                            ? i18n('Leave fulfilled Mode')
                            : i18n('Enter fulfilled Mode')"
                        :disabled="processing() || someRemovedFromStock() || fulfilled"
                        @click="updateFulfilment(fulfilled ? 'cancel' : 'start')"
                        v-if="allOrdered() && fullyReserved() || fulfilled && !fullyReserved()">
                        <span class="icon"
                            :class="{'has-text-success': fulfilled}">
                            <fa icon="box-open"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        :disabled="processing() || hasInvoice() || hasPayment()"
                        @click="order.deleteModal = true"
                        v-if="
                            canAccess(`commercial.${type}s.destroy`)
                            && !fulfilled
                        ">
                        <span class="icon">
                            <fa icon="trash-alt"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        :disabled="processing() || !allRemovedFromStock() || !hasInvoice()"
                        @click="toggleLock"
                        v-if="fulfilled && fullyReserved()">
                        <span class="icon">
                            <fa :icon="finalized ? 'lock' : 'lock-open'"/>
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <div class="actions has-text-right">
                    <button class="button is-naked"
                        v-tooltip="i18n('Download Delivery Note')"
                        @click="downloadDeliveryNote"
                        v-if="allRemovedFromStock()">
                        <span class="icon has-text-info">
                            <fa icon="clipboard-list"/>
                        </span>
                    </button>
                     <button class="button is-naked"
                        v-tooltip="i18n('Issue Payment')"
                        @click="order.paymentModal = true"
                        v-if="allRemovedFromStock() && (hasInvoice() || hasProforma()) && !hasPayment()">
                            <span class="icon">
                                <fa icon="hand-holding-usd"/>
                            </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Download Payment (long click for cancel)')"
                        v-long-click:1500="cancelPayment"
                        key="payment"
                        @click="downloadPayment"
                        v-if="hasPayment()">
                        <span class="icon has-text-info">
                            <fa icon="hand-holding-usd"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Issue Proforma')"
                        @click="issueProforma()"
                        v-if="allOrdered() && !hasProforma() && !hasInvoice()">
                        <span class="icon">
                            <fa icon="file-invoice"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Issue Invoice')"
                        @click="issueInvoice()"
                        v-if="allRemovedFromStock() && !hasInvoice()">
                        <span class="icon">
                            <fa icon="file-invoice-dollar"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Download Invoice (long click for cancel)')"
                        v-long-click:1500="cancelInvoice"
                        key="invoice"
                        @click="downloadInvoice"
                        v-if="hasInvoice() || hasProforma()">
                        <span class="icon has-text-info">
                            <fa :icon="hasInvoice() ? 'file-invoice-dollar' : 'file-invoice'"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Download Stock Removal')"
                        :disabled="processing()"
                        @click="downloadStockRemoval"
                        v-if="allOrdered() && !someRemovedFromStock()">
                        <span class="icon has-text-info">
                            <fa icon="inventory"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Download Sale Offer')"
                        :disabled="processing()"
                        @click="downloadOffer('pdf')"
                        v-if="allOrdered()">
                        <span class="icon has-text-info">
                            <fa icon="file-pdf"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Download Excel Sale Offer')"
                        :disabled="processing()"
                        @click="downloadOffer('xlsx')"
                        v-if="allOrdered()">
                        <span class="icon has-text-info">
                            <fa icon="file-spreadsheet"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        :class="[
                            {'has-text-danger': !order.partner.email},
                            {'has-text-success': emailedAt() && !hasInvoice() && !hasProforma() || invoiceEmailedAt},
                        ]"
                        v-tooltip="emailTooltip"
                        :disabled="!order.partner.email || processing()"
                        @click="hasInvoice() || hasProforma() ? emailInvoice() : email()"
                        v-if="order.partner && allOrdered()">
                        <span class="icon">
                            <fa :icon="hasInvoice() || hasProforma() ? 'envelope-open-dollar' : 'envelope'"/>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { VTooltip } from 'v-tooltip';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faUpload, faDownload, faWarehouse, faBoxOpen, faTrashAlt, faLock, faLockOpen, faClipboardList,
    faHandHoldingUsd, faFileInvoice, faFileInvoiceDollar, faFilePdf, faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { faBallotCheck, faInventory, faEnvelopeOpenDollar, faFileSpreadsheet } from '@fortawesome/pro-solid-svg-icons';
import { longClick } from '@enso-ui/directives';

library.add([
    faUpload, faDownload, faWarehouse, faBoxOpen, faTrashAlt, faLock, faLockOpen, faClipboardList,
    faHandHoldingUsd, faFileInvoice, faFileInvoiceDollar, faFilePdf, faEnvelope,
    faBallotCheck, faInventory, faEnvelopeOpenDollar, faFileSpreadsheet,
]);

export default {
    name: 'Actions',

    directives: { tooltip: VTooltip, longClick },

    inject: [
        'canAccess', 'i18n', 'order', 'email', 'updateFulfilment', 'toggleLock',
        'allOrdered', 'hasIns', 'hasOuts', 'processing', 'emailedAt',
        'emailer', 'removeFromStock', 'undoStockRemoval', 'someRemovedFromStock', 'allRemovedFromStock',
        'insertable', 'removable', 'fullyReserved', 'createDifferencesSale', 'issueProforma',
        'issueInvoice', 'hasProforma', 'hasInvoice', 'hasPayment', 'emailInvoice',
        'downloadOffer', 'downloadStockRemoval', 'downloadDeliveryNote',
        'downloadInvoice', 'downloadPayment', 'formatDateTime'
    ],

    computed: {
        ...mapState(['enums']),
        form() {
            return this.order.form;
        },
        type() {
            return this.form.param('type');
        },
        invoiceEmailedAt() {
            return this.order.form.field('invoice_emailed_at').value;
        },
        invoiceEmailer() {
            return this.order.form.field('invoiceEmailer').value;
        },
        canCancelInvoice() {
            return this.canAccess(`commercial.${this.type}s.invoices.cancel`)
                && !this.finalized
                && !this.hasPayment();
        },
        canCancelPayment() {
            return this.canAccess(`commercial.${this.type}s.payments.cancel`)
                && !this.finalized;
        },
        emailTooltip() {
            if (this.invoiceEmailedAt && this.invoiceEmailer) {
                const time = this.formatDateTime(this.invoiceEmailedAt);
                return `${this.i18n('Invoice emailed by')} ${this.invoiceEmailer.person.name} @ ${time}`;
            }

            const time = this.formatDateTime(this.emailedAt());
            return this.emailedAt() && this.emailer()
                ? `${this.i18n('Order emailed by')} ${this.emailer().person.name} @ ${time}`
                : null;
        },
        fulfilled() {
            return this.form.field('status').value === this.enums.orderStatuses.Fulfilled;
        },
        finalized() {
            return this.form.field('status').value === this.enums.orderStatuses.Finalized;
        },
    },

    methods: {
        cancelInvoice() {
            if (this.canCancelInvoice) {
                this.order.cancelInvoiceModal = true;
            }
        },
        cancelPayment() {
            if (this.canCancelPayment) {
                this.order.cancelPaymentModal = true;
            }
        },
    },
};
</script>
