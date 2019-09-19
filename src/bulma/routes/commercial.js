import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./commercial', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: '/commercial',
    component: RouterView,
    meta: {
        breadcrumb: 'commercial',
    },
    children: routes,
};
