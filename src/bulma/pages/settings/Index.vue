<template>
    <div class="columns is-centered">
        <div class="column is-three-quarters-desktop is-full-touch">
            <enso-form class="box has-background-light raises-on-hover"
                :key="key"
                @ready="form = $event.form"
                @submit="submit"
                ref="form"/>
        </div>
    </div>
</template>

<script>
import { EnsoForm, FormField } from '@enso-ui/forms/bulma';

export default {
    name: 'Index',

    components: { EnsoForm, FormField },

    data: () => ({
        form: null,
        key: 1,
    }),

    methods: {
        submit() {
            if (!this.form.routeParam('settings')) {
                this.key++;
            }
        },
    },
};
</script>
