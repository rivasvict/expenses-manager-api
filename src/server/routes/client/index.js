const clientRoute = ({ static, path }) => (
  static(path.join(__dirname, `../../../../react-expenses-manager/build`))
);

const mountClientRoutes = ({ static, path }) => ({ router }) => {
  // client route /
  router.use('/', clientRoute({ static, path }));
}

module.exports = mountClientRoutes;