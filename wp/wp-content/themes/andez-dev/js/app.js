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
      if (!$("head").find('link[data-font-id="' + font_id + '"]').length) {
        return $("head").append('<link href="' + $("body").attr("data-url") + '/wp-content/fonts/' + font_id + '/font.css" rel="stylesheet" type="text/css" data-font="' + font_id + '" />');
      }
    },
    loadFont: function(fontdiv, callback) {
      var font, font_id;
      if (callback == null) {
        callback = false;
      }
      font = fontdiv.attr("data-font");
      font_id = fontdiv.attr("data-font-id");
      app.fonts.add(font, font_id);
      fontdiv.css({
        "font-family": font
      });
      fontdiv.find("div,input").css({
        "font-family": font
      });
      return app.fonts.checkFont(fontdiv, font);
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

          /*
          
          				$(".single-font-header").load url+" .single-font-header>", ->
          					$(".single-font-header").removeClass "animation-right-out"
          					$(".single-font-header").removeClass "animation-left-out" 
          					$(".single-font-header").addClass "animation-"+dir
          
          					newfont = $("h1").attr("data-font")
          					newfont_id = $("h1").attr("data-font-id")
          
          					if newfont_id
          
          						$(".test-font").attr "data-font", newfont
          						$(".test-font-h1, .test-font-p").css
          							"font-family": newfont
          
          						$(".test-font").removeClass("out").addClass "in"
          
          						app.fonts.add newfont, newfont_id
          						app.fonts.tools.textareaheight()
          						setTimeout ->
          							app.fonts.tools.textareaheight()
          						,1000
          
          						app.fonts.nav.init()
          						app.actions.init()
           */
        }, 500);
      }
    },
    presentation: function() {
      var texts_default;
      texts_default = ["Lorem ipsum dolor sit amet", "Repellendus, inventore, nemo.", "423-89(08)*2+83591", "Doloremque placeat cupiditate", "Amet quod sint adipisci.", "$%&*=?{+", "Itaque nihil officiis.", "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"];
      $(".hola-bg").each(function() {
        var div, font, i, rand, rand_size, rand_top, text, texts, _i, _len;
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
        font = div.attr("data-font");
        app.fonts.add(font);
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

//# sourceMappingURL=data:application/json;base64,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cmNlc0NvbnRlbnQiOlsiXG4kKGRvY3VtZW50KS5yZWFkeSAtPlxuXHRhcHAuaW5pdCgpXG5cbmFwcCA9XG5cblx0aW5pdDogLT5cblxuXHRcdCMgQnJvd3NlcnNcblx0XHQjYXBwLmJyb3dzZXJzKClcblxuXHRcdCMgTWVuw7pcblx0XHRhcHAuc2VjcmV0TWVudS5pbml0KClcblxuXHRcdCMgU2hhcmVzXG5cdFx0YXBwLnNoYXJlcy5pbml0KClcblxuXHRcdCMgVG9vbHRpcHNcblx0XHRhcHAudG9vbHRpcHMoKVxuXG5cdFx0IyBBbGVydGFzXG5cdFx0YXBwLmFsZXJ0LmluaXQoKVxuXG5cdFx0IyBWYWxpZGFjacOzbiBkZSBmb3JtdWxhcmlvc1xuXHRcdGFwcC52YWxpZGF0aW9uLmZvcm0gJChcImZvcm0uY29udHJvbHNcIilcblxuXHRcdCMgTG9hZGluZ1xuXHRcdGFwcC5sb2FkaW5nLmluaXQoKVxuXG5cdFx0IyBFdmVudG9zIGVuIHNjcm9sbFxuXHRcdGFwcC5zY3JvbGwoKVxuXG5cdFx0IyBQbHVnaW5zXG5cdFx0YXBwLnBsdWdpbnMuaW5pdCgpXG5cblx0XHQjIEFjdGlvbnNcblx0XHRhcHAuYWN0aW9ucy5pbml0KClcblxuXHRcdCMgRm9udHNcblx0XHRhcHAuZm9udHMuaW5pdCgpXG5cbiM9aW5jbHVkZV90cmVlIGFwcFxuXG5cbmFwcC5hY3Rpb25zID1cblxuXHRpbml0OiAtPlxuXG5cdFx0JChcIltkYXRhLWdvdG9dXCIpLmNsaWNrIC0+XG5cdFx0XHRnb3RvID0gJCh0aGlzKS5hdHRyKFwiZGF0YS1nb3RvXCIpXG5cdFx0XHR0byAgID0gJChnb3RvKS5vZmZzZXQoKS50b3AgLSAkKFwiaGVhZGVyXCIpLmhlaWdodCgpXG5cdFx0XHRcblx0XHRcdGlmIGdvdG8gPT0gXCIjdGVzdC1mb250LWNvbnRhaW5lclwiXG5cdFx0XHRcdHRvID0gdG8gKyAxMlxuXHRcdFx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRcdFx0JChcIi50ZXN0LWZvbnQtaDEubGl2ZVwiKS5mb2N1cygpXG5cdFx0XHRcdCw1MDBcblxuXHRcdFx0JChcImh0bWwsYm9keSwuc2VjcmV0bWVudS1jb250YWluZXItZnJvbnRcIikuYW5pbWF0ZVxuXHRcdFx0XHRzY3JvbGxUb3A6IHRvXG5cblx0XHRcdGZhbHNlXG5cblxuXG5cbmFwcC5hbGVydCA9XG5cblx0aW5pdDogLT5cblx0XHRhcHAuYWxlcnQuZXF1aWRpc3QoKVxuXHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdGFwcC5hbGVydC5lcXVpZGlzdCgpXG5cdFx0LDEwMFxuXHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdGFwcC5hbGVydC5lcXVpZGlzdCgpXG5cdFx0LDEwMDBcblx0XHQkKHdpbmRvdykucmVzaXplIC0+XG5cdFx0XHRhcHAuYWxlcnQuZXF1aWRpc3QoKVxuXG5cblx0XHRpZiAkKFwiW2RhdGEtYWxlcnRdXCIpLmxlbmd0aFxuXG5cdFx0XHQkKFwiYVtkYXRhLWFsZXJ0XVwiKS5saXZlIFwiY2xpY2tcIiwgLT5cblx0XHRcdFx0ZWxlbWVudCA9ICQodGhpcylcblx0XHRcdFx0YXBwLmFsZXJ0Lm9wZW5cblx0XHRcdFx0XHR0aXRsZTogZWxlbWVudC5hdHRyKFwiZGF0YS10aXRsZVwiKVxuXHRcdFx0XHRcdGNvbnRlbnQ6IGVsZW1lbnQuYXR0cihcImRhdGEtY29udGVudFwiKVxuXHRcdFx0XHRcdGFjY2VwdDogdHJ1ZVxuXHRcdFx0XHRcdGNhbmNlbDogdHJ1ZVxuXHRcdFx0XHRcdGNhbGxiYWNrX3RydWU6IC0+XG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5ocmVmID0gZWxlbWVudC5hdHRyKFwiaHJlZlwiKVxuXHRcdFx0XHRmYWxzZVxuXG5cdFx0XHQkKFwiW2RhdGEtYWxlcnRdXCIpLmVhY2ggLT5cblx0XHRcdFx0ZWxlbWVudCA9ICQodGhpcylcblx0XHRcdFx0aWYgIWVsZW1lbnQuaXMoXCJhXCIpICYmICFlbGVtZW50LmlzKFwiYnV0dG9uXCIpXG5cdFx0XHRcdFx0YXBwLmFsZXJ0Lm9wZW5cblx0XHRcdFx0XHRcdHRpdGxlOiBlbGVtZW50LmF0dHIoXCJkYXRhLXRpdGxlXCIpXG5cdFx0XHRcdFx0XHRjb250ZW50OiBlbGVtZW50LmF0dHIoXCJkYXRhLWNvbnRlbnRcIilcblx0XHRcdFx0XHRcdGFjY2VwdDogdHJ1ZVxuXHRcdFx0XHRcdFx0Y2FuY2VsOiB0cnVlXG5cblxuXHRvcGVuOiAob3B0aW9ucykgLT5cblxuXHRcdHRpdGxlID0gXCJcIlxuXHRcdGNvbnRlbnQgPSBcIlwiXG5cdFx0YnV0dG9ucyA9IFwiXCJcblx0XHRjbG9zZSA9IFwiXCJcblxuXHRcdGlmIG9wdGlvbnMuc3RhdGljID09IHRydWVcblx0XHRcdGFsZXJ0bGlnaHRjbGFzcyAgICA9ICcnXG5cdFx0XHRvcHRpb25zLmNsb3NlID0gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHRhbGVydGxpZ2h0Y2xhc3MgPSAnIGZhbHNlJ1xuXG5cdFx0aWYgb3B0aW9ucy5hbGVydGNsYXNzXG5cdFx0XHRhbGVydGNsYXNzID0gXCJhbGVydC1cIiArIG9wdGlvbnMuYWxlcnRjbGFzc1xuXHRcdGVsc2Vcblx0XHRcdGFsZXJ0Y2xhc3MgPSBcImFsZXJ0LWRlZmF1bHRcIlxuXG5cdFx0aWYgb3B0aW9ucy50aXRsZVxuXHRcdFx0dGl0bGUgPSBcIjxoMiBjbGFzcz0nYWxlcnQtdGl0bGUnPlwiICsgb3B0aW9ucy50aXRsZSArIFwiPC9oMj5cIlxuXG5cdFx0aWYgb3B0aW9ucy5jb250ZW50XG5cdFx0XHRjb250ZW50ID0gXCI8ZGl2IGNsYXNzPSdhbGVydC1jb250ZW50Jz5cIiArIG9wdGlvbnMuY29udGVudCArIFwiPC9kaXY+XCJcblxuXHRcdGlmIG9wdGlvbnMuY2xvc2UgPT0gdW5kZWZpbmVkXG5cdFx0XHRvcHRpb25zLmNsb3NlID0gdHJ1ZVxuXG5cdFx0aWYgb3B0aW9ucy5jbG9zZSA9PSB0cnVlXG5cdFx0XHRjbG9zZSA9ICc8YnV0dG9uIGNsYXNzPVwiYWxlcnQtY2xvc2UgZmFsc2VcIj48aSBjbGFzcz1cImZhIGZhLXRpbWVzXCI+PC9pPjwvYnV0dG9uPidcblxuXHRcdGlmIG9wdGlvbnMuYnV0dG9uc1xuXHRcdFx0YnV0dG9ucyArPSBvcHRpb25zLmJ1dHRvbnMgKyBcIiBcIlxuXG5cdFx0aWYgb3B0aW9ucy5jYW5jZWwgPT0gdHJ1ZVxuXHRcdFx0YnV0dG9ucyArPSAnPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBmYWxzZVwiPkNhbmNlbGFyPC9idXR0b24+ICdcblxuXHRcdGlmIG9wdGlvbnMuYWNjZXB0ID09IHRydWVcblx0XHRcdGJ1dHRvbnMgKz0gJzxidXR0b24gY2xhc3M9XCJidXR0b24gYnV0dG9uLXByaW1hcnkgdHJ1ZVwiPkFjZXB0YXI8L2J1dHRvbj4gJ1xuXG5cdFx0aWYgYnV0dG9uc1xuXHRcdFx0YnV0dG9ucyA9ICc8ZGl2IGNsYXNzPVwiYWxlcnQtYnV0dG9uc1wiPicrYnV0dG9ucysnPC9kaXY+J1xuXG5cblx0XHRodG1sID1cblx0XHRcdCc8ZGl2IGNsYXNzPVwiYWxlcnQgJythbGVydGNsYXNzKycgaW5cIj4nK1xuXHRcdFx0XHQnPGRpdiBjbGFzcz1cImFsZXJ0LWxpZ2h0ICcrYWxlcnRsaWdodGNsYXNzKydcIj48L2Rpdj4nK1xuXHRcdFx0XHQnPGRpdiBjbGFzcz1cImFsZXJ0LWJveCBlcXVpZGlzdFwiPicrXG5cdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJhbGVydC1pbm5lclwiPicrXG5cdFx0XHRcdFx0XHRjbG9zZSArXG5cdFx0XHRcdFx0XHR0aXRsZSArXG5cdFx0XHRcdFx0XHRjb250ZW50ICtcblx0XHRcdFx0XHRcdGJ1dHRvbnMgK1xuXHRcdFx0XHRcdCc8L2Rpdj4nK1xuXHRcdFx0XHQnPC9kaXY+Jytcblx0XHRcdCc8L2Rpdj4nXG5cblxuXHRcdCQoXCJib2R5XCIpLmFwcGVuZChodG1sKVxuXHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiYWxlcnQtaW5cIilcblxuXHRcdGFwcC5hbGVydC5lcXVpZGlzdCgpXG5cblxuXHRcdCQoXCIuYWxlcnQgLnRydWUsIC5hbGVydCAuZmFsc2VcIikudW5iaW5kKFwiY2xpY2tcIikuYmluZCBcImNsaWNrXCIsIC0+IFxuXG5cdFx0XHRhbGVydG9yaWdpbiA9ICQodGhpcykuY2xvc2VzdChcIi5hbGVydFwiKVxuXG5cdFx0XHRhbGVydG9yaWdpbi5hZGRDbGFzcyhcIm91dFwiKVxuXHRcdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0XHRhbGVydG9yaWdpbi5yZW1vdmUoKVxuXHRcdFx0XHQjYWxlcnRvcmlnaW4ucmVtb3ZlQ2xhc3MoXCJpbiBvdXRcIilcblx0XHRcdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJhbGVydC1pblwiKVxuXHRcdFx0LDIwMFxuXG5cdFx0XHRpZiAkKHRoaXMpLmhhc0NsYXNzKFwidHJ1ZVwiKSAmJiBvcHRpb25zLmNhbGxiYWNrX3RydWVcblx0XHRcdFx0b3B0aW9ucy5jYWxsYmFja190cnVlKClcblxuXHRcdFx0aWYgJCh0aGlzKS5oYXNDbGFzcyhcImZhbHNlXCIpICYmIG9wdGlvbnMuY2FsbGJhY2tfZmFsc2Vcblx0XHRcdFx0b3B0aW9ucy5jYWxsYmFja19mYWxzZSgpXG5cblx0XHRcdHJldHVybiB0cnVlXG5cblx0Y2xvc2VhbGw6IC0+XG5cdFx0JChcIi5hbGVydFwiKS5hZGRDbGFzcyhcIm91dFwiKVxuXHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiYWxlcnQtaW5cIilcblxuXHRyZW1vdmVhbGw6IC0+XG5cdFx0JChcIi5hbGVydFwiKS5hZGRDbGFzcyhcIm91dFwiKVxuXHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdCQoXCIuYWxlcnRcIikucmVtb3ZlKClcblx0XHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiYWxlcnQtaW5cIilcblx0XHQsMjAwXG5cblx0ZXF1aWRpc3Q6IC0+XG5cdFx0JChcIi5lcXVpZGlzdFwiKS5lYWNoIC0+XG5cdFx0XHRfdGhpcyA9ICQodGhpcylcblx0XHRcdF9sZWZ0ID0gKF90aGlzLnBhcmVudCgpLndpZHRoKCkgLSBfdGhpcy53aWR0aCgpKSAvIDJcblx0XHRcdF9sZWZ0ID0gMCBpZiBfbGVmdCA8IDBcblx0XHRcdF90b3AgPSAoX3RoaXMucGFyZW50KCkuaGVpZ2h0KCkgLSBfdGhpcy5oZWlnaHQoKSkgLyAyXG5cdFx0XHRfdG9wID0gMCBpZiBfdG9wIDwgMFxuXHRcdFx0X3RoaXMuY3NzXG5cdFx0XHQgIGxlZnQ6IF9sZWZ0ICsgXCJweFwiXG5cdFx0XHQgIHRvcDogX3RvcCArIFwicHhcIlxuXG5cdGxvYWQ6IChocmVmLGNzc2NsYXNzPVwiZGVmYXVsdFwiLGNhbGxiYWNrPWZhbHNlKSAtPlxuXHRcdCQuYWpheChcblx0XHRcdHVybDogaHJlZlxuXHRcdFx0dHlwZTogJ0dFVCdcblx0XHQpLmRvbmUgKHJlc3VsdCkgLT5cblx0XHRcdGFwcC5hbGVydC5vcGVuXG5cdFx0XHRcdGNvbnRlbnQ6IHJlc3VsdFxuXHRcdFx0XHRhbGVydGNsYXNzOiBjc3NjbGFzc1xuXHRcdFx0aWYgY2FsbGJhY2tcblx0XHRcdFx0Y2FsbGJhY2soKVxuXHRcdFx0I2FwcC5wbHVnaW5zLnJlbGF5b3V0KClcblxuXG5cblxuYXBwLmlzTW9iaWxlID0gLT5cblx0aWYgL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpXG5cdFx0dHJ1ZVxuXHRlbHNlXG5cdFx0ZmFsc2VcblxuYXBwLmJyb3dzZXJzID0gLT5cblxuXHQjIE1vYmlsZVxuXHRpZiBhcHAuaXNNb2JpbGUoKVxuXHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiaXMtbW9iaWxlXCIpXG5cblx0IyBJRVxuXHRpZiAkLmJyb3dzZXIubXNpZSB8fCBuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKCdUcmlkZW50LycpIT0tMVxuXHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiaXMtaWVcIilcblx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcImlzLWllXCIrJC5icm93c2VyLnZlcnNpb24pXG5cdFx0aWYgcGFyc2VJbnQoJC5icm93c2VyLnZlcnNpb24pIDw9IDdcblx0XHRcdGFwcC5hbGVydC5vcGVuXG5cdFx0XHRcdHRpdGxlOiBcIkVzdMOhcyB1c2FuZG8gdW4gbmF2ZWdhZG9yIG11eSBhbnRpZ3VvXCJcblx0XHRcdFx0Y29udGVudDogXCJBY3R1YWxpemEgdHUgbmF2ZWdhZG9yIGFob3JhIHkgZGlzZnJ1dGEgZGUgdW5hIG1lam9yIGV4cGVyaWVuY2lhIGVuIEZhbGFiZWxsYSBOb3Zpb3MuXCJcblx0XHRcdFx0YnV0dG9uczogXCI8YSBocmVmPSdodHRwOi8vYnJvd3NlaGFwcHkuY29tLz9sb2NhbGU9ZXMnIHRhcmdldD0nX2JsYW5rJyBjbGFzcz0nYnV0dG9uIGJ1dHRvbi1wcmltYXJ5IGJ1dHRvbi1iaWcnPkFjdHVhbGl6YXIgYWhvcmE8L2E+XCJcblx0XHRcdFx0c3RhdGljOiB0cnVlXG5cblxuXG5hcHAuY29va2llID0gXG5cblx0Y3JlYXRlOiAobmFtZSwgdmFsdWUsIGRheXMpIC0+XG5cdFx0aWYgZGF5c1xuXHRcdFx0ZGF0ZSA9IG5ldyBEYXRlKClcblx0XHRcdGRhdGUuc2V0VGltZSBkYXRlLmdldFRpbWUoKSArIChkYXlzICogMjQgKiA2MCAqIDYwICogMTAwMClcblx0XHRcdGV4cGlyZXMgPSBcIjsgZXhwaXJlcz1cIiArIGRhdGUudG9HTVRTdHJpbmcoKVxuXHRcdGVsc2Vcblx0XHRcdGV4cGlyZXMgPSBcIlwiXG5cdFx0ZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgdmFsdWUgKyBleHBpcmVzICsgXCI7IHBhdGg9L1wiXG5cblx0cmVhZDogKG5hbWUpIC0+XG5cdFx0bmFtZUVRID0gbmFtZSArIFwiPVwiXG5cdFx0Y2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoXCI7XCIpXG5cdFx0aSA9IDBcblxuXHRcdHdoaWxlIGkgPCBjYS5sZW5ndGhcblx0XHRcdGMgPSBjYVtpXVxuXHRcdFx0YyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKSAgd2hpbGUgYy5jaGFyQXQoMCkgaXMgXCIgXCJcblx0XHRcdHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLCBjLmxlbmd0aCkgIGlmIGMuaW5kZXhPZihuYW1lRVEpIGlzIDBcblx0XHRcdGkrK1xuXHRcdG51bGxcblxuXHRkZWxldGU6IChuYW1lKSAtPlxuXHRcdGFwcC5jb29raWUuY3JlYXRlIG5hbWUsIFwiXCIsIC0xXG5cblxuXG5cbmNoZWNrd2lkdGhfcHJldiA9IGZhbHNlXG5cblxuYXBwLmZvbnRzID1cblxuXHRpbml0OiAtPlxuXG5cdFx0YXBwLmZvbnRzLnRvb2xzLmluaXQoKVxuXHRcdGFwcC5mb250cy5wcmVzZW50YXRpb24oKVxuXHRcdGFwcC5mb250cy5uYXYuaW5pdCgpXG5cblx0XHRhcHAuZm9udHMuaW5zdHJ1Y3Rpb25zLmluaXQoKVxuXG5cblx0YWRkOiAoZm9udCxmb250X2lkKSAtPlxuXG5cdFx0aWYgISQoXCJoZWFkXCIpLmZpbmQoJ2xpbmtbZGF0YS1mb250LWlkPVwiJytmb250X2lkKydcIl0nKS5sZW5ndGhcblx0XHRcdCQoXCJoZWFkXCIpLmFwcGVuZCAnPGxpbmsgaHJlZj1cIicrJChcImJvZHlcIikuYXR0cihcImRhdGEtdXJsXCIpKycvd3AtY29udGVudC9mb250cy8nK2ZvbnRfaWQrJy9mb250LmNzc1wiIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBkYXRhLWZvbnQ9XCInK2ZvbnRfaWQrJ1wiIC8+J1xuXG5cblx0bG9hZEZvbnQ6IChmb250ZGl2LGNhbGxiYWNrPWZhbHNlKSAtPlxuXHRcdGZvbnQgICAgPSBmb250ZGl2LmF0dHIoXCJkYXRhLWZvbnRcIilcblx0XHRmb250X2lkICAgID0gZm9udGRpdi5hdHRyKFwiZGF0YS1mb250LWlkXCIpXG5cdFx0YXBwLmZvbnRzLmFkZCBmb250LCBmb250X2lkXG5cdFx0Zm9udGRpdi5jc3Ncblx0XHRcdFwiZm9udC1mYW1pbHlcIjogZm9udFxuXHRcdGZvbnRkaXYuZmluZChcImRpdixpbnB1dFwiKS5jc3Ncblx0XHRcdFwiZm9udC1mYW1pbHlcIjogZm9udFxuXHRcdCNjb25zb2xlLmxvZyBcIi0tLSBGdWVudGUgcHVlc3RhXCJcblx0XHRhcHAuZm9udHMuY2hlY2tGb250KGZvbnRkaXYsZm9udClcblxuXG5cdHNlYXJjaExvYWRGb250OiAtPlxuXHRcdGZvdW5kZm9udCA9ICQoXCIuZm9udDpub3QoLmZvbnQtbG9hZGVkKVwiKS5lcSgwKVxuXHRcdCNjb25zb2xlLmxvZyBcIiotLSBGdWVudGUgYSBjYXJnYXI6IFwiKyBmb3VuZGZvbnQuYXR0cihcImRhdGEtZm9udFwiKVxuXHRcdGlmIGZvdW5kZm9udC5sZW5ndGhcblx0XHRcdGFwcC5mb250cy5sb2FkRm9udCBmb3VuZGZvbnQsIGFwcC5mb250cy5zZWFyY2hMb2FkRm9udFxuXG5cblx0Y2hlY2tGb250OiAoZm9udGRpdixmb250KSAtPlxuXHRcdCQoXCIuY2hlY2tsb2FkZm9udFwiKS5yZW1vdmUoKVxuXHRcdCQoXCJib2R5XCIpLmFwcGVuZChcIjxzcGFuIGNsYXNzPSdjaGVja2xvYWRmb250JyBzdHlsZT0ncG9zaXRpb246YWJzb2x1dGU7dG9wOi0xMDBweDtsZWZ0OjA7YmFja2dyb3VuZDojOTk5O2ZvbnQtZmFtaWx5OnNlcmlmOyc+YWJjaWpsISQlJi9vMDwvc3Bhbj5cIilcblx0XHRjaGVja3dpZHRoX3ByZXYgPSBmYWxzZVxuXHRcdGFwcC5mb250cy5jaGVja0ZvbnRUKGZvbnRkaXYsZm9udClcblxuXHRjaGVja0ZvbnRUOiAoZm9udGRpdixmb250KSAtPlxuXG5cdFx0I2NvbnNvbGUubG9nIFwiY2hlY2tlYW5kb1wiXG5cblx0XHRjaGVja2RpdiA9ICQoXCIuY2hlY2tsb2FkZm9udFwiKVxuXHRcdGNoZWNrd2lkdGggPSBjaGVja2Rpdi53aWR0aCgpXG5cblx0XHQkKFwiLmNoZWNrbG9hZGZvbnRcIikuY3NzXG5cdFx0XHRcImZvbnQtZmFtaWx5XCI6IGZvbnRcblxuXHRcdCNjb25zb2xlLmxvZyBjaGVja3dpZHRoICsgXCIgdnMgXCIgKyBjaGVja3dpZHRoX3ByZXZcblxuXHRcdGlmIGNoZWNrd2lkdGghPWNoZWNrd2lkdGhfcHJldiAmJiBjaGVja3dpZHRoX3ByZXYhPWZhbHNlXG5cdFx0XHRmb250ZGl2LmFkZENsYXNzKCdmb250LWxvYWRlZCcpXG5cdFx0XHQjY29uc29sZS5sb2cgXCItLS0gRnVlbnRlIGNhcmdhZGFcIlxuXHRcdFx0YXBwLmZvbnRzLnNlYXJjaExvYWRGb250KClcblx0XHRlbHNlXG5cdFx0XHQjY29uc29sZS5sb2cgXCJkc2Fkc2FcIlxuXHRcdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0XHRhcHAuZm9udHMuY2hlY2tGb250VChmb250ZGl2LGZvbnQpXG5cdFx0XHQsNTBcblxuXHRcdGNoZWNrd2lkdGhfcHJldiA9IGNoZWNrd2lkdGhcblxuXG5cblxuXG5cblx0bmF2OlxuXHRcdGluaXQ6IC0+XG5cdFx0XHQkKFwiLnNpbmdsZS1mb250LW5hdmlnYXRpb24gLm5hdlwiKS51bmJpbmQoXCJjbGlja1wiKS5iaW5kIFwiY2xpY2tcIiwgLT5cblx0XHRcdFx0YXBwLmZvbnRzLm5hdi5sb2FkICQodGhpcylcblx0XHRcdFx0ZmFsc2VcblxuXHRcdGxvYWQ6IChlbGVtZW50KSAtPlxuXG5cdFx0XHR1cmwgPSBlbGVtZW50LmF0dHIoXCJocmVmXCIpLnNwbGl0KCcgJykuam9pbignJTIwJyk7XG5cblx0XHRcdGRpciA9IGZhbHNlXG5cdFx0XHRkaXIgPSBcInJpZ2h0XCIgaWYgZWxlbWVudC5oYXNDbGFzcyhcIm5hdi1yaWdodFwiKVxuXHRcdFx0ZGlyID0gXCJsZWZ0XCIgIGlmIGVsZW1lbnQuaGFzQ2xhc3MoXCJuYXYtbGVmdFwiKVxuXG5cdFx0XHQjY29uc29sZS5sb2cgdXJsXG5cblx0XHRcdCQoXCIuc2luZ2xlLWZvbnQtaGVhZGVyXCIpLnJlbW92ZUNsYXNzIFwiYW5pbWF0aW9uLXJpZ2h0XCJcblx0XHRcdCQoXCIuc2luZ2xlLWZvbnQtaGVhZGVyXCIpLnJlbW92ZUNsYXNzIFwiYW5pbWF0aW9uLWxlZnRcIlxuXG5cdFx0XHQkKFwiLnNpbmdsZS1mb250LWhlYWRlclwiKS5hZGRDbGFzcyBcImFuaW1hdGlvbi1yaWdodC1vdXRcIiBpZiBkaXI9PVwibGVmdFwiXG5cdFx0XHQkKFwiLnNpbmdsZS1mb250LWhlYWRlclwiKS5hZGRDbGFzcyBcImFuaW1hdGlvbi1sZWZ0LW91dFwiICBpZiBkaXI9PVwicmlnaHRcIlxuXG5cdFx0XHQkKFwiLnRlc3QtZm9udFwiKS5hZGRDbGFzcyBcIm91dFwiXG5cblx0XHRcdCQoXCIuZ2FsbGVyeVwiKS5hZGRDbGFzcyhcIm91dFwiKVxuXG5cblx0XHRcdHNldFRpbWVvdXQgLT5cblxuXHRcdFx0XHQkLmFqYXgoXG5cdFx0XHRcdFx0dXJsOiB1cmxcblx0XHRcdFx0KS5kb25lIChyZXN1bHQpIC0+XG5cdFx0XHRcdFx0aHRtbCA9ICQocmVzdWx0KVxuXHRcdFx0XHRcdG5ld19oZWFkZXIgPSBodG1sLmZpbmQoXCIuc2luZ2xlLWZvbnQtaGVhZGVyID5cIilcblx0XHRcdFx0XHRuZXdfZ2FsbGVyeSA9IGh0bWwuZmluZChcIi5nYWxsZXJ5ID5cIilcblxuXHRcdFx0XHRcdCQoXCIuc2luZ2xlLWZvbnQtaGVhZGVyXCIpLmh0bWwobmV3X2hlYWRlcilcblx0XHRcdFx0XHQkKFwiLmdhbGxlcnlcIikuaHRtbChuZXdfZ2FsbGVyeSkucmVtb3ZlQ2xhc3MoXCJvdXRcIilcblxuXHRcdFx0XHRcdCQoXCIuc2luZ2xlLWZvbnQtaGVhZGVyXCIpLnJlbW92ZUNsYXNzIFwiYW5pbWF0aW9uLXJpZ2h0LW91dFwiXG5cdFx0XHRcdFx0JChcIi5zaW5nbGUtZm9udC1oZWFkZXJcIikucmVtb3ZlQ2xhc3MgXCJhbmltYXRpb24tbGVmdC1vdXRcIiBcblx0XHRcdFx0XHQkKFwiLnNpbmdsZS1mb250LWhlYWRlclwiKS5hZGRDbGFzcyBcImFuaW1hdGlvbi1cIitkaXJcblxuXHRcdFx0XHRcdG5ld2ZvbnQgPSAkKFwiaDFcIikuYXR0cihcImRhdGEtZm9udFwiKVxuXHRcdFx0XHRcdG5ld2ZvbnRfaWQgPSAkKFwiaDFcIikuYXR0cihcImRhdGEtZm9udC1pZFwiKVxuXG5cdFx0XHRcdFx0aWYgbmV3Zm9udF9pZFxuXG5cdFx0XHRcdFx0XHQkKFwiLnRlc3QtZm9udFwiKS5hdHRyIFwiZGF0YS1mb250XCIsIG5ld2ZvbnRcblx0XHRcdFx0XHRcdCQoXCIudGVzdC1mb250LWgxLCAudGVzdC1mb250LXBcIikuY3NzXG5cdFx0XHRcdFx0XHRcdFwiZm9udC1mYW1pbHlcIjogbmV3Zm9udFxuXG5cdFx0XHRcdFx0XHQkKFwiLnRlc3QtZm9udFwiKS5yZW1vdmVDbGFzcyhcIm91dFwiKS5hZGRDbGFzcyBcImluXCJcblxuXHRcdFx0XHRcdFx0YXBwLmZvbnRzLmFkZCBuZXdmb250LCBuZXdmb250X2lkXG5cdFx0XHRcdFx0XHRhcHAuZm9udHMudG9vbHMudGV4dGFyZWFoZWlnaHQoKVxuXHRcdFx0XHRcdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0XHRcdFx0XHRhcHAuZm9udHMudG9vbHMudGV4dGFyZWFoZWlnaHQoKVxuXHRcdFx0XHRcdFx0LDEwMDBcblxuXHRcdFx0XHRcdFx0YXBwLmZvbnRzLm5hdi5pbml0KClcblx0XHRcdFx0XHRcdGFwcC5hY3Rpb25zLmluaXQoKVxuXG5cblxuXG5cdFx0XHRcdCMjI1xuXG5cdFx0XHRcdCQoXCIuc2luZ2xlLWZvbnQtaGVhZGVyXCIpLmxvYWQgdXJsK1wiIC5zaW5nbGUtZm9udC1oZWFkZXI+XCIsIC0+XG5cdFx0XHRcdFx0JChcIi5zaW5nbGUtZm9udC1oZWFkZXJcIikucmVtb3ZlQ2xhc3MgXCJhbmltYXRpb24tcmlnaHQtb3V0XCJcblx0XHRcdFx0XHQkKFwiLnNpbmdsZS1mb250LWhlYWRlclwiKS5yZW1vdmVDbGFzcyBcImFuaW1hdGlvbi1sZWZ0LW91dFwiIFxuXHRcdFx0XHRcdCQoXCIuc2luZ2xlLWZvbnQtaGVhZGVyXCIpLmFkZENsYXNzIFwiYW5pbWF0aW9uLVwiK2RpclxuXG5cdFx0XHRcdFx0bmV3Zm9udCA9ICQoXCJoMVwiKS5hdHRyKFwiZGF0YS1mb250XCIpXG5cdFx0XHRcdFx0bmV3Zm9udF9pZCA9ICQoXCJoMVwiKS5hdHRyKFwiZGF0YS1mb250LWlkXCIpXG5cblx0XHRcdFx0XHRpZiBuZXdmb250X2lkXG5cblx0XHRcdFx0XHRcdCQoXCIudGVzdC1mb250XCIpLmF0dHIgXCJkYXRhLWZvbnRcIiwgbmV3Zm9udFxuXHRcdFx0XHRcdFx0JChcIi50ZXN0LWZvbnQtaDEsIC50ZXN0LWZvbnQtcFwiKS5jc3Ncblx0XHRcdFx0XHRcdFx0XCJmb250LWZhbWlseVwiOiBuZXdmb250XG5cblx0XHRcdFx0XHRcdCQoXCIudGVzdC1mb250XCIpLnJlbW92ZUNsYXNzKFwib3V0XCIpLmFkZENsYXNzIFwiaW5cIlxuXG5cdFx0XHRcdFx0XHRhcHAuZm9udHMuYWRkIG5ld2ZvbnQsIG5ld2ZvbnRfaWRcblx0XHRcdFx0XHRcdGFwcC5mb250cy50b29scy50ZXh0YXJlYWhlaWdodCgpXG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRcdFx0XHRcdGFwcC5mb250cy50b29scy50ZXh0YXJlYWhlaWdodCgpXG5cdFx0XHRcdFx0XHQsMTAwMFxuXG5cdFx0XHRcdFx0XHRhcHAuZm9udHMubmF2LmluaXQoKVxuXHRcdFx0XHRcdFx0YXBwLmFjdGlvbnMuaW5pdCgpXG5cblx0XHRcdFx0IyMjXG5cdFx0XHQsNTAwXG5cblxuXHRwcmVzZW50YXRpb246IC0+XG5cblx0XHR0ZXh0c19kZWZhdWx0ID0gW1xuXHRcdFx0XCJMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldFwiLFxuXHRcdFx0XCJSZXBlbGxlbmR1cywgaW52ZW50b3JlLCBuZW1vLlwiLFxuXHRcdFx0XCI0MjMtODkoMDgpKjIrODM1OTFcIixcblx0XHRcdFwiRG9sb3JlbXF1ZSBwbGFjZWF0IGN1cGlkaXRhdGVcIixcblx0XHRcdFwiQW1ldCBxdW9kIHNpbnQgYWRpcGlzY2kuXCIsXG5cdFx0XHRcIiQlJio9P3srXCIsXG5cdFx0XHRcIkl0YXF1ZSBuaWhpbCBvZmZpY2lpcy5cIlxuXHRcdFx0XCJBQkNERUZHSElKS0xNTsORT1BRUlNUVVZXWFlaXCJcblx0XHRdXG5cblx0XHQkKFwiLmhvbGEtYmdcIikuZWFjaCAtPlxuXHRcdFx0ZGl2ID0gJCh0aGlzKVxuXHRcdFx0dGV4dHMgPSBkaXYuYXR0cihcImRhdGEtdGV4dHNcIilcblx0XHRcdGlmIHRleHRzXG5cdFx0XHRcdHRleHRzID0gdGV4dHMuc3BsaXQoXCJ8fFwiKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0ZXh0cyA9IHRleHRzX2RlZmF1bHRcblxuXHRcdFx0I2NvbnNvbGUubG9nIHRleHRzXG5cdFx0XHRyYW5kID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDEwKSArIDEpXG5cblx0XHRcdGkgPSAxXG5cdFx0XHRmb3IgdGV4dCBpbiB0ZXh0c1xuXHRcdFx0XHRyYW5kX3NpemUgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMTUwKSArIDEpXG5cdFx0XHRcdHJhbmRfdG9wID0gaSoxMFxuXHRcdFx0XHRkaXYuYXBwZW5kIFwiPGRpdiBjbGFzcz0nY2hhbyBjaGFvLVwiK2krXCInIHN0eWxlPSdmb250LXNpemU6XCIrcmFuZF9zaXplK1wicHg7dG9wOlwiK3JhbmRfdG9wK1wiJTsnPlwiK3RleHQrXCI8L2Rpdj5cIlxuXHRcdFx0XHRpKytcblxuXHRcdFx0IyBJbnNlcnQgZm9udFxuXHRcdFx0Zm9udCA9IGRpdi5hdHRyKFwiZGF0YS1mb250XCIpXG5cdFx0XHRhcHAuZm9udHMuYWRkIGZvbnRcblx0XHRcdGRpdi5jc3Ncblx0XHRcdFx0XCJmb250LWZhbWlseVwiOiBmb250XG5cblxuXHRcdGFwcC5mb250cy5zZWFyY2hMb2FkRm9udCgpXG5cblxuXHRcdCQoXCIuZm9udC1iaWdcIikua2V5dXAgLT5cblx0XHRcdHRleHQgPSAkKHRoaXMpLnZhbCgpXG5cdFx0XHQkKFwiLmZvbnQtYmlnXCIpLmVhY2ggLT5cblx0XHRcdFx0aWYgISQodGhpcykuaXMoXCI6Zm9jdXNcIilcblx0XHRcdFx0XHQkKHRoaXMpLnZhbCB0ZXh0XG5cblxuXHRpbnN0cnVjdGlvbnM6XG5cdFx0aW5pdDogLT5cblx0XHRcdCQoXCIuaW5zdHJ1Y3Rpb25cIikuZWFjaCAtPlxuXHRcdFx0XHRpbnN0ID0gJCh0aGlzKSBcblx0XHRcdFx0biA9IGluc3QuYXR0cihcImRhdGEtaW5zdHJ1Y3Rpb25cIilcblxuXHRcdFx0XHRpZiAhYXBwLmNvb2tpZS5yZWFkIFwiaW5zdHJ1Y3Rpb24tXCIrblxuXG5cdFx0XHRcdFx0aW5zdC5hZGRDbGFzcyhcImluXCIpXG5cdFx0XHRcdFx0I2NvbnNvbGUubG9nIGluc3QucGFyZW50KCkuZmluZChcImlucHV0LHRleHRhcmVhXCIpXG5cdFx0XHRcdFx0aW5zdC5wYXJlbnQoKS5maW5kKFwiaW5wdXQsdGV4dGFyZWFcIikua2V5dXAgLT5cblx0XHRcdFx0XHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdFx0XHRcdFx0aW5zdC5hZGRDbGFzcyhcIm91dFwiKVxuXHRcdFx0XHRcdFx0XHRhcHAuY29va2llLmNyZWF0ZSBcImluc3RydWN0aW9uLVwiK24sIFwib2tcIlxuXHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRcdFx0XHRcdFx0aW5zdC5yZW1vdmUoKVxuXHRcdFx0XHRcdFx0XHQsNTAwXG5cdFx0XHRcdFx0XHQsNTAwXG5cblxuXG5cblx0dG9vbHM6XG5cdFxuXHRcdGluaXQ6IC0+XG5cblx0XHRcdCMgSGVpZ2h0IHRlc3Rcblx0XHRcdCQoXCIjdGVzdC1mb250LWNvbnRhaW5lclwiKS5jc3Ncblx0XHRcdFx0XCJtaW4taGVpZ2h0XCI6ICQod2luZG93KS5oZWlnaHQoKSAtICQoXCJoZWFkZXJcIikuaGVpZ2h0KClcblx0XHRcdCQod2luZG93KS5yZXNpemUgLT5cblx0XHRcdFx0JChcIiN0ZXN0LWZvbnQtY29udGFpbmVyXCIpLmNzc1xuXHRcdFx0XHRcdFwibWluLWhlaWdodFwiOiAkKHdpbmRvdykuaGVpZ2h0KCkgLSAkKFwiaGVhZGVyXCIpLmhlaWdodCgpXG5cblxuXHRcdFx0IyBTZXQgZm9udFxuXG5cdFx0XHRmb250ID0gJChcIi50ZXN0LWZvbnRcIikuYXR0cihcImRhdGEtZm9udFwiKVxuXHRcdFx0Zm9udF9pZCA9ICQoXCIudGVzdC1mb250XCIpLmF0dHIoXCJkYXRhLWZvbnQtaWRcIilcblx0XHRcdFxuXHRcdFx0YXBwLmZvbnRzLmFkZCBmb250LCBmb250X2lkXG5cdFx0XHQkKFwiLnRlc3QtZm9udC1oMSwgLnRlc3QtZm9udC1wXCIpLmNzc1xuXHRcdFx0XHRcImZvbnQtZmFtaWx5XCI6IGZvbnRcblxuXHRcdFx0IyBFdmVudHMgdGVzdFxuXG5cdFx0XHRhcHAuZm9udHMudG9vbHMudGV4dGFyZWFjb3B5dGV4dCgpXG5cdFx0XHQkKFwiLnRlc3QtZm9udC1oMS5saXZlLCAudGVzdC1mb250LXAubGl2ZVwiKS5rZXl1cCAtPlxuXHRcdFx0XHRhcHAuZm9udHMudG9vbHMudGV4dGFyZWFjb3B5dGV4dCgpXG5cblx0XHRcdCQoXCJib2R5XCIpLmNsaWNrIC0+XG5cdFx0XHRcdCQoXCIudGVzdC1mb250LWdyb3VwXCIpLnJlbW92ZUNsYXNzIFwiaW5cIlxuXHRcdFx0XHQkKFwiLnRvb2xzXCIpLmFkZENsYXNzIFwib3V0XCJcblx0XHRcdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0XHRcdCQoXCIudG9vbHNcIikucmVtb3ZlQ2xhc3MgXCJpbiBvdXRcIlxuXHRcdFx0XHRcdCQoXCIudG9vbHMtZ3JvdXBcIikucmVtb3ZlQ2xhc3MgXCJpblwiXG5cdFx0XHRcdCw1MDBcblxuXG5cdFx0XHQkKFwiLnRvb2xzXCIpLmNsaWNrIChlKSAtPlxuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHQkKFwiLnRlc3QtZm9udC1oMS5saXZlLCAudGVzdC1mb250LXAubGl2ZVwiKS5jbGljayAoZSkgLT5cblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKVxuXG5cdFx0XHQkKFwiLnRlc3QtZm9udC1oMS5saXZlLCAudGVzdC1mb250LXAubGl2ZVwiKS5mb2N1cyAtPlxuXG5cdFx0XHRcdCQoXCIudG9vbHNcIikuYWRkQ2xhc3MgXCJpblwiXG5cblx0XHRcdFx0JChcIi50ZXN0LWZvbnQtZ3JvdXBcIikucmVtb3ZlQ2xhc3MgXCJpblwiXG5cdFx0XHRcdCQoXCIudG9vbHMtZ3JvdXBcIikucmVtb3ZlQ2xhc3MgXCJpblwiXG5cblx0XHRcdFx0dGVzdF9ncm91cCA9ICQodGhpcykuY2xvc2VzdChcIi50ZXN0LWZvbnQtZ3JvdXBcIilcblx0XHRcdFx0dGVzdF9ncm91cC5hZGRDbGFzcyBcImluXCJcblx0XHRcdFx0JChcIi50b29scy1ncm91cC5cIit0ZXN0X2dyb3VwLmF0dHIoXCJkYXRhLXRvb2xzXCIpKS5hZGRDbGFzcyBcImluXCJcblx0XG5cdFx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRcdGFwcC5mb250cy50b29scy50ZXh0YXJlYWhlaWdodCgpXG5cdFx0XHQsMTAwMFxuXG5cdFx0XHQkKHdpbmRvdykucmVzaXplIC0+XG5cdFx0XHRcdGFwcC5mb250cy50b29scy50ZXh0YXJlYWhlaWdodCgpXG5cblxuXG5cdFx0XHQjIFNldCBjc3NcblxuXHRcdFx0JChcIi50b29sXCIpLmVhY2ggLT5cblx0XHRcdFx0dG9vbCAgICAgICAgPSAkKHRoaXMpXG5cdFx0XHRcdHRvb2xfdG8gICAgID0gdG9vbC5hdHRyKFwiZGF0YS10b1wiKVxuXHRcdFx0XHR0b29sX2NzcyAgICA9IHRvb2wuYXR0cihcImRhdGEtY3NzXCIpXG5cdFx0XHRcdHRvb2xfaW5pdCAgID0gdG9vbC5hdHRyKFwiZGF0YS1pbml0XCIpXG5cdFx0XHRcdHRvb2xfc2VsZWN0ID0gdG9vbC5hdHRyKFwiZGF0YS1zZWxlY3RcIilcblxuXHRcdFx0XHQjIFNldCBwcm9wZXJ0aWVzIGZyb20gY29va2llXG5cblx0XHRcdFx0aWYgYXBwLmNvb2tpZS5yZWFkIFwiY29sb3JcIlxuXHRcdFx0XHRcdCQoXCIudG9vbFtkYXRhLWNzcz0nY29sb3InXVwiKS5hdHRyIFwiZGF0YS1pbml0XCIsIGFwcC5jb29raWUucmVhZChcImNvbG9yXCIpXG5cdFx0XHRcdGlmIGFwcC5jb29raWUucmVhZCBcImJhY2tncm91bmQtY29sb3JcIlxuXHRcdFx0XHRcdCQoXCIudG9vbFtkYXRhLWNzcz0nYmFja2dyb3VuZC1jb2xvciddXCIpLmF0dHIgXCJkYXRhLWluaXRcIiwgYXBwLmNvb2tpZS5yZWFkKFwiYmFja2dyb3VuZC1jb2xvclwiKVxuXG5cblx0XHRcdFx0IyBTZXQgY3NzXG5cdFx0XHRcdGFwcC5mb250cy50b29scy5pbnNlcnRjc3ModG9vbF90byx0b29sX2Nzcyx0b29sX2luaXQpXG5cblx0XHRcdFx0IyBTZXQgaW5kaWNhdG9yXG5cdFx0XHRcdGFwcC5mb250cy50b29scy5zZXRpbmRpY2F0b3IoJCh0aGlzKSx0b29sX2luaXQpXG5cblx0XHRcdFx0IyBTZXQgb3B0aW9ucyBmb3IgY29sb3JzXG5cdFx0XHRcdGlmIHRvb2xfc2VsZWN0XG5cdFx0XHRcdFx0dG9vbF9zZWxlY3Rfc3BsaXQgPSB0b29sX3NlbGVjdC5zcGxpdChcInxcIilcblx0XHRcdFx0XHR0b29sLmZpbmQoXCIudG9vbC1pY29uLWNvbG9yLWlubmVyXCIpLmNzc1xuXHRcdFx0XHRcdFx0J2JhY2tncm91bmQtY29sb3InOiAnIycrdG9vbF9pbml0XG5cdFx0XHRcdFx0JC5lYWNoIHRvb2xfc2VsZWN0X3NwbGl0LCAoayx0b29sX29wdGlvbikgLT5cblx0XHRcdFx0XHRcdHRvb2wuZmluZChcIi50b29sLXNlbGVjdFwiKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSd0b29sLW9wdGlvbicgZGF0YS12YWx1ZT0nXCIrdG9vbF9vcHRpb24rXCInIHN0eWxlPSdiYWNrZ3JvdW5kLWNvbG9yOiNcIit0b29sX29wdGlvbitcIjsnPjxkaXYgY2xhc3M9J3Rvb2wtb3B0aW9uLXNlbGVjdGVkJz48L2Rpdj48L2Rpdj5cIilcblxuXG5cdFx0XHQjIEV2ZW50cyBtb3ZlIGJhclxuXG5cdFx0XHRjbGlja19hY3RpdmUgPSBmYWxzZVxuXG5cdFx0XHQkKFwiLnRvb2wgLnRvb2wtYmFyXCIpLm1vdXNlZG93biAoZSkgLT5cblx0XHRcdFx0YXBwLmZvbnRzLnRvb2xzLm1vdmViYXIoJCh0aGlzKSxlKVxuXHRcdFx0XHRjbGlja19hY3RpdmUgPSB0cnVlXG5cblx0XHRcdCQoXCIudG9vbCAudG9vbC1iYXJcIikubW91c2V1cCAtPlxuXHRcdFx0XHRjbGlja19hY3RpdmUgPSBmYWxzZVxuXG5cdFx0XHQkKFwiLnRvb2wgLnRvb2wtYmFyXCIpLm1vdXNlbW92ZSAoZSkgLT5cblx0XHRcdFx0aWYgY2xpY2tfYWN0aXZlXHRcdFxuXHRcdFx0XHRcdGFwcC5mb250cy50b29scy5tb3ZlYmFyKCQodGhpcyksZSlcblxuXG5cdFx0XHQjIEV2ZW50cyBzd2l0Y2hcblx0XHRcdCQoXCIudG9vbFtkYXRhLXN3aXRjaF1cIikuY2xpY2sgLT5cblx0XHRcdFx0dG9vbCAgICAgPSAkKHRoaXMpXG5cdFx0XHRcdHRvb2xfdG8gID0gdG9vbC5hdHRyKFwiZGF0YS10b1wiKVxuXHRcdFx0XHR0b29sX2NzcyA9IHRvb2wuYXR0cihcImRhdGEtY3NzXCIpXG5cblx0XHRcdFx0dmFsdWVzID0gdG9vbC5hdHRyKFwiZGF0YS1zd2l0Y2hcIikuc3BsaXQoXCJ8XCIpXG5cdFx0XHRcdHZhbHVlMSA9IHZhbHVlc1swXVxuXHRcdFx0XHR2YWx1ZTIgPSB2YWx1ZXNbMV1cblxuXHRcdFx0XHR0b29sLnRvZ2dsZUNsYXNzKFwib25cIilcblx0XHRcdFx0XG5cdFx0XHRcdGlmIHRvb2wuaGFzQ2xhc3MoXCJvblwiKVxuXHRcdFx0XHRcdGFwcC5mb250cy50b29scy5pbnNlcnRjc3ModG9vbF90byx0b29sX2Nzcyx2YWx1ZTEpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRhcHAuZm9udHMudG9vbHMuaW5zZXJ0Y3NzKHRvb2xfdG8sdG9vbF9jc3MsdmFsdWUyKVxuXG5cblx0XHRcdCMgQ29sb3Jlc1xuXHRcdFx0YXBwLmZvbnRzLnRvb2xzLmNvbG9ycy5pbml0KClcblxuXG5cdFx0c2V0aW5kaWNhdG9yOiAodG9vbCx2YWx1ZSkgLT5cblxuXHRcdFx0dG9vbF9taW4gPSBwYXJzZUludCB0b29sLmF0dHIoXCJkYXRhLW1pblwiKVxuXHRcdFx0dG9vbF9tYXggPSBwYXJzZUludCB0b29sLmF0dHIoXCJkYXRhLW1heFwiKVxuXG5cdFx0XHRpZiB0b29sX21heFxuXHRcblx0XHRcdFx0bW92ZSA9IHBhcnNlSW50KCAoIHZhbHVlICogMTAwIC8gKHRvb2xfbWF4LXRvb2xfbWluKSApIC0gKCB0b29sX21pbiAqIDEwMCAvICh0b29sX21heC10b29sX21pbikgKSApXG5cblx0XHRcdFx0I2ludmVydFxuXHRcdFx0XHRtb3ZlID0gMTAwIC0gbW92ZVxuXG5cdFx0XHRcdHRvb2wuZmluZChcIi50b29sLWluZGljYXRvclwiKS5jc3Ncblx0XHRcdFx0XHR0b3A6IG1vdmUgKyBcIiVcIlxuXG5cblxuXHRcdG1vdmViYXI6IChlbGVtZW50LGUpIC0+XG5cblx0XHRcdHBvcyAgICAgICA9IGVsZW1lbnQub2Zmc2V0KCkudG9wXG5cdFx0XHRjbGljayAgICAgPSBlLnBhZ2VZXG5cdFx0XHRzY3JvbGwgICAgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKClcblx0XHRcdGhlaWdodCAgICA9IGVsZW1lbnQuaGVpZ2h0KClcblx0XHRcdHRvcCAgICAgICA9IHBvcyAtIHNjcm9sbFxuXHRcdFx0Y2xpY2tfYmFyID0gY2xpY2sgLSBwb3Ncblx0XHRcdG1vdmUgICAgICA9IGNsaWNrX2JhciAqIDEwMCAvIGhlaWdodFxuXG5cdFx0XHRlbGVtZW50LmZpbmQoXCIudG9vbC1pbmRpY2F0b3JcIikuY3NzXG5cdFx0XHRcdHRvcDogbW92ZSArIFwiJVwiXG5cblx0XHRcdHRvb2wgPSBlbGVtZW50LmNsb3Nlc3QoXCIudG9vbFwiKVxuXHRcdFx0dG9vbF90byA9IHRvb2wuYXR0cihcImRhdGEtdG9cIilcblx0XHRcdHRvb2xfY3NzID0gdG9vbC5hdHRyKFwiZGF0YS1jc3NcIilcblx0XHRcdHRvb2xfbWluID0gcGFyc2VJbnQgdG9vbC5hdHRyKFwiZGF0YS1taW5cIilcblx0XHRcdHRvb2xfbWF4ID0gcGFyc2VJbnQgdG9vbC5hdHRyKFwiZGF0YS1tYXhcIilcblxuXHRcdFx0dG9vbF9jYWxjdWxhdGUgPSBwYXJzZUludCggKHRvb2xfbWF4LXRvb2xfbWluKSAqIG1vdmUgLyAxMDAgKSArIHRvb2xfbWluXG5cblx0XHRcdCNpbnZlcnRcblx0XHRcdHRvb2xfY2FsY3VsYXRlID0gdG9vbF9tYXggLSB0b29sX2NhbGN1bGF0ZSArIHRvb2xfbWluXG5cblx0XHRcdCNjb25zb2xlLmxvZyB0b29sX2NhbGN1bGF0ZStcInB4XCJcblxuXHRcdFx0YXBwLmZvbnRzLnRvb2xzLmluc2VydGNzcyh0b29sX3RvLHRvb2xfY3NzLHRvb2xfY2FsY3VsYXRlKVxuXG5cblxuXG5cdFx0aW5zZXJ0Y3NzOiAodG8sY3NzLHZhbHVlKSAtPlxuXHRcdFx0aWYgY3NzID09IFwiZm9udC1zaXplXCJcblx0XHRcdFx0JCh0bykuY3NzIFwiZm9udC1zaXplXCI6IHZhbHVlK1wicHhcIlxuXHRcdFx0aWYgY3NzID09IFwibGluZS1oZWlnaHRcIlxuXHRcdFx0XHQkKHRvKS5jc3MgXCJsaW5lLWhlaWdodFwiOiB2YWx1ZStcInB4XCJcblx0XHRcdGlmIGNzcyA9PSBcImxldHRlci1zcGFjaW5nXCJcblx0XHRcdFx0JCh0bykuY3NzIFwibGV0dGVyLXNwYWNpbmdcIjogdmFsdWUrXCJweFwiXG5cdFx0XHRpZiBjc3MgPT0gXCJ3b3JkLXNwYWNpbmdcIlxuXHRcdFx0XHQkKHRvKS5jc3MgXCJ3b3JkLXNwYWNpbmdcIjogdmFsdWUrXCJweFwiXG5cblx0XHRcdGlmIGNzcyA9PSBcInRleHQtdHJhbnNmb3JtXCJcblx0XHRcdFx0JCh0bykuY3NzIFwidGV4dC10cmFuc2Zvcm1cIjogdmFsdWVcblx0XHRcdGlmIGNzcyA9PSBcImZvbnQtd2VpZ2h0XCJcblx0XHRcdFx0JCh0bykuY3NzIFwiZm9udC13ZWlnaHRcIjogdmFsdWVcblxuXHRcdFx0aWYgY3NzID09IFwiY29sb3JcIlxuXHRcdFx0XHQkKHRvKS5jc3MgXCJjb2xvclwiOiBcIiNcIit2YWx1ZVxuXHRcdFx0XHRhcHAuY29va2llLmNyZWF0ZSBcImNvbG9yXCIsIHZhbHVlXG5cdFx0XHRpZiBjc3MgPT0gXCJiYWNrZ3JvdW5kLWNvbG9yXCJcblx0XHRcdFx0JCh0bykuY3NzIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNcIit2YWx1ZVxuXHRcdFx0XHRhcHAuY29va2llLmNyZWF0ZSBcImJhY2tncm91bmQtY29sb3JcIiwgdmFsdWVcblxuXHRcdFx0YXBwLmZvbnRzLnRvb2xzLnRleHRhcmVhaGVpZ2h0KClcblxuXG5cdFx0dGV4dGFyZWFoZWlnaHQ6IC0+XG5cblx0XHRcdGhlaWdodF9oMSA9ICQoXCIudGVzdC1mb250LWgxLmdob3N0XCIpLmhlaWdodCgpXG5cdFx0XHQkKFwiLnRlc3QtZm9udC1oMS5saXZlXCIpLmNzc1xuXHRcdFx0XHRoZWlnaHQ6IGhlaWdodF9oMStcInB4XCJcblx0XHRcdCQoXCIudGVzdC1mb250LWgxLmxpdmVcIikucGFyZW50KCkuZmluZChcIi50ZXN0LWZvbnQtZ3JvdXAtZm9jdXNcIikuY3NzXG5cdFx0XHRcdGhlaWdodDogaGVpZ2h0X2gxK1wicHhcIlxuXG5cdFx0XHRoZWlnaHRfcCA9ICQoXCIudGVzdC1mb250LXAuZ2hvc3RcIikuaGVpZ2h0KClcblx0XHRcdCQoXCIudGVzdC1mb250LXAubGl2ZVwiKS5jc3Ncblx0XHRcdFx0aGVpZ2h0OiBoZWlnaHRfcCtcInB4XCJcblx0XHRcdCQoXCIudGVzdC1mb250LXAubGl2ZVwiKS5wYXJlbnQoKS5maW5kKFwiLnRlc3QtZm9udC1ncm91cC1mb2N1c1wiKS5jc3Ncblx0XHRcdFx0aGVpZ2h0OiBoZWlnaHRfcCtcInB4XCJcblxuXG5cdFx0dGV4dGFyZWFjb3B5dGV4dDogLT5cblxuXHRcdFx0JChcIi50ZXN0LWZvbnQtaDEuZ2hvc3RcIikuaHRtbCAkKFwiLnRlc3QtZm9udC1oMS5saXZlXCIpLnZhbCgpXG5cdFx0XHQkKFwiLnRlc3QtZm9udC1wLmdob3N0XCIpLmh0bWwgJChcIi50ZXN0LWZvbnQtcC5saXZlXCIpLnZhbCgpXG5cdFx0XHRhcHAuZm9udHMudG9vbHMudGV4dGFyZWFoZWlnaHQoKVxuXG5cblxuXHRcdGNvbG9yczpcblx0XHRcdGluaXQ6IC0+XG5cdFx0XHRcdCQoXCIudG9vbHMgLnRvb2wtc2VsZWN0IC50b29sLW9wdGlvblwiKS5jbGljayAtPlxuXHRcdFx0XHRcdG9wdGlvbiAgICAgPSAkKHRoaXMpXG5cdFx0XHRcdFx0dG9vbCAgICAgICA9IG9wdGlvbi5jbG9zZXN0KFwiLnRvb2xcIilcblx0XHRcdFx0XHR0b29sX3RvICAgID0gdG9vbC5hdHRyKFwiZGF0YS10b1wiKVxuXHRcdFx0XHRcdHRvb2xfY3NzICAgPSB0b29sLmF0dHIoXCJkYXRhLWNzc1wiKVxuXHRcdFx0XHRcdHRvb2xfdmFsdWUgPSBvcHRpb24uYXR0cihcImRhdGEtdmFsdWVcIilcblx0XHRcdFx0XHRhcHAuZm9udHMudG9vbHMuaW5zZXJ0Y3NzKHRvb2xfdG8sdG9vbF9jc3MsdG9vbF92YWx1ZSlcblxuXHRcdFx0XHRcdHRvb2wuZmluZChcIi50b29sLXNlbGVjdCAudG9vbC1vcHRpb25cIikucmVtb3ZlQ2xhc3MoXCJpblwiKVxuXG5cdFx0XHRcdFx0dG9vbC5maW5kKFwiLnRvb2wtaWNvbi1jb2xvci1pbm5lclwiKS5jc3Ncblx0XHRcdFx0XHRcdCdiYWNrZ3JvdW5kLWNvbG9yJzogJyMnK3Rvb2xfdmFsdWUgXG5cblx0XHRcdFx0XHRvcHRpb24uYWRkQ2xhc3MoXCJpblwiKVxuXG5cblxuXG5cblxuXG5cblxuYXBwLmxvYWRpbmcgPVxuXG5cdGluaXQ6IC0+XG5cdFx0aWYgJChcIltkYXRhLWxvYWRpbmddXCIpLmxlbmd0aFxuXHRcdFx0YXBwLmxvYWRpbmcuaW4oKVxuXHRcdCMjI1xuXHRcdGFwcC5sb2FkaW5nLmluKClcblx0XHQkKFwiYm9keVwiKS5pbWFnZXNMb2FkZWQgLT5cblx0XHRcdGFwcC5sb2FkaW5nLm91dCgpXG5cdFx0IyMjXG5cblx0aW46IChlbGVtZW50KSAtPlxuXHRcdGVsZW1lbnQgPSAkKFwiYm9keVwiKSBpZiAhZWxlbWVudFxuXHRcdGVsZW1lbnQuYXBwZW5kICcnK1xuXHRcdFx0JzxkaXYgY2xhc3M9XCJsb2FkaW5nXCI+Jytcblx0XHRcdFx0JzxkaXYgY2xhc3M9XCJsb2FkaW5nLWljb25cIj4nK1xuXHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwibG9hZGluZy1pY29uLWNpcmNsZVwiPjxkaXY+PC9kaXY+PC9kaXY+Jytcblx0XHRcdFx0JzwvZGl2PicrXG5cdFx0XHQnPC9kaXY+J1xuXHRvdXQ6IC0+XG5cdFx0JChcIi5sb2FkaW5nXCIpLmFkZENsYXNzIFwib3V0XCJcblx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHQkKFwiLmxvYWRpbmdcIikucmVtb3ZlKClcblx0XHQsNTAwXG5cdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIilcblxuXG5cblxuYXBwLnBsdWdpbnMgPVxuXG5cdGluaXQ6IC0+XG5cblxuXHRcdCMgSXNvdG9wZVxuXHRcdGlmICQoXCIuaXNvdG9wZVwiKS5sZW5ndGhcblx0XHRcdGlzb3RvcGUgPSAkKFwiLmlzb3RvcGVcIikuaXNvdG9wZSgpXG5cblxuXG5cdHJlbGF5b3V0OiAtPlxuXG5cdFx0JChcImJvZHlcIikuaW1hZ2VzTG9hZGVkIC0+XG5cdFx0XHRhcHAuYWxlcnQuZXF1aWRpc3QoKVxuXHRcdFx0YXBwLmFsZXJ0LmVxdWlkaXN0KClcblx0XHRcdGlmICQoXCIuaXNvdG9wZVwiKS5sZW5ndGhcblx0XHRcdFx0JChcIi5pc290b3BlXCIpLmlzb3RvcGVcblx0XHRcdFx0XHRyZWxheW91dDogdHJ1ZVxuXG5cblxuXG5cbmFwcC5zY3JvbGwgPSAtPlxuXG5cdGlmICFhcHAuaXNNb2JpbGUoKVxuXHRcdHNjcm9sbF9wcmV2ID0gMFxuXHRcdCQod2luZG93KS5zY3JvbGwgLT5cblxuXHRcdFx0IyBFc2NvbmRlciBoZWFkZXJcblx0XHRcdHNjcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKVxuXHRcdFx0aGVpZ2h0X3dpbmRvdyA9ICQod2luZG93KS5oZWlnaHQoKVxuXHRcdFx0aGVpZ2h0X2JvZHkgPSAkKFwiYm9keVwiKS5oZWlnaHQoKVxuXG5cdFx0XHRpZiBzY3JvbGwgPiA1MFxuXHRcdFx0XHQkKFwiaGVhZGVyXCIpLmFkZENsYXNzIFwiaGVhZGVyLWhpZGVcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHQkKFwiaGVhZGVyXCIpLnJlbW92ZUNsYXNzIFwiaGVhZGVyLWhpZGVcIlxuXG5cdFx0XHRpZiBzY3JvbGwgPiA3MFxuXHRcdFx0XHQkKFwiLnNpbmdsZS1mb250LWhlYWRlclwiKS5hZGRDbGFzcyhcImZpeGVkXCIpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCQoXCIuc2luZ2xlLWZvbnQtaGVhZGVyXCIpLnJlbW92ZUNsYXNzKFwiZml4ZWRcIilcblxuXG5cdFx0XHRzY3JvbGxfcHJldiA9IHNjcm9sbFxuXG5cblx0XHRcdCMgTW9zdHJhciBlbiBzY3JvbGxcblxuXHRcdFx0aWYgJChcIi5kaXNwbGF5c2Nyb2xsXCIpLmxlbmd0aFxuXHRcdFx0XHQkKFwiLmRpc3BsYXlzY3JvbGxcIikuZWFjaCAtPlxuXHRcdFx0XHRcdGVsZW1lbnQgPSAkKHRoaXMpXG5cdFx0XHRcdFx0ZWxlbWVudF90b3AgPSBlbGVtZW50Lm9mZnNldCgpLnRvcFxuXHRcdFx0XHRcdGVsZW1lbnRfaGVpZ2h0ID0gZWxlbWVudC5oZWlnaHQoKVxuXHRcdFx0XHRcdGlmIHNjcm9sbCArIGhlaWdodF93aW5kb3cgPiBlbGVtZW50X2hlaWdodCArIGVsZW1lbnRfdG9wXG5cdFx0XHRcdFx0XHRlbGVtZW50LmFkZENsYXNzIFwiaW5cIlxuXG5cblxuXG5hcHAuc2VjcmV0TWVudSA9XG5cblx0aW5pdDogLT5cblxuXHRcdCMgQ29tcGFyZSBVUkwgaW4gbWVudVxuXHRcdHVybCA9IGRvY3VtZW50LlVSTFxuXHRcdHVybF9zcGxpdCA9IHVybC5zcGxpdChcIi9cIilcblx0XHRuYW1lX3BhZ2UgPSB1cmxfc3BsaXRbdXJsX3NwbGl0Lmxlbmd0aC0xXVxuXHRcdG5hbWVfcGFnZV9zcGxpdCA9IG5hbWVfcGFnZS5zcGxpdChcIj9cIikgXG5cdFx0bmFtZV9wYWdlX2NsZWFyID0gbmFtZV9wYWdlX3NwbGl0WzBdXG5cdFx0bGkgPSAkKFwiLnNlY3JldG1lbnUtY29udGVudCBhW2hyZWY9J1wiK25hbWVfcGFnZV9jbGVhcitcIiddXCIpLnBhcmVudChcImxpXCIpXG5cdFx0bGkuYWRkQ2xhc3MgXCJjdXJyZW50LWl0ZW1cIlxuXHRcdGxpLnBhcmVudCgpLnBhcmVudChcImxpXCIpLmFkZENsYXNzIFwiY3VycmVudC1pdGVtXCJcblxuXHRcdCMgRGVza3RvcFxuXHRcdCQoXCIuc2VjcmV0bWVudS1jb250ZW50IHVsIGxpIGFcIikuZWFjaCAtPlxuXHRcdFx0aWYgJCh0aGlzKS5wYXJlbnQoKS5maW5kKFwidWxcIikubGVuZ3RoXG5cdFx0XHRcdGlmICEkKHRoaXMpLmhhc0NsYXNzKFwic2VjcmV0bWVudS1wYXJlbnRcIilcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwic2VjcmV0bWVudS1wYXJlbnRcIikucHJlcGVuZCgnPGkgY2xhc3M9XCJmYSBmYS1jaGV2cm9uLXJpZ2h0XCI+PC9pPicpXG5cdFx0XHRcdFx0JCh0aGlzKS5wYXJlbnQoKS5maW5kKFwidWxcIikucHJlcGVuZCAnPGxpPjxhIGhyZWY9XCIjXCIgY2xhc3M9XCJzZWNyZXRtZW51LWJhY2tcIj48aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tbGVmdFwiPjwvaT4gQXRyw6FzPC9hPjwvbGk+J1xuXG5cdFx0aWYgJChcIi5zZWNyZXRtZW51LWNvbnRlbnQgdWwgbGkuY3VycmVudC1pdGVtIGEuc2VjcmV0bWVudS1wYXJlbnRcIikubGVuZ3RoXG5cdFx0XHRhcHAuc2VjcmV0TWVudS5vcGVuTHZsRGVza3RvcCAkKFwiLnNlY3JldG1lbnUtY29udGVudCB1bCBsaS5jdXJyZW50LWl0ZW0gYS5zZWNyZXRtZW51LXBhcmVudFwiKVxuXG5cdFx0IyBNb2JpbGVcblxuXHRcdCQoXCIuc2VjcmV0bWVudS1idXR0b25cIikuY2xpY2sgLT5cblx0XHRcdGlmICEkKFwiYm9keVwiKS5oYXNDbGFzcyhcInNlY3JldG1lbnUtaW5cIilcblx0XHRcdFx0YXBwLnNlY3JldE1lbnUub3BlbiAkKFwiLnNlY3JldG1lbnUtY29udGVudFwiKS5odG1sKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0YXBwLnNlY3JldE1lbnUuY2xvc2UoKVxuXHRcdCQoXCIuc2VjcmV0bWVudS1jb250YWluZXItZnJvbnRcIikuY2xpY2sgLT5cblx0XHRcdGlmICQoXCJib2R5XCIpLmhhc0NsYXNzKFwic2VjcmV0bWVudS1pblwiKVxuXHRcdFx0XHRhcHAuc2VjcmV0TWVudS5jbG9zZSgpXG5cdFx0dHJ1ZVxuXG5cdG9wZW5MdmxEZXNrdG9wOiAoZWxlbWVudCkgLT5cblx0XHR1bCA9IGVsZW1lbnQucGFyZW50KCkuZmluZChcInVsXCIpXG5cdFx0dWwuYWRkQ2xhc3MoXCJpblwiKVxuXHRcdHVsLmZpbmQoXCJhLnNlY3JldG1lbnUtYmFja1wiKS51bmJpbmQoXCJjbGlja1wiKS5iaW5kIFwiY2xpY2tcIiwgLT5cblx0XHRcdHVsLmFkZENsYXNzKFwib3V0XCIpXG5cdFx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRcdHVsLnJlbW92ZUNsYXNzKFwiaW4gb3V0XCIpXG5cdFx0XHQsNzAwXG5cdFx0XHRmYWxzZVxuXG5cblx0b3BlbjogKGh0bWwsY2hpbGRyZW49ZmFsc2UsZGlyZWN0aW9uPVwibGVmdFwiKSAtPlxuXG5cdFx0bGVuZ3RoICAgID0gJChcIi5zZWNyZXRtZW51XCIpLmxlbmd0aCArIDFcblx0XHRjb250YWluZXIgPSAnPGRpdiBjbGFzcz1cInNlY3JldG1lbnUgc2VjcmV0bWVudS1sdmwtJysoJChcIi5zZWNyZXRtZW51XCIpLmxlbmd0aCArIDEpKydcIj48L2Rpdj4nXG5cdFx0ZGlyZWN0aW9uID0gXCJyaWdodFwiXG5cblx0XHRpZiAhY2hpbGRyZW5cblx0XHRcdCQoXCIuc2VjcmV0bWVudS1jb250YWluZXItYmFja1wiKS5odG1sKGNvbnRhaW5lcikgXG5cdFx0ZWxzZVxuXHRcdFx0JChcIi5zZWNyZXRtZW51LWNvbnRhaW5lci1iYWNrXCIpLmFwcGVuZChjb250YWluZXIpXG5cblx0XHQkKFwiLnNlY3JldG1lbnVcIikuZXEoLTEpLmh0bWwoJzxkaXYgY2xhc3M9XCJzZWNyZXRtZW51LWlubmVyXCI+JytodG1sKyc8L2Rpdj4nKVxuXG5cdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJzZWNyZXRtZW51LWluIHNlY3JldG1lbnUtXCIrZGlyZWN0aW9uKVxuXHRcdCQoXCJib2R5XCIpLmF0dHIoXCJkYXRhLXNlY3JldG1lbnUtbHZsXCIsbGVuZ3RoKVxuXG5cdFx0IyBTaSB0aWVuZSBoaWpvc1xuXHRcdCQoXCIuc2VjcmV0bWVudSB1bCBsaSBhXCIpLmVhY2ggLT5cblx0XHRcdGlmICQodGhpcykucGFyZW50KCkuZmluZChcInVsXCIpLmxlbmd0aFxuXHRcdFx0XHRpZiAhJCh0aGlzKS5oYXNDbGFzcyhcInNlY3JldG1lbnUtcGFyZW50XCIpXG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcInNlY3JldG1lbnUtcGFyZW50XCIpLnByZXBlbmQoJzxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi1yaWdodFwiPjwvaT4nKVxuXG5cdFx0IyBDbGljayBlbiBpdGVtIGRlIG1lbsO6XG5cdFx0JChcIi5zZWNyZXRtZW51IHVsIGxpIGEuc2VjcmV0bWVudS1wYXJlbnRcIikudW5iaW5kKFwiY2xpY2tcIikuYmluZCBcImNsaWNrXCIsIC0+XG5cdFx0XHRhcHAuc2VjcmV0TWVudS5vcGVuIFwiPHVsPlwiKyQodGhpcykucGFyZW50KCkuZmluZChcInVsXCIpLmh0bWwoKStcIjwvdWw+XCIsIHRydWVcblx0XHRcdGZhbHNlXG5cblx0XHQkKFwiLnNlY3JldG1lbnUgYS5zZWNyZXRtZW51LWJhY2tcIikudW5iaW5kKFwiY2xpY2tcIikuYmluZCBcImNsaWNrXCIsIC0+XG5cdFx0XHRsYXN0bWVudSA9IHBhcnNlSW50ICQoXCJib2R5XCIpLmF0dHIoXCJkYXRhLXNlY3JldG1lbnUtbHZsXCIpXG5cdFx0XHQkKFwiYm9keVwiKS5hdHRyKFwiZGF0YS1zZWNyZXRtZW51LWx2bFwiLChsYXN0bWVudS0xKSlcblx0XHRcdCQoXCIuc2VjcmV0bWVudS5zZWNyZXRtZW51LWx2bC1cIitsYXN0bWVudSkuYWRkQ2xhc3MoXCJvdXRcIilcblx0XHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdFx0JChcIi5zZWNyZXRtZW51LnNlY3JldG1lbnUtbHZsLVwiK2xhc3RtZW51KS5yZW1vdmUoKVxuXHRcdFx0LDcwMFxuXHRcdFx0ZmFsc2VcblxuXHRjbG9zZTogLT5cblxuXHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwic2VjcmV0bWVudS1vdXRcIilcblx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyBcInNlY3JldG1lbnUtaW4gc2VjcmV0bWVudS1vdXQgc2VjcmV0bWVudS1sZWZ0IHNlY3JldG1lbnUtcmlnaHQgc2VjcmV0bWVudS1sdmwtXCIrJChcImJvZHlcIikuYXR0cihcImRhdGEtc2VjcmV0bWVudS1sdmxcIilcblx0XHRcdCQoXCJib2R5XCIpLnJlbW92ZUF0dHIoXCJkYXRhLXNlY3JldG1lbnUtbHZsXCIpXG5cdFx0XHQkKFwiLnNlY3JldG1lbnVcIikucmVtb3ZlKClcblx0XHQsNzAwXG5cblxuXG5cblxuYXBwLnNoYXJlcyA9XG5cblx0aW5pdDogLT5cblx0XHQkKFwiLnNoYXJlXCIpLmNsaWNrIC0+XG5cdFx0XHRhcHAuc2hhcmVzLnNoYXJlICQodGhpcylcblxuXHRzaGFyZTogKGVsZW1lbnQpIC0+XG5cblx0XHRzaGFyZV91cmwgPSBlbmNvZGVVUklDb21wb25lbnQoZWxlbWVudC5hdHRyKFwiZGF0YS11cmxcIikpXG5cdFx0c2hhcmVfdGV4dCA9IGVuY29kZVVSSUNvbXBvbmVudChlbGVtZW50LmF0dHIoXCJkYXRhLXRleHRcIikpXG5cdFx0c2hhcmVfaW1nID0gZW5jb2RlVVJJQ29tcG9uZW50KGVsZW1lbnQuYXR0cihcImRhdGEtaW1nXCIpKVxuXG5cdFx0aWYoZWxlbWVudC5oYXNDbGFzcyhcInNoYXJlLWZhY2Vib29rXCIpKVxuXHRcdFx0YXBwLnNoYXJlcy5wb3B1cFdpbmRvdyBcImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIvc2hhcmVyLnBocD91PVwiK3NoYXJlX3VybCwgNTAwLCAzMTBcblxuXHRcdGlmKGVsZW1lbnQuaGFzQ2xhc3MoXCJzaGFyZS10d2l0dGVyXCIpKVxuXHRcdFx0YXBwLnNoYXJlcy5wb3B1cFdpbmRvdyBcImh0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3R3ZWV0P3NvdXJjZT13ZWJjbGllbnQmYW1wO3RleHQ9XCIrc2hhcmVfdGV4dCtcIiZhbXA7dXJsPVwiK3NoYXJlX3VybCwgNTAwLCAzMTBcblxuXHRcdGlmKGVsZW1lbnQuaGFzQ2xhc3MoXCJzaGFyZS1waW50ZXJlc3RcIikpXG5cdFx0XHRhcHAuc2hhcmVzLnBvcHVwV2luZG93IFwiaHR0cDovL3BpbnRlcmVzdC5jb20vcGluL2NyZWF0ZS9idXR0b24vP3VybD1cIitzaGFyZV91cmwrXCImbWVkaWE9XCIrc2hhcmVfaW1nK1wiJmRlc2NyaXB0aW9uPVwiK3NoYXJlX3RleHQsIDYyMCwgMzEwXG5cblx0XHRpZihlbGVtZW50Lmhhc0NsYXNzKFwic2hhcmUtZ29vZ2xlcGx1c1wiKSlcblx0XHRcdGFwcC5zaGFyZXMucG9wdXBXaW5kb3cgXCJodHRwczovL3BsdXMuZ29vZ2xlLmNvbS9zaGFyZT91cmw9XCIrc2hhcmVfdXJsLCA1MDAsIDMxMFxuXG5cdFx0aWYoZWxlbWVudC5oYXNDbGFzcyhcInNoYXJlLWxpbmtlZGluXCIpKVxuXHRcdFx0YXBwLnNoYXJlcy5wb3B1cFdpbmRvdyBcImh0dHA6Ly93d3cubGlua2VkaW4uY29tL3NoYXJlQXJ0aWNsZT9taW5pPXRydWUmdXJsPVwiK3NoYXJlX3VybCtcIiZ0aXRsZT1cIitzaGFyZV90ZXh0K1wiJnN1bW1hcnk9XCIrc2hhcmVfdGV4dCtcIiZzb3VyY2U9XCIrc2hhcmVfdXJsLCA1MDAsIDQyMFxuXG5cdFx0ZmFsc2VcblxuXHRwb3B1cFdpbmRvdzogKHVybCwgdywgaCkgLT5cblx0XHRsZWZ0ID0gKCAkKHdpbmRvdykud2lkdGgoKSAvIDIgKSAgLSAodyAvIDIpXG5cdFx0dG9wICA9ICggJCh3aW5kb3cpLmhlaWdodCgpIC8gMiApIC0gKGggLyAyKVxuXHRcdHJldHVybiB3aW5kb3cub3Blbih1cmwsIFwiQ29tcGFydGlyXCIsICd0b29sYmFyPW5vLCBsb2NhdGlvbj1ubywgZGlyZWN0b3JpZXM9bm8sIHN0YXR1cz1ubywgbWVudWJhcj1ubywgc2Nyb2xsYmFycz1ubywgcmVzaXphYmxlPW5vLCBjb3B5aGlzdG9yeT1ubywgd2lkdGg9Jyt3KycsIGhlaWdodD0nK2grJywgdG9wPScrdG9wKycsIGxlZnQ9JytsZWZ0KVxuXG5cblxuXG5hcHAudG9vbHRpcHMgPSAtPlxuXG5cdCQoXCJbZGF0YS10b29sdGlwXVwiKS5lYWNoIC0+XG5cdFx0cG9zID0gJCh0aGlzKS5hdHRyKFwiZGF0YS10b29sdGlwLXBvc2l0aW9uXCIpXG5cdFx0cG9zID0gXCJib3R0b21cIiBpZiAhcG9zXG5cdFx0JCh0aGlzKS5hZGRDbGFzcyBcInRvb2x0aXAtcGFyZW50XCJcblx0XHQkKHRoaXMpLmFwcGVuZCBcIjxzcGFuIGNsYXNzPSd0b29sdGlwIHRvb2x0aXAtXCIrcG9zK1wiJz48c3BhbiBjbGFzcz0ndG9vbHRpcC1jb250YWluZXInPjxzcGFuIGNsYXNzPSd0b29sdGlwLXRyaWFuZ2xlJz48L3NwYW4+PHNwYW4gY2xhc3M9J3Rvb2x0aXAtY29udGVudCc+XCIgKyAkKHRoaXMpLmF0dHIoXCJkYXRhLXRvb2x0aXBcIikgKyBcIjwvc3Bhbj48L3NwYW4+PC9zcGFuPlwiXG5cblxuXG5cblxuXG5hcHAudmFsaWRhdGlvbiA9XG5cblx0Zm9ybTogKGZvcm1zLGNhbGxiYWNrPWZhbHNlKSAtPlxuXG5cdFx0Zm9ybXMuZWFjaCAtPlxuXG5cdFx0XHRmb3JtID0gJCh0aGlzKVxuXG5cdFx0XHRmb3JtLmZpbmQoXCIuY29udHJvbCAuY29udHJvbC12YWx1ZVwiKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdjb250cm9sLW1lc3NhZ2UnPjwvZGl2PlwiKVxuXG5cdFx0XHRmb3JtLmZpbmQoXCJpbnB1dCx0ZXh0YXJlYSxzZWxlY3RcIikuZWFjaCAtPlxuXHRcdFx0XHRpbnB1dCA9ICQodGhpcylcdFx0XHRcdFxuXHRcdFx0XHRpbnB1dC5hZGRDbGFzcyggXCJpbnB1dC1cIiskKHRoaXMpLmF0dHIoXCJ0eXBlXCIpICkgaWYgJCh0aGlzKS5pcyBcImlucHV0XCJcblx0XHRcdFx0aW5wdXQuYWRkQ2xhc3MoIFwiZGlzYWJsZWRcIiApIGlmIGlucHV0LmlzKFwiOmRpc2FibGVkXCIpXG5cdFx0XHRcdGlucHV0LmxpdmUgXCJibHVyLCBjaGFuZ2VcIiwgLT5cblx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXQoaW5wdXQpXG5cblx0XHRcdGZvcm0uZmluZChcIi5pbnB1dC1jaGVja2JveCwgLmlucHV0LXJhZGlvXCIpLmVhY2ggLT5cblx0XHRcdFx0aWYgJCh0aGlzKS5pcyhcIjpjaGVja2VkXCIpXG5cdFx0XHRcdFx0JCh0aGlzKS5jbG9zZXN0KFwibGFiZWxcIikuYWRkQ2xhc3MoXCJjaGVja2VkXCIpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQkKHRoaXMpLmNsb3Nlc3QoXCJsYWJlbFwiKS5yZW1vdmVDbGFzcyhcImNoZWNrZWRcIilcblx0XHRcdFxuXHRcdFx0Zm9ybS5maW5kKFwiLmlucHV0LWNoZWNrYm94LCAuaW5wdXQtcmFkaW9cIikuY2hhbmdlIC0+XG5cdFx0XHRcdGZvcm0uZmluZChcIi5pbnB1dC1jaGVja2JveCwgLmlucHV0LXJhZGlvXCIpLmVhY2ggLT5cblx0XHRcdFx0XHRpZiAkKHRoaXMpLmlzKFwiOmNoZWNrZWRcIilcblx0XHRcdFx0XHRcdCQodGhpcykuY2xvc2VzdChcImxhYmVsXCIpLmFkZENsYXNzKFwiY2hlY2tlZFwiKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdCQodGhpcykuY2xvc2VzdChcImxhYmVsXCIpLnJlbW92ZUNsYXNzKFwiY2hlY2tlZFwiKVxuXG5cblx0XHRcdGZvcm0uZmluZChcImlucHV0Lm51bWJlclwiKS5lYWNoIC0+XG5cdFx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJudW1iZXJcIikud3JhcChcIjxkaXYgY2xhc3M9J251bWJlcic+XCIpLmFmdGVyKFwiPGRpdiBjbGFzcz0nbnVtYmVyLWJ1dHRvbiBudW1iZXItbW9yZSc+KzwvZGl2PjxkaXYgY2xhc3M9J251bWJlci1idXR0b24gbnVtYmVyLWxlc3MnPi08L2Rpdj5cIilcblxuXHRcdFx0Zm9ybS5maW5kKFwiLm51bWJlciAubnVtYmVyLWJ1dHRvblwiKS5saXZlIFwiY2xpY2tcIiwgLT5cblxuXHRcdFx0XHRfaW5wdXQgPSAkKHRoaXMpLnBhcmVudCgpLmZpbmQoXCJpbnB1dFwiKVxuXG5cdFx0XHRcdF9tYXggPSBwYXJzZUludChfaW5wdXQuYXR0cihcImRhdGEtbWF4XCIpKVxuXHRcdFx0XHRfbWluID0gcGFyc2VJbnQoX2lucHV0LmF0dHIoXCJkYXRhLW1pblwiKSlcblx0XHRcdFx0X21pbiA9IDEgaWYgIV9taW5cblxuXHRcdFx0XHRfc3RlcHMgPSBwYXJzZUludChfaW5wdXQuYXR0cihcImRhdGEtc3RlcHNcIikpXG5cdFx0XHRcdF9zdGVwcyA9IDEgaWYgIV9zdGVwc1xuXG5cdFx0XHRcdF92YWwgPSBwYXJzZUludChfaW5wdXQudmFsKCkpXG5cdFx0XHRcdF92YWwgPSBfdmFsICsgX3N0ZXBzIGlmICQodGhpcykuaGFzQ2xhc3MgXCJudW1iZXItbW9yZVwiXG5cdFx0XHRcdF92YWwgPSBfdmFsIC0gX3N0ZXBzIGlmICQodGhpcykuaGFzQ2xhc3MgXCJudW1iZXItbGVzc1wiXG5cdFx0XHRcdF92YWwgPSBfbWF4IGlmIF92YWwgPj0gX21heFxuXHRcdFx0XHRfdmFsID0gX21pbiBpZiBfdmFsIDw9IF9taW5cblxuXHRcdFx0XHRfaW5wdXQudmFsKF92YWwpXG5cdFx0XHRcdFxuXHRcdFx0XHRmYWxzZVxuXG5cdFx0XHRmb3JtLmZpbmQoXCIubnVtYmVyIGlucHV0XCIpLmxpdmUgXCJibHVyXCIsIC0+XG5cblx0XHRcdFx0X2lucHV0ID0gJCh0aGlzKVxuXG5cdFx0XHRcdF9tYXggPSBwYXJzZUludChfaW5wdXQuYXR0cihcImRhdGEtbWF4XCIpKVxuXHRcdFx0XHRfbWluID0gcGFyc2VJbnQoX2lucHV0LmF0dHIoXCJkYXRhLW1pblwiKSlcblx0XHRcdFx0X21pbiA9IDEgaWYgIV9taW5cblxuXHRcdFx0XHRfdmFsID0gcGFyc2VJbnQoX2lucHV0LnZhbCgpKVxuXHRcdFx0XHRfdmFsID0gX21heCBpZiBfdmFsID49IF9tYXhcblx0XHRcdFx0X3ZhbCA9IF9taW4gaWYgX3ZhbCA8PSBfbWluXG5cblx0XHRcdFx0X2lucHV0LnZhbChfdmFsKVxuXG5cdFx0XHRcdHRydWVcblxuXG5cblx0XHRcdGZvcm0uc3VibWl0IC0+XG5cblx0XHRcdFx0c2VuZCA9IHRydWVcblx0XHRcdFx0Zm9ybSA9ICQodGhpcykgXG5cblx0XHRcdFx0Zm9ybS5maW5kKFwiaW5wdXQsdGV4dGFyZWEsc2VsZWN0XCIpLmVhY2ggLT5cblx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXQoJCh0aGlzKSx0cnVlKVxuXG5cdFx0XHRcdGRpdmVycm9yID0gZm9ybS5maW5kKFwiLmNvbnRyb2wtZXJyb3JcIikuZXEoMClcblxuXHRcdFx0XHRpZiBkaXZlcnJvci5sZW5ndGhcblxuXHRcdFx0XHRcdHNlbmQgPSBmYWxzZVxuXHRcdFx0XHRcdHRvcCA9IGRpdmVycm9yLm9mZnNldCgpLnRvcCAtICQoXCIuaGVhZGVyLXRvcFwiKS5oZWlnaHQoKSAtIDI1XG5cblx0XHRcdFx0XHQkKFwiaHRtbCxib2R5XCIpLmFuaW1hdGVcblx0XHRcdFx0XHRcdHNjcm9sbFRvcDogdG9wXG5cblx0XHRcdFx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRcdFx0XHRkaXZlcnJvci5maW5kKFwiaW5wdXRcIikuZXEoMCkuZm9jdXMoKVxuXHRcdFx0XHRcdCw1MDBcblxuXHRcdFx0XHRpZiBzZW5kID09IHRydWVcblx0XHRcdFx0XHRpZiBjYWxsYmFja1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2soKVxuXHRcdFx0XHRcdFx0c2VuZCA9IGZhbHNlXG5cblx0XHRcdFx0cmV0dXJuIHNlbmRcblxuXG5cdGZvcm1JbnB1dDogKGlucHV0LHZhbGlkYXRlRW1wdHk9ZmFsc2UpIC0+XG5cblx0XHRwYXJlbnQgPSBpbnB1dC5jbG9zZXN0KFwiLmNvbnRyb2wtdmFsdWVcIilcblxuXHRcdGNvbnRyb2xzID0gaW5wdXQuY2xvc2VzdChcIi5jb250cm9sc1wiKVxuXHRcdGNvbnRyb2wgID0gaW5wdXQuY2xvc2VzdChcIi5jb250cm9sXCIpXG5cblx0XHRmdkVycm9ycyA9IHtcblx0XHRcdFwiZW1wdHlcIjogXCJFc3RlIGNhbXBvIGVzIHJlcXVlcmlkb1wiLFxuXHRcdFx0XCJlbXB0eVNlbGVjdFwiOiBcIlNlbGVjY2lvbmEgdW5hIG9wY2nDs25cIixcblx0XHRcdFwiZW1wdHlSYWRpb1wiOiBcIlNlbGVjY2lvbmEgdW5hIG9wY2nDs25cIixcblx0XHRcdFwiZW1wdHlDaGVja2JveFwiOiBcIlNlbGVjY2lvbmEgYWwgbWVub3MgdW5hIG9wY2nDs25cIixcblx0XHRcdFwiaW52YWxpZEVtYWlsXCI6IFwiRW1haWwgaW52w6FsaWRvXCIsXG5cdFx0XHRcImludmFsaWRFbWFpbFJlcGVhdFwiOiBcIkVsIGVtYWlsIGluZ3Jlc2FkbyBubyBlcyBpZ3VhbCBhbCBhbnRlcmlvclwiXG5cdFx0XHRcImludmFsaWRQYXNzXCI6IFwiTGEgY29udHJhc2XDsWEgZGViZSBzZXIgbWF5b3IgYSA2IGNhcsOhY3RlcmVzXCJcblx0XHRcdFwiaW52YWxpZFBhc3NSZXBlYXRcIjogXCJMYSBjb250cmFzZcOxYSBubyBlcyBpZ3VhbCBhIGxhIGFudGVyaW9yXCJcblx0XHRcdFwiaW52YWxpZFJ1dFwiOiBcIlJVVCBpbnbDoWxpZG9cIixcblx0XHRcdFwidGVybXNcIjogXCJEZWJlcyBhY2VwdGFyIGxvcyB0w6lybWlub3MgbGVnYWxlc1wiLFxuXHRcdH1cblxuXG5cdFx0aWYgIWlucHV0Lmhhc0NsYXNzKFwib3B0aW9uYWxcIikgJiYgaW5wdXQuYXR0cihcInR5cGVcIikhPVwic3VibWl0XCIgJiYgaW5wdXQuYXR0cihcInR5cGVcIikhPVwiaGlkZGVuXCIgJiYgaW5wdXQuYXR0cihcIm5hbWVcIilcblxuXHRcdFx0ZXJyb3IgPSBmYWxzZVxuXHRcdFx0XG5cdFx0XHRpZiAhaW5wdXQudmFsKClcblxuXHRcdFx0XHQjIFZhbGlkYXIgc2kgZWwgY2FtcG8gc2UgbGxlbmEgKG9wY2lvbmFsKVxuXHRcdFx0XHRpZiB2YWxpZGF0ZUVtcHR5ID09IHRydWVcblx0XHRcdFx0XHRpZiBpbnB1dC5pcyhcInNlbGVjdFwiKVxuXHRcdFx0XHRcdFx0YXBwLnZhbGlkYXRpb24uZm9ybUlucHV0TWVzc2FnZShpbnB1dCxmdkVycm9ycy5lbXB0eVNlbGVjdClcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXRNZXNzYWdlKGlucHV0LGZ2RXJyb3JzLmVtcHR5KVxuXHRcdFx0ZWxzZVxuXG5cdFx0XHRcdCMgVmFsaWRhciBlbWFpbFxuXHRcdFx0XHRpZiBpbnB1dC5pcyhcIlt0eXBlPSdlbWFpbCddXCIpXG5cdFx0XHRcdFx0aWYgISBhcHAudmFsaWRhdGlvbi5lbWFpbCggaW5wdXQsIGlucHV0LnZhbCgpICkgXG5cdFx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXRNZXNzYWdlKGlucHV0LGZ2RXJyb3JzLmludmFsaWRFbWFpbClcblx0XHRcdFx0XHRcdGVycm9yID0gdHJ1ZVxuXG5cblx0XHRcdFx0IyBWYWxpZGFyIGNvbnRyYXNlw7FhXG5cdFx0XHRcdGlmIGlucHV0LmlzKFwiW3R5cGU9J3Bhc3N3b3JkJ11cIilcblx0XHRcdFx0XHRpZiBpbnB1dC52YWwoKS5sZW5ndGggPCA2XG5cdFx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXRNZXNzYWdlKGlucHV0LGZ2RXJyb3JzLmludmFsaWRQYXNzKVxuXHRcdFx0XHRcdFx0ZXJyb3IgPSB0cnVlXG5cblxuXHRcdFx0XHQjIFZhbGlkYXIgcmVwZXRpciBjb250cmFzZcOxYVxuXHRcdFx0XHRpZiBpbnB1dC5pcyhcIltkYXRhLXJlcGVhdF1cIilcblx0XHRcdFx0XHRpZiBpbnB1dC52YWwoKSAhPSBjb250cm9scy5maW5kKFwiW25hbWU9J1wiK2lucHV0LmF0dHIoXCJkYXRhLXJlcGVhdFwiKStcIiddXCIpLnZhbCgpXG5cdFx0XHRcdFx0XHRpZiBpbnB1dC5pcyhcIlt0eXBlPSdwYXNzd29yZCddXCIpXG5cdFx0XHRcdFx0XHRcdGFwcC52YWxpZGF0aW9uLmZvcm1JbnB1dE1lc3NhZ2UoaW5wdXQsZnZFcnJvcnMuaW52YWxpZFBhc3NSZXBlYXQpXG5cdFx0XHRcdFx0XHRcdGVycm9yID0gdHJ1ZVxuXHRcdFx0XHRcdFx0aWYgaW5wdXQuaXMoXCJbdHlwZT0nZW1haWwnXVwiKVxuXHRcdFx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXRNZXNzYWdlKGlucHV0LGZ2RXJyb3JzLmludmFsaWRFbWFpbFJlcGVhdClcblx0XHRcdFx0XHRcdFx0ZXJyb3IgPSB0cnVlXG5cblxuXHRcdFx0XHQjIFZhbGlkYXIgY2hlY2tib3hzL3JhZGlvc1xuXHRcdFx0XHRpZiAoaW5wdXQuaXMoXCJbdHlwZT0nY2hlY2tib3gnXVwiKSB8fCBpbnB1dC5pcyhcIlt0eXBlPSdyYWRpbyddXCIpKVxuXHRcdFx0XHRcdGlmICFjb250cm9scy5maW5kKFwiaW5wdXRbbmFtZT0nXCIraW5wdXQuYXR0cihcIm5hbWVcIikrXCInXTpjaGVja2VkXCIpLmxlbmd0aFxuXHRcdFx0XHRcdFx0YXBwLnZhbGlkYXRpb24uZm9ybUlucHV0TWVzc2FnZShpbnB1dCxmdkVycm9ycy5lbXB0eUNoZWNrYm94KSBpZiBpbnB1dC5pcyhcIlt0eXBlPSdjaGVja2JveCddXCIpXG5cdFx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXRNZXNzYWdlKGlucHV0LGZ2RXJyb3JzLmVtcHR5UmFkaW8pICAgIGlmIGlucHV0LmlzKFwiW3R5cGU9J3JhZGlvJ11cIilcblx0XHRcdFx0XHRcdGFwcC52YWxpZGF0aW9uLmZvcm1JbnB1dE1lc3NhZ2UoaW5wdXQsZnZFcnJvcnMudGVybXMpICAgICAgICAgaWYgaW5wdXQuaXMoXCIuaW5wdXQtdGVybXNcIilcblx0XHRcdFx0XHRcdGVycm9yID0gdHJ1ZVxuXHRcdFx0XHRcdFx0cGFyZW50LmZpbmQoXCIuY29udHJvbC1lcnJvclwiKS5yZW1vdmVDbGFzcyhcImVycm9yXCIpXG5cblxuXHRcdFx0XHQjIFZhbGlkYXIgUlVUXG5cdFx0XHRcdGlmIGlucHV0LmlzKFwiLnJ1dFwiKVxuXHRcdFx0XHRcdGlucHV0LnZhbCggJC5SdXQuZm9ybWF0ZWFyKCQuUnV0LnF1aXRhckZvcm1hdG8oaW5wdXQudmFsKCkpLCQuUnV0LmdldERpZ2l0bygkLlJ1dC5xdWl0YXJGb3JtYXRvKGlucHV0LnZhbCgpKSkpIClcblx0XHRcdFx0XHRpZiAhJC5SdXQudmFsaWRhcihpbnB1dC52YWwoKSlcblx0XHRcdFx0XHRcdGFwcC52YWxpZGF0aW9uLmZvcm1JbnB1dE1lc3NhZ2UoaW5wdXQsZnZFcnJvcnMuaW52YWxpZFJ1dClcblx0XHRcdFx0XHRcdGVycm9yID0gdHJ1ZVxuXG5cdFx0XHRcdCMgU2kgbm8gaGF5IGVycm9yZXMsIHNlIHF1aXRhIGVsIG1lbnNhamUgZGUgZXJyb3Jcblx0XHRcdFx0aWYgZXJyb3IgPT0gZmFsc2Vcblx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXRNZXNzYWdlKGlucHV0LGZhbHNlKVxuXG5cblxuXHRmb3JtSW5wdXRNZXNzYWdlOiAoaW5wdXQsbWVzc2FnZSkgLT5cblx0XHRpZiBtZXNzYWdlXG5cdFx0XHRpbnB1dC5hZGRDbGFzcyhcImNvbnRyb2wtZXJyb3JcIilcblx0XHRcdHBhcmVudCA9IGlucHV0LmNsb3Nlc3QoXCIuY29udHJvbC12YWx1ZVwiKVxuXHRcdFx0cGFyZW50LmFkZENsYXNzKFwiY29udHJvbC1lcnJvclwiKVxuXHRcdFx0cGFyZW50LmZpbmQoXCIuY29udHJvbC1tZXNzYWdlXCIpLnRleHQobWVzc2FnZSkuYWRkQ2xhc3MoXCJpblwiKVxuXHRcdGVsc2Vcblx0XHRcdGlucHV0LnJlbW92ZUNsYXNzKFwiY29udHJvbC1lcnJvclwiKVxuXHRcdFx0cGFyZW50ID0gaW5wdXQuY2xvc2VzdChcIi5jb250cm9sLXZhbHVlXCIpXG5cdFx0XHRwYXJlbnQucmVtb3ZlQ2xhc3MoXCJjb250cm9sLWVycm9yXCIpXHRcblx0XHRcdHBhcmVudC5maW5kKFwiLmNvbnRyb2wtbWVzc2FnZVwiKS5hZGRDbGFzcyhcIm91dFwiKVxuXHRcdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0XHRwYXJlbnQuZmluZChcIi5jb250cm9sLW1lc3NhZ2VcIikucmVtb3ZlQ2xhc3MoXCJpbiBvdXRcIikudGV4dChcIlwiKVxuXHRcdFx0LDUwMFxuXG5cblxuXHRlbWFpbDogKGVsZW1lbnRvLHZhbG9yKSAtPlxuXHRcdGlmIC9eKChbXjw+KClbXFxdXFxcXC4sOzpcXHNAXFxcIl0rKFxcLltePD4oKVtcXF1cXFxcLiw7Olxcc0BcXFwiXSspKil8KFxcXCIuK1xcXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXF0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvLnRlc3QodmFsb3IpXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBmYWxzZVxuXG5cblxuXG5cbiJdfQ==