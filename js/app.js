$(function() {
	
	var storage = new Storage();

	var calDate = storage.has('date') ? new Date(parseInt(localStorage['date'], 10)) : new Date();
	var calendar = null;

	var $selMonth = $('#selMonth'), $selYear = $('#selYear');

	var $notesCalendar = $('#notes-calendar');

	var $selectCalendarModal = $('#selectCalendarModal');
	var $editNotesModal = $('#editNotesModal');
	
	function Storage() {		
		var dataStore = window.localStorge || {};		
		this.get = function (key) {
			return dataStore[key] || {};
		};		
		this.set = function (key, value) {
			dataStore[key] = value;
		};
		this.has = function (key) {
			return dataStore[key] !== undefined;
		};
	}
	
	
	$notesCalendar.on('click', '.month-caption', function() {
		fillMonths();
		fillYears();
		$selectCalendarModal.modal();
	});

	$notesCalendar
			.on(
					'click',
					'td.day',
					function() {
						var clickedCell = $(this);
						console.log('####### clickedCell = ', clickedCell);
						$editNotesModal.data('clicked-cell', clickedCell);
						var day = clickedCell.find('span').html();
						var title = 'Notes for ' + calendar.getMonthString()
								+ ' ' + day + ', ' + calendar.getYear();
						var note = clickedCell.find('.note');
						$editNotesModal
								.find('textarea#notes')
								.val(
										note.length > 0
												&& note.html().length > 0 ? replaceHTMLEntities(note
												.html())
												: "");
						$editNotesModal.find('.modal-title').html(title);
						$editNotesModal.modal();
					});

	$notesCalendar.on('render.bs.calendar', function(event, monthContainer,
			calendarInstance) {
		calendar = calendar || calendarInstance;
		console.log('Calendar rendered', monthContainer);
		loadNotes(monthContainer);
	});

	$('#changeCalendar').click(function() {
		calendar.setCalendarDate(new Date($selMonth.val() + '-01-' + $selYear.val()));
		$selectCalendarModal.modal('hide');
	});

	$('#saveNotes').click(function() {
		var clickedCell = $editNotesModal.data('clicked-cell');
		var noteContent = $editNotesModal.find('textarea#notes').val().trim();
		saveNotes(clickedCell.data('date'), noteContent);
		updateNotes(clickedCell, noteContent);
		$editNotesModal.modal('hide');
	});

	$('.clear-notes').click(function() {
		$editNotesModal.find('textarea#notes').val('');
	});

	function updateNotes(clickedCell, noteContent) {
		clickedCell.find('div.note-wrapper').remove();
		clickedCell
				.append('<div class="note-wrapper"><textarea class="note form-control">'
						+ noteContent + "</textarea></div>");
	}

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

	function formatDate() {
		var dd = calDate.getDate().toString();
		var yyyy = calDate.getFullYear().toString();
		var mm = (calDate.getMonth() + 1).toString();
		var ret = yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-'
				+ (dd[1] ? dd : "0" + dd[0]);
		return ret;
	}
	
	function getNotes() {
		return storage.get('notes');
	}
	
	function setNotes(date, content) {
		console.log('#### content = ', content, date);
		var notes = getNotes();
		notes.push({date: date, content: content});
	}
	

	function loadNotes(monthContainer) {
		console.log('Date = ', formatDate());
		var notes = getNotes();
		if ($.isEmptyObject(notes)) {
			return;
		}
		monthContainer.find('td.day').each(function(i, dayNode) {
			var date = $(dayNode).data('date');
			if (date && notes[date]) {
				updateNotes($(dayNode), notes[date]);
			}
		});			
	}

	function saveNotes(dateStr, content) {
		setNotes(dateStr, content);
	}
});
	
