<template>
    <div class="wrapper">
        <div class="columns">
            <div class="column">
                <div class="controls has-text-right">
                    <button class="button is-naked"
                        v-tooltip="i18n('Insert in stock')"
                        :disabled="processing()"
                        @click="insertInStock"
                        v-if="order.warehouse && insertable()">
                        <span class="icon">
                            <fa icon="download"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Undo stock insertion')"
                        :disabled="processing()"
                        @click="undoStockInsertion"
                        v-if="!finalized() && order.warehouse && someInStock()">
                        <span class="icon has-text-danger">
                            <fa icon="upload"/>
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
                        v-if="fulfilling() && allOrdered()">
                        <span class="icon"
                            :class="allInStock() ? 'has-text-success' : 'has-text-danger'">
                            <fa icon="warehouse"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="
                            fulfilling()
                                ? i18n('Leave fulfilling mode')
                                : i18n('Enter fulfilling mode')
                        "
                        :disabled="processing() || someInStock() || order.warehouse"
                        @click="toggleFulfilling"
                        v-if="allOrdered()">
                        <span class="icon"
                            :class="{'has-text-success': fulfilling()}">
                            <fa icon="box-open"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        :disabled="fulfilling() || processing()"
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
                        :disabled="processing() || !allInStock() || !hasInvoice()"
                        @click="toggleLock"
                        v-if="fulfilling()">
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
                        v-tooltip="i18n('Download goods received note')"
                        :disabled="processing()"
                        @click="downloadGrn"
                        v-if="fulfilling()">
                        <span class="icon has-text-info">
                            <fa icon="pallet-alt"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Issue invoice')"
                        @click="issueInvoice()"
                        v-if="allOrdered() && !hasInvoice()">
                        <span class="icon">
                            <fa icon="file-invoice-dollar"/>
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
                        v-tooltip="i18n('Download sale return offer')"
                        :disabled="processing()"
                        @click="downloadOffer('pdf')"
                        v-if="allOrdered()">
                        <span class="icon has-text-info">
                            <fa icon="file-pdf"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Download excel sale return offer')"
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
    faDownload, faUpload, faWarehouse, faBoxOpen, faTrashAlt, faLock, faLockOpen,
    faFileInvoiceDollar, faFileInvoice, faFilePdf, faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { faPalletAlt, faEnvelopeOpenDollar, faFileSpreadsheet } from '@fortawesome/pro-solid-svg-icons';
import { longClick } from '@enso-ui/directives';

library.add([
    faDownload, faUpload, faWarehouse, faBoxOpen, faTrashAlt, faLock, faLockOpen,
    faFileInvoiceDollar, faFileInvoice, faFilePdf, faEnvelope, faPalletAlt,
    faEnvelopeOpenDollar, faFileSpreadsheet,
]);

export default {
    name: 'Actions',

    directives: { tooltip: VTooltip, longClick },

    inject: [
        'canAccess', 'i18n', 'order', 'email', 'toggleFulfilling', 'toggleLock', 'fulfilling',
        'allOrdered', 'processing', 'finalized', 'emailedAt', 'emailer', 'insertInStock',
        'undoStockInsertion', 'allInStock', 'someInStock', 'insertable', 'issueProforma',
        'issueInvoice', 'hasProforma', 'hasInvoice', 'emailInvoice', 'downloadOffer',
        'downloadGrn', 'downloadInvoice',
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
            return this.order.form.field('invoiceEmailer').value;
        },
        canCancelInvoice() {
            return this.canAccess(`commercial.${this.type}s.invoices.cancel`)
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
    },
};
</script>
