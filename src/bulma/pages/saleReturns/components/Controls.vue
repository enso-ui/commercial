<template>
    <div class="wrapper">
        <div class="columns">
            <div class="column">
                <div class="actions has-text-right">
                    <flow/>
                </div>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <actions/>
            </div>
        </div>
    </div>
</template>

<script>
import Flow from './Flow.vue';
import Actions from './Actions.vue';

export default {
    name: 'Controls',

    components: { Flow, Actions },
};
</script>
