var r = {
  settings: {
    Roster: {

    },
    Company: {
      'name': '',
      'slogan': '',
      'logo': ''
    },
    Team: {
      members: []
    },
    Templates: []
  },
  ui: {
    snackbar: $('.mdl-snackbar'),
    menu: $('#menu'),
    menuEl: '<a class="mdl-navigation__link mdl-tabs__tab" href="#"></a>',
    page: $('#page'),
    pageEl: '<section class="mdl-tabs__panel" id=""><div class="page-content"></div></section>',
    spinnerEl: '<div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>',
    input: function (label, type, clas, value) {
      var type = type || 'text';
      var clas = ' ' + clas || '';
      var value = value || '';
      return '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><input class="mdl-textfield__input' + clas + '" type="' + type + '" value="' + value + '" id="' + encodeURIComponent(label).replace(/%20/g, '_') + '"><label class="mdl-textfield__label" for="' + encodeURIComponent(label).replace(/%20/g, '_') + '">' + String(label) + '</label></div>';
    },
    teamMemberEl: function (id, name, title, bg, text) {
      if (text != '' && bg.match(/#[0-9a-f]{6}/g)) {
        cardDetail = 'style="color:' + text + ';background:none;"'
      } else {
        cardDetail = 'style="color:#ffffff"'
      }
      return $('<div class="team-member mdl-card mdl-shadow--2dp" id="' + id + '"><button class="remove save-data mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">Remove ' + name + '</button><div class="mdl-card__title mdl-card--expand"></div><div class="mdl-card__actions details" ' + cardDetail + '><span class="card-name">' + name + '</span><span class="card-title">' + title + '</span></div></div>').css('background', 'center/cover ' + bg);
    },
    newTeamMemberEl: '<div class="team-member adding mdl-card mdl-shadow--2dp"><div class="mdl-card__actions details"><div class="card-name" data-input="Name"></div><div class="card-email" data-input="Email" data-type="email"></div><div class="card-title" data-input="Title"></div><div class="bottom"><input type="file" hidden /><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect upload"><img src="" hidden>Photo</button><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect save-data mdl-button--accent" disabled>Save</button></div></div></div>',
    templateEl: function (team) {
      var template = '<div class="mdl-grid roster-header mdl-grid--no-spacing">';
      template += '<div class="mdl-cell">Team Member</div>';
      var weekTemp = '';
      var week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      for (var day in week) {
        if (week[day] === 'Saturday' || week[day] === 'Sunday') {
          weekTemp += ('<div class="mdl-cell weekend">' + week[day] + '</div>');
        } else {
          weekTemp += ('<div class="mdl-cell">' + week[day] + '</div>');
        }
      }
      template += weekTemp + '</div>';
      for (var member in team) {
        var tm = team[member];
        // FOR COVER IMAGE
        //        if (tm.text != '' && tm.bg.match(/#[0-9a-f]{6}/g)) {
        //          cardDetail = 'style="color:' + tm.text + ';background:none;"';
        //        } else {
        //          cardDetail = 'style="color:#ffffff"';
        //        }
        var papa = this;
        var cellWeek = '';
        $(weekTemp).each(function () {
          var start, finish = '';
          if (r.settings.Roster[tm.id]) {
            start = r.settings.Roster[tm.id][$(this).text()].start;
            finish = r.settings.Roster[tm.id][$(this).text()].finish;
          }
          var inline = function () {
            if (start.length > 0 && finish.length > 0) {
              return start + ' &mdash; ' + finish;
            } else {
              return (start + ' ' + finish).trim();
            }
          }
          $(this).html('<span class="ready-time">' + inline() + '</span>' + papa.input('Start', undefined, 'time start', start) + papa.input('Finish', undefined, 'time end', finish) + '<button class="copy-time mdl-button mdl-js-button mdl-js-ripple-effect"><i class="material-icons">content_copy</i> Copy</button><button class="paste-time mdl-button mdl-js-button mdl-js-ripple-effect"><i class="material-icons">content_paste</i> Paste</button><button class="done-time mdl-button mdl-js-button mdl-js-ripple-effect"><i class="material-icons">check_circle</i> Done</button>');
          cellWeek += this.outerHTML;
        });
        var body = $('<div class="mdl-grid roster-body mdl-grid--no-spacing" id="' + tm.id + '"><div class="mdl-cell team-member"><div class="mdl-card__actions details"><span class="card-name">' + tm.name + '</span><span class="card-title">' + tm.title + '</span></div></div>' + cellWeek + '</div>');
        if (tm.bg.match(/(#......)/)) {
          var c = document.createElement('canvas');
          var ctx = c.getContext('2d');
          c.width = 1;
          c.height = 1;
          ctx.fillStyle = tm.bg;
          ctx.fillRect(0, 0, c.width, c.height);
          colourImage = c.toDataURL();
          $('.team-member', body).prepend('<div class="avatar"><img src="' + colourImage + '"></div>');
        } else {
          $('.team-member', body).prepend('<div class="avatar"><img src="' + tm.bg.split('url("')[1].split('")')[0] + '"></div>');
        }
        template += body[0].outerHTML;
      }
      return template;
    },
    headerEl: function (company) {
      return '<div class="company"><h3>' + company.name + '</h3><h4>' + company.slogan + '</h4></div><div class="mdl-layout-spacer"></div><div class="logo"><img class="mdl-logo" src="' + company.logo + '" height="100"></div>'
    }

  },
  o: function (obj) {
    return Object.keys(obj);
  },
  helper: {
    addMember: function (name, email, title, bg) {
      var text = "#ffffff";
      if (bg === 'none') {
        var palette = r.helper.randomPalette();
        bg = palette.colour;
        text = palette.text;
      }
      r.settings.Team.members.push({
        'id': Date.now(),
        'name': name,
        'title': title,
        'email': email,
        'bg': bg || '',
        'text': text || ''
      });
    },
    remove: function (i, where) {
      where.splice(i, 1);
    },
    setCopyTime: function (e) {
      $('.master-copy-time').removeClass('master-copy-time');
      $(e).parent('.mdl-cell').addClass('master-copy-time');
    },
    getCopyTime: function (e) {
      var result = [];
      $('input.time', e).each(function () {
        result.push($(this).val());
      })
      return result;
    },
    toast: function (message) {
      r.ui.snackbar[0].MaterialSnackbar.showSnackbar({
        message: message
      });
    },
    set: function (item, data) {
      localStorage.setItem(item, JSON.stringify(data));
    },
    get: function (item) {
      var g = localStorage.getItem(item);
      if (g === undefined) {
        r.helper.toast(item + ' not found');
        return undefined;
      } else {
        return JSON.parse(g);
      }
    },
    randomPalette: function () {
      var p = r.ui.palette;
      var c = Object.keys(p)[Math.floor(Math.random() * Object.keys(p).length)];
      var v = Object.keys(p[c])[Math.floor(Math.random() * Object.keys(p[c]).length)];
      return p[c][v];
    }
  }
}

$.getJSON('js/mdlPalette.json').done(function (data) {
  r.ui.palette = data;
})

if (r.helper.get('settings')) {
  r.settings = r.helper.get('settings');
}

for (var i = 0; i < r.o(r.settings).length; i++) {
  // Create Links
  r.ui.menu.append($(r.ui.menuEl).text(r.o(r.settings)[i]).attr('href', '#' + r.o(r.settings)[i]));

  // Create Pages
  r.ui.page.append($(r.ui.pageEl).attr('id', r.o(r.settings)[i]));
}

if (window.location.hash.length === 0) {
  window.location.hash = 'Roster';
}
$('> a[href="' + window.location.hash + '"]', r.ui.menu).addClass('is-active');
$('> section' + window.location.hash, r.ui.page).addClass('is-active').find('.page-content').append(r.ui.spinnerEl).load(window.location.hash.split('#')[1] + '.html');

// Bind page loads
$('a', r.ui.menu).click(function () {
  var a = $(this);
  if (a.attr('href') != window.location.hash) {
    window.location.hash = a.attr('href').split('#')[1];
    $(a.attr('href'), r.ui.page).find('.page-content').append(r.ui.spinnerEl).load(a.attr('href').split('#')[1] + '.html');
    window.componentHandler.upgradeDom();
  }
});

// MDI Upgrade and create inputs
$(document).ajaxComplete(function () {
  $('*[data-input]').each(function () {
    $(this).html(r.ui.input($(this).data('input')));
    $('input', $(this)).val(r.helper.get($(this).data('input')));
  });
  var event = new Event('mdl-done');
  $('body').trigger('mdl-done');
  window.componentHandler.upgradeDom();
});



$('body').on('click', '.save-data', function () {
  var btn = $(this),
    parent = btn.parents('section');

  $('input,textarea,select', parent).off('change keydown');
  btn.prop('disabled', true);

  if ($(parent).attr('id') === 'Roster') {
    $('.roster-body').each(function () {
      var id = $(this).attr('id');
      r.settings.Roster[id] = {};
      $('.mdl-cell:not(.team-member)', $(this)).each(function (i) {
        var day = $('.roster-header .mdl-cell').eq(i + 1).text();
        r.settings.Roster[id][day] = {
          start: $('input[type=text]:eq(0)', $(this)).val(),
          finish: $('input[type=text]:eq(1)', $(this)).val()
        };
      })
    })
  }

  if ($(parent).attr('id') === 'Company') {
    r.settings.Company.name = $('#Company_Name').val();
    r.settings.Company.slogan = $('#Company_Slogan').val();
    r.settings.Company.logo = $('#Company_Logo').attr('src');
  }

  if ($(parent).attr('id') === 'Team' && $('.team-member.adding').length === 1) {
    r.helper.addMember($('.team-member.adding #Name').val(), $('.team-member.adding #Email').val(), $('.team-member.adding #Title').val(), $('.team-member.adding .upload').css('background-image'));
  }
  r.helper.set('settings', r.settings);

  r.helper.toast('Saved ' + $(parent).attr('id') + ' details');
  $('input,textarea,select', parent).on('change keydown', function () {
    btn.prop('disabled', false);
  });

  $('section.is-active').find('.page-content').html('').append(r.ui.spinnerEl).load($('section.is-active').attr('id') + '.html');
});

$('body').on('click', 'button.upload', function () {
  var $this = $(this),
    inputFile = $this.siblings('input[type=file]');
  inputFile[0].click();
  inputFile.off().on('change', function () {
    var reader = new FileReader();
    reader.onload = function (e) {
      if ($this.parents('section').attr('id') === 'Company') {
        $this.prev('#Company_Logo').attr('src', e.target.result).removeProp('hidden');
      } else if ($this.parents('section').attr('id') === 'Team') {
        $this.text('').css('background-image', 'url(' + e.target.result + ')');
      }
    }
    reader.readAsDataURL(this.files[0]);
  });
});
