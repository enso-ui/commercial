import routeImporter from '@enso-ui/ui/src/modules/importers/routeImporter';

const routes = routeImporter(require.context('./commercial', false, /.*\.js$/));
const RouterView = () => import('@enso-ui/ui/src/bulma/pages/Router.vue');

export default {
    path: '/commercial',
    component: RouterView,
    meta: {
        breadcrumb: 'commercial',
    },
    children: routes,
};
