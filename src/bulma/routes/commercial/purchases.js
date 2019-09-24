import routeImporter from '@enso-ui/ui/src/modules/importers/routeImporter';

const routes = routeImporter(require.context('./purchases', false, /.*\.js$/));
const RouterView = () => import('@enso-ui/ui/src/bulma/pages/Router.vue');

export default {
    path: 'purchases',
    component: RouterView,
    meta: {
        breadcrumb: 'purchases',
        route: 'commercial.purchases.index',
    },
    children: routes,
};
