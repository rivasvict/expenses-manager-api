const mountAuthenticationRoutes = ({ router, baseUrl }) => {
  router.post(`${baseUrl}/blabla`, (req, res) => {
    res.sendStatus(200);
  });
};

module.exports = mountAuthenticationRoutes;
