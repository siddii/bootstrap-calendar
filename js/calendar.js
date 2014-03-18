!function($) {

	'use strict';

	var dataNS = 'bs.calendar';
	
	var template = '<div class="month-caption-row text-center"><span class="pull-left"><span data-scroll="prev" class="glyphicon glyphicon-chevron-left"></span></span><span data-scroll="next" class="next-month pull-right"><span class="glyphicon glyphicon-chevron-right"></span></span><h3 class="month-caption"></h3></div><div class="carousel slide calendar-carousel" data-ride="carousel" data-interval="false"><div class="carousel-inner"><div class="item"></div><div class="item active"></div><div class="item"></div></div></div>';

	var Calendar = function(element, options) {
		var self = this;
		this.$element = $(element);
		this.options = options;

		var weekdays = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday',
				'Thursday', 'Friday', 'Saturday' ];
		var months = [ 'January', 'February', 'March', 'April', 'May', 'June',
				'July', 'August', 'September', 'October', 'November',
				'December' ];
		var daysInMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
		var monthsContainer = {};

		this.$element.append(template);
		
		$('[data-scroll="prev"]', this.$element).click(function () {
			self.scrollMonth(-1);
		});
		
		$('[data-scroll="next"]', this.$element).click(function () {
			self.scrollMonth(1);
		});
		
		this.$carousel = this.$element.find('.calendar-carousel'); 
		
		this.$active = this.$element.find('.item.active'); 

		this.calendarDate = this.options.date || new Date();
		
		this.today = new Date();

		Calendar.prototype.scrollMonth = function(scrollMonths) {
			var currentMonth = this.calendarDate.getMonth() + scrollMonths;
			this.calendarDate.setDate(1);
			if (currentMonth < 0) {
				currentMonth = 11;
				this.calendarDate.setFullYear(this.calendarDate.getFullYear() - 1);
			} else if (currentMonth > 11) {
				currentMonth = 0;
				this.calendarDate.setFullYear(this.calendarDate.getFullYear() + 1);
			}
			this.calendarDate.setMonth(currentMonth);
			console.log('##### calDate = ', this.calendarDate);

			if (scrollMonths > 0) {				
				var $nextMonth = this.$active.next('.item');
				this.render($nextMonth);			
				this.$carousel.carousel('next');
			} else {
				var $prevMonth = this.$active.prev('.item');
				this.render($prevMonth);			
				this.$carousel.carousel('prev');
			}
		};
				
		Calendar.prototype.getYear = function() {
			return this.calendarDate.getFullYear();
		};
		
		Calendar.prototype.getMonth = function () {
			return this.calendarDate.getMonth();		
		};

		Calendar.prototype.getDay = function () {
			return this.calendarDate.getDate();		
		};
		
		Calendar.prototype.getMonthString = function () {
			return months[this.calendarDate.getMonth()];
		};
		
		Calendar.prototype.getNumOfDays = function (){
			return (this.getMonth() == 1 && !(this.getYear() & 3) && (this.getYear() % 1e2 || !(this.getYear() % 4e2))) ? 29
					: daysInMonth[this.getMonth()];			
		};

		Calendar.prototype.render = function($element) {
			
			var firstOfMonth = new Date(this.getYear(),
					this.getMonth(), 1).getDay(), numDays = this.getNumOfDays();

			var calendarContainer = $element.html('');

			var calendar = buildNode('table', null, buildNode('thead', null,
					buildNode('tr', {
						className : 'weekdays'
					}, buildWeekdays())));
			$(calendar).addClass('table').addClass('table-bordered');
			this.calendarBody = buildNode('tbody');
			this.calendarBody.appendChild(buildDays(firstOfMonth, numDays));
			calendar.appendChild(this.calendarBody);

			calendarContainer.append(calendar);

			$element.append(calendarContainer);

			this.showMonthCaption();
		};

		Calendar.prototype.showMonthCaption = function() {
			this.$element.find('.month-caption').html(
					this.getMonthString() + ', ' + this.getYear());
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

		function buildDays(firstOfMonth, numDays) {
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

				var todayClassName = (self.getDay() == i && self.getMonth() == self.today.getMonth() && self.getYear() == self.today.getFullYear()) ? 'today active' : '';
				
				
				var td = buildNode('td', '', buildNode('span', {
					className : 'day'
				}, i));
				var $td = $(td);
				

				$td.addClass('text-center').addClass(todayClassName).addClass('td-day').data('date',
						formatDate(i));

				row.appendChild(td);
				dayCount++;
			}

			for (i = 1; i <= (7 - dayCount); i++) {
				row.appendChild(buildNode('td', null, '&nbsp;'));
			}

			calendarBody.appendChild(row);

			return calendarBody;
		}

		function formatDate(dd) {
			dd = dd.toString();
			var yyyy = self.calendarDate.getFullYear().toString();
			var mm = (self.calendarDate.getMonth() + 1).toString();
			return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-'
					+ (dd[1] ? dd : "0" + dd[0]);
		}

		Calendar.prototype.getMonths = function() {
			return months;
		};

		this.render(this.$active);
		return this;
	};

	var old = $.fn.calendar;

	$.fn.calendar = function(option) {
		return this
				.each(function() {
					var $this = $(this);
					var data = $this.data(dataNS);
					console.log('##### data = ', data);
					var options = $.extend({}, Calendar.DEFAULTS, $this.data(),
							typeof option == 'object' && option);

					if (!data) {
						$this.data(dataNS, (data = new Calendar($this,
								options)));						
					}
				});
	};

	$.fn.calendar.Constructor = Calendar;

	$.fn.calendar.noConflict = function() {
		$.fn.calendar = old;
		return this;
	};

	//		$(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
	//		    var $this = $(this), href
	//		    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
	//		    var options = $.extend({}, $target.data(), $this.data())
	//		    var slideIndex = $this.attr('data-slide-to')
	//		    if (slideIndex) options.interval = false
	//
	//		    $target.carousel(options)
	//
	//		    if (slideIndex = $this.attr('data-slide-to')) {
	//		      $target.data('bs.carousel').to(slideIndex)
	//		    }
	//
	//		    e.preventDefault()
	//		  })

	$(window).on('load', function() {
		$('[data-toggle="calendar"]').each(function() {
			var $calendar = $(this);
			$calendar.calendar($calendar.data());
		});
	});
}(jQuery);
