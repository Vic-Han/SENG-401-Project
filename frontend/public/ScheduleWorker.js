
// // worker.js
let schedules = []
self.onmessage = function(event) {
    schedules = []
    const courses = event.data.courses;
    
    console.log(courses)
    depthFirstSearch(courses)
    console.log(schedules)
    self.postMessage({
        schedules: schedules
    });
};
const dayToIndex = {'M' : 0, 'T' : 1, 'W' : 2, 'R' : 3, 'F' : 4}
class Schedule {
    constructor(oldSched = null, section = null, index = null){
        if(oldSched == null){
            this.selectedOptions = []
            this.takenTimes = [[],[],[],[],[]]
        }
        else{
            this.selectedOptions = [...oldSched.selectedOptions]
            this.selectedOptions.push(index)
            this.takenTimes =[...oldSched.takenTimes];
            for(let i = 0; i < section.lecture.days.length; i++){
                const day = section.lecture.days[i]
                const index = dayToIndex[day]
                this.takenTimes[index].push([section.lecture.start, section.lecture.end])
                // for(let i = this.takenTimes[index].length - 1; i > 0; i--){
                //     if(this.takenTimes[index][i][0] < this.takenTimes[index][i-1][0]){
                //         const temp = this.takenTimes[index][i]
                //         this.takenTimes[index][i] = this.takenTimes[index][i-1]
                //         this.takenTimes[index][i-1] = temp
                //     }
                //     else{
                //         break
                //     }
                // }
            }
            if(section.tutorial.start){
                for(let i = 0; i < section.tutorial.days.length; i++){
                    const day = section.tutorial.days[i]
                    const index = dayToIndex[day]
                    this.takenTimes[index].push([section.tutorial.start, section.tutorial.end])
                    // for(let i = this.takenTimes[index].length - 1; i > 0; i--){
                    //     if(this.takenTimes[index][i][0] < this.takenTimes[index][i-1][0]){
                    //         const temp = this.takenTimes[index][i]
                    //         this.takenTimes[index][i] = this.takenTimes[index][i-1]
                    //         this.takenTimes[index][i-1] = temp
                    //     }
                    //     else{
                    //         break
                    //     }
                    // }
                }
            }
        }
        
    }
}

// function validEntry(currentSchedule, newLecture){
//     const lecStart = newLecture.lecture.start
//     const lecEnd = newLecture.lecture.end
//     for(day in newLecture.lecture.days){
//         const index = dayToIndex[day]
//         for(time in currentSchedule.takenTimes[index]){
//             // if the new lecture starts before the current lecture ends and ends after the current lecture starts
//             if(time[1] > lecStart && time[0] < lecStart){
//                 return false
//             }
//             // if the new lecture starts before the current lecture ends and ends after the current lecture starts
//             if(time[0] < lecEnd && time[1] > lecEnd){
//                 return false
//             }
//         }
//     }
//     if(newLecture.tutorial.start){
//         const tutStart = newLecture.tutorial.start
//         const tutEnd = newLecture.tutorial.end
//         for(day in newLecture.tutorial.days){
//             const index = dayToIndex[day]
//             for(time in currentSchedule.takenTimes[index]){
//                 // if the new lecture starts before the current lecture ends and ends after the current lecture starts
//                 if(time[1] > tutStart && time[0] < tutStart){
//                     return false
//                 }
//                 // if the new lecture starts before the current lecture ends and ends after the current lecture starts
//                 if(time[0] < tutEnd && time[1] > tutEnd){
//                     return false
//                 }
//             }
//         }
//     }
//     return true
// }

// function validEntry(currentSchedule, newLecture){
//         const lecStart = newLecture.lecture.start
//         const lecEnd = newLecture.lecture.end
//         for (const day of newLecture.lecture.days) {
//             const index = dayToIndex[day];
//             for (const time of currentSchedule.takenTimes[index]) {
//                 // Check if the new lecture overlaps with the current time slot:
//                 if ((lecStart >= time[0] && lecStart < time[1]) || (lecEnd > time[0] && lecEnd <= time[1])) {
//                     return false; // There is a conflict
//                 }
//             }
//         }
    
//         // Check for tutorial overlaps in a similar manner
//         if (newLecture.tutorial.start) {
//             const tutStart = newLecture.tutorial.start;
//             const tutEnd = newLecture.tutorial.end;
            
//             for (const day of newLecture.tutorial.days) {
//                 const index = dayToIndex[day];
//                 for (const time of currentSchedule.takenTimes[index]) {
//                     // Check if the new lecture overlaps with the current time slot:
//                     console.log(time, tutStart, tutEnd)
//                     if ((tutStart >= time[0] && tutStart < time[1]) || (tutEnd > time[0] && tutEnd <= time[1])) {
//                         return false; // There is a conflict
//                     }
//                 }
//             }
//         }
        
//         return true
//     }
const currentSchedule = new Schedule()
function validEntry(newLecture){
    const lecStart = newLecture.lecture.start;
    const lecEnd = newLecture.lecture.end;
    
    for (const day of newLecture.lecture.days) {
        const index = dayToIndex[day];
        for (const time of currentSchedule.takenTimes[index]) {
            // Check if the new lecture overlaps with the current time slot:
            console.log(time, lecStart, lecEnd)
            if ((lecStart >= time[0] && lecStart < time[1]) || (lecEnd > time[0] && lecEnd <= time[1])) {
                return false; // There is a conflict
            }
        }
    }
    
        // Check for tutorial overlaps in a similar manner
        if (newLecture.tutorial.start) {
            const tutStart = newLecture.tutorial.start;
            const tutEnd = newLecture.tutorial.end;
            
            for (const day of newLecture.tutorial.days) {
                const index = dayToIndex[day];
                for (const time of currentSchedule.takenTimes[index]) {
                    // Check if the new lecture overlaps with the current time slot:
                    console.log(time, tutStart, tutEnd)
                    if ((tutStart >= time[0] && tutStart < time[1]) || (tutEnd > time[0] && tutEnd <= time[1])) {
                        return false; // There is a conflict
                    }
                }
            }
        }
        
        return true
    }
function depthFirstSearch(remainingCourses){
    if(remainingCourses.length == 0){
        const sched = [...currentSchedule.selectedOptions]
        const newSched = []
        for(let i = sched.length-1; i >= 0; i--){
            newSched.push(sched[i])
        }  
        schedules.push(newSched)
        return
    }
    const course = remainingCourses[remainingCourses.length - 1]
    const newRemainingCourses = remainingCourses.slice(0, remainingCourses.length - 1);
    // Todo pick course based on heurstic
    for(let index = 0; index < course.selectedIndices.length; index++){
        const section = course.combinations[index]

        if(!course.selectedIndices[index]){
            continue
        }
        const lectureInfo = {
            lecture: {
                start: null,
                end: null,
                days: null,
            },
            tutorial: {
                start: null,
                end: null,
                days: null,
            },
            
        }
        for(let i = 0; i < course.lectures.length; i++){
            if(course.lectures[i].name == section[0]){
                lectureInfo.lecture.start = course.lectures[i].start
                lectureInfo.lecture.end = course.lectures[i].end
                lectureInfo.lecture.days = course.lectures[i].days
            }
        }
        if(section.length > 1){
            for(let i = 0; i < course.tutorials.length; i++){
                if(course.tutorials[i].name == section[1]){
                    lectureInfo.tutorial.start = course.tutorials[i].start
                    lectureInfo.tutorial.end = course.tutorials[i].end
                    lectureInfo.tutorial.days = course.tutorials[i].days
                }
            }
        }
        if(lectureInfo.tutorial.start === 16 && currentSchedule.selectedOptions.length == 1){
            console.log(lectureInfo, currentSchedule)
        }
        if(validEntry(lectureInfo)){
            currentSchedule.selectedOptions.push(index)
            for(let i = 0; i < lectureInfo.lecture.days.length; i++){
                const day = lectureInfo.lecture.days[i]
                const index = dayToIndex[day]
                currentSchedule.takenTimes[index].push([lectureInfo.lecture.start, lectureInfo.lecture.end])
               
            }
            if(lectureInfo.tutorial.start){
                for(let i = 0; i < lectureInfo.tutorial.days.length; i++){
                    const day = lectureInfo.tutorial.days[i]
                    const index = dayToIndex[day]
                    currentSchedule.takenTimes[index].push([lectureInfo.tutorial.start, lectureInfo.tutorial.end])
                }
            }
            

                depthFirstSearch(newRemainingCourses)
                currentSchedule.selectedOptions.pop()
                for(let i = 0; i < lectureInfo.lecture.days.length; i++){
                    const day = lectureInfo.lecture.days[i]
                    const index = dayToIndex[day]
                    currentSchedule.takenTimes[index].pop()
                }
                if(lectureInfo.tutorial.start){
                    for(let i = 0; i < lectureInfo.tutorial.days.length; i++){
                        const day = lectureInfo.tutorial.days[i]
                        const index = dayToIndex[day]
                        currentSchedule.takenTimes[index].pop()
                    }
                }
            
        }
    }
    
}

// const samplesched = {
//     selectedOptions: [2],
//     takenTimes: [[],[[14,15.25]],[[16,18]],[[14,15.25]],[]]
// }
// const samplelec={
//     lecture: {
//         start: 8,
//         end: 9.25,
//         days: "TR"
//     },
//     tutorial: {
//         start: 16,
//         end: 18,
//         days: "W"
//     }
// }
// console.log(validEntry(samplesched, samplelec))