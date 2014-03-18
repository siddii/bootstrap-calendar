var calDate = new Date();
var calendar = null;

$(function () {
	
	/*
	
  calendar = new Calendar($('#current-month'), calDate, launchNotesModal, loadNotes);
  showCurrentMonthCaption();

  $('.prev-month').click(function () {
    calendar.scrollMonth(-1);
  });

  $('.next-month').click(function () {
    calendar.scrollMonth(1);
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

    var noteContent = $editNotesModal.find('textarea#notes').val().trim();
    saveNotes(clickedCell.data('date'), noteContent);
    $editNotesModal.modal('hide');
  });

  $('.clear-notes').click(function () {
    $('#editNotesModal').find('textarea#notes').val('');
  });
  */
});

function launchNotesModal() {
  var clickedCell = $(this);
  var $editNotesModal = $('#editNotesModal');
  $editNotesModal.data('clicked-cell', clickedCell);
  var day = clickedCell.find('span.day').html();
  var title = 'Notes for ' + calendar.currentMonthStr().replace(' ', ' ' + day + ', ');
  var note = clickedCell.find('.note');
  $editNotesModal.find('textarea#notes').val(note.length > 0 && note.html().length > 0 ? replaceHTMLEntities(note.html()) : "");
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


function saveNotes(dateStr, content) {
  var notesObj = localStorage['notes'] || {};	
  notesObj[dateStr] = content;
  updateNote(content);
  localStorage['notes'] = notesObj;
}
	
