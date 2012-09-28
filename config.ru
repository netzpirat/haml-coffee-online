use Rack::Static,
  :urls => ['/assets', '/images'],
  :root => 'public'

map '/worker-coffee.js' do
  run Rack::File.new('vendor/scripts/ace/worker-coffee.js')
end

map '/worker-javascript.js' do
  run Rack::File.new('vendor/scripts/ace/worker-javascript.js')
end

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'public, max-age=86400'
    },
    File.open('public/index.html', File::RDONLY)
  ]
}
