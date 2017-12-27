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
    Templates: [{
      'avatar': true,
      'title': true,
      'hours': false,
      'defaultWorkingHours': 8
    }]
  },
  ui: {
    snackbar: $('.mdl-snackbar'),
    menu: $('#menu'),
    menuItem: '<a class="mdl-navigation__link mdl-tabs__tab" href="#"></a>',
    page: $('#page'),
    pageTab: '<section class="mdl-tabs__panel" id=""><div class="page-content"></div></section>',
    loadingSpinner: '<div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>',
    input: function (input) {

      var _label = input.data('input') || '';
      var _type = input.data('type') || 'text';
      var _class = input.data('class') || '';
      var _value = input.data('value') || '';
      var _min = input.data('min') || '';
      var _max = input.data('max') || '';
      var _step = input.data('step') || 1;
      var _required = input.data('required') ? 'required' : '';
      var _checked = input.data('checked') ? 'checked' : '';

      switch (_type) {
        case 'checkbox':
          return '<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + encodeURIComponent(_label).replace(/%20/g, '_') + '"><input class="mdl-switch__input ' + _class + '"' + _checked + ' type="' + _type + '" value="' + _value + '" id="' + encodeURIComponent(_label).replace(/%20/g, '_') + '"><span class="mdl-switch__label">' + String(_label) + '</span></label>';
          break;
        case 'number':
          return '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><input class="mdl-textfield__input ' + _class + '" ' + _required + ' min="' + _min + '" max="' + _max + '" type="' + _type + '" value="' + _value + '" id="' + encodeURIComponent(_label).replace(/%20/g, '_') + '"><label class="mdl-textfield__label" for="' + encodeURIComponent(_label).replace(/%20/g, '_') + '">' + String(_label) + '</label></div>';
          break;
        case 'range':
          return '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label" for="' + encodeURIComponent(_label).replace(/%20/g, '_') + '">' + String(_label) + '</label><input class="mdl-textfield__input ' + _class + '" ' + _required + ' min="' + _min + '" max="' + _max + '" type="number" value="' + _value + '" id="' + encodeURIComponent(_label).replace(/%20/g, '_') + '"><input class="mdl-slider mdl-js-slider ' + _class + '" ' + _required + ' min="' + _min + '" max="' + _max + '" step="' + _step + '" type="' + _type + '" value="' + _value + '" id="' + encodeURIComponent(_label).replace(/%20/g, '_') + '"></div>';
          break;
        default:
          return '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><input class="mdl-textfield__input ' + _class + '" ' + _required + ' type="' + _type + '" value="' + _value + '" id="' + encodeURIComponent(_label).replace(/%20/g, '_') + '"><label class="mdl-textfield__label" for="' + encodeURIComponent(_label).replace(/%20/g, '_') + '">' + String(_label) + '</label></div>';
      }
    },
    updateTitle: function (titleText) {
      titleText != 'Roster' ? titleEnd = ' - Roster' : titleEnd = '';
      return $('title').text(titleText + titleEnd);
    },
    teamMemberCard: function (id, name, title, bg, text) {
      if (text != '' && bg.match(/#[0-9a-f]{6}/g)) {
        cardDetail = 'style="color:' + text + ';background:none;"'
      } else {
        cardDetail = 'style="color:#ffffff"'
      }
      return $('<div class="team-member mdl-card mdl-shadow--2dp" id="' + id + '"><div class="mdl-card__menu"><button class="edit mdl-button mdl-button--icon mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary"><i class="material-icons">edit</i></button><button class="remove save-data mdl-button mdl-button--icon mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"><i class="material-icons">delete</i></button></div><div class="mdl-card__title mdl-card--expand"></div><div class="mdl-card__actions details" ' + cardDetail + '><span class="card-name">' + name + '</span><span class="card-title">' + title + '</span></div></div>').css('background', 'center/cover ' + bg);
    },
    editTeamMember: function (id) {
      var papa = this.newTeamMemberCard();

      var findTeamMember = r.helper.find(id, 'id', r.settings.Team.members);

      if (findTeamMember) {
        var member = findTeamMember;

        $(papa).attr('id', member.id);
        $(papa).find('#Name').parent()[0].MaterialTextfield.change(member.name);
        $(papa).find('#Title').parent()[0].MaterialTextfield.change(member.title);
        $(papa).find('#Email').parent()[0].MaterialTextfield.change(member.email);
        if (member.bg.indexOf('url(') === 0) {
          $(papa).find('.upload').css('background-image', member.bg).text('');
        }

      } else {

        $('#Team #add-card').prop('disabled', false);
        $('.adding').remove();
        r.helper.toast('Selected member not found :(');

      }
      return papa;
    },
    newTeamMemberCard: function () {
      $('#Team #add-card').prop('disabled', true);

      var papa = $('<div class="team-member adding mdl-card mdl-shadow--2dp"><div class="mdl-card__actions details"><div class="card-name" data-input="Name" required="true"></div><div class="card-title" data-input="Title" required="true"></div><div class="card-email" data-input="Email" data-type="email"></div><div class="bottom"><input type="file" hidden /><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect upload"><img src="" hidden>Photo</button><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect save-data mdl-button--accent" disabled>Save</button></div></div></div>');

      $('body').append(papa);

      $('*[data-input]', papa).each(function (i, e) {
        $(e).html(r.ui.input($(e)));
        window.componentHandler.upgradeDom();
      });

      $('.mdl-js-textfield', papa).on('change keyup', function () {
        if ($('.is-invalid', papa).length === 0 && $('[required=true] .is-dirty', papa).length === $('[required=true] .mdl-js-textfield', papa).length) {
          $('.save-data', papa).prop('disabled', false);
        } else {
          $('.save-data', papa).prop('disabled', true);
        }
      });
      $('input:first', papa).focus();

      return papa;
    },
    rosterGrid: function (team) {
      var rosterRow = '<div class="mdl-grid roster-header mdl-grid--no-spacing">';
      rosterRow += '<div class="mdl-cell">Team Member</div>';
      var weekTemp = '',
        week = r.helper.week;
      for (var day in week) {
        if (week[day] === 'Saturday' || week[day] === 'Sunday') {
          weekTemp += ('<div class="mdl-cell weekend">' + week[day] + '</div>');
        } else {
          weekTemp += ('<div class="mdl-cell">' + week[day] + '</div>');
        }
      }
      rosterRow += weekTemp + '</div>';
      for (var member in team) {
        var tm = team[member];
        // FOR COVER IMAGE - Add to Templates
        //        if (tm.text != '' && tm.bg.match(/#[0-9a-f]{6}/g)) {
        //          cardDetail = 'style="color:' + tm.text + ';background:none;"';
        //        } else {
        //          cardDetail = 'style="color:#ffffff"';
        //        }
        var papa = this;
        var cellWeek = '';
        $(weekTemp).each(function () {
          var start = '',
            finish = '';
          if (r.settings.Roster[tm.id]) {
            start = r.settings.Roster[tm.id][$(this).text()].start;
            finish = r.settings.Roster[tm.id][$(this).text()].finish;
          }
          var inline = function () {
            if (start && finish) {
              if (start.length > 0 && finish.length > 0) {
                return start + ' &mdash; ' + finish;
              } else {
                return (start + ' ' + finish).trim();
              }
            } else {
              return '';
            }
          }
          $(this).html('<span class="ready-time">' + inline() + '</span><div data-class="time start" data-input="Start" data-value="' + start + '"></div><div data-class="time end" data-input="Finish" data-value="' + finish + '"></div><button class="copy-time mdl-button mdl-js-button mdl-js-ripple-effect" tabindex="-1"><i class="material-icons">content_copy</i> Copy</button><button class="paste-time mdl-button mdl-js-button mdl-js-ripple-effect" tabindex="-1"><i class="material-icons">content_paste</i> Paste</button><button class="done-time mdl-button mdl-js-button mdl-js-ripple-effect" tabindex="-1"><i class="material-icons">check_circle</i> Done</button>');
          cellWeek += this.outerHTML;
        });
        var body = $('<div class="mdl-grid roster-body mdl-grid--no-spacing" id="' + tm.id + '"><div class="mdl-cell team-member"><div class="mdl-card__actions details"><span class="card-name">' + tm.name + '</span></div></div>' + cellWeek + '</div>');

        if (r.settings.Templates[0].title) {
          $('.team-member .details', body).append('<span class="card-title">' + tm.title + '</span>');
        }
        if (r.settings.Templates[0].hours) {
          $('.team-member .details', body).append('<span class="hours" hidden></span>');
        }
        if (r.settings.Templates[0].avatar) {
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
        }
        rosterRow += body[0].outerHTML;
      }
      return rosterRow;
    },
    rosterHeader: function (company) {
      return '<div class="company"><h3>' + company.name + '</h3><h4>' + company.slogan + '</h4></div><div class="mdl-layout-spacer"></div><div class="logo"><img class="mdl-logo" src="' + company.logo + '" height="100"></div>'
    },
    templateCard: function (template) {
      return '<div class="template mdl-card mdl-shadow--2dp"><div class="mdl-card__actions details"><div class="card-avatar" data-input="Avatar" data-type="checkbox" data-checked="' + template.avatar + '"></div><div class="card-title" data-input="Title" data-type="checkbox" data-checked="' + template.title + '"></div><div class="card-hours" data-input="Hours" data-type="checkbox" data-checked="' + template.hours + '"></div><div class="card-working-hours" data-type="range" data-min="1" data-max="12" required="true" data-input="Default Working Hours" data-value="' + template.defaultWorkingHours + '"></div><div class="mdl-layout-spacer"></div><div class="bottom"><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect save-data mdl-button--accent" disabled>Save & Activate</button></div></div></div>'
    },
    newTemplateCard: '<div class="template adding mdl-card mdl-shadow--2dp"><div class="mdl-card__actions details"><div class="card-avatar" data-input="Avatar" data-type="checkbox"></div><div class="card-title" data-input="Title" data-type="checkbox"></div><div class="card-hours" data-input="Hours" data-type="checkbox"></div><div class="mdl-layout-spacer"></div><div class="bottom"><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect save-data mdl-button--accent" disabled>Save</button></div></div></div>'


  },
  o: function (obj) {
    return Object.keys(obj);
  },
  helper: {
    week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    addMember: function (name, email, title, bg, id) {
      var id = id || undefined;
      if (id) {
        var memberIndex = r.settings.Team.members.indexOf(r.helper.find(id, 'id', r.settings.Team.members));
        this.remove(memberIndex, r.settings.Team.members);
      } else {
        id = Date.now();
      }

      var text = "#ffffff";
      if (bg === 'none') {
        var palette = r.helper.randomPalette();
        bg = palette.colour;
        text = palette.text;
      }
      r.settings.Team.members.push({
        'id': id,
        'name': name,
        'title': title,
        'email': email,
        'bg': bg || '',
        'text': text || ''
      });
    },
    editMember: function (id, name, email, title, bg) {
      this.addMember(name, email, title, bg, id);
    },
    remove: function (i, where) {
      where.splice(i, 1);
    },
    find: function (what, inside, where) {
      return where.find(function (obj) {
        return obj[inside] == what;
      })
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
      var storedItem = localStorage.getItem(item);
      if (storedItem === undefined) {
        r.helper.toast(item + ' not found');
        return undefined;
      } else {
        return JSON.parse(storedItem);
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
