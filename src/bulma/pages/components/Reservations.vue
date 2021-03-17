<template>
    <v-popover trigger="click">
        <span class="tag reservation"
            :class="classes"
            @click="fetch">
            {{ product.reserved }}
        </span>
        <template v-slot:popover>
            <loader size="small"
                v-if="loading"/>
            <ul v-else-if="reservations.length > 0">
                <li v-for="({ id, type, number, quantity, route, order, orderId }) in reservations"
                    :key="id">
                    {{ type }}: <strong>#{{ number }}</strong>
                    <span class="icon is-small has-text-info">
                        <fa icon="hand-paper"/>
                    </span>
                    <strong>{{ quantity }}</strong>
                    <span class="icon is-small is-clickable"
                        @click="
                            $route.name !== route || $route.params[order] !== orderId
                                ? $router.push({name: route, params: { [order]: orderId } })
                                : null
                            ">
                        <fa icon="pencil-alt"/>
                    </span>
                </li>
            </ul>
            <span v-else>
                {{ i18n('No reservations found') }}
            </span>
        </template>
    </v-popover>
</template>

<script>
import { VPopover } from 'v-tooltip';
import Loader from '@enso-ui/loader/bulma';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHandPaper, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

library.add(faHandPaper, faPencilAlt);

export default {
    name: 'Reservations',

    components: { VPopover, Loader },

    inject: ['errorHandler', 'i18n', 'route'],

    props: {
        classes: {
            type: String,
            default: null,
        },
        product: {
            type: Object,
            required: true,
        },
    },

    data: () => ({
        reservations: [],
        loading: false,
    }),

    methods: {
        fetch() {
            this.loading = true;

            axios.get(this.route('inventory.reservations', this.product.id))
                .then(({ data }) => {
                    this.reservations = data;
                    this.loading = false;
                }).catch(this.errorHandler);
        },
    },
};
</script>

<style lang="scss">
    .tag.reservation {
        padding: 0 5px;
        font-size: 0.9em;
        height: unset;
    }
</style>
