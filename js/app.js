var calDate = new Date();
var calendar = null;
var monthsContainer = ['prev-month', 'current-month', 'next-month'];

$(function () {
  calendar = new Calendar($('#current-month'), calDate, launchNotesModal, loadNotes);
  showCurrentMonthCaption();

  $('.prev-month').click(function () {
    scrollCalendar(-1);
  });

  $('.next-month').click(function () {
    scrollCalendar(1);
  });

  $('.current-month').click(function () {
    $('#selectDateModal').modal();
  });
  var $selMonth = $('#selMonth'), $selYear = $('#selYear');
  fillMonths($selMonth);
  fillYears($selYear);

  $('#changeDate').click(function () {
    calDate = new Date($selYear.val(), $selMonth.val(), 1);
    $('#selectDateModal').modal('hide');
    var $currentMonthContainer = $('#' + $('.item.active').attr('id'));
    calendar = new Calendar($currentMonthContainer, calDate, launchNotesModal, loadNotes);
    showCurrentMonthCaption();
  });

  $('#saveNotes').click(function () {
    var $editNotesModal = $('#editNotesModal');
    var clickedCell = $editNotesModal.data('clicked-cell');

    console.log('##### VAL ', $editNotesModal.find('textarea.note'));

    var noteContent = $editNotesModal.find('textarea.note').val().trim();
    saveNotes(clickedCell.data('date'), noteContent);
    $editNotesModal.modal('hide');
  });

  $('.clear-notes').click(function () {
    $('#editNotesModal').find('textarea.note').val('');
  })
});

function launchNotesModal() {
  var clickedCell = $(this);
  var $editNotesModal = $('#editNotesModal');
  $editNotesModal.data('clicked-cell', clickedCell);
  var day = clickedCell.find('span.day').html();
  var title = 'Notes for ' + calendar.currentMonthStr().replace(' ', ' ' + day + ', ');
  var note = clickedCell.find('.note');
  $editNotesModal.find('textarea.note').val(note.length > 0 && note.html().length > 0 ? replaceHTMLEntities(note.html()) : "");
  $editNotesModal.find('.modal-title').html(title);
  $editNotesModal.modal();
}

var entityReplacementChars = {
  "nbsp": " ",
  "amp": "&",
  "quot": "\"",
  "lt": "<",
  "gt": ">"
};

function replaceHTMLEntities(html) {
  return (html.replace(/&(nbsp|amp|quot|lt|gt);/g, function (match, entity) {
    return entityReplacementChars[entity];
  }) );
}

function loadNotes() {
  var notes = localStorage && localStorage['notes'] && localStorage['notes'][(calDate.getMonth() + 1) + '-' + calDate.getFullYear()];
  for (var i = 0; notes && i < notes.length; i++) {
    updateNote(note[i]);
  }
}

function updateNote(note) {
  $('.td-day').each(function (i, dayNode) {
    if ($(dayNode).data('date') === $(note).data('date')) {
      $(dayNode).find('.note').remove();
      $(dayNode).append(note);
      return false;
    }
  });
}

function fillMonths($selMonth) {
  var months = calendar.getMonths();
  for (var i = 0; i < months.length; i++) {
    $selMonth.append('<option value="' + i + '">' + months[i] + '</option>');
  }
  $selMonth.val(calDate.getMonth());
}

function fillYears($selYear) {
  for (var year = calDate.getFullYear() - 5; year < calDate.getFullYear() + 5; year++) {
    $selYear.append('<option value="' + year + '">' + year + '</option>');
  }
  $selYear.val(calDate.getFullYear());
}

function showCurrentMonthCaption() {
  $('.current-month').html(calendar.currentMonthStr());
}

function saveNotes(dateStr, content) {
  localStorage['notes'][dateStr] = content;
  updateNote(content);
}

function scrollCalendar(scrollMonths) {
  var currentMonth = calDate.getMonth() + scrollMonths;
  calDate.setDate(1);
  if (currentMonth < 0) {
    currentMonth = 11;
    calDate.setFullYear(calDate.getFullYear() - 1);
  }
  else if (currentMonth > 11) {
    currentMonth = 0;
    calDate.setFullYear(calDate.getFullYear() + 1);
  }
  calDate.setMonth(currentMonth);
  console.log('##### calDate = ', calDate);
  var currentIdx = monthsContainer.indexOf($('.item.active').attr('id'));

  if (scrollMonths > 0) {
    var selectIdx = ++currentIdx >= monthsContainer.length ? 0 : currentIdx;
    var $nextMonth = $('#' + monthsContainer[selectIdx]);
    calendar = new Calendar($nextMonth, calDate, launchNotesModal, loadNotes);
    $('.calendar-carousel').carousel('next');
  }
  else {
    var selectIdx = --currentIdx < 0 ? monthsContainer.length - 1 : currentIdx;
    var $prevMonth = $('#' + monthsContainer[selectIdx]);
    calendar = new Calendar($prevMonth, calDate, launchNotesModal, loadNotes);
    $('.calendar-carousel').carousel('prev');
  }
  showCurrentMonthCaption();
}