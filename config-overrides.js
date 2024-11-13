const path = require('path');

module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.md$/,
    use: [
      {
        loader: 'frontmatter-markdown-loader',
        options: {
          mode: ['react-component']
        }
      }
    ]
  });

  return config;
} 