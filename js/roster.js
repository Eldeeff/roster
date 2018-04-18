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
  r.ui.page.append($(r.ui.pageTab).attr('id', r.o(r.settings)[i]));
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
$(window).on('load hashchange', function () {

  var pageName = window.location.hash;
  r.ui.updateTitle(pageName.split('#')[1]);
  $('> a', r.ui.menu).removeClass('is-active');
  $('> a[href="' + pageName + '"]', r.ui.menu).addClass('is-active');

  $('> section', r.ui.page).removeClass('is-active');
  $('> section' + pageName, r.ui.page).addClass('is-active').find('.page-content').append(r.ui.loadingSpinner).load('pages/' + pageName.split('#')[1] + '.html');

  window.componentHandler.upgradeDom();
})



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

  if ($(parent).attr('id') === 'Team') {
    // ADD NEW
    if ($('.team-member.adding:not([id])').length === 1) {
      r.helper.addMember($('.team-member.adding #Name').val(), $('.team-member.adding #Email').val(), $('.team-member.adding #Title').val(), $('.team-member.adding .upload').css('background-image'));
    }
    // EDIT EXISTING
    if ($('.team-member.adding[id]').length === 1) {
      r.helper.editMember($('.team-member.adding').attr('id'), $('.team-member.adding #Name').val(), $('.team-member.adding #Email').val(), $('.team-member.adding #Title').val(), $('.team-member.adding .upload').css('background-image'));
    }
  }

  if ($(parent).attr('id') === 'Templates') {
    r.settings.Templates = [{
      'avatar': $('#Templates .template .card-avatar input[type=checkbox]').prop('checked'),
      'title': $('#Templates .template .card-title input[type=checkbox]').prop('checked'),
      'hours': $('#Templates .template .card-hours input[type=checkbox]').prop('checked'),
      'defaultWorkingHours': $('#Templates .template .card-working-hours input').val()
    }];
  }

  r.helper.set('settings', r.settings);

  r.helper.toast('Saved ' + $(parent).attr('id') + ' details');
  $('input,textarea,select', parent).on('change keydown', function () {
    btn.prop('disabled', false);
  });

  $('section.is-active').find('.page-content').html('').append(r.ui.loadingSpinner).load('pages/' + $('section.is-active').attr('id') + '.html');
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
  var event = new Event('mdl-done');
  $('body').trigger('mdl-done');
  window.componentHandler.upgradeDom();
});
