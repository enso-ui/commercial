<template>
    <button class="button is-naked"
        v-tooltip="tooltip"
        :disabled="processing()"
        @click="update"
        v-if="visible">
        <span :class="['icon', cssClass]">
            <fa icon="truck-loading"/>
        </span>
    </button>
</template>

<script>
import { mapState } from "vuex";
import { VTooltip } from 'v-tooltip';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTruckLoading } from '@fortawesome/free-solid-svg-icons';

library.add(faTruckLoading);

export default {
    name: 'Deliver',

    directives: { tooltip: VTooltip },

    inject: ['i18n',  'updateFlow', 'order', 'processing'],

    computed: {
        ...mapState(['enums']),
        cssClass() {
            return this.done ? 'has-text-success' : 'has-text-danger';
        },
        done() {
            return this.status === this.statuses.Delivered;
        },
        status() {
            return this.order.form.field('status').value;
        },
        statuses() {
            return this.enums.orderStatuses;
        },
        tooltip() {
            return this.done ? this.i18n('Undo deliver') : this.i18n('Deliver');
        },
        visible() {
            return [this.statuses.Shipped, this.statuses.Delivered]
                .includes(this.status);
        },
    },

    methods: {
        update() {
            const action = this.done
                ? this.enums.flowActions.UndoDeliver
                :  this.enums.flowActions.Deliver;

            this.updateFlow(action);
        }
    },
};
</script>
