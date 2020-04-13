<template>
    <div class="wrapper">
        <div class="columns is-multiline is-centered">
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    default="thisMonth"
                    compact
                    :interval="filters.interval"
                    v-model="filters.interval.type"/>
            </div>
        </div>
        <enso-chart-card class="is-rounded raises-on-hover has-margin-bottom-large"
            :source="route('commercial.stats.orders')"
            :formatter="$options.filters.shortNumber"
            :params="filters">
            <template v-slot:controls>
                <card-control>
                    <vue-switch v-model="filters.quantities"/>
                </card-control>
            </template>
            <template v-slot:default="{ config }">
                <div class="columns"
                    v-if="config">
                    <div class="column"
                        v-for="dataset in config.data.datasets"
                        :key="dataset.label">
                        <info-panel :dataset="dataset"/>
                    </div>
                </div>
            </template>
        </enso-chart-card>
    </div>
</template>

<script>

import {
    VueSwitch, CardControl, EnsoDateFilter, EnsoChartCard, InfoPanel,
} from '@enso-ui/bulma';

export default {
    name: 'Index',

    components: {
        VueSwitch, CardControl, EnsoDateFilter, EnsoChartCard, InfoPanel,
    },

    inject: ['route'],

    data: () => ({
        filters: {
            quantities: false,
            interval: {
                type: 'thisMonth',
                min: null,
                max: null,
            },
        },
    }),
};

</script>
