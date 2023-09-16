const pluginWebc = require("@11ty/eleventy-plugin-webc");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginWebc, {
    components: "src/_includes/**/*.webc",
  });

  eleventyConfig.addLayoutAlias("base", "base.webc");

  return {
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
  };
};
