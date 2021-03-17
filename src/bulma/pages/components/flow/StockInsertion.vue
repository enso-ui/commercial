<template>
    <button class="button is-naked"
        v-tooltip="i18n('Insert in stock')"
        :disabled="processing()"
        @click="insertInStock"
        v-if="visible">
        <span class="icon">
            <fa icon="download"/>
        </span>
    </button>
    <button class="button is-naked"
        v-tooltip="i18n('Undo stock insertion')"
        :disabled="processing()"
        @click="undoStockInsertion"
        v-else-if="isUndo">
        <span class="icon has-text-danger">
            <fa icon="upload"/>
        </span>
    </button>
</template>

<script>
import { mapState } from "vuex";

import { VTooltip } from 'v-tooltip';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';

library.add(faDownload, faUpload);

export default {
    name: 'StockInsertion',

    directives: { tooltip: VTooltip },

    inject: [
        'i18n', 'insertable', 'insertInStock',
        'order', 'processing', 'someInStock', 'undoStockInsertion'
    ],

    computed: {
        ...mapState(['enums']),
        field() {
            return this.order.form.field;
        },
        finalized() {
            return this.field('status').value === this.enums.orderStatuses.Finalized;
        },
        fulfilled() {
            return this.field('status').value === this.enums.orderStatuses.Fulfilled;
        },
        isUndo() {
            return !this.finalized && this.fulfilled && this.someInStock();            
        },
        visible() {
            return this.fulfilled && this.insertable();
        },
    },
};
</script>
