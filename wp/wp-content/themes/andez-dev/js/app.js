(function() {
  var app, checkwidth_prev;

  $(document).ready(function() {
    return app.init();
  });

  app = {
    init: function() {
      app.secretMenu.init();
      app.shares.init();
      app.tooltips();
      app.alert.init();
      app.validation.form($("form.controls"));
      app.loading.init();
      app.scroll();
      app.plugins.init();
      app.actions.init();
      return app.fonts.init();
    }
  };

  app.actions = {
    init: function() {
      return $("[data-goto]").click(function() {
        var goto, to;
        goto = $(this).attr("data-goto");
        to = $(goto).offset().top - $("header").height();
        if (goto === "#test-font-container") {
          to = to + 12;
          setTimeout(function() {
            return $(".test-font-h1.live").focus();
          }, 500);
        }
        $("html,body,.secretmenu-container-front").animate({
          scrollTop: to
        });
        return false;
      });
    }
  };

  app.alert = {
    init: function() {
      app.alert.equidist();
      setTimeout(function() {
        return app.alert.equidist();
      }, 100);
      setTimeout(function() {
        return app.alert.equidist();
      }, 1000);
      $(window).resize(function() {
        return app.alert.equidist();
      });
      if ($("[data-alert]").length) {
        $("a[data-alert]").live("click", function() {
          var element;
          element = $(this);
          app.alert.open({
            title: element.attr("data-title"),
            content: element.attr("data-content"),
            accept: true,
            cancel: true,
            callback_true: function() {
              return location.href = element.attr("href");
            }
          });
          return false;
        });
        return $("[data-alert]").each(function() {
          var element;
          element = $(this);
          if (!element.is("a") && !element.is("button")) {
            return app.alert.open({
              title: element.attr("data-title"),
              content: element.attr("data-content"),
              accept: true,
              cancel: true
            });
          }
        });
      }
    },
    open: function(options) {
      var alertclass, alertlightclass, buttons, close, content, html, title;
      title = "";
      content = "";
      buttons = "";
      close = "";
      if (options["static"] === true) {
        alertlightclass = '';
        options.close = false;
      } else {
        alertlightclass = ' false';
      }
      if (options.alertclass) {
        alertclass = "alert-" + options.alertclass;
      } else {
        alertclass = "alert-default";
      }
      if (options.title) {
        title = "<h2 class='alert-title'>" + options.title + "</h2>";
      }
      if (options.content) {
        content = "<div class='alert-content'>" + options.content + "</div>";
      }
      if (options.close === void 0) {
        options.close = true;
      }
      if (options.close === true) {
        close = '<button class="alert-close false"><i class="fa fa-times"></i></button>';
      }
      if (options.buttons) {
        buttons += options.buttons + " ";
      }
      if (options.cancel === true) {
        buttons += '<button class="button false">Cancelar</button> ';
      }
      if (options.accept === true) {
        buttons += '<button class="button button-primary true">Aceptar</button> ';
      }
      if (buttons) {
        buttons = '<div class="alert-buttons">' + buttons + '</div>';
      }
      html = '<div class="alert ' + alertclass + ' in">' + '<div class="alert-light ' + alertlightclass + '"></div>' + '<div class="alert-box equidist">' + '<div class="alert-inner">' + close + title + content + buttons + '</div>' + '</div>' + '</div>';
      $("body").append(html);
      $("body").addClass("alert-in");
      app.alert.equidist();
      return $(".alert .true, .alert .false").unbind("click").bind("click", function() {
        var alertorigin;
        alertorigin = $(this).closest(".alert");
        alertorigin.addClass("out");
        setTimeout(function() {
          alertorigin.remove();
          return $("body").removeClass("alert-in");
        }, 200);
        if ($(this).hasClass("true") && options.callback_true) {
          options.callback_true();
        }
        if ($(this).hasClass("false") && options.callback_false) {
          options.callback_false();
        }
        return true;
      });
    },
    closeall: function() {
      $(".alert").addClass("out");
      return $("body").removeClass("alert-in");
    },
    removeall: function() {
      $(".alert").addClass("out");
      return setTimeout(function() {
        $(".alert").remove();
        return $("body").removeClass("alert-in");
      }, 200);
    },
    equidist: function() {
      return $(".equidist").each(function() {
        var _left, _this, _top;
        _this = $(this);
        _left = (_this.parent().width() - _this.width()) / 2;
        if (_left < 0) {
          _left = 0;
        }
        _top = (_this.parent().height() - _this.height()) / 2;
        if (_top < 0) {
          _top = 0;
        }
        return _this.css({
          left: _left + "px",
          top: _top + "px"
        });
      });
    },
    load: function(href, cssclass, callback) {
      if (cssclass == null) {
        cssclass = "default";
      }
      if (callback == null) {
        callback = false;
      }
      return $.ajax({
        url: href,
        type: 'GET'
      }).done(function(result) {
        app.alert.open({
          content: result,
          alertclass: cssclass
        });
        if (callback) {
          return callback();
        }
      });
    }
  };

  app.isMobile = function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    } else {
      return false;
    }
  };

  app.browsers = function() {
    if (app.isMobile()) {
      $("body").addClass("is-mobile");
    }
    if ($.browser.msie || navigator.appVersion.indexOf('Trident/') !== -1) {
      $("body").addClass("is-ie");
      $("body").addClass("is-ie" + $.browser.version);
      if (parseInt($.browser.version) <= 7) {
        return app.alert.open({
          title: "Estás usando un navegador muy antiguo",
          content: "Actualiza tu navegador ahora y disfruta de una mejor experiencia en Falabella Novios.",
          buttons: "<a href='http://browsehappy.com/?locale=es' target='_blank' class='button button-primary button-big'>Actualizar ahora</a>",
          "static": true
        });
      }
    }
  };

  app.cookie = {
    create: function(name, value, days) {
      var date, expires;
      if (days) {
        date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
      } else {
        expires = "";
      }
      return document.cookie = name + "=" + value + expires + "; path=/";
    },
    read: function(name) {
      var c, ca, i, nameEQ;
      nameEQ = name + "=";
      ca = document.cookie.split(";");
      i = 0;
      while (i < ca.length) {
        c = ca[i];
        while (c.charAt(0) === " ") {
          c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length, c.length);
        }
        i++;
      }
      return null;
    },
    "delete": function(name) {
      return app.cookie.create(name, "", -1);
    }
  };

  checkwidth_prev = false;

  app.fonts = {
    init: function() {
      app.fonts.tools.init();
      app.fonts.presentation();
      app.fonts.nav.init();
      return app.fonts.instructions.init();
    },
    add: function(font, font_id) {
      if (font && font_id) {
        if (!$("head").find('link[data-font-id="' + font_id + '"]').length) {
          return $("head").append('<link href="' + $("body").attr("data-url") + '/wp-content/fonts/' + font_id + '/font.css" rel="stylesheet" type="text/css" data-font="' + font_id + '" />');
        }
      }
    },
    loadFont: function(fontdiv, callback) {
      var font, font_id;
      if (callback == null) {
        callback = false;
      }
      font = fontdiv.attr("data-font");
      font_id = fontdiv.attr("data-font-id");
      if (font && font_id && font !== void 0) {
        app.fonts.add(font, font_id);
        fontdiv.css({
          "font-family": font
        });
        fontdiv.find("div,input").css({
          "font-family": font
        });
        return app.fonts.checkFont(fontdiv, font);
      }
    },
    searchLoadFont: function() {
      var foundfont;
      foundfont = $(".font:not(.font-loaded)").eq(0);
      if (foundfont.length) {
        return app.fonts.loadFont(foundfont, app.fonts.searchLoadFont);
      }
    },
    checkFont: function(fontdiv, font) {
      $(".checkloadfont").remove();
      $("body").append("<span class='checkloadfont' style='position:absolute;top:-100px;left:0;background:#999;font-family:serif;'>abcijl!$%&/o0</span>");
      checkwidth_prev = false;
      return app.fonts.checkFontT(fontdiv, font);
    },
    checkFontT: function(fontdiv, font) {
      var checkdiv, checkwidth;
      checkdiv = $(".checkloadfont");
      checkwidth = checkdiv.width();
      $(".checkloadfont").css({
        "font-family": font
      });
      if (checkwidth !== checkwidth_prev && checkwidth_prev !== false) {
        fontdiv.addClass('font-loaded');
        app.fonts.searchLoadFont();
      } else {
        setTimeout(function() {
          return app.fonts.checkFontT(fontdiv, font);
        }, 50);
      }
      return checkwidth_prev = checkwidth;
    },
    nav: {
      init: function() {
        return $(".single-font-navigation .nav").unbind("click").bind("click", function() {
          app.fonts.nav.load($(this));
          return false;
        });
      },
      load: function(element) {
        var dir, url;
        url = element.attr("href").split(' ').join('%20');
        dir = false;
        if (element.hasClass("nav-right")) {
          dir = "right";
        }
        if (element.hasClass("nav-left")) {
          dir = "left";
        }
        $(".single-font-header").removeClass("animation-right");
        $(".single-font-header").removeClass("animation-left");
        if (dir === "left") {
          $(".single-font-header").addClass("animation-right-out");
        }
        if (dir === "right") {
          $(".single-font-header").addClass("animation-left-out");
        }
        $(".test-font").addClass("out");
        $(".gallery").addClass("out");
        return setTimeout(function() {
          return $.ajax({
            url: url
          }).done(function(result) {
            var html, new_gallery, new_header, newfont, newfont_id;
            html = $(result);
            new_header = html.find(".single-font-header >");
            new_gallery = html.find(".gallery >");
            $(".single-font-header").html(new_header);
            $(".gallery").html(new_gallery).removeClass("out");
            $(".single-font-header").removeClass("animation-right-out");
            $(".single-font-header").removeClass("animation-left-out");
            $(".single-font-header").addClass("animation-" + dir);
            newfont = $("h1").attr("data-font");
            newfont_id = $("h1").attr("data-font-id");
            if (newfont_id) {
              $(".test-font").attr("data-font", newfont);
              $(".test-font").attr("data-font-id", newfont_id);
              $(".test-font-h1, .test-font-p").css({
                "font-family": newfont
              });
              $(".test-font").removeClass("out").addClass("in");
              app.fonts.add(newfont, newfont_id);
              app.fonts.tools.textareaheight();
              setTimeout(function() {
                return app.fonts.tools.textareaheight();
              }, 1000);
              app.fonts.nav.init();
              return app.actions.init();
            }
          });
        }, 500);
      }
    },
    presentation: function() {
      var texts_default;
      texts_default = ["Lorem ipsum dolor sit amet", "Repellendus, inventore, nemo.", "423-89(08)*2+83591", "Doloremque placeat cupiditate", "Amet quod sint adipisci.", "$%&*=?{+", "Itaque nihil officiis.", "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"];
      $(".hola-bg").each(function() {
        var div, font, font_id, i, rand, rand_size, rand_top, text, texts, _i, _len;
        div = $(this);
        texts = div.attr("data-texts");
        if (texts) {
          texts = texts.split("||");
        } else {
          texts = texts_default;
        }
        rand = Math.floor((Math.random() * 10) + 1);
        i = 1;
        for (_i = 0, _len = texts.length; _i < _len; _i++) {
          text = texts[_i];
          rand_size = Math.floor((Math.random() * 150) + 1);
          rand_top = i * 10;
          div.append("<div class='chao chao-" + i + "' style='font-size:" + rand_size + "px;top:" + rand_top + "%;'>" + text + "</div>");
          i++;
        }
        font = div.parent().attr("data-font");
        font_id = div.parent().attr("data-font-id");
        app.fonts.add(font, font_id);
        return div.css({
          "font-family": font
        });
      });
      app.fonts.searchLoadFont();
      return $(".font-big").keyup(function() {
        var text;
        text = $(this).val();
        return $(".font-big").each(function() {
          if (!$(this).is(":focus")) {
            return $(this).val(text);
          }
        });
      });
    },
    instructions: {
      init: function() {
        return $(".instruction").each(function() {
          var inst, n;
          inst = $(this);
          n = inst.attr("data-instruction");
          if (!app.cookie.read("instruction-" + n)) {
            inst.addClass("in");
            return inst.parent().find("input,textarea").keyup(function() {
              return setTimeout(function() {
                inst.addClass("out");
                app.cookie.create("instruction-" + n, "ok");
                return setTimeout(function() {
                  return inst.remove();
                }, 500);
              }, 500);
            });
          }
        });
      }
    },
    tools: {
      init: function() {
        var click_active, font, font_id;
        $("#test-font-container").css({
          "min-height": $(window).height() - $("header").height()
        });
        $(window).resize(function() {
          return $("#test-font-container").css({
            "min-height": $(window).height() - $("header").height()
          });
        });
        font = $(".test-font").attr("data-font");
        font_id = $(".test-font").attr("data-font-id");
        app.fonts.add(font, font_id);
        $(".test-font-h1, .test-font-p").css({
          "font-family": font
        });
        app.fonts.tools.textareacopytext();
        $(".test-font-h1.live, .test-font-p.live").keyup(function() {
          return app.fonts.tools.textareacopytext();
        });
        $("body").click(function() {
          $(".test-font-group").removeClass("in");
          $(".tools").addClass("out");
          return setTimeout(function() {
            $(".tools").removeClass("in out");
            return $(".tools-group").removeClass("in");
          }, 500);
        });
        $(".tools").click(function(e) {
          return e.stopPropagation();
        });
        $(".test-font-h1.live, .test-font-p.live").click(function(e) {
          return e.stopPropagation();
        });
        $(".test-font-h1.live, .test-font-p.live").focus(function() {
          var test_group;
          $(".tools").addClass("in");
          $(".test-font-group").removeClass("in");
          $(".tools-group").removeClass("in");
          test_group = $(this).closest(".test-font-group");
          test_group.addClass("in");
          return $(".tools-group." + test_group.attr("data-tools")).addClass("in");
        });
        setTimeout(function() {
          return app.fonts.tools.textareaheight();
        }, 1000);
        $(window).resize(function() {
          return app.fonts.tools.textareaheight();
        });
        $(".tool").each(function() {
          var tool, tool_css, tool_init, tool_select, tool_select_split, tool_to;
          tool = $(this);
          tool_to = tool.attr("data-to");
          tool_css = tool.attr("data-css");
          tool_init = tool.attr("data-init");
          tool_select = tool.attr("data-select");
          if (app.cookie.read("color")) {
            $(".tool[data-css='color']").attr("data-init", app.cookie.read("color"));
          }
          if (app.cookie.read("background-color")) {
            $(".tool[data-css='background-color']").attr("data-init", app.cookie.read("background-color"));
          }
          app.fonts.tools.insertcss(tool_to, tool_css, tool_init);
          app.fonts.tools.setindicator($(this), tool_init);
          if (tool_select) {
            tool_select_split = tool_select.split("|");
            tool.find(".tool-icon-color-inner").css({
              'background-color': '#' + tool_init
            });
            return $.each(tool_select_split, function(k, tool_option) {
              return tool.find(".tool-select").append("<div class='tool-option' data-value='" + tool_option + "' style='background-color:#" + tool_option + ";'><div class='tool-option-selected'></div></div>");
            });
          }
        });
        click_active = false;
        $(".tool .tool-bar").mousedown(function(e) {
          app.fonts.tools.movebar($(this), e);
          return click_active = true;
        });
        $(".tool .tool-bar").mouseup(function() {
          return click_active = false;
        });
        $(".tool .tool-bar").mousemove(function(e) {
          if (click_active) {
            return app.fonts.tools.movebar($(this), e);
          }
        });
        $(".tool[data-switch]").click(function() {
          var tool, tool_css, tool_to, value1, value2, values;
          tool = $(this);
          tool_to = tool.attr("data-to");
          tool_css = tool.attr("data-css");
          values = tool.attr("data-switch").split("|");
          value1 = values[0];
          value2 = values[1];
          tool.toggleClass("on");
          if (tool.hasClass("on")) {
            return app.fonts.tools.insertcss(tool_to, tool_css, value1);
          } else {
            return app.fonts.tools.insertcss(tool_to, tool_css, value2);
          }
        });
        return app.fonts.tools.colors.init();
      },
      setindicator: function(tool, value) {
        var move, tool_max, tool_min;
        tool_min = parseInt(tool.attr("data-min"));
        tool_max = parseInt(tool.attr("data-max"));
        if (tool_max) {
          move = parseInt((value * 100 / (tool_max - tool_min)) - (tool_min * 100 / (tool_max - tool_min)));
          move = 100 - move;
          return tool.find(".tool-indicator").css({
            top: move + "%"
          });
        }
      },
      movebar: function(element, e) {
        var click, click_bar, height, move, pos, scroll, tool, tool_calculate, tool_css, tool_max, tool_min, tool_to, top;
        pos = element.offset().top;
        click = e.pageY;
        scroll = $(window).scrollTop();
        height = element.height();
        top = pos - scroll;
        click_bar = click - pos;
        move = click_bar * 100 / height;
        element.find(".tool-indicator").css({
          top: move + "%"
        });
        tool = element.closest(".tool");
        tool_to = tool.attr("data-to");
        tool_css = tool.attr("data-css");
        tool_min = parseInt(tool.attr("data-min"));
        tool_max = parseInt(tool.attr("data-max"));
        tool_calculate = parseInt((tool_max - tool_min) * move / 100) + tool_min;
        tool_calculate = tool_max - tool_calculate + tool_min;
        return app.fonts.tools.insertcss(tool_to, tool_css, tool_calculate);
      },
      insertcss: function(to, css, value) {
        if (css === "font-size") {
          $(to).css({
            "font-size": value + "px"
          });
        }
        if (css === "line-height") {
          $(to).css({
            "line-height": value + "px"
          });
        }
        if (css === "letter-spacing") {
          $(to).css({
            "letter-spacing": value + "px"
          });
        }
        if (css === "word-spacing") {
          $(to).css({
            "word-spacing": value + "px"
          });
        }
        if (css === "text-transform") {
          $(to).css({
            "text-transform": value
          });
        }
        if (css === "font-weight") {
          $(to).css({
            "font-weight": value
          });
        }
        if (css === "color") {
          $(to).css({
            "color": "#" + value
          });
          app.cookie.create("color", value);
        }
        if (css === "background-color") {
          $(to).css({
            "background-color": "#" + value
          });
          app.cookie.create("background-color", value);
        }
        return app.fonts.tools.textareaheight();
      },
      textareaheight: function() {
        var height_h1, height_p;
        height_h1 = $(".test-font-h1.ghost").height();
        $(".test-font-h1.live").css({
          height: height_h1 + "px"
        });
        $(".test-font-h1.live").parent().find(".test-font-group-focus").css({
          height: height_h1 + "px"
        });
        height_p = $(".test-font-p.ghost").height();
        $(".test-font-p.live").css({
          height: height_p + "px"
        });
        return $(".test-font-p.live").parent().find(".test-font-group-focus").css({
          height: height_p + "px"
        });
      },
      textareacopytext: function() {
        $(".test-font-h1.ghost").html($(".test-font-h1.live").val());
        $(".test-font-p.ghost").html($(".test-font-p.live").val());
        return app.fonts.tools.textareaheight();
      },
      colors: {
        init: function() {
          return $(".tools .tool-select .tool-option").click(function() {
            var option, tool, tool_css, tool_to, tool_value;
            option = $(this);
            tool = option.closest(".tool");
            tool_to = tool.attr("data-to");
            tool_css = tool.attr("data-css");
            tool_value = option.attr("data-value");
            app.fonts.tools.insertcss(tool_to, tool_css, tool_value);
            tool.find(".tool-select .tool-option").removeClass("in");
            tool.find(".tool-icon-color-inner").css({
              'background-color': '#' + tool_value
            });
            return option.addClass("in");
          });
        }
      }
    }
  };

  app.loading = {
    init: function() {
      if ($("[data-loading]").length) {
        return app.loading["in"]();
      }

      /*
      		app.loading.in()
      		$("body").imagesLoaded ->
      			app.loading.out()
       */
    },
    "in": function(element) {
      if (!element) {
        element = $("body");
      }
      return element.append('' + '<div class="loading">' + '<div class="loading-icon">' + '<div class="loading-icon-circle"><div></div></div>' + '</div>' + '</div>');
    },
    out: function() {
      $(".loading").addClass("out");
      setTimeout(function() {
        return $(".loading").remove();
      }, 500);
      return $("body").addClass("loaded");
    }
  };

  app.plugins = {
    init: function() {
      var isotope;
      if ($(".isotope").length) {
        return isotope = $(".isotope").isotope();
      }
    },
    relayout: function() {
      return $("body").imagesLoaded(function() {
        app.alert.equidist();
        app.alert.equidist();
        if ($(".isotope").length) {
          return $(".isotope").isotope({
            relayout: true
          });
        }
      });
    }
  };

  app.scroll = function() {
    var scroll_prev;
    if (!app.isMobile()) {
      scroll_prev = 0;
      return $(window).scroll(function() {
        var height_body, height_window, scroll;
        scroll = $(window).scrollTop();
        height_window = $(window).height();
        height_body = $("body").height();
        if (scroll > 50) {
          $("header").addClass("header-hide");
        } else {
          $("header").removeClass("header-hide");
        }
        if (scroll > 70) {
          $(".single-font-header").addClass("fixed");
        } else {
          $(".single-font-header").removeClass("fixed");
        }
        scroll_prev = scroll;
        if ($(".displayscroll").length) {
          return $(".displayscroll").each(function() {
            var element, element_height, element_top;
            element = $(this);
            element_top = element.offset().top;
            element_height = element.height();
            if (scroll + height_window > element_height + element_top) {
              return element.addClass("in");
            }
          });
        }
      });
    }
  };

  app.secretMenu = {
    init: function() {
      var li, name_page, name_page_clear, name_page_split, url, url_split;
      url = document.URL;
      url_split = url.split("/");
      name_page = url_split[url_split.length - 1];
      name_page_split = name_page.split("?");
      name_page_clear = name_page_split[0];
      li = $(".secretmenu-content a[href='" + name_page_clear + "']").parent("li");
      li.addClass("current-item");
      li.parent().parent("li").addClass("current-item");
      $(".secretmenu-content ul li a").each(function() {
        if ($(this).parent().find("ul").length) {
          if (!$(this).hasClass("secretmenu-parent")) {
            $(this).addClass("secretmenu-parent").prepend('<i class="fa fa-chevron-right"></i>');
            return $(this).parent().find("ul").prepend('<li><a href="#" class="secretmenu-back"><i class="fa fa-chevron-left"></i> Atrás</a></li>');
          }
        }
      });
      if ($(".secretmenu-content ul li.current-item a.secretmenu-parent").length) {
        app.secretMenu.openLvlDesktop($(".secretmenu-content ul li.current-item a.secretmenu-parent"));
      }
      $(".secretmenu-button").click(function() {
        if (!$("body").hasClass("secretmenu-in")) {
          return app.secretMenu.open($(".secretmenu-content").html());
        } else {
          return app.secretMenu.close();
        }
      });
      $(".secretmenu-container-front").click(function() {
        if ($("body").hasClass("secretmenu-in")) {
          return app.secretMenu.close();
        }
      });
      return true;
    },
    openLvlDesktop: function(element) {
      var ul;
      ul = element.parent().find("ul");
      ul.addClass("in");
      return ul.find("a.secretmenu-back").unbind("click").bind("click", function() {
        ul.addClass("out");
        setTimeout(function() {
          return ul.removeClass("in out");
        }, 700);
        return false;
      });
    },
    open: function(html, children, direction) {
      var container, length;
      if (children == null) {
        children = false;
      }
      if (direction == null) {
        direction = "left";
      }
      length = $(".secretmenu").length + 1;
      container = '<div class="secretmenu secretmenu-lvl-' + ($(".secretmenu").length + 1) + '"></div>';
      direction = "right";
      if (!children) {
        $(".secretmenu-container-back").html(container);
      } else {
        $(".secretmenu-container-back").append(container);
      }
      $(".secretmenu").eq(-1).html('<div class="secretmenu-inner">' + html + '</div>');
      $("body").addClass("secretmenu-in secretmenu-" + direction);
      $("body").attr("data-secretmenu-lvl", length);
      $(".secretmenu ul li a").each(function() {
        if ($(this).parent().find("ul").length) {
          if (!$(this).hasClass("secretmenu-parent")) {
            return $(this).addClass("secretmenu-parent").prepend('<i class="fa fa-chevron-right"></i>');
          }
        }
      });
      $(".secretmenu ul li a.secretmenu-parent").unbind("click").bind("click", function() {
        app.secretMenu.open("<ul>" + $(this).parent().find("ul").html() + "</ul>", true);
        return false;
      });
      return $(".secretmenu a.secretmenu-back").unbind("click").bind("click", function() {
        var lastmenu;
        lastmenu = parseInt($("body").attr("data-secretmenu-lvl"));
        $("body").attr("data-secretmenu-lvl", lastmenu - 1);
        $(".secretmenu.secretmenu-lvl-" + lastmenu).addClass("out");
        setTimeout(function() {
          return $(".secretmenu.secretmenu-lvl-" + lastmenu).remove();
        }, 700);
        return false;
      });
    },
    close: function() {
      $("body").addClass("secretmenu-out");
      return setTimeout(function() {
        $("body").removeClass("secretmenu-in secretmenu-out secretmenu-left secretmenu-right secretmenu-lvl-" + $("body").attr("data-secretmenu-lvl"));
        $("body").removeAttr("data-secretmenu-lvl");
        return $(".secretmenu").remove();
      }, 700);
    }
  };

  app.shares = {
    init: function() {
      return $(".share").click(function() {
        return app.shares.share($(this));
      });
    },
    share: function(element) {
      var share_img, share_text, share_url;
      share_url = encodeURIComponent(element.attr("data-url"));
      share_text = encodeURIComponent(element.attr("data-text"));
      share_img = encodeURIComponent(element.attr("data-img"));
      if (element.hasClass("share-facebook")) {
        app.shares.popupWindow("https://www.facebook.com/sharer/sharer.php?u=" + share_url, 500, 310);
      }
      if (element.hasClass("share-twitter")) {
        app.shares.popupWindow("https://twitter.com/intent/tweet?source=webclient&amp;text=" + share_text + "&amp;url=" + share_url, 500, 310);
      }
      if (element.hasClass("share-pinterest")) {
        app.shares.popupWindow("http://pinterest.com/pin/create/button/?url=" + share_url + "&media=" + share_img + "&description=" + share_text, 620, 310);
      }
      if (element.hasClass("share-googleplus")) {
        app.shares.popupWindow("https://plus.google.com/share?url=" + share_url, 500, 310);
      }
      if (element.hasClass("share-linkedin")) {
        app.shares.popupWindow("http://www.linkedin.com/shareArticle?mini=true&url=" + share_url + "&title=" + share_text + "&summary=" + share_text + "&source=" + share_url, 500, 420);
      }
      return false;
    },
    popupWindow: function(url, w, h) {
      var left, top;
      left = ($(window).width() / 2) - (w / 2);
      top = ($(window).height() / 2) - (h / 2);
      return window.open(url, "Compartir", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    }
  };

  app.tooltips = function() {
    return $("[data-tooltip]").each(function() {
      var pos;
      pos = $(this).attr("data-tooltip-position");
      if (!pos) {
        pos = "bottom";
      }
      $(this).addClass("tooltip-parent");
      return $(this).append("<span class='tooltip tooltip-" + pos + "'><span class='tooltip-container'><span class='tooltip-triangle'></span><span class='tooltip-content'>" + $(this).attr("data-tooltip") + "</span></span></span>");
    });
  };

  app.validation = {
    form: function(forms, callback) {
      if (callback == null) {
        callback = false;
      }
      return forms.each(function() {
        var form;
        form = $(this);
        form.find(".control .control-value").append("<div class='control-message'></div>");
        form.find("input,textarea,select").each(function() {
          var input;
          input = $(this);
          if ($(this).is("input")) {
            input.addClass("input-" + $(this).attr("type"));
          }
          if (input.is(":disabled")) {
            input.addClass("disabled");
          }
          return input.live("blur, change", function() {
            return app.validation.formInput(input);
          });
        });
        form.find(".input-checkbox, .input-radio").each(function() {
          if ($(this).is(":checked")) {
            return $(this).closest("label").addClass("checked");
          } else {
            return $(this).closest("label").removeClass("checked");
          }
        });
        form.find(".input-checkbox, .input-radio").change(function() {
          return form.find(".input-checkbox, .input-radio").each(function() {
            if ($(this).is(":checked")) {
              return $(this).closest("label").addClass("checked");
            } else {
              return $(this).closest("label").removeClass("checked");
            }
          });
        });
        form.find("input.number").each(function() {
          return $(this).removeClass("number").wrap("<div class='number'>").after("<div class='number-button number-more'>+</div><div class='number-button number-less'>-</div>");
        });
        form.find(".number .number-button").live("click", function() {
          var _input, _max, _min, _steps, _val;
          _input = $(this).parent().find("input");
          _max = parseInt(_input.attr("data-max"));
          _min = parseInt(_input.attr("data-min"));
          if (!_min) {
            _min = 1;
          }
          _steps = parseInt(_input.attr("data-steps"));
          if (!_steps) {
            _steps = 1;
          }
          _val = parseInt(_input.val());
          if ($(this).hasClass("number-more")) {
            _val = _val + _steps;
          }
          if ($(this).hasClass("number-less")) {
            _val = _val - _steps;
          }
          if (_val >= _max) {
            _val = _max;
          }
          if (_val <= _min) {
            _val = _min;
          }
          _input.val(_val);
          return false;
        });
        form.find(".number input").live("blur", function() {
          var _input, _max, _min, _val;
          _input = $(this);
          _max = parseInt(_input.attr("data-max"));
          _min = parseInt(_input.attr("data-min"));
          if (!_min) {
            _min = 1;
          }
          _val = parseInt(_input.val());
          if (_val >= _max) {
            _val = _max;
          }
          if (_val <= _min) {
            _val = _min;
          }
          _input.val(_val);
          return true;
        });
        return form.submit(function() {
          var diverror, send, top;
          send = true;
          form = $(this);
          form.find("input,textarea,select").each(function() {
            return app.validation.formInput($(this), true);
          });
          diverror = form.find(".control-error").eq(0);
          if (diverror.length) {
            send = false;
            top = diverror.offset().top - $(".header-top").height() - 25;
            $("html,body").animate({
              scrollTop: top
            });
            setTimeout(function() {
              return diverror.find("input").eq(0).focus();
            }, 500);
          }
          if (send === true) {
            if (callback) {
              callback();
              send = false;
            }
          }
          return send;
        });
      });
    },
    formInput: function(input, validateEmpty) {
      var control, controls, error, fvErrors, parent;
      if (validateEmpty == null) {
        validateEmpty = false;
      }
      parent = input.closest(".control-value");
      controls = input.closest(".controls");
      control = input.closest(".control");
      fvErrors = {
        "empty": "Este campo es requerido",
        "emptySelect": "Selecciona una opción",
        "emptyRadio": "Selecciona una opción",
        "emptyCheckbox": "Selecciona al menos una opción",
        "invalidEmail": "Email inválido",
        "invalidEmailRepeat": "El email ingresado no es igual al anterior",
        "invalidPass": "La contraseña debe ser mayor a 6 carácteres",
        "invalidPassRepeat": "La contraseña no es igual a la anterior",
        "invalidRut": "RUT inválido",
        "terms": "Debes aceptar los términos legales"
      };
      if (!input.hasClass("optional") && input.attr("type") !== "submit" && input.attr("type") !== "hidden" && input.attr("name")) {
        error = false;
        if (!input.val()) {
          if (validateEmpty === true) {
            if (input.is("select")) {
              return app.validation.formInputMessage(input, fvErrors.emptySelect);
            } else {
              return app.validation.formInputMessage(input, fvErrors.empty);
            }
          }
        } else {
          if (input.is("[type='email']")) {
            if (!app.validation.email(input, input.val())) {
              app.validation.formInputMessage(input, fvErrors.invalidEmail);
              error = true;
            }
          }
          if (input.is("[type='password']")) {
            if (input.val().length < 6) {
              app.validation.formInputMessage(input, fvErrors.invalidPass);
              error = true;
            }
          }
          if (input.is("[data-repeat]")) {
            if (input.val() !== controls.find("[name='" + input.attr("data-repeat") + "']").val()) {
              if (input.is("[type='password']")) {
                app.validation.formInputMessage(input, fvErrors.invalidPassRepeat);
                error = true;
              }
              if (input.is("[type='email']")) {
                app.validation.formInputMessage(input, fvErrors.invalidEmailRepeat);
                error = true;
              }
            }
          }
          if (input.is("[type='checkbox']") || input.is("[type='radio']")) {
            if (!controls.find("input[name='" + input.attr("name") + "']:checked").length) {
              if (input.is("[type='checkbox']")) {
                app.validation.formInputMessage(input, fvErrors.emptyCheckbox);
              }
              if (input.is("[type='radio']")) {
                app.validation.formInputMessage(input, fvErrors.emptyRadio);
              }
              if (input.is(".input-terms")) {
                app.validation.formInputMessage(input, fvErrors.terms);
              }
              error = true;
              parent.find(".control-error").removeClass("error");
            }
          }
          if (input.is(".rut")) {
            input.val($.Rut.formatear($.Rut.quitarFormato(input.val()), $.Rut.getDigito($.Rut.quitarFormato(input.val()))));
            if (!$.Rut.validar(input.val())) {
              app.validation.formInputMessage(input, fvErrors.invalidRut);
              error = true;
            }
          }
          if (error === false) {
            return app.validation.formInputMessage(input, false);
          }
        }
      }
    },
    formInputMessage: function(input, message) {
      var parent;
      if (message) {
        input.addClass("control-error");
        parent = input.closest(".control-value");
        parent.addClass("control-error");
        return parent.find(".control-message").text(message).addClass("in");
      } else {
        input.removeClass("control-error");
        parent = input.closest(".control-value");
        parent.removeClass("control-error");
        parent.find(".control-message").addClass("out");
        return setTimeout(function() {
          return parent.find(".control-message").removeClass("in out").text("");
        }, 500);
      }
    },
    email: function(elemento, valor) {
      if (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(valor)) {
        return true;
      } else {
        return false;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,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T0FEaUI7SUFBQSxDQXhMbEI7QUFBQSxJQXlNQSxLQUFBLEVBQU8sU0FBQyxRQUFELEVBQVUsS0FBVixHQUFBO0FBQ04sTUFBQSxJQUFHLDJKQUEySixDQUFDLElBQTVKLENBQWlLLEtBQWpLLENBQUg7QUFDQyxlQUFPLElBQVAsQ0FERDtPQUFBLE1BQUE7QUFHQyxlQUFPLEtBQVAsQ0FIRDtPQURNO0lBQUEsQ0F6TVA7R0FyOUJELENBQUE7QUFBQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJcbiQoZG9jdW1lbnQpLnJlYWR5IC0+XG5cdGFwcC5pbml0KClcblxuYXBwID1cblxuXHRpbml0OiAtPlxuXG5cdFx0IyBCcm93c2Vyc1xuXHRcdCNhcHAuYnJvd3NlcnMoKVxuXG5cdFx0IyBNZW7DulxuXHRcdGFwcC5zZWNyZXRNZW51LmluaXQoKVxuXG5cdFx0IyBTaGFyZXNcblx0XHRhcHAuc2hhcmVzLmluaXQoKVxuXG5cdFx0IyBUb29sdGlwc1xuXHRcdGFwcC50b29sdGlwcygpXG5cblx0XHQjIEFsZXJ0YXNcblx0XHRhcHAuYWxlcnQuaW5pdCgpXG5cblx0XHQjIFZhbGlkYWNpw7NuIGRlIGZvcm11bGFyaW9zXG5cdFx0YXBwLnZhbGlkYXRpb24uZm9ybSAkKFwiZm9ybS5jb250cm9sc1wiKVxuXG5cdFx0IyBMb2FkaW5nXG5cdFx0YXBwLmxvYWRpbmcuaW5pdCgpXG5cblx0XHQjIEV2ZW50b3MgZW4gc2Nyb2xsXG5cdFx0YXBwLnNjcm9sbCgpXG5cblx0XHQjIFBsdWdpbnNcblx0XHRhcHAucGx1Z2lucy5pbml0KClcblxuXHRcdCMgQWN0aW9uc1xuXHRcdGFwcC5hY3Rpb25zLmluaXQoKVxuXG5cdFx0IyBGb250c1xuXHRcdGFwcC5mb250cy5pbml0KClcblxuIz1pbmNsdWRlX3RyZWUgYXBwXG5cblxuYXBwLmFjdGlvbnMgPVxuXG5cdGluaXQ6IC0+XG5cblx0XHQkKFwiW2RhdGEtZ290b11cIikuY2xpY2sgLT5cblx0XHRcdGdvdG8gPSAkKHRoaXMpLmF0dHIoXCJkYXRhLWdvdG9cIilcblx0XHRcdHRvICAgPSAkKGdvdG8pLm9mZnNldCgpLnRvcCAtICQoXCJoZWFkZXJcIikuaGVpZ2h0KClcblx0XHRcdFxuXHRcdFx0aWYgZ290byA9PSBcIiN0ZXN0LWZvbnQtY29udGFpbmVyXCJcblx0XHRcdFx0dG8gPSB0byArIDEyXG5cdFx0XHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdFx0XHQkKFwiLnRlc3QtZm9udC1oMS5saXZlXCIpLmZvY3VzKClcblx0XHRcdFx0LDUwMFxuXG5cdFx0XHQkKFwiaHRtbCxib2R5LC5zZWNyZXRtZW51LWNvbnRhaW5lci1mcm9udFwiKS5hbmltYXRlXG5cdFx0XHRcdHNjcm9sbFRvcDogdG9cblxuXHRcdFx0ZmFsc2VcblxuXG5cblxuYXBwLmFsZXJ0ID1cblxuXHRpbml0OiAtPlxuXHRcdGFwcC5hbGVydC5lcXVpZGlzdCgpXG5cdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0YXBwLmFsZXJ0LmVxdWlkaXN0KClcblx0XHQsMTAwXG5cdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0YXBwLmFsZXJ0LmVxdWlkaXN0KClcblx0XHQsMTAwMFxuXHRcdCQod2luZG93KS5yZXNpemUgLT5cblx0XHRcdGFwcC5hbGVydC5lcXVpZGlzdCgpXG5cblxuXHRcdGlmICQoXCJbZGF0YS1hbGVydF1cIikubGVuZ3RoXG5cblx0XHRcdCQoXCJhW2RhdGEtYWxlcnRdXCIpLmxpdmUgXCJjbGlja1wiLCAtPlxuXHRcdFx0XHRlbGVtZW50ID0gJCh0aGlzKVxuXHRcdFx0XHRhcHAuYWxlcnQub3BlblxuXHRcdFx0XHRcdHRpdGxlOiBlbGVtZW50LmF0dHIoXCJkYXRhLXRpdGxlXCIpXG5cdFx0XHRcdFx0Y29udGVudDogZWxlbWVudC5hdHRyKFwiZGF0YS1jb250ZW50XCIpXG5cdFx0XHRcdFx0YWNjZXB0OiB0cnVlXG5cdFx0XHRcdFx0Y2FuY2VsOiB0cnVlXG5cdFx0XHRcdFx0Y2FsbGJhY2tfdHJ1ZTogLT5cblx0XHRcdFx0XHRcdGxvY2F0aW9uLmhyZWYgPSBlbGVtZW50LmF0dHIoXCJocmVmXCIpXG5cdFx0XHRcdGZhbHNlXG5cblx0XHRcdCQoXCJbZGF0YS1hbGVydF1cIikuZWFjaCAtPlxuXHRcdFx0XHRlbGVtZW50ID0gJCh0aGlzKVxuXHRcdFx0XHRpZiAhZWxlbWVudC5pcyhcImFcIikgJiYgIWVsZW1lbnQuaXMoXCJidXR0b25cIilcblx0XHRcdFx0XHRhcHAuYWxlcnQub3BlblxuXHRcdFx0XHRcdFx0dGl0bGU6IGVsZW1lbnQuYXR0cihcImRhdGEtdGl0bGVcIilcblx0XHRcdFx0XHRcdGNvbnRlbnQ6IGVsZW1lbnQuYXR0cihcImRhdGEtY29udGVudFwiKVxuXHRcdFx0XHRcdFx0YWNjZXB0OiB0cnVlXG5cdFx0XHRcdFx0XHRjYW5jZWw6IHRydWVcblxuXG5cdG9wZW46IChvcHRpb25zKSAtPlxuXG5cdFx0dGl0bGUgPSBcIlwiXG5cdFx0Y29udGVudCA9IFwiXCJcblx0XHRidXR0b25zID0gXCJcIlxuXHRcdGNsb3NlID0gXCJcIlxuXG5cdFx0aWYgb3B0aW9ucy5zdGF0aWMgPT0gdHJ1ZVxuXHRcdFx0YWxlcnRsaWdodGNsYXNzICAgID0gJydcblx0XHRcdG9wdGlvbnMuY2xvc2UgPSBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdGFsZXJ0bGlnaHRjbGFzcyA9ICcgZmFsc2UnXG5cblx0XHRpZiBvcHRpb25zLmFsZXJ0Y2xhc3Ncblx0XHRcdGFsZXJ0Y2xhc3MgPSBcImFsZXJ0LVwiICsgb3B0aW9ucy5hbGVydGNsYXNzXG5cdFx0ZWxzZVxuXHRcdFx0YWxlcnRjbGFzcyA9IFwiYWxlcnQtZGVmYXVsdFwiXG5cblx0XHRpZiBvcHRpb25zLnRpdGxlXG5cdFx0XHR0aXRsZSA9IFwiPGgyIGNsYXNzPSdhbGVydC10aXRsZSc+XCIgKyBvcHRpb25zLnRpdGxlICsgXCI8L2gyPlwiXG5cblx0XHRpZiBvcHRpb25zLmNvbnRlbnRcblx0XHRcdGNvbnRlbnQgPSBcIjxkaXYgY2xhc3M9J2FsZXJ0LWNvbnRlbnQnPlwiICsgb3B0aW9ucy5jb250ZW50ICsgXCI8L2Rpdj5cIlxuXG5cdFx0aWYgb3B0aW9ucy5jbG9zZSA9PSB1bmRlZmluZWRcblx0XHRcdG9wdGlvbnMuY2xvc2UgPSB0cnVlXG5cblx0XHRpZiBvcHRpb25zLmNsb3NlID09IHRydWVcblx0XHRcdGNsb3NlID0gJzxidXR0b24gY2xhc3M9XCJhbGVydC1jbG9zZSBmYWxzZVwiPjxpIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L2k+PC9idXR0b24+J1xuXG5cdFx0aWYgb3B0aW9ucy5idXR0b25zXG5cdFx0XHRidXR0b25zICs9IG9wdGlvbnMuYnV0dG9ucyArIFwiIFwiXG5cblx0XHRpZiBvcHRpb25zLmNhbmNlbCA9PSB0cnVlXG5cdFx0XHRidXR0b25zICs9ICc8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGZhbHNlXCI+Q2FuY2VsYXI8L2J1dHRvbj4gJ1xuXG5cdFx0aWYgb3B0aW9ucy5hY2NlcHQgPT0gdHJ1ZVxuXHRcdFx0YnV0dG9ucyArPSAnPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBidXR0b24tcHJpbWFyeSB0cnVlXCI+QWNlcHRhcjwvYnV0dG9uPiAnXG5cblx0XHRpZiBidXR0b25zXG5cdFx0XHRidXR0b25zID0gJzxkaXYgY2xhc3M9XCJhbGVydC1idXR0b25zXCI+JytidXR0b25zKyc8L2Rpdj4nXG5cblxuXHRcdGh0bWwgPVxuXHRcdFx0JzxkaXYgY2xhc3M9XCJhbGVydCAnK2FsZXJ0Y2xhc3MrJyBpblwiPicrXG5cdFx0XHRcdCc8ZGl2IGNsYXNzPVwiYWxlcnQtbGlnaHQgJythbGVydGxpZ2h0Y2xhc3MrJ1wiPjwvZGl2PicrXG5cdFx0XHRcdCc8ZGl2IGNsYXNzPVwiYWxlcnQtYm94IGVxdWlkaXN0XCI+Jytcblx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cImFsZXJ0LWlubmVyXCI+Jytcblx0XHRcdFx0XHRcdGNsb3NlICtcblx0XHRcdFx0XHRcdHRpdGxlICtcblx0XHRcdFx0XHRcdGNvbnRlbnQgK1xuXHRcdFx0XHRcdFx0YnV0dG9ucyArXG5cdFx0XHRcdFx0JzwvZGl2PicrXG5cdFx0XHRcdCc8L2Rpdj4nK1xuXHRcdFx0JzwvZGl2PidcblxuXG5cdFx0JChcImJvZHlcIikuYXBwZW5kKGh0bWwpXG5cdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJhbGVydC1pblwiKVxuXG5cdFx0YXBwLmFsZXJ0LmVxdWlkaXN0KClcblxuXG5cdFx0JChcIi5hbGVydCAudHJ1ZSwgLmFsZXJ0IC5mYWxzZVwiKS51bmJpbmQoXCJjbGlja1wiKS5iaW5kIFwiY2xpY2tcIiwgLT4gXG5cblx0XHRcdGFsZXJ0b3JpZ2luID0gJCh0aGlzKS5jbG9zZXN0KFwiLmFsZXJ0XCIpXG5cblx0XHRcdGFsZXJ0b3JpZ2luLmFkZENsYXNzKFwib3V0XCIpXG5cdFx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRcdGFsZXJ0b3JpZ2luLnJlbW92ZSgpXG5cdFx0XHRcdCNhbGVydG9yaWdpbi5yZW1vdmVDbGFzcyhcImluIG91dFwiKVxuXHRcdFx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImFsZXJ0LWluXCIpXG5cdFx0XHQsMjAwXG5cblx0XHRcdGlmICQodGhpcykuaGFzQ2xhc3MoXCJ0cnVlXCIpICYmIG9wdGlvbnMuY2FsbGJhY2tfdHJ1ZVxuXHRcdFx0XHRvcHRpb25zLmNhbGxiYWNrX3RydWUoKVxuXG5cdFx0XHRpZiAkKHRoaXMpLmhhc0NsYXNzKFwiZmFsc2VcIikgJiYgb3B0aW9ucy5jYWxsYmFja19mYWxzZVxuXHRcdFx0XHRvcHRpb25zLmNhbGxiYWNrX2ZhbHNlKClcblxuXHRcdFx0cmV0dXJuIHRydWVcblxuXHRjbG9zZWFsbDogLT5cblx0XHQkKFwiLmFsZXJ0XCIpLmFkZENsYXNzKFwib3V0XCIpXG5cdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJhbGVydC1pblwiKVxuXG5cdHJlbW92ZWFsbDogLT5cblx0XHQkKFwiLmFsZXJ0XCIpLmFkZENsYXNzKFwib3V0XCIpXG5cdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0JChcIi5hbGVydFwiKS5yZW1vdmUoKVxuXHRcdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJhbGVydC1pblwiKVxuXHRcdCwyMDBcblxuXHRlcXVpZGlzdDogLT5cblx0XHQkKFwiLmVxdWlkaXN0XCIpLmVhY2ggLT5cblx0XHRcdF90aGlzID0gJCh0aGlzKVxuXHRcdFx0X2xlZnQgPSAoX3RoaXMucGFyZW50KCkud2lkdGgoKSAtIF90aGlzLndpZHRoKCkpIC8gMlxuXHRcdFx0X2xlZnQgPSAwIGlmIF9sZWZ0IDwgMFxuXHRcdFx0X3RvcCA9IChfdGhpcy5wYXJlbnQoKS5oZWlnaHQoKSAtIF90aGlzLmhlaWdodCgpKSAvIDJcblx0XHRcdF90b3AgPSAwIGlmIF90b3AgPCAwXG5cdFx0XHRfdGhpcy5jc3Ncblx0XHRcdCAgbGVmdDogX2xlZnQgKyBcInB4XCJcblx0XHRcdCAgdG9wOiBfdG9wICsgXCJweFwiXG5cblx0bG9hZDogKGhyZWYsY3NzY2xhc3M9XCJkZWZhdWx0XCIsY2FsbGJhY2s9ZmFsc2UpIC0+XG5cdFx0JC5hamF4KFxuXHRcdFx0dXJsOiBocmVmXG5cdFx0XHR0eXBlOiAnR0VUJ1xuXHRcdCkuZG9uZSAocmVzdWx0KSAtPlxuXHRcdFx0YXBwLmFsZXJ0Lm9wZW5cblx0XHRcdFx0Y29udGVudDogcmVzdWx0XG5cdFx0XHRcdGFsZXJ0Y2xhc3M6IGNzc2NsYXNzXG5cdFx0XHRpZiBjYWxsYmFja1xuXHRcdFx0XHRjYWxsYmFjaygpXG5cdFx0XHQjYXBwLnBsdWdpbnMucmVsYXlvdXQoKVxuXG5cblxuXG5hcHAuaXNNb2JpbGUgPSAtPlxuXHRpZiAvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudClcblx0XHR0cnVlXG5cdGVsc2Vcblx0XHRmYWxzZVxuXG5hcHAuYnJvd3NlcnMgPSAtPlxuXG5cdCMgTW9iaWxlXG5cdGlmIGFwcC5pc01vYmlsZSgpXG5cdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJpcy1tb2JpbGVcIilcblxuXHQjIElFXG5cdGlmICQuYnJvd3Nlci5tc2llIHx8IG5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoJ1RyaWRlbnQvJykhPS0xXG5cdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJpcy1pZVwiKVxuXHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiaXMtaWVcIiskLmJyb3dzZXIudmVyc2lvbilcblx0XHRpZiBwYXJzZUludCgkLmJyb3dzZXIudmVyc2lvbikgPD0gN1xuXHRcdFx0YXBwLmFsZXJ0Lm9wZW5cblx0XHRcdFx0dGl0bGU6IFwiRXN0w6FzIHVzYW5kbyB1biBuYXZlZ2Fkb3IgbXV5IGFudGlndW9cIlxuXHRcdFx0XHRjb250ZW50OiBcIkFjdHVhbGl6YSB0dSBuYXZlZ2Fkb3IgYWhvcmEgeSBkaXNmcnV0YSBkZSB1bmEgbWVqb3IgZXhwZXJpZW5jaWEgZW4gRmFsYWJlbGxhIE5vdmlvcy5cIlxuXHRcdFx0XHRidXR0b25zOiBcIjxhIGhyZWY9J2h0dHA6Ly9icm93c2VoYXBweS5jb20vP2xvY2FsZT1lcycgdGFyZ2V0PSdfYmxhbmsnIGNsYXNzPSdidXR0b24gYnV0dG9uLXByaW1hcnkgYnV0dG9uLWJpZyc+QWN0dWFsaXphciBhaG9yYTwvYT5cIlxuXHRcdFx0XHRzdGF0aWM6IHRydWVcblxuXG5cbmFwcC5jb29raWUgPSBcblxuXHRjcmVhdGU6IChuYW1lLCB2YWx1ZSwgZGF5cykgLT5cblx0XHRpZiBkYXlzXG5cdFx0XHRkYXRlID0gbmV3IERhdGUoKVxuXHRcdFx0ZGF0ZS5zZXRUaW1lIGRhdGUuZ2V0VGltZSgpICsgKGRheXMgKiAyNCAqIDYwICogNjAgKiAxMDAwKVxuXHRcdFx0ZXhwaXJlcyA9IFwiOyBleHBpcmVzPVwiICsgZGF0ZS50b0dNVFN0cmluZygpXG5cdFx0ZWxzZVxuXHRcdFx0ZXhwaXJlcyA9IFwiXCJcblx0XHRkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyB2YWx1ZSArIGV4cGlyZXMgKyBcIjsgcGF0aD0vXCJcblxuXHRyZWFkOiAobmFtZSkgLT5cblx0XHRuYW1lRVEgPSBuYW1lICsgXCI9XCJcblx0XHRjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdChcIjtcIilcblx0XHRpID0gMFxuXG5cdFx0d2hpbGUgaSA8IGNhLmxlbmd0aFxuXHRcdFx0YyA9IGNhW2ldXG5cdFx0XHRjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpICB3aGlsZSBjLmNoYXJBdCgwKSBpcyBcIiBcIlxuXHRcdFx0cmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKSAgaWYgYy5pbmRleE9mKG5hbWVFUSkgaXMgMFxuXHRcdFx0aSsrXG5cdFx0bnVsbFxuXG5cdGRlbGV0ZTogKG5hbWUpIC0+XG5cdFx0YXBwLmNvb2tpZS5jcmVhdGUgbmFtZSwgXCJcIiwgLTFcblxuXG5cblxuY2hlY2t3aWR0aF9wcmV2ID0gZmFsc2VcblxuXG5hcHAuZm9udHMgPVxuXG5cdGluaXQ6IC0+XG5cblx0XHRhcHAuZm9udHMudG9vbHMuaW5pdCgpXG5cdFx0YXBwLmZvbnRzLnByZXNlbnRhdGlvbigpXG5cdFx0YXBwLmZvbnRzLm5hdi5pbml0KClcblxuXHRcdGFwcC5mb250cy5pbnN0cnVjdGlvbnMuaW5pdCgpXG5cblxuXHRhZGQ6IChmb250LGZvbnRfaWQpIC0+XG5cblx0XHRpZiBmb250ICYmIGZvbnRfaWRcblxuXHRcdFx0aWYgISQoXCJoZWFkXCIpLmZpbmQoJ2xpbmtbZGF0YS1mb250LWlkPVwiJytmb250X2lkKydcIl0nKS5sZW5ndGhcblx0XHRcdFx0JChcImhlYWRcIikuYXBwZW5kICc8bGluayBocmVmPVwiJyskKFwiYm9keVwiKS5hdHRyKFwiZGF0YS11cmxcIikrJy93cC1jb250ZW50L2ZvbnRzLycrZm9udF9pZCsnL2ZvbnQuY3NzXCIgcmVsPVwic3R5bGVzaGVldFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiIGRhdGEtZm9udD1cIicrZm9udF9pZCsnXCIgLz4nXG5cblxuXHRsb2FkRm9udDogKGZvbnRkaXYsY2FsbGJhY2s9ZmFsc2UpIC0+XG5cdFx0Zm9udCAgICA9IGZvbnRkaXYuYXR0cihcImRhdGEtZm9udFwiKVxuXHRcdGZvbnRfaWQgICAgPSBmb250ZGl2LmF0dHIoXCJkYXRhLWZvbnQtaWRcIilcblx0XHRpZiBmb250ICYmIGZvbnRfaWQgJiYgZm9udCE9dW5kZWZpbmVkXG5cdFx0XHRhcHAuZm9udHMuYWRkIGZvbnQsIGZvbnRfaWRcblx0XHRcdGZvbnRkaXYuY3NzXG5cdFx0XHRcdFwiZm9udC1mYW1pbHlcIjogZm9udFxuXHRcdFx0Zm9udGRpdi5maW5kKFwiZGl2LGlucHV0XCIpLmNzc1xuXHRcdFx0XHRcImZvbnQtZmFtaWx5XCI6IGZvbnRcblx0XHRcdCNjb25zb2xlLmxvZyBcIi0tLSBGdWVudGUgcHVlc3RhXCJcblx0XHRcdGFwcC5mb250cy5jaGVja0ZvbnQoZm9udGRpdixmb250KVxuXG5cblx0c2VhcmNoTG9hZEZvbnQ6IC0+XG5cdFx0Zm91bmRmb250ID0gJChcIi5mb250Om5vdCguZm9udC1sb2FkZWQpXCIpLmVxKDApXG5cdFx0I2NvbnNvbGUubG9nIFwiKi0tIEZ1ZW50ZSBhIGNhcmdhcjogXCIrIGZvdW5kZm9udC5hdHRyKFwiZGF0YS1mb250XCIpXG5cdFx0aWYgZm91bmRmb250Lmxlbmd0aFxuXHRcdFx0YXBwLmZvbnRzLmxvYWRGb250IGZvdW5kZm9udCwgYXBwLmZvbnRzLnNlYXJjaExvYWRGb250XG5cblxuXHRjaGVja0ZvbnQ6IChmb250ZGl2LGZvbnQpIC0+XG5cdFx0JChcIi5jaGVja2xvYWRmb250XCIpLnJlbW92ZSgpXG5cdFx0JChcImJvZHlcIikuYXBwZW5kKFwiPHNwYW4gY2xhc3M9J2NoZWNrbG9hZGZvbnQnIHN0eWxlPSdwb3NpdGlvbjphYnNvbHV0ZTt0b3A6LTEwMHB4O2xlZnQ6MDtiYWNrZ3JvdW5kOiM5OTk7Zm9udC1mYW1pbHk6c2VyaWY7Jz5hYmNpamwhJCUmL28wPC9zcGFuPlwiKVxuXHRcdGNoZWNrd2lkdGhfcHJldiA9IGZhbHNlXG5cdFx0YXBwLmZvbnRzLmNoZWNrRm9udFQoZm9udGRpdixmb250KVxuXG5cdGNoZWNrRm9udFQ6IChmb250ZGl2LGZvbnQpIC0+XG5cblx0XHQjY29uc29sZS5sb2cgXCJjaGVja2VhbmRvXCJcblxuXHRcdGNoZWNrZGl2ID0gJChcIi5jaGVja2xvYWRmb250XCIpXG5cdFx0Y2hlY2t3aWR0aCA9IGNoZWNrZGl2LndpZHRoKClcblxuXHRcdCQoXCIuY2hlY2tsb2FkZm9udFwiKS5jc3Ncblx0XHRcdFwiZm9udC1mYW1pbHlcIjogZm9udFxuXG5cdFx0I2NvbnNvbGUubG9nIGNoZWNrd2lkdGggKyBcIiB2cyBcIiArIGNoZWNrd2lkdGhfcHJldlxuXG5cdFx0aWYgY2hlY2t3aWR0aCE9Y2hlY2t3aWR0aF9wcmV2ICYmIGNoZWNrd2lkdGhfcHJldiE9ZmFsc2Vcblx0XHRcdGZvbnRkaXYuYWRkQ2xhc3MoJ2ZvbnQtbG9hZGVkJylcblx0XHRcdCNjb25zb2xlLmxvZyBcIi0tLSBGdWVudGUgY2FyZ2FkYVwiXG5cdFx0XHRhcHAuZm9udHMuc2VhcmNoTG9hZEZvbnQoKVxuXHRcdGVsc2Vcblx0XHRcdCNjb25zb2xlLmxvZyBcImRzYWRzYVwiXG5cdFx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRcdGFwcC5mb250cy5jaGVja0ZvbnRUKGZvbnRkaXYsZm9udClcblx0XHRcdCw1MFxuXG5cdFx0Y2hlY2t3aWR0aF9wcmV2ID0gY2hlY2t3aWR0aFxuXG5cblxuXG5cblxuXHRuYXY6XG5cdFx0aW5pdDogLT5cblx0XHRcdCQoXCIuc2luZ2xlLWZvbnQtbmF2aWdhdGlvbiAubmF2XCIpLnVuYmluZChcImNsaWNrXCIpLmJpbmQgXCJjbGlja1wiLCAtPlxuXHRcdFx0XHRhcHAuZm9udHMubmF2LmxvYWQgJCh0aGlzKVxuXHRcdFx0XHRmYWxzZVxuXG5cdFx0bG9hZDogKGVsZW1lbnQpIC0+XG5cblx0XHRcdHVybCA9IGVsZW1lbnQuYXR0cihcImhyZWZcIikuc3BsaXQoJyAnKS5qb2luKCclMjAnKTtcblxuXHRcdFx0ZGlyID0gZmFsc2Vcblx0XHRcdGRpciA9IFwicmlnaHRcIiBpZiBlbGVtZW50Lmhhc0NsYXNzKFwibmF2LXJpZ2h0XCIpXG5cdFx0XHRkaXIgPSBcImxlZnRcIiAgaWYgZWxlbWVudC5oYXNDbGFzcyhcIm5hdi1sZWZ0XCIpXG5cblx0XHRcdCNjb25zb2xlLmxvZyB1cmxcblxuXHRcdFx0JChcIi5zaW5nbGUtZm9udC1oZWFkZXJcIikucmVtb3ZlQ2xhc3MgXCJhbmltYXRpb24tcmlnaHRcIlxuXHRcdFx0JChcIi5zaW5nbGUtZm9udC1oZWFkZXJcIikucmVtb3ZlQ2xhc3MgXCJhbmltYXRpb24tbGVmdFwiXG5cblx0XHRcdCQoXCIuc2luZ2xlLWZvbnQtaGVhZGVyXCIpLmFkZENsYXNzIFwiYW5pbWF0aW9uLXJpZ2h0LW91dFwiIGlmIGRpcj09XCJsZWZ0XCJcblx0XHRcdCQoXCIuc2luZ2xlLWZvbnQtaGVhZGVyXCIpLmFkZENsYXNzIFwiYW5pbWF0aW9uLWxlZnQtb3V0XCIgIGlmIGRpcj09XCJyaWdodFwiXG5cblx0XHRcdCQoXCIudGVzdC1mb250XCIpLmFkZENsYXNzIFwib3V0XCJcblxuXHRcdFx0JChcIi5nYWxsZXJ5XCIpLmFkZENsYXNzKFwib3V0XCIpXG5cblxuXHRcdFx0c2V0VGltZW91dCAtPlxuXG5cdFx0XHRcdCQuYWpheChcblx0XHRcdFx0XHR1cmw6IHVybFxuXHRcdFx0XHQpLmRvbmUgKHJlc3VsdCkgLT5cblx0XHRcdFx0XHRodG1sID0gJChyZXN1bHQpXG5cdFx0XHRcdFx0bmV3X2hlYWRlciA9IGh0bWwuZmluZChcIi5zaW5nbGUtZm9udC1oZWFkZXIgPlwiKVxuXHRcdFx0XHRcdG5ld19nYWxsZXJ5ID0gaHRtbC5maW5kKFwiLmdhbGxlcnkgPlwiKVxuXG5cdFx0XHRcdFx0JChcIi5zaW5nbGUtZm9udC1oZWFkZXJcIikuaHRtbChuZXdfaGVhZGVyKVxuXHRcdFx0XHRcdCQoXCIuZ2FsbGVyeVwiKS5odG1sKG5ld19nYWxsZXJ5KS5yZW1vdmVDbGFzcyhcIm91dFwiKVxuXG5cdFx0XHRcdFx0JChcIi5zaW5nbGUtZm9udC1oZWFkZXJcIikucmVtb3ZlQ2xhc3MgXCJhbmltYXRpb24tcmlnaHQtb3V0XCJcblx0XHRcdFx0XHQkKFwiLnNpbmdsZS1mb250LWhlYWRlclwiKS5yZW1vdmVDbGFzcyBcImFuaW1hdGlvbi1sZWZ0LW91dFwiIFxuXHRcdFx0XHRcdCQoXCIuc2luZ2xlLWZvbnQtaGVhZGVyXCIpLmFkZENsYXNzIFwiYW5pbWF0aW9uLVwiK2RpclxuXG5cdFx0XHRcdFx0bmV3Zm9udCA9ICQoXCJoMVwiKS5hdHRyKFwiZGF0YS1mb250XCIpXG5cdFx0XHRcdFx0bmV3Zm9udF9pZCA9ICQoXCJoMVwiKS5hdHRyKFwiZGF0YS1mb250LWlkXCIpXG5cblx0XHRcdFx0XHRpZiBuZXdmb250X2lkXG5cblx0XHRcdFx0XHRcdCQoXCIudGVzdC1mb250XCIpLmF0dHIgXCJkYXRhLWZvbnRcIiwgbmV3Zm9udFxuXHRcdFx0XHRcdFx0JChcIi50ZXN0LWZvbnRcIikuYXR0ciBcImRhdGEtZm9udC1pZFwiLCBuZXdmb250X2lkXG5cdFx0XHRcdFx0XHQkKFwiLnRlc3QtZm9udC1oMSwgLnRlc3QtZm9udC1wXCIpLmNzc1xuXHRcdFx0XHRcdFx0XHRcImZvbnQtZmFtaWx5XCI6IG5ld2ZvbnRcblxuXHRcdFx0XHRcdFx0JChcIi50ZXN0LWZvbnRcIikucmVtb3ZlQ2xhc3MoXCJvdXRcIikuYWRkQ2xhc3MgXCJpblwiXG5cblx0XHRcdFx0XHRcdGFwcC5mb250cy5hZGQgbmV3Zm9udCwgbmV3Zm9udF9pZFxuXHRcdFx0XHRcdFx0YXBwLmZvbnRzLnRvb2xzLnRleHRhcmVhaGVpZ2h0KClcblx0XHRcdFx0XHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdFx0XHRcdFx0YXBwLmZvbnRzLnRvb2xzLnRleHRhcmVhaGVpZ2h0KClcblx0XHRcdFx0XHRcdCwxMDAwXG5cblx0XHRcdFx0XHRcdGFwcC5mb250cy5uYXYuaW5pdCgpXG5cdFx0XHRcdFx0XHRhcHAuYWN0aW9ucy5pbml0KClcblxuXHRcdFx0LDUwMFxuXG5cblx0cHJlc2VudGF0aW9uOiAtPlxuXG5cdFx0dGV4dHNfZGVmYXVsdCA9IFtcblx0XHRcdFwiTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXRcIixcblx0XHRcdFwiUmVwZWxsZW5kdXMsIGludmVudG9yZSwgbmVtby5cIixcblx0XHRcdFwiNDIzLTg5KDA4KSoyKzgzNTkxXCIsXG5cdFx0XHRcIkRvbG9yZW1xdWUgcGxhY2VhdCBjdXBpZGl0YXRlXCIsXG5cdFx0XHRcIkFtZXQgcXVvZCBzaW50IGFkaXBpc2NpLlwiLFxuXHRcdFx0XCIkJSYqPT97K1wiLFxuXHRcdFx0XCJJdGFxdWUgbmloaWwgb2ZmaWNpaXMuXCJcblx0XHRcdFwiQUJDREVGR0hJSktMTU7DkU9QUVJTVFVWV1hZWlwiXG5cdFx0XVxuXG5cdFx0JChcIi5ob2xhLWJnXCIpLmVhY2ggLT5cblx0XHRcdGRpdiA9ICQodGhpcylcblx0XHRcdHRleHRzID0gZGl2LmF0dHIoXCJkYXRhLXRleHRzXCIpXG5cdFx0XHRpZiB0ZXh0c1xuXHRcdFx0XHR0ZXh0cyA9IHRleHRzLnNwbGl0KFwifHxcIilcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGV4dHMgPSB0ZXh0c19kZWZhdWx0XG5cblx0XHRcdCNjb25zb2xlLmxvZyB0ZXh0c1xuXHRcdFx0cmFuZCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAxMCkgKyAxKVxuXG5cdFx0XHRpID0gMVxuXHRcdFx0Zm9yIHRleHQgaW4gdGV4dHNcblx0XHRcdFx0cmFuZF9zaXplID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDE1MCkgKyAxKVxuXHRcdFx0XHRyYW5kX3RvcCA9IGkqMTBcblx0XHRcdFx0ZGl2LmFwcGVuZCBcIjxkaXYgY2xhc3M9J2NoYW8gY2hhby1cIitpK1wiJyBzdHlsZT0nZm9udC1zaXplOlwiK3JhbmRfc2l6ZStcInB4O3RvcDpcIityYW5kX3RvcCtcIiU7Jz5cIit0ZXh0K1wiPC9kaXY+XCJcblx0XHRcdFx0aSsrXG5cblx0XHRcdCMgSW5zZXJ0IGZvbnRcblx0XHRcdGZvbnQgPSBkaXYucGFyZW50KCkuYXR0cihcImRhdGEtZm9udFwiKVxuXHRcdFx0Zm9udF9pZCA9IGRpdi5wYXJlbnQoKS5hdHRyKFwiZGF0YS1mb250LWlkXCIpXG5cdFx0XHRhcHAuZm9udHMuYWRkIGZvbnQsIGZvbnRfaWRcblx0XHRcdGRpdi5jc3Ncblx0XHRcdFx0XCJmb250LWZhbWlseVwiOiBmb250XG5cblxuXHRcdGFwcC5mb250cy5zZWFyY2hMb2FkRm9udCgpXG5cblxuXHRcdCQoXCIuZm9udC1iaWdcIikua2V5dXAgLT5cblx0XHRcdHRleHQgPSAkKHRoaXMpLnZhbCgpXG5cdFx0XHQkKFwiLmZvbnQtYmlnXCIpLmVhY2ggLT5cblx0XHRcdFx0aWYgISQodGhpcykuaXMoXCI6Zm9jdXNcIilcblx0XHRcdFx0XHQkKHRoaXMpLnZhbCB0ZXh0XG5cblxuXHRpbnN0cnVjdGlvbnM6XG5cdFx0aW5pdDogLT5cblx0XHRcdCQoXCIuaW5zdHJ1Y3Rpb25cIikuZWFjaCAtPlxuXHRcdFx0XHRpbnN0ID0gJCh0aGlzKSBcblx0XHRcdFx0biA9IGluc3QuYXR0cihcImRhdGEtaW5zdHJ1Y3Rpb25cIilcblxuXHRcdFx0XHRpZiAhYXBwLmNvb2tpZS5yZWFkIFwiaW5zdHJ1Y3Rpb24tXCIrblxuXG5cdFx0XHRcdFx0aW5zdC5hZGRDbGFzcyhcImluXCIpXG5cdFx0XHRcdFx0I2NvbnNvbGUubG9nIGluc3QucGFyZW50KCkuZmluZChcImlucHV0LHRleHRhcmVhXCIpXG5cdFx0XHRcdFx0aW5zdC5wYXJlbnQoKS5maW5kKFwiaW5wdXQsdGV4dGFyZWFcIikua2V5dXAgLT5cblx0XHRcdFx0XHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdFx0XHRcdFx0aW5zdC5hZGRDbGFzcyhcIm91dFwiKVxuXHRcdFx0XHRcdFx0XHRhcHAuY29va2llLmNyZWF0ZSBcImluc3RydWN0aW9uLVwiK24sIFwib2tcIlxuXHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRcdFx0XHRcdFx0aW5zdC5yZW1vdmUoKVxuXHRcdFx0XHRcdFx0XHQsNTAwXG5cdFx0XHRcdFx0XHQsNTAwXG5cblxuXG5cblx0dG9vbHM6XG5cdFxuXHRcdGluaXQ6IC0+XG5cblx0XHRcdCMgSGVpZ2h0IHRlc3Rcblx0XHRcdCQoXCIjdGVzdC1mb250LWNvbnRhaW5lclwiKS5jc3Ncblx0XHRcdFx0XCJtaW4taGVpZ2h0XCI6ICQod2luZG93KS5oZWlnaHQoKSAtICQoXCJoZWFkZXJcIikuaGVpZ2h0KClcblx0XHRcdCQod2luZG93KS5yZXNpemUgLT5cblx0XHRcdFx0JChcIiN0ZXN0LWZvbnQtY29udGFpbmVyXCIpLmNzc1xuXHRcdFx0XHRcdFwibWluLWhlaWdodFwiOiAkKHdpbmRvdykuaGVpZ2h0KCkgLSAkKFwiaGVhZGVyXCIpLmhlaWdodCgpXG5cblxuXHRcdFx0IyBTZXQgZm9udFxuXG5cdFx0XHRmb250ID0gJChcIi50ZXN0LWZvbnRcIikuYXR0cihcImRhdGEtZm9udFwiKVxuXHRcdFx0Zm9udF9pZCA9ICQoXCIudGVzdC1mb250XCIpLmF0dHIoXCJkYXRhLWZvbnQtaWRcIilcblx0XHRcdFxuXHRcdFx0YXBwLmZvbnRzLmFkZCBmb250LCBmb250X2lkXG5cdFx0XHQkKFwiLnRlc3QtZm9udC1oMSwgLnRlc3QtZm9udC1wXCIpLmNzc1xuXHRcdFx0XHRcImZvbnQtZmFtaWx5XCI6IGZvbnRcblxuXHRcdFx0IyBFdmVudHMgdGVzdFxuXG5cdFx0XHRhcHAuZm9udHMudG9vbHMudGV4dGFyZWFjb3B5dGV4dCgpXG5cdFx0XHQkKFwiLnRlc3QtZm9udC1oMS5saXZlLCAudGVzdC1mb250LXAubGl2ZVwiKS5rZXl1cCAtPlxuXHRcdFx0XHRhcHAuZm9udHMudG9vbHMudGV4dGFyZWFjb3B5dGV4dCgpXG5cblx0XHRcdCQoXCJib2R5XCIpLmNsaWNrIC0+XG5cdFx0XHRcdCQoXCIudGVzdC1mb250LWdyb3VwXCIpLnJlbW92ZUNsYXNzIFwiaW5cIlxuXHRcdFx0XHQkKFwiLnRvb2xzXCIpLmFkZENsYXNzIFwib3V0XCJcblx0XHRcdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0XHRcdCQoXCIudG9vbHNcIikucmVtb3ZlQ2xhc3MgXCJpbiBvdXRcIlxuXHRcdFx0XHRcdCQoXCIudG9vbHMtZ3JvdXBcIikucmVtb3ZlQ2xhc3MgXCJpblwiXG5cdFx0XHRcdCw1MDBcblxuXG5cdFx0XHQkKFwiLnRvb2xzXCIpLmNsaWNrIChlKSAtPlxuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHQkKFwiLnRlc3QtZm9udC1oMS5saXZlLCAudGVzdC1mb250LXAubGl2ZVwiKS5jbGljayAoZSkgLT5cblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKVxuXG5cdFx0XHQkKFwiLnRlc3QtZm9udC1oMS5saXZlLCAudGVzdC1mb250LXAubGl2ZVwiKS5mb2N1cyAtPlxuXG5cdFx0XHRcdCQoXCIudG9vbHNcIikuYWRkQ2xhc3MgXCJpblwiXG5cblx0XHRcdFx0JChcIi50ZXN0LWZvbnQtZ3JvdXBcIikucmVtb3ZlQ2xhc3MgXCJpblwiXG5cdFx0XHRcdCQoXCIudG9vbHMtZ3JvdXBcIikucmVtb3ZlQ2xhc3MgXCJpblwiXG5cblx0XHRcdFx0dGVzdF9ncm91cCA9ICQodGhpcykuY2xvc2VzdChcIi50ZXN0LWZvbnQtZ3JvdXBcIilcblx0XHRcdFx0dGVzdF9ncm91cC5hZGRDbGFzcyBcImluXCJcblx0XHRcdFx0JChcIi50b29scy1ncm91cC5cIit0ZXN0X2dyb3VwLmF0dHIoXCJkYXRhLXRvb2xzXCIpKS5hZGRDbGFzcyBcImluXCJcblx0XG5cdFx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRcdGFwcC5mb250cy50b29scy50ZXh0YXJlYWhlaWdodCgpXG5cdFx0XHQsMTAwMFxuXG5cdFx0XHQkKHdpbmRvdykucmVzaXplIC0+XG5cdFx0XHRcdGFwcC5mb250cy50b29scy50ZXh0YXJlYWhlaWdodCgpXG5cblxuXG5cdFx0XHQjIFNldCBjc3NcblxuXHRcdFx0JChcIi50b29sXCIpLmVhY2ggLT5cblx0XHRcdFx0dG9vbCAgICAgICAgPSAkKHRoaXMpXG5cdFx0XHRcdHRvb2xfdG8gICAgID0gdG9vbC5hdHRyKFwiZGF0YS10b1wiKVxuXHRcdFx0XHR0b29sX2NzcyAgICA9IHRvb2wuYXR0cihcImRhdGEtY3NzXCIpXG5cdFx0XHRcdHRvb2xfaW5pdCAgID0gdG9vbC5hdHRyKFwiZGF0YS1pbml0XCIpXG5cdFx0XHRcdHRvb2xfc2VsZWN0ID0gdG9vbC5hdHRyKFwiZGF0YS1zZWxlY3RcIilcblxuXHRcdFx0XHQjIFNldCBwcm9wZXJ0aWVzIGZyb20gY29va2llXG5cblx0XHRcdFx0aWYgYXBwLmNvb2tpZS5yZWFkIFwiY29sb3JcIlxuXHRcdFx0XHRcdCQoXCIudG9vbFtkYXRhLWNzcz0nY29sb3InXVwiKS5hdHRyIFwiZGF0YS1pbml0XCIsIGFwcC5jb29raWUucmVhZChcImNvbG9yXCIpXG5cdFx0XHRcdGlmIGFwcC5jb29raWUucmVhZCBcImJhY2tncm91bmQtY29sb3JcIlxuXHRcdFx0XHRcdCQoXCIudG9vbFtkYXRhLWNzcz0nYmFja2dyb3VuZC1jb2xvciddXCIpLmF0dHIgXCJkYXRhLWluaXRcIiwgYXBwLmNvb2tpZS5yZWFkKFwiYmFja2dyb3VuZC1jb2xvclwiKVxuXG5cblx0XHRcdFx0IyBTZXQgY3NzXG5cdFx0XHRcdGFwcC5mb250cy50b29scy5pbnNlcnRjc3ModG9vbF90byx0b29sX2Nzcyx0b29sX2luaXQpXG5cblx0XHRcdFx0IyBTZXQgaW5kaWNhdG9yXG5cdFx0XHRcdGFwcC5mb250cy50b29scy5zZXRpbmRpY2F0b3IoJCh0aGlzKSx0b29sX2luaXQpXG5cblx0XHRcdFx0IyBTZXQgb3B0aW9ucyBmb3IgY29sb3JzXG5cdFx0XHRcdGlmIHRvb2xfc2VsZWN0XG5cdFx0XHRcdFx0dG9vbF9zZWxlY3Rfc3BsaXQgPSB0b29sX3NlbGVjdC5zcGxpdChcInxcIilcblx0XHRcdFx0XHR0b29sLmZpbmQoXCIudG9vbC1pY29uLWNvbG9yLWlubmVyXCIpLmNzc1xuXHRcdFx0XHRcdFx0J2JhY2tncm91bmQtY29sb3InOiAnIycrdG9vbF9pbml0XG5cdFx0XHRcdFx0JC5lYWNoIHRvb2xfc2VsZWN0X3NwbGl0LCAoayx0b29sX29wdGlvbikgLT5cblx0XHRcdFx0XHRcdHRvb2wuZmluZChcIi50b29sLXNlbGVjdFwiKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSd0b29sLW9wdGlvbicgZGF0YS12YWx1ZT0nXCIrdG9vbF9vcHRpb24rXCInIHN0eWxlPSdiYWNrZ3JvdW5kLWNvbG9yOiNcIit0b29sX29wdGlvbitcIjsnPjxkaXYgY2xhc3M9J3Rvb2wtb3B0aW9uLXNlbGVjdGVkJz48L2Rpdj48L2Rpdj5cIilcblxuXG5cdFx0XHQjIEV2ZW50cyBtb3ZlIGJhclxuXG5cdFx0XHRjbGlja19hY3RpdmUgPSBmYWxzZVxuXG5cdFx0XHQkKFwiLnRvb2wgLnRvb2wtYmFyXCIpLm1vdXNlZG93biAoZSkgLT5cblx0XHRcdFx0YXBwLmZvbnRzLnRvb2xzLm1vdmViYXIoJCh0aGlzKSxlKVxuXHRcdFx0XHRjbGlja19hY3RpdmUgPSB0cnVlXG5cblx0XHRcdCQoXCIudG9vbCAudG9vbC1iYXJcIikubW91c2V1cCAtPlxuXHRcdFx0XHRjbGlja19hY3RpdmUgPSBmYWxzZVxuXG5cdFx0XHQkKFwiLnRvb2wgLnRvb2wtYmFyXCIpLm1vdXNlbW92ZSAoZSkgLT5cblx0XHRcdFx0aWYgY2xpY2tfYWN0aXZlXHRcdFxuXHRcdFx0XHRcdGFwcC5mb250cy50b29scy5tb3ZlYmFyKCQodGhpcyksZSlcblxuXG5cdFx0XHQjIEV2ZW50cyBzd2l0Y2hcblx0XHRcdCQoXCIudG9vbFtkYXRhLXN3aXRjaF1cIikuY2xpY2sgLT5cblx0XHRcdFx0dG9vbCAgICAgPSAkKHRoaXMpXG5cdFx0XHRcdHRvb2xfdG8gID0gdG9vbC5hdHRyKFwiZGF0YS10b1wiKVxuXHRcdFx0XHR0b29sX2NzcyA9IHRvb2wuYXR0cihcImRhdGEtY3NzXCIpXG5cblx0XHRcdFx0dmFsdWVzID0gdG9vbC5hdHRyKFwiZGF0YS1zd2l0Y2hcIikuc3BsaXQoXCJ8XCIpXG5cdFx0XHRcdHZhbHVlMSA9IHZhbHVlc1swXVxuXHRcdFx0XHR2YWx1ZTIgPSB2YWx1ZXNbMV1cblxuXHRcdFx0XHR0b29sLnRvZ2dsZUNsYXNzKFwib25cIilcblx0XHRcdFx0XG5cdFx0XHRcdGlmIHRvb2wuaGFzQ2xhc3MoXCJvblwiKVxuXHRcdFx0XHRcdGFwcC5mb250cy50b29scy5pbnNlcnRjc3ModG9vbF90byx0b29sX2Nzcyx2YWx1ZTEpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRhcHAuZm9udHMudG9vbHMuaW5zZXJ0Y3NzKHRvb2xfdG8sdG9vbF9jc3MsdmFsdWUyKVxuXG5cblx0XHRcdCMgQ29sb3Jlc1xuXHRcdFx0YXBwLmZvbnRzLnRvb2xzLmNvbG9ycy5pbml0KClcblxuXG5cdFx0c2V0aW5kaWNhdG9yOiAodG9vbCx2YWx1ZSkgLT5cblxuXHRcdFx0dG9vbF9taW4gPSBwYXJzZUludCB0b29sLmF0dHIoXCJkYXRhLW1pblwiKVxuXHRcdFx0dG9vbF9tYXggPSBwYXJzZUludCB0b29sLmF0dHIoXCJkYXRhLW1heFwiKVxuXG5cdFx0XHRpZiB0b29sX21heFxuXHRcblx0XHRcdFx0bW92ZSA9IHBhcnNlSW50KCAoIHZhbHVlICogMTAwIC8gKHRvb2xfbWF4LXRvb2xfbWluKSApIC0gKCB0b29sX21pbiAqIDEwMCAvICh0b29sX21heC10b29sX21pbikgKSApXG5cblx0XHRcdFx0I2ludmVydFxuXHRcdFx0XHRtb3ZlID0gMTAwIC0gbW92ZVxuXG5cdFx0XHRcdHRvb2wuZmluZChcIi50b29sLWluZGljYXRvclwiKS5jc3Ncblx0XHRcdFx0XHR0b3A6IG1vdmUgKyBcIiVcIlxuXG5cblxuXHRcdG1vdmViYXI6IChlbGVtZW50LGUpIC0+XG5cblx0XHRcdHBvcyAgICAgICA9IGVsZW1lbnQub2Zmc2V0KCkudG9wXG5cdFx0XHRjbGljayAgICAgPSBlLnBhZ2VZXG5cdFx0XHRzY3JvbGwgICAgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKClcblx0XHRcdGhlaWdodCAgICA9IGVsZW1lbnQuaGVpZ2h0KClcblx0XHRcdHRvcCAgICAgICA9IHBvcyAtIHNjcm9sbFxuXHRcdFx0Y2xpY2tfYmFyID0gY2xpY2sgLSBwb3Ncblx0XHRcdG1vdmUgICAgICA9IGNsaWNrX2JhciAqIDEwMCAvIGhlaWdodFxuXG5cdFx0XHRlbGVtZW50LmZpbmQoXCIudG9vbC1pbmRpY2F0b3JcIikuY3NzXG5cdFx0XHRcdHRvcDogbW92ZSArIFwiJVwiXG5cblx0XHRcdHRvb2wgPSBlbGVtZW50LmNsb3Nlc3QoXCIudG9vbFwiKVxuXHRcdFx0dG9vbF90byA9IHRvb2wuYXR0cihcImRhdGEtdG9cIilcblx0XHRcdHRvb2xfY3NzID0gdG9vbC5hdHRyKFwiZGF0YS1jc3NcIilcblx0XHRcdHRvb2xfbWluID0gcGFyc2VJbnQgdG9vbC5hdHRyKFwiZGF0YS1taW5cIilcblx0XHRcdHRvb2xfbWF4ID0gcGFyc2VJbnQgdG9vbC5hdHRyKFwiZGF0YS1tYXhcIilcblxuXHRcdFx0dG9vbF9jYWxjdWxhdGUgPSBwYXJzZUludCggKHRvb2xfbWF4LXRvb2xfbWluKSAqIG1vdmUgLyAxMDAgKSArIHRvb2xfbWluXG5cblx0XHRcdCNpbnZlcnRcblx0XHRcdHRvb2xfY2FsY3VsYXRlID0gdG9vbF9tYXggLSB0b29sX2NhbGN1bGF0ZSArIHRvb2xfbWluXG5cblx0XHRcdCNjb25zb2xlLmxvZyB0b29sX2NhbGN1bGF0ZStcInB4XCJcblxuXHRcdFx0YXBwLmZvbnRzLnRvb2xzLmluc2VydGNzcyh0b29sX3RvLHRvb2xfY3NzLHRvb2xfY2FsY3VsYXRlKVxuXG5cblxuXG5cdFx0aW5zZXJ0Y3NzOiAodG8sY3NzLHZhbHVlKSAtPlxuXHRcdFx0aWYgY3NzID09IFwiZm9udC1zaXplXCJcblx0XHRcdFx0JCh0bykuY3NzIFwiZm9udC1zaXplXCI6IHZhbHVlK1wicHhcIlxuXHRcdFx0aWYgY3NzID09IFwibGluZS1oZWlnaHRcIlxuXHRcdFx0XHQkKHRvKS5jc3MgXCJsaW5lLWhlaWdodFwiOiB2YWx1ZStcInB4XCJcblx0XHRcdGlmIGNzcyA9PSBcImxldHRlci1zcGFjaW5nXCJcblx0XHRcdFx0JCh0bykuY3NzIFwibGV0dGVyLXNwYWNpbmdcIjogdmFsdWUrXCJweFwiXG5cdFx0XHRpZiBjc3MgPT0gXCJ3b3JkLXNwYWNpbmdcIlxuXHRcdFx0XHQkKHRvKS5jc3MgXCJ3b3JkLXNwYWNpbmdcIjogdmFsdWUrXCJweFwiXG5cblx0XHRcdGlmIGNzcyA9PSBcInRleHQtdHJhbnNmb3JtXCJcblx0XHRcdFx0JCh0bykuY3NzIFwidGV4dC10cmFuc2Zvcm1cIjogdmFsdWVcblx0XHRcdGlmIGNzcyA9PSBcImZvbnQtd2VpZ2h0XCJcblx0XHRcdFx0JCh0bykuY3NzIFwiZm9udC13ZWlnaHRcIjogdmFsdWVcblxuXHRcdFx0aWYgY3NzID09IFwiY29sb3JcIlxuXHRcdFx0XHQkKHRvKS5jc3MgXCJjb2xvclwiOiBcIiNcIit2YWx1ZVxuXHRcdFx0XHRhcHAuY29va2llLmNyZWF0ZSBcImNvbG9yXCIsIHZhbHVlXG5cdFx0XHRpZiBjc3MgPT0gXCJiYWNrZ3JvdW5kLWNvbG9yXCJcblx0XHRcdFx0JCh0bykuY3NzIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNcIit2YWx1ZVxuXHRcdFx0XHRhcHAuY29va2llLmNyZWF0ZSBcImJhY2tncm91bmQtY29sb3JcIiwgdmFsdWVcblxuXHRcdFx0YXBwLmZvbnRzLnRvb2xzLnRleHRhcmVhaGVpZ2h0KClcblxuXG5cdFx0dGV4dGFyZWFoZWlnaHQ6IC0+XG5cblx0XHRcdGhlaWdodF9oMSA9ICQoXCIudGVzdC1mb250LWgxLmdob3N0XCIpLmhlaWdodCgpXG5cdFx0XHQkKFwiLnRlc3QtZm9udC1oMS5saXZlXCIpLmNzc1xuXHRcdFx0XHRoZWlnaHQ6IGhlaWdodF9oMStcInB4XCJcblx0XHRcdCQoXCIudGVzdC1mb250LWgxLmxpdmVcIikucGFyZW50KCkuZmluZChcIi50ZXN0LWZvbnQtZ3JvdXAtZm9jdXNcIikuY3NzXG5cdFx0XHRcdGhlaWdodDogaGVpZ2h0X2gxK1wicHhcIlxuXG5cdFx0XHRoZWlnaHRfcCA9ICQoXCIudGVzdC1mb250LXAuZ2hvc3RcIikuaGVpZ2h0KClcblx0XHRcdCQoXCIudGVzdC1mb250LXAubGl2ZVwiKS5jc3Ncblx0XHRcdFx0aGVpZ2h0OiBoZWlnaHRfcCtcInB4XCJcblx0XHRcdCQoXCIudGVzdC1mb250LXAubGl2ZVwiKS5wYXJlbnQoKS5maW5kKFwiLnRlc3QtZm9udC1ncm91cC1mb2N1c1wiKS5jc3Ncblx0XHRcdFx0aGVpZ2h0OiBoZWlnaHRfcCtcInB4XCJcblxuXG5cdFx0dGV4dGFyZWFjb3B5dGV4dDogLT5cblxuXHRcdFx0JChcIi50ZXN0LWZvbnQtaDEuZ2hvc3RcIikuaHRtbCAkKFwiLnRlc3QtZm9udC1oMS5saXZlXCIpLnZhbCgpXG5cdFx0XHQkKFwiLnRlc3QtZm9udC1wLmdob3N0XCIpLmh0bWwgJChcIi50ZXN0LWZvbnQtcC5saXZlXCIpLnZhbCgpXG5cdFx0XHRhcHAuZm9udHMudG9vbHMudGV4dGFyZWFoZWlnaHQoKVxuXG5cblxuXHRcdGNvbG9yczpcblx0XHRcdGluaXQ6IC0+XG5cdFx0XHRcdCQoXCIudG9vbHMgLnRvb2wtc2VsZWN0IC50b29sLW9wdGlvblwiKS5jbGljayAtPlxuXHRcdFx0XHRcdG9wdGlvbiAgICAgPSAkKHRoaXMpXG5cdFx0XHRcdFx0dG9vbCAgICAgICA9IG9wdGlvbi5jbG9zZXN0KFwiLnRvb2xcIilcblx0XHRcdFx0XHR0b29sX3RvICAgID0gdG9vbC5hdHRyKFwiZGF0YS10b1wiKVxuXHRcdFx0XHRcdHRvb2xfY3NzICAgPSB0b29sLmF0dHIoXCJkYXRhLWNzc1wiKVxuXHRcdFx0XHRcdHRvb2xfdmFsdWUgPSBvcHRpb24uYXR0cihcImRhdGEtdmFsdWVcIilcblx0XHRcdFx0XHRhcHAuZm9udHMudG9vbHMuaW5zZXJ0Y3NzKHRvb2xfdG8sdG9vbF9jc3MsdG9vbF92YWx1ZSlcblxuXHRcdFx0XHRcdHRvb2wuZmluZChcIi50b29sLXNlbGVjdCAudG9vbC1vcHRpb25cIikucmVtb3ZlQ2xhc3MoXCJpblwiKVxuXG5cdFx0XHRcdFx0dG9vbC5maW5kKFwiLnRvb2wtaWNvbi1jb2xvci1pbm5lclwiKS5jc3Ncblx0XHRcdFx0XHRcdCdiYWNrZ3JvdW5kLWNvbG9yJzogJyMnK3Rvb2xfdmFsdWUgXG5cblx0XHRcdFx0XHRvcHRpb24uYWRkQ2xhc3MoXCJpblwiKVxuXG5cblxuXG5cblxuXG5cblxuYXBwLmxvYWRpbmcgPVxuXG5cdGluaXQ6IC0+XG5cdFx0aWYgJChcIltkYXRhLWxvYWRpbmddXCIpLmxlbmd0aFxuXHRcdFx0YXBwLmxvYWRpbmcuaW4oKVxuXHRcdCMjI1xuXHRcdGFwcC5sb2FkaW5nLmluKClcblx0XHQkKFwiYm9keVwiKS5pbWFnZXNMb2FkZWQgLT5cblx0XHRcdGFwcC5sb2FkaW5nLm91dCgpXG5cdFx0IyMjXG5cblx0aW46IChlbGVtZW50KSAtPlxuXHRcdGVsZW1lbnQgPSAkKFwiYm9keVwiKSBpZiAhZWxlbWVudFxuXHRcdGVsZW1lbnQuYXBwZW5kICcnK1xuXHRcdFx0JzxkaXYgY2xhc3M9XCJsb2FkaW5nXCI+Jytcblx0XHRcdFx0JzxkaXYgY2xhc3M9XCJsb2FkaW5nLWljb25cIj4nK1xuXHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwibG9hZGluZy1pY29uLWNpcmNsZVwiPjxkaXY+PC9kaXY+PC9kaXY+Jytcblx0XHRcdFx0JzwvZGl2PicrXG5cdFx0XHQnPC9kaXY+J1xuXHRvdXQ6IC0+XG5cdFx0JChcIi5sb2FkaW5nXCIpLmFkZENsYXNzIFwib3V0XCJcblx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHQkKFwiLmxvYWRpbmdcIikucmVtb3ZlKClcblx0XHQsNTAwXG5cdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIilcblxuXG5cblxuYXBwLnBsdWdpbnMgPVxuXG5cdGluaXQ6IC0+XG5cblxuXHRcdCMgSXNvdG9wZVxuXHRcdGlmICQoXCIuaXNvdG9wZVwiKS5sZW5ndGhcblx0XHRcdGlzb3RvcGUgPSAkKFwiLmlzb3RvcGVcIikuaXNvdG9wZSgpXG5cblxuXG5cdHJlbGF5b3V0OiAtPlxuXG5cdFx0JChcImJvZHlcIikuaW1hZ2VzTG9hZGVkIC0+XG5cdFx0XHRhcHAuYWxlcnQuZXF1aWRpc3QoKVxuXHRcdFx0YXBwLmFsZXJ0LmVxdWlkaXN0KClcblx0XHRcdGlmICQoXCIuaXNvdG9wZVwiKS5sZW5ndGhcblx0XHRcdFx0JChcIi5pc290b3BlXCIpLmlzb3RvcGVcblx0XHRcdFx0XHRyZWxheW91dDogdHJ1ZVxuXG5cblxuXG5cbmFwcC5zY3JvbGwgPSAtPlxuXG5cdGlmICFhcHAuaXNNb2JpbGUoKVxuXHRcdHNjcm9sbF9wcmV2ID0gMFxuXHRcdCQod2luZG93KS5zY3JvbGwgLT5cblxuXHRcdFx0IyBFc2NvbmRlciBoZWFkZXJcblx0XHRcdHNjcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKVxuXHRcdFx0aGVpZ2h0X3dpbmRvdyA9ICQod2luZG93KS5oZWlnaHQoKVxuXHRcdFx0aGVpZ2h0X2JvZHkgPSAkKFwiYm9keVwiKS5oZWlnaHQoKVxuXG5cdFx0XHRpZiBzY3JvbGwgPiA1MFxuXHRcdFx0XHQkKFwiaGVhZGVyXCIpLmFkZENsYXNzIFwiaGVhZGVyLWhpZGVcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHQkKFwiaGVhZGVyXCIpLnJlbW92ZUNsYXNzIFwiaGVhZGVyLWhpZGVcIlxuXG5cdFx0XHRpZiBzY3JvbGwgPiA3MFxuXHRcdFx0XHQkKFwiLnNpbmdsZS1mb250LWhlYWRlclwiKS5hZGRDbGFzcyhcImZpeGVkXCIpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCQoXCIuc2luZ2xlLWZvbnQtaGVhZGVyXCIpLnJlbW92ZUNsYXNzKFwiZml4ZWRcIilcblxuXG5cdFx0XHRzY3JvbGxfcHJldiA9IHNjcm9sbFxuXG5cblx0XHRcdCMgTW9zdHJhciBlbiBzY3JvbGxcblxuXHRcdFx0aWYgJChcIi5kaXNwbGF5c2Nyb2xsXCIpLmxlbmd0aFxuXHRcdFx0XHQkKFwiLmRpc3BsYXlzY3JvbGxcIikuZWFjaCAtPlxuXHRcdFx0XHRcdGVsZW1lbnQgPSAkKHRoaXMpXG5cdFx0XHRcdFx0ZWxlbWVudF90b3AgPSBlbGVtZW50Lm9mZnNldCgpLnRvcFxuXHRcdFx0XHRcdGVsZW1lbnRfaGVpZ2h0ID0gZWxlbWVudC5oZWlnaHQoKVxuXHRcdFx0XHRcdGlmIHNjcm9sbCArIGhlaWdodF93aW5kb3cgPiBlbGVtZW50X2hlaWdodCArIGVsZW1lbnRfdG9wXG5cdFx0XHRcdFx0XHRlbGVtZW50LmFkZENsYXNzIFwiaW5cIlxuXG5cblxuXG5hcHAuc2VjcmV0TWVudSA9XG5cblx0aW5pdDogLT5cblxuXHRcdCMgQ29tcGFyZSBVUkwgaW4gbWVudVxuXHRcdHVybCA9IGRvY3VtZW50LlVSTFxuXHRcdHVybF9zcGxpdCA9IHVybC5zcGxpdChcIi9cIilcblx0XHRuYW1lX3BhZ2UgPSB1cmxfc3BsaXRbdXJsX3NwbGl0Lmxlbmd0aC0xXVxuXHRcdG5hbWVfcGFnZV9zcGxpdCA9IG5hbWVfcGFnZS5zcGxpdChcIj9cIikgXG5cdFx0bmFtZV9wYWdlX2NsZWFyID0gbmFtZV9wYWdlX3NwbGl0WzBdXG5cdFx0bGkgPSAkKFwiLnNlY3JldG1lbnUtY29udGVudCBhW2hyZWY9J1wiK25hbWVfcGFnZV9jbGVhcitcIiddXCIpLnBhcmVudChcImxpXCIpXG5cdFx0bGkuYWRkQ2xhc3MgXCJjdXJyZW50LWl0ZW1cIlxuXHRcdGxpLnBhcmVudCgpLnBhcmVudChcImxpXCIpLmFkZENsYXNzIFwiY3VycmVudC1pdGVtXCJcblxuXHRcdCMgRGVza3RvcFxuXHRcdCQoXCIuc2VjcmV0bWVudS1jb250ZW50IHVsIGxpIGFcIikuZWFjaCAtPlxuXHRcdFx0aWYgJCh0aGlzKS5wYXJlbnQoKS5maW5kKFwidWxcIikubGVuZ3RoXG5cdFx0XHRcdGlmICEkKHRoaXMpLmhhc0NsYXNzKFwic2VjcmV0bWVudS1wYXJlbnRcIilcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwic2VjcmV0bWVudS1wYXJlbnRcIikucHJlcGVuZCgnPGkgY2xhc3M9XCJmYSBmYS1jaGV2cm9uLXJpZ2h0XCI+PC9pPicpXG5cdFx0XHRcdFx0JCh0aGlzKS5wYXJlbnQoKS5maW5kKFwidWxcIikucHJlcGVuZCAnPGxpPjxhIGhyZWY9XCIjXCIgY2xhc3M9XCJzZWNyZXRtZW51LWJhY2tcIj48aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tbGVmdFwiPjwvaT4gQXRyw6FzPC9hPjwvbGk+J1xuXG5cdFx0aWYgJChcIi5zZWNyZXRtZW51LWNvbnRlbnQgdWwgbGkuY3VycmVudC1pdGVtIGEuc2VjcmV0bWVudS1wYXJlbnRcIikubGVuZ3RoXG5cdFx0XHRhcHAuc2VjcmV0TWVudS5vcGVuTHZsRGVza3RvcCAkKFwiLnNlY3JldG1lbnUtY29udGVudCB1bCBsaS5jdXJyZW50LWl0ZW0gYS5zZWNyZXRtZW51LXBhcmVudFwiKVxuXG5cdFx0IyBNb2JpbGVcblxuXHRcdCQoXCIuc2VjcmV0bWVudS1idXR0b25cIikuY2xpY2sgLT5cblx0XHRcdGlmICEkKFwiYm9keVwiKS5oYXNDbGFzcyhcInNlY3JldG1lbnUtaW5cIilcblx0XHRcdFx0YXBwLnNlY3JldE1lbnUub3BlbiAkKFwiLnNlY3JldG1lbnUtY29udGVudFwiKS5odG1sKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0YXBwLnNlY3JldE1lbnUuY2xvc2UoKVxuXHRcdCQoXCIuc2VjcmV0bWVudS1jb250YWluZXItZnJvbnRcIikuY2xpY2sgLT5cblx0XHRcdGlmICQoXCJib2R5XCIpLmhhc0NsYXNzKFwic2VjcmV0bWVudS1pblwiKVxuXHRcdFx0XHRhcHAuc2VjcmV0TWVudS5jbG9zZSgpXG5cdFx0dHJ1ZVxuXG5cdG9wZW5MdmxEZXNrdG9wOiAoZWxlbWVudCkgLT5cblx0XHR1bCA9IGVsZW1lbnQucGFyZW50KCkuZmluZChcInVsXCIpXG5cdFx0dWwuYWRkQ2xhc3MoXCJpblwiKVxuXHRcdHVsLmZpbmQoXCJhLnNlY3JldG1lbnUtYmFja1wiKS51bmJpbmQoXCJjbGlja1wiKS5iaW5kIFwiY2xpY2tcIiwgLT5cblx0XHRcdHVsLmFkZENsYXNzKFwib3V0XCIpXG5cdFx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRcdHVsLnJlbW92ZUNsYXNzKFwiaW4gb3V0XCIpXG5cdFx0XHQsNzAwXG5cdFx0XHRmYWxzZVxuXG5cblx0b3BlbjogKGh0bWwsY2hpbGRyZW49ZmFsc2UsZGlyZWN0aW9uPVwibGVmdFwiKSAtPlxuXG5cdFx0bGVuZ3RoICAgID0gJChcIi5zZWNyZXRtZW51XCIpLmxlbmd0aCArIDFcblx0XHRjb250YWluZXIgPSAnPGRpdiBjbGFzcz1cInNlY3JldG1lbnUgc2VjcmV0bWVudS1sdmwtJysoJChcIi5zZWNyZXRtZW51XCIpLmxlbmd0aCArIDEpKydcIj48L2Rpdj4nXG5cdFx0ZGlyZWN0aW9uID0gXCJyaWdodFwiXG5cblx0XHRpZiAhY2hpbGRyZW5cblx0XHRcdCQoXCIuc2VjcmV0bWVudS1jb250YWluZXItYmFja1wiKS5odG1sKGNvbnRhaW5lcikgXG5cdFx0ZWxzZVxuXHRcdFx0JChcIi5zZWNyZXRtZW51LWNvbnRhaW5lci1iYWNrXCIpLmFwcGVuZChjb250YWluZXIpXG5cblx0XHQkKFwiLnNlY3JldG1lbnVcIikuZXEoLTEpLmh0bWwoJzxkaXYgY2xhc3M9XCJzZWNyZXRtZW51LWlubmVyXCI+JytodG1sKyc8L2Rpdj4nKVxuXG5cdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJzZWNyZXRtZW51LWluIHNlY3JldG1lbnUtXCIrZGlyZWN0aW9uKVxuXHRcdCQoXCJib2R5XCIpLmF0dHIoXCJkYXRhLXNlY3JldG1lbnUtbHZsXCIsbGVuZ3RoKVxuXG5cdFx0IyBTaSB0aWVuZSBoaWpvc1xuXHRcdCQoXCIuc2VjcmV0bWVudSB1bCBsaSBhXCIpLmVhY2ggLT5cblx0XHRcdGlmICQodGhpcykucGFyZW50KCkuZmluZChcInVsXCIpLmxlbmd0aFxuXHRcdFx0XHRpZiAhJCh0aGlzKS5oYXNDbGFzcyhcInNlY3JldG1lbnUtcGFyZW50XCIpXG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcInNlY3JldG1lbnUtcGFyZW50XCIpLnByZXBlbmQoJzxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi1yaWdodFwiPjwvaT4nKVxuXG5cdFx0IyBDbGljayBlbiBpdGVtIGRlIG1lbsO6XG5cdFx0JChcIi5zZWNyZXRtZW51IHVsIGxpIGEuc2VjcmV0bWVudS1wYXJlbnRcIikudW5iaW5kKFwiY2xpY2tcIikuYmluZCBcImNsaWNrXCIsIC0+XG5cdFx0XHRhcHAuc2VjcmV0TWVudS5vcGVuIFwiPHVsPlwiKyQodGhpcykucGFyZW50KCkuZmluZChcInVsXCIpLmh0bWwoKStcIjwvdWw+XCIsIHRydWVcblx0XHRcdGZhbHNlXG5cblx0XHQkKFwiLnNlY3JldG1lbnUgYS5zZWNyZXRtZW51LWJhY2tcIikudW5iaW5kKFwiY2xpY2tcIikuYmluZCBcImNsaWNrXCIsIC0+XG5cdFx0XHRsYXN0bWVudSA9IHBhcnNlSW50ICQoXCJib2R5XCIpLmF0dHIoXCJkYXRhLXNlY3JldG1lbnUtbHZsXCIpXG5cdFx0XHQkKFwiYm9keVwiKS5hdHRyKFwiZGF0YS1zZWNyZXRtZW51LWx2bFwiLChsYXN0bWVudS0xKSlcblx0XHRcdCQoXCIuc2VjcmV0bWVudS5zZWNyZXRtZW51LWx2bC1cIitsYXN0bWVudSkuYWRkQ2xhc3MoXCJvdXRcIilcblx0XHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdFx0JChcIi5zZWNyZXRtZW51LnNlY3JldG1lbnUtbHZsLVwiK2xhc3RtZW51KS5yZW1vdmUoKVxuXHRcdFx0LDcwMFxuXHRcdFx0ZmFsc2VcblxuXHRjbG9zZTogLT5cblxuXHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwic2VjcmV0bWVudS1vdXRcIilcblx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyBcInNlY3JldG1lbnUtaW4gc2VjcmV0bWVudS1vdXQgc2VjcmV0bWVudS1sZWZ0IHNlY3JldG1lbnUtcmlnaHQgc2VjcmV0bWVudS1sdmwtXCIrJChcImJvZHlcIikuYXR0cihcImRhdGEtc2VjcmV0bWVudS1sdmxcIilcblx0XHRcdCQoXCJib2R5XCIpLnJlbW92ZUF0dHIoXCJkYXRhLXNlY3JldG1lbnUtbHZsXCIpXG5cdFx0XHQkKFwiLnNlY3JldG1lbnVcIikucmVtb3ZlKClcblx0XHQsNzAwXG5cblxuXG5cblxuYXBwLnNoYXJlcyA9XG5cblx0aW5pdDogLT5cblx0XHQkKFwiLnNoYXJlXCIpLmNsaWNrIC0+XG5cdFx0XHRhcHAuc2hhcmVzLnNoYXJlICQodGhpcylcblxuXHRzaGFyZTogKGVsZW1lbnQpIC0+XG5cblx0XHRzaGFyZV91cmwgPSBlbmNvZGVVUklDb21wb25lbnQoZWxlbWVudC5hdHRyKFwiZGF0YS11cmxcIikpXG5cdFx0c2hhcmVfdGV4dCA9IGVuY29kZVVSSUNvbXBvbmVudChlbGVtZW50LmF0dHIoXCJkYXRhLXRleHRcIikpXG5cdFx0c2hhcmVfaW1nID0gZW5jb2RlVVJJQ29tcG9uZW50KGVsZW1lbnQuYXR0cihcImRhdGEtaW1nXCIpKVxuXG5cdFx0aWYoZWxlbWVudC5oYXNDbGFzcyhcInNoYXJlLWZhY2Vib29rXCIpKVxuXHRcdFx0YXBwLnNoYXJlcy5wb3B1cFdpbmRvdyBcImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIvc2hhcmVyLnBocD91PVwiK3NoYXJlX3VybCwgNTAwLCAzMTBcblxuXHRcdGlmKGVsZW1lbnQuaGFzQ2xhc3MoXCJzaGFyZS10d2l0dGVyXCIpKVxuXHRcdFx0YXBwLnNoYXJlcy5wb3B1cFdpbmRvdyBcImh0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3R3ZWV0P3NvdXJjZT13ZWJjbGllbnQmYW1wO3RleHQ9XCIrc2hhcmVfdGV4dCtcIiZhbXA7dXJsPVwiK3NoYXJlX3VybCwgNTAwLCAzMTBcblxuXHRcdGlmKGVsZW1lbnQuaGFzQ2xhc3MoXCJzaGFyZS1waW50ZXJlc3RcIikpXG5cdFx0XHRhcHAuc2hhcmVzLnBvcHVwV2luZG93IFwiaHR0cDovL3BpbnRlcmVzdC5jb20vcGluL2NyZWF0ZS9idXR0b24vP3VybD1cIitzaGFyZV91cmwrXCImbWVkaWE9XCIrc2hhcmVfaW1nK1wiJmRlc2NyaXB0aW9uPVwiK3NoYXJlX3RleHQsIDYyMCwgMzEwXG5cblx0XHRpZihlbGVtZW50Lmhhc0NsYXNzKFwic2hhcmUtZ29vZ2xlcGx1c1wiKSlcblx0XHRcdGFwcC5zaGFyZXMucG9wdXBXaW5kb3cgXCJodHRwczovL3BsdXMuZ29vZ2xlLmNvbS9zaGFyZT91cmw9XCIrc2hhcmVfdXJsLCA1MDAsIDMxMFxuXG5cdFx0aWYoZWxlbWVudC5oYXNDbGFzcyhcInNoYXJlLWxpbmtlZGluXCIpKVxuXHRcdFx0YXBwLnNoYXJlcy5wb3B1cFdpbmRvdyBcImh0dHA6Ly93d3cubGlua2VkaW4uY29tL3NoYXJlQXJ0aWNsZT9taW5pPXRydWUmdXJsPVwiK3NoYXJlX3VybCtcIiZ0aXRsZT1cIitzaGFyZV90ZXh0K1wiJnN1bW1hcnk9XCIrc2hhcmVfdGV4dCtcIiZzb3VyY2U9XCIrc2hhcmVfdXJsLCA1MDAsIDQyMFxuXG5cdFx0ZmFsc2VcblxuXHRwb3B1cFdpbmRvdzogKHVybCwgdywgaCkgLT5cblx0XHRsZWZ0ID0gKCAkKHdpbmRvdykud2lkdGgoKSAvIDIgKSAgLSAodyAvIDIpXG5cdFx0dG9wICA9ICggJCh3aW5kb3cpLmhlaWdodCgpIC8gMiApIC0gKGggLyAyKVxuXHRcdHJldHVybiB3aW5kb3cub3Blbih1cmwsIFwiQ29tcGFydGlyXCIsICd0b29sYmFyPW5vLCBsb2NhdGlvbj1ubywgZGlyZWN0b3JpZXM9bm8sIHN0YXR1cz1ubywgbWVudWJhcj1ubywgc2Nyb2xsYmFycz1ubywgcmVzaXphYmxlPW5vLCBjb3B5aGlzdG9yeT1ubywgd2lkdGg9Jyt3KycsIGhlaWdodD0nK2grJywgdG9wPScrdG9wKycsIGxlZnQ9JytsZWZ0KVxuXG5cblxuXG5hcHAudG9vbHRpcHMgPSAtPlxuXG5cdCQoXCJbZGF0YS10b29sdGlwXVwiKS5lYWNoIC0+XG5cdFx0cG9zID0gJCh0aGlzKS5hdHRyKFwiZGF0YS10b29sdGlwLXBvc2l0aW9uXCIpXG5cdFx0cG9zID0gXCJib3R0b21cIiBpZiAhcG9zXG5cdFx0JCh0aGlzKS5hZGRDbGFzcyBcInRvb2x0aXAtcGFyZW50XCJcblx0XHQkKHRoaXMpLmFwcGVuZCBcIjxzcGFuIGNsYXNzPSd0b29sdGlwIHRvb2x0aXAtXCIrcG9zK1wiJz48c3BhbiBjbGFzcz0ndG9vbHRpcC1jb250YWluZXInPjxzcGFuIGNsYXNzPSd0b29sdGlwLXRyaWFuZ2xlJz48L3NwYW4+PHNwYW4gY2xhc3M9J3Rvb2x0aXAtY29udGVudCc+XCIgKyAkKHRoaXMpLmF0dHIoXCJkYXRhLXRvb2x0aXBcIikgKyBcIjwvc3Bhbj48L3NwYW4+PC9zcGFuPlwiXG5cblxuXG5cblxuXG5hcHAudmFsaWRhdGlvbiA9XG5cblx0Zm9ybTogKGZvcm1zLGNhbGxiYWNrPWZhbHNlKSAtPlxuXG5cdFx0Zm9ybXMuZWFjaCAtPlxuXG5cdFx0XHRmb3JtID0gJCh0aGlzKVxuXG5cdFx0XHRmb3JtLmZpbmQoXCIuY29udHJvbCAuY29udHJvbC12YWx1ZVwiKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdjb250cm9sLW1lc3NhZ2UnPjwvZGl2PlwiKVxuXG5cdFx0XHRmb3JtLmZpbmQoXCJpbnB1dCx0ZXh0YXJlYSxzZWxlY3RcIikuZWFjaCAtPlxuXHRcdFx0XHRpbnB1dCA9ICQodGhpcylcdFx0XHRcdFxuXHRcdFx0XHRpbnB1dC5hZGRDbGFzcyggXCJpbnB1dC1cIiskKHRoaXMpLmF0dHIoXCJ0eXBlXCIpICkgaWYgJCh0aGlzKS5pcyBcImlucHV0XCJcblx0XHRcdFx0aW5wdXQuYWRkQ2xhc3MoIFwiZGlzYWJsZWRcIiApIGlmIGlucHV0LmlzKFwiOmRpc2FibGVkXCIpXG5cdFx0XHRcdGlucHV0LmxpdmUgXCJibHVyLCBjaGFuZ2VcIiwgLT5cblx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXQoaW5wdXQpXG5cblx0XHRcdGZvcm0uZmluZChcIi5pbnB1dC1jaGVja2JveCwgLmlucHV0LXJhZGlvXCIpLmVhY2ggLT5cblx0XHRcdFx0aWYgJCh0aGlzKS5pcyhcIjpjaGVja2VkXCIpXG5cdFx0XHRcdFx0JCh0aGlzKS5jbG9zZXN0KFwibGFiZWxcIikuYWRkQ2xhc3MoXCJjaGVja2VkXCIpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQkKHRoaXMpLmNsb3Nlc3QoXCJsYWJlbFwiKS5yZW1vdmVDbGFzcyhcImNoZWNrZWRcIilcblx0XHRcdFxuXHRcdFx0Zm9ybS5maW5kKFwiLmlucHV0LWNoZWNrYm94LCAuaW5wdXQtcmFkaW9cIikuY2hhbmdlIC0+XG5cdFx0XHRcdGZvcm0uZmluZChcIi5pbnB1dC1jaGVja2JveCwgLmlucHV0LXJhZGlvXCIpLmVhY2ggLT5cblx0XHRcdFx0XHRpZiAkKHRoaXMpLmlzKFwiOmNoZWNrZWRcIilcblx0XHRcdFx0XHRcdCQodGhpcykuY2xvc2VzdChcImxhYmVsXCIpLmFkZENsYXNzKFwiY2hlY2tlZFwiKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCQodGhpcykuY2xvc2VzdChcImxhYmVsXCIpLnJlbW92ZUNsYXNzKFwiY2hlY2tlZFwiKVxuXG5cblx0XHRcdGZvcm0uZmluZChcImlucHV0Lm51bWJlclwiKS5lYWNoIC0+XG5cdFx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJudW1iZXJcIikud3JhcChcIjxkaXYgY2xhc3M9J251bWJlcic+XCIpLmFmdGVyKFwiPGRpdiBjbGFzcz0nbnVtYmVyLWJ1dHRvbiBudW1iZXItbW9yZSc+KzwvZGl2PjxkaXYgY2xhc3M9J251bWJlci1idXR0b24gbnVtYmVyLWxlc3MnPi08L2Rpdj5cIilcblxuXHRcdFx0Zm9ybS5maW5kKFwiLm51bWJlciAubnVtYmVyLWJ1dHRvblwiKS5saXZlIFwiY2xpY2tcIiwgLT5cblxuXHRcdFx0XHRfaW5wdXQgPSAkKHRoaXMpLnBhcmVudCgpLmZpbmQoXCJpbnB1dFwiKVxuXG5cdFx0XHRcdF9tYXggPSBwYXJzZUludChfaW5wdXQuYXR0cihcImRhdGEtbWF4XCIpKVxuXHRcdFx0XHRfbWluID0gcGFyc2VJbnQoX2lucHV0LmF0dHIoXCJkYXRhLW1pblwiKSlcblx0XHRcdFx0X21pbiA9IDEgaWYgIV9taW5cblxuXHRcdFx0XHRfc3RlcHMgPSBwYXJzZUludChfaW5wdXQuYXR0cihcImRhdGEtc3RlcHNcIikpXG5cdFx0XHRcdF9zdGVwcyA9IDEgaWYgIV9zdGVwc1xuXG5cdFx0XHRcdF92YWwgPSBwYXJzZUludChfaW5wdXQudmFsKCkpXG5cdFx0XHRcdF92YWwgPSBfdmFsICsgX3N0ZXBzIGlmICQodGhpcykuaGFzQ2xhc3MgXCJudW1iZXItbW9yZVwiXG5cdFx0XHRcdF92YWwgPSBfdmFsIC0gX3N0ZXBzIGlmICQodGhpcykuaGFzQ2xhc3MgXCJudW1iZXItbGVzc1wiXG5cdFx0XHRcdF92YWwgPSBfbWF4IGlmIF92YWwgPj0gX21heFxuXHRcdFx0XHRfdmFsID0gX21pbiBpZiBfdmFsIDw9IF9taW5cblxuXHRcdFx0XHRfaW5wdXQudmFsKF92YWwpXG5cdFx0XHRcdFxuXHRcdFx0XHRmYWxzZVxuXG5cdFx0XHRmb3JtLmZpbmQoXCIubnVtYmVyIGlucHV0XCIpLmxpdmUgXCJibHVyXCIsIC0+XG5cblx0XHRcdFx0X2lucHV0ID0gJCh0aGlzKVxuXG5cdFx0XHRcdF9tYXggPSBwYXJzZUludChfaW5wdXQuYXR0cihcImRhdGEtbWF4XCIpKVxuXHRcdFx0XHRfbWluID0gcGFyc2VJbnQoX2lucHV0LmF0dHIoXCJkYXRhLW1pblwiKSlcblx0XHRcdFx0X21pbiA9IDEgaWYgIV9taW5cblxuXHRcdFx0XHRfdmFsID0gcGFyc2VJbnQoX2lucHV0LnZhbCgpKVxuXHRcdFx0XHRfdmFsID0gX21heCBpZiBfdmFsID49IF9tYXhcblx0XHRcdFx0X3ZhbCA9IF9taW4gaWYgX3ZhbCA8PSBfbWluXG5cblx0XHRcdFx0X2lucHV0LnZhbChfdmFsKVxuXG5cdFx0XHRcdHRydWVcblxuXG5cblx0XHRcdGZvcm0uc3VibWl0IC0+XG5cblx0XHRcdFx0c2VuZCA9IHRydWVcblx0XHRcdFx0Zm9ybSA9ICQodGhpcykgXG5cblx0XHRcdFx0Zm9ybS5maW5kKFwiaW5wdXQsdGV4dGFyZWEsc2VsZWN0XCIpLmVhY2ggLT5cblx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXQoJCh0aGlzKSx0cnVlKVxuXG5cdFx0XHRcdGRpdmVycm9yID0gZm9ybS5maW5kKFwiLmNvbnRyb2wtZXJyb3JcIikuZXEoMClcblxuXHRcdFx0XHRpZiBkaXZlcnJvci5sZW5ndGhcblxuXHRcdFx0XHRcdHNlbmQgPSBmYWxzZVxuXHRcdFx0XHRcdHRvcCA9IGRpdmVycm9yLm9mZnNldCgpLnRvcCAtICQoXCIuaGVhZGVyLXRvcFwiKS5oZWlnaHQoKSAtIDI1XG5cblx0XHRcdFx0XHQkKFwiaHRtbCxib2R5XCIpLmFuaW1hdGVcblx0XHRcdFx0XHRcdHNjcm9sbFRvcDogdG9wXG5cblx0XHRcdFx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRcdFx0XHRkaXZlcnJvci5maW5kKFwiaW5wdXRcIikuZXEoMCkuZm9jdXMoKVxuXHRcdFx0XHRcdCw1MDBcblxuXHRcdFx0XHRpZiBzZW5kID09IHRydWVcblx0XHRcdFx0XHRpZiBjYWxsYmFja1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2soKVxuXHRcdFx0XHRcdFx0c2VuZCA9IGZhbHNlXG5cblx0XHRcdFx0cmV0dXJuIHNlbmRcblxuXG5cdGZvcm1JbnB1dDogKGlucHV0LHZhbGlkYXRlRW1wdHk9ZmFsc2UpIC0+XG5cblx0XHRwYXJlbnQgPSBpbnB1dC5jbG9zZXN0KFwiLmNvbnRyb2wtdmFsdWVcIilcblxuXHRcdGNvbnRyb2xzID0gaW5wdXQuY2xvc2VzdChcIi5jb250cm9sc1wiKVxuXHRcdGNvbnRyb2wgID0gaW5wdXQuY2xvc2VzdChcIi5jb250cm9sXCIpXG5cblx0XHRmdkVycm9ycyA9IHtcblx0XHRcdFwiZW1wdHlcIjogXCJFc3RlIGNhbXBvIGVzIHJlcXVlcmlkb1wiLFxuXHRcdFx0XCJlbXB0eVNlbGVjdFwiOiBcIlNlbGVjY2lvbmEgdW5hIG9wY2nDs25cIixcblx0XHRcdFwiZW1wdHlSYWRpb1wiOiBcIlNlbGVjY2lvbmEgdW5hIG9wY2nDs25cIixcblx0XHRcdFwiZW1wdHlDaGVja2JveFwiOiBcIlNlbGVjY2lvbmEgYWwgbWVub3MgdW5hIG9wY2nDs25cIixcblx0XHRcdFwiaW52YWxpZEVtYWlsXCI6IFwiRW1haWwgaW52w6FsaWRvXCIsXG5cdFx0XHRcImludmFsaWRFbWFpbFJlcGVhdFwiOiBcIkVsIGVtYWlsIGluZ3Jlc2FkbyBubyBlcyBpZ3VhbCBhbCBhbnRlcmlvclwiXG5cdFx0XHRcImludmFsaWRQYXNzXCI6IFwiTGEgY29udHJhc2XDsWEgZGViZSBzZXIgbWF5b3IgYSA2IGNhcsOhY3RlcmVzXCJcblx0XHRcdFwiaW52YWxpZFBhc3NSZXBlYXRcIjogXCJMYSBjb250cmFzZcOxYSBubyBlcyBpZ3VhbCBhIGxhIGFudGVyaW9yXCJcblx0XHRcdFwiaW52YWxpZFJ1dFwiOiBcIlJVVCBpbnbDoWxpZG9cIixcblx0XHRcdFwidGVybXNcIjogXCJEZWJlcyBhY2VwdGFyIGxvcyB0w6lybWlub3MgbGVnYWxlc1wiLFxuXHRcdH1cblxuXG5cdFx0aWYgIWlucHV0Lmhhc0NsYXNzKFwib3B0aW9uYWxcIikgJiYgaW5wdXQuYXR0cihcInR5cGVcIikhPVwic3VibWl0XCIgJiYgaW5wdXQuYXR0cihcInR5cGVcIikhPVwiaGlkZGVuXCIgJiYgaW5wdXQuYXR0cihcIm5hbWVcIilcblxuXHRcdFx0ZXJyb3IgPSBmYWxzZVxuXHRcdFx0XG5cdFx0XHRpZiAhaW5wdXQudmFsKClcblxuXHRcdFx0XHQjIFZhbGlkYXIgc2kgZWwgY2FtcG8gc2UgbGxlbmEgKG9wY2lvbmFsKVxuXHRcdFx0XHRpZiB2YWxpZGF0ZUVtcHR5ID09IHRydWVcblx0XHRcdFx0XHRpZiBpbnB1dC5pcyhcInNlbGVjdFwiKVxuXHRcdFx0XHRcdFx0YXBwLnZhbGlkYXRpb24uZm9ybUlucHV0TWVzc2FnZShpbnB1dCxmdkVycm9ycy5lbXB0eVNlbGVjdClcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXRNZXNzYWdlKGlucHV0LGZ2RXJyb3JzLmVtcHR5KVxuXHRcdFx0ZWxzZVxuXG5cdFx0XHRcdCMgVmFsaWRhciBlbWFpbFxuXHRcdFx0XHRpZiBpbnB1dC5pcyhcIlt0eXBlPSdlbWFpbCddXCIpXG5cdFx0XHRcdFx0aWYgISBhcHAudmFsaWRhdGlvbi5lbWFpbCggaW5wdXQsIGlucHV0LnZhbCgpICkgXG5cdFx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXRNZXNzYWdlKGlucHV0LGZ2RXJyb3JzLmludmFsaWRFbWFpbClcblx0XHRcdFx0XHRcdGVycm9yID0gdHJ1ZVxuXG5cblx0XHRcdFx0IyBWYWxpZGFyIGNvbnRyYXNlw7FhXG5cdFx0XHRcdGlmIGlucHV0LmlzKFwiW3R5cGU9J3Bhc3N3b3JkJ11cIilcblx0XHRcdFx0XHRpZiBpbnB1dC52YWwoKS5sZW5ndGggPCA2XG5cdFx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXRNZXNzYWdlKGlucHV0LGZ2RXJyb3JzLmludmFsaWRQYXNzKVxuXHRcdFx0XHRcdFx0ZXJyb3IgPSB0cnVlXG5cblxuXHRcdFx0XHQjIFZhbGlkYXIgcmVwZXRpciBjb250cmFzZcOxYVxuXHRcdFx0XHRpZiBpbnB1dC5pcyhcIltkYXRhLXJlcGVhdF1cIilcblx0XHRcdFx0XHRpZiBpbnB1dC52YWwoKSAhPSBjb250cm9scy5maW5kKFwiW25hbWU9J1wiK2lucHV0LmF0dHIoXCJkYXRhLXJlcGVhdFwiKStcIiddXCIpLnZhbCgpXG5cdFx0XHRcdFx0XHRpZiBpbnB1dC5pcyhcIlt0eXBlPSdwYXNzd29yZCddXCIpXG5cdFx0XHRcdFx0XHRcdGFwcC52YWxpZGF0aW9uLmZvcm1JbnB1dE1lc3NhZ2UoaW5wdXQsZnZFcnJvcnMuaW52YWxpZFBhc3NSZXBlYXQpXG5cdFx0XHRcdFx0XHRcdGVycm9yID0gdHJ1ZVxuXHRcdFx0XHRcdFx0aWYgaW5wdXQuaXMoXCJbdHlwZT0nZW1haWwnXVwiKVxuXHRcdFx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXRNZXNzYWdlKGlucHV0LGZ2RXJyb3JzLmludmFsaWRFbWFpbFJlcGVhdClcblx0XHRcdFx0XHRcdFx0ZXJyb3IgPSB0cnVlXG5cblxuXHRcdFx0XHQjIFZhbGlkYXIgY2hlY2tib3hzL3JhZGlvc1xuXHRcdFx0XHRpZiAoaW5wdXQuaXMoXCJbdHlwZT0nY2hlY2tib3gnXVwiKSB8fCBpbnB1dC5pcyhcIlt0eXBlPSdyYWRpbyddXCIpKVxuXHRcdFx0XHRcdGlmICFjb250cm9scy5maW5kKFwiaW5wdXRbbmFtZT0nXCIraW5wdXQuYXR0cihcIm5hbWVcIikrXCInXTpjaGVja2VkXCIpLmxlbmd0aFxuXHRcdFx0XHRcdFx0YXBwLnZhbGlkYXRpb24uZm9ybUlucHV0TWVzc2FnZShpbnB1dCxmdkVycm9ycy5lbXB0eUNoZWNrYm94KSBpZiBpbnB1dC5pcyhcIlt0eXBlPSdjaGVja2JveCddXCIpXG5cdFx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXRNZXNzYWdlKGlucHV0LGZ2RXJyb3JzLmVtcHR5UmFkaW8pICAgIGlmIGlucHV0LmlzKFwiW3R5cGU9J3JhZGlvJ11cIilcblx0XHRcdFx0XHRcdGFwcC52YWxpZGF0aW9uLmZvcm1JbnB1dE1lc3NhZ2UoaW5wdXQsZnZFcnJvcnMudGVybXMpICAgICAgICAgaWYgaW5wdXQuaXMoXCIuaW5wdXQtdGVybXNcIilcblx0XHRcdFx0XHRcdGVycm9yID0gdHJ1ZVxuXHRcdFx0XHRcdFx0cGFyZW50LmZpbmQoXCIuY29udHJvbC1lcnJvclwiKS5yZW1vdmVDbGFzcyhcImVycm9yXCIpXG5cblxuXHRcdFx0XHQjIFZhbGlkYXIgUlVUXG5cdFx0XHRcdGlmIGlucHV0LmlzKFwiLnJ1dFwiKVxuXHRcdFx0XHRcdGlucHV0LnZhbCggJC5SdXQuZm9ybWF0ZWFyKCQuUnV0LnF1aXRhckZvcm1hdG8oaW5wdXQudmFsKCkpLCQuUnV0LmdldERpZ2l0bygkLlJ1dC5xdWl0YXJGb3JtYXRvKGlucHV0LnZhbCgpKSkpIClcblx0XHRcdFx0XHRpZiAhJC5SdXQudmFsaWRhcihpbnB1dC52YWwoKSlcblx0XHRcdFx0XHRcdGFwcC52YWxpZGF0aW9uLmZvcm1JbnB1dE1lc3NhZ2UoaW5wdXQsZnZFcnJvcnMuaW52YWxpZFJ1dClcblx0XHRcdFx0XHRcdGVycm9yID0gdHJ1ZVxuXG5cdFx0XHRcdCMgU2kgbm8gaGF5IGVycm9yZXMsIHNlIHF1aXRhIGVsIG1lbnNhamUgZGUgZXJyb3Jcblx0XHRcdFx0aWYgZXJyb3IgPT0gZmFsc2Vcblx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXRNZXNzYWdlKGlucHV0LGZhbHNlKVxuXG5cblxuXHRmb3JtSW5wdXRNZXNzYWdlOiAoaW5wdXQsbWVzc2FnZSkgLT5cblx0XHRpZiBtZXNzYWdlXG5cdFx0XHRpbnB1dC5hZGRDbGFzcyhcImNvbnRyb2wtZXJyb3JcIilcblx0XHRcdHBhcmVudCA9IGlucHV0LmNsb3Nlc3QoXCIuY29udHJvbC12YWx1ZVwiKVxuXHRcdFx0cGFyZW50LmFkZENsYXNzKFwiY29udHJvbC1lcnJvclwiKVxuXHRcdFx0cGFyZW50LmZpbmQoXCIuY29udHJvbC1tZXNzYWdlXCIpLnRleHQobWVzc2FnZSkuYWRkQ2xhc3MoXCJpblwiKVxuXHRcdGVsc2Vcblx0XHRcdGlucHV0LnJlbW92ZUNsYXNzKFwiY29udHJvbC1lcnJvclwiKVxuXHRcdFx0cGFyZW50ID0gaW5wdXQuY2xvc2VzdChcIi5jb250cm9sLXZhbHVlXCIpXG5cdFx0XHRwYXJlbnQucmVtb3ZlQ2xhc3MoXCJjb250cm9sLWVycm9yXCIpXHRcblx0XHRcdHBhcmVudC5maW5kKFwiLmNvbnRyb2wtbWVzc2FnZVwiKS5hZGRDbGFzcyhcIm91dFwiKVxuXHRcdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0XHRwYXJlbnQuZmluZChcIi5jb250cm9sLW1lc3NhZ2VcIikucmVtb3ZlQ2xhc3MoXCJpbiBvdXRcIikudGV4dChcIlwiKVxuXHRcdFx0LDUwMFxuXG5cblxuXHRlbWFpbDogKGVsZW1lbnRvLHZhbG9yKSAtPlxuXHRcdGlmIC9eKChbXjw+KClbXFxdXFxcXC4sOzpcXHNAXFxcIl0rKFxcLltePD4oKVtcXF1cXFxcLiw7Olxcc0BcXFwiXSspKil8KFxcXCIuK1xcXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXF0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvLnRlc3QodmFsb3IpXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBmYWxzZVxuXG5cblxuXG5cbiJdfQ==