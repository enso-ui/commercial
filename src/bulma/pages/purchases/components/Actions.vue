<template>
    <div class="wrapper">
        <div class="columns">
            <div class="column">
                <div class="actions has-text-right">
                    <in-flow v-if="allOrdered()"/>
                </div>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <div class="actions has-text-right">
                    <button class="button is-naked"
                        v-tooltip="i18n('Download goods received note')"
                        :disabled="processing()"
                        @click="downloadGrn"
                        v-if="fulfilled">
                        <span class="icon has-text-info">
                            <fa icon="pallet-alt"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Download purchase order')"
                        :disabled="processing()"
                        @click="downloadOrder('pdf')"
                        v-if="allOrdered()">
                        <span class="icon has-text-info">
                            <fa icon="file-pdf"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="i18n('Download excel purchase order')"
                        :disabled="processing()"
                        @click="downloadOrder('xlsx')"
                        v-if="allOrdered()">
                        <span class="icon has-text-info">
                            <fa icon="file-spreadsheet"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        :class="[
                            {'has-text-danger': !order.partner.email},
                            {'has-text-success': emailedAt()},
                        ]"
                        v-tooltip="emailTooltip"
                        :disabled="!order.partner.email || processing() || fulfilled"
                        @click="email"
                        v-if="order.partner && allOrdered()">
                        <span class="icon">
                            <fa icon="envelope"/>
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
    faDownload, faUpload, faWarehouse, faBoxOpen, faTrashAlt, faLock,
    faLockOpen, faFilePdf, faEnvelope, faClipboardCheck, faShippingFast,
} from '@fortawesome/free-solid-svg-icons';
import { faPalletAlt, faFileSpreadsheet, faHandReceiving } from '@fortawesome/pro-solid-svg-icons';
import InFlow from '../../components/InFlow.vue';

library.add([
    faDownload, faUpload, faWarehouse, faBoxOpen, faTrashAlt, faLock, faLockOpen,
    faFilePdf, faEnvelope, faClipboardCheck, faShippingFast,
    faHandReceiving, faPalletAlt, faFileSpreadsheet,
]);

export default {
    name: 'Actions',

    directives: { tooltip: VTooltip },

    components: { InFlow },

    inject: [
        'canAccess', 'i18n', 'order', 'email', 'updateFlow',
        'allOrdered', 'processing', 'emailedAt',
        'emailer', 'insertInStock', 'undoStockInsertion', 'allInStock',
        'someInStock', 'insertable', 'downloadOrder', 'downloadGrn', 'formatDateTime'
    ],

    computed: {
        ...mapState(['enums']),
        form() {
            return this.order.form;
        },
        emailTooltip() {
            if(! this.emailedAt()) {
                return null;
            }

            const time = this.formatDateTime(this.emailedAt());
            return `${this.i18n('Order emailed by')} ${this.emailer().person.name} @ ${time}`;
        },
        fulfilled() {
            return this.form.field('status').value === this.enums.orderStatuses.Fulfilled;
        },
    },
};
</script>
