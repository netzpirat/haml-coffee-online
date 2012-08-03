(function() {

  $(document).ready(function() {
    var Compiler, example, select, _i, _len, _ref;
    Compiler = require('./haml-coffee');
    select = $('#examples');
    _ref = window.EXAMPLES;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      example = _ref[_i];
      select.append("<option>" + example.name + "</option>");
    }
    select.change(function() {
      var _j, _len1, _ref1, _results;
      _ref1 = window.EXAMPLES;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        example = _ref1[_j];
        if (example.name === $(this).val()) {
          $('#template').val(example.template);
          _results.push($('#data').val(example.data));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
    select.trigger('change');
    $('.hamlcoffee-version').append(Compiler.VERSION);
    $('.coffeescript-version').append(CoffeeScript.VERSION + '.');
    return $('#render').click(function() {
      var compiler, data, result, template;
      try {
        compiler = new Compiler({
          escapeHtml: $('#escapeHtml').is(':checked'),
          escapeAttributes: $('#escapeAttributes').is(':checked'),
          cleanValue: $('#cleanValue').is(':checked'),
          uglify: $('#uglify').is(':checked'),
          extendScope: $('#extendScope').is(':checked'),
          format: $('#format').val()
        });
        compiler.parse($('#template').val());
        try {
          template = new Function(CoffeeScript.compile(compiler.precompile(), {
            bare: true
          }));
          try {
            data = CoffeeScript["eval"]($('#data').val());
            try {
              result = template.call(data);
              return $('#result').val(result);
            } catch (e) {
              return $('#result').val("Error render template: " + e.message);
            }
          } catch (e) {
            return $('#result').val("Error evaluating data: " + e.message);
          }
        } catch (e) {
          return $('#result').val("Error compiling template: " + e.message + "\n\nCoffeeScript template source code:\n----------------------------------\n" + (compiler.precompile()) + "      ");
        }
      } catch (e) {
        return $('#result').val("Error parsing emplate: " + e);
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
