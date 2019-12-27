<template>
    <sale class="box has-background-light raises-on-hover">
        <template v-slot:actions>
            <slot name="actions"/>
        </template>
    </sale>
</template>

<script>
import Sale from './components/Sale.vue';

export default {
    name: 'Edit',

    components: { Sale },
};
</script>
