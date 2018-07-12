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
      members: [],
      settings: {
        sortby: 'order'
      }
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
    constants: {
      HOURS_COPY: {
        icon: 'content-copy',
        text: 'Copy'
      },
      HOURS_PASTE: {
        icon: 'content-paste',
        text: 'Paste'
      },
      HOURS_CLEAR: {
        icon: 'close',
        text: 'Clear'
      },
      HOURS_DONE: {
        icon: 'check-circle',
        text: 'Done'
      },
      TIME_IN: {
        icon: 'clock-in',
        text: 'In'
      },
      TIME_OUT: {
        icon: 'clock-out',
        text: 'Out'
      },
      BREAK_SHORT: {
        icon: 'coffee',
        text: '15m'
      },
      BREAK_LONG: {
        icon: 'silverware-variant',
        text: '30m'
      },
      MEMBER_EDIT: {
        icon: 'account-edit',
        text: 'Edit'
      },
      DELETE: {
        icon: 'delete',
        text: 'Remove'
      },
      MEMBER_ADD: {
        icon: 'account-plus',
        text: 'Add'
      },
      MEMBER_DELETE: {
        icon: 'account-remove',
        text: 'Remove'
      },
      REORDER_HANDLE: {
        icon: 'drag',
        text: 'Re-order'
      },
      PLUS: {
        icon: 'plus',
        text: 'Add'
      },
      IMAGE: {
        icon: 'image',
        text: 'Image'
      },
      COLOUR: {
        icon: 'format-color-fill',
        text: 'Colour'
      }
    },
    snackbar: new mdc.snackbar.MDCSnackbar($('.mdc-snackbar')[0]),
    menu: $('#menu'),
    menuItem: '<a class="mdc-tab" href="#"></a>',
    page: $('#page'),
    pageTab: '<section class="panel" id=""><div class="page-content"></div></section>',
    loadingSpinner: '<div class="mdc-spinner mdc-spinner--single-color is-active"></div>',
    activeTabClass: 'mdc-tab--active',
    activePanelClass: 'active',
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
          <div class="mdc-switch">
            <input class="mdc-switch__native-control ${this.class}"${this.checked} type="${this.type}" value="${this.value}" id="${this.labelID}">
            <div class="mdc-switch__background">
              <div class="mdc-switch__knob"></div>
            </div>
          </div>
          <label for="${this.labelID}" class="mdc-switch--label">${this.label}</label>
          `;
          break;
        case 'number':
          element = `
          <div class="mdc-textfield mdc-js-textfield mdc-textfield--floating-label">
            <input class="mdc-textfield__input ${this.class}" ${this.required} min="${this.min}" max="${this.max}" type="${this.type}" value="${this.value}" id="${this.labelID}">
            <label class="mdc-textfield__label">${this.label}</label>
          </div>`;
          break;
        case 'range':
          element = `
          <label>${this.label}</label>
          <div class="mdc-slider mdc-slider--discrete mdc-slider--display-markers ${this.class}" tabindex="0" role="slider" aria-valuemin="${this.min}" aria-valuemax="${this.max}" aria-valuenow="${this.value}" aria-label="${this.label}" data-step="1" data-mdc-auto-init="MDCSlider">
            <div class="mdc-slider__track-container">
              <div class="mdc-slider__track"></div>
              <div class="mdc-slider__track-marker-container"></div>
            </div>
            <div class="mdc-slider__thumb-container">
              <div class="mdc-slider__pin">
                <span class="mdc-slider__pin-value-marker"></span>
              </div>
              <svg class="mdc-slider__thumb" width="21" height="21">
                <circle cx="10.5" cy="10.5" r="7.875"></circle>
              </svg>
              <div class="mdc-slider__focus-ring"></div>
            </div>
          </div>
          `;
          break;
        default:
          element = `
          <div class="mdc-text-field" data-mdc-auto-init="MDCTextField">
            <input class="mdc-text-field__input ${this.class}" ${this.required} type="${this.type}" value="${this.value}" autocomplete="${this.labelEncoded}" id="${this.labelID}" minlength="2">
            <label class="mdc-floating-label">${this.label}</label>
            <div class="mdc-line-ripple"></div>
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
      <div class="mdc-card team-member" id="${id}">
        <div class="mdc-card__actions">
          <div class="mdc-card__action-buttons">
            <button class="mdc-icon-button edit material-icons mdc-card__action mdc-card__action--icon" type="button">${r.ui.constants.MEMBER_EDIT.icon}</button>
            <button class="mdc-icon-button remove material-icons mdc-card__action mdc-card__action--icon" type="button">${r.ui.constants.MEMBER_DELETE.icon}</button>
          </div>
          <div class="mdc-card__action-icons">
            <button class="mdc-icon-button handle material-icons mdc-card__action mdc-card__action--icon">${r.ui.constants.REORDER_HANDLE.icon}</button>
          </div>
        </div>
        <div class="mdc-card__media mdc-card__media--square">
          <div class="mdc-card__media-content">
            <div class="mdc-card__actions details">
              <h6 class="card-name mdc-typography--headline6">${name}</h6>
              <p class="card-title mdc-typography--subtitle1">${title}</p>
            </div>
          </div>
        </div>
      </div>`;

      card = $(card);

      $('.mdc-card__media', card).css('background', 'center/cover ' + bg).find('.mdc-card__media-content').css('color', text);

      return card;
    },
    editTeamMember: function (id) {
      var findTeamMember = r.helper.find(id, 'id', r.settings.Team.members);
      if (findTeamMember) {
        var member = findTeamMember;
        var papa = this.newTeamMemberCard();

        $(papa).attr('id', member.id);
        $(papa).find('#Name').parent()[0].MDCTextField.value = member.name;
        $(papa).find('#Title').parent()[0].MDCTextField.value = member.title;
        $(papa).find('#Email').parent()[0].MDCTextField.value = member.email;
        if (member.bg.indexOf('url(') === 0) {
          $(papa).find('.image').css('background-image', member.bg).text('');
        } else {
          var palette = {
            colour: member.bg,
            text: member.text
          }
          r.helper.setPalette($(papa).find('button.colour'), palette);
        }

        return papa;
      } else {
        $('#Team #add-card').prop('disabled', false);
        $('#Team #reorder').prop('disabled', false);
        $('.adding').remove();
        r.helper.toast('Selected member not found :(');
      }
    },
    newTeamMemberCard: function () {
      $('#Team #add-card').prop('disabled', true);
      $('#Team #reorder').prop('disabled', true);

      var card = `
      <div class="team-member adding mdc-card">
        <form action="">
          <div class="details">
            <div class="card-name" data-input="Name" data-required="true"></div>
            <div class="card-title" data-input="Title" data-required="true"></div>
            <div class="card-email" data-input="Email" data-type="email"></div>
          </div>
          <div class="mdc-card__actions">
            <div class="mdc-card__action-buttons">
              <input type="file" accept="image/*" class="mdc-icon-button material-icons mdc-card__action mdc-card__action--icon mdc-theme--primary ${r.ui.constants.IMAGE.icon}"/>
              <button class="mdc-icon-button material-icons mdc-card__action mdc-card__action--icon mdc-theme--primary colour" type="button">${r.ui.constants.COLOUR.icon}</button>
            </div>
            <div class="mdc-card__action-icons">
            <button class="mdc-icon-button mdc-theme--on-primary material-icons mdc-card__action mdc-card__action--icon mdc-button--raised save-data" disabled>${r.ui.constants.MEMBER_ADD.icon}</button>
            </div>
          </div>
        </form>
      </div>`;
      var papa = $(card);

      $('body').prepend(papa);

      $('*[data-input]', papa).each(function (i, e) {
        $(e).html(r.ui.input($(e)));
      });
      init();

      setTimeout(function () {
        $('input:first', papa).focus();
        $(papa).addClass('open');
      }, 1);

      return papa;
    },
    rosterGrid: function (team) {
      var rosterRow = '<div class="mdc-layout-grid__inner mdc-list-item roster-header mdc-elevation-transition">';
      rosterRow += '<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-1">Team Member</div>';
      var weekTemp = '',
        week = r.helper.week;
      for (var day in week) {
        if (week[day] === 'Saturday' || week[day] === 'Sunday') {
          weekTemp += ('<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-1 weekend">' + week[day] + '</div>');
        } else {
          weekTemp += ('<div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-1">' + week[day] + '</div>');
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

          var startChip = start != '' ? `<div class="mdc-chip mdc-elevation--z1"><i class="material-icons mdc-chip__icon mdc-chip__icon--leading">${r.ui.constants.TIME_IN.icon}</i><div class="mdc-chip__text">${start}</div></div>` : '',
            finishChip = finish != '' ? `<div class="mdc-chip mdc-elevation--z1"><i class="material-icons mdc-chip__icon mdc-chip__icon--leading">${r.ui.constants.TIME_OUT.icon}</i><div class="mdc-chip__text">${finish}</div></div>` : '';

          var readyTime = startChip + finishChip;
          $(this).html(`
          <span class="mdc-chip-set ready-time">${readyTime}</span>
          <div data-class="time start" data-input="Start" data-value="${start}"></div>
          <div data-class="time end" data-input="Finish" data-value="${finish}"></div>
          <div class="buttons">
            <button class="copy-time mdc-button" tabindex="-1" type="button">
              <i class="material-icons mdc-button__icon">${r.ui.constants.HOURS_COPY.icon}</i>${r.ui.constants.HOURS_COPY.text}
            </button>
            <button class="paste-time mdc-button" tabindex="-1" type="button">
              <i class="material-icons mdc-button__icon">${r.ui.constants.HOURS_CLEAR.icon}</i>${r.ui.constants.HOURS_CLEAR.text}
            </button>
            <button class="done-time mdc-button" tabindex="-1" type="button">
              <i class="material-icons mdc-button__icon">${r.ui.constants.HOURS_DONE.icon}</i>${r.ui.constants.HOURS_DONE.text}
            </button>
          </div>`.replace(/\s{2,}\s/g, ''));

          cellWeek += this.outerHTML;
        });
        var body = $(`
          <div class="mdc-layout-grid__inner mdc-list-item roster-body" id="${tm.id}">
            <div class="mdc-layout-grid__cell mdc-list mdc-list--avatar-list mdc-list--non-interactive mdc-layout-grid__cell--span-1 team-member">
              <div class="mdc-list-item">
                <div class="mdc-list-item__text details">
                  <span class="mdc-list-item__text card-name">${tm.name}</span>
                </div>
              </div>
            </div>
            ${cellWeek}
          </div>`);

        if (r.settings.Templates[0].title) {
          $('.team-member .details', body).append('<span class="mdc-list-item__secondary-text card-title">' + tm.title + '</span>');
        }
        if (r.settings.Templates[0].hours) {
          $('.team-member .details', body).append('<span class="mdc-list-item__secondary-text hours" hidden></span>');
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
            $('.team-member .mdc-list-item', body).prepend('<div class="mdc-list-item__graphic mdc-elevation--z1"><img src="' + colourImage + '"></div>');
          } else {
            $('.team-member .mdc-list-item', body).prepend('<div class="mdc-list-item__graphic mdc-elevation--z1"><img src="' + tm.bg.split('url("')[1].split('")')[0] + '"></div>');
          }
        }
        rosterRow += body[0].outerHTML;
      }
      return rosterRow;
    },
    rosterHeader: function (company) {
      let html = '';
      if (company) {
        if (company.logo) {
          html += `
          <div class="mdc-card__action-buttons logo">
            <img class="mdc-logo" src="${company.logo}" height="100">
          </div>`;
        }
        html += `<div class="mdc-card__action-icons company">`;
        if (company.name) {
          html += `<h3>${company.name}</h3>`;
        }
        if (company.slogan) {
          html += `<h4>${company.slogan}</h4>`;
        }
        html += `</div>`;
      }
      return html;
    },
    templateCard: function (template) {
      return `
      <div class="template mdc-card">
        <form action="">
          <div class="details">
            <div class="card-avatar" data-input="Avatar" data-type="checkbox" data-checked="${template.avatar}"></div>
            <div class="card-title" data-input="Title" data-type="checkbox" data-checked="${template.title}"></div>
            <div class="card-hours" data-input="Hours" data-type="checkbox" data-checked="${template.hours}"></div>
            <div class="card-break" data-input="Break" data-type="checkbox" data-checked="${template.break}"></div>
            <div class="card-working-hours" data-type="range" data-min="1" data-max="12" data-required="true" data-input="Default Working Hours" data-value="${template.defaultWorkingHours}"></div>
          </div>
          <div class="mdc-card__actions">
            <div class="mdc-card__action-icons">
              <button class="mdc-button mdc-card__action-button mdc-button--raised save-data" disabled>Save & Activate</button>
            </div>
          </div>
        </form>
      </div>`
    },
    newTemplateCard: `
    <div class="template adding mdc-card">
      <div class="mdc-card__actions details">
        <div class="card-avatar" data-input="Avatar" data-type="checkbox"></div>
        <div class="card-title" data-input="Title" data-type="checkbox"></div>
        <div class="card-hours" data-input="Hours" data-type="checkbox"></div>
        <div class="mdc-layout-spacer"></div>
        <div class="bottom">
          <button class="mdc-button mdc-button--unelevated save-data" disabled>Save</button>
        </div>
      </div>
    </div>`
  },
  o: function (obj) {
    return Object.keys(obj);
  },
  helper: {
    week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    addMember: function (member) {
      var member = member || {};
      member.id = member.id || undefined;
      if (member.id) {
        var memberIndex = r.settings.Team.members.indexOf(r.helper.find(member.id, 'id', r.settings.Team.members));
        this.remove(memberIndex, r.settings.Team.members);
      } else {
        member.id = (Date.now()).toString();
      }

      r.settings.Team.members.push({
        'id': member.id,
        'order': member.order || r.settings.Team.members.length + 1,
        'name': member.name,
        'title': member.title,
        'email': member.email,
        'bg': member.bg,
        'text': member.text
      });
    },
    editMember: function (member) {
      var memberIndex = r.settings.Team.members.indexOf(r.helper.find(member.id, 'id', r.settings.Team.members));

      r.settings.Team.members[memberIndex] = {
        'id': member.id,
        'order': member.order || r.settings.Team.members.length + 1,
        'name': member.name,
        'title': member.title,
        'email': member.email,
        'bg': member.bg,
        'text': member.text
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
    toast: function (message, timeout) {
      var timeout = timeout || 2750;
      r.ui.snackbar.show({
        message: message,
        timeout: timeout
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
      var c = r.o(p)[Math.floor(Math.random() * r.o(p).length)];
      var v = r.o(p[c])[Math.floor(Math.random() * r.o(p[c]).length)];
      return p[c][v];
    },
    setPalette: function (element, palette) {
      var newPalette = palette || r.helper.randomPalette();
      $(element).attr('class', (i, c) => {
        return c.replace(/(^|\s)mdc-theme--\S+/g, '');
      }).css({
        'background-color': newPalette.colour,
        'color': newPalette.text
      });
    },
    dialog: function (message) {
      var dialogClone = $('body > .mdc-dialog').clone().removeProp('hidden');
      $('.mdc-dialog__body', dialogClone).text(message);
      return dialogClone;
    }
  }
}