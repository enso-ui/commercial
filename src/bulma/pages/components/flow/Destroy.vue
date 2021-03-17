<template>
    <button class="button is-naked"
        :disabled="disabled"
        @click="order.deleteModal = true"
        v-if="visible">
        <span class="icon">
            <fa icon="trash-alt"/>
        </span>
    </button>
</template>

<script>
import { mapState } from "vuex";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

library.add(faTrashAlt);
export default {
    name: 'Destroy',
    
    inject: ['canAccess', 'order', 'processing'],

    computed: {
        ...mapState(['enums']),
        disabled() {
            return this.status === this.enums.orderStatuses.Fulfilling
                || this.processing();
        },
        route() {
            return `commercial.${this.order.form.param('type')}s.destroy`;
        },
        status() {
            return this.order.form.field('status').value;
        },
        visible() {
            return this.canAccess(this.route)
                && this.status === this.enums.orderStatuses.New;
        },
    },
};
</script>

<style lang="scss">
    
    

</style>