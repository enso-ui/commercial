<template>
    <div>
        <div class="columns is-multiline is-centered"
            v-if="ready">
            <div class="column is-5">
                <client-filter :params="params"
                    :filters="filters.sale_returns"/>
            </div>
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    v-model="params.dateInterval"
                    default="thirtyDays"
                    :name="i18n('Date')"
                    :interval="intervals.sale_returns.date"/>
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
                    v-model="filters.sale_returns.is_finalized"/>
            </div>
            <div class="column is-narrow">
                <boolean-filter class="box raises-on-hover"
                    :name="i18n('Fulfilled')"
                    v-model="params.fulfilled"/>
            </div>
        </div>

        <filter-state :api-version="apiVersion"
            name="sale_return_filters"
            :filters="filters"
            :intervals="intervals"
            :params="params"
            @ready="ready = true"
            ref="filterState"/>

        <enso-table class="box is-paddingless raises-on-hover"
            id="sale_returns"
            :filters="filters"
            :intervals="intervals"
            :params="params"
            @create-company="create('company')"
            @create-individual="create('individual')"
            @reset="$refs.filterState.reset()"/>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBuilding, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { BooleanFilter, EnsoDateFilter, EnsoSelectFilter } from '@enso-ui/filters/bulma';
import { EnsoTable } from '@enso-ui/tables/bulma';
import ClientFilter from '@enso-ui/financials/src/bulma/pages/financials/clients/components/ClientFilter.vue';
import { FilterState } from '@enso-ui/filters/renderless';

library.add(faBuilding, faUserTie);

export default {
    name: 'Index',

    components: {
        BooleanFilter, ClientFilter, EnsoDateFilter, EnsoTable, EnsoSelectFilter, FilterState,
    },

    inject: ['errorHandler', 'i18n', 'route'],

    data() {
        return {
            apiVersion: 1.1,
            ready: false,
            filters: {
                sale_returns: {
                    is_finalized: null,
                    person_id: null,
                    company_id: null,
                },
            },
            intervals: {
                sale_returns: {
                    date: {
                        min: null,
                        max: null,
                        dateFormat: null,
                    },
                },
            },
            params: {
                fulfilled: null,
                client: null,
                productId: null,
                dateInterval: 'thirtyDays',
            },
        };
    },

    methods: {
        create(type) {
            axios.post(this.route('commercial.saleReturns.store'))
                .then(({ data }) => this.$router.push({
                    name: 'commercial.saleReturns.edit',
                    params: { saleReturn: data.id, type },
                })).catch(this.errorHandler);
        },
    },
};
</script>
