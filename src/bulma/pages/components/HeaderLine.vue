<template>
    <thead>
        <tr class="has-background-light">
            <th>
                #
            </th>
            <th>
                {{ i18n('Product') }}
            </th>
            <th>
                {{ i18n('Code') }}
            </th>
            <th class="quantity">
                {{ i18n('Stock') }}
            </th>
            <th class="quantity">
                {{ i18n('Reserved') }}
            </th>
            <th class="quantity">
                <span class="header-item">
                    {{ i18n('Quantity') }}
                </span>
            </th>
            <th v-if="!fulfilled">
                <span class="header-item">
                    {{ i18n('List') }}
                </span>
            </th>
            <th v-if="!fulfilled">
                <span class="header-item">
                    {{ i18n('Discount') }}
                </span>
            </th>
            <th v-if="!fulfilled">
                <span class="header-item">
                    {{ i18n('Unitary Price') }}
                </span>
            </th>
            <th v-if="!fulfilled">
                <span class="header-item">
                    {{ i18n('Value') }}
                </span>
            </th>
            <th v-if="!fulfilled">
                {{ i18n('VAT') }}
            </th>
            <th
                v-if="!fulfilled">
                {{ i18n('Total') }}
            </th>
            <th
                v-if="fulfilled">
                {{ i18n('Position') }}
            </th>
            <th
                v-if="fulfilled">
                {{ i18n('New Position') }}
            </th>
            <th/>
        </tr>
    </thead>
</template>

<script>
import { mapState } from 'vuex';
import { VTooltip } from 'v-tooltip';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

library.add(faDollarSign);

export default {
    name: 'HeaderLine',

    directives: { tooltip: VTooltip },

    inject: ['i18n', 'order'],

    computed: {
        ...mapState(['enums']),
        fulfilled() {
            return this.order.form.field('status')
                .value === this.enums.orderStatuses.Fulfilled;
        }
    }
};
</script>

<style lang="scss">
    .header-item {
        display: flex;
        justify-content: center;
    }

    th {
        text-align: center !important;
    }
</style>
