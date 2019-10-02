<template>
    <div class="wrapper">
        <div class="columns">
            <div class="column">
                <div class="controls has-text-right">
                    <button class="button is-naked"
                        :class="{ 'has-text-danger': hasIns() }"
                        v-tooltip="i18n('Remove from stock')"
                        :disabled="processing()"
                        @click="removeFromStock"
                        v-if="order.warehouse && removable()">
                        <span class="icon">
                            <fa icon="upload"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        :class="{ 'has-text-danger': hasOuts() }"
                        v-tooltip="i18n('Undo stock removal')"
                        :disabled="processing()"
                        @click="undoStockRemoval"
                        v-if="order.warehouse && insertable()">
                        <span class="icon has-text-danger">
                            <fa icon="download"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="
                            order.warehouse
                                ? i18n('Leave warehouse mode')
                                : i18n('Enter warehouse mode')
                        "
                        :disabled="processing()"
                        @click="order.warehouse = !order.warehouse"
                        v-if="fulfilling() && fullyReserved()">
                        <span class="icon"
                            :class="allRemovedFromStock() ? 'has-text-success' : 'has-text-danger'">
                            <fa icon="warehouse"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Create differences sale')"
                        :disabled="processing()"
                        @click="createDifferencesSale"
                        v-if="allOrdered() && !fullyReserved()">
                        <span class="icon has-text-danger">
                            <fa icon="ballot-check"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="
                            fulfilling()
                                ? i18n('Leave fulfilling mode')
                                : i18n('Enter fulfilling mode')
                        "
                        :disabled="processing() || someRemovedFromStock() || order.warehouse"
                        @click="toggleFulfilling"
                        v-if="allOrdered() && fullyReserved() || fulfilling() && !fullyReserved()">
                        <span class="icon"
                            :class="{'has-text-success': fulfilling()}">
                            <fa icon="box-open"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        :disabled="processing() || hasInvoice() || hasPayment()"
                        @click="order.deleteModal = true"
                        v-if="
                            canAccess(`commercial.${type}s.destroy`)
                            && !fulfilling()
                        ">
                        <span class="icon">
                            <fa icon="trash-alt"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        :disabled="processing() || !allRemovedFromStock() || !hasInvoice()"
                        @click="toggleLock"
                        v-if="fulfilling() && fullyReserved()">
                        <span class="icon">
                            <fa :icon="finalized() ? 'lock' : 'lock-open'"/>
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <div class="controls has-text-right">
                    <button class="button is-naked"
                        v-tooltip="i18n('Download delivery note')"
                        @click="downloadDeliveryNote"
                        v-if="allRemovedFromStock()">
                        <span class="icon has-text-info">
                            <fa icon="clipboard-list"/>
                        </span>
                    </button>
                     <button class="button is-naked"
                        v-tooltip="i18n('Issue payment')"
                        @click="order.paymentModal = true"
                        v-if="allRemovedFromStock() && (hasInvoice() || hasProforma()) && !hasPayment()">
                            <span class="icon">
                                <fa icon="hand-holding-usd"/>
                            </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Download payment (long click for cancel)')"
                        v-long-click:1500="cancelPayment"
                        key="payment"
                        @click="downloadPayment"
                        v-if="hasPayment()">
                        <span class="icon has-text-info">
                            <fa icon="hand-holding-usd"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Issue proforma')"
                        @click="issueProforma()"
                        v-if="allOrdered() && !hasProforma() && !hasInvoice()">
                        <span class="icon">
                            <fa icon="file-invoice"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Issue invoice')"
                        @click="issueInvoice()"
                        v-if="allRemovedFromStock() && !hasInvoice()">
                        <span class="icon">
                            <fa icon="file-invoice-dollar"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Download invoice (long click for cancel)')"
                        v-long-click:1500="cancelInvoice"
                        key="invoice"
                        @click="downloadInvoice"
                        v-if="hasInvoice() || hasProforma()">
                        <span class="icon has-text-info">
                            <fa :icon="hasInvoice() ? 'file-invoice-dollar' : 'file-invoice'"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Download stock removal')"
                        :disabled="processing()"
                        @click="downloadStockRemoval"
                        v-if="allOrdered() && !someRemovedFromStock()">
                        <span class="icon has-text-info">
                            <fa icon="inventory"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Download sale offer')"
                        :disabled="processing()"
                        @click="downloadOffer('pdf')"
                        v-if="allOrdered()">
                        <span class="icon has-text-info">
                            <fa icon="file-pdf"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Download excel sale offer')"
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
        'canAccess', 'i18n', 'order', 'email', 'toggleFulfilling', 'toggleLock', 'fulfilling',
        'allOrdered', 'hasIns', 'hasOuts', 'processing', 'finalized', 'emailedAt', 'emailer',
        'removeFromStock', 'undoStockRemoval', 'someRemovedFromStock', 'allRemovedFromStock',
        'insertable', 'removable', 'fullyReserved', 'createDifferencesSale', 'issueProforma',
        'issueInvoice', 'hasProforma', 'hasInvoice', 'hasPayment', 'emailInvoice',
        'downloadOffer', 'downloadStockRemoval', 'downloadDeliveryNote',
        'downloadInvoice', 'downloadPayment',
    ],

    computed: {
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
            return this.order.form.field('invoice_emailer').value;
        },
        canCancelInvoice() {
            return this.canAccess(`commercial.${this.type}s.invoices.cancel`)
                && !this.finalized()
                && !this.hasPayment();
        },
        canCancelPayment() {
            return this.canAccess(`commercial.${this.type}s.payments.cancel`)
                && !this.finalized();
        },
        emailTooltip() {
            if (this.invoiceEmailedAt && this.invoiceEmailer) {
                return `${this.i18n('Invoice emailed by')} ${this.invoiceEmailer.person.name} @ ${this.invoiceEmailedAt}`;
            }

            return this.emailedAt() && this.emailer()
                ? `${this.i18n('Order emailed by')} ${this.emailer().person.name} @ ${this.emailedAt()}`
                : null;
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
