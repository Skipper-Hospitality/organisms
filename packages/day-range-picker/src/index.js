"use strict";
import { extend, isDate, isHidden, inBetween, addEvent, removeEvent, addClass, removeClass, hasClass, getDaysInMonth, setToStartOfDay, compareDates } from './utility.js';


const sto = window.setTimeout;

const defaults = {
  // bind the picker to a form field
  checkIn: null,
  checkOut: null,
  checkInLabel: null,
  checkOutLabel: null,

  priceList: null,

  // automatically show/hide the picker on `field` focus (default `true` if `field` is set)
  bound: undefined,

  // position of the datepicker, relative to the field (default to bottom & left)
  // ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
  position: "bottom left",

  // automatically fit in the viewport even if it means repositioning from the position option
  reposition: true,

  showPrice: false,

  numberOfMonths: 2,

  startDate: null,
  
  endDate: null,

  // the default output format for `.toString()` and `field` value
  format: "YYYY-MM-DD",

  // the toString function which gets passed a current date object and format
  // and returns a string
  toString: null,

  // used to create date object from current input string
  parse: null,

  // the minimum/earliest date that can be selected
  minDate: null,
  // the maximum/latest date that can be selected
  maxDate: null,
  minYear: 0,
  maxYear: 9999,
  minMonth: undefined,
  maxMonth: undefined,

  dpickerConst: {
    previousMonth: "Previous Month",
    nextMonth: "Next Month",
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    monthsShort:[
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    weekdays: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    weekdaysShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  },

  // callback function
  onSelect: null,
  onOpen: null,
  onClose: null,
};

const fireEvent = function (el, eventName, data) {
  let ev;

  if (document.createEvent) {
    ev = document.createEvent("HTMLEvents");
    ev.initEvent(eventName, true, false);
    ev = extend(ev, data);
    el.dispatchEvent(ev);
  } else if (document.createEventObject) {
    ev = document.createEventObject();
    ev = extend(ev, data);
    el.fireEvent("on" + eventName, ev);
  }
};

const adjustCalendar = function (calendar) {
  if (calendar.month < 0) {
    calendar.year -= Math.ceil(Math.abs(calendar.month) / 12);
    calendar.month += 12;
  }
  if (calendar.month > 11) {
    calendar.year += Math.floor(Math.abs(calendar.month) / 12);
    calendar.month -= 12;
  }
  return calendar;
};

const renderDayName = function (opts, day, abbr) {
  while (day >= 7) {
    day -= 7;
  }
  return abbr
    ? opts.dpickerConst.weekdaysShort[day]
    : opts.dpickerConst.weekdays[day];
};

const renderInputLabel = function (opts, date){
  return date.getDate() + '<small>' + opts.dpickerConst.monthsShort[date.getMonth()] + '</small>';
}

const renderDay = function (opts) {
  let arr = [];
  let ariaSelected = "false";
  if (opts.isEmpty) {
    return '<td class="is-empty"></td>';
  }
  if (opts.isToday) {
    arr.push("is-today");
  }
  if (opts.isFirst || opts.isEnd) {
    arr.push("is-selected");
    ariaSelected = "true";
  }
  if(opts.isInBetween){
    arr.push("is-inBetween");
    ariaSelected = "true";
  }
  if (opts.isDisabled) {
    arr.push("is-disabled");
  }

  let innerEle = opts.showPrice
    ? `<div class="day-box"><div class="day-date">${opts.day}</div><div class="day-price">${opts.price ? '$' + opts.price : '--'}</div></div>`
    : `${opts.day}`;

  return (
    '<td data-day="' +
    opts.day +
    '" class="' +
    arr.join(" ") +
    '" aria-selected="' +
    ariaSelected +
    '">' +
    '<button class="daypicker-button daypicker-day" type="button" ' +
    'data-daypicker-year="' +
    opts.year +
    '" data-daypicker-month="' +
    opts.month +
    '" data-daypicker-day="' +
    opts.day +
    '">' +
    innerEle +
    "</button>" +
    "</td>"
  );
};

const renderRow = function (days) {
  return `<tr class="daypicker-row">${days.join("")}</tr>`;
};

const renderBody = function (rows) {
  return "<tbody>" + rows.join("") + "</tbody>";
};

const renderHead = function (opts) {
  let i,
    arr = [];
  if (opts.showWeekNumber) {
    arr.push("<th></th>");
  }
  for (i = 0; i < 7; i++) {
    arr.push(
      '<th scope="col"><span title="' +
        renderDayName(opts, i) +
        '">' +
        renderDayName(opts, i, true) +
        "</span></th>"
    );
  }
  return `<thead><tr class="days-name">${arr.join("")}</tr></thead>`;
};

const renderTitle = function (instance, c, year, month, randId) {
  let opts = instance._o;
  let prev = true, next = true;

  let html = `<div id="${randId}" class="daypicker-title" role="heading" aria-live="assertive">`;

  // Set month and year label, nav buttons
  html += `<div class="daypicker-label"> ${opts.dpickerConst.months[month]} ${year} </div>`;
  
  if(opts.minYear > year || opts.minMonth >= month) prev = false;
  if (c === 0 && prev) {
    html += `<button class="daypicker-prev" type="button">${opts.dpickerConst.previousMonth}</button>`;
  }

  if(opts.maxYear < year || opts.maxMonth <= month) next = false;
  if (c === (instance._o.numberOfMonths - 1) && next) {
    html += `<button class="daypicker-next" type="button">${opts.dpickerConst.nextMonth}</button>`;
  }

  return (html += "</div>");
};

const renderTable = function (opts, data, randId) {
  return (
    '<table cellpadding="0" cellspacing="0" class="daypicker-table" role="grid" aria-labelledby="' +
    randId +
    '">' +
    renderHead(opts) +
    renderBody(data) +
    "</table>"
  );
};

export let DayRangePicker = function (options) {
  let self = this;
  let opts = self.config(options);
  
  this.goToNextMonth = function () {
    self.nextMonth();
  }
  this.goToPrevMonth = function () {
    self.prevMonth();
  }
  this.selectStartDate = (date) => {
    self.setStartDate(date)
  }
  this.selectEndDate = (date) => {
    self.setEndDate(date)
  }
  this.getCurrentStartDate = () => {
    if(this._d.start && isDate(this._d.start)){
      return this.format(opts.format, 'start');
    }
    return '';
  }
  this.getCurrentEndDate = () => {
    if(this._d.end && isDate(this._d.end)){
      return this.format(opts.format, 'end');
    }
    return '';
  }
  this.getCurrentDateRange = () => {
    return  this._o.checkIn.value + ' - ' + this._o.checkOut.value;
  }
  this.setDateRange = (start, end) => {
    self.setStartDate(start);
    self.setEndDate(end);
    return;
  }
  this.setPriceList = (prices) => {
    opts.priceList = {};
    if (prices.length > 0) {
        prices.forEach(price => {
          let date = new Date(price.date);
          let dd = date.getFullYear() + '_' + date.getMonth() + '_' + date.getDate();
          opts.priceList[dd] = price.price;
        });
    }
  }

  function setDateAndClose(target) {
    self.setDate(
      new Date(
        target.getAttribute("data-daypicker-year"),
        target.getAttribute("data-daypicker-month"),
        target.getAttribute("data-daypicker-day")
      )
    );
    if (!!opts.bound && !!self._d && !!self._d.start && !!self._d.end) {
      sto(function () {
        self.hide();
      }, 500);
    }
  }

  self._onMouseDown = function (e) {
    if (!self._view) {
      return;
    }
    e = e || window.event;
    let target = e.target || e.srcElement;
    if (!target) {
      return;
    }

    if (hasClass(target, "daypicker-button") && !hasClass(target, "is-empty")) {
      setDateAndClose(target);
    } else if (hasClass(target, "day-box")) {
      const el = target.parentNode;
      setDateAndClose(el);
    } else if (hasClass(target, "day-date") || hasClass(target, "day-price")) {
      const el = target.parentNode.parentNode;
      setDateAndClose(el);
    } else if (hasClass(target, "daypicker-prev")) {
      self.prevMonth();
    } else if (hasClass(target, "daypicker-next")) {
      self.nextMonth();
    }

    // if this is touch event prevent mouse events emulation
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
      return false;
    }
  };

  self._parseFieldValue = function () {
    if (opts.parse) {
      return opts.parse(opts.checkIn.value, opts.format);
    } else {
      return new Date(Date.parse(opts.checkIn.value));
    }
  };

  self._onInputClick = function () {
    self.show();
  };

  self._onClick = function (e) {
    e = e || window.event;
    let target = e.target || e.srcElement,
      pEl = target;

    if (!target) {
      return;
    }

    do {
      if (hasClass(pEl, "daypicker-range") || pEl === opts.trigger) {
        return;
      }
    } while ((pEl = pEl.parentNode));

    if (self._view && target !== opts.checkIn && target !== opts.checkOut) {
      self.hide();
    }
  };

  self.el = document.createElement("div");
  self.el.className = "daypicker-range";

  addEvent(self.el, "mousedown", self._onMouseDown, true);
  addEvent(self.el, "touchend", self._onMouseDown, true);

  if (opts.checkIn) {
    if (opts.bound) {
      document.body.appendChild(self.el);
    } else {
      opts.checkIn.parentNode.insertBefore(self.el, opts.checkIn.nextSibling);
    }
  }
  let currDate = new Date();
  if (isDate(opts.minDate) && opts.minDate.getTime() > currDate.getTime()) {
    currDate = opts.minDate;
  } else if (
    isDate(opts.maxDate) &&
    opts.maxDate.getTime() < currDate.getTime()
  ) {
    currDate = opts.maxDate;
  }
  self.gotoDate(currDate);
  if (opts.bound) {
    this.hide();
    self.el.className += " is-bound";
    addEvent(opts.checkIn, "click", self._onInputClick);
    addEvent(opts.checkOut, "click", self._onInputClick);
  }
};

DayRangePicker.prototype = {
  config: function (options) {
    if (!this._o) {
      this._o = extend({}, defaults, true);
    }
    let opts = extend(this._o, options, true);
    opts.checkIn = opts.checkIn && opts.checkIn.nodeName ? opts.checkIn : null;
    opts.bound = !!(opts.bound !== undefined
      ? opts.checkIn && opts.bound
      : opts.checkIn);
    opts.trigger =
      opts.trigger && opts.trigger.nodeName ? opts.trigger : opts.checkIn;

    if (!isDate(opts.minDate)) {
      opts.minDate = false;
    }
    if (!isDate(opts.maxDate)) {
      opts.maxDate = false;
    }
    if (opts.minDate && opts.maxDate && opts.maxDate < opts.minDate) {
      opts.maxDate = opts.minDate = false;
    }
    if (opts.minDate) {
      this.setMinDate(opts.minDate);
    }
    if (opts.maxDate) {
      this.setMaxDate(opts.maxDate);
    }

    //Set initial values
    if(isDate(this._o.startDate)){
      this.setStartDate(this._o.startDate);
    }
    if(isDate(this._o.endDate)){
      this.setEndDate(this._o.endDate);
    }

    return opts;
  },
  toString: function (format) {
    format = format || this._o.format;
    if (!isDate(this._d.start)) {
      return "";
    }    
    if (this._o.toString) {
      return this._o.toString(this._d.start, format);
    }
    if(this._d && this._d.start && this._d.end)
      return this.format(format, 'start') + ' - ' + this.format(format, 'end');
    else if(this._d && this._d.start )
      return this.format(format, 'start');
    else 
      return '';
    },
  getStartDate: function (format) {
    format = format || this._o.format;
    if (!isDate(this._d.start)) {
      return "";
    }

    if(this._d && this._d.start ){
      return this.format(format, 'start');
    } else {
      return '';
    }
  },
  getStartDateLabel: function () {
    if(this._d && this._d.start ){
      return renderInputLabel(this._o, this._d.start);
    } 
    return '';
  },
  getEndDate: function (format) {
    format = format || this._o.format;
    if (!isDate(this._d.end)) {
      return "";
    }

    if(this._d && this._d.end ){
      return this.format(format, 'end');
    } else {
      return '';
    }
  },
  getEndDateLabel: function () {
    if(this._d && this._d.end ){
      return renderInputLabel(this._o, this._d.end);
    } 
    return '';
  },
  format: function (format, pos) {
    let o = {
      "M+": this._d[pos].getMonth() + 1, //month
      "d+": this._d[pos].getDate(), //day
      "D+": this._d[pos].getDate(), //day
      "h+": this._d[pos].getHours(), //hour
      "m+": this._d[pos].getMinutes(), //minute
      "s+": this._d[pos].getSeconds(), //second
      "q+": Math.floor((this._d.start.getMonth() + 3) / 3), //quarter
      S: this._d.start.getMilliseconds(), //millisecond
    };

    if (/((Y+)|(y+))/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (this._d[pos].getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }

    // if(/(y+)/.test(format)) {format=format.replace(RegExp.$1,
    //         (this._d.getFullYear()+"").substr(4 - RegExp.$1.length));}

    for (let k in o)
      if (new RegExp("(" + k + ")").test(format))
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return format;
  },
  getDate: function () {
    return isDate(this._d) ? new Date(this._d.getTime()) : null;
  },
  setDate: function (date, preventOnSelect) {
    if (!date) {
      this._d = null;

      if (this._o.checkIn) {
        this._o.checkIn.value = "";
        fireEvent(this._o.checkIn, "change", { firedBy: this });
      }

      return this.draw();
    }
    if (typeof date === "string") {
      date = new Date(Date.parse(date));
    }
    if (!isDate(date)) {
      return;
    }
    
    let min = this._o.minDate,
    max = this._o.maxDate;
    
    if (isDate(min) && date < min) {
      date = min;
    } else if (isDate(max) && date > max) {
      date = max;
    }

    // in 3rd click clear previous values
    if(this._d && this._d.start && this._d.end) this._d = null;
    
    let pos = (!this._d || !this._d.start) ? 'start': 'end';
    if(pos === 'start')
    this._d = {};
    
    this._d[pos] = new Date(date.getTime());
    setToStartOfDay(this._d[pos]);
    this.gotoDate(this._d[[pos]]);
    
    // Swap position if 2nd date is smaller than the 1st date
    if(pos == 'end' && this._d['start'].getTime() > this._d['end'].getTime()){
      let temp = this._d['start'];
      this._d['start'] = this._d['end'];
      this._d['end'] = temp;
    }
    if (this._o.checkIn) {
      // this._o.checkIn.value = this.toString();
      this._o.checkIn.value = this.getStartDate();
      if(this._o.checkInLabel)
        this._o.checkInLabel.innerHTML = this.getStartDateLabel();
      fireEvent(this._o.checkIn, "change", { firedBy: this });
    }
    if (this._o.checkOut) {
      // this._o.checkIn.value = this.toString();
      this._o.checkOut.value = this.getEndDate();
      if(this._o.checkOutLabel)
        this._o.checkOutLabel.innerHTML = this.getEndDateLabel();      
      fireEvent(this._o.checkOut, "change", { firedBy: this });
    }
    if (!preventOnSelect && typeof this._o.onSelect === "function") {
      this._o.onSelect.call(this, this.getDate());
    }
  },
  setStartDate: function (date) {
    if (!date) return;
    if (typeof date === "string") {
      date = new Date(Date.parse(date));
    }
    if (!isDate(date)) {
      return;
    }
    let min = this._o.minDate;
    if (isDate(min) && date < min) {
      date = min;
    }
    let pos = 'start';
    if(!this._d) this._d = {};
    this._d[pos] = new Date(date.getTime());

    setToStartOfDay(this._d[pos]);
    this.gotoDate(this._d[[pos]]);
    
    if (this._o.checkIn) {
      this._o.checkIn.value = this.getStartDate();
      if(this._o.checkInLabel)
        this._o.checkInLabel.innerHTML = this.getStartDateLabel();
      fireEvent(this._o.checkIn, "change", { firedBy: this });
    }
  },
  setEndDate: function (date) {
    if (!date) return;
    if (typeof date === "string") {
      date = new Date(Date.parse(date));
    }
    if (!isDate(date)) {
      return;
    }
    
    let max = this._o.maxDate;
    if (isDate(max) && date > max) {
      date = max;
    }

    let pos = 'end';
    if(!this._d) this._d = {};
    this._d[pos] = new Date(date.getTime());

    setToStartOfDay(this._d[pos]);
    this.gotoDate(this._d[[pos]]);
    
    if (this._o.checkOut) {
      this._o.checkOut.value = this.getEndDate();
      if(this._o.checkOutLabel)
        this._o.checkOutLabel.innerHTML = this.getEndDateLabel();      
      fireEvent(this._o.checkOut, "change", { firedBy: this });
    }
  },
  gotoDate: function (date) {
    let newCalendar = true;

    if (!isDate(date)) {
      return;
    }

    if (this.calendars) {
      let firstVisibleDate = new Date(
        this.calendars[0].year,
        this.calendars[0].month,
        1
      );
      let lastVisibleDate = new Date(
        this.calendars[this.calendars.length - 1].year,
        this.calendars[this.calendars.length - 1].month,
        1
      );
      let visibleDate = date.getTime();
      // get the end of the month
      lastVisibleDate.setMonth(lastVisibleDate.getMonth() + 1);
      lastVisibleDate.setDate(lastVisibleDate.getDate() - 1);
      newCalendar =
        visibleDate < firstVisibleDate.getTime() ||
        lastVisibleDate.getTime() < visibleDate;
    }
    if (newCalendar) {
      this.calendars = [
        {
          month: date.getMonth(),
          year: date.getFullYear(),
        },
      ];
    }
    this.adjustCalendars();
  },
  adjustCalendars: function () {
    this.calendars[0] = adjustCalendar(this.calendars[0]);
      for (let c = 1; c < this._o.numberOfMonths; c++) {
        this.calendars[c] = adjustCalendar({
          month: this.calendars[0].month + c,
          year: this.calendars[0].year,
        });
      }
    this.draw();
  },
  nextMonth: function () {
    this.calendars[0].month++;
    this.adjustCalendars();
  },
  prevMonth: function () {
    this.calendars[0].month--;
    this.adjustCalendars();
  },
  setMinDate: function (value) {
    if (value instanceof Date) {
      setToStartOfDay(value);
      this._o.minDate = value;
      this._o.minYear = value.getFullYear();
      this._o.minMonth = value.getMonth();
    } else {
      this._o.minDate = defaults.minDate;
      this._o.minYear = defaults.minYear;
      this._o.minMonth = defaults.minMonth;
      this._o.startRange = defaults.startRange;
    }

    this.draw();
  },
  setMaxDate: function (value) {
    if (value instanceof Date) {
      setToStartOfDay(value);
      this._o.maxDate = value;
      this._o.maxYear = value.getFullYear();
      this._o.maxMonth = value.getMonth();
    } else {
      this._o.maxDate = defaults.maxDate;
      this._o.maxYear = defaults.maxYear;
      this._o.maxMonth = defaults.maxMonth;
      this._o.endRange = defaults.endRange;
    }

    this.draw();
  },
  draw: function (force) {
    if (!this._view && !force) {
      return;
    }
    let opts = this._o,
      html = "",
      randId;
    for (let c = 0; c < opts.numberOfMonths; c++) {
      randId = "daypicker-title-" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 2);
      html += '<div class="daypicker-lendar">' + 
        renderTitle( this, c, this.calendars[c].year, this.calendars[c].month, randId ) +
        this.render(this.calendars[c].year, this.calendars[c].month, randId) +
        "</div>";
    }
    this.el.innerHTML = html;

    if (opts.bound) {
      if (opts.checkIn.type !== "hidden") {
        sto(function () {
          opts.trigger.focus();
        }, 200);
      }
    }
  },
  adjustPosition: function () {
    let checkIn,
      pEl,
      width,
      height,
      viewportWidth,
      viewportHeight,
      scrollTop,
      left,
      top,
      clientRect,
      leftAligned,
      bottomAligned;

    this.el.style.position = "absolute";
    checkIn = this._o.trigger;
    pEl = checkIn;
    width = this.el.offsetWidth;
    height = this.el.offsetHeight;
    viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    scrollTop =
      window.pageYOffset ||
      document.body.scrollTop ||
      document.documentElement.scrollTop;
    leftAligned = true;
    bottomAligned = true;
    if (!isHidden(this._o.checkIn) && typeof this._o.checkIn.getBoundingClientRect === "function") {
      clientRect = this._o.checkIn.getBoundingClientRect();
      left = clientRect.left + window.pageXOffset;
      top = clientRect.bottom + window.pageYOffset;
    } else if (!isHidden(this._o.checkInLabel) && typeof this._o.checkInLabel.getBoundingClientRect === "function") {
      clientRect = this._o.checkInLabel.getBoundingClientRect();
      left = clientRect.left + window.pageXOffset;
      top = clientRect.bottom + window.pageYOffset;
    } else {
      left = pEl.offsetLeft;
      top = pEl.offsetTop + pEl.offsetHeight;
      while ((pEl = pEl.offsetParent)) {
        left += pEl.offsetLeft;
        top += pEl.offsetTop;
      }
    }

    // default position is bottom & left
    if (
      (this._o.reposition && left + width > viewportWidth) ||
      (this._o.position.indexOf("right") > -1 &&
        left - width + checkIn.offsetWidth > 0)
    ) {
      left = left - width + checkIn.offsetWidth;
      leftAligned = false;
    }
    if (
      (this._o.reposition && top + height > viewportHeight + scrollTop) ||
      (this._o.position.indexOf("top") > -1 &&
        top - height - checkIn.offsetHeight > 0)
    ) {
      top = top - height - checkIn.offsetHeight;
      bottomAligned = false;
    }

    if (left < 0) {
      left = 0;
    }

    if (top < 0) {
      top = 0;
    }

    this.el.style.left = left + "px";
    this.el.style.top = top + "px";

    addClass(this.el, leftAligned ? "left-aligned" : "right-aligned");
    addClass(this.el, bottomAligned ? "bottom-aligned" : "top-aligned");
    removeClass(this.el, !leftAligned ? "left-aligned" : "right-aligned");
    removeClass(this.el, !bottomAligned ? "bottom-aligned" : "top-aligned");
  },
  render: function (year, month, randId) {
    let opts = this._o,
      now = new Date(),
      days = getDaysInMonth(year, month),
      before = new Date(year, month, 1).getDay(),
      data = [],
      row = [];
    setToStartOfDay(now);

    let previousMonth = month === 0 ? 11 : month - 1,
      nextMonth = month === 11 ? 0 : month + 1,
      yearOfPreviousMonth = month === 0 ? year - 1 : year,
      yearOfNextMonth = month === 11 ? year + 1 : year,
      daysInPreviousMonth = getDaysInMonth(yearOfPreviousMonth, previousMonth);
    let cells = days + before,
      after = cells % 7;

    cells += 7 - after;

    for (let i = 0, r = 0; i < cells; i++) {
      let day = new Date(year, month, 1 + (i - before)),
        isFirst = !!this._d && !!this._d.start && isDate(this._d.start) ? compareDates(day, this._d.start) : false,
        isEnd = !!this._d && !!this._d.end && isDate(this._d.end) ? compareDates(day, this._d.end) : false,
        isInBetween = !!this._d && !!this._d.start && !!this._d.end ? inBetween(this._d.start, this._d.end, day) : false,
        isToday = compareDates(day, now),
        isEmpty = i < before || i >= days + before,
        dayNumber = 1 + (i - before),
        monthNumber = month,
        yearNumber = year,
        isDisabled =
          (opts.minDate && day < opts.minDate) ||
          (opts.maxDate && day > opts.maxDate);      
      if (isEmpty) {
        if (i < before) {
          dayNumber = daysInPreviousMonth + dayNumber;
          monthNumber = previousMonth;
          yearNumber = yearOfPreviousMonth;
        } else {
          dayNumber = dayNumber - days;
          monthNumber = nextMonth;
          yearNumber = yearOfNextMonth;
        }
      }
      let dateString = yearNumber + '_' + monthNumber + '_' + dayNumber
      let price = opts.priceList[dateString] ? opts.priceList[dateString] : null;

      let dayConfig = {
        day: dayNumber,
        month: monthNumber,
        year: yearNumber,
        isFirst,
        isEnd,
        isInBetween,
        isToday,
        isEmpty,
        isDisabled,
        showPrice: opts.showPrice,
        price,
        showDaysInNextAndPreviousMonths: opts.showDaysInNextAndPreviousMonths,
      };

      row.push(renderDay(dayConfig));

      if (++r === 7) {
        data.push(renderRow(row));
        row = [];
        r = 0;
      }
    }
    return renderTable(opts, data, randId);
  },
  isVisible: function () {
    return this._view;
  },
  show: function () {
    if (!this.isVisible()) {
      this._view = true;
      this.draw();
      removeClass(this.el, "is-hidden");
      if (this._o.bound) {
        addEvent(document, "click", this._onClick);
        this.adjustPosition();
      }
      if (typeof this._o.onOpen === "function") {
        this._o.onOpen.call(this);
      }
    }
  },
  hide: function () {
    let v = this._view;
    if (v !== false) {
      if (this._o.bound) {
        removeEvent(document, "click", this._onClick);
      }

      this.el.style.position = "static"; // reset
      this.el.style.left = "auto";
      this.el.style.top = "auto";

      addClass(this.el, "is-hidden");
      this._view = false;
      if (v !== undefined && typeof this._o.onClose === "function") {
        this._o.onClose.call(this);
      }
    }
  },
};
