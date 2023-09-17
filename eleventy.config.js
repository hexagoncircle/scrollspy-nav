const pluginWebc = require("@11ty/eleventy-plugin-webc");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginWebc, {
    components: "scrollspy-nav.webc",
  });

  eleventyConfig.addLayoutAlias("base", "base.webc");
  eleventyConfig.ignores.add("README.md");

  return {
    dir: {
      output: "docs",
      layouts: "layouts",
    },
  };
};
