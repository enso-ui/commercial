<template>
    <button class="button is-naked"
        v-tooltip="i18n('Remove From Stock')"
        :disabled="processing()"
        @click="removeFromStock"
        v-if="visible">
        <span class="icon">
            <fa icon="upload"/>
        </span>
    </button>
    <button class="button is-naked has-text-danger"
        v-tooltip="i18n('Undo Stock Removal')"
        :disabled="processing()"
        @click="undoStockRemoval"
        v-else-if="isUndo">
        <span class="icon has-text-danger">
            <fa icon="download"/>
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
    name: 'StockRemoval',

    directives: { tooltip: VTooltip },

    inject: [
        'i18n', 'insertable', 'order', 'processing',
        'removable', 'removeFromStock', 'undoStockRemoval',
    ],

    computed: {
        ...mapState(['enums']),
        field() {
            return this.order.form.field;
        },
        fulfilling() {
            return this.field('status').value === this.enums.orderStatuses.Fulfilling;
        },
        isUndo() {
            return this.fulfilling && this.insertable();            
        },
        visible() {
            return this.fulfilling && this.removable();
        },
    },
};
</script>
