

var Calendar = function ($container, calDate, dayClickHandler, postRenderCallback) {

 
  var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var currentDate = calDate || new Date();



  function buildCalendar($container) {
    $container.find('.calendar').remove();
    var self = this;
    this.date = {
      current: {
        year: function () {
          return currentDate.getFullYear();
        },
        month: {
          integer: function () {
            return currentDate.getMonth();
          },
          string: function () {
            var date = currentDate.getMonth();
            return months[date].length > 3 ? months[date].substring(0, 3) : months[date];
          }
        },
        day: function () {
          return currentDate.getDate();
        }
      },
      month: {
        string: function () {
          return months[self.currentMonthView].length > 3 ? months[self.currentMonthView].substring(0, 3) : months[self.currentMonthView];
        },
        numDays: function (currentMonthView, currentYearView) {
          return (currentMonthView == 1 && !(currentYearView & 3) && (currentYearView % 1e2 || !(currentYearView % 4e2))) ? 29 : daysInMonth[currentMonthView];
        }
      }
    };

    this.element = $container[0];
    this.currentYearView = this.date.current.year();
    this.currentMonthView = this.date.current.month.integer();

    this.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var firstOfMonth = new Date(this.currentYearView, this.currentMonthView, 1).getDay(),
      numDays = this.date.month.numDays(this.currentMonthView, this.currentYearView);

    var calendarContainer = $('<div class="calendar"/>');

    var calendar = buildNode('table', null, buildNode('thead', null, buildNode('tr', { className: 'weekdays' }, buildWeekdays())));
    $(calendar).addClass('table').addClass('table-bordered');
    this.calendarBody = buildNode('tbody');
    this.calendarBody.appendChild(buildDays(firstOfMonth, numDays, this.currentMonthView, this.currentYearView));
    calendar.appendChild(this.calendarBody);

    calendarContainer.append(calendar);

    $container.append(calendarContainer);

    postRenderCallback();

    return this;
  }

  function buildNode(nodeName, attributes, content) {
    var element = document.createElement(nodeName);

    if (attributes != null) {
      for (var attribute in attributes) {
        element[attribute] = attributes[attribute];
      }
    }

    if (content != null) {
      if (typeof(content) == 'object') {
        element.appendChild(content);
      } else {
        element.innerHTML = content;
      }
    }

    return element;
  }

  
  function buildWeekdays() {
    var weekdayHtml = document.createDocumentFragment();
    foreach(weekdays, function (weekday) {
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

  function buildDays(firstOfMonth, numDays, currentMonthView, currentYearView) {
    var calendarBody = document.createDocumentFragment(),
      row = buildNode('tr'),
      dayCount = 0, i;

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

      var todayClassName = isToday(i, currentMonthView, currentYearView) ? { className: 'today active' } : null;
      var td = buildNode('td', todayClassName, buildNode('span', { className: 'day' }, i));
      var $td = $(td);
      $td.addClass('text-center').addClass('td-day').data('date', formatDate(i));

      if (dayClickHandler) {
        $td.click(dayClickHandler)
      }
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
    var yyyy = currentDate.getFullYear().toString();
    var mm = (currentDate.getMonth() + 1).toString();
    return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);
  }

  this.currentMonthStr = function () {
    return date.month.string(currentMonthView) + ' ' + currentYearView;
  };

  this.getMonths = function () {
    return months;
  };

  function isToday(day, currentMonthView, currentYearView) {
    var today = new Date();
    return day == today.getDate() && currentMonthView == today.getMonth() && currentYearView == today.getFullYear();
  }

  buildCalendar($container);
  return this;
};
