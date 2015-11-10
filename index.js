(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(['moment', 'jquery'], function(moment, $) {
      return (root.Calendar = factory(moment, $));
    });
  } else if (typeof module === "object" && module.exports) {
    module.exports = (root.Calendar = factory(require('moment'), require('jquery')));
  } else {
    root.Calendar = factory(root.moment, root.$);
  }
}(this, function(moment, $) {
  return function() {
    //private variable
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    var options = {};
    var shownFirstMonthDate = "";
    var container;
    var isClick = false;
    var noop = function() {};
    var callback;
    var elem;
    var elemId;
    var monthSelect;
    var yearSelect;


    var internalCallback = function(date) {
      setDate(date);
      hide();
      callback(date);
    };

    var isHeightAvailable = function() {
      var win = $(window);
      var viewport = {
        top: win.scrollTop(),
        left: win.scrollLeft()
      };
      viewport.right = viewport.left + win.width();
      viewport.bottom = viewport.top + win.height();
      var bounds = $(elem).offset();
      bounds.right = bounds.left + $(elem).outerWidth();
      bounds.bottom = bounds.top + $(elem).outerHeight();
      var avaiableHeight = viewport.bottom - bounds.bottom;
      if (avaiableHeight < $(container).outerHeight(true)) {
        return false;
      }
      return true;
    };

    var addEvent = function(obj, type, fn, useCapture) {
      if (obj.attachEvent) {
        obj['e' + type + fn] = fn;
        obj[type + fn] = function() {
          obj['e' + type + fn](window.event);
        }
        obj.attachEvent('on' + type, obj[type + fn]);
      } else
        obj.addEventListener(type, fn, useCapture);
    };

    var removeEvent = function(obj, type, fn, useCapture) {
      if (obj.detachEvent) {
        obj.detachEvent('on' + type, obj[type + fn]);
        obj[type + fn] = null;
      } else
        obj.removeEventListener(type, fn, useCapture);
    };

    var removeClass = function(element, classToRemove) {
      var currentClassValue = element.className;

      if (currentClassValue == classToRemove) {
        element.className = "";
        return;
      }

      var classValues = currentClassValue.split(" ");
      var filteredList = [];

      for (var i = 0; i < classValues.length; i++) {
        if (classToRemove != classValues[i]) {
          filteredList.push(classValues[i]);
        }
      }

      element.className = filteredList.join(" ");
    };

    var addClass = function(element, classToAdd) {
      var currentClassValue = element.className;

      if (currentClassValue.indexOf(classToAdd) == -1) {
        if ((currentClassValue == null) || (currentClassValue === "")) {
          element.className = classToAdd;
        } else {
          element.className += " " + classToAdd;
        }
      }
    };

    var getElementOffset = function(element) {
      var rect = element.getBoundingClientRect();
      var body = document.body;
      var documentElem = document.documentElement;
      var oWidth = element.offsetWidth;
      var oHeight = element.offsetHeight;
      var scrollTop = window.pageYOffset || documentElem.scrollTop || body.scrollTop;
      var scrollLeft = window.pageXOffset || documentElem.scrollLeft || body.scrollLeft;
      var clientTop = documentElem.clientTop || body.clientTop || 0 ;
      var clientLeft = documentElem.clientLeft || body.clientLeft || 0
      var top = rect.top + scrollTop - clientTop;
      var left = rect.left + scrollLeft - clientLeft;
      var bottom = top + oHeight;
      var right = left + oWidth;
      return {
        top: Math.round(top),
        left: Math.round(left),
        bottom: Math.round(bottom),
        right: Math.round(right)
      };
    };

    var removeEvents = function(elem) {
      var old_element = elem;
      var new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);
      return new_element;
    };

    var normalizeEvent = function(e) {
      e = e || window.event;
      if (!e.target) {
        e.target = e.srcElement;
      }
      return e;
    };

    var stopBubbling = function(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
    };

    var getButton = function(e) {
      e = e || window.event;
      var button = (typeof e.which != "undefined") ? e.which : e.button;
      return button;
    };


    var canGoPrev = function() {
      return ((moment(shownFirstMonthDate).startOf('day').isAfter(options.startDate)));
    };

    var setDate = function(value, isDate) {
      if (isDate) {
        options.selectedDate = value;
      } else {
        options.selectedDate = moment(value);
      }
      if (elem.tagName && elem.tagName.toLowerCase() == "input" && elem.type.toLowerCase() == "text") {
        elem.value = options.selectedDate.format("ddd, DD MMM , YYYY");
      }
    };

    var bindEvents = function() {
      isClick = false;
      //elem = removeEvents(elem);
      $(elem).unbind('click');
      $(elem).unbind('focus');
      $(elem).unbind('blur');
      // if (elem.tagName && elem.tagName.toLowerCase() == "input" && elem.type.toLowerCase() == "text") {

      //   addEvent(elem, 'focus', function(e) {
      //     e = normalizeEvent(e);

      //     if (container.className.indexOf('hide')) {
      //       stopBubbling(e);
      //       show();
      //     }


      //   }, false);

      //   addEvent(elem, 'blur', function(e) {
      //     e = normalizeEvent(e);
      //     if (!isClick) {

      //       hide();

      //     }


      //   }, false);

      // } else {

      //   addEvent(elem, 'click', function(e) {
      //     e = normalizeEvent(e);
      //     if (getButton(e) != 3) {
      //       show();
      //     }

      //     stopBubbling(e);
      //   }, false);
      // }

      // addEvent(container, 'mousedown', function(e) {
      //   isClick = true;
      // }, false);

      // addEvent(container, 'mouseup', function(e) {
      //   isClick = false;
      // }, false);

      // addEvent(container, 'click', function(e) {
      //   e = normalizeEvent(e);

      //   stopBubbling(e);
      // }, false);
      // 
      if ($(elem).is('input[type=text]')) {
        $(elem).focus(function(e) {
          if ($(container).is(':hidden')) {
            show();
          }
          e.stopPropagation();
        });

        $(elem).blur(function(e) {
          if (!isClick)
            hide();
        });
      } else {
        $(elem).click(function(e) {
          $(".Calendar").hide();
          show();
          e.stopPropagation();
        });
      }

      $(container).mousedown(function() {
        isClick = true;
      });
      $(container).mouseup(function() {
        isClick = false;
      });

      $(container).click(function(e) {
        e.stopPropagation();
      });

      if (options.showYearAndMonthMenu) {
        $(monthSelect).unbind('change');
        $(yearSelect).unbind('change');

        $(monthSelect).change(function(e) {
          var index = months.indexOf(e.target.value);
          var date = moment(shownFirstMonthDate).set('month', index);
          shownFirstMonthDate = date;
          renderWithMenus();
        });
        $(yearSelect).change(function(e) {
          var year = e.target.value;
          var date = moment(shownFirstMonthDate).set('year', Number(year));
          shownFirstMonthDate = date;
          renderWithMenus();
        });
      }



    };

    var docEventHandler = function(e) {
      e = normalizeEvent(e);
      if (e.target.id !== elemId) {
        addClass(container, 'hide');

      }

    };

    var setStartDate = function(value, isDate) {
      if (isDate) {
        options.startDate = value;
      } else {
        options.startDate = moment(value);
      }
      if (moment(options.selectedDate).isBefore(moment(options.startDate))) {
        options.selectedDate = options.startDate;
      }
    };

    var show = function() {
      shownFirstMonthDate = moment(options.selectedDate).startOf('day');
      if (options.showYearAndMonthMenu) {
        renderWithMenus();
      } else {
        render();
      }
      if (isHeightAvailable) {
        $(container).css({
          'top': $(elem).offset().top - $(container).outerHeight(true) - $(elem).outerHeight(true)
        });
      }
      removeClass(container, 'hide');

      addEvent(document, 'click', docEventHandler, false);
    };

    var hide = function() {
      addClass(container, 'hide');

      removeEvent(document, 'click', docEventHandler, false);
    };

    var goPrevious = function() {
      if ((moment(shownFirstMonthDate).startOf('day')).isAfter(moment(options.startDate).startOf('day'))) {
        shownFirstMonthDate = moment(shownFirstMonthDate).subtract(1, 'months');
        if (options.showYearAndMonthMenu) {
          renderWithMenus();
        } else {
          render();
        }
      }
    };

    var goNext = function() {
      if ((moment(shownFirstMonthDate).startOf('day')).isBefore(moment(options.endDate).startOf('day'))) {
        shownFirstMonthDate = moment(shownFirstMonthDate).add(1, 'months');
        if (options.showYearAndMonthMenu) {
          renderWithMenus();
        } else {
          render();
        }
      }
    };

    var renderWithMenus = function() {
      render(true);
    };

    var render = function(isMenus) {
      var i;
      var prevContainer;
      var width = 0;
      if (container) {
        prevContainer = container;
      }
      container = document.createElement('div');
      container.className = 'Calendar';
      container.id = 'calendar_' + elem.id;

      var elemRect = getElementOffset(elem);

      container.style.position = 'absolute';
      container.style.top = elemRect.bottom + 2 + 'px';
      //container.style.left = elemRect.left + 'px';

      for (i = 0; i < options.months; i++) {
        var monthDate = moment(shownFirstMonthDate).startOf('month');
        monthDate = monthDate.add(i, 'months');
        var monthTable = renderMonth(monthDate, isMenus);

        if (i === 0) {
          monthTable.className += ' first';
        }
        if (i == options.months - 1) {
          monthTable.className += ' last';
        }
        if (i !== 0 && i != options.months - 1) {
          monthTable.className += ' mid';
        }
        container.appendChild(monthTable);
      }
      if (prevContainer) {
        removeClass(container, 'hide');
        prevContainer.parentNode.removeChild(prevContainer);
      } else {
        addClass(container, 'hide');
      }


      document.getElementsByTagName('body')[0].appendChild(container);
      for (i = 0; i < container.children.length; i++) {
        width = width + $(container.children[i]).outerWidth(true);
      }
      container.style.width = width + 2 + 'px';
      if (($(window).width() - $(elem).offset().left) < parseInt(width, 10)) {
        container.style.right = $(window).width() - $(elem).offset().left - elem.offsetWidth + 'px';
      } else {
        container.style.left = elemRect.left + 'px';
      }
      bindEvents();


    };

    var renderMonth = function(date, isMenus) {
      var i, text;
      var monthText = months[date.get('month')];
      var yearText = date.get('year');

      var monthTable = document.createElement('table');
      monthTable.className = 'monthTable';

      var monthTableBody = document.createElement('tbody');

      var monthTableHeader = document.createElement('tr');
      monthTableHeader.className = 'monthHeader';

      var prevButton = document.createElement('button');
      text = document.createTextNode('<');
      prevButton.appendChild(text);

      var prev = document.createElement('td');
      prev.className = 'prev';
      prev.appendChild(prevButton);

      addEvent(prevButton, 'click', function() {
        goPrevious();
      }, false);

      if (!canGoPrev()) {
        addClass(prevButton, 'hide');
      }

      var nextButton = document.createElement('button');
      text = document.createTextNode('>');
      nextButton.appendChild(text);

      var next = document.createElement('td');
      next.className = 'next';
      next.appendChild(nextButton);

      addEvent(nextButton, 'click', function() {
        goNext();
      }, false);

      var monthTitle = document.createElement('td');
      monthTitle.className = 'monthTitle';
      monthTitle.colSpan = 5;
      if (isMenus) {
        monthSelect = document.createElement('select');
        for (i = 0; i < months.length; i++) {
          var opt = document.createElement('option');
          opt.value = months[i];
          opt.innerHTML = months[i];
          if (months[i] === monthText) {
            opt.selected = true;
            monthSelect.appendChild(opt);
          //break;
          }
          monthSelect.appendChild(opt);
        }
        yearSelect = document.createElement('select');
        currentYear = moment(options.now).get('year');

        for (i = Number(currentYear); i >= Number(currentYear) - 100; i--) {
          var opt = document.createElement('option');
          opt.value = i;
          opt.innerHTML = i;
          if (i === Number(yearText)) {
            opt.selected = true;
          }
          yearSelect.appendChild(opt);
          monthTitle.appendChild(monthSelect);
          monthTitle.appendChild(yearSelect);
        }
      } else {
        text = monthText + ' ' + yearText;
        var monthTitleText = document.createTextNode(text);
        monthTitle.appendChild(monthTitleText);
      }

      var dayHeader = document.createElement('tr');
      var tableHeader;
      for (i = 0; i < 7; i++) {
        tableHeader = document.createElement('th');
        text = document.createTextNode(weekdays[i]);
        tableHeader.appendChild(text);
        dayHeader.appendChild(tableHeader);
      }

      monthTableHeader.appendChild(prev);
      monthTableHeader.appendChild(monthTitle);
      monthTableHeader.appendChild(next);

      var monthContent = getMonthContent(date);
      monthTableBody.appendChild(monthTableHeader);
      monthTableBody.appendChild(dayHeader);
      monthTableBody.appendChild(monthContent);

      monthTable.appendChild(monthTableBody);
      return monthTable;
    };

    var getMonthContent = function(date) {
      var monthContent = document.createDocumentFragment();


      var start = moment(date).startOf('month');
      var end = moment(start).add(1, 'months');

      var loopDate = moment(start).startOf('day');



      var startBoxIndex = start.get('day') - 1;
      if (startBoxIndex < 0)
        startBoxIndex += 7;
      var endBoxIndex = startBoxIndex + ((end.diff(start)) / (1000 * 60 * 60 * 24)) - 1;

      var tempdate;

      var startDate = moment(options.startDate).startOf('day');
      var endDate = moment(options.endDate).startOf('day');

      var selectedDate = moment(options.selectedDate).startOf('day');
      var today = moment(options.now).startOf('day');
      var text, div;


      var clickDayHandlerDelegate = function(d) {
        return function() {
          clickDayHandler(d);
        };
      }
      var clickDayHandler = function(d) {

        internalCallback(d);

      };

      var boxIndex = 0;

      for (var i = 0; i < 6; i++) {
        var week = document.createElement('tr');
        for (var j = 0; j < 7; j++) {

          day = document.createElement('td');

          var day_class = 'wd';
          if (boxIndex >= startBoxIndex && boxIndex <= endBoxIndex) {
            if (loopDate.get('day') === 6 || loopDate.get('day') === 0)
              day_class = 'we';
            else
              day_class = 'wd';

            if ((loopDate.diff(today, 'days')) === 0)
              day_class = 'tdy';
            if (loopDate.isBefore(startDate) || loopDate.isAfter(endDate))
              day_class = 'past';
            if (loopDate.diff(selectedDate, 'days') === 0)
              day_class = 'current';
            day_content = loopDate.get('date');
          } else {
            day_class = 'empty';
            day_content = ' ';
          }
          day.className = day_class + ' day';
          text = document.createTextNode(day_content);

          day.appendChild(text);


          if (day_class != 'past' && day_class != 'empty') {
            (function(loop) {
              addEvent(day, 'click', clickDayHandlerDelegate(loop), false);
            })(moment(loopDate));
          }

          if (day_class != 'empty')
            loopDate.add(1, 'days');

          week.appendChild(day);

          boxIndex++;
        }
        monthContent.appendChild(week);

      }
      return monthContent;
    }


    var initialize = function(eId, opts, cb) {
      callback = cb || noop;

      elem = document.getElementById(eId);
      elemId = eId;
      opts = opts || {};
      options = opts || {};
      options.months = opts.months || 1;
      options.now = opts.now || moment();
      options.startDate = opts.startDate || options.now;
      options.selectedDate = opts.selectedDate || options.startDate;
      options.endDate = opts.endDate || moment(options.startDate).add(100, 'years');
      options.showYearAndMonthMenu = opts.showYearAndMonthMenu || false;

      shownFirstMonthDate = moment(options.selectedDate).startOf('month');
      if (options.showYearAndMonthMenu) {
        options.endsLess = options.endsLessThanNow || 0;
        options.startDate = moment(options.now).subtract(100, 'years').startOf('month');
        options.endDate = moment(options.now).subtract(options.endsLess, 'years');
        options.selectedDate = options.endDate;
        shownFirstMonthDate = moment(options.selectedDate).startOf('month');
        renderWithMenus();
      } else {
        render();
      }
    };

    return {
      init: initialize,
      show: show,
      hide: hide,
      setStartDate: setStartDate,
      setDate: setDate
    };

  };
}));