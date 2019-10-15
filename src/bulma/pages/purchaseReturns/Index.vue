<template>
    <div>
        <div class="columns is-centered is-multiline"
            v-if="ready">
            <div class="column is-4">
                <enso-select-filter class="box raises-on-hover"
                    source="administration.companies.options"
                    :name="i18n('Supplier')"
                    v-model="filters.purchase_returns.supplier_id"/>
            </div>
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    v-model="params.dateInterval"
                    default="thirtyDays"
                    :name="i18n('Date')"
                    :interval="intervals.purchase_returns.date"/>
            </div>
            <div class="column is-4-desktop is-3-widescreen">
                <enso-select-filter class="box raises-on-hover"
                    source="products.options"
                    disable-filtering
                    :name="i18n('Product')"
                    v-model="params.productId"/>
            </div>
            <div class="column is-narrow">
                <boolean-filter class="box raises-on-hover"
                    :name="i18n('Finalized')"
                    v-model="filters.purchase_returns.is_finalized"/>
            </div>
            <div class="column is-narrow">
                <boolean-filter class="box raises-on-hover"
                    :name="i18n('Fulfilled')"
                    v-model="params.fulfilled"/>
            </div>
        </div>

        <filter-state :api-version="apiVersion"
            name="purchase_return_filters"
            :filters="filters"
            :intervals="intervals"
            :params="params"
            @ready="ready = true"
            ref="filterState"/>

        <enso-table class="box is-paddingless raises-on-hover"
            id="purchaseReturns"
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
            apiVersion: 1.1,
            ready: false,
            filters: {
                purchase_returns: {
                    supplier_id: null,
                },
            },
            intervals: {
                purchase_returns: {
                    date: {
                        min: null,
                        max: null,
                        dateFormat: null,
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
            axios.post(this.route('commercial.purchaseReturns.store'))
                .then(({ data }) => this.$router.push({
                    name: 'commercial.purchaseReturns.edit',
                    params: { purchaseReturn: data.id },
                })).catch(this.errorHandler);
        },
    },
};
</script>
