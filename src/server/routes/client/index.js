const clientRoute = ({ static }) => (
  static(`react-expenses-manager/build`)
);

const mountClientRoutes = ({ static }) => ({ router }) => {
  // client route /
  router.use('/', clientRoute({ static }));
}

module.exports = mountClientRoutes;