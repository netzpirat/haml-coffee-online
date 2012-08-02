guard 'haml', output: 'public', input: 'src' do
  watch(/^.+(\.haml)/)
end

guard 'sass', input: 'src/stylesheets', output: 'public/stylesheets', :load_paths => ['src/stylesheets/bourbon']

guard 'coffeescript', input: 'src/javascripts', output: 'public/javascripts'

guard 'livereload' do
  watch(%r{public/.+\.(css|js|html)})
end
