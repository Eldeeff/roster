$.getJSON('js/mdlPalette.json').done(function (data) {
  r.ui.palette = data;
})



if (r.helper.get('settings')) {
  $.extend(true, r.settings, r.helper.get('settings'));
}

for (var i = 0; i < r.o(r.settings).length; i++) {
  // Create Links
  r.ui.menu.append($(r.ui.menuItem).text(r.o(r.settings)[i]).attr('href', '#' + r.o(r.settings)[i]));

  // Create Pages
  r.ui.page.prepend($(r.ui.pageTab).attr('id', r.o(r.settings)[i]));
}

// Mark current/landing page as active based of URL
if (window.location.hash.length === 0) {
  window.location.hash = 'Roster';
}

// Bind page loads
$('a', r.ui.menu).click(function () {
  var a = $(this);
  var pageName = a.attr('href').split('#')[1];
  if (a.attr('href') != window.location.hash) {
    window.location.hash = pageName;
  }
});
$(window).on('load hashchange', function (e) {

  var pageName = window.location.hash;
  r.ui.updateTitle(pageName.split('#')[1]);
  $('> a', r.ui.menu).removeClass(r.ui.activeTabClass);
  var activeIndex = $('> a[href="' + pageName + '"]', r.ui.menu);
  $(activeIndex).addClass(r.ui.activeTabClass);

  $('> section', r.ui.page).removeClass(r.ui.activePanelClass);
  $('> section' + pageName, r.ui.page).addClass(r.ui.activePanelClass).find('.page-content').append(r.ui.loadingSpinner).load('pages/' + pageName.split('#')[1] + '.html');

  init();

  activeIndex.get(0).click();

})

$('body').on('submit', function (e) {
  console.log(e);
  if ($(e.target).find('.save-data:not(:disabled)').length) {
    $(e.target).find('.save-data:not(:disabled)').click();
  } else {
    var form = $(e.target);
    form.find(':not(.is-dirty) > input:not(:disabled)').focus();
  }
});

$('body').on('change keyup', 'input,textarea,select', function () {
  var input = $(this),
    parent = input.parents('section.panel');

  $('.page-buttons .save-data:first:disabled', parent).removeProp('disabled');
});

$('body').on('click', '.save-data', function () {
  save();
});
$('body').on('roster:save', function () {
  save();
});

function save() {
  setTimeout(() => {

    var saveType = 'details',
      parent = $('section.panel.active');

    if ($(parent).attr('id') === 'Roster') {
      $('.roster-body').each(function () {
        var id = $(this).attr('id');
        r.settings.Roster[id] = {};
        $('.mdc-cell:not(.team-member)', $(this)).each(function (i) {
          var day = $('.roster-header .mdc-cell').eq(i + 1).text();
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

    if ($(parent).attr('id') === 'Team') {
      saveType = 'member details';
      if ($('.team-member.adding:not([id])').length === 1) {
        // ADD NEW
        var member = {
          name: $('.team-member.adding #Name').val(),
          email: $('.team-member.adding #Email').val(),
          title: $('.team-member.adding #Title').val(),
          bg: $('.team-member.adding .upload').css('background-image')
        }
        r.helper.addMember(member);
      } else if ($('.team-member.adding[id]').length === 1) {
        // EDIT EXISTING
        r.helper.editMember($('.team-member.adding').attr('id'), $('.team-member.adding #Name').val(), $('.team-member.adding #Email').val(), $('.team-member.adding #Title').val(), $('.team-member.adding .upload').css('background-image'), $('.team-member.adding').data('id'));
      } else if ($('.team-member[data-id]').length > 0) {
        // EDIT ALL EXISTING
        saveType = 'member order';
        $('.team-member[id]').each(function () {
          r.helper.reorderMember($(this).attr('id'), $(this).data('id'));
        })
      }
    }

    if ($(parent).attr('id') === 'Templates') {
      r.settings.Templates = [{
        'avatar': $('#Templates .template .card-avatar input[type=checkbox]').prop('checked'),
        'title': $('#Templates .template .card-title input[type=checkbox]').prop('checked'),
        'hours': $('#Templates .template .card-hours input[type=checkbox]').prop('checked'),
        'break': $('#Templates .template .card-break input[type=checkbox]').prop('checked'),
        'defaultWorkingHours': Number($('#Templates .template .card-working-hours .mdc-slider').attr('aria-valuenow'))
      }];
    }

    r.helper.set('settings', r.settings);

    r.helper.toast('Saved ' + $(parent).attr('id') + ' ' + saveType);

    $('section.panel.active').find('.page-content').html('').append(r.ui.loadingSpinner).load('pages/' + $('section.panel.active').attr('id') + '.html');
  }, 5);
}


$('body').on('click', '.upload', function (e) {
  var $this = $(this),
    papa = $this.parents('.mdc-card:first'),
    inputFile = $('input[type=file]', papa);
  if ($(this).is(':focus') || $(e.target).parents('.upload').is(':focus') || $(this).is(':hover') || $(e.target).parents('.upload').is(':hover')) {
    inputFile.removeProp('disabled');
    $('.save-data', papa).prop('disabled', true);
  }
  inputFile.off().click();
  inputFile.on('change', function () {
    var reader = new FileReader();

    reader.onload = function (e) {

      var img = document.createElement('img');
      img.src = e.target.result;

      var section = $this.parents('section.panel').attr('id');

      setTimeout(function () {
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        var canvasSize = 200;
        var ratio = 1;

        if (section === 'Company') {
          // RESIZE
          var maxWH = Math.max(img.width, img.height);
          if (maxWH > canvasSize) {
            ratio = canvasSize / maxWH;
          }
          c.width = img.width * ratio;
          c.height = img.height * ratio;
          ctx.drawImage(img, 0, 0, c.width, c.height);
          finalImg = c.toDataURL();

          $('#Company_Logo', papa).attr('src', finalImg).removeProp('hidden');
          $('.remove', papa).parent().removeProp('hidden');

          $('.save-data:first', $('#' + section)).removeProp('disabled');
        } else if (section === 'Team') {
          // CROP
          var minWH = Math.min(img.width, img.height);
          if (minWH > canvasSize) {
            ratio = canvasSize / minWH;
          }
          c.width = minWH * ratio;
          c.height = minWH * ratio;
          var cImgW = img.width * ratio;
          var cImgH = img.height * ratio;
          ctx.drawImage(img, c.width / 2 - cImgW / 2, c.height / 2 - cImgH / 2, cImgW, cImgH);

          finalImg = c.toDataURL();
          $this.text('').css('background-image', 'url(' + finalImg + ')');
        }

      }, 1)
    }
    reader.readAsDataURL(this.files[0]);
    $('.save-data', papa).removeProp('disabled');
  });
});

$('body').on('click', '#Company .remove', function () {
  var $this = $(this),
    papa = $this.parents('.mdc-card:first');

  var section = $this.parents('section.panel').attr('id');

  $(this).parent().prop('hidden', true);
  $('#Company_Logo', papa).attr('src', '').prop('hidden', true);
  $('.save-data:first', $('#' + section)).removeProp('disabled');
});

function init() {

  mdc.autoInit();

  var buttons = $('.mdc-button:not(.mdc-ripple-upgraded), .mdc-icon-button:not(.mdc-ripple-upgraded)');
  $(buttons).each((i, e) => {
    mdc.ripple.MDCRipple.attachTo(e);
  });
}

$('button.export').on('click', function () {
  var filename = 'Roster - ' + r.settings.Company.name + '.json';
  var blob = new Blob([JSON.stringify(r.settings, null, 2)], {
    type: 'application/json',
    name: filename
  });
  var href = window.URL.createObjectURL(blob);
  $('<a>').attr({
    'href': href,
    'download': filename
  })[0].click();
  console.log(href);
});
$('input#import').on('change', function () {
  var reader = new FileReader();

  reader.onload = function (e) {
    var newSettings = JSON.parse(e.target.result);
    if (newSettings.Roster != undefined) {
      r.settings = newSettings;
      $('body').trigger('roster:save');
    } else {
      r.helper.toast('Invalid file');
    }
  }

  if (this.files[0].type === 'application/json') {
    reader.readAsText(this.files[0]);
  } else {
    r.helper.toast('Wrong file type - Needs to be .json');
  }
})


$(document).on('MDCAutoInit:End', function () {
  $('*[data-mdc-auto-init]').removeAttr('data-mdc-auto-init');
})

// MDI Upgrade and create inputs
$(document).ajaxComplete(function () {
  $('*[data-input]').each(function (i, e) {
    if ($(e).parents('.roster').length) {
      $(e).replaceWith(r.ui.input($(e)));
    } else {
      $(e).html(r.ui.input($(e)));
    }
    if ($(e).data('value')) {
      $('input', $(e)).val($(e).data('value'));
    }
  });
  var event = new Event('mdc-done');
  $('body').trigger('mdc-done');
  init();
});