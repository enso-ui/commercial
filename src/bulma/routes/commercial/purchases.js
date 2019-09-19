import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./purchases', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: 'purchases',
    component: RouterView,
    meta: {
        breadcrumb: 'purchases',
        route: 'commercial.purchases.index',
    },
    children: routes,
};
