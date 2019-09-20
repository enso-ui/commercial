<template>
    <div>
        <div class="columns is-centered">
            <div class="column is-4-desktop">
                <suppliers class="select-wrapper box raises-on-hover"
                           :params="params"/>
            </div>
        </div>
        <div class="columns is-centered">
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    :title="i18n('Updated')"
                    default="thirtyDays"
                    v-model="params.dateInterval"
                    @update="
                        intervals.products.updated_at.min = $event.min;
                        intervals.products.updated_at.max = $event.max;
                    "/>
            </div>
        </div>
        <filter-state :api-version="apiVersion"
            name="product_filters"
            :filters="filters"
            :intervals="intervals"
            :params="params"
            ref="filterState"/>
        <enso-table class="box is-paddingless raises-on-hover"
            ref="stocks"
            id="products"
            :intervals="intervals"
            :params="params"
            @manage-positions="productId=$event.dtRowId"
            @reset="$refs.filterState.reset()"/>
        <modal show
            v-if="productId"
            @keyup.esc="close"
            @close="close">
            <positions-manager :product-id="productId"/>
        </modal>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import {
    Modal, EnsoTable, EnsoDateFilter,
} from '@enso-ui/bulma';
import PositionsManager from '@enso-ui/commercial/src/bulma/components/inventory/PositionsManager.vue';
import FilterState from '@enso-ui/commercial/src/bulma/pages/components/FilterState';
import Suppliers from './components/Suppliers.vue';

library.add(faBoxOpen);

export default {

    components: {
        Modal,
        PositionsManager,
        EnsoTable,
        EnsoDateFilter,
        FilterState,
        Suppliers,
    },

    inject: ['i18n'],

    data() {
        return {
            apiVersion: 1,
            productId: null,
            filters: {
                products: {
                    publisher_id: null,
                },
            },
            intervals: {
                products: {
                    updated_at: {
                        min: null,
                        max: null,
                        dbDateFormat: 'Y-m-d',
                    },
                },
            },
            params: {
                mapping: false,
                supplierId: null,
                dateInterval: 'all',
            },
        };
    },

    methods: {
        close() {
            this.productId = null;
            this.$refs.stocks.fetch();
        },
    },
};

</script>
