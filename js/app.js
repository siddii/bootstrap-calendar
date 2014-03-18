$(function() {

	var calDate = new Date();
	var calendar = null;

	var $selMonth = $('#selMonth'), $selYear = $('#selYear');

	var $notesCalendar = $('#notes-calendar');

	var $selectCalendarModal = $('#selectCalendarModal');
	var $editNotesModal = $('#editNotesModal');

	$notesCalendar.on('click', '.month-caption', function() {
		fillMonths();
		fillYears();
		$selectCalendarModal.modal();
	});
	
	$notesCalendar.on('click', 'td.day', function() {
		var clickedCell = $(this);
		console.log('####### clickedCell = ', clickedCell);
		$editNotesModal.data('clicked-cell', clickedCell);
		var day = clickedCell.find('span').html();
		var title = 'Notes for '
				+ calendar.getMonthString() + ' ' + day + ', ' + calendar.getYear();
		var note = clickedCell.find('.note');
		$editNotesModal
				.find('textarea#notes')
				.val(
						note.length > 0 && note.html().length > 0 ? replaceHTMLEntities(note
								.html())
								: "");
		$editNotesModal.find('.modal-title').html(title);
		$editNotesModal.modal();
	});	

	$notesCalendar.on('render.bs.calendar', function(event, monthContainer, calendarInstance) {
		
		calendar = calendar || calendarInstance;
		
		console.log('##### calendarInstance = ', calendarInstance);
		
		console.log('Calendar rendered', monthContainer);
	});

	$('#changeCalendar').click(function() {
		var dateStr = $selYear.val() + '-' + $selMonth.val();
		calendar.setCalendarDate(dateStr).render();
		$selectCalendarModal.modal('hide');
	});

	function fillMonths() {
		if (!$selMonth.html()) {
			var months = calendar.getMonths();
			for ( var i = 0; i < months.length; i++) {
				$selMonth.append('<option value="' + (i + 1) + '">' + months[i]
						+ '</option>');
			}
			$selMonth.val(calDate.getMonth() + 1);
		}
	}

	function fillYears() {
		if (!$selYear.html()) {
			for ( var year = calDate.getFullYear() - 5; year < calDate
					.getFullYear() + 5; year++) {
				$selYear.append('<option value="' + year + '">' + year
						+ '</option>');
			}
			$selYear.val(calDate.getFullYear());
		}
	}

	function notesModal() {
		var clickedCell = $(this);
	}

	var entityReplacementChars = {
		"nbsp" : " ",
		"amp" : "&",
		"quot" : "\"",
		"lt" : "<",
		"gt" : ">"
	};

	function replaceHTMLEntities(html) {
		return (html.replace(/&(nbsp|amp|quot|lt|gt);/g,
				function(match, entity) {
					return entityReplacementChars[entity];
				}));
	}

	function loadNotes() {
		var notes = localStorage
				&& localStorage['notes']
				&& localStorage['notes'][(calDate.getMonth() + 1) + '-'
						+ calDate.getFullYear()];
		for ( var i = 0; notes && i < notes.length; i++) {
			updateNote(note[i]);
		}
	}

	function updateNote(note) {
		$('.td-day').each(function(i, dayNode) {
			if ($(dayNode).data('date') === $(note).data('date')) {
				$(dayNode).find('.note').remove();
				$(dayNode).append(note);
				return false;
			}
		});
	}

	function saveNotes(dateStr, content) {
		var notesObj = localStorage['notes'] || {};
		notesObj[dateStr] = content;
		updateNote(content);
		localStorage['notes'] = notesObj;
	}

	/*
	 * 
	 * calendar = new Calendar($('#current-month'), calDate, launchNotesModal,
	 * loadNotes); showCurrentMonthCaption();
	 * 
	 * $('.prev-month').click(function () { calendar.scrollMonth(-1); });
	 * 
	 * $('.next-month').click(function () { calendar.scrollMonth(1); });
	 * 
	 * $('.current-month').click(function () { $('#selectDateModal').modal();
	 * });
	 * 
	 * $('#changeDate').click(function () { calDate = new Date($selYear.val(),
	 * $selMonth.val(), 1); $('#selectDateModal').modal('hide'); var
	 * $currentMonthContainer = $('#' + $('.item.active').attr('id')); calendar =
	 * new Calendar($currentMonthContainer, calDate, launchNotesModal,
	 * loadNotes); showCurrentMonthCaption(); });
	 * 
	 * $('#saveNotes').click(function () { var $editNotesModal =
	 * $('#editNotesModal'); var clickedCell =
	 * $editNotesModal.data('clicked-cell');
	 * 
	 * var noteContent = $editNotesModal.find('textarea#notes').val().trim();
	 * saveNotes(clickedCell.data('date'), noteContent);
	 * $editNotesModal.modal('hide'); });
	 * 
	 * $('.clear-notes').click(function () {
	 * $('#editNotesModal').find('textarea#notes').val(''); });
	 */
});
