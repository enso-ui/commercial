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
                            canAccess(`commercial.${form.param('type')}s.destroy`)
                            && !fulfilling()
                        ">
                        <span class="icon">
                            <fa icon="trash-alt"/>
                        </span>
                    </button>
                    <button class="button is-naked"
                            :disabled="processing() || !allInStock()"
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
                        v-tooltip="emailedAt() ? `${emailer().person.name} / ${emailedAt()}` : null"
                        :disabled="!order.partner.email || processing() || fulfilling()"
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
import { VTooltip } from 'v-tooltip';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faDownload, faUpload, faWarehouse, faBoxOpen, faTrashAlt, faLock, faLockOpen,
    faFilePdf, faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { faPalletAlt, faFileSpreadsheet } from '@fortawesome/pro-solid-svg-icons';

library.add([
    faDownload, faUpload, faWarehouse, faBoxOpen, faTrashAlt, faLock, faLockOpen,
    faFilePdf, faEnvelope, faPalletAlt, faFileSpreadsheet,
]);

export default {
    name: 'Actions',

    directives: { tooltip: VTooltip },

    inject: [
        'canAccess', 'i18n', 'order', 'email', 'toggleFulfilling', 'toggleLock', 'fulfilling',
        'allOrdered', 'processing', 'finalized', 'emailedAt', 'emailer', 'insertInStock',
        'undoStockInsertion', 'allInStock', 'someInStock', 'insertable', 'downloadOrder',
        'downloadGrn',
    ],

    computed: {
        form() {
            return this.order.form;
        },
    },
};
</script>
