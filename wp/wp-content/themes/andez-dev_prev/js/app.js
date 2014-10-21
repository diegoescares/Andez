(function() {
  var addFont, app, checkFont, checkFontT, checkwidth_prev, loadFont, loadPage, renderPage, searchLoadFont;

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
        to = $(goto).offset().top;
        console.log(to);
        $("html,body,.secretmenu-container-front").animate({
          scrollTop: to
        });
        if (goto === "#test-font-container") {
          setTimeout(function() {
            return $(".test-font-h1.live").focus();
          }, 500);
        }
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
        console.log(url);
        $(".single-font-header").removeClass("animation-right");
        $(".single-font-header").removeClass("animation-left");
        if (dir === "left") {
          $(".single-font-header").addClass("animation-right-out");
        }
        if (dir === "right") {
          $(".single-font-header").addClass("animation-left-out");
        }
        $(".test-font").addClass("out");
        return setTimeout(function() {
          return $(".single-font-header").load(url + " .single-font-header>", function() {
            var newfont, newfont_id;
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
        }, 500);
      }
    },
    presentation: function() {
      var texts;
      texts = ["Lorem ipsum dolor sit amet", "Repellendus, inventore, nemo.", "423-89(08)*2+83591", "Doloremque placeat cupiditate", "Amet quod sint adipisci.", "$%&*=?{+", "Itaque nihil officiis.", "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"];
      $(".hola").each(function() {
        var div, font, i, rand, rand_size, rand_text, rand_top, _i;
        div = $(this);
        rand = Math.floor((Math.random() * 10) + 1);
        for (i = _i = 1; _i <= 8; i = ++_i) {
          rand_text = Math.floor((Math.random() * 7) + 1);
          rand_size = Math.floor((Math.random() * 200) + 1);
          rand_top = i * 10;
          console.log(rand + " " + texts[rand]);
          div.find(".hola-bg").append("<div class='chao chao-" + i + "' style='font-size:" + rand_size + "px;top:" + rand_top + "%;'>" + texts[rand_text] + "</div>");
        }
        font = div.attr("data-font");
        app.fonts.add(font);
        return div.css({
          "font-family": font
        });
      });
      searchLoadFont();

      /*
      		$(".font").each ->
      			 * Insert font
      			div = $(this)
      			font = div.attr("data-font")
      			console.log font
      			app.fonts.add font
      			div.css
      				"font-family": font
       */
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
            console.log(inst.parent().find("input,textarea"));
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
        console.log(tool_calculate + "px");
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

  addFont = function(font, font_id) {
    if (!$("head").find('link[data-font="' + font_id + '"]').length) {
      return $("head").append('<link href="' + $("body").attr("data-url") + '/wp-content/fonts/' + font_id + '/font.css" rel="stylesheet" type="text/css" data-font="' + font_id + '" />');
    }
  };

  checkwidth_prev = false;

  checkFont = function(fontdiv, font) {
    $(".checkloadfont").remove();
    $("body").append("<span class='checkloadfont' style='position:absolute;top:-100px;left:0;background:#999;font-family:serif;'>abcijl!$%&/o0</span>");
    checkwidth_prev = false;
    return checkFontT(fontdiv, font);
  };

  checkFontT = function(fontdiv, font) {
    var checkdiv, checkwidth;
    console.log("checkeando");
    checkdiv = $(".checkloadfont");
    checkwidth = checkdiv.width();
    $(".checkloadfont").css({
      "font-family": font
    });
    console.log(checkwidth + " vs " + checkwidth_prev);
    if (checkwidth !== checkwidth_prev && checkwidth_prev !== false) {
      fontdiv.addClass('font-loaded');
      console.log("--- Fuente cargada");
      searchLoadFont();
    } else {
      console.log("dsadsa");
      setTimeout(function() {
        return checkFontT(fontdiv, font);
      }, 50);
    }
    return checkwidth_prev = checkwidth;
  };

  loadFont = function(fontdiv, callback) {
    var font, font_id;
    if (callback == null) {
      callback = false;
    }
    font = fontdiv.attr("data-font");
    font_id = fontdiv.attr("data-font-id");
    addFont(font, font_id);
    fontdiv.css({
      "font-family": font
    });
    fontdiv.find("div,input").css({
      "font-family": font
    });
    console.log("--- Fuente puesta");
    return checkFont(fontdiv, font);
  };

  searchLoadFont = function() {
    var foundfont;
    foundfont = $(".font:not(.font-loaded)").eq(0);
    console.log("*-- Fuente a cargar: " + foundfont.attr("data-font"));
    if (foundfont.length) {
      return loadFont(foundfont, searchLoadFont);
    }
  };

  loadPage = function(href) {
    return $.ajax({
      type: "GET",
      url: href,
      async: false,
      success: function(html) {
        var page, scroll_current, scroll_page;
        html = $(html);
        page = html.find(".page");
        console.log(page);
        $("#body").prepend(page);
        scroll_current = $(window).scrollTop();
        scroll_page = $(".page").eq(0).innerHeight() + scroll_current;
        $(window).scrollTop(scroll_page);
        $("html,body").animate({
          scrollTop: 0
        }, 800);
        setTimeout(function() {
          return $("#test-article-font").focus();
        }, 900);
        return renderPage();
      }
    });
  };

  renderPage = function() {
    searchLoadFont();
    if ($(".isotope").length) {
      return $(".isotope").isotope();
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

//# sourceMappingURL=data:application/json;base64,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QUMsSUFBUCxDQUFZLGtCQUFaLENBQStCLENBQUMsUUFBaEMsQ0FBeUMsS0FBekMsQ0FIQSxDQUFBO2VBSUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtpQkFDVixNQUFNLENBQUMsSUFBUCxDQUFZLGtCQUFaLENBQStCLENBQUMsV0FBaEMsQ0FBNEMsUUFBNUMsQ0FBcUQsQ0FBQyxJQUF0RCxDQUEyRCxFQUEzRCxFQURVO1FBQUEsQ0FBWCxFQUVDLEdBRkQsRUFWRDtPQURpQjtJQUFBLENBeExsQjtBQUFBLElBeU1BLEtBQUEsRUFBTyxTQUFDLFFBQUQsRUFBVSxLQUFWLEdBQUE7QUFDTixNQUFBLElBQUcsMkpBQTJKLENBQUMsSUFBNUosQ0FBaUssS0FBakssQ0FBSDtBQUNDLGVBQU8sSUFBUCxDQUREO09BQUEsTUFBQTtBQUdDLGVBQU8sS0FBUCxDQUhEO09BRE07SUFBQSxDQXpNUDtHQTMrQkQsQ0FBQTtBQUFBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIlxuJChkb2N1bWVudCkucmVhZHkgLT5cblx0YXBwLmluaXQoKVxuXG5hcHAgPVxuXG5cdGluaXQ6IC0+XG5cblx0XHQjIEJyb3dzZXJzXG5cdFx0I2FwcC5icm93c2VycygpXG5cblx0XHQjIE1lbsO6XG5cdFx0YXBwLnNlY3JldE1lbnUuaW5pdCgpXG5cblx0XHQjIFNoYXJlc1xuXHRcdGFwcC5zaGFyZXMuaW5pdCgpXG5cblx0XHQjIFRvb2x0aXBzXG5cdFx0YXBwLnRvb2x0aXBzKClcblxuXHRcdCMgQWxlcnRhc1xuXHRcdGFwcC5hbGVydC5pbml0KClcblxuXHRcdCMgVmFsaWRhY2nDs24gZGUgZm9ybXVsYXJpb3Ncblx0XHRhcHAudmFsaWRhdGlvbi5mb3JtICQoXCJmb3JtLmNvbnRyb2xzXCIpXG5cblx0XHQjIExvYWRpbmdcblx0XHRhcHAubG9hZGluZy5pbml0KClcblxuXHRcdCMgRXZlbnRvcyBlbiBzY3JvbGxcblx0XHRhcHAuc2Nyb2xsKClcblxuXHRcdCMgUGx1Z2luc1xuXHRcdGFwcC5wbHVnaW5zLmluaXQoKVxuXG5cdFx0IyBBY3Rpb25zXG5cdFx0YXBwLmFjdGlvbnMuaW5pdCgpXG5cblx0XHQjIEZvbnRzXG5cdFx0YXBwLmZvbnRzLmluaXQoKVxuXG4jPWluY2x1ZGVfdHJlZSBhcHBcblxuXG5hcHAuYWN0aW9ucyA9XG5cblx0aW5pdDogLT5cblxuXHRcdCQoXCJbZGF0YS1nb3RvXVwiKS5jbGljayAtPlxuXHRcdFx0Z290byA9ICQodGhpcykuYXR0cihcImRhdGEtZ290b1wiKVxuXHRcdFx0dG8gICA9ICQoZ290bykub2Zmc2V0KCkudG9wXG5cdFx0XHRjb25zb2xlLmxvZyB0b1xuXHRcdFx0JChcImh0bWwsYm9keSwuc2VjcmV0bWVudS1jb250YWluZXItZnJvbnRcIikuYW5pbWF0ZVxuXHRcdFx0XHRzY3JvbGxUb3A6IHRvXG5cdFx0XHRcblx0XHRcdGlmIGdvdG8gPT0gXCIjdGVzdC1mb250LWNvbnRhaW5lclwiXG5cdFx0XHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdFx0XHQkKFwiLnRlc3QtZm9udC1oMS5saXZlXCIpLmZvY3VzKClcblx0XHRcdFx0LDUwMFxuXG5cdFx0XHRmYWxzZVxuXG5cblxuXG5hcHAuYWxlcnQgPVxuXG5cdGluaXQ6IC0+XG5cdFx0YXBwLmFsZXJ0LmVxdWlkaXN0KClcblx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRhcHAuYWxlcnQuZXF1aWRpc3QoKVxuXHRcdCwxMDBcblx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRhcHAuYWxlcnQuZXF1aWRpc3QoKVxuXHRcdCwxMDAwXG5cdFx0JCh3aW5kb3cpLnJlc2l6ZSAtPlxuXHRcdFx0YXBwLmFsZXJ0LmVxdWlkaXN0KClcblxuXG5cdFx0aWYgJChcIltkYXRhLWFsZXJ0XVwiKS5sZW5ndGhcblxuXHRcdFx0JChcImFbZGF0YS1hbGVydF1cIikubGl2ZSBcImNsaWNrXCIsIC0+XG5cdFx0XHRcdGVsZW1lbnQgPSAkKHRoaXMpXG5cdFx0XHRcdGFwcC5hbGVydC5vcGVuXG5cdFx0XHRcdFx0dGl0bGU6IGVsZW1lbnQuYXR0cihcImRhdGEtdGl0bGVcIilcblx0XHRcdFx0XHRjb250ZW50OiBlbGVtZW50LmF0dHIoXCJkYXRhLWNvbnRlbnRcIilcblx0XHRcdFx0XHRhY2NlcHQ6IHRydWVcblx0XHRcdFx0XHRjYW5jZWw6IHRydWVcblx0XHRcdFx0XHRjYWxsYmFja190cnVlOiAtPlxuXHRcdFx0XHRcdFx0bG9jYXRpb24uaHJlZiA9IGVsZW1lbnQuYXR0cihcImhyZWZcIilcblx0XHRcdFx0ZmFsc2VcblxuXHRcdFx0JChcIltkYXRhLWFsZXJ0XVwiKS5lYWNoIC0+XG5cdFx0XHRcdGVsZW1lbnQgPSAkKHRoaXMpXG5cdFx0XHRcdGlmICFlbGVtZW50LmlzKFwiYVwiKSAmJiAhZWxlbWVudC5pcyhcImJ1dHRvblwiKVxuXHRcdFx0XHRcdGFwcC5hbGVydC5vcGVuXG5cdFx0XHRcdFx0XHR0aXRsZTogZWxlbWVudC5hdHRyKFwiZGF0YS10aXRsZVwiKVxuXHRcdFx0XHRcdFx0Y29udGVudDogZWxlbWVudC5hdHRyKFwiZGF0YS1jb250ZW50XCIpXG5cdFx0XHRcdFx0XHRhY2NlcHQ6IHRydWVcblx0XHRcdFx0XHRcdGNhbmNlbDogdHJ1ZVxuXG5cblx0b3BlbjogKG9wdGlvbnMpIC0+XG5cblx0XHR0aXRsZSA9IFwiXCJcblx0XHRjb250ZW50ID0gXCJcIlxuXHRcdGJ1dHRvbnMgPSBcIlwiXG5cdFx0Y2xvc2UgPSBcIlwiXG5cblx0XHRpZiBvcHRpb25zLnN0YXRpYyA9PSB0cnVlXG5cdFx0XHRhbGVydGxpZ2h0Y2xhc3MgICAgPSAnJ1xuXHRcdFx0b3B0aW9ucy5jbG9zZSA9IGZhbHNlXG5cdFx0ZWxzZVxuXHRcdFx0YWxlcnRsaWdodGNsYXNzID0gJyBmYWxzZSdcblxuXHRcdGlmIG9wdGlvbnMuYWxlcnRjbGFzc1xuXHRcdFx0YWxlcnRjbGFzcyA9IFwiYWxlcnQtXCIgKyBvcHRpb25zLmFsZXJ0Y2xhc3Ncblx0XHRlbHNlXG5cdFx0XHRhbGVydGNsYXNzID0gXCJhbGVydC1kZWZhdWx0XCJcblxuXHRcdGlmIG9wdGlvbnMudGl0bGVcblx0XHRcdHRpdGxlID0gXCI8aDIgY2xhc3M9J2FsZXJ0LXRpdGxlJz5cIiArIG9wdGlvbnMudGl0bGUgKyBcIjwvaDI+XCJcblxuXHRcdGlmIG9wdGlvbnMuY29udGVudFxuXHRcdFx0Y29udGVudCA9IFwiPGRpdiBjbGFzcz0nYWxlcnQtY29udGVudCc+XCIgKyBvcHRpb25zLmNvbnRlbnQgKyBcIjwvZGl2PlwiXG5cblx0XHRpZiBvcHRpb25zLmNsb3NlID09IHVuZGVmaW5lZFxuXHRcdFx0b3B0aW9ucy5jbG9zZSA9IHRydWVcblxuXHRcdGlmIG9wdGlvbnMuY2xvc2UgPT0gdHJ1ZVxuXHRcdFx0Y2xvc2UgPSAnPGJ1dHRvbiBjbGFzcz1cImFsZXJ0LWNsb3NlIGZhbHNlXCI+PGkgY2xhc3M9XCJmYSBmYS10aW1lc1wiPjwvaT48L2J1dHRvbj4nXG5cblx0XHRpZiBvcHRpb25zLmJ1dHRvbnNcblx0XHRcdGJ1dHRvbnMgKz0gb3B0aW9ucy5idXR0b25zICsgXCIgXCJcblxuXHRcdGlmIG9wdGlvbnMuY2FuY2VsID09IHRydWVcblx0XHRcdGJ1dHRvbnMgKz0gJzxidXR0b24gY2xhc3M9XCJidXR0b24gZmFsc2VcIj5DYW5jZWxhcjwvYnV0dG9uPiAnXG5cblx0XHRpZiBvcHRpb25zLmFjY2VwdCA9PSB0cnVlXG5cdFx0XHRidXR0b25zICs9ICc8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJ1dHRvbi1wcmltYXJ5IHRydWVcIj5BY2VwdGFyPC9idXR0b24+ICdcblxuXHRcdGlmIGJ1dHRvbnNcblx0XHRcdGJ1dHRvbnMgPSAnPGRpdiBjbGFzcz1cImFsZXJ0LWJ1dHRvbnNcIj4nK2J1dHRvbnMrJzwvZGl2PidcblxuXG5cdFx0aHRtbCA9XG5cdFx0XHQnPGRpdiBjbGFzcz1cImFsZXJ0ICcrYWxlcnRjbGFzcysnIGluXCI+Jytcblx0XHRcdFx0JzxkaXYgY2xhc3M9XCJhbGVydC1saWdodCAnK2FsZXJ0bGlnaHRjbGFzcysnXCI+PC9kaXY+Jytcblx0XHRcdFx0JzxkaXYgY2xhc3M9XCJhbGVydC1ib3ggZXF1aWRpc3RcIj4nK1xuXHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwiYWxlcnQtaW5uZXJcIj4nK1xuXHRcdFx0XHRcdFx0Y2xvc2UgK1xuXHRcdFx0XHRcdFx0dGl0bGUgK1xuXHRcdFx0XHRcdFx0Y29udGVudCArXG5cdFx0XHRcdFx0XHRidXR0b25zICtcblx0XHRcdFx0XHQnPC9kaXY+Jytcblx0XHRcdFx0JzwvZGl2PicrXG5cdFx0XHQnPC9kaXY+J1xuXG5cblx0XHQkKFwiYm9keVwiKS5hcHBlbmQoaHRtbClcblx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcImFsZXJ0LWluXCIpXG5cblx0XHRhcHAuYWxlcnQuZXF1aWRpc3QoKVxuXG5cblx0XHQkKFwiLmFsZXJ0IC50cnVlLCAuYWxlcnQgLmZhbHNlXCIpLnVuYmluZChcImNsaWNrXCIpLmJpbmQgXCJjbGlja1wiLCAtPiBcblxuXHRcdFx0YWxlcnRvcmlnaW4gPSAkKHRoaXMpLmNsb3Nlc3QoXCIuYWxlcnRcIilcblxuXHRcdFx0YWxlcnRvcmlnaW4uYWRkQ2xhc3MoXCJvdXRcIilcblx0XHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdFx0YWxlcnRvcmlnaW4ucmVtb3ZlKClcblx0XHRcdFx0I2FsZXJ0b3JpZ2luLnJlbW92ZUNsYXNzKFwiaW4gb3V0XCIpXG5cdFx0XHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiYWxlcnQtaW5cIilcblx0XHRcdCwyMDBcblxuXHRcdFx0aWYgJCh0aGlzKS5oYXNDbGFzcyhcInRydWVcIikgJiYgb3B0aW9ucy5jYWxsYmFja190cnVlXG5cdFx0XHRcdG9wdGlvbnMuY2FsbGJhY2tfdHJ1ZSgpXG5cblx0XHRcdGlmICQodGhpcykuaGFzQ2xhc3MoXCJmYWxzZVwiKSAmJiBvcHRpb25zLmNhbGxiYWNrX2ZhbHNlXG5cdFx0XHRcdG9wdGlvbnMuY2FsbGJhY2tfZmFsc2UoKVxuXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXG5cdGNsb3NlYWxsOiAtPlxuXHRcdCQoXCIuYWxlcnRcIikuYWRkQ2xhc3MoXCJvdXRcIilcblx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImFsZXJ0LWluXCIpXG5cblx0cmVtb3ZlYWxsOiAtPlxuXHRcdCQoXCIuYWxlcnRcIikuYWRkQ2xhc3MoXCJvdXRcIilcblx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHQkKFwiLmFsZXJ0XCIpLnJlbW92ZSgpXG5cdFx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImFsZXJ0LWluXCIpXG5cdFx0LDIwMFxuXG5cdGVxdWlkaXN0OiAtPlxuXHRcdCQoXCIuZXF1aWRpc3RcIikuZWFjaCAtPlxuXHRcdFx0X3RoaXMgPSAkKHRoaXMpXG5cdFx0XHRfbGVmdCA9IChfdGhpcy5wYXJlbnQoKS53aWR0aCgpIC0gX3RoaXMud2lkdGgoKSkgLyAyXG5cdFx0XHRfbGVmdCA9IDAgaWYgX2xlZnQgPCAwXG5cdFx0XHRfdG9wID0gKF90aGlzLnBhcmVudCgpLmhlaWdodCgpIC0gX3RoaXMuaGVpZ2h0KCkpIC8gMlxuXHRcdFx0X3RvcCA9IDAgaWYgX3RvcCA8IDBcblx0XHRcdF90aGlzLmNzc1xuXHRcdFx0ICBsZWZ0OiBfbGVmdCArIFwicHhcIlxuXHRcdFx0ICB0b3A6IF90b3AgKyBcInB4XCJcblxuXHRsb2FkOiAoaHJlZixjc3NjbGFzcz1cImRlZmF1bHRcIixjYWxsYmFjaz1mYWxzZSkgLT5cblx0XHQkLmFqYXgoXG5cdFx0XHR1cmw6IGhyZWZcblx0XHRcdHR5cGU6ICdHRVQnXG5cdFx0KS5kb25lIChyZXN1bHQpIC0+XG5cdFx0XHRhcHAuYWxlcnQub3BlblxuXHRcdFx0XHRjb250ZW50OiByZXN1bHRcblx0XHRcdFx0YWxlcnRjbGFzczogY3NzY2xhc3Ncblx0XHRcdGlmIGNhbGxiYWNrXG5cdFx0XHRcdGNhbGxiYWNrKClcblx0XHRcdCNhcHAucGx1Z2lucy5yZWxheW91dCgpXG5cblxuXG5cbmFwcC5pc01vYmlsZSA9IC0+XG5cdGlmIC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KVxuXHRcdHRydWVcblx0ZWxzZVxuXHRcdGZhbHNlXG5cbmFwcC5icm93c2VycyA9IC0+XG5cblx0IyBNb2JpbGVcblx0aWYgYXBwLmlzTW9iaWxlKClcblx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcImlzLW1vYmlsZVwiKVxuXG5cdCMgSUVcblx0aWYgJC5icm93c2VyLm1zaWUgfHwgbmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZignVHJpZGVudC8nKSE9LTFcblx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcImlzLWllXCIpXG5cdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJpcy1pZVwiKyQuYnJvd3Nlci52ZXJzaW9uKVxuXHRcdGlmIHBhcnNlSW50KCQuYnJvd3Nlci52ZXJzaW9uKSA8PSA3XG5cdFx0XHRhcHAuYWxlcnQub3BlblxuXHRcdFx0XHR0aXRsZTogXCJFc3TDoXMgdXNhbmRvIHVuIG5hdmVnYWRvciBtdXkgYW50aWd1b1wiXG5cdFx0XHRcdGNvbnRlbnQ6IFwiQWN0dWFsaXphIHR1IG5hdmVnYWRvciBhaG9yYSB5IGRpc2ZydXRhIGRlIHVuYSBtZWpvciBleHBlcmllbmNpYSBlbiBGYWxhYmVsbGEgTm92aW9zLlwiXG5cdFx0XHRcdGJ1dHRvbnM6IFwiPGEgaHJlZj0naHR0cDovL2Jyb3dzZWhhcHB5LmNvbS8/bG9jYWxlPWVzJyB0YXJnZXQ9J19ibGFuaycgY2xhc3M9J2J1dHRvbiBidXR0b24tcHJpbWFyeSBidXR0b24tYmlnJz5BY3R1YWxpemFyIGFob3JhPC9hPlwiXG5cdFx0XHRcdHN0YXRpYzogdHJ1ZVxuXG5cblxuYXBwLmNvb2tpZSA9IFxuXG5cdGNyZWF0ZTogKG5hbWUsIHZhbHVlLCBkYXlzKSAtPlxuXHRcdGlmIGRheXNcblx0XHRcdGRhdGUgPSBuZXcgRGF0ZSgpXG5cdFx0XHRkYXRlLnNldFRpbWUgZGF0ZS5nZXRUaW1lKCkgKyAoZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApXG5cdFx0XHRleHBpcmVzID0gXCI7IGV4cGlyZXM9XCIgKyBkYXRlLnRvR01UU3RyaW5nKClcblx0XHRlbHNlXG5cdFx0XHRleHBpcmVzID0gXCJcIlxuXHRcdGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIHZhbHVlICsgZXhwaXJlcyArIFwiOyBwYXRoPS9cIlxuXG5cdHJlYWQ6IChuYW1lKSAtPlxuXHRcdG5hbWVFUSA9IG5hbWUgKyBcIj1cIlxuXHRcdGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KFwiO1wiKVxuXHRcdGkgPSAwXG5cblx0XHR3aGlsZSBpIDwgY2EubGVuZ3RoXG5cdFx0XHRjID0gY2FbaV1cblx0XHRcdGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCkgIHdoaWxlIGMuY2hhckF0KDApIGlzIFwiIFwiXG5cdFx0XHRyZXR1cm4gYy5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCwgYy5sZW5ndGgpICBpZiBjLmluZGV4T2YobmFtZUVRKSBpcyAwXG5cdFx0XHRpKytcblx0XHRudWxsXG5cblx0ZGVsZXRlOiAobmFtZSkgLT5cblx0XHRhcHAuY29va2llLmNyZWF0ZSBuYW1lLCBcIlwiLCAtMVxuXG5cblxuXG5cbmFwcC5mb250cyA9XG5cblx0aW5pdDogLT5cblxuXHRcdGFwcC5mb250cy50b29scy5pbml0KClcblx0XHRhcHAuZm9udHMucHJlc2VudGF0aW9uKClcblx0XHRhcHAuZm9udHMubmF2LmluaXQoKVxuXG5cdFx0YXBwLmZvbnRzLmluc3RydWN0aW9ucy5pbml0KClcblxuXG5cdGFkZDogKGZvbnQsZm9udF9pZCkgLT5cblxuXHRcdGlmICEkKFwiaGVhZFwiKS5maW5kKCdsaW5rW2RhdGEtZm9udC1pZD1cIicrZm9udF9pZCsnXCJdJykubGVuZ3RoXG5cdFx0XHQkKFwiaGVhZFwiKS5hcHBlbmQgJzxsaW5rIGhyZWY9XCInKyQoXCJib2R5XCIpLmF0dHIoXCJkYXRhLXVybFwiKSsnL3dwLWNvbnRlbnQvZm9udHMvJytmb250X2lkKycvZm9udC5jc3NcIiByZWw9XCJzdHlsZXNoZWV0XCIgdHlwZT1cInRleHQvY3NzXCIgZGF0YS1mb250PVwiJytmb250X2lkKydcIiAvPidcblxuXG5cblx0bmF2OlxuXHRcdGluaXQ6IC0+XG5cdFx0XHQkKFwiLnNpbmdsZS1mb250LW5hdmlnYXRpb24gLm5hdlwiKS51bmJpbmQoXCJjbGlja1wiKS5iaW5kIFwiY2xpY2tcIiwgLT5cblx0XHRcdFx0YXBwLmZvbnRzLm5hdi5sb2FkICQodGhpcylcblx0XHRcdFx0ZmFsc2VcblxuXHRcdGxvYWQ6IChlbGVtZW50KSAtPlxuXG5cdFx0XHR1cmwgPSBlbGVtZW50LmF0dHIoXCJocmVmXCIpLnNwbGl0KCcgJykuam9pbignJTIwJyk7XG5cblx0XHRcdGRpciA9IGZhbHNlXG5cdFx0XHRkaXIgPSBcInJpZ2h0XCIgaWYgZWxlbWVudC5oYXNDbGFzcyhcIm5hdi1yaWdodFwiKVxuXHRcdFx0ZGlyID0gXCJsZWZ0XCIgIGlmIGVsZW1lbnQuaGFzQ2xhc3MoXCJuYXYtbGVmdFwiKVxuXG5cdFx0XHRjb25zb2xlLmxvZyB1cmxcblxuXHRcdFx0JChcIi5zaW5nbGUtZm9udC1oZWFkZXJcIikucmVtb3ZlQ2xhc3MgXCJhbmltYXRpb24tcmlnaHRcIlxuXHRcdFx0JChcIi5zaW5nbGUtZm9udC1oZWFkZXJcIikucmVtb3ZlQ2xhc3MgXCJhbmltYXRpb24tbGVmdFwiXG5cblx0XHRcdCQoXCIuc2luZ2xlLWZvbnQtaGVhZGVyXCIpLmFkZENsYXNzIFwiYW5pbWF0aW9uLXJpZ2h0LW91dFwiIGlmIGRpcj09XCJsZWZ0XCJcblx0XHRcdCQoXCIuc2luZ2xlLWZvbnQtaGVhZGVyXCIpLmFkZENsYXNzIFwiYW5pbWF0aW9uLWxlZnQtb3V0XCIgIGlmIGRpcj09XCJyaWdodFwiXG5cblx0XHRcdCQoXCIudGVzdC1mb250XCIpLmFkZENsYXNzIFwib3V0XCJcblxuXHRcdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0XHQkKFwiLnNpbmdsZS1mb250LWhlYWRlclwiKS5sb2FkIHVybCtcIiAuc2luZ2xlLWZvbnQtaGVhZGVyPlwiLCAtPlxuXHRcdFx0XHRcdCQoXCIuc2luZ2xlLWZvbnQtaGVhZGVyXCIpLnJlbW92ZUNsYXNzIFwiYW5pbWF0aW9uLXJpZ2h0LW91dFwiXG5cdFx0XHRcdFx0JChcIi5zaW5nbGUtZm9udC1oZWFkZXJcIikucmVtb3ZlQ2xhc3MgXCJhbmltYXRpb24tbGVmdC1vdXRcIiBcblx0XHRcdFx0XHQkKFwiLnNpbmdsZS1mb250LWhlYWRlclwiKS5hZGRDbGFzcyBcImFuaW1hdGlvbi1cIitkaXJcblxuXHRcdFx0XHRcdG5ld2ZvbnQgPSAkKFwiaDFcIikuYXR0cihcImRhdGEtZm9udFwiKVxuXHRcdFx0XHRcdG5ld2ZvbnRfaWQgPSAkKFwiaDFcIikuYXR0cihcImRhdGEtZm9udC1pZFwiKVxuXG5cdFx0XHRcdFx0aWYgbmV3Zm9udF9pZFxuXG5cdFx0XHRcdFx0XHQkKFwiLnRlc3QtZm9udFwiKS5hdHRyIFwiZGF0YS1mb250XCIsIG5ld2ZvbnRcblx0XHRcdFx0XHRcdCQoXCIudGVzdC1mb250LWgxLCAudGVzdC1mb250LXBcIikuY3NzXG5cdFx0XHRcdFx0XHRcdFwiZm9udC1mYW1pbHlcIjogbmV3Zm9udFxuXG5cdFx0XHRcdFx0XHQkKFwiLnRlc3QtZm9udFwiKS5yZW1vdmVDbGFzcyhcIm91dFwiKS5hZGRDbGFzcyBcImluXCJcblxuXHRcdFx0XHRcdFx0YXBwLmZvbnRzLmFkZCBuZXdmb250LCBuZXdmb250X2lkXG5cdFx0XHRcdFx0XHRhcHAuZm9udHMudG9vbHMudGV4dGFyZWFoZWlnaHQoKVxuXHRcdFx0XHRcdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0XHRcdFx0XHRhcHAuZm9udHMudG9vbHMudGV4dGFyZWFoZWlnaHQoKVxuXHRcdFx0XHRcdFx0LDEwMDBcblxuXHRcdFx0XHRcdFx0YXBwLmZvbnRzLm5hdi5pbml0KClcblx0XHRcdFx0XHRcdGFwcC5hY3Rpb25zLmluaXQoKVxuXHRcdFx0LDUwMFxuXG5cblx0cHJlc2VudGF0aW9uOiAtPlxuXG5cdFx0dGV4dHMgPSBbXG5cdFx0XHRcIkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0XCIsXG5cdFx0XHRcIlJlcGVsbGVuZHVzLCBpbnZlbnRvcmUsIG5lbW8uXCIsXG5cdFx0XHRcIjQyMy04OSgwOCkqMis4MzU5MVwiLFxuXHRcdFx0XCJEb2xvcmVtcXVlIHBsYWNlYXQgY3VwaWRpdGF0ZVwiLFxuXHRcdFx0XCJBbWV0IHF1b2Qgc2ludCBhZGlwaXNjaS5cIixcblx0XHRcdFwiJCUmKj0/eytcIixcblx0XHRcdFwiSXRhcXVlIG5paGlsIG9mZmljaWlzLlwiXG5cdFx0XHRcIkFCQ0RFRkdISUpLTE1Ow5FPUFFSU1RVVldYWVpcIlxuXHRcdF1cblxuXHRcdCQoXCIuaG9sYVwiKS5lYWNoIC0+XG5cdFx0XHRkaXYgPSAkKHRoaXMpXG5cdFx0XHRyYW5kID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDEwKSArIDEpXG5cdFx0XHRmb3IgaSBpbiBbMS4uOF1cblx0XHRcdFx0cmFuZF90ZXh0ID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDcpICsgMSlcblx0XHRcdFx0cmFuZF9zaXplID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDIwMCkgKyAxKVxuXHRcdFx0XHRyYW5kX3RvcCA9IGkqMTBcblx0XHRcdFx0Y29uc29sZS5sb2cgcmFuZCArIFwiIFwiICsgdGV4dHNbcmFuZF0gXG5cdFx0XHRcdGRpdi5maW5kKFwiLmhvbGEtYmdcIikuYXBwZW5kIFwiPGRpdiBjbGFzcz0nY2hhbyBjaGFvLVwiK2krXCInIHN0eWxlPSdmb250LXNpemU6XCIrcmFuZF9zaXplK1wicHg7dG9wOlwiK3JhbmRfdG9wK1wiJTsnPlwiK3RleHRzW3JhbmRfdGV4dF0rXCI8L2Rpdj5cIlxuXG5cdFx0XHQjIEluc2VydCBmb250XG5cdFx0XHRmb250ID0gZGl2LmF0dHIoXCJkYXRhLWZvbnRcIilcblx0XHRcdGFwcC5mb250cy5hZGQgZm9udFxuXHRcdFx0ZGl2LmNzc1xuXHRcdFx0XHRcImZvbnQtZmFtaWx5XCI6IGZvbnRcblxuXG5cdFx0c2VhcmNoTG9hZEZvbnQoKVxuXG5cdFx0IyMjXG5cdFx0JChcIi5mb250XCIpLmVhY2ggLT5cblx0XHRcdCMgSW5zZXJ0IGZvbnRcblx0XHRcdGRpdiA9ICQodGhpcylcblx0XHRcdGZvbnQgPSBkaXYuYXR0cihcImRhdGEtZm9udFwiKVxuXHRcdFx0Y29uc29sZS5sb2cgZm9udFxuXHRcdFx0YXBwLmZvbnRzLmFkZCBmb250XG5cdFx0XHRkaXYuY3NzXG5cdFx0XHRcdFwiZm9udC1mYW1pbHlcIjogZm9udFxuXHRcdCMjI1xuXG5cdFx0JChcIi5mb250LWJpZ1wiKS5rZXl1cCAtPlxuXHRcdFx0dGV4dCA9ICQodGhpcykudmFsKClcblx0XHRcdCQoXCIuZm9udC1iaWdcIikuZWFjaCAtPlxuXHRcdFx0XHRpZiAhJCh0aGlzKS5pcyhcIjpmb2N1c1wiKVxuXHRcdFx0XHRcdCQodGhpcykudmFsIHRleHRcblxuXG5cdGluc3RydWN0aW9uczpcblx0XHRpbml0OiAtPlxuXHRcdFx0JChcIi5pbnN0cnVjdGlvblwiKS5lYWNoIC0+XG5cdFx0XHRcdGluc3QgPSAkKHRoaXMpIFxuXHRcdFx0XHRuID0gaW5zdC5hdHRyKFwiZGF0YS1pbnN0cnVjdGlvblwiKVxuXG5cdFx0XHRcdGlmICFhcHAuY29va2llLnJlYWQgXCJpbnN0cnVjdGlvbi1cIituXG5cblx0XHRcdFx0XHRpbnN0LmFkZENsYXNzKFwiaW5cIilcblx0XHRcdFx0XHRjb25zb2xlLmxvZyBpbnN0LnBhcmVudCgpLmZpbmQoXCJpbnB1dCx0ZXh0YXJlYVwiKVxuXHRcdFx0XHRcdGluc3QucGFyZW50KCkuZmluZChcImlucHV0LHRleHRhcmVhXCIpLmtleXVwIC0+XG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRcdFx0XHRcdGluc3QuYWRkQ2xhc3MoXCJvdXRcIilcblx0XHRcdFx0XHRcdFx0YXBwLmNvb2tpZS5jcmVhdGUgXCJpbnN0cnVjdGlvbi1cIituLCBcIm9rXCJcblx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0XHRcdFx0XHRcdGluc3QucmVtb3ZlKClcblx0XHRcdFx0XHRcdFx0LDUwMFxuXHRcdFx0XHRcdFx0LDUwMFxuXG5cblxuXG5cdHRvb2xzOlxuXHRcblx0XHRpbml0OiAtPlxuXG5cdFx0XHQjIEhlaWdodCB0ZXN0XG5cdFx0XHQkKFwiI3Rlc3QtZm9udC1jb250YWluZXJcIikuY3NzXG5cdFx0XHRcdFwibWluLWhlaWdodFwiOiAkKHdpbmRvdykuaGVpZ2h0KCkgLSAkKFwiaGVhZGVyXCIpLmhlaWdodCgpXG5cdFx0XHQkKHdpbmRvdykucmVzaXplIC0+XG5cdFx0XHRcdCQoXCIjdGVzdC1mb250LWNvbnRhaW5lclwiKS5jc3Ncblx0XHRcdFx0XHRcIm1pbi1oZWlnaHRcIjogJCh3aW5kb3cpLmhlaWdodCgpIC0gJChcImhlYWRlclwiKS5oZWlnaHQoKVxuXG5cblx0XHRcdCMgU2V0IGZvbnRcblxuXHRcdFx0Zm9udCA9ICQoXCIudGVzdC1mb250XCIpLmF0dHIoXCJkYXRhLWZvbnRcIilcblx0XHRcdGZvbnRfaWQgPSAkKFwiLnRlc3QtZm9udFwiKS5hdHRyKFwiZGF0YS1mb250LWlkXCIpXG5cdFx0XHRcblx0XHRcdGFwcC5mb250cy5hZGQgZm9udCwgZm9udF9pZFxuXHRcdFx0JChcIi50ZXN0LWZvbnQtaDEsIC50ZXN0LWZvbnQtcFwiKS5jc3Ncblx0XHRcdFx0XCJmb250LWZhbWlseVwiOiBmb250XG5cblx0XHRcdCMgRXZlbnRzIHRlc3RcblxuXHRcdFx0YXBwLmZvbnRzLnRvb2xzLnRleHRhcmVhY29weXRleHQoKVxuXHRcdFx0JChcIi50ZXN0LWZvbnQtaDEubGl2ZSwgLnRlc3QtZm9udC1wLmxpdmVcIikua2V5dXAgLT5cblx0XHRcdFx0YXBwLmZvbnRzLnRvb2xzLnRleHRhcmVhY29weXRleHQoKVxuXG5cdFx0XHQkKFwiYm9keVwiKS5jbGljayAtPlxuXHRcdFx0XHQkKFwiLnRlc3QtZm9udC1ncm91cFwiKS5yZW1vdmVDbGFzcyBcImluXCJcblx0XHRcdFx0JChcIi50b29sc1wiKS5hZGRDbGFzcyBcIm91dFwiXG5cdFx0XHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdFx0XHQkKFwiLnRvb2xzXCIpLnJlbW92ZUNsYXNzIFwiaW4gb3V0XCJcblx0XHRcdFx0XHQkKFwiLnRvb2xzLWdyb3VwXCIpLnJlbW92ZUNsYXNzIFwiaW5cIlxuXHRcdFx0XHQsNTAwXG5cblxuXHRcdFx0JChcIi50b29sc1wiKS5jbGljayAoZSkgLT5cblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0JChcIi50ZXN0LWZvbnQtaDEubGl2ZSwgLnRlc3QtZm9udC1wLmxpdmVcIikuY2xpY2sgKGUpIC0+XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKClcblxuXHRcdFx0JChcIi50ZXN0LWZvbnQtaDEubGl2ZSwgLnRlc3QtZm9udC1wLmxpdmVcIikuZm9jdXMgLT5cblxuXHRcdFx0XHQkKFwiLnRvb2xzXCIpLmFkZENsYXNzIFwiaW5cIlxuXG5cdFx0XHRcdCQoXCIudGVzdC1mb250LWdyb3VwXCIpLnJlbW92ZUNsYXNzIFwiaW5cIlxuXHRcdFx0XHQkKFwiLnRvb2xzLWdyb3VwXCIpLnJlbW92ZUNsYXNzIFwiaW5cIlxuXG5cdFx0XHRcdHRlc3RfZ3JvdXAgPSAkKHRoaXMpLmNsb3Nlc3QoXCIudGVzdC1mb250LWdyb3VwXCIpXG5cdFx0XHRcdHRlc3RfZ3JvdXAuYWRkQ2xhc3MgXCJpblwiXG5cdFx0XHRcdCQoXCIudG9vbHMtZ3JvdXAuXCIrdGVzdF9ncm91cC5hdHRyKFwiZGF0YS10b29sc1wiKSkuYWRkQ2xhc3MgXCJpblwiXG5cdFxuXHRcdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0XHRhcHAuZm9udHMudG9vbHMudGV4dGFyZWFoZWlnaHQoKVxuXHRcdFx0LDEwMDBcblxuXHRcdFx0JCh3aW5kb3cpLnJlc2l6ZSAtPlxuXHRcdFx0XHRhcHAuZm9udHMudG9vbHMudGV4dGFyZWFoZWlnaHQoKVxuXG5cblxuXHRcdFx0IyBTZXQgY3NzXG5cblx0XHRcdCQoXCIudG9vbFwiKS5lYWNoIC0+XG5cdFx0XHRcdHRvb2wgICAgICAgID0gJCh0aGlzKVxuXHRcdFx0XHR0b29sX3RvICAgICA9IHRvb2wuYXR0cihcImRhdGEtdG9cIilcblx0XHRcdFx0dG9vbF9jc3MgICAgPSB0b29sLmF0dHIoXCJkYXRhLWNzc1wiKVxuXHRcdFx0XHR0b29sX2luaXQgICA9IHRvb2wuYXR0cihcImRhdGEtaW5pdFwiKVxuXHRcdFx0XHR0b29sX3NlbGVjdCA9IHRvb2wuYXR0cihcImRhdGEtc2VsZWN0XCIpXG5cblx0XHRcdFx0IyBTZXQgcHJvcGVydGllcyBmcm9tIGNvb2tpZVxuXG5cdFx0XHRcdGlmIGFwcC5jb29raWUucmVhZCBcImNvbG9yXCJcblx0XHRcdFx0XHQkKFwiLnRvb2xbZGF0YS1jc3M9J2NvbG9yJ11cIikuYXR0ciBcImRhdGEtaW5pdFwiLCBhcHAuY29va2llLnJlYWQoXCJjb2xvclwiKVxuXHRcdFx0XHRpZiBhcHAuY29va2llLnJlYWQgXCJiYWNrZ3JvdW5kLWNvbG9yXCJcblx0XHRcdFx0XHQkKFwiLnRvb2xbZGF0YS1jc3M9J2JhY2tncm91bmQtY29sb3InXVwiKS5hdHRyIFwiZGF0YS1pbml0XCIsIGFwcC5jb29raWUucmVhZChcImJhY2tncm91bmQtY29sb3JcIilcblxuXG5cdFx0XHRcdCMgU2V0IGNzc1xuXHRcdFx0XHRhcHAuZm9udHMudG9vbHMuaW5zZXJ0Y3NzKHRvb2xfdG8sdG9vbF9jc3MsdG9vbF9pbml0KVxuXG5cdFx0XHRcdCMgU2V0IGluZGljYXRvclxuXHRcdFx0XHRhcHAuZm9udHMudG9vbHMuc2V0aW5kaWNhdG9yKCQodGhpcyksdG9vbF9pbml0KVxuXG5cdFx0XHRcdCMgU2V0IG9wdGlvbnMgZm9yIGNvbG9yc1xuXHRcdFx0XHRpZiB0b29sX3NlbGVjdFxuXHRcdFx0XHRcdHRvb2xfc2VsZWN0X3NwbGl0ID0gdG9vbF9zZWxlY3Quc3BsaXQoXCJ8XCIpXG5cdFx0XHRcdFx0dG9vbC5maW5kKFwiLnRvb2wtaWNvbi1jb2xvci1pbm5lclwiKS5jc3Ncblx0XHRcdFx0XHRcdCdiYWNrZ3JvdW5kLWNvbG9yJzogJyMnK3Rvb2xfaW5pdFxuXHRcdFx0XHRcdCQuZWFjaCB0b29sX3NlbGVjdF9zcGxpdCwgKGssdG9vbF9vcHRpb24pIC0+XG5cdFx0XHRcdFx0XHR0b29sLmZpbmQoXCIudG9vbC1zZWxlY3RcIikuYXBwZW5kKFwiPGRpdiBjbGFzcz0ndG9vbC1vcHRpb24nIGRhdGEtdmFsdWU9J1wiK3Rvb2xfb3B0aW9uK1wiJyBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjojXCIrdG9vbF9vcHRpb24rXCI7Jz48ZGl2IGNsYXNzPSd0b29sLW9wdGlvbi1zZWxlY3RlZCc+PC9kaXY+PC9kaXY+XCIpXG5cblxuXHRcdFx0IyBFdmVudHMgbW92ZSBiYXJcblxuXHRcdFx0Y2xpY2tfYWN0aXZlID0gZmFsc2VcblxuXHRcdFx0JChcIi50b29sIC50b29sLWJhclwiKS5tb3VzZWRvd24gKGUpIC0+XG5cdFx0XHRcdGFwcC5mb250cy50b29scy5tb3ZlYmFyKCQodGhpcyksZSlcblx0XHRcdFx0Y2xpY2tfYWN0aXZlID0gdHJ1ZVxuXG5cdFx0XHQkKFwiLnRvb2wgLnRvb2wtYmFyXCIpLm1vdXNldXAgLT5cblx0XHRcdFx0Y2xpY2tfYWN0aXZlID0gZmFsc2VcblxuXHRcdFx0JChcIi50b29sIC50b29sLWJhclwiKS5tb3VzZW1vdmUgKGUpIC0+XG5cdFx0XHRcdGlmIGNsaWNrX2FjdGl2ZVx0XHRcblx0XHRcdFx0XHRhcHAuZm9udHMudG9vbHMubW92ZWJhcigkKHRoaXMpLGUpXG5cblxuXHRcdFx0IyBFdmVudHMgc3dpdGNoXG5cdFx0XHQkKFwiLnRvb2xbZGF0YS1zd2l0Y2hdXCIpLmNsaWNrIC0+XG5cdFx0XHRcdHRvb2wgICAgID0gJCh0aGlzKVxuXHRcdFx0XHR0b29sX3RvICA9IHRvb2wuYXR0cihcImRhdGEtdG9cIilcblx0XHRcdFx0dG9vbF9jc3MgPSB0b29sLmF0dHIoXCJkYXRhLWNzc1wiKVxuXG5cdFx0XHRcdHZhbHVlcyA9IHRvb2wuYXR0cihcImRhdGEtc3dpdGNoXCIpLnNwbGl0KFwifFwiKVxuXHRcdFx0XHR2YWx1ZTEgPSB2YWx1ZXNbMF1cblx0XHRcdFx0dmFsdWUyID0gdmFsdWVzWzFdXG5cblx0XHRcdFx0dG9vbC50b2dnbGVDbGFzcyhcIm9uXCIpXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiB0b29sLmhhc0NsYXNzKFwib25cIilcblx0XHRcdFx0XHRhcHAuZm9udHMudG9vbHMuaW5zZXJ0Y3NzKHRvb2xfdG8sdG9vbF9jc3MsdmFsdWUxKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0YXBwLmZvbnRzLnRvb2xzLmluc2VydGNzcyh0b29sX3RvLHRvb2xfY3NzLHZhbHVlMilcblxuXG5cdFx0XHQjIENvbG9yZXNcblx0XHRcdGFwcC5mb250cy50b29scy5jb2xvcnMuaW5pdCgpXG5cblxuXHRcdHNldGluZGljYXRvcjogKHRvb2wsdmFsdWUpIC0+XG5cblx0XHRcdHRvb2xfbWluID0gcGFyc2VJbnQgdG9vbC5hdHRyKFwiZGF0YS1taW5cIilcblx0XHRcdHRvb2xfbWF4ID0gcGFyc2VJbnQgdG9vbC5hdHRyKFwiZGF0YS1tYXhcIilcblxuXHRcdFx0aWYgdG9vbF9tYXhcblx0XG5cdFx0XHRcdG1vdmUgPSBwYXJzZUludCggKCB2YWx1ZSAqIDEwMCAvICh0b29sX21heC10b29sX21pbikgKSAtICggdG9vbF9taW4gKiAxMDAgLyAodG9vbF9tYXgtdG9vbF9taW4pICkgKVxuXG5cdFx0XHRcdCNpbnZlcnRcblx0XHRcdFx0bW92ZSA9IDEwMCAtIG1vdmVcblxuXHRcdFx0XHR0b29sLmZpbmQoXCIudG9vbC1pbmRpY2F0b3JcIikuY3NzXG5cdFx0XHRcdFx0dG9wOiBtb3ZlICsgXCIlXCJcblxuXG5cblx0XHRtb3ZlYmFyOiAoZWxlbWVudCxlKSAtPlxuXG5cdFx0XHRwb3MgICAgICAgPSBlbGVtZW50Lm9mZnNldCgpLnRvcFxuXHRcdFx0Y2xpY2sgICAgID0gZS5wYWdlWVxuXHRcdFx0c2Nyb2xsICAgID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpXG5cdFx0XHRoZWlnaHQgICAgPSBlbGVtZW50LmhlaWdodCgpXG5cdFx0XHR0b3AgICAgICAgPSBwb3MgLSBzY3JvbGxcblx0XHRcdGNsaWNrX2JhciA9IGNsaWNrIC0gcG9zXG5cdFx0XHRtb3ZlICAgICAgPSBjbGlja19iYXIgKiAxMDAgLyBoZWlnaHRcblxuXHRcdFx0ZWxlbWVudC5maW5kKFwiLnRvb2wtaW5kaWNhdG9yXCIpLmNzc1xuXHRcdFx0XHR0b3A6IG1vdmUgKyBcIiVcIlxuXG5cdFx0XHR0b29sID0gZWxlbWVudC5jbG9zZXN0KFwiLnRvb2xcIilcblx0XHRcdHRvb2xfdG8gPSB0b29sLmF0dHIoXCJkYXRhLXRvXCIpXG5cdFx0XHR0b29sX2NzcyA9IHRvb2wuYXR0cihcImRhdGEtY3NzXCIpXG5cdFx0XHR0b29sX21pbiA9IHBhcnNlSW50IHRvb2wuYXR0cihcImRhdGEtbWluXCIpXG5cdFx0XHR0b29sX21heCA9IHBhcnNlSW50IHRvb2wuYXR0cihcImRhdGEtbWF4XCIpXG5cblx0XHRcdHRvb2xfY2FsY3VsYXRlID0gcGFyc2VJbnQoICh0b29sX21heC10b29sX21pbikgKiBtb3ZlIC8gMTAwICkgKyB0b29sX21pblxuXG5cdFx0XHQjaW52ZXJ0XG5cdFx0XHR0b29sX2NhbGN1bGF0ZSA9IHRvb2xfbWF4IC0gdG9vbF9jYWxjdWxhdGUgKyB0b29sX21pblxuXG5cdFx0XHRjb25zb2xlLmxvZyB0b29sX2NhbGN1bGF0ZStcInB4XCJcblxuXHRcdFx0YXBwLmZvbnRzLnRvb2xzLmluc2VydGNzcyh0b29sX3RvLHRvb2xfY3NzLHRvb2xfY2FsY3VsYXRlKVxuXG5cblxuXG5cdFx0aW5zZXJ0Y3NzOiAodG8sY3NzLHZhbHVlKSAtPlxuXHRcdFx0aWYgY3NzID09IFwiZm9udC1zaXplXCJcblx0XHRcdFx0JCh0bykuY3NzIFwiZm9udC1zaXplXCI6IHZhbHVlK1wicHhcIlxuXHRcdFx0aWYgY3NzID09IFwibGluZS1oZWlnaHRcIlxuXHRcdFx0XHQkKHRvKS5jc3MgXCJsaW5lLWhlaWdodFwiOiB2YWx1ZStcInB4XCJcblx0XHRcdGlmIGNzcyA9PSBcImxldHRlci1zcGFjaW5nXCJcblx0XHRcdFx0JCh0bykuY3NzIFwibGV0dGVyLXNwYWNpbmdcIjogdmFsdWUrXCJweFwiXG5cdFx0XHRpZiBjc3MgPT0gXCJ3b3JkLXNwYWNpbmdcIlxuXHRcdFx0XHQkKHRvKS5jc3MgXCJ3b3JkLXNwYWNpbmdcIjogdmFsdWUrXCJweFwiXG5cblx0XHRcdGlmIGNzcyA9PSBcInRleHQtdHJhbnNmb3JtXCJcblx0XHRcdFx0JCh0bykuY3NzIFwidGV4dC10cmFuc2Zvcm1cIjogdmFsdWVcblx0XHRcdGlmIGNzcyA9PSBcImZvbnQtd2VpZ2h0XCJcblx0XHRcdFx0JCh0bykuY3NzIFwiZm9udC13ZWlnaHRcIjogdmFsdWVcblxuXHRcdFx0aWYgY3NzID09IFwiY29sb3JcIlxuXHRcdFx0XHQkKHRvKS5jc3MgXCJjb2xvclwiOiBcIiNcIit2YWx1ZVxuXHRcdFx0XHRhcHAuY29va2llLmNyZWF0ZSBcImNvbG9yXCIsIHZhbHVlXG5cdFx0XHRpZiBjc3MgPT0gXCJiYWNrZ3JvdW5kLWNvbG9yXCJcblx0XHRcdFx0JCh0bykuY3NzIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNcIit2YWx1ZVxuXHRcdFx0XHRhcHAuY29va2llLmNyZWF0ZSBcImJhY2tncm91bmQtY29sb3JcIiwgdmFsdWVcblxuXHRcdFx0YXBwLmZvbnRzLnRvb2xzLnRleHRhcmVhaGVpZ2h0KClcblxuXG5cdFx0dGV4dGFyZWFoZWlnaHQ6IC0+XG5cblx0XHRcdGhlaWdodF9oMSA9ICQoXCIudGVzdC1mb250LWgxLmdob3N0XCIpLmhlaWdodCgpXG5cdFx0XHQkKFwiLnRlc3QtZm9udC1oMS5saXZlXCIpLmNzc1xuXHRcdFx0XHRoZWlnaHQ6IGhlaWdodF9oMStcInB4XCJcblx0XHRcdCQoXCIudGVzdC1mb250LWgxLmxpdmVcIikucGFyZW50KCkuZmluZChcIi50ZXN0LWZvbnQtZ3JvdXAtZm9jdXNcIikuY3NzXG5cdFx0XHRcdGhlaWdodDogaGVpZ2h0X2gxK1wicHhcIlxuXG5cdFx0XHRoZWlnaHRfcCA9ICQoXCIudGVzdC1mb250LXAuZ2hvc3RcIikuaGVpZ2h0KClcblx0XHRcdCQoXCIudGVzdC1mb250LXAubGl2ZVwiKS5jc3Ncblx0XHRcdFx0aGVpZ2h0OiBoZWlnaHRfcCtcInB4XCJcblx0XHRcdCQoXCIudGVzdC1mb250LXAubGl2ZVwiKS5wYXJlbnQoKS5maW5kKFwiLnRlc3QtZm9udC1ncm91cC1mb2N1c1wiKS5jc3Ncblx0XHRcdFx0aGVpZ2h0OiBoZWlnaHRfcCtcInB4XCJcblxuXG5cdFx0dGV4dGFyZWFjb3B5dGV4dDogLT5cblxuXHRcdFx0JChcIi50ZXN0LWZvbnQtaDEuZ2hvc3RcIikuaHRtbCAkKFwiLnRlc3QtZm9udC1oMS5saXZlXCIpLnZhbCgpXG5cdFx0XHQkKFwiLnRlc3QtZm9udC1wLmdob3N0XCIpLmh0bWwgJChcIi50ZXN0LWZvbnQtcC5saXZlXCIpLnZhbCgpXG5cdFx0XHRhcHAuZm9udHMudG9vbHMudGV4dGFyZWFoZWlnaHQoKVxuXG5cblxuXHRcdGNvbG9yczpcblx0XHRcdGluaXQ6IC0+XG5cdFx0XHRcdCQoXCIudG9vbHMgLnRvb2wtc2VsZWN0IC50b29sLW9wdGlvblwiKS5jbGljayAtPlxuXHRcdFx0XHRcdG9wdGlvbiAgICAgPSAkKHRoaXMpXG5cdFx0XHRcdFx0dG9vbCAgICAgICA9IG9wdGlvbi5jbG9zZXN0KFwiLnRvb2xcIilcblx0XHRcdFx0XHR0b29sX3RvICAgID0gdG9vbC5hdHRyKFwiZGF0YS10b1wiKVxuXHRcdFx0XHRcdHRvb2xfY3NzICAgPSB0b29sLmF0dHIoXCJkYXRhLWNzc1wiKVxuXHRcdFx0XHRcdHRvb2xfdmFsdWUgPSBvcHRpb24uYXR0cihcImRhdGEtdmFsdWVcIilcblx0XHRcdFx0XHRhcHAuZm9udHMudG9vbHMuaW5zZXJ0Y3NzKHRvb2xfdG8sdG9vbF9jc3MsdG9vbF92YWx1ZSlcblxuXHRcdFx0XHRcdHRvb2wuZmluZChcIi50b29sLXNlbGVjdCAudG9vbC1vcHRpb25cIikucmVtb3ZlQ2xhc3MoXCJpblwiKVxuXG5cdFx0XHRcdFx0dG9vbC5maW5kKFwiLnRvb2wtaWNvbi1jb2xvci1pbm5lclwiKS5jc3Ncblx0XHRcdFx0XHRcdCdiYWNrZ3JvdW5kLWNvbG9yJzogJyMnK3Rvb2xfdmFsdWUgXG5cblx0XHRcdFx0XHRvcHRpb24uYWRkQ2xhc3MoXCJpblwiKVxuXG5cblxuXG5cblxuXG5cblxuYWRkRm9udCA9IChmb250LCBmb250X2lkKSAtPlxuXHRpZiAhJChcImhlYWRcIikuZmluZCgnbGlua1tkYXRhLWZvbnQ9XCInK2ZvbnRfaWQrJ1wiXScpLmxlbmd0aFxuXHRcdCQoXCJoZWFkXCIpLmFwcGVuZCAnPGxpbmsgaHJlZj1cIicrJChcImJvZHlcIikuYXR0cihcImRhdGEtdXJsXCIpKycvd3AtY29udGVudC9mb250cy8nK2ZvbnRfaWQrJy9mb250LmNzc1wiIHJlbD1cInN0eWxlc2hlZXRcIiB0eXBlPVwidGV4dC9jc3NcIiBkYXRhLWZvbnQ9XCInK2ZvbnRfaWQrJ1wiIC8+J1xuXG5cbmNoZWNrd2lkdGhfcHJldiA9IGZhbHNlXG5cbmNoZWNrRm9udCA9IChmb250ZGl2LGZvbnQpIC0+XG5cdCQoXCIuY2hlY2tsb2FkZm9udFwiKS5yZW1vdmUoKVxuXHQkKFwiYm9keVwiKS5hcHBlbmQoXCI8c3BhbiBjbGFzcz0nY2hlY2tsb2FkZm9udCcgc3R5bGU9J3Bvc2l0aW9uOmFic29sdXRlO3RvcDotMTAwcHg7bGVmdDowO2JhY2tncm91bmQ6Izk5OTtmb250LWZhbWlseTpzZXJpZjsnPmFiY2lqbCEkJSYvbzA8L3NwYW4+XCIpXG5cdGNoZWNrd2lkdGhfcHJldiA9IGZhbHNlXG5cdGNoZWNrRm9udFQoZm9udGRpdixmb250KVxuXG5jaGVja0ZvbnRUID0gKGZvbnRkaXYsZm9udCkgLT5cblxuXHRjb25zb2xlLmxvZyBcImNoZWNrZWFuZG9cIlxuXG5cdGNoZWNrZGl2ID0gJChcIi5jaGVja2xvYWRmb250XCIpXG5cdGNoZWNrd2lkdGggPSBjaGVja2Rpdi53aWR0aCgpXG5cblx0JChcIi5jaGVja2xvYWRmb250XCIpLmNzc1xuXHRcdFwiZm9udC1mYW1pbHlcIjogZm9udFxuXG5cdGNvbnNvbGUubG9nIGNoZWNrd2lkdGggKyBcIiB2cyBcIiArIGNoZWNrd2lkdGhfcHJldlxuXG5cdGlmIGNoZWNrd2lkdGghPWNoZWNrd2lkdGhfcHJldiAmJiBjaGVja3dpZHRoX3ByZXYhPWZhbHNlXG5cdFx0Zm9udGRpdi5hZGRDbGFzcygnZm9udC1sb2FkZWQnKVxuXHRcdGNvbnNvbGUubG9nIFwiLS0tIEZ1ZW50ZSBjYXJnYWRhXCJcblx0XHRzZWFyY2hMb2FkRm9udCgpXG5cdGVsc2Vcblx0XHRjb25zb2xlLmxvZyBcImRzYWRzYVwiXG5cdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0Y2hlY2tGb250VChmb250ZGl2LGZvbnQpXG5cdFx0LDUwXG5cblx0Y2hlY2t3aWR0aF9wcmV2ID0gY2hlY2t3aWR0aFxuXG5cbmxvYWRGb250ID0gKGZvbnRkaXYsY2FsbGJhY2s9ZmFsc2UpIC0+XG5cdGZvbnQgICAgPSBmb250ZGl2LmF0dHIoXCJkYXRhLWZvbnRcIilcblx0Zm9udF9pZCAgICA9IGZvbnRkaXYuYXR0cihcImRhdGEtZm9udC1pZFwiKVxuXHRhZGRGb250IGZvbnQsIGZvbnRfaWRcblx0Zm9udGRpdi5jc3Ncblx0XHRcImZvbnQtZmFtaWx5XCI6IGZvbnRcblx0Zm9udGRpdi5maW5kKFwiZGl2LGlucHV0XCIpLmNzc1xuXHRcdFwiZm9udC1mYW1pbHlcIjogZm9udFxuXHRjb25zb2xlLmxvZyBcIi0tLSBGdWVudGUgcHVlc3RhXCJcblx0Y2hlY2tGb250KGZvbnRkaXYsZm9udClcblxuc2VhcmNoTG9hZEZvbnQgPSAtPlxuXHRmb3VuZGZvbnQgPSAkKFwiLmZvbnQ6bm90KC5mb250LWxvYWRlZClcIikuZXEoMClcblx0Y29uc29sZS5sb2cgXCIqLS0gRnVlbnRlIGEgY2FyZ2FyOiBcIisgZm91bmRmb250LmF0dHIoXCJkYXRhLWZvbnRcIilcblx0aWYgZm91bmRmb250Lmxlbmd0aFxuXHRcdGxvYWRGb250IGZvdW5kZm9udCwgc2VhcmNoTG9hZEZvbnRcblxuXG5sb2FkUGFnZSA9IChocmVmKSAtPlxuXHQkLmFqYXhcblx0XHR0eXBlOiBcIkdFVFwiXG5cdFx0dXJsOiBocmVmXG5cdFx0YXN5bmM6IGZhbHNlXG5cdFx0c3VjY2VzczogKGh0bWwpIC0+XG5cdFx0XG5cdFx0XHRodG1sID0gJChodG1sKVxuXHRcdFx0cGFnZSA9IGh0bWwuZmluZChcIi5wYWdlXCIpXG5cdFx0XHRjb25zb2xlLmxvZyBwYWdlXG5cdFx0XHQkKFwiI2JvZHlcIikucHJlcGVuZCBwYWdlXG5cblx0XHRcdHNjcm9sbF9jdXJyZW50ID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpXG5cdFx0XHRzY3JvbGxfcGFnZSA9ICQoXCIucGFnZVwiKS5lcSgwKS5pbm5lckhlaWdodCgpICsgc2Nyb2xsX2N1cnJlbnRcblxuXHRcdFx0JCh3aW5kb3cpLnNjcm9sbFRvcChzY3JvbGxfcGFnZSlcblxuXHRcdFx0JChcImh0bWwsYm9keVwiKS5hbmltYXRlXG5cdFx0XHRcdHNjcm9sbFRvcDogMFxuXHRcdFx0LDgwMFxuXHRcdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0XHQkKFwiI3Rlc3QtYXJ0aWNsZS1mb250XCIpLmZvY3VzKClcblx0XHRcdCw5MDBcblxuXHRcdFx0cmVuZGVyUGFnZSgpXG5cblxucmVuZGVyUGFnZSA9IC0+XG5cblx0c2VhcmNoTG9hZEZvbnQoKVxuXG5cdGlmICQoXCIuaXNvdG9wZVwiKS5sZW5ndGhcblx0XHQkKFwiLmlzb3RvcGVcIikuaXNvdG9wZSgpXG5cblxuXG5cblxuXG5hcHAubG9hZGluZyA9XG5cblx0aW5pdDogLT5cblx0XHRpZiAkKFwiW2RhdGEtbG9hZGluZ11cIikubGVuZ3RoXG5cdFx0XHRhcHAubG9hZGluZy5pbigpXG5cdFx0IyMjXG5cdFx0YXBwLmxvYWRpbmcuaW4oKVxuXHRcdCQoXCJib2R5XCIpLmltYWdlc0xvYWRlZCAtPlxuXHRcdFx0YXBwLmxvYWRpbmcub3V0KClcblx0XHQjIyNcblxuXHRpbjogKGVsZW1lbnQpIC0+XG5cdFx0ZWxlbWVudCA9ICQoXCJib2R5XCIpIGlmICFlbGVtZW50XG5cdFx0ZWxlbWVudC5hcHBlbmQgJycrXG5cdFx0XHQnPGRpdiBjbGFzcz1cImxvYWRpbmdcIj4nK1xuXHRcdFx0XHQnPGRpdiBjbGFzcz1cImxvYWRpbmctaWNvblwiPicrXG5cdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJsb2FkaW5nLWljb24tY2lyY2xlXCI+PGRpdj48L2Rpdj48L2Rpdj4nK1xuXHRcdFx0XHQnPC9kaXY+Jytcblx0XHRcdCc8L2Rpdj4nXG5cdG91dDogLT5cblx0XHQkKFwiLmxvYWRpbmdcIikuYWRkQ2xhc3MgXCJvdXRcIlxuXHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdCQoXCIubG9hZGluZ1wiKS5yZW1vdmUoKVxuXHRcdCw1MDBcblx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcImxvYWRlZFwiKVxuXG5cblxuXG5hcHAucGx1Z2lucyA9XG5cblx0aW5pdDogLT5cblxuXG5cdFx0IyBJc290b3BlXG5cdFx0aWYgJChcIi5pc290b3BlXCIpLmxlbmd0aFxuXHRcdFx0aXNvdG9wZSA9ICQoXCIuaXNvdG9wZVwiKS5pc290b3BlKClcblxuXG5cblx0cmVsYXlvdXQ6IC0+XG5cblx0XHQkKFwiYm9keVwiKS5pbWFnZXNMb2FkZWQgLT5cblx0XHRcdGFwcC5hbGVydC5lcXVpZGlzdCgpXG5cdFx0XHRhcHAuYWxlcnQuZXF1aWRpc3QoKVxuXHRcdFx0aWYgJChcIi5pc290b3BlXCIpLmxlbmd0aFxuXHRcdFx0XHQkKFwiLmlzb3RvcGVcIikuaXNvdG9wZVxuXHRcdFx0XHRcdHJlbGF5b3V0OiB0cnVlXG5cblxuXG5cblxuYXBwLnNjcm9sbCA9IC0+XG5cblx0aWYgIWFwcC5pc01vYmlsZSgpXG5cdFx0c2Nyb2xsX3ByZXYgPSAwXG5cdFx0JCh3aW5kb3cpLnNjcm9sbCAtPlxuXG5cdFx0XHQjIEVzY29uZGVyIGhlYWRlclxuXHRcdFx0c2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpXG5cdFx0XHRoZWlnaHRfd2luZG93ID0gJCh3aW5kb3cpLmhlaWdodCgpXG5cdFx0XHRoZWlnaHRfYm9keSA9ICQoXCJib2R5XCIpLmhlaWdodCgpXG5cblx0XHRcdGlmIHNjcm9sbCA+IDUwXG5cdFx0XHRcdCQoXCJoZWFkZXJcIikuYWRkQ2xhc3MgXCJoZWFkZXItaGlkZVwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCQoXCJoZWFkZXJcIikucmVtb3ZlQ2xhc3MgXCJoZWFkZXItaGlkZVwiXG5cblx0XHRcdGlmIHNjcm9sbCA+IDcwXG5cdFx0XHRcdCQoXCIuc2luZ2xlLWZvbnQtaGVhZGVyXCIpLmFkZENsYXNzKFwiZml4ZWRcIilcblx0XHRcdGVsc2Vcblx0XHRcdFx0JChcIi5zaW5nbGUtZm9udC1oZWFkZXJcIikucmVtb3ZlQ2xhc3MoXCJmaXhlZFwiKVxuXG5cblx0XHRcdHNjcm9sbF9wcmV2ID0gc2Nyb2xsXG5cblxuXHRcdFx0IyBNb3N0cmFyIGVuIHNjcm9sbFxuXG5cdFx0XHRpZiAkKFwiLmRpc3BsYXlzY3JvbGxcIikubGVuZ3RoXG5cdFx0XHRcdCQoXCIuZGlzcGxheXNjcm9sbFwiKS5lYWNoIC0+XG5cdFx0XHRcdFx0ZWxlbWVudCA9ICQodGhpcylcblx0XHRcdFx0XHRlbGVtZW50X3RvcCA9IGVsZW1lbnQub2Zmc2V0KCkudG9wXG5cdFx0XHRcdFx0ZWxlbWVudF9oZWlnaHQgPSBlbGVtZW50LmhlaWdodCgpXG5cdFx0XHRcdFx0aWYgc2Nyb2xsICsgaGVpZ2h0X3dpbmRvdyA+IGVsZW1lbnRfaGVpZ2h0ICsgZWxlbWVudF90b3Bcblx0XHRcdFx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MgXCJpblwiXG5cblxuXG5cbmFwcC5zZWNyZXRNZW51ID1cblxuXHRpbml0OiAtPlxuXG5cdFx0IyBDb21wYXJlIFVSTCBpbiBtZW51XG5cdFx0dXJsID0gZG9jdW1lbnQuVVJMXG5cdFx0dXJsX3NwbGl0ID0gdXJsLnNwbGl0KFwiL1wiKVxuXHRcdG5hbWVfcGFnZSA9IHVybF9zcGxpdFt1cmxfc3BsaXQubGVuZ3RoLTFdXG5cdFx0bmFtZV9wYWdlX3NwbGl0ID0gbmFtZV9wYWdlLnNwbGl0KFwiP1wiKSBcblx0XHRuYW1lX3BhZ2VfY2xlYXIgPSBuYW1lX3BhZ2Vfc3BsaXRbMF1cblx0XHRsaSA9ICQoXCIuc2VjcmV0bWVudS1jb250ZW50IGFbaHJlZj0nXCIrbmFtZV9wYWdlX2NsZWFyK1wiJ11cIikucGFyZW50KFwibGlcIilcblx0XHRsaS5hZGRDbGFzcyBcImN1cnJlbnQtaXRlbVwiXG5cdFx0bGkucGFyZW50KCkucGFyZW50KFwibGlcIikuYWRkQ2xhc3MgXCJjdXJyZW50LWl0ZW1cIlxuXG5cdFx0IyBEZXNrdG9wXG5cdFx0JChcIi5zZWNyZXRtZW51LWNvbnRlbnQgdWwgbGkgYVwiKS5lYWNoIC0+XG5cdFx0XHRpZiAkKHRoaXMpLnBhcmVudCgpLmZpbmQoXCJ1bFwiKS5sZW5ndGhcblx0XHRcdFx0aWYgISQodGhpcykuaGFzQ2xhc3MoXCJzZWNyZXRtZW51LXBhcmVudFwiKVxuXHRcdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJzZWNyZXRtZW51LXBhcmVudFwiKS5wcmVwZW5kKCc8aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tcmlnaHRcIj48L2k+Jylcblx0XHRcdFx0XHQkKHRoaXMpLnBhcmVudCgpLmZpbmQoXCJ1bFwiKS5wcmVwZW5kICc8bGk+PGEgaHJlZj1cIiNcIiBjbGFzcz1cInNlY3JldG1lbnUtYmFja1wiPjxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi1sZWZ0XCI+PC9pPiBBdHLDoXM8L2E+PC9saT4nXG5cblx0XHRpZiAkKFwiLnNlY3JldG1lbnUtY29udGVudCB1bCBsaS5jdXJyZW50LWl0ZW0gYS5zZWNyZXRtZW51LXBhcmVudFwiKS5sZW5ndGhcblx0XHRcdGFwcC5zZWNyZXRNZW51Lm9wZW5MdmxEZXNrdG9wICQoXCIuc2VjcmV0bWVudS1jb250ZW50IHVsIGxpLmN1cnJlbnQtaXRlbSBhLnNlY3JldG1lbnUtcGFyZW50XCIpXG5cblx0XHQjIE1vYmlsZVxuXG5cdFx0JChcIi5zZWNyZXRtZW51LWJ1dHRvblwiKS5jbGljayAtPlxuXHRcdFx0aWYgISQoXCJib2R5XCIpLmhhc0NsYXNzKFwic2VjcmV0bWVudS1pblwiKVxuXHRcdFx0XHRhcHAuc2VjcmV0TWVudS5vcGVuICQoXCIuc2VjcmV0bWVudS1jb250ZW50XCIpLmh0bWwoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRhcHAuc2VjcmV0TWVudS5jbG9zZSgpXG5cdFx0JChcIi5zZWNyZXRtZW51LWNvbnRhaW5lci1mcm9udFwiKS5jbGljayAtPlxuXHRcdFx0aWYgJChcImJvZHlcIikuaGFzQ2xhc3MoXCJzZWNyZXRtZW51LWluXCIpXG5cdFx0XHRcdGFwcC5zZWNyZXRNZW51LmNsb3NlKClcblx0XHR0cnVlXG5cblx0b3Blbkx2bERlc2t0b3A6IChlbGVtZW50KSAtPlxuXHRcdHVsID0gZWxlbWVudC5wYXJlbnQoKS5maW5kKFwidWxcIilcblx0XHR1bC5hZGRDbGFzcyhcImluXCIpXG5cdFx0dWwuZmluZChcImEuc2VjcmV0bWVudS1iYWNrXCIpLnVuYmluZChcImNsaWNrXCIpLmJpbmQgXCJjbGlja1wiLCAtPlxuXHRcdFx0dWwuYWRkQ2xhc3MoXCJvdXRcIilcblx0XHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdFx0dWwucmVtb3ZlQ2xhc3MoXCJpbiBvdXRcIilcblx0XHRcdCw3MDBcblx0XHRcdGZhbHNlXG5cblxuXHRvcGVuOiAoaHRtbCxjaGlsZHJlbj1mYWxzZSxkaXJlY3Rpb249XCJsZWZ0XCIpIC0+XG5cblx0XHRsZW5ndGggICAgPSAkKFwiLnNlY3JldG1lbnVcIikubGVuZ3RoICsgMVxuXHRcdGNvbnRhaW5lciA9ICc8ZGl2IGNsYXNzPVwic2VjcmV0bWVudSBzZWNyZXRtZW51LWx2bC0nKygkKFwiLnNlY3JldG1lbnVcIikubGVuZ3RoICsgMSkrJ1wiPjwvZGl2Pidcblx0XHRkaXJlY3Rpb24gPSBcInJpZ2h0XCJcblxuXHRcdGlmICFjaGlsZHJlblxuXHRcdFx0JChcIi5zZWNyZXRtZW51LWNvbnRhaW5lci1iYWNrXCIpLmh0bWwoY29udGFpbmVyKSBcblx0XHRlbHNlXG5cdFx0XHQkKFwiLnNlY3JldG1lbnUtY29udGFpbmVyLWJhY2tcIikuYXBwZW5kKGNvbnRhaW5lcilcblxuXHRcdCQoXCIuc2VjcmV0bWVudVwiKS5lcSgtMSkuaHRtbCgnPGRpdiBjbGFzcz1cInNlY3JldG1lbnUtaW5uZXJcIj4nK2h0bWwrJzwvZGl2PicpXG5cblx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcInNlY3JldG1lbnUtaW4gc2VjcmV0bWVudS1cIitkaXJlY3Rpb24pXG5cdFx0JChcImJvZHlcIikuYXR0cihcImRhdGEtc2VjcmV0bWVudS1sdmxcIixsZW5ndGgpXG5cblx0XHQjIFNpIHRpZW5lIGhpam9zXG5cdFx0JChcIi5zZWNyZXRtZW51IHVsIGxpIGFcIikuZWFjaCAtPlxuXHRcdFx0aWYgJCh0aGlzKS5wYXJlbnQoKS5maW5kKFwidWxcIikubGVuZ3RoXG5cdFx0XHRcdGlmICEkKHRoaXMpLmhhc0NsYXNzKFwic2VjcmV0bWVudS1wYXJlbnRcIilcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwic2VjcmV0bWVudS1wYXJlbnRcIikucHJlcGVuZCgnPGkgY2xhc3M9XCJmYSBmYS1jaGV2cm9uLXJpZ2h0XCI+PC9pPicpXG5cblx0XHQjIENsaWNrIGVuIGl0ZW0gZGUgbWVuw7pcblx0XHQkKFwiLnNlY3JldG1lbnUgdWwgbGkgYS5zZWNyZXRtZW51LXBhcmVudFwiKS51bmJpbmQoXCJjbGlja1wiKS5iaW5kIFwiY2xpY2tcIiwgLT5cblx0XHRcdGFwcC5zZWNyZXRNZW51Lm9wZW4gXCI8dWw+XCIrJCh0aGlzKS5wYXJlbnQoKS5maW5kKFwidWxcIikuaHRtbCgpK1wiPC91bD5cIiwgdHJ1ZVxuXHRcdFx0ZmFsc2VcblxuXHRcdCQoXCIuc2VjcmV0bWVudSBhLnNlY3JldG1lbnUtYmFja1wiKS51bmJpbmQoXCJjbGlja1wiKS5iaW5kIFwiY2xpY2tcIiwgLT5cblx0XHRcdGxhc3RtZW51ID0gcGFyc2VJbnQgJChcImJvZHlcIikuYXR0cihcImRhdGEtc2VjcmV0bWVudS1sdmxcIilcblx0XHRcdCQoXCJib2R5XCIpLmF0dHIoXCJkYXRhLXNlY3JldG1lbnUtbHZsXCIsKGxhc3RtZW51LTEpKVxuXHRcdFx0JChcIi5zZWNyZXRtZW51LnNlY3JldG1lbnUtbHZsLVwiK2xhc3RtZW51KS5hZGRDbGFzcyhcIm91dFwiKVxuXHRcdFx0c2V0VGltZW91dCAtPlxuXHRcdFx0XHQkKFwiLnNlY3JldG1lbnUuc2VjcmV0bWVudS1sdmwtXCIrbGFzdG1lbnUpLnJlbW92ZSgpXG5cdFx0XHQsNzAwXG5cdFx0XHRmYWxzZVxuXG5cdGNsb3NlOiAtPlxuXG5cdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJzZWNyZXRtZW51LW91dFwiKVxuXHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzIFwic2VjcmV0bWVudS1pbiBzZWNyZXRtZW51LW91dCBzZWNyZXRtZW51LWxlZnQgc2VjcmV0bWVudS1yaWdodCBzZWNyZXRtZW51LWx2bC1cIiskKFwiYm9keVwiKS5hdHRyKFwiZGF0YS1zZWNyZXRtZW51LWx2bFwiKVxuXHRcdFx0JChcImJvZHlcIikucmVtb3ZlQXR0cihcImRhdGEtc2VjcmV0bWVudS1sdmxcIilcblx0XHRcdCQoXCIuc2VjcmV0bWVudVwiKS5yZW1vdmUoKVxuXHRcdCw3MDBcblxuXG5cblxuXG5hcHAuc2hhcmVzID1cblxuXHRpbml0OiAtPlxuXHRcdCQoXCIuc2hhcmVcIikuY2xpY2sgLT5cblx0XHRcdGFwcC5zaGFyZXMuc2hhcmUgJCh0aGlzKVxuXG5cdHNoYXJlOiAoZWxlbWVudCkgLT5cblxuXHRcdHNoYXJlX3VybCA9IGVuY29kZVVSSUNvbXBvbmVudChlbGVtZW50LmF0dHIoXCJkYXRhLXVybFwiKSlcblx0XHRzaGFyZV90ZXh0ID0gZW5jb2RlVVJJQ29tcG9uZW50KGVsZW1lbnQuYXR0cihcImRhdGEtdGV4dFwiKSlcblx0XHRzaGFyZV9pbWcgPSBlbmNvZGVVUklDb21wb25lbnQoZWxlbWVudC5hdHRyKFwiZGF0YS1pbWdcIikpXG5cblx0XHRpZihlbGVtZW50Lmhhc0NsYXNzKFwic2hhcmUtZmFjZWJvb2tcIikpXG5cdFx0XHRhcHAuc2hhcmVzLnBvcHVwV2luZG93IFwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3NoYXJlci9zaGFyZXIucGhwP3U9XCIrc2hhcmVfdXJsLCA1MDAsIDMxMFxuXG5cdFx0aWYoZWxlbWVudC5oYXNDbGFzcyhcInNoYXJlLXR3aXR0ZXJcIikpXG5cdFx0XHRhcHAuc2hhcmVzLnBvcHVwV2luZG93IFwiaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdHdlZXQ/c291cmNlPXdlYmNsaWVudCZhbXA7dGV4dD1cIitzaGFyZV90ZXh0K1wiJmFtcDt1cmw9XCIrc2hhcmVfdXJsLCA1MDAsIDMxMFxuXG5cdFx0aWYoZWxlbWVudC5oYXNDbGFzcyhcInNoYXJlLXBpbnRlcmVzdFwiKSlcblx0XHRcdGFwcC5zaGFyZXMucG9wdXBXaW5kb3cgXCJodHRwOi8vcGludGVyZXN0LmNvbS9waW4vY3JlYXRlL2J1dHRvbi8/dXJsPVwiK3NoYXJlX3VybCtcIiZtZWRpYT1cIitzaGFyZV9pbWcrXCImZGVzY3JpcHRpb249XCIrc2hhcmVfdGV4dCwgNjIwLCAzMTBcblxuXHRcdGlmKGVsZW1lbnQuaGFzQ2xhc3MoXCJzaGFyZS1nb29nbGVwbHVzXCIpKVxuXHRcdFx0YXBwLnNoYXJlcy5wb3B1cFdpbmRvdyBcImh0dHBzOi8vcGx1cy5nb29nbGUuY29tL3NoYXJlP3VybD1cIitzaGFyZV91cmwsIDUwMCwgMzEwXG5cblx0XHRpZihlbGVtZW50Lmhhc0NsYXNzKFwic2hhcmUtbGlua2VkaW5cIikpXG5cdFx0XHRhcHAuc2hhcmVzLnBvcHVwV2luZG93IFwiaHR0cDovL3d3dy5saW5rZWRpbi5jb20vc2hhcmVBcnRpY2xlP21pbmk9dHJ1ZSZ1cmw9XCIrc2hhcmVfdXJsK1wiJnRpdGxlPVwiK3NoYXJlX3RleHQrXCImc3VtbWFyeT1cIitzaGFyZV90ZXh0K1wiJnNvdXJjZT1cIitzaGFyZV91cmwsIDUwMCwgNDIwXG5cblx0XHRmYWxzZVxuXG5cdHBvcHVwV2luZG93OiAodXJsLCB3LCBoKSAtPlxuXHRcdGxlZnQgPSAoICQod2luZG93KS53aWR0aCgpIC8gMiApICAtICh3IC8gMilcblx0XHR0b3AgID0gKCAkKHdpbmRvdykuaGVpZ2h0KCkgLyAyICkgLSAoaCAvIDIpXG5cdFx0cmV0dXJuIHdpbmRvdy5vcGVuKHVybCwgXCJDb21wYXJ0aXJcIiwgJ3Rvb2xiYXI9bm8sIGxvY2F0aW9uPW5vLCBkaXJlY3Rvcmllcz1ubywgc3RhdHVzPW5vLCBtZW51YmFyPW5vLCBzY3JvbGxiYXJzPW5vLCByZXNpemFibGU9bm8sIGNvcHloaXN0b3J5PW5vLCB3aWR0aD0nK3crJywgaGVpZ2h0PScraCsnLCB0b3A9Jyt0b3ArJywgbGVmdD0nK2xlZnQpXG5cblxuXG5cbmFwcC50b29sdGlwcyA9IC0+XG5cblx0JChcIltkYXRhLXRvb2x0aXBdXCIpLmVhY2ggLT5cblx0XHRwb3MgPSAkKHRoaXMpLmF0dHIoXCJkYXRhLXRvb2x0aXAtcG9zaXRpb25cIilcblx0XHRwb3MgPSBcImJvdHRvbVwiIGlmICFwb3Ncblx0XHQkKHRoaXMpLmFkZENsYXNzIFwidG9vbHRpcC1wYXJlbnRcIlxuXHRcdCQodGhpcykuYXBwZW5kIFwiPHNwYW4gY2xhc3M9J3Rvb2x0aXAgdG9vbHRpcC1cIitwb3MrXCInPjxzcGFuIGNsYXNzPSd0b29sdGlwLWNvbnRhaW5lcic+PHNwYW4gY2xhc3M9J3Rvb2x0aXAtdHJpYW5nbGUnPjwvc3Bhbj48c3BhbiBjbGFzcz0ndG9vbHRpcC1jb250ZW50Jz5cIiArICQodGhpcykuYXR0cihcImRhdGEtdG9vbHRpcFwiKSArIFwiPC9zcGFuPjwvc3Bhbj48L3NwYW4+XCJcblxuXG5cblxuXG5cbmFwcC52YWxpZGF0aW9uID1cblxuXHRmb3JtOiAoZm9ybXMsY2FsbGJhY2s9ZmFsc2UpIC0+XG5cblx0XHRmb3Jtcy5lYWNoIC0+XG5cblx0XHRcdGZvcm0gPSAkKHRoaXMpXG5cblx0XHRcdGZvcm0uZmluZChcIi5jb250cm9sIC5jb250cm9sLXZhbHVlXCIpLmFwcGVuZChcIjxkaXYgY2xhc3M9J2NvbnRyb2wtbWVzc2FnZSc+PC9kaXY+XCIpXG5cblx0XHRcdGZvcm0uZmluZChcImlucHV0LHRleHRhcmVhLHNlbGVjdFwiKS5lYWNoIC0+XG5cdFx0XHRcdGlucHV0ID0gJCh0aGlzKVx0XHRcdFx0XG5cdFx0XHRcdGlucHV0LmFkZENsYXNzKCBcImlucHV0LVwiKyQodGhpcykuYXR0cihcInR5cGVcIikgKSBpZiAkKHRoaXMpLmlzIFwiaW5wdXRcIlxuXHRcdFx0XHRpbnB1dC5hZGRDbGFzcyggXCJkaXNhYmxlZFwiICkgaWYgaW5wdXQuaXMoXCI6ZGlzYWJsZWRcIilcblx0XHRcdFx0aW5wdXQubGl2ZSBcImJsdXIsIGNoYW5nZVwiLCAtPlxuXHRcdFx0XHRcdGFwcC52YWxpZGF0aW9uLmZvcm1JbnB1dChpbnB1dClcblxuXHRcdFx0Zm9ybS5maW5kKFwiLmlucHV0LWNoZWNrYm94LCAuaW5wdXQtcmFkaW9cIikuZWFjaCAtPlxuXHRcdFx0XHRpZiAkKHRoaXMpLmlzKFwiOmNoZWNrZWRcIilcblx0XHRcdFx0XHQkKHRoaXMpLmNsb3Nlc3QoXCJsYWJlbFwiKS5hZGRDbGFzcyhcImNoZWNrZWRcIilcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCQodGhpcykuY2xvc2VzdChcImxhYmVsXCIpLnJlbW92ZUNsYXNzKFwiY2hlY2tlZFwiKVxuXHRcdFx0XG5cdFx0XHRmb3JtLmZpbmQoXCIuaW5wdXQtY2hlY2tib3gsIC5pbnB1dC1yYWRpb1wiKS5jaGFuZ2UgLT5cblx0XHRcdFx0Zm9ybS5maW5kKFwiLmlucHV0LWNoZWNrYm94LCAuaW5wdXQtcmFkaW9cIikuZWFjaCAtPlxuXHRcdFx0XHRcdGlmICQodGhpcykuaXMoXCI6Y2hlY2tlZFwiKVxuXHRcdFx0XHRcdFx0JCh0aGlzKS5jbG9zZXN0KFwibGFiZWxcIikuYWRkQ2xhc3MoXCJjaGVja2VkXCIpXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0JCh0aGlzKS5jbG9zZXN0KFwibGFiZWxcIikucmVtb3ZlQ2xhc3MoXCJjaGVja2VkXCIpXG5cblxuXHRcdFx0Zm9ybS5maW5kKFwiaW5wdXQubnVtYmVyXCIpLmVhY2ggLT5cblx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcIm51bWJlclwiKS53cmFwKFwiPGRpdiBjbGFzcz0nbnVtYmVyJz5cIikuYWZ0ZXIoXCI8ZGl2IGNsYXNzPSdudW1iZXItYnV0dG9uIG51bWJlci1tb3JlJz4rPC9kaXY+PGRpdiBjbGFzcz0nbnVtYmVyLWJ1dHRvbiBudW1iZXItbGVzcyc+LTwvZGl2PlwiKVxuXG5cdFx0XHRmb3JtLmZpbmQoXCIubnVtYmVyIC5udW1iZXItYnV0dG9uXCIpLmxpdmUgXCJjbGlja1wiLCAtPlxuXG5cdFx0XHRcdF9pbnB1dCA9ICQodGhpcykucGFyZW50KCkuZmluZChcImlucHV0XCIpXG5cblx0XHRcdFx0X21heCA9IHBhcnNlSW50KF9pbnB1dC5hdHRyKFwiZGF0YS1tYXhcIikpXG5cdFx0XHRcdF9taW4gPSBwYXJzZUludChfaW5wdXQuYXR0cihcImRhdGEtbWluXCIpKVxuXHRcdFx0XHRfbWluID0gMSBpZiAhX21pblxuXG5cdFx0XHRcdF9zdGVwcyA9IHBhcnNlSW50KF9pbnB1dC5hdHRyKFwiZGF0YS1zdGVwc1wiKSlcblx0XHRcdFx0X3N0ZXBzID0gMSBpZiAhX3N0ZXBzXG5cblx0XHRcdFx0X3ZhbCA9IHBhcnNlSW50KF9pbnB1dC52YWwoKSlcblx0XHRcdFx0X3ZhbCA9IF92YWwgKyBfc3RlcHMgaWYgJCh0aGlzKS5oYXNDbGFzcyBcIm51bWJlci1tb3JlXCJcblx0XHRcdFx0X3ZhbCA9IF92YWwgLSBfc3RlcHMgaWYgJCh0aGlzKS5oYXNDbGFzcyBcIm51bWJlci1sZXNzXCJcblx0XHRcdFx0X3ZhbCA9IF9tYXggaWYgX3ZhbCA+PSBfbWF4XG5cdFx0XHRcdF92YWwgPSBfbWluIGlmIF92YWwgPD0gX21pblxuXG5cdFx0XHRcdF9pbnB1dC52YWwoX3ZhbClcblx0XHRcdFx0XG5cdFx0XHRcdGZhbHNlXG5cblx0XHRcdGZvcm0uZmluZChcIi5udW1iZXIgaW5wdXRcIikubGl2ZSBcImJsdXJcIiwgLT5cblxuXHRcdFx0XHRfaW5wdXQgPSAkKHRoaXMpXG5cblx0XHRcdFx0X21heCA9IHBhcnNlSW50KF9pbnB1dC5hdHRyKFwiZGF0YS1tYXhcIikpXG5cdFx0XHRcdF9taW4gPSBwYXJzZUludChfaW5wdXQuYXR0cihcImRhdGEtbWluXCIpKVxuXHRcdFx0XHRfbWluID0gMSBpZiAhX21pblxuXG5cdFx0XHRcdF92YWwgPSBwYXJzZUludChfaW5wdXQudmFsKCkpXG5cdFx0XHRcdF92YWwgPSBfbWF4IGlmIF92YWwgPj0gX21heFxuXHRcdFx0XHRfdmFsID0gX21pbiBpZiBfdmFsIDw9IF9taW5cblxuXHRcdFx0XHRfaW5wdXQudmFsKF92YWwpXG5cblx0XHRcdFx0dHJ1ZVxuXG5cblxuXHRcdFx0Zm9ybS5zdWJtaXQgLT5cblxuXHRcdFx0XHRzZW5kID0gdHJ1ZVxuXHRcdFx0XHRmb3JtID0gJCh0aGlzKSBcblxuXHRcdFx0XHRmb3JtLmZpbmQoXCJpbnB1dCx0ZXh0YXJlYSxzZWxlY3RcIikuZWFjaCAtPlxuXHRcdFx0XHRcdGFwcC52YWxpZGF0aW9uLmZvcm1JbnB1dCgkKHRoaXMpLHRydWUpXG5cblx0XHRcdFx0ZGl2ZXJyb3IgPSBmb3JtLmZpbmQoXCIuY29udHJvbC1lcnJvclwiKS5lcSgwKVxuXG5cdFx0XHRcdGlmIGRpdmVycm9yLmxlbmd0aFxuXG5cdFx0XHRcdFx0c2VuZCA9IGZhbHNlXG5cdFx0XHRcdFx0dG9wID0gZGl2ZXJyb3Iub2Zmc2V0KCkudG9wIC0gJChcIi5oZWFkZXItdG9wXCIpLmhlaWdodCgpIC0gMjVcblxuXHRcdFx0XHRcdCQoXCJodG1sLGJvZHlcIikuYW5pbWF0ZVxuXHRcdFx0XHRcdFx0c2Nyb2xsVG9wOiB0b3BcblxuXHRcdFx0XHRcdHNldFRpbWVvdXQgLT5cblx0XHRcdFx0XHRcdGRpdmVycm9yLmZpbmQoXCJpbnB1dFwiKS5lcSgwKS5mb2N1cygpXG5cdFx0XHRcdFx0LDUwMFxuXG5cdFx0XHRcdGlmIHNlbmQgPT0gdHJ1ZVxuXHRcdFx0XHRcdGlmIGNhbGxiYWNrXG5cdFx0XHRcdFx0XHRjYWxsYmFjaygpXG5cdFx0XHRcdFx0XHRzZW5kID0gZmFsc2VcblxuXHRcdFx0XHRyZXR1cm4gc2VuZFxuXG5cblx0Zm9ybUlucHV0OiAoaW5wdXQsdmFsaWRhdGVFbXB0eT1mYWxzZSkgLT5cblxuXHRcdHBhcmVudCA9IGlucHV0LmNsb3Nlc3QoXCIuY29udHJvbC12YWx1ZVwiKVxuXG5cdFx0Y29udHJvbHMgPSBpbnB1dC5jbG9zZXN0KFwiLmNvbnRyb2xzXCIpXG5cdFx0Y29udHJvbCAgPSBpbnB1dC5jbG9zZXN0KFwiLmNvbnRyb2xcIilcblxuXHRcdGZ2RXJyb3JzID0ge1xuXHRcdFx0XCJlbXB0eVwiOiBcIkVzdGUgY2FtcG8gZXMgcmVxdWVyaWRvXCIsXG5cdFx0XHRcImVtcHR5U2VsZWN0XCI6IFwiU2VsZWNjaW9uYSB1bmEgb3BjacOzblwiLFxuXHRcdFx0XCJlbXB0eVJhZGlvXCI6IFwiU2VsZWNjaW9uYSB1bmEgb3BjacOzblwiLFxuXHRcdFx0XCJlbXB0eUNoZWNrYm94XCI6IFwiU2VsZWNjaW9uYSBhbCBtZW5vcyB1bmEgb3BjacOzblwiLFxuXHRcdFx0XCJpbnZhbGlkRW1haWxcIjogXCJFbWFpbCBpbnbDoWxpZG9cIixcblx0XHRcdFwiaW52YWxpZEVtYWlsUmVwZWF0XCI6IFwiRWwgZW1haWwgaW5ncmVzYWRvIG5vIGVzIGlndWFsIGFsIGFudGVyaW9yXCJcblx0XHRcdFwiaW52YWxpZFBhc3NcIjogXCJMYSBjb250cmFzZcOxYSBkZWJlIHNlciBtYXlvciBhIDYgY2Fyw6FjdGVyZXNcIlxuXHRcdFx0XCJpbnZhbGlkUGFzc1JlcGVhdFwiOiBcIkxhIGNvbnRyYXNlw7FhIG5vIGVzIGlndWFsIGEgbGEgYW50ZXJpb3JcIlxuXHRcdFx0XCJpbnZhbGlkUnV0XCI6IFwiUlVUIGludsOhbGlkb1wiLFxuXHRcdFx0XCJ0ZXJtc1wiOiBcIkRlYmVzIGFjZXB0YXIgbG9zIHTDqXJtaW5vcyBsZWdhbGVzXCIsXG5cdFx0fVxuXG5cblx0XHRpZiAhaW5wdXQuaGFzQ2xhc3MoXCJvcHRpb25hbFwiKSAmJiBpbnB1dC5hdHRyKFwidHlwZVwiKSE9XCJzdWJtaXRcIiAmJiBpbnB1dC5hdHRyKFwidHlwZVwiKSE9XCJoaWRkZW5cIiAmJiBpbnB1dC5hdHRyKFwibmFtZVwiKVxuXG5cdFx0XHRlcnJvciA9IGZhbHNlXG5cdFx0XHRcblx0XHRcdGlmICFpbnB1dC52YWwoKVxuXG5cdFx0XHRcdCMgVmFsaWRhciBzaSBlbCBjYW1wbyBzZSBsbGVuYSAob3BjaW9uYWwpXG5cdFx0XHRcdGlmIHZhbGlkYXRlRW1wdHkgPT0gdHJ1ZVxuXHRcdFx0XHRcdGlmIGlucHV0LmlzKFwic2VsZWN0XCIpXG5cdFx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXRNZXNzYWdlKGlucHV0LGZ2RXJyb3JzLmVtcHR5U2VsZWN0KVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGFwcC52YWxpZGF0aW9uLmZvcm1JbnB1dE1lc3NhZ2UoaW5wdXQsZnZFcnJvcnMuZW1wdHkpXG5cdFx0XHRlbHNlXG5cblx0XHRcdFx0IyBWYWxpZGFyIGVtYWlsXG5cdFx0XHRcdGlmIGlucHV0LmlzKFwiW3R5cGU9J2VtYWlsJ11cIilcblx0XHRcdFx0XHRpZiAhIGFwcC52YWxpZGF0aW9uLmVtYWlsKCBpbnB1dCwgaW5wdXQudmFsKCkgKSBcblx0XHRcdFx0XHRcdGFwcC52YWxpZGF0aW9uLmZvcm1JbnB1dE1lc3NhZ2UoaW5wdXQsZnZFcnJvcnMuaW52YWxpZEVtYWlsKVxuXHRcdFx0XHRcdFx0ZXJyb3IgPSB0cnVlXG5cblxuXHRcdFx0XHQjIFZhbGlkYXIgY29udHJhc2XDsWFcblx0XHRcdFx0aWYgaW5wdXQuaXMoXCJbdHlwZT0ncGFzc3dvcmQnXVwiKVxuXHRcdFx0XHRcdGlmIGlucHV0LnZhbCgpLmxlbmd0aCA8IDZcblx0XHRcdFx0XHRcdGFwcC52YWxpZGF0aW9uLmZvcm1JbnB1dE1lc3NhZ2UoaW5wdXQsZnZFcnJvcnMuaW52YWxpZFBhc3MpXG5cdFx0XHRcdFx0XHRlcnJvciA9IHRydWVcblxuXG5cdFx0XHRcdCMgVmFsaWRhciByZXBldGlyIGNvbnRyYXNlw7FhXG5cdFx0XHRcdGlmIGlucHV0LmlzKFwiW2RhdGEtcmVwZWF0XVwiKVxuXHRcdFx0XHRcdGlmIGlucHV0LnZhbCgpICE9IGNvbnRyb2xzLmZpbmQoXCJbbmFtZT0nXCIraW5wdXQuYXR0cihcImRhdGEtcmVwZWF0XCIpK1wiJ11cIikudmFsKClcblx0XHRcdFx0XHRcdGlmIGlucHV0LmlzKFwiW3R5cGU9J3Bhc3N3b3JkJ11cIilcblx0XHRcdFx0XHRcdFx0YXBwLnZhbGlkYXRpb24uZm9ybUlucHV0TWVzc2FnZShpbnB1dCxmdkVycm9ycy5pbnZhbGlkUGFzc1JlcGVhdClcblx0XHRcdFx0XHRcdFx0ZXJyb3IgPSB0cnVlXG5cdFx0XHRcdFx0XHRpZiBpbnB1dC5pcyhcIlt0eXBlPSdlbWFpbCddXCIpXG5cdFx0XHRcdFx0XHRcdGFwcC52YWxpZGF0aW9uLmZvcm1JbnB1dE1lc3NhZ2UoaW5wdXQsZnZFcnJvcnMuaW52YWxpZEVtYWlsUmVwZWF0KVxuXHRcdFx0XHRcdFx0XHRlcnJvciA9IHRydWVcblxuXG5cdFx0XHRcdCMgVmFsaWRhciBjaGVja2JveHMvcmFkaW9zXG5cdFx0XHRcdGlmIChpbnB1dC5pcyhcIlt0eXBlPSdjaGVja2JveCddXCIpIHx8IGlucHV0LmlzKFwiW3R5cGU9J3JhZGlvJ11cIikpXG5cdFx0XHRcdFx0aWYgIWNvbnRyb2xzLmZpbmQoXCJpbnB1dFtuYW1lPSdcIitpbnB1dC5hdHRyKFwibmFtZVwiKStcIiddOmNoZWNrZWRcIikubGVuZ3RoXG5cdFx0XHRcdFx0XHRhcHAudmFsaWRhdGlvbi5mb3JtSW5wdXRNZXNzYWdlKGlucHV0LGZ2RXJyb3JzLmVtcHR5Q2hlY2tib3gpIGlmIGlucHV0LmlzKFwiW3R5cGU9J2NoZWNrYm94J11cIilcblx0XHRcdFx0XHRcdGFwcC52YWxpZGF0aW9uLmZvcm1JbnB1dE1lc3NhZ2UoaW5wdXQsZnZFcnJvcnMuZW1wdHlSYWRpbykgICAgaWYgaW5wdXQuaXMoXCJbdHlwZT0ncmFkaW8nXVwiKVxuXHRcdFx0XHRcdFx0YXBwLnZhbGlkYXRpb24uZm9ybUlucHV0TWVzc2FnZShpbnB1dCxmdkVycm9ycy50ZXJtcykgICAgICAgICBpZiBpbnB1dC5pcyhcIi5pbnB1dC10ZXJtc1wiKVxuXHRcdFx0XHRcdFx0ZXJyb3IgPSB0cnVlXG5cdFx0XHRcdFx0XHRwYXJlbnQuZmluZChcIi5jb250cm9sLWVycm9yXCIpLnJlbW92ZUNsYXNzKFwiZXJyb3JcIilcblxuXG5cdFx0XHRcdCMgVmFsaWRhciBSVVRcblx0XHRcdFx0aWYgaW5wdXQuaXMoXCIucnV0XCIpXG5cdFx0XHRcdFx0aW5wdXQudmFsKCAkLlJ1dC5mb3JtYXRlYXIoJC5SdXQucXVpdGFyRm9ybWF0byhpbnB1dC52YWwoKSksJC5SdXQuZ2V0RGlnaXRvKCQuUnV0LnF1aXRhckZvcm1hdG8oaW5wdXQudmFsKCkpKSkgKVxuXHRcdFx0XHRcdGlmICEkLlJ1dC52YWxpZGFyKGlucHV0LnZhbCgpKVxuXHRcdFx0XHRcdFx0YXBwLnZhbGlkYXRpb24uZm9ybUlucHV0TWVzc2FnZShpbnB1dCxmdkVycm9ycy5pbnZhbGlkUnV0KVxuXHRcdFx0XHRcdFx0ZXJyb3IgPSB0cnVlXG5cblx0XHRcdFx0IyBTaSBubyBoYXkgZXJyb3Jlcywgc2UgcXVpdGEgZWwgbWVuc2FqZSBkZSBlcnJvclxuXHRcdFx0XHRpZiBlcnJvciA9PSBmYWxzZVxuXHRcdFx0XHRcdGFwcC52YWxpZGF0aW9uLmZvcm1JbnB1dE1lc3NhZ2UoaW5wdXQsZmFsc2UpXG5cblxuXG5cdGZvcm1JbnB1dE1lc3NhZ2U6IChpbnB1dCxtZXNzYWdlKSAtPlxuXHRcdGlmIG1lc3NhZ2Vcblx0XHRcdGlucHV0LmFkZENsYXNzKFwiY29udHJvbC1lcnJvclwiKVxuXHRcdFx0cGFyZW50ID0gaW5wdXQuY2xvc2VzdChcIi5jb250cm9sLXZhbHVlXCIpXG5cdFx0XHRwYXJlbnQuYWRkQ2xhc3MoXCJjb250cm9sLWVycm9yXCIpXG5cdFx0XHRwYXJlbnQuZmluZChcIi5jb250cm9sLW1lc3NhZ2VcIikudGV4dChtZXNzYWdlKS5hZGRDbGFzcyhcImluXCIpXG5cdFx0ZWxzZVxuXHRcdFx0aW5wdXQucmVtb3ZlQ2xhc3MoXCJjb250cm9sLWVycm9yXCIpXG5cdFx0XHRwYXJlbnQgPSBpbnB1dC5jbG9zZXN0KFwiLmNvbnRyb2wtdmFsdWVcIilcblx0XHRcdHBhcmVudC5yZW1vdmVDbGFzcyhcImNvbnRyb2wtZXJyb3JcIilcdFxuXHRcdFx0cGFyZW50LmZpbmQoXCIuY29udHJvbC1tZXNzYWdlXCIpLmFkZENsYXNzKFwib3V0XCIpXG5cdFx0XHRzZXRUaW1lb3V0IC0+XG5cdFx0XHRcdHBhcmVudC5maW5kKFwiLmNvbnRyb2wtbWVzc2FnZVwiKS5yZW1vdmVDbGFzcyhcImluIG91dFwiKS50ZXh0KFwiXCIpXG5cdFx0XHQsNTAwXG5cblxuXG5cdGVtYWlsOiAoZWxlbWVudG8sdmFsb3IpIC0+XG5cdFx0aWYgL14oKFtePD4oKVtcXF1cXFxcLiw7Olxcc0BcXFwiXSsoXFwuW148PigpW1xcXVxcXFwuLDs6XFxzQFxcXCJdKykqKXwoXFxcIi4rXFxcIikpQCgoXFxbWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcXSl8KChbYS16QS1aXFwtMC05XStcXC4pK1thLXpBLVpdezIsfSkpJC8udGVzdCh2YWxvcilcblx0XHRcdHJldHVybiB0cnVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblxuXG5cblxuIl19