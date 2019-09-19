import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./sales', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: 'sales',
    component: RouterView,
    meta: {
        breadcrumb: 'sales',
        route: 'commercial.sales.index',
    },
    children: routes,
};
