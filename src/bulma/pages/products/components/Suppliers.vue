<template>
    <core-select-filter :i18n="i18n"
        :title="i18n('Supplier')">
        <div class="is-flex">
            <enso-select class="select-wrapper"
                v-bind="$attrs"
                v-on="$listeners"
                source="administration.companies.options"
                v-model="params.supplierId"
                @clear="params.mapping=false"/>
            <vue-switch class="has-padding-large is-larges is-info"
                v-tooltip="params.mapping ? i18n('Only purchased from') : i18n('Only sold by')"
                v-model="params.mapping"
                v-if="params.supplierId !== null"/>
        </div>
    </core-select-filter>
</template>

<script>
import { VTooltip } from 'v-tooltip';
import { EnsoSelect } from '@enso-ui/select/bulma';
import VueSwitch from '@enso-ui/switch/bulma';
import CoreSelectFilter from '@enso-ui/filters/src/bulma/CoreSelectFilter.vue';

export default {
    name: 'Suppliers',

    directives: { tooltip: VTooltip },

    components: { CoreSelectFilter, EnsoSelect, VueSwitch },

    inject: ['i18n'],

    props: {
        params: {
            type: Object,
            required: true,
        },
    },
};
</script>
