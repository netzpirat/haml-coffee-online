guard 'haml', output: 'public', input: 'src' do
  watch(/^.+(\.haml)/)
end

guard 'sass', input: 'src/styles', output: 'src/styles', :load_paths => ['src/stylesheets/bourbon']

guard 'coffeescript', input: 'src/scripts', output: 'src/scripts'

guard :jammit, public_root: 'public' do
  watch(/^src\/scripts\/(.*)\.js$/)
  watch(/^src\/styles\/(.*)\.css$/)
  watch(/^vendor\/scripts\/(.*)\.js$/)
  watch(/^vendor\/styles\/(.*)\.css$/)
end

guard 'livereload' do
  watch(%r{public/.+\.(css|js|html)})
end
