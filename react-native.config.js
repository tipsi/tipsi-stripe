module.exports = {
  dependency: {
    hooks: {
      "prelink": "node_modules/tipsi-stripe/scripts/pre-link.sh",
      "postlink": "node_modules/tipsi-stripe/scripts/post-link.sh",
    },
  },
};
