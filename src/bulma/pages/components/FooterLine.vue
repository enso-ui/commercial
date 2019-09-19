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
                    {{ form.field('quantity').value }}
                </div>
            </td>
            <td v-if="!order.warehouse"/>
            <td :colspan="order.warehouse ? 2 : 4"/>
            <td class="has-text-right is-bold total-price"
                v-if="!order.warehouse">
                {{ form.field('total').value | numberFormat(2) }}
            </td>
            <td/>
        </tr>
    </tfoot>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';


library.add(faInfoCircle);

export default {
    name: 'FooterLine',

    inject: ['i18n', 'order', 'fulfilling'],

    computed: {
        form() {
            return this.order.form;
        },
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
