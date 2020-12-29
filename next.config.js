module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://github.com/phuctm97/img",
        permanent: true,
      },
    ];
  },
};
