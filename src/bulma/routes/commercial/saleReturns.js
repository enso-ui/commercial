import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./saleReturns', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: 'saleReturns',
    component: RouterView,
    meta: {
        breadcrumb: 'sale returns',
        route: 'commercial.saleReturns.index',
    },
    children: routes,
};
