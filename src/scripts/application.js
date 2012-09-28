(function() {

  $(document).ready(function() {
    var Compiler, cst, data, example, jst, result, select, template, _i, _len, _ref,
      _this = this;
    $('#examples').select2({
      width: '300px'
    });
    $('#format').select2({
      width: '100px'
    });
    template = ace.edit('template');
    template.setTheme('ace/theme/github');
    template.getSession().setMode('ace/mode/coffee');
    template.getSession().setUseWrapMode(true);
    template.getSession().setTabSize(2);
    template.getSession().setUseWorker(false);
    data = ace.edit('data');
    data.setTheme('ace/theme/github');
    data.getSession().setMode('ace/mode/coffee');
    data.getSession().setUseWrapMode(true);
    data.getSession().setTabSize(2);
    data.getSession().setUseWorker(false);
    cst = ace.edit('cst');
    cst.setTheme('ace/theme/github');
    cst.getSession().setMode('ace/mode/coffee');
    cst.setReadOnly(true);
    cst.getSession().setUseWrapMode(true);
    cst.getSession().setTabSize(2);
    cst.getSession().setUseWorker(false);
    jst = ace.edit('jst');
    jst.setTheme('ace/theme/github');
    jst.getSession().setMode('ace/mode/javascript');
    jst.setReadOnly(true);
    jst.getSession().setUseWrapMode(true);
    jst.getSession().setTabSize(2);
    jst.getSession().setUseWorker(false);
    result = ace.edit('result');
    result.setTheme('ace/theme/github');
    result.getSession().setMode('ace/mode/html');
    result.setReadOnly(true);
    result.setShowPrintMargin(false);
    result.getSession().setUseWrapMode(true);
    result.getSession().setTabSize(2);
    result.getSession().setUseWorker(false);
    Compiler = require('./haml-coffee');
    select = $('#examples');
    _ref = window.EXAMPLES;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      example = _ref[_i];
      select.append("<option>" + example.name + "</option>");
    }
    select.change(function(event) {
      var _j, _len1, _ref1, _results;
      _ref1 = window.EXAMPLES;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        example = _ref1[_j];
        if (example.name === $(event.currentTarget).val()) {
          template.setValue(example.template);
          template.gotoLine(1);
          template.clearSelection();
          template.getSession().setScrollTop(0);
          data.setValue(example.data);
          data.gotoLine(1);
          data.clearSelection();
          data.getSession().setScrollTop(0);
          jst.setValue('');
          cst.setValue('');
          result.setValue('');
          $('#compiled').addClass('hidden');
          _results.push($('#output').addClass('hidden'));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
    select.trigger('change');
    $('.hamlcoffee-version').append(Compiler.VERSION);
    $('.coffeescript-version').append(CoffeeScript.VERSION + '.');
    $('a.toggle').click(function() {
      return $('#compiled').toggleClass('hidden');
    });
    return $('#render').click(function() {
      var compiler, cstSource, dataSource, hamlcTemplate, html, jstSource;
      try {
        compiler = new Compiler({
          escapeHtml: $('#escapeHtml').is(':checked'),
          escapeAttributes: $('#escapeAttributes').is(':checked'),
          cleanValue: $('#cleanValue').is(':checked'),
          uglify: $('#uglify').is(':checked'),
          extendScope: $('#extendScope').is(':checked'),
          format: $('#format').val()
        });
        compiler.parse(template.getValue());
      } catch (e) {
        jst.setValue('');
        cst.setValue('');
        result.setValue("Error parsing template: " + e);
        result.clearSelection();
        $('#output').removeClass('hidden');
        $('#compiled').addClass('hidden');
        return;
      }
      try {
        cstSource = compiler.precompile();
        cst.setValue(cstSource);
        cst.clearSelection();
        cst.gotoLine(1);
        cst.getSession().setScrollTop(0);
        jstSource = CoffeeScript.compile(cstSource, {
          bare: true
        });
        jst.setValue(jstSource);
        jst.clearSelection();
        jst.gotoLine(1);
        jst.getSession().setScrollTop(0);
        hamlcTemplate = new Function(jstSource);
      } catch (e) {
        jst.setValue('');
        cst.setValue('');
        result.setValue("Error compiling template: " + e.message);
        result.clearSelection();
        $('#output').removeClass('hidden');
        $('#compiled').addClass('hidden');
        return;
      }
      try {
        dataSource = CoffeeScript["eval"](data.getValue());
      } catch (e) {
        result.setValue("Error evaluating data: " + e.message);
        result.clearSelection();
        $('#output').removeClass('hidden');
        $('#compiled').removeClass('hidden');
        return;
      }
      try {
        html = hamlcTemplate.call(dataSource);
        result.setValue(html);
        result.clearSelection();
        return $('#output').removeClass('hidden');
      } catch (e) {
        result.setValue("Error render template: " + e.message);
        result.clearSelection();
        $('#output').removeClass('hidden');
        return $('#compiled').removeClass('hidden');
      }
    });
  });

  window.EXAMPLES = [
    {
      name: "Haml Online",
      template: "!!!\n#main\n  .note\n    %h2 Quick Notes\n    %ul\n      %li\n        Haml Coffee is usually indented with two spaces,\n        although more than two is allowed.\n        You have to be consistent, though.\n      %li\n        The first character of any line is called\n        the \"control character\" - it says \"make a tag\"\n        or \"run CoffeeScript code\" or all sorts of things.\n      %li\n        Haml takes care of nicely indenting your HTML.\n      %li\n        Haml Coffee allows CoffeeScript code and blocks.\n\n  .note\n    You can get more information by reading the\n    %a{:href => \"https://github.com/netzpirat/haml-coffee\"}\n      Official Haml Coffee Documentation\n\n  .note\n    %p\n      CoffeeScript code is included by using = at the\n      beginning of a line.\n    %p\n      Read the tutorial for more information.",
      data: ""
    }, {
      name: "Elements, Classes and Ids",
      template: "!!!\n%article\n  %h1= \"hello \#{ @greet }\"\n  %section#note I've an id\n  .big.black{ class: @class } I've three classes",
      data: "{\n  greet: 'Visitor'\n  class: 'important'\n}"
    }, {
      name: "Attributes",
      template: "%a(name=\"HTML\") HTML style attributes\n%a{ :name => \"Ruby 1.8\" } Ruby 1.8 style attributes\n%a{ name: \"Ruby 1.9\" } Ruby 1.9 style attributes\n\n%div{ data: { rule: 'admin', bind: 'true' }}\n\n%a(name=@name) Code attribute\n%a{ name: if @name is 'Haml Coffee' then 'Yep' else 'Nope' }",
      data: "{\n  name: 'Haml Coffee'\n}"
    }, {
      name: "HAML Helpers",
      template: "!= surround '(', ')', ->\n  %a{:href => \"food\"} chicken\nclick\n!= succeed '.', ->\n  %a{:href=>\"thing\"} here\n!= precede '*', ->\n  %span.small Not really",
      data: ""
    }, {
      name: "Multiline",
      template: "%whoo\n  %hoo=                          |\n    \"I think this might get \" +  |\n    \"pretty long so I should \" + |\n    \"probably make it \" +        |\n    \"multiline so it doesn't \" + |\n    \"look awful.\"                |\n  %p This is short.\n\n.share-notebook{ title: 'bar', |\n  bar: 'foo' }                 |",
      data: ""
    }, {
      name: "Whitespace cleanup",
      template: "%div\n  %ul\n    %li One\n    %li Two\n    %li Three\n%div\n  %ul\n    %li> One\n    %li Two\n    %li Three\n%div\n  %ul\n    %li One\n    %li> Two\n    %li Three\n%div\n  %ul\n    %li One\n    %li Two\n    %li> Three\n%div\n  %ul\n    %li One\n    %li Two\n    %li\n      Three\n      Four\n      Five\n%div\n  %ul\n    %li One\n    %li Two\n    %li<\n      Three\n      Four\n      Five",
      data: ""
    }, {
      name: "Filters",
      template: "- if @visible\n  %body\n    :coffeescript\n      tags = [\"CoffeeScript\", \"Haml\"]\n      project = 'Haml Coffee'\n    %h2= project\n    %ul\n      - for tag in tags\n        %li= tag\n:css\n  #pants{\n   font-weight:\"bold\";\n  }",
      data: "{\n  visible: true\n}"
    }, {
      name: "CoffeeScript evaluation",
      template: "%ul\n  - for article in @articles\n    - if article.online\n      %li= article.name",
      data: "{\n  articles: [\n    {\n      name: 'Article 1'\n      online: true\n    }\n    {\n      name: 'Article 2'\n      online: false\n    }\n    {\n      name: 'Article 3'\n      online: true\n    }\n  ]\n}"
    }, {
      name: "CoffeeScript evaluation in function",
      template: "- foo = (text) -> \"Foo: \#{ text() }\"\n- bar = -> 'Bar'\n!= foo ->\n  %br\n  != bar()",
      data: ""
    }
  ];

}).call(this);
