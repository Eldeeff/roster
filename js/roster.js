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
  $('*[data-input]').each(function (i, e) {
    if ($(e).parents('.roster').length) {
      $(e).replaceWith(r.ui.input($(e)));
    } else {
      $(e).html(r.ui.input($(e)));
    }
    $('input', $(e)).val(r.helper.get($(e).data('input')));
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

  if ($(parent).attr('id') === 'Templates') {
    r.settings.Templates = [{
      'avatar': $('#Templates .template .card-avatar input[type=checkbox]').prop('checked'),
      'title': $('#Templates .template .card-title input[type=checkbox]').prop('checked'),
      'hours': $('#Templates .template .card-hours input[type=checkbox]').prop('checked')
    }];
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
