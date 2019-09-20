<template>
    <div>
        <div class="columns is-multiline is-centered">
            <div class="column is-5">
                <client-filter :params="params"
                    :filters="filters.sales"/>
            </div>
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    :title="i18n('Date')"
                    default="thirtyDays"
                    v-model="params.dateInterval"
                    @update="
                        intervals.sales.date.min = $event.min;
                        intervals.sales.date.max = $event.max;
                    "/>
            </div>
        </div>
        <div class="columns is-multiline is-mobile is-centered">
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
                    v-model="filters.sales.is_finalized"/>
            </div>
            <div class="column is-narrow">
                <boolean-filter class="box raises-on-hover"
                    :title="i18n('Loss')"
                    v-model="filters.sales.is_loss"/>
            </div>
            <div class="column is-narrow">
                <boolean-filter class="box raises-on-hover"
                    :title="i18n('Fulfilled')"
                    v-model="params.fulfilled"/>
            </div>
            <div class="column is-narrow">
                <boolean-filter class="box raises-on-hover"
                    :title="i18n('Emag')"
                    v-model="params.emag"/>
            </div>
        </div>
        <filter-state :api-version="apiVersion"
            name="sale_filters"
            :filters="filters"
            :intervals="intervals"
            :params="params"
            ref="filterState"/>

        <enso-table class="box is-paddingless raises-on-hover"
            id="sales"
            :filters="filters"
            :intervals="intervals"
            :params="params"
            @create-company="create('company')"
            @create-individual="create('individual')"
            @reset="$refs.filterState.reset()"/>
    </div>
</template>

<script>
import { EnsoTable } from '@enso-ui/tables/bulma';
import {
    BooleanFilter, EnsoDateFilter, EnsoSelectFilter,
} from '@enso-ui/bulma';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBuilding, faUserTie } from '@fortawesome/free-solid-svg-icons';
import ClientFilter from '@enso-ui/financials/src/bulma/pages/financials/clients/components/ClientFilter.vue';
import FilterState from '../components/FilterState';

library.add(faBuilding, faUserTie);

export default {
    name: 'Index',

    components: {
        FilterState, BooleanFilter, EnsoDateFilter, EnsoTable, ClientFilter, EnsoSelectFilter,
    },

    inject: ['errorHandler', 'i18n', 'route'],

    data() {
        return {
            apiVersion: 1,
            filters: {
                sales: {
                    person_id: null,
                    company_id: null,
                },
            },
            intervals: {
                sales: {
                    date: {
                        min: null,
                        max: null,
                        dbDateFormat: 'Y-m-d',
                    },
                },
            },
            params: {
                fulfilled: null,
                client: null,
                emag: null,
                productId: null,
                dateInterval: 'thirtyDays',
            },
        };
    },

    methods: {
        create(type) {
            axios.post(this.route('commercial.sales.store'))
                .then(({ data }) => this.$router.push({
                    name: 'commercial.sales.edit',
                    params: { sale: data.id, type },
                })).catch(this.errorHandler);
        },
    },
};
</script>
