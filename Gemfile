source "https://rubygems.org"

gem "jekyll", "~> 3.10.0"
gem "minima", "= 2.5.1"

gem "github-pages", "~> 232", group: :jekyll_plugins

# Specify the Jekyll version
# gem "jekyll", "~> 3.10.0"

# Markdown parser plugin
gem "kramdown-parser-gfm"

# Plugins for Jekyll
group :jekyll_plugins do
  gem "jekyll-postcss-v2"
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-seo-tag", "~> 2.8.0"
  gem "jekyll-sitemap", "~> 1.4.0"
  # gem "minima", "~> 2.5.2"
end

# Add gems required for Ruby 3.3.x compatibility
gem "logger"
gem "bigdecimal", "~> 3.1.5"
gem "base64"
gem "ostruct"
gem "jekyll-theme-minimal"


# Lock `http_parser.rb` gem to `v0.8.x`
gem "http_parser.rb", "~> 0.8.0"

# Windows-specific gems
platforms :mingw, :x64_mingw, :mswin do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
  gem "wdm", "~> 0.1" # Performance booster for watching directories
end
