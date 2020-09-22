<template>
    <card header
        refresh
        icon="box-open"
        :name="i18n('Position Manager')"
        :badge="totalQuantity"
        :overlay="loading"
        @refresh="fetch">
        <card-header class="has-background-light">
            <template v-slot:title>
                <span class="icon is-small has-margin-right-small">
                    <fa icon="box-open"/>
                </span>
                {{ i18n('Position Manager') }}
            </template>
            <template v-slot:controls>
                <card-control
                    v-if="canAccess('inventory.adjust')">
                    <span class="icon is-small">
                        <button class="button is-naked"
                            :class="{ 'has-text-success': adjustMode }"
                            @click="adjustMode = !adjustMode">
                        <span class="icon">
                            <fa icon="cogs"/>
                        </span>
                    </button>
                    </span>
                </card-control>
                <card-refresh @refresh="fetch"/>
                <card-badge :label="totalQuantity"
                    type="is-bold has-background-warning"/>
                <card-collapse/>
            </template>
        </card-header>
        <card-content class="is-paddingless">
            <lines class="animated fadeIn"
                :product-id="productId"
                :adjust-mode="adjustMode"
                @hook:mounted="ready = true"
                ref="lines"/>
        </card-content>
    </card>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core/index.js';
import { faBoxOpen, faCogs } from '@fortawesome/free-solid-svg-icons/index.js';
import {
    Card, CardHeader, CardRefresh, CardCollapse, CardBadge, CardContent, CardControl,
} from '@enso-ui/card/bulma';

import Lines from './Lines.vue';

library.add(faBoxOpen, faCogs);

export default {
    name: 'PositionsManager',

    components: {
        Lines,
        Card,
        CardHeader,
        CardRefresh,
        CardCollapse,
        CardBadge,
        CardContent,
        CardControl,
    },

    inject: ['errorHandler', 'i18n'],

    props: {
        productId: {
            type: Number,
            required: true,
        },
    },

    data() {
        return {
            adjustMode: false,
            ready: false,
        };
    },

    computed: {
        loading() {
            return this.ready && this.$refs.lines.loading;
        },
        totalQuantity() {
            return this.ready ? this.$refs.lines.totalQuantity : 0;
        },
    },

    watch: {
        totalQuantity(quantity) {
            this.$emit('update', quantity);
        },
    },

    methods: {
        fetch() {
            if (this.$refs.lines) {
                this.$refs.lines.fetch();
            }
        },
    },

};
</script>
