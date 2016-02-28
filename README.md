#redBus calendar

This library is to be used for creating calendar widgets. This has a dependency on momentjs and jquery.
The dependency on jquery will be removed in sometime. This calendar module is currently being used in [redbus](http://www.redbus.in)

##Download

`npm install rb-calendar`


##Example

```javascript
var Calendar = require('rb-calendar');

var domCalendar = Calendar();
//this is generate a calendar from todays date and show 2 months at a time
domCalendar.init(id_of_dom_elem_bound_to_calendar,{
	months : 2//specifies no of months
},function(date){//callback
	//do something with selected date
});

//this will generate a datepicker for date of birth selection 
//and calendar's end date will be today's date
domCalendar.init(id_of_dom_elem_bound_to_calendar,{
	showYearAndMonthMenu : true//specifies if month and year selection is to be enabled
	endsLessThanNow : 2 //specifies number of years to remove from endDate from today's date default 0
	//today's date 9th November.2015 , then endDate will be 9th November , 2013
},function(date){//callback
	//do something with selected date
});
```
