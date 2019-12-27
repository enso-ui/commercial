<template>
    <div>
        <div class="columns is-multiline is-centered"
            v-if="ready">
            <div class="column is-5">
                <client-filter :params="params"
                    :filters="filters.sales"/>
            </div>
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    v-model="params.dateInterval"
                    default="thirtyDays"
                    :name="i18n('Date')"
                    :interval="intervals"/>
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
                    v-model="filters.sales.is_finalized"/>
            </div>
            <div class="column is-narrow">
                <boolean-filter class="box raises-on-hover"
                    :name="i18n('Loss')"
                    v-model="filters.sales.is_loss"/>
            </div>
            <div class="column is-narrow">
                <boolean-filter class="box raises-on-hover"
                    :name="i18n('Fulfilled')"
                    v-model="params.fulfilled"/>
            </div>
            <div class="column is-narrow">
                <boolean-filter class="box raises-on-hover"
                    :name="i18n('Emag')"
                    v-model="params.emag"/>
            </div>
            <div class="column is-4-desktop is-3-widescreen">
                <enso-select-filter class="box raises-on-hover"
                    source="administration.users.options"
                    label="person.name"
                    :name="i18n('User')"
                    v-model="filters.sales.created_by"/>
            </div>
            <slot name="filters"/>
        </div>
        <filter-state :api-version="apiVersion"
            name="sale_filters"
            :filters="filters"
            :intervals="intervals"
            :params="params"
            @ready="ready = true"
            ref="filterState"/>

        <enso-table class="box is-paddingless raises-on-hover"
            id="sales"
            :filters="filters"
            :intervals="tableIntervals"
            :params="params"
            @create-company="create('company')"
            @create-individual="create('individual')"
            @reset="$refs.filterState.reset()"/>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { EnsoTable } from '@enso-ui/tables/bulma';
import { BooleanFilter, EnsoDateFilter, EnsoSelectFilter } from '@enso-ui/filters/bulma';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBuilding, faUserTie } from '@fortawesome/free-solid-svg-icons';
import ClientFilter from '@enso-ui/financials/src/bulma/pages/financials/clients/components/ClientFilter.vue';
import { FilterState } from '@enso-ui/filters/renderless';

library.add(faBuilding, faUserTie);

export default {
    name: 'Index',

    components: {
        FilterState, BooleanFilter, EnsoDateFilter, EnsoTable, ClientFilter, EnsoSelectFilter,
    },

    inject: ['errorHandler', 'i18n', 'route'],

    data() {
        return {
            apiVersion: 1.1,
            ready: false,
            filters: {
                sales: {
                    person_id: null,
                    company_id: null,
                    created_by: null,
                },
            },
            intervals: {
                min: null,
                max: null,
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

    computed: {
        ...mapState(['meta']),
        tableIntervals() {
            return {
                sales: {
                    date: {
                        min: this.intervals.min,
                        max: this.intervals.max,
                        dateFormat: null,
                    },
                },
            };
        },
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
