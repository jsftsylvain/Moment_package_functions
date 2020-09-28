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
    get_weekly_dates(){
        // call getDaysArrayByMonth function to get access to 3 lists of moment objects for the current, previous, and following month
        var curMoment = this.state.CalendarDate;
        var daysInMonth = this.getDaysArrayByMonth(curMoment.year(), curMoment.month());
        curMoment = curMoment.subtract(1,"months");
        var daysInMonthPrevious = this.getDaysArrayByMonth(curMoment.year(), curMoment.month());
        curMoment = curMoment.add(2, "months");
        var daysInMonthAfter = this.getDaysArrayByMonth(curMoment.year(),curMoment.month());
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
