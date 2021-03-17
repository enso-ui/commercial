<template>
    <button class="button is-naked"
        :disabled="disabled"
        @click="update"
        v-if="allInStock()">
        <span class="icon">
            <fa :icon="icon"/>
        </span>
    </button>
</template>

<script>
import { mapState } from "vuex";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

library.add(faLock, faLockOpen);

export default {
    name: 'Finalize',

    inject: ['allInStock', 'order', 'processing',  'updateFlow'],

    computed: {
        ...mapState(['enums']),
        disabled() {
            return this.processing() || !this.allInStock();
        },
        done() {
            return this.status === this.enums.orderStatuses.Finalized;
        },
        icon() {
            return this.done ? faLock : faLockOpen;
        },
        status() {
            return this.order.form.field('status').value;
        },
    },

    methods: {
        update() {
            const action = this.done
                ? this.enums.flowActions.UndoFinalize
                :  this.enums.flowActions.Finalize; 

            this.updateFlow(action);
        }
    },
};
</script>
