<template>
    <tr>
        <td class="has-text-centered">
            {{ index + 1 }}
        </td>
        <td class="has-text-centered">
            {{ line.label }}
        </td>
        <td class="has-text-centered">
            {{ line.quantity }}
        </td>
        <td class="has-text-centered">
            -
        </td>
    </tr>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core/index.js';
import { faRandom } from '@fortawesome/free-solid-svg-icons/index.js';

library.add(faRandom);

export default {
    name: 'AdjustLine',

    props: {
        line: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        productId: {
            type: [Number, String],
            required: true,
        },
    },
};
</script>
