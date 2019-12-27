<template>
    <purchase class="box has-background-light raises-on-hover">
        <template v-slot:actions>
            <slot name="actions"/>
        </template>
    </purchase>
</template>

<script>
import Purchase from './components/Purchase.vue';

export default {
    name: 'Edit',

    components: { Purchase },
};
</script>
