$(document).ready ->

  $('#examples').select2({ width: '300px' })
  $('#format').select2({ width: '100px' })

  template = ace.edit 'template'
  template.setTheme 'ace/theme/github'
  template.getSession().setMode 'ace/mode/coffee'
  template.getSession().setUseWrapMode true
  template.getSession().setTabSize 2
  template.getSession().setUseWorker false

  data = ace.edit 'data'
  data.setTheme 'ace/theme/github'
  data.getSession().setMode 'ace/mode/coffee'
  data.getSession().setUseWrapMode true
  data.getSession().setTabSize 2
  data.getSession().setUseWorker false

  cst = ace.edit 'cst'
  cst.setTheme 'ace/theme/github'
  cst.getSession().setMode 'ace/mode/coffee'
  cst.setReadOnly true
  cst.getSession().setUseWrapMode true
  cst.getSession().setTabSize 2
  cst.getSession().setUseWorker false

  jst = ace.edit 'jst'
  jst.setTheme 'ace/theme/github'
  jst.getSession().setMode 'ace/mode/javascript'
  jst.setReadOnly true
  jst.getSession().setUseWrapMode true
  jst.getSession().setTabSize 2
  jst.getSession().setUseWorker false


  result = ace.edit 'result'
  result.setTheme 'ace/theme/github'
  result.getSession().setMode 'ace/mode/html'
  result.setReadOnly true
  result.setShowPrintMargin false
  result.getSession().setUseWrapMode true
  result.getSession().setTabSize 2
  result.getSession().setUseWorker false

  Compiler = require './haml-coffee'

  select = $('#examples')

  for example in window.EXAMPLES
    select.append "<option>#{ example.name }</option>"

  select.change (event) =>
    for example in window.EXAMPLES
      if example.name is $(event.currentTarget).val()
        template.setValue example.template
        template.gotoLine 1
        template.clearSelection()
        template.getSession().setScrollTop 0

        data.setValue example.data
        data.gotoLine 1
        data.clearSelection()
        data.getSession().setScrollTop 0

        jst.setValue ''
        cst.setValue ''
        result.setValue ''

        $('#compiled').addClass 'hidden'
        $('#output').addClass 'hidden'

  select.trigger 'change'

  $('.hamlcoffee-version').append(Compiler.VERSION)
  $('.coffeescript-version').append(CoffeeScript.VERSION + '.')

  $('a.toggle').click (event) ->
    $('#compiled').toggleClass 'hidden'
    event.preventDefalt()

  $('#render').click ->
    try
      compiler = new Compiler({
        escapeHtml: $('#escapeHtml').is(':checked')
        escapeAttributes: $('#escapeAttributes').is(':checked')
        cleanValue: $('#cleanValue').is(':checked')
        uglify: $('#uglify').is(':checked')
        extendScope: $('#extendScope').is(':checked')
        format: $('#format').val()
      })

      compiler.parse template.getValue()

    catch e
      jst.setValue ''
      cst.setValue ''

      result.setValue "Error parsing template: #{ e }"
      result.clearSelection()

      $('#output').removeClass 'hidden'
      $('#compiled').addClass 'hidden'

      return

    try
      cstSource = compiler.precompile()
      cst.setValue cstSource
      cst.clearSelection()
      cst.gotoLine 1
      cst.getSession().setScrollTop 0


      jstSource = CoffeeScript.compile(cstSource, bare: true)
      jst.setValue jstSource
      jst.clearSelection()
      jst.gotoLine 1
      jst.getSession().setScrollTop 0


      hamlcTemplate = new Function jstSource

    catch e
      jst.setValue ''
      cst.setValue ''

      result.setValue "Error compiling template: #{ e.message }"
      result.clearSelection()

      $('#output').removeClass 'hidden'
      $('#compiled').addClass 'hidden'

      return

    try
      dataSource = CoffeeScript.eval(data.getValue())

    catch e
      result.setValue "Error evaluating data: #{ e.message }"
      result.clearSelection()

      $('#output').removeClass 'hidden'
      $('#compiled').removeClass 'hidden'

      return

    try
      html = hamlcTemplate.call dataSource
      result.setValue html
      result.clearSelection()
      result.gotoLine 1
      result.getSession().setScrollTop 0

      $('#output').removeClass 'hidden'

    catch e
      result.setValue "Error render template: #{ e.message }"
      result.clearSelection()

      $('#output').removeClass 'hidden'
      $('#compiled').removeClass 'hidden'

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
