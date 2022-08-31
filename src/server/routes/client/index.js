const serveClient = ({ static, path, staticDirectory }) =>
  static(path.join(__dirname, staticDirectory));

const clientRoute =
  ({ path, staticDirectory }) =>
  (req, res) =>
    res.sendFile(path.join(__dirname, `${staticDirectory}/index.html`));

const mountClientRoutes =
  ({ static, path }) =>
  ({ router }) => {
    const staticDirectory = `../../../../react-expenses-manager/build`;
    // client route /
    router.use(serveClient({ static, path, staticDirectory }));
    router.get("*", clientRoute({ path, staticDirectory }));
  };

module.exports = mountClientRoutes;
