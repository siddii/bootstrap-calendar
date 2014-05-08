!function($) {
	'use strict';

	var dataNS = 'bs.calendar';

	var renderMonthEvent = 'render.month.' + dataNS, renderYearEvent = 'render.year.'
			+ dataNS;

	var monthTemplate = '<div class="month-caption-row text-center"><span class="pull-left"><span data-scroll="prev" class="glyphicon glyphicon-chevron-left"></span></span><span data-scroll="next" class="next-month pull-right"><span class="glyphicon glyphicon-chevron-right"></span></span><h3 class="month-caption"></h3></div><div class="carousel slide calendar-carousel" data-ride="carousel" data-interval="false"><div class="carousel-inner"><div class="item month"></div><div class="item active month"></div><div class="item month"></div></div></div>';

	var yearTemplate = '<div class="year-caption-row text-center"><span class="pull-left"><span data-scroll="prev" class="glyphicon glyphicon-chevron-left"></span></span><span data-scroll="next" class="next-year pull-right"><span class="glyphicon glyphicon-chevron-right"></span></span><h3 class="year-caption"></h3></div><div class="carousel slide calendar-carousel" data-ride="carousel" data-interval="false"><div class="carousel-inner"><div class="item year"></div><div class="item active year"></div><div class="item year"></div></div></div>';

	var weekdays = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
			'Friday', 'Saturday' ];
	var months = [ 'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December' ];
	var daysInMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

	var Calendar = function(element, options) {

		console.log('##### options = ', options);

		var instance = this;
		this.$element = $(element);
		this.options = options;
		this.calendarDate = null;
		this.mode = !options.mode ? 'month' : options.mode;

		if (!this.$element.html() && this.mode === 'month') {
			this.$element.append(monthTemplate);
		} else if (!this.$element.html() && this.mode === 'year') {
			this.$element.append(yearTemplate);
		}
		
		$('[data-scroll="prev"]', this.$element).click(function (){
			return instance.mode === 'month' ? instance.scrollMonth(-1) : instance.scrollYear(-1);  
		});

		$('[data-scroll="next"]', this.$element).click(function() {
			return instance.mode === 'month' ? instance.scrollMonth(1) : instance.scrollYear(1);
		});			

		this.$carousel = this.$element.find('.calendar-carousel');

		this.$active = function() {
			if (this.mode === 'month') {
				var activeElement = instance.$element.find('.month.active');
				return activeElement.length != 0 ? activeElement
						: instance.$element.find('.month').first();
			} else if (this.mode === 'year') {
				var activeElement = instance.$element.find('.year.active');
				return activeElement.length != 0 ? activeElement
						: instance.$element.find('.year').first();
			}
		};

		this.$months = this.$element.find('.month');
		this.$years = this.$element.find('.year');
		
		console.log('##### this.$years = ', this.$years);

		this.options.date = this.options.date || new Date();
		this.today = this.options.today || new Date();

		if (this.options.year && this.options.month) {
			this.setCalendarDate(new Date(this.options.month + '-01-'
					+ this.options.year));
		} else {
			this.setCalendarDate(this.options.date);
		}
		return this;
	};

	Calendar.prototype.scrollMonth = function(month) {
		var currentMonth = this.calendarDate.getMonth() + month;
		this.calendarDate.setDate(1);
		if (currentMonth < 0) {
			currentMonth = 11;
			this.calendarDate.setFullYear(this.calendarDate.getFullYear() - 1);
		} else if (currentMonth > 11) {
			currentMonth = 0;
			this.calendarDate.setFullYear(this.calendarDate.getFullYear() + 1);
		}
		this.calendarDate.setMonth(currentMonth);
		if (month > 0) {
			var $nextMonth = this.$active().next('.item');
			this
					.render($nextMonth.length > 0 ? $nextMonth
							: $(this.$months[0]));
			this.$carousel.carousel('next');
		} else {
			var $prevMonth = this.$active().prev('.item');
			this.render($prevMonth.length > 0 ? $prevMonth
					: $(this.$months[this.$months.length - 1]));
			this.$carousel.carousel('prev');
		}
	};
	
	Calendar.prototype.scrollYear = function(year) {
		this.calendarDate.setFullYear(this.calendarDate.getFullYear() + year);
		this.calendarDate.setDate(1);
		if (year > 0) {
			console.log('###### $nextYear this.$active() = ', this.$active());
			var $nextYear = this.$active().next('.item');
			console.log('###### $nextYear= ', $nextYear);
			this
					.render($nextYear.length > 0 ? $nextYear
							: $(this.$years[0]));
			this.$carousel.carousel('next', function (nextElem) {
				console.log('##### nextElem = ', nextElem);	
			});
		} else {
			var $prevYear = this.$active().prev('.item');
			this.render($prevYear.length > 0 ? $prevYear
					: $(this.$years[this.$years.length - 1]));
			this.$carousel.carousel('prev');
		}
	};
	

	Calendar.prototype.setCalendarDate = function(calendarDate) {
		this.calendarDate = calendarDate;
		this.render();
		return this;
	};

	Calendar.prototype.getYear = function() {
		return this.calendarDate.getFullYear();
	};

	Calendar.prototype.getMonth = function() {
		return this.calendarDate.getMonth();
	};

	Calendar.prototype.getDay = function() {
		return this.calendarDate.getDate();
	};

	Calendar.prototype.getMonthString = function() {
		return months[this.calendarDate.getMonth()];
	};

	Calendar.prototype.getNumOfDays = function() {
		return (this.getMonth() == 1 && !(this.getYear() & 3) && (this
				.getYear() % 1e2 || !(this.getYear() % 4e2))) ? 29
				: daysInMonth[this.getMonth()];
	};

	Calendar.prototype.buildCalendar = function(calDate) {
		var firstOfMonth = calDate.getDay(), numDays = this.getNumOfDays();
		var calendar = buildNode('table', null, buildNode('thead', null,
				buildNode('tr', {
					className : 'weekdays'
				}, buildWeekdays())));
		$(calendar).addClass('table').addClass('table-bordered');
		this.calendarBody = buildNode('tbody');
		this.calendarBody.appendChild(buildDays(this, firstOfMonth, numDays));
		calendar.appendChild(this.calendarBody);
		return calendar;
	};

	Calendar.prototype.render = function($element) {

		var calInstance = this;

		$element = $element || this.$active();
		
		$element.html('');

		if (this.mode === 'month') {
			var calDate = new Date(this.getYear(), this
					.getMonth(), 1);
			$element.append(this.buildCalendar(calDate));
			this.showMonthCaption();
			this.$element.trigger(renderMonthEvent, [ $element, calDate]);
		} else {
			var html = '<div class="table-responsive"><table class="table">';
			var months = this.getMonths();
			var calDate = calInstance.calendarDate;
			months.forEach(function(month, idx) {
				html += ((idx % 3 === 0) ? '<tr>' : '');
				calDate.setMonth(idx);
				var cal = calInstance.buildCalendar(calDate);
				html += '<td><h5>' + month + '</h5><div>' + cal.outerHTML
						+ '</div></td>';
				html += ((idx + 1) % 3 === 0) ? '</tr>' : '';
			});
			html += '</table></div>';
			$element.append(html);
			this.showYearCaption();
			this.$element.trigger(renderYearEvent, [ $element, calDate]);
		}
	};

	Calendar.prototype.showMonthCaption = function() {
		this.$element.find('.month-caption').html(
				this.getMonthString() + ', ' + this.getYear());
	};

	Calendar.prototype.showYearCaption = function() {
		this.$element.find('.year-caption').html(this.getYear());
	};

	function buildNode(nodeName, attributes, content) {
		var element = document.createElement(nodeName);

		if (attributes != null) {
			for ( var attribute in attributes) {
				element[attribute] = attributes[attribute];
			}
		}

		if (content != null) {
			if (typeof (content) == 'object') {
				element.appendChild(content);
			} else {
				element.innerHTML = content;
			}
		}

		return element;
	}

	function buildWeekdays() {
		var weekdayHtml = document.createDocumentFragment();
		foreach(weekdays, function(weekday) {
			var th = buildNode('th', {}, weekday.substring(0, 3));
			$(th).addClass('text-center');
			weekdayHtml.appendChild(th);
		});
		return weekdayHtml;
	}

	function foreach(items, callback) {
		var i = 0, x = items.length;
		for (i; i < x; i++) {
			if (callback(items[i], i) === false) {
				break;
			}
		}
	}

	function buildDays(instance, firstOfMonth, numDays) {
		var calendarBody = document.createDocumentFragment(), row = buildNode('tr'), dayCount = 0, i;

		for (i = 1; i <= firstOfMonth; i++) {
			row.appendChild(buildNode('td', null, '&nbsp;'));
			dayCount++;
		}

		for (i = 1; i <= numDays; i++) {
			if (dayCount == 7) {
				calendarBody.appendChild(row);
				row = buildNode('tr');
				dayCount = 0;
			}

			var todayClassName = (instance.today.getDate() == i
					&& instance.getMonth() == instance.today.getMonth() && instance
					.getYear() == instance.today.getFullYear()) ? 'today' : '';

			var td = buildNode('td', '', buildNode('span', '', i));
			var $td = $(td);

			$td.addClass('text-center').addClass(todayClassName)
					.addClass('day').data('date', formatDate(instance, i));

			row.appendChild(td);
			dayCount++;
		}

		for (i = 1; i <= (7 - dayCount); i++) {
			row.appendChild(buildNode('td', null, '&nbsp;'));
		}

		calendarBody.appendChild(row);

		return calendarBody;
	}

	function formatDate(instance, dd) {
		dd = dd.toString();
		var yyyy = instance.calendarDate.getFullYear().toString();
		var mm = (instance.calendarDate.getMonth() + 1).toString();
		var ret = yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-'
				+ (dd[1] ? dd : "0" + dd[0]);
		return ret;
	}

	Calendar.prototype.getMonths = function() {
		return months;
	};

	// var old = $.fn.calendar;

	$.fn.calendar = function(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data(dataNS);
			var options = $.extend({}, Calendar.DEFAULTS, $this.data(),
					typeof option == 'object' && option);

			if (!data) {
				$this.data(dataNS, (data = new Calendar($this, options)));
			}
		});
	};

	// $.fn.calendar.Constructor = Calendar;

	// $.fn.calendar.noConflict = function() {
	// $.fn.calendar = old;
	// return this;
	// };

	// $(document).on('click.bs.carousel.data-api', '[data-slide],
	// [data-slide-to]', function (e) {
	// var $this = $(this), href
	// var $target = $($this.attr('data-target') || (href = $this.attr('href'))
	// && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
	// var options = $.extend({}, $target.data(), $this.data())
	// var slideIndex = $this.attr('data-slide-to')
	// if (slideIndex) options.interval = false
	//
	// $target.carousel(options)
	//
	// if (slideIndex = $this.attr('data-slide-to')) {
	// $target.data('bs.carousel').to(slideIndex)
	// }
	//
	// e.preventDefault()
	// })

	$(window).on('load', function() {
		$('[data-toggle="calendar"]').each(function() {
			var $calendar = $(this);
			// console.log('###### date = ', $calendar.data('date'));
			$calendar.calendar($calendar.data());
		});
	});
}(jQuery);
