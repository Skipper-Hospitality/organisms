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
  