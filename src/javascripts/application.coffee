$(document).ready ->

  select = $('#examples')

  for example in window.EXAMPLES
    select.append "<option>#{ example.name }</option>"

  select.change ->
    for example in window.EXAMPLES
      if example.name is $(@).val()
        $('#template').val example.template
        $('#data').val example.data

  select.trigger 'change'

  $('#render').click ->
    try
      Compiler = require('./haml-coffee')
      compiler = new Compiler({
        escapeHtml: $('#escapeHtml').is(':checked')
        escapeAttributes: $('#escapeAttributes').is(':checked')
        cleanValue: $('#cleanValue').is(':checked')
        uglify: $('#uglify').is(':checked')
        extendScope: $('#extendScope').is(':checked')
        format: $('#format').val()
      })

      compiler.parse $('#template').val()
    catch e
      $('#result').val "Error parsing emplate: #{ e.message }"

    try
      template = new Function CoffeeScript.compile(compiler.precompile(), bare: true)
    catch e
      $('#result').val "Error compiling template: #{ e.message }"

    try
      data = CoffeeScript.eval($('#data').val())
    catch e
      $('#result').val "Error evaluating data: #{ e.message }"

    try
      result = template.call data
      $('#result').val result

    catch e
      $('#result').val "Error render template: #{ e.message }"

window.EXAMPLES = [
  {
    name: "Haml Online"
    template: """
      !!!
      #main
        .note
          %h2 Quick Notes
          %ul
            %li
              Haml Coffee is usually indented with two spaces,
              although more than two is allowed.
              You have to be consistent, though.
            %li
              The first character of any line is called
              the "control character" - it says "make a tag"
              or "run CoffeeScript code" or all sorts of things.
            %li
              Haml takes care of nicely indenting your HTML.
            %li
              Haml Coffee allows CoffeeScript code and blocks.

        .note
          You can get more information by reading the
          %a{:href => "https://github.com/netzpirat/haml-coffee"}
            Official Haml Coffee Documentation

        .note
          %p
            CoffeeScript code is included by using = at the
            beginning of a line.
          %p
            Read the tutorial for more information.
    """
    data: """
    """
  }
  {
    name: "Elements, Classes and Ids"
    template: """
      !!!
      %article
        %h1= "hello \#{ @greet }"
        %section#note I've an id
        .big.black{ class: @class } I've three classes
    """
    data: """
      {
        greet: 'Visitor'
        class: 'important'
      }
    """
  }
  {
  name: "Attributes"
  template: """
    %a(name="HTML") HTML style attributes
    %a{ :name => "Ruby 1.8" } Ruby 1.8 style attributes
    %a{ name: "Ruby 1.9" } Ruby 1.9 style attributes

    %div{ data: { rule: 'admin', bind: 'true' }}

    %a(name=@name) Code attribute
    %a{ name: if @name is 'Haml Coffee' then 'Yep' else 'Nope' }
  """
  data: """
    {
      name: 'Haml Coffee'
    }
  """
  }
  {
    name: "HAML Helpers"
    template: """
      != surround '(', ')', ->
        %a{:href => "food"} chicken
      click
      != succeed '.', ->
        %a{:href=>"thing"} here
      != precede '*', ->
        %span.small Not really
    """
    data: """
    """
  }
  {
    name: "Multiline"
    template: """
      %whoo
        %hoo=                          |
          "I think this might get " +  |
          "pretty long so I should " + |
          "probably make it " +        |
          "multiline so it doesn't " + |
          "look awful."                |
        %p This is short.

      .share-notebook{ title: 'bar', |
        bar: 'foo' }                 |
    """
    data: """
    """
  }
  {
    name: "Whitespace cleanup"
    template: """
      %div
        %ul
          %li One
          %li Two
          %li Three
      %div
        %ul
          %li> One
          %li Two
          %li Three
      %div
        %ul
          %li One
          %li> Two
          %li Three
      %div
        %ul
          %li One
          %li Two
          %li> Three
      %div
        %ul
          %li One
          %li Two
          %li
            Three
            Four
            Five
      %div
        %ul
          %li One
          %li Two
          %li<
            Three
            Four
            Five
    """
    data: """
    """
  }
  {
    name: "Filters"
    template: """
      - if @visible
        %body
          :coffeescript
            tags = ["CoffeeScript", "Haml"]
            project = 'Haml Coffee'
          %h2= project
          %ul
            - for tag in tags
              %li= tag
      :css
        #pants{
         font-weight:"bold";
        }
    """
    data: """
      {
        visible: true
      }
    """
  }
  {
    name: "CoffeeScript evaluation"
    template: """
      %ul
        - for article in @articles
          - if article.online
            %li= article.name
    """
    data: """
      {
        articles: [
          {
            name: 'Article 1'
            online: true
          }
          {
            name: 'Article 2'
            online: false
          }
          {
            name: 'Article 3'
            online: true
          }
        ]
      }
    """
  }
  {
    name: "CoffeeScript evaluation in function"
    template: """
      - foo = (text) -> "Foo: \#{ text() }"
      - bar = -> 'Bar'
      != foo ->
        %br
        != bar()
    """
    data: """
    """
  }

]
