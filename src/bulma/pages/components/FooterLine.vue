<template>
    <tfoot>
        <tr class="has-background-light">
            <td class="has-text-centered is-bold"
                colspan="2">
                {{ i18n('Grand Total') }}
            </td>
            <td colspan="3"/>
            <td class="has-text-right is-bold">
                <div class="total-quantity">
                    {{ field('quantity').value }}
                </div>
            </td>
            <td v-if="!fulfilled"/>
            <td :colspan="fulfilled ? 2 : 4"/>
            <td class="has-text-right is-bold total-price"
                v-if="!fulfilled">
                {{ field('total').value | numberFormat(2) }}
            </td>
            <td/>
        </tr>
    </tfoot>
</template>

<script>
import { mapState } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';


library.add(faInfoCircle);

export default {
    name: 'FooterLine',

    inject: ['i18n', 'order'],

    computed: {
        ...mapState(['enums']),
        field() {
            return this.order.form.field;
        },
        fulfilled() {
            return this.field('status').value === this.enums.orderStatuses.Fulfilled;
        }
    },
};
</script>

<style>
    .total-price, .total-quantity {
        font-family: monospace;
        font-size: 1.2em;
        text-align: right;
    }

    .total-quantity {
        padding-right: 0.5em;
    }
</style>
