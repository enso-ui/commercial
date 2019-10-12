<template>
    <div>
        <div class="columns is-multiline is-centered"
            v-if="ready">
            <div class="column is-3">
                <enso-select-filter class="box raises-on-hover"
                    source="administration.companies.options"
                    :title="i18n('Supplier')"
                    v-model="filters.purchases.supplier_id"/>
            </div>
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    v-model="params.dateInterval"
                    default="thirtyDays"
                    :title="i18n('Date')"
                    :interval="intervals.purchases.date"/>
            </div>
            <div class="column is-4-desktop is-3-widescreen">
                <enso-select-filter class="box raises-on-hover"
                    source="products.options"
                    disable-filtering
                    :title="i18n('Product')"
                    v-model="params.productId"/>
            </div>
            <div class="column is-narrow">
                <boolean-filter class="box raises-on-hover"
                    :title="i18n('Finalized')"
                    v-model="filters.purchases.is_finalized"/>
            </div>
            <div class="column is-narrow">
                <boolean-filter class="box raises-on-hover"
                    :title="i18n('Inventory')"
                    v-model="filters.purchases.is_inventory"/>
            </div>
            <div class="column is-narrow">
                <boolean-filter class="box raises-on-hover"
                    :title="i18n('Fulfilled')"
                    v-model="params.fulfilled"/>
            </div>
        </div>
        <filter-state :api-version="apiVersion"
            name="purchase_filters"
            :filters="filters"
            :intervals="intervals"
            :params="params"
            @ready="ready = true"
            ref="filterState"/>

        <enso-table class="box is-paddingless raises-on-hover"
            id="purchases"
            :intervals="intervals"
            :filters="filters"
            :params="params"
            @create="create"
            @reset="$refs.filterState.reset()"/>
    </div>
</template>

<script>
import { BooleanFilter, EnsoDateFilter, EnsoSelectFilter } from '@enso-ui/filters/bulma';
import { EnsoTable } from '@enso-ui/tables/bulma';
import { FilterState } from '@enso-ui/filters/renderless';

export default {
    name: 'Index',

    components: {
        BooleanFilter, EnsoDateFilter, EnsoSelectFilter, EnsoTable, FilterState,
    },

    inject: ['errorHandler', 'i18n', 'route'],

    data() {
        return {
            apiVersion: 1,
            ready: false,
            filters: {
                purchases: {
                    supplier_id: null,
                },
            },
            intervals: {
                purchases: {
                    date: {
                        min: null,
                        max: null,
                        dbDateFormat: 'Y-m-d',
                    },
                },
            },
            params: {
                fulfilled: null,
                productId: null,
                dateInterval: 'thirtyDays',
            },
        };
    },

    methods: {
        create() {
            axios.post(this.route('commercial.purchases.store'))
                .then(({ data }) => this.$router.push({
                    name: 'commercial.purchases.edit',
                    params: { purchase: data.id },
                })).catch(this.errorHandler);
        },
    },
};
</script>
