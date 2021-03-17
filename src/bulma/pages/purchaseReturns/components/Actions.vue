<template>
    <div class="wrapper">
        <div class="columns">
            <div class="column">
                <div class="actions has-text-right">
                    <button class="button is-naked"
                        :class="{ 'has-text-danger': hasIns() }"
                        v-tooltip="i18n('Remove from stock')"
                        :disabled="processing()"
                        @click="removeFromStock"
                        v-if="fulfilled && removable()">
                        <span class="icon">
                            <fa icon="upload"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        :class="{ 'has-text-danger': hasOuts() }"
                        v-tooltip="i18n('Undo stock removal')"
                        :disabled="processing()"
                        @click="undoStockRemoval"
                        v-if="fulfilled && insertable()">
                        <span class="icon has-text-danger">
                            <fa icon="download"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="fulfilled
                            ? i18n('Leave warehouse mode')
                            : i18n('Enter warehouse mode')"
                        :disabled="processing()"
                        v-if="fulfilled && allOrdered()">
                        <span class="icon"
                            :class="allRemovedFromStock() ? 'has-text-success' : 'has-text-danger'">
                            <fa icon="warehouse"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        v-tooltip="fulfilled
                            ? i18n('Leave fulfilled mode')
                            : i18n('Enter fulfilled mode')"
                        :disabled="processing() || someRemovedFromStock() || fulfilled"
                        @click="updateFulfilment(fulfilled ? 'cancel' : 'start')"
                        v-if="allOrdered() && fullyReserved()">
                        <span class="icon"
                            :class="{'has-text-success': fulfilled}">
                            <fa icon="box-open"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        :disabled="processing()"
                        @click="order.deleteModal = true"
                        v-if="
                            canAccess(`commercial.${form.param('type')}s.destroy`)
                            && !fulfilled
                        ">
                        <span class="icon">
                            <fa icon="trash-alt"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                        :disabled="processing() || !allRemovedFromStock()"
                        @click="toggleLock"
                        v-if="fulfilled">
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
            </div>
        </div>
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
        fulfilled() {
            return this.form.field('status').value === this.enums.orderStatuses.Fulfilled;
        },
        finalized() {
            return this.form.field('status').value === this.enums.orderStatuses.Finalized;
        },
        
    },
};
</script>
