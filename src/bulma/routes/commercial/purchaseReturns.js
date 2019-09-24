import routeImporter from '@enso-ui/ui/src/modules/importers/routeImporter';

const routes = routeImporter(require.context('./purchaseReturns', false, /.*\.js$/));
const RouterView = () => import('@enso-ui/ui/src/bulma/pages/Router.vue');

export default {
    path: 'purchaseReturns',
    component: RouterView,
    meta: {
        breadcrumb: 'purchase returns',
        route: 'commercial.purchaseReturns.index',
    },
    children: routes,
};
