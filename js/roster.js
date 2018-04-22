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
$(window).on('load hashchange', function () {

  var pageName = window.location.hash;
  r.ui.updateTitle(pageName.split('#')[1]);
  $('> a', r.ui.menu).removeClass('is-active');
  $('> a[href="' + pageName + '"]', r.ui.menu).addClass('is-active');

  $('> section', r.ui.page).removeClass('is-active');
  $('> section' + pageName, r.ui.page).addClass('is-active').find('.page-content').append(r.ui.loadingSpinner).load('pages/' + pageName.split('#')[1] + '.html');

  window.componentHandler.upgradeDom();
})

$('body').on('submit', function (e) {
  if ($(e.target).find('.save-data:not(:disabled)').length) {
    $(e.target).find('.save-data:not(:disabled)').click();
  } else {
    var form = $(e.target);
    form.find(':not(.is-dirty) > input:not(:disabled)').focus();
  }
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

  if ($(parent).attr('id') === 'Team') {
    if ($('.team-member.adding:not([id])').length === 1) {
      // ADD NEW
      r.helper.addMember($('.team-member.adding #Name').val(), $('.team-member.adding #Email').val(), $('.team-member.adding #Title').val(), $('.team-member.adding .upload').css('background-image'));
    } else if ($('.team-member.adding[id]').length === 1) {
      // EDIT EXISTING
      r.helper.editMember($('.team-member.adding').attr('id'), $('.team-member.adding #Name').val(), $('.team-member.adding #Email').val(), $('.team-member.adding #Title').val(), $('.team-member.adding .upload').css('background-image'), $('.team-member.adding').data('id'));
    } else {
      // EDIT ALL EXISTING
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

$('body').on('click', 'button.upload', function (e) {
  var $this = $(this),
    inputFile = $this.siblings('input[type=file]');
  if ($(this).is(':focus') || $(e.target).parents('button.upload').is(':focus') || $(this).is(':hover') || $(e.target).parents('button.upload').is(':hover')) {
    inputFile.removeProp('disabled');
    $this.siblings('.save-data').prop('disabled', true);
  }
  inputFile.click();
  inputFile.off().on('change', function () {
    var reader = new FileReader();
    reader.onload = function (e) {

      var img = document.createElement('img');
      img.src = e.target.result;

      var section = $this.parents('section').attr('id');

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

          $this.prev('#Company_Logo').attr('src', finalImg).removeProp('hidden');
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
    $this.siblings('.save-data').prop('disabled', false);
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