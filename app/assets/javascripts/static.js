//= require gfw/ui/carrousel

gfw.ui.model.Static = cdb.core.Model.extend({
  defaults: {
    expanded: null, // accordion
    selected: 'forest_change' // left_navigation
  }
});


gfw.ui.view.Static = cdb.core.View.extend({
  el: document.body,

  events: {
    'click .source_header': '_onClickSource',
    'click .nav-item': '_onClickNav'
  },

  initialize: function() {
    this.model = new gfw.ui.model.Static();

    this.model.bind('change:expanded', this._toggleSource, this);
    this.model.bind('change:selected', this._toggleNav, this);
  },

  _onClickSource: function(e) {
    var source = $(e.target).closest('.source-item').attr('id');

    if (source === this.model.get('expanded')) {
      this.model.set('expanded', null);
    } else {
      this.model.set('expanded', source);
    }
  },

  _onClickNav: function(e) {
    e.preventDefault();

    var $selected = $(e.target).closest('.nav-item'),
        selected = $selected.attr('data-slug'),
        href = $selected.attr('href');

    if (selected !== this.model.get('selected')) {
      window.router.navigate(href);

      $('.nav-item.selected').removeClass('selected');
      $selected.addClass('selected');

      ga('send', 'pageview');
      this.model.set('selected', selected);
    }
  },

  _goTo: function($el, opt, callback) {
    if ($el) {
      var speed  = (opt && opt.speed)  || 500;
      var delay  = (opt && opt.delay)  || 200;
      var margin = (opt && opt.margin) || 0;

      $('html, body').delay(delay).animate({scrollTop:$el.offset().top - margin}, speed);

      callback && callback();
    }
  },

  _onNavChange: function(tab, accordion) {
    var that = this;

    var $selected = $("[data-slug=" + tab + "]"),
        selected = tab;

    if (selected !== this.model.get('selected')) {
      $('.nav-item.selected').removeClass('selected');
      $selected.addClass('selected');

      this.model.set('selected', selected);

      setTimeout(function() {
        if (!accordion) that._goTo($('#'+selected), { margin: 40 });
      }, 800);
    }

    accordion && this.model.set('expanded', accordion);
  },

  _toggleSource: function() {
    var source = this.model.get('expanded');

    $('.expanded').removeClass('expanded');

    if (source) {
      var hash = '#'+source;

      $(hash).addClass('expanded');
      window.location.hash = hash;
    } else {
      window.location.hash = '';
    }
  },

  _toggleNav: function() {
    var selected = this.model.get('selected');

    $('article.selected').fadeOut(250);
    $('article').removeClass('selected');

    $('#'+selected).addClass('selected');
    $('article.selected').fadeIn(250);
  }
});
