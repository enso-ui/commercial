import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./stocks', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: 'stocks',
    component: RouterView,
    meta: {
        breadcrumb: 'client stocks',
        route: 'commercial.stocks.index',
    },
    children: routes,
};
