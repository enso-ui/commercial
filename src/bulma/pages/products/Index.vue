<template>
    <div>
        <div class="columns is-centered is-multiline"
             v-if="ready">
            <div class="column is-3">
                <suppliers class="select-wrapper box raises-on-hover"
                    :params="params"/>
            </div>
            <div class="column is-narrow">
                <enso-interval-filter class="box raises-on-hover narrow-filter"
                    :name="i18n('Quantity')"
                    type="number"
                    v-model="intervals.inventory_stocks.quantity"/>
            </div>
            <div class="column is-narrow">
                <enso-interval-filter class="box raises-on-hover narrow-filter"
                    :name="i18n('Rotation')"
                    type="number"
                    v-model="intervals.inventory_stocks.rotation"/>
            </div>
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    :name="i18n('Updated')"
                    default="lastMonth"
                    v-model="params.dateInterval"
                    @update="
                        intervals.products.updated_at.min = $event.min;
                        intervals.products.updated_at.max = $event.max;
                    "/>
            </div>
        </div>
        <enso-table class="box is-paddingless raises-on-hover"
            ref="products"
            id="products"
            :intervals="intervals"
            :filters="filters"
            :params="params"
            @manage-positions="productId=$event.id"
            @reset="$refs.filterState.reset()">
            <template v-slot:reserved="{ row }">
                <reservations :product="row"
                    :classes="'is-info is-raised is-bold is-clickable'"/>
            </template>
            <template v-slot:stock="{ row }">
                <product-locations :product="row"
                    :classes="'is-info is-raised is-bold is-clickable'"/>
            </template>
            <template v-slot:pictureUrl="{ row }">
                <figure class="image product-image is-48x48 has-vertically-centered-content">
                    <a :href="row.pictureUrl" target="_blank">
                        <img :src="row.pictureUrl" alt="cover">
                    </a>
                </figure>
            </template>
        </enso-table>
        <modal show
            v-if="productId"
            @keyup.esc="close"
            @close="close">
            <positions-manager :product-id="productId"/>
        </modal>
        <filter-state :api-version="apiVersion"
            name="product_filters"
            :filters="filters"
            :intervals="intervals"
            :params="params"
            @ready="ready = true"
            ref="filterState"/>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import {
    Modal, BooleanFilter, EnsoDateFilter, EnsoFilter,
    EnsoSelectFilter, EnsoIntervalFilter, FilterState,
} from '@enso-ui/bulma';
import { EnsoTable } from '@enso-ui/tables/bulma';
import ProductLocations from '@enso-ui/inventory/src/bulma/components/ProductLocations.vue';
import PositionsManager from '@enso-ui/commercial/src/bulma/components/inventory/PositionsManager.vue';
import Reservations from '@enso-ui/commercial/src/bulma/pages/components/Reservations.vue';
import Suppliers from '@enso-ui/commercial/src/bulma/pages/products/components/Suppliers.vue';

library.add(faBoxOpen);

export default {
    name: 'Index',

    components: {
        BooleanFilter,
        EnsoDateFilter,
        EnsoFilter,
        EnsoIntervalFilter,
        EnsoSelectFilter,
        EnsoTable,
        FilterState,
        Modal,
        Reservations,
        PositionsManager,
        ProductLocations,
        Suppliers,
    },

    inject: ['i18n', 'route'],

    data: () => ({
        apiVersion: 1.0,
        filters: {
            products: {
                manufacturer_id: null
            }
        },
        intervals: {
            inventory_stocks: {
                quantity: {
                    max: null,
                    min: null
                },
                rotation: {
                    max: null,
                    min: null
                }
            },
            products: {
                updated_at: {
                    dateFormat: null,
                    max: null,
                    min: null
                }
            }
        },
        params: {
            dateInterval: 'all',
            onlyPurchasedFrom: false,
            supplierId: null
        },
        productId: null,
        ready: false,
    }),

    computed: {
        ...mapState(['meta', 'enums']),
    },

    methods: {
        close() {
            this.productId = null;
            this.$refs.products.fetch();
        },
    },
};
</script>

<style lang="scss">
.narrow-filter .input-wrapper {
    width: 16em;
}
.image.product-image.is-48x48 > a {
    width: 48px;
    height: 48px;
    img {
        margin: auto;
        width: auto;
        height: auto;
        max-width: 48px;
        max-height: 48px;
    }
}
</style>
