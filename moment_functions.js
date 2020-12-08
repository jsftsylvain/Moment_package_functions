
// function that gets all the days in a month with the corresponding arguments passed in
// Year, Month arguments are specified by the user, pass in the year in the month to find out the total amout of days in that month.
getDaysArrayByMonth(year,month){
    // adding one to month because when you call moment.month() it returns 0-11 months instead of 1-12
    // create moment object with formatted string, then find the number of days
    var monthNum = month + 1
    const year_month_string = monthNum.toString()+"-"+year.toString();  
    const FirstDayofMonth = moment(year_month_string,"MM-YYYY");
    var daysInMonth = FirstDayofMonth.daysInMonth()
    
    
    // initialize variables and create string to initialize moment object including day
    var daysArr = [];
    var dayInt = 1;
    var curDayofMonthString = "0"+dayInt.toString()+"-"+monthNum.toString()+"-"+year.toString();
    var curDayofMonth = moment(curDayofMonthString,"DD-MM-YYYY");
    
    // loop for total number of days in that month
    // in loop append moment object to dayArr, dayArr will be an array of moment objects for every single day
    while(daysInMonth){
        
        daysArr.push(curDayofMonth);
        dayInt++;
        // if int is greater than 9 don't append 0 before
        if(dayInt > 9){
            curDayofMonthString = dayInt.toString()+"-"+monthNum.toString()+"-"+year.toString();
        }else{
            curDayofMonthString = "0"+dayInt.toString()+"-"+monthNum.toString()+"-"+year.toString();
        }
        curDayofMonth = moment(curDayofMonthString,"DD-MM-YYYY");
        daysInMonth--;
    }
    // return array with information on the month
    return daysArr;
}

    
    
    
    // function that gets the dates of the week in 1 list with 4 sublists for the 4 weeks.
    // Each value of the sublists is a day moment object .
get_weekly_dates(moment_obj){
    // call getDaysArrayByMonth function to get access to 3 lists of moment objects for the current, previous, and following month
    var curMoment = moment_obj;
    var daysInMonth = getDaysArrayByMonth(curMoment.year(), curMoment.month());
    curMoment = curMoment.subtract(1,"months");
    var daysInMonthPrevious = getDaysArrayByMonth(curMoment.year(), curMoment.month());
    curMoment = curMoment.add(2, "months");
    var daysInMonthAfter = getDaysArrayByMonth(curMoment.year(),curMoment.month());
    curMoment = curMoment.subtract(1,"months");
    
    // initialize constants && variables
    var days_of_week = [];
    var weekly_temp_list = {};

    // loop through moment objects list
    // append day to dictionary, if sunday is encountered, push list of moment objects to list and start appending to new empty dictionary
    var date = 1;
    daysInMonth.forEach(element => {
        var week_day = element.format('d')
        // append weekly dictonary once new week starts
        if(date !== 1 && week_day === "0"){
            days_of_week.push(weekly_temp_list);
            weekly_temp_list = {};
        }

        weekly_temp_list[week_day] = element;
        // if on last day push dictionary on to list
        if(date === daysInMonth.length){
            days_of_week.push(weekly_temp_list)
        }
        date++;
    })
    // loop through month with every week as a dictionary of moment objects
    for(var index in days_of_week){
        var curWeek = days_of_week[index];
        var curWeekLength = Object.keys(curWeek).length;
        // if week is not filled with 7 days, find the missing days and append them
        if(curWeekLength != 7){
            var indexCurWeek = 0;
            var newCurWeek = {};
            // loop through week
            for(var key in curWeek){
                // if start of week is missing days
                if(indexCurWeek === 0 && parseInt(key) !== 0){
                    var minusVal = 1;
                    var indexVal = key-1; // used as key for entry, go from 0 to key-1 to fill the dictionary at correct locations
                    for(var i = 0;i<key;i++){
                        var tempMoment = moment(curWeek[key]);
                        tempMoment = tempMoment.subtract(minusVal,"days");
                        newCurWeek[indexVal] = tempMoment;
                        indexVal--;
                        minusVal++;
                    }
                }
                // if end of week is missing days
                if(key != 6 && curWeekLength === indexCurWeek+1){
                    var addVal = 1;
                    for(var j = 0; j<7-parseInt(key)-1;j++){ // loop for the number of days missing
                        var tempMoment = moment(curWeek[key]);
                        tempMoment = tempMoment.add(addVal, "days");
                        newCurWeek[j+curWeekLength] = tempMoment; 
                        addVal++;
                    }
                }

                indexCurWeek++;
            }
            // append the dictionaries together and replace the unfinished week with the new complete dictionary week
            days_of_week[index] = Object.assign({},newCurWeek,curWeek);
        }
    }
    
    
    return days_of_week;
}


    // this function generates the associated html code for the events for the current schedule, argument = list of events
    // html generated is for the month view only
    generate_html_event_boxes(events){

        // created this function inside the function because it does not need to be called anywhere else
        // return_html = returns html code for one event occurence
        // arguments:
        // start -> moment js object for the start of the event occurence
        // end -> moment js object for the end of the event occurence
        // loop_int -> integer that corresponds to the total amount of days that the event spans for. (ex 30/11/20 - 5/12/20 would be 6 days)
        // combine_events -> boolean value which indicates if the next event occurence starts when the current occurence ends. if so combine the html code and display "all day"
        // prev_day_exists -> boolean value which indicates if the current occurence starts immediately after the previous occurence ends. If so return no html code.
        function return_html(start, end, loop_int, combine_events, prev_day_exists){

            let boxes = [];
            
            // loop and return html code for each day
            for(var i = 0;i<loop_int;i++){
                // create moment js object for current day
                var temp_moment = moment(moment(start).add(i,"d"));
        
                // go to next iteration if cur occurence starts immediately after previous occurence ends
                if( i == 0 && prev_day_exists){
                    continue;
                }

                // if event starts and ends on same day
                if(i ==0 && i == loop_int-1 && start.format("DD") == end.format("DD")){
                    // push html code to boxes
                    boxes.push({
                        [temp_moment]:
                        <div className={`event-${event.event_name}-${start.format("D")}`} key={`event-${event.event_name}-${start.format("D")}`}>
                            {`${start.format("HH:mm")} - ${end.format("HH:mm")}`}
                        </div>
                    })
                }

                // first day of event
                else if(i == 0 && i != loop_int-1){

                    // push
                    boxes.push({
                        [temp_moment]: 
                        <div className={`event-${event.event_name}-${start.format("D")}`} key={`event-${event.event_name}-${start.format("D")}`}>
                            <p>{`${start.format("HH:mm")} - ${end.format("Do MMM")}`}</p>
                            <img className="event_span_arrow" src={event_span_arrow}></img>
                        </div>
                    })
                }

                // last day of event
                else if(i== loop_int-1 && i != 0 ){
                    
                    // default html if on last day
                    let myObj = 
                    {[temp_moment]:
                        <div className={`event-${event.event_name}-${end.format("D")}`} key={`event-${event.event_name}-${end.format("D")}`}>
                            {`${start.format("Do MMM")} - ${end.format("HH:mm")}`}
                        </div>
                    }

                    // if next occurence starts immediately after current occurence ends
                    if(combine_events){
                        myObj = {[temp_moment]:
                            <div className={`event-${event.event_name}-${end.format("D")}`} key={`event-${event.event_name}-${end.format("D")}`}>
                                <p>{`all day`}</p>
                            <img className="event_span_arrow" src={event_span_arrow}></img>
                            </div>}
                        
                    }
                    boxes.push(myObj);
                }

                // days between first and last day
                else if(i > 0 && i < loop_int-1){
                    boxes.push({
                        [temp_moment]: 
                        <div className={`event-${event.event_name}-${start.format("D")}`} key={`event-${event.event_name}-${start.format("D")}`}>
                            <p>{`all day`}</p>
                            <img className="event_span_arrow" src={event_span_arrow}></img>
                        </div>
                    })
                }
            }

            // return html for event occurence
            return boxes;
        }

        

        // object that stores html code for all events
        var object = {event_boxes: []}

        // loop through all events
        for(var index in events){
            // store html code for cur event in boxes
            var boxes = [];

            // if 


            var event = events[index]; // current event
            var start = event.start;                    // moment js object for start of event
            var end = event.end;                        // moment js object for end of event
            var loop_int = 1;  // amount of days that an event occurence spans for



            var get_days_moment = moment(start);
            while(get_days_moment.format("DD") != end.format("DD")){
                loop_int++;
                get_days_moment = moment(moment(get_days_moment).add(1,"days"));
            }
            
            
            // event duration
            var duration = moment.duration( moment(end.format("DD/MM/YY HH:mm:ss"),"DD/MM/YY HH:mm:ss").diff( moment(start.format("DD/MM/YY HH:mm:ss"),"DD/MM/YY HH:mm:ss")) )

            // when event doesn't repeat
            if(event.repeat_type == "Does not repeat"){
                // if event lasts longer than 1 day
                if(loop_int >= 1){
                    
                    // get html code, don't pass in last 2 arguments. they will default to undefined and evaluate to false (what we want) in the conditional checks
                    let result = return_html(start,end, loop_int);
                    // append results to boxes
                    for(var index in result){
                        boxes.push(result[index])
                    }
                }
                // event is shorter than 24 hours
                else{
                    // get current day
                    var temp_moment = moment(start);

                    // push html code to boxes
                    boxes.push({
                        [temp_moment]:
                        <div className={`event-${event.event_name}-${temp_moment.format("D")}`} key={`event-${event.event_name}-${temp_moment.format("D")}`}>
                            {`${start.format("HH:mm")} - ${end.format("HH:mm")}`}
                        </div>
                    })
                }
                
            }
            
            // event falls in this section if it has an end date set by the user.
            // if event has no end give it an end date 2 years later
            else if("UNTIL" in event.rrule || ["Every day", "Every week"].includes(event.repeat_type) || (!("UNTIL" in event.rrule) && !("COUNT" in event.rrule)) ){
                
                // get end date of occurences for event
                var until_moment;
                if("UNTIL" in event.rrule){
                    until_moment = event.rrule.UNTIL;
                }else{
                    until_moment = moment(`${start.format("hh:mm:ss DD/MM/")}${moment(moment(start).add(2,"years")).format("YYYY")}`,"hh:mm:ss DD/MM/YYYY");
                }

                // create new moment js objects for looping
                var loop_start = moment(start);
                var loop_end = moment(end);
                
                // freq type determines recursion type
                switch(event.rrule.FREQ){
                    // event repeats weekly
                    case "WEEKLY":
                        // string used for incrementing weekly
                        var frequency_str = "w";

                        // lists used for finding indexes of all occurences in a week
                        var days_of_week = ["Su","Mo","Tu","We","Th","Fr","Sa"];
    

                        // loop from start date until end of recursion, incrementation of start date found at end of loop
                        while(loop_start.isSameOrBefore(until_moment,"day")){

                            // if BYDAY not in rrule then the event has a single occurence for that week
                            // you can access what day of the week from the start and end moment objects, no need for looping through all days selected
                            if(!("BYDAY" in event.rrule)){

                                // get html code, append it to boxes (list which stores all html code for the event)
                                let result = return_html(loop_start, loop_end, loop_int, false);
                                for(var index in result){
                                    boxes.push(result[index]);
                                }
                                // increment loop_end when event only occurs once a week
                                // if event occurs more than once a week "BYDAY" will be inside event.rrule and only loop_Start needs to be incremented
                                loop_end = moment(moment(loop_end).add(parseInt(event.rrule.interval),frequency_str));
                            }
                            
                            // if event occurs multiple times per week
                            else{


                                var week_days_occurs_order = [];                    // list used to store the days of the week when the event occurs

                                // loop through days selected, append to week_days_occurs_order
                                for(var index in event.rrule.BYDAY){
                                    let day_index = days_of_week.indexOf(event.rrule.BYDAY[index]);
                                    week_days_occurs_order.push(day_index);
                                }
                                week_days_occurs_order = week_days_occurs_order.sort((a, b) => a - b);  // sort list low to high


                                // loop through days of week selected by user
                                for(var index in week_days_occurs_order){

                                    var day = week_days_occurs_order[index];                     // day -> 2 char string corresponding to one of the days of the week
                                    var next_day_index = day + duration.asDays();     // next_day_index -> find the next day of the week that an event can occur (no occurence overlaps)
                                    var previous_day_index = day - duration.asDays(); // prev_day_index -> find the prev day of the week that an event can occur

                                    // make sure next/prev variables are within bounds
                                    var prev_day_exists = false;
                                    var combine_events = false;
                                    if (next_day_index > 6){
                                        next_day_index = next_day_index - 6;
                                    }
                                    if(previous_day_index < 0){
                                        previous_day_index = previous_day_index + 6;
                                    }

                                    //  check if prev_day/next_day was selected by the user, if true set variables to true
                                    if(week_days_occurs_order.includes(next_day_index)){
                                        combine_events = true
                                    }
                                    if(week_days_occurs_order.includes(prev_day_exists)){
                                        prev_day_exists = true;
                                    }

                                    // getting start and end moment objects
                                    var debut = moment(`${loop_start.format("DD/MM/YY HH:mm:ss")}`,"DD/MM/YY HH:mm:ss");
                                    debut = moment(debut).day(day)    // set day of week
                                    var fin = moment(moment(debut).add(duration.asMilliseconds(),"ms"));

                                    // if one of the days is before start date of event, don't display it on the calendar
                                    if(debut.isBefore(start)){
                                        continue
                                    }
                                    
                                    // call function that returns all html code for 1 event occurence
                                    let result = return_html(debut, fin, loop_int, combine_events, prev_day_exists);
                                    // loop through result and append it to variable storing results from all events
                                    for(var index in result){
                                        boxes.push(result[index]);
                                    }

                                }
                            }
                            // increment loop start with frequency set by user
                            loop_start = moment(moment(loop_start).add(parseInt(event.rrule.interval),frequency_str));
                        }
                        break;

                    // event repeats daily
                    case "DAILY":
                        var frequency_str = "d";
                        
                        // loop until end of recursion is met
                        while(loop_start.isSameOrBefore(until_moment)){
                            // get html code and append it to variable storing html code for event
                            let result = return_html(loop_start, loop_end, loop_int, false);
                            for (var index in result){
                                boxes.push(result[index]);
                            }
                            // inc moment js obj with freq and amount set by user
                            loop_start = moment(moment(loop_start).add(parseInt(event.rrule.interval), frequency_str)); 
                        }
                        break;

                    case "MONTHLY":
                        // loop until end date of recursion is met
                        while(loop_start.isSameOrBefore(until_moment)){
                            

                            // if event occurs on same date of every month
                            if("BYMONTHDAY" in event.rrule){
                                // loop threw all days of event
                                let result = return_html(loop_start, loop_end, loop_int, false);
                                for(var index in result){
                                    boxes.push(result[index]);
                                }
                            }
                            // if it's by week day of month, ex, 3rd wednesday
                            else{   
                                var list_days = ["Su","Mo","Tu","We","Th","Fr","Sa"];                                       // list of all days in a week
                                var day_of_week = list_days.indexOf(event.rrule.BYDAY[0][1]+event.rrule.BYDAY[0][2]) + 1;   // day of week set by user
                                var week_of_month = parseInt(event.rrule.BYDAY[0][0]) - 1;                                  // week of month (0,1,2,3)
                                var occurs_on = (day_of_week) + 7*week_of_month;                                            // date for event occurence

                                // get moment objects for current event occurence
                                var temp_start = moment(`${occurs_on}${loop_start.format("/MM/YY hh:mm:ss")}`,"DD/MM/YY hh:mm:ss");
                                var temp_end = moment(moment(temp_start).add(duration.asDays(),"days"));
                                
                                // get html and append
                                let result = return_html(temp_start,temp_end,loop_int,false);
                                for(var index in result){
                                    boxes.push(result[index]);
                                }
                                
                            }
                            // inc moment js obj with freq & amount set by user
                            loop_start = moment(moment(loop_start).add(parseInt(event.rrule.interval), 'months'));
                        }
                }
            
                
            
            }
            
            // event repeats after x amount of occurences
            else if("COUNT" in event.rrule){

                var event_occurences = event.rrule.COUNT;   // amount of times an event should occur
                var loop_start = moment(start);             // moment js object used for looping
                var loop_end = moment(end);                 // moment js object used for looping

                // freq type determines recursion type
                switch(event.rrule.FREQ){
                    // event reoccurs weekly
                    case "WEEKLY":

                        
                        var list = ["Su","Mo","Tu","We","Th","Fr","Sa"];    // list used to find day of week index
                        var week_days_occurs_order = [];                    // list used to store the days of the week when the event occurs

                        // loop through days selected, append to week_days_occurs_order
                        for(var index in event.rrule.BYDAY){
                            let day_index = list.indexOf(event.rrule.BYDAY[index]);
                            week_days_occurs_order.push(day_index);
                        }
                        week_days_occurs_order = week_days_occurs_order.sort((a, b) => a - b);  // sort list low to high

                        // loop for amount of occurences set by user
                        // loop_counter will keep track of the amount of occurences for which html code was returned
                        let loop_counter = 0;
                        while(loop_counter < event_occurences){

                            // loop through days of the week for the event to occur
                            for(var i = 0; i< week_days_occurs_order.length;i++){

                                // check to see if all html code was generated for each occurence
                                // if true exit loop
                                if(loop_counter > event_occurences-1){
                                    break;
                                }

                                // create start and end moment objects with the date
                                let week_day_moment = moment(`${loop_start.format("DD/MM/YY hh:mm:ss")}`,"DD/MM/YY hh:mm:ss");
                                week_day_moment = moment(week_day_moment).day(week_days_occurs_order[i]);   // set day of week
                                let week_day_moment_end = moment(moment(week_day_moment).add(duration.asMilliseconds(),"ms"));

                                // if moment before start date, continue to next iteration
                                if(week_day_moment.isBefore(start)){
                                    continue;
                                }else{
                                    // if moment is after start date, increment loop_counter, this will count as 1 occurence.
                                    loop_counter++;
                                }
                                
                                // call function to return html, append results
                                const result = return_html(week_day_moment, week_day_moment_end, loop_int, false);
                                for(var index in result){
                                    boxes.push(result[index]);
                                }
                            }
                            // inc moment with freq and amount set by user
                            loop_start = moment(moment(loop_start).add(event.rrule.interval, "w"));
                        }
                        break;

                    // event reoccurs daily
                    case "DAILY":

                        // loop through all occurences set by user
                        for(var i = 0; i<event_occurences;i++){

                            // call function which returns html code, append to variable storing html
                            let result = return_html(loop_start, loop_end, loop_int, false);
                            for(var index in result){
                                boxes.push(result[index]);
                            }

                            // inc loops    
                            loop_start = moment(moment(loop_start).add(parseInt(event.rrule.interval),"d"));
                            loop_end = moment(moment(loop_end).add(parseInt(event.rrule.interval),"d"));
                        }
                        break;

                    // event reoccurs weekly
                    case "MONTHLY":
                        // loop through occurences set by user
                        for(var i =0; i<event_occurences;i++){

                            // if user selects date. ex(17th of every month)
                            if("BYMONTHDAY" in event.rrule){
                                // temp start-end moment objects
                                let temp_start  = moment(`${event.rrule.BYMONTHDAY}${loop_start.format("/MM/YY HH:mm:ss")}`,"DD/MM/YY HH:mm:ss");
                                let temp_end = moment(moment(temp_start).add(duration.asMilliseconds(),"Milliseconds"));

                                

                                


                                
                                // call function which returns html code, append to variable storing html
                                let result = return_html(temp_start, temp_end, loop_int, false);
                                for(var index in result){
                                    boxes.push(result[index]);
                                }
                                
                                
                                
                                var should_loop = true;     // bool val used in while loop, set it to false when you need to exit the loop
                                var month_int = 1;          // variable used for incrementing moment js object
                                var interval_int = 0;       // variable used for keeping track of the amount of valid dates that have been found


                                // loop until it's set to false
                                while(should_loop){
                                    // every loop initialize these moment objects with a valid date (dates coming in will always be valid)
                                    var while_start = temp_start.clone();
                                    var while_end = temp_end.clone();

                                    // increment the moment objects
                                    while_start = moment(while_start).add(month_int, "months");
                                    while_end = moment(while_end).add(month_int, "months");
                                    // console.log(while_start.format("DD/MM/YY HH:mm"), while_start.isValid(), while_end.format("DD/MM/YY HH:mm"), while_end.isValid())

                                    // check if dates are valid
                                    if(while_start.isValid() && while_end.isValid()){
                                        // check if dates meet the interval requirement set by user (ex, every 2 months)
                                        // if dates are not the right occurence, increment month_int and interval_int
                                        if(interval_int != event.rrule.interval-1){
                                            loop_start = while_start.clone();
                                            should_loop = false;
                                            month_int++;
                                            interval_int++;
                                        }else{
                                            
                                        }
                                    }
                                    // if dates are invalid increment var used for adding months to moment obj
                                    // ex start date = 01/10/20, loop 1 = 1/11/20, loop 2 = 1/12/20
                                    else{
                                        month_int++;
                                    }
                                }
                            }
                            // if users selects specific day. ex (3rd tuesday)
                            else{

                                // getting date so we can create start & end moments
                                let list = ["Su","Mo","Tu","We","Th","Fr","Sa"];                                    // list of all days in a week
                                let day_of_week = list.indexOf(event.rrule.BYDAY[0][1] + event.rrule.BYDAY[0][2]);  // day of week in integer form [0,1,2,3,4,5,6,]

                                // clone moment object and set it to the first specified day of the week
                                var temp_moment = loop_start.clone().startOf("month").day(day_of_week);  
                                // loop for specified amount of weeks
                                for(var j =0; j< parseInt(event.rrule.BYDAY[0][0]); j++){
                                    console.log("stuck in inc")
                                    // for each iteration add 1 week to moment object so that it occurs on the right week of the month
                                    temp_moment = moment(temp_moment).add(1, "weeks");
                                }
                                // if there is a fifth week and we're displaying the 
                                if(parseInt(event.rrule.BYDAY[0][0]) == 4){
                                    var try_incrementing = temp_moment.clone().add(1,"weeks");
                                    if(try_incrementing.isValid() && temp_moment.format("MM") == try_incrementing.format("MM")){
                                        temp_moment = try_incrementing;
                                    }
                                }
                                
                                // create moment objects with date variable and old moment objects (old ones used for getting month and year and time when event occurs)
                                let temp_start  = moment(`${temp_moment.format("DD")}${loop_start.format("/MM/YY HH:mm:ss")}`,"DD/MM/YY HH:mm:ss");
                                let temp_end = moment(moment(temp_start).add(duration.asMilliseconds(),"Milliseconds"));
                                
                                // console.log(temp_start.format("DD/MM/YY HH:mm"), temp_start.isValid(), temp_end.format("DD/MM/YY HH:mm"), temp_end.isValid(),event)
                                // call function which returns html code, append to variable storing html
                                let result = return_html(temp_start, temp_end, loop_int, false);
                                

                                for(var index in result){
                                    boxes.push(result[index]);
                                }
                            }
                            // increment start moment object with freq and amount set by user
                            loop_start = moment(moment(loop_start).add(event.rrule.interval,"months"));
                        }
                }
            }
            // push all html code for current event to object storing html for all events
            object.event_boxes.push(boxes)    
        }
        // return html for all events
        return object;
    }


    // function that generates associated html code for events
    generate_day_html(day_arg, html_obj){

        let list_events = html_obj.event_boxes;
        let today_moment = day_arg
        let list_html = [];

        // start and end moments
        // used for finding start&end time of the event for the current day
        var start_moment = moment();
        var end_moment = moment();




        // loop through events
        for(var event_index in list_events){
            var event = list_events[event_index]
            var event_results = [];
            // loop through all objects {moment object: html_code} for 1 event
            for(var obj_index in event){
                var  cur_obj = event[obj_index];
                var cur_day_str = Object.keys(cur_obj)[0].slice(4,15);
                var html = cur_obj[Object.keys(cur_obj)[0]];
                
                // if event occurs on the same day
                if(cur_day_str == today_moment.format("MMM DD YYYY")){
                    
                    // if typeof == object then there is an arrow in the html meaning it spans to the next day
                    if(typeof html.props.children == "object"){

                        // since it spans to the next day set the end_moment to the end of the day
                        end_moment = moment(today_moment).endOf("day");


                        // if html child is equal to all day set start_moment to the start of the day
                        if(html.props.children[0].props.children == "all day"){
                            start_moment = moment(today_moment).startOf("day");
                        }
                        // if html child is not all day set start_moment to the start of the event time
                        // to get start time parse the html.props.children[0].props.children
                        else{
                            start_moment = moment(`${html.props.children[0].props.children.slice(0,5)} ${today_moment.format("DD/MM/YY")}`,"HH:mm DD/MM/YY");
                       }
                    }
                    
                    else{
                        let start = html.props.children.split("-")[0].split(" ").join("");
                        // if start has no semi colon, then the event carries over from previous day so set it to 00:00
                        if(start[2] != ":"){
                            start = "00:00";
                        }
                        let end = html.props.children.split("-")[1].split(" ").join("");

                        start_moment = moment(`${start} ${today_moment.format("DD/MM/YY")}`,"HH:mm DD/MM/YY") 
                        end_moment = moment(`${end} ${today_moment.format("DD/MM/YY")}`,"HH:mm DD/MM/YY") 
                    }
                    var duration = moment.duration( moment(end_moment.format("DD/MM/YY HH:mm:ss"),"DD/MM/YY HH:mm:ss").diff( moment(start_moment.format("DD/MM/YY HH:mm:ss"),"DD/MM/YY HH:mm:ss")) )
                    // since day calendar is separated in 5 min increments
                    // get event duration in minutes and divide by 5 for the total amount of html code we need to return for that event
                    let loop_duration = duration.asMinutes() / 5;
                    if(loop_duration ==  287){
                        loop_duration = 288;
                    }

                    // loop six times for 5 min increments
                    for(var i = 0; i<loop_duration;i++){
                        // default jsx
                        var jsx = <div key={`${start_moment.format("HH:mm")} ${event_index}`} className={`day-event ${i}`}></div>;

                        // if on first iteration, give it rounded corners by giving it another class name
                        if(i == 0){
                            jsx = <div key={`${start_moment.format("HH:mm")} ${event_index}`} className={`day-event first-5min`}>{`${start_moment.format("HH:mm")} - ${end_moment.format("HH:mm")}`}</div>;
                        }
                        // if on last iteration, give it d corners by giving it another class name. 
                        else if(i == Math.ceil(loop_duration)-1){
                            jsx = <div key={`${start_moment.format("HH:mm")} ${event_index}`} className={`day-event last-5min`}></div>;
                        }
                        event_results.push(jsx);

                        start_moment = moment(moment(start_moment).add(5,"minutes"))
                    }

                }
                
            }
            list_html.push(event_results)
            
        }

        
        return list_html;
    }
