<template>
    <div class="actions has-text-right">
        <button class="button is-naked"
            v-tooltip="i18n('Download delivery note')"
            @click="downloadDeliveryNote"
            v-if="allRemovedFromStock()">
            <span class="icon has-text-info">
                <fa icon="clipboard-list"/>
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
            v-tooltip="i18n('Download purchase return order')"
            :disabled="processing()"
            @click="downloadOrder('pdf')"
            v-if="allOrdered()">
            <span class="icon has-text-info">
                <fa icon="file-pdf"/>
            </span>
        </button>
        <button class="button is-naked"
            v-tooltip="i18n('Download excel purchase return order')"
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
                {'has-text-success': emailedAt() },
            ]"
            v-tooltip="emailTooltip"
            :disabled="!order.partner.email || processing()"
            @click="email"
            v-if="order.partner && allOrdered()">
            <span class="icon">
                <fa icon="envelope"/>
            </span>
        </button>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { VTooltip } from 'v-tooltip';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faUpload, faDownload, faWarehouse, faBoxOpen, faTrashAlt, faLock, faLockOpen,
    faClipboardList, faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import { faInventory, faFileSpreadsheet } from '@fortawesome/pro-solid-svg-icons';
import { longClick } from '@enso-ui/directives';

library.add([
    faUpload, faDownload, faWarehouse, faBoxOpen, faTrashAlt, faLock, faLockOpen,
    faClipboardList, faFilePdf, faInventory, faFileSpreadsheet,
]);

export default {
    name: 'Actions',

    directives: { tooltip: VTooltip, longClick },

    inject: [
        'canAccess', 'i18n', 'order', 'email', 'updateFulfilment', 'toggleLock',
        'allOrdered', 'hasIns', 'hasOuts', 'processing', 'emailedAt',
        'emailer', 'removeFromStock', 'undoStockRemoval', 'someRemovedFromStock',
        'allRemovedFromStock', 'insertable', 'removable', 'fullyReserved', 'downloadStockRemoval',
        'downloadDeliveryNote', 'downloadOrder', 'formatDateTime'
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
        fulfilling() {
            return this.form.field('status').value === this.enums.orderStatuses.Fulfilling;
        },
        finalized() {
            return this.form.field('status').value === this.enums.orderStatuses.Finalized;
        },
        
    },
};
</script>
