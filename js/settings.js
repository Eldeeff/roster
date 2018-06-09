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
      'break': true,
      'defaultWorkingHours': 8
    }]
  },
  ui: {
    TIME_IN: 'clock-start',
    TIME_OUT: 'clock-end',
    TIME_SEPARATOR: '<br>',
    BREAK_SHORT: 'coffee',
    BREAK_LONG: 'silverware-variant',
    MEMBER_EDIT: 'account-edit',
    DELETE: 'delete',
    MEMBER_ADD: 'account-plus',
    MEMBER_DELETE: 'account-remove',
    snackbar: $('.mdc-snackbar'),
    menu: $('#menu'),
    menuItem: '<a class="mdc-navigation__link mdc-tabs__tab" href="#"></a>',
    page: $('#page'),
    pageTab: '<section class="mdc-layout__tab-panel" id=""><div class="page-content"></div></section>',
    loadingSpinner: '<div class="mdc-spinner mdc-spinner--single-color mdc-js-spinner is-active"></div>',
    input: function (input) {

      this.label = input.data('input') || '';
      this.labelEncoded = encodeURIComponent(this.label)
      this.labelID = this.labelEncoded.replace(/%20/g, '_');
      this.type = input.data('type') || 'text';
      this.class = input.data('class') || '';
      this.value = input.data('value') || '';
      this.min = input.data('min') || '';
      this.max = input.data('max') || '';
      this.step = input.data('step') || 1;
      this.required = input.data('required') ? 'required' : '';
      this.checked = input.data('checked') ? 'checked' : '';

      var element;

      switch (this.type) {
        case 'checkbox':
          element = `
          <label class="mdc-switch mdc-js-switch mdc-js-ripple-effect" for="${this.labelID}">
            <input class="mdc-switch__input ${this.class}"${this.checked} type="${this.type}" value="${this.value}" id="${this.labelID}">
            <span class="mdc-switch__label">${this.label}</span>
          </label>`;
          break;
        case 'number':
          element = `
          <div class="mdc-textfield mdc-js-textfield mdc-textfield--floating-label">
            <input class="mdc-textfield__input ${this.class}" ${this.required} min="${this.min}" max="${this.max}" type="${this.type}" value="${this.value}" id="${this.labelID}">
            <label class="mdc-textfield__label" for="${this.labelID}">${this.label}</label>
          </div>`;
          break;
        case 'range':
          element = `
          <div class="mdc-textfield mdc-js-textfield mdc-textfield--floating-label">
            <label class="mdc-textfield__label" for="${this.labelID}">${this.label}</label>
            <input class="mdc-textfield__input ${this.class}" ${this.required} min="${this.min}" max="${this.max}" type="number" value="${this.value}" id="${this.labelID}">
            <input class="mdc-slider mdc-js-slider ${this.class}" ${this.required} min="${this.min}" max="${this.max}" step="${this.step}" type="${this.type}" value="${this.value}" id="${this.labelID}">
          </div>`;
          break;
        default:
          element = `
          <div class="mdc-textfield mdc-js-textfield mdc-textfield--floating-label">
            <input class="mdc-textfield__input ${this.class}" ${this.required} type="${this.type}" value="${this.value}" autocomplete="${this.labelEncoded}" id="${this.labelID}" minlength="2">
            <label class="mdc-textfield__label" for="${this.labelID}">${this.label}</label>
          </div>`;
      }
      return element.replace(/\s{2,}\s/g, '');
    },
    updateTitle: function (titleText) {
      titleText != 'Roster' ? titleEnd = ' - Roster' : titleEnd = '';
      return $('title').text(titleText + titleEnd);
    },
    teamMemberCard: function (id, name, title, bg, text) {
      var card = `
      <div class="team-member mdc-card mdc-shadow--2dp" id="${id}">
        <div class="mdc-card__menu">
          <button class="edit mdc-button mdc-button--icon mdc-js-button mdc-button--raised mdc-js-ripple-effect mdc-button--primary">
            <i class="material-icons">${r.ui.MEMBER_EDIT}</i>
          </button>
          <button class="remove save-data mdc-button mdc-button--icon mdc-js-button mdc-button--raised mdc-js-ripple-effect mdc-button--primary">
            <i class="material-icons">${r.ui.MEMBER_DELETE}</i>
          </button>
        </div>
        <div class="mdc-card__title mdc-card--expand"></div>
        <div class="mdc-card__actions details">
          <span class="card-name">${name}</span>
          <span class="card-title">${title}</span>
        </div>
      </div>`;

      card = $(card);

      card.css('background', 'center/cover ' + bg)
        .find('.details').css({
          'color': text,
          'background': bg.match(/#([0-9a-f]{3}){1,2}/gi) ? 'none' : undefined
        });

      return card;
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
        $('#Team #reorder').prop('disabled', false);
        $('.adding').remove();
        r.helper.toast('Selected member not found :(');
      }
      return papa;
    },
    newTeamMemberCard: function () {
      $('#Team #add-card').prop('disabled', true);
      $('#Team #reorder').prop('disabled', true);

      var card = `
      <div class="team-member adding mdc-card mdc-shadow--2dp">
        <form action="">
          <div class="mdc-card__actions details">
            <div class="card-name" data-input="Name" data-required="true"></div>
            <div class="card-title" data-input="Title" data-required="true"></div>
            <div class="card-email" data-input="Email" data-type="email"></div>
            <div class="bottom">
              <input type="file" hidden disabled/>
              <button class="mdc-button mdc-js-button mdc-button--raised mdc-js-ripple-effect upload"><img src="" hidden>Photo</button>
              <div class="mdc-layout-spacer"></div>
              <button class="mdc-button mdc-js-button mdc-button--raised mdc-js-ripple-effect save-data mdc-button--primary" disabled>Save</button>
            </div>
          </div>
        </form>
      </div>`;
      var papa = $(card);

      $('body').append(papa);

      $('*[data-input]', papa).each(function (i, e) {
        $(e).html(r.ui.input($(e)));
        mdc.autoInit();
      });
      $('.mdc-js-textfield', papa).on('change keyup', function () {
        if ($('.is-invalid', papa).length === 0 && $('.is-dirty [required=true]', papa).length === $('.mdc-js-textfield [required=true]', papa).length) {
          $('.save-data', papa).prop('disabled', false);
        } else {
          $('.save-data', papa).prop('disabled', true);
        }
      });

      setTimeout(function () {
        $('input:first', papa).focus();
      }, 1);

      return papa;
    },
    rosterGrid: function (team) {
      var rosterRow = '<div class="mdc-grid roster-header mdc-grid--no-spacing">';
      rosterRow += '<div class="mdc-cell">Team Member</div>';
      var weekTemp = '',
        week = r.helper.week;
      for (var day in week) {
        if (week[day] === 'Saturday' || week[day] === 'Sunday') {
          weekTemp += ('<div class="mdc-cell weekend">' + week[day] + '</div>');
        } else {
          weekTemp += ('<div class="mdc-cell">' + week[day] + '</div>');
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
          var membersRoster = r.settings.Roster[tm.id];

          var start = membersRoster ? membersRoster[$(this).text()].start : '',
            finish = membersRoster ? membersRoster[$(this).text()].finish : '';

          var readyTime = r.helper.join([`<i class="material-icons">${r.ui.TIME_IN}</i> ${start}`, `<i class="material-icons">${r.ui.TIME_OUT}</i> ${finish}`], r.ui.TIME_SEPARATOR);
          $(this).html(`
          <span class="ready-time">${readyTime}</span>
          <div data-class="time start" data-input="Start" data-value="${start}"></div>
          <div data-class="time end" data-input="Finish" data-value="${finish}"></div>
          <div class="buttons">
            <button class="copy-time mdc-button mdc-js-button mdc-js-ripple-effect" tabindex="-1">
              <i class="material-icons">content_copy</i> Copy
            </button>
            <button class="paste-time mdc-button mdc-js-button mdc-js-ripple-effect" tabindex="-1">
              <i class="material-icons">clear</i> Clear
            </button>
            <button class="done-time mdc-button mdc-js-button mdc-js-ripple-effect" tabindex="-1">
              <i class="material-icons">check_circle</i> Done
            </button>
          </div>`.replace(/\s{2,}\s/g, ''));

          cellWeek += this.outerHTML;
        });
        var body = $(`
          <div class="mdc-grid roster-body mdc-grid--no-spacing" id="${tm.id}">
            <div class="mdc-cell team-member">
              <div class="mdc-card__actions details">
                <span class="card-name">${tm.name}</span>
              </div>
            </div>
            ${cellWeek}
          </div>`);

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
            c.width = 10;
            c.height = 10;
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
      return `
      <div class="company">
        <h3>${company.name}</h3>
        <h4>${company.slogan}</h4>
      </div>
      <div class="mdc-layout-spacer"></div>
      <div class="logo">
        <img class="mdc-logo" src="${company.logo}" height="100">
      </div>`
    },
    templateCard: function (template) {
      return `
      <div class="template mdc-card mdc-shadow--2dp">
        <div class="mdc-card__actions details">
          <div class="card-avatar" data-input="Avatar" data-type="checkbox" data-checked="${template.avatar}"></div>
          <div class="card-title" data-input="Title" data-type="checkbox" data-checked="${template.title}"></div>
          <div class="card-hours" data-input="Hours" data-type="checkbox" data-checked="${template.hours}"></div>
          <div class="card-break" data-input="Break" data-type="checkbox" data-checked="${template.break}"></div>
          <div class="card-working-hours" data-type="range" data-min="1" data-max="12" data-required="true" data-input="Default Working Hours" data-value="${template.defaultWorkingHours}"></div>
          <div class="mdc-layout-spacer"></div>
          <div class="bottom">
            <button class="mdc-button mdc-js-button mdc-button--raised mdc-js-ripple-effect save-data mdc-button--primary" disabled>Save & Activate</button>
          </div>
        </div>
      </div>`
    },
    newTemplateCard: `
    <div class="template adding mdc-card mdc-shadow--2dp">
      <div class="mdc-card__actions details">
        <div class="card-avatar" data-input="Avatar" data-type="checkbox"></div>
        <div class="card-title" data-input="Title" data-type="checkbox"></div>
        <div class="card-hours" data-input="Hours" data-type="checkbox"></div>
        <div class="mdc-layout-spacer"></div>
        <div class="bottom">
          <button class="mdc-button mdc-js-button mdc-button--raised mdc-js-ripple-effect save-data mdc-button--primary" disabled>Save</button>
        </div>
      </div>
    </div>`
  },
  o: function (obj) {
    return Object.keys(obj);
  },
  helper: {
    week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    addMember: function (name, email, title, bg, id, order) {
      var id = id || undefined;
      if (id) {
        var memberIndex = r.settings.Team.members.indexOf(r.helper.find(id, 'id', r.settings.Team.members));
        this.remove(memberIndex, r.settings.Team.members);
      } else {
        id = (Date.now()).toString();
      }

      var text = "#ffffff";
      if (bg === 'none') {
        var palette = r.helper.randomPalette();
        bg = palette.colour;
        text = palette.text;
      }
      r.settings.Team.members.push({
        'id': id,
        'order': order || r.settings.Team.members.length + 1,
        'name': name,
        'title': title,
        'email': email,
        'bg': bg || '',
        'text': text || ''
      });
    },
    editMember: function (id, name, email, title, bg, order) {
      var memberIndex = r.settings.Team.members.indexOf(r.helper.find(id, 'id', r.settings.Team.members));
      var text = "#ffffff";
      if (bg === 'none') {
        var palette = r.helper.randomPalette();
        bg = palette.colour;
        text = palette.text;
      }
      r.settings.Team.members[memberIndex] = {
        'id': id,
        'order': order || r.settings.Team.members.length + 1,
        'name': name,
        'title': title,
        'email': email,
        'bg': bg || '',
        'text': text || ''
      }
    },
    reorderMember: function (id, order) {
      var memberIndex = r.settings.Team.members.indexOf(r.helper.find(id, 'id', r.settings.Team.members));
      r.settings.Team.members[memberIndex].order = order;
      r.settings.Team.members.sort(function (a, b) {
        return a.order > b.order;
      });
    },
    join: function (items, separator) {
      // remove blanks
      var arr = items.filter(function (e) {
        return e;
      });
      // join em
      return arr.join(separator);
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
      $(e).parents('.mdc-cell:first').addClass('master-copy-time');
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