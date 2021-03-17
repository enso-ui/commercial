<template>
    <button class="button is-naked"
        v-tooltip="tooltip"
        :disabled="processing()"
        @click="update"
        v-if="visible">
        <span :class="['icon', cssClass]">
            <fa icon="shipping-fast"/>
        </span>
    </button>
</template>

<script>
import { mapState } from "vuex";
import { VTooltip } from 'v-tooltip';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faShippingFast } from '@fortawesome/free-solid-svg-icons';

library.add(faShippingFast);

export default {
    name: 'Ship',

    directives: { tooltip: VTooltip },

    inject: ['i18n',  'updateFlow', 'order', 'processing'],

    computed: {
        ...mapState(['enums']),
        cssClass() {
            return this.done ? 'has-text-success' : 'has-text-danger';
        },
        done() {
            return this.status === this.statuses.Shipped;
        },
        status() {
            return this.order.form.field('status').value;
        },
        statuses() {
            return this.enums.orderStatuses;
        },
        tooltip() {
            return this.done ? this.i18n('Undo ship') : this.i18n('Ship');
        },
        visible() {
            return [this.statuses.Confirmed, this.statuses.Shipped]
                .includes(this.status);
        },
    },

    methods: {
        update() {
            const action = this.done
                ? this.enums.flowActions.UndoShip
                :  this.enums.flowActions.Ship;

            this.updateFlow(action);
        }
    },
};
</script>
