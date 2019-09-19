import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./purchaseReturns', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: 'purchaseReturns',
    component: RouterView,
    meta: {
        breadcrumb: 'purchase returns',
        route: 'commercial.purchaseReturns.index',
    },
    children: routes,
};
