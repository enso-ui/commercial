import routeImporter from '@enso-ui/ui/src/modules/importers/routeImporter';

const routes = routeImporter(require.context('./sales', false, /.*\.js$/));
const RouterView = () => import('@enso-ui/ui/src/bulma/pages/Router.vue');

export default {
    path: 'sales',
    component: RouterView,
    meta: {
        breadcrumb: 'sales',
        route: 'commercial.sales.index',
    },
    children: routes,
};
