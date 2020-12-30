const packageJSON = require("./package.json");

module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: packageJSON.repository,
        permanent: false,
      },
    ];
  },
};
