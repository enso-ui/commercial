<template>
    <purchase class="box has-background-light raises-on-hover">
        <template v-slot:controls>
            <slot name="controls"/>
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
