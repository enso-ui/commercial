<template>
    <sale class="box has-background-light raises-on-hover">
        <template v-slot:controls>
            <slot name="controls"/>
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
