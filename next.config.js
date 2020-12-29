const package = require("./package.json");

module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: package.repository,
        permanent: false,
      },
    ];
  },
};
