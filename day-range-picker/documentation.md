# HTML
write the required markup to build your date range picker.

## Basic Structure
This is the basic HTML structure that DateRange picker requires:

```html
<div>
    <input
        type="text"
        name="check-in"
        id="datepicker-check-in" />
    <input
        type="text"
        name="check-in"
        id="datepicker-check-out"/>    
</div>

```


## Show date on label HTML
You may need to show dates into lable instead of input box:

```html
<div>
    <input
        type="text"
        name="check-in"
        id="datepicker-check-in"/>
    <label
        for="datepicker-check-in"
        id="datepicker-check-in-label">
        18 <small>Feb</small>
    </label>

    <input
        type="text"
        name="check-in"
        id="datepicker-check-out"
        value=""/>
    <label
        class="datepicker text-center"
        id="datepicker-check-out-label">
        19 <small>Feb</small>
    </label>
</div>
```

# Applying DateRange Picker

## Using Import

```js
<script src="./day-range-picker/day-range-picker.js"></script>
```

## Creating Component

```js
    // Parameter List
    const checkIn = document.getElementById("datepicker-check-in");
    const checkOut = document.getElementById("datepicker-check-out");
    const showPrice = true ;
    const format = "DD/MM/YYYY";

    var picker = new DayRangePicker({
        checkIn, checkOut,
        showPrice,format});
```

## Include Input Label
```js
    // Parameter List
    const checkIn = document.getElementById("datepicker-check-in");
    const checkOut = document.getElementById("datepicker-check-out");
    const checkInLabel = document.getElementById("datepicker-check-in-label");
    const checkOutLabel = document.getElementById("datepicker-check-out-label");
    const showPrice = true ;
    const format = "DD/MM/YYYY";

    var picker = new DayRangePicker({
        checkIn, checkOut,
        checkInLabel, checkOutLabel
        showPrice,format});
```

## Parameter List

| Parameter | Required | Types of Ele. | Description | 
| ------ | ------ | ----- | ----- |
| checkIn | True | HTML Element | HTML *Input* box
| checkOut | True | HTML Element | HTML *Input* box
| showPrice | False | Boolean | Default = *false*
| format | False | String | Default = *YYYY-MM-DD*
| checkInLabel | False | HTML Element | HTML *label*
| checkOutLabel | False | HTML Element | HTML *label*
| startDate | False | JS Date | *null*
| endDate | False | JS Date | *null*
| priceList | False | JS Object Array | *null* dependen on *showPrice* i.e. [{ date: '2022-03-19T14:48:00.000Z', price: 121}]
| position | false | enum | position of the datepicker, relative to the field (default to bottom & left), ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
| numberOfMonths | False | Number | Number of month to show, Default = *2*
| minDate | False | Date | The minimum/earliest date that can be selected
| maxDate | False | Date | The maximum/latest date that can be selected

## **API**

### **.goToNextMonth()**
Change **Calendar** view to next month. 
```js
// @parms: null
// @return: null
picker.goToNextMonth();
```


### **.goToPrevMonth()**
Change **Calendar** view to previous month. 
```js
// @parms: null
// @return: null
picker.goToPrevMonth();
```

### **.selectStartDate(date)**
Select start date for calendar
```js
// @parms: date => java script date
// @return: null
let date = new Date();
picker.selectStartDate(date);
```

### **.selectEndDate(date)**
Select end date for calendar
```js
// @parms: date => java script date
// @return: null
let date = new Date();
picker.selectEndDate(date);
```

### **.getCurrentStartDate()**
Return current start/checkIn date
```js
// @parms: null
// @return: current calendar selected start/checkIn date
picker.getCurrentStartDate();
```

### **.getCurrentEndDate()**
Return current end/CheckOut date
```js
// @parms: null
// @return: current calendar selected end/checkOut date
picker.getCurrentEndDate();
```
setDateRange
### **.setDateRange(start, end)**
Set current start/CheckIn and end/CheckOut date
```js
// @parms: start => Javascript date
// @parms: end => Javascript date
// @return: null
picker.setDateRange(start, end);
```

### **.getCurrentDateRange()**
Return current start/CheckIn and end/CheckOut date
```js
// @parms: null
// @return: current start/CheckIn and end/CheckOut date
picker.getCurrentDateRange();
```

### **.setPriceList(prices)**
Set price list for calendar
```js
/*  
    const prices = [
        {
          date: '2022-03-05T14:48:00.000Z',
          price: 110
        }, {
          date: '2022-03-06T14:48:00.000Z',
          price: 112
        }
    ];
    date is a ISO Date
*/
// @parms: price list in array of object
// @return: null
picker.setPriceList(prices);
```
