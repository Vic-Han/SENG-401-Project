<!-- This is the SchedBuilder component that toggles when the route is set to schedule -->
<template>
    <AdvancedSearch v-if="advancedSearchOpen" @close="advancedSearchOpen = false" @applyadvancedsearch="applyAdvancedFilters"></AdvancedSearch>
    <AcademicSchedulePopup v-if="academicRequirementsPopup" :requirements="degreeRequirements" @close="academicRequirementsPopup = false" @selectcourse="addCourseFromRequirements"></AcademicSchedulePopup>
    <CourseEnrollmentPopup v-if="enrollPopup " :courses="schedCourses" :term="selectedTerm.term_key" @close="enrollPopup = false" @enroll="getTermInfo"></CourseEnrollmentPopup>
    <div v-if="dropCoursePopup">
        <div class="bg-black-100 fixed opacity-50 w-screen h-screen z-40"></div>
        <div class="fixed w-1/3 h-auto max-h-3/4 overflow-y-auto px-4 pb-4 bg-white-100 rounded-xl left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 shadow-lg z-50">
            <div class="italic font-semibold text-xl py-10">Are you sure you want to drop {{ selectedDroppedCourse }}?</div>
            <div class="flex flex-row px-36 pb-5">
                <div class="border-2 cursor-pointer font-semibold w-20 pt-1.5 h-10 mx-auto border-red-100 text-red-100 rounded-lg hover:bg-red-100 hover:text-white-100" @click="dropCourse">Yes</div>
                <div class="border-2 cursor-pointer font-semibold w-20 pt-1.5 h-10 mx-auto border-red-100 text-red-100 rounded-lg hover:bg-red-100 hover:text-white-100" @click="dropCoursePopup = false">Cancel</div>
            </div>
                
        </div>
    </div>
    <div class="flex flex-row">
        <div class=" px-2 flex flex-col h-screen box-content bg-white-100 shadow-xl">
            <a href="https://www.ucalgary.ca/" target="_blank">
                <img  src="@/assets/unilogo.png" alt="University Logo" class="w-96 self-center">
            </a>
            <router-link to="/dashboard" class="flex flex-row py-6 items-center" @mouseenter="backHover = true" @mouseleave="backHover = false">
                <div class="w-1/3 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" class="absolute rotate-90 h-16 w-16 fill-grey-200 -translate-y-8 right-1" v-bind:class="{'fill-red-100' : backHover}" viewBox="0 -960 960 960">
                        <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>
                    </svg>
                </div>
                <div class="font-semibold text-grey-200 text-2xl" v-bind:class="{'text-red-100' : backHover}">Back to Home</div>
            </router-link>
            <div class="flex flex-row items-center w-full relative left-5">
                <input type="text" placeholder="search" @input="searchResults" v-model="courseSearchTerm" class="w-2/3 text-xl pl-2 h-9 border border-black-100 rounded-md outline-red-100 ">
                <div class="text-lg w-fit px-3 cursor-pointer text-left text-grey-200 hover:text-red-100" @click="advancedSearchOpen = true"> Advanced Search</div>
            </div>
            <div class="h-4/6 overflow-y-auto w-96">
                <div v-for="(course,index) in searchedCourses" :key="index">
                    <CoursePreview :course="course" :number="computeColor(course.name)" 
                    @addcourse="searchedToSched"
                    @removecourse="removeCourse"
                    ></CoursePreview>
                </div>
            </div>
            <div @click="academicRequirementsPopup=true" class="relative left-1/2 -translate-x-1/2 border-4 border-red-100 rounded-lg text-red-100 font-semibold cursor-pointer w-fit text-center p-3 hover:bg-red-100 hover:text-white-100"> Academic Requirements</div>
        </div>
        <div class="flex flex-col w-full">
            <div class="bg-white-100 rounded-xl shadow-xl m-4">
                <div class="flex flex-row relative left-1/2 -translate-x-1/2 w-fit my-5">
                    <div class="text-5xl mx-5">
                        <svg @click="prevTerm" xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 rotate-90 fill-grey-200 hover:fill-red-100 cursor-pointer" viewBox="0 -960 960 960">
                            <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>
                        </svg>
                    </div> 
                    <div class="text-5xl pt-4 mx-40 text-grey-200">{{convertTerm(selectedTerm.term_key)}}</div>
                    <div class="text-5xl mx-5">
                        <svg @click="nextTerm" xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 -rotate-90 fill-grey-200 hover:fill-red-100 cursor-pointer" viewBox="0 -960 960 960">
                            <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>
                        </svg>
                    </div>
                    
                </div>
                <div class="flex flex-row relative left-1/2 -translate-x-1/2 w-fit mb-5">
                    <div class="text-3xl mx-4 mt-4" @click="resetSelectedToZero">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 fill-grey-200 hover:fill-red-100 cursor-pointer" viewBox="0 -960 960 960">
                            <path d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z"/>
                        </svg>
                    </div>
                    <div class="text-3xl mx-4 mt-4" @click="decrementSchedIndex">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 rotate-90 fill-grey-200 hover:fill-red-100 cursor-pointer" viewBox="0 -960 960 960">
                            <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>
                        </svg>
                    </div>
                    <div class="flex flex-col p-2 mx-8">
                        <div class="text-3xl text-grey-200"> Result </div>
                        <div class="text-3xl text-grey-200"> {{ schedules.length > 0 ?  (schedIndex + 1)+ ' of ' + schedules.length : '0 of 0'}} </div>
                    </div>
                    <div class="text-3xl mx-4 mt-4" @click="incrementSchedIndex">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 -rotate-90 fill-grey-200 hover:fill-red-100 cursor-pointer" viewBox="0 -960 960 960">
                            <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>
                        </svg>
                    </div>
                    <div class="text-3xl mx-4 mt-4" @click="setSelectedToLast">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 rotate-180 fill-grey-200 hover:fill-red-100 cursor-pointer" viewBox="0 -960 960 960">
                            <path d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-11 h-200">
                <div class="col-span-4 flex flex-col px-10 h-full max-h-full overflow-y-auto bg-white-100 rounded-xl shadow-xl mb-4 mx-4 p-4">
                    <div v-if="schedCourses.length+cartCourses.length == 0" class="text-grey-200 text-2xl font-semibold pt-20"> Add Courses to Your Schedule by Searching for a Course </div>
                    <div v-for="(course,index) in schedCourses" :key="index">
                        <SelectedCourse 
                        :course="course" :number="index"
                        @unselect="schedToCart"
                        @removecourse="removeCourseFromSched"
                        @addsection="addSection"
                        @removesection="removeSection"
                        @selectall="reselectall"
                        @selectset="updateset"
                        ></SelectedCourse>
                    </div>
                    <div v-for="(course,index) in cartCourses" :key="index">
                        <SelectedCourse 
                        :course="course" :number="index + schedCourses.length"
                        @select="cartToSched"
                        @removecourse="removeCourseFromCart"
                        @addsection="addSection"
                        @removesection="removeSection"
                        @selectall="reselectall"
                        @selectset="updateset"
                        ></SelectedCourse>
                    </div>
                </div>
                <div class="flex flex-col items-center col-span-7 h-full bg-white-100 rounded-xl shadow-xl mb-4 mr-4 p-4">
                    <!-- <SchedPreview :sched="schedules.length > 0 ? schedules[selectedSched] : null"> </SchedPreview> -->
                    <SchedPreview :schedule="courseListToSched()"></SchedPreview>
                    <div class="border-4 font-semibold border-red-100 mt-4 w-fit relative left-1/3 translate-x-2 p-3 text-xl rounded-xl text-red-100 hover:bg-red-100 hover:text-white-100"
                    @click="getSchedule">Get Schedule</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SchedPreview from '@/components/SchedPreview.vue'
import CoursePreview from '@/components/CoursePreview.vue'
import SelectedCourse from '@/components/SelectedCourse.vue'
import AdvancedSearch from '@/components/AdvancedSearch.vue'
import AcademicSchedulePopup from '@/components/AcademicSchedulePopup.vue'
import CourseEnrollmentPopup from '@/components/CourseEnrollmentPopup.vue'
import data from './SB.json'
let allCourses = []
const courseCode = (course, filters) =>{
                    return course.name.includes(filters.major)
                }
                const getcourseNumber = (courseName) =>{
                    
                    return parseInt(courseName[courseName.length - 3] + courseName[courseName.length - 2] + courseName[courseName.length - 1])
                }
                const courseNumber = (course, filters) =>{
                    switch(filters.eq){
                        case '=':
                            return getcourseNumber(course.name) == filters.courseNumber
                        case '>':
                            return getcourseNumber(course.name) > filters.courseNumber
                        case '<':
                            return getcourseNumber(course.name) < filters.courseNumber
                        case '>=':
                            return getcourseNumber(course.name) >= filters.courseNumber
                        case '<=':
                            return getcourseNumber(course.name) <= filters.courseNumber
                    }
                }
const createLecInfo = (course, index) =>{
                        const section = course.combinations[index]
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
}
    export default{
        name : 'SchedBuilder',
        emits: ['hide-navbar'],
        components: {
            SchedPreview,
            CoursePreview,
            SelectedCourse,
            AdvancedSearch,
            AcademicSchedulePopup,
            CourseEnrollmentPopup
        },
        data : () => {
            return {
                backHover: false,
                allInfo: {
                },
                selectedTerm: 'Fal2023',
                courseSearchTerm: '',
                searchedCourses: [],
                
                cartCourses: [],
                
                schedCourses: [],
                schedules: [],
                schedIndex: 0,

                degreeRequirements: [],
                advancedSearchOpen: false,
                schedsLoading: false,
                advancedFilters: {
                },
                academicRequirementsPopup: false,
                selectedDroppedCourse : '',
                dropCoursePopup: false,
                enrollPopup: false,
            }
        },
        created(){
            this.$emit('hide-navbar')
            const backendPayload = data
            this.allInfo = backendPayload
            //allCourses = this.allInfo.allCourses
            this.degreeRequirements = this.allInfo.academicRequirements
            this.schedCourses.forEach((item) => {
                item.included = 'sched';
                item.selected = 0;
            })
            this.worker = new Worker('./ScheduleWorker.js')
            //this.selectedTerm = 'Fal2023'
            //this.getTermInfo()
            this.getTerms()
        },
        methods:{
            nextTerm(){
                const index = this.terms.findIndex((term) => {
                    return term.term_key == this.selectedTerm.term_key
                })
                if(index < this.terms.length - 1){
                    this.selectedTerm = this.terms[index + 1]
                }
            },
            prevTerm(){
                const index = this.terms.findIndex((term) => {
                    return term.term_key == this.selectedTerm.term_key
                })
                if(index > 0){
                    this.selectedTerm = this.terms[index - 1]
                }
            },
            async getTerms(){
                const serverPath = this.$store.state.serverPath
                const apiPath = '/api/terms/'
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization' : `Token ${this.$cookies.get("auth-token")}`
                }
                try{
                    const res = await this.$http.get(`${serverPath}${apiPath}`, {headers: headers})
                    console.log(res.data)
                    const date = new Date('2023-09-01')
                    this.terms = res.data.filter((term) => {
                        return new Date(term.end_date) > date
                    })
                    this.selectedTerm = this.terms[0]
                }
                catch(err){
                    console.log(err)
                }
            },
            async getTermInfo(){
                const serverPath   = this.$store.state.serverPath
                const apiPath = '/api/schedule-builder/'
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${this.$cookies.get('auth-token')}`
                }
                
                console.log(`${serverPath}${apiPath}${encodeURIComponent(this.selectedTerm.term_key)}`, headers)
                this.$http.get(`${serverPath}${apiPath}${encodeURIComponent(this.selectedTerm.term_key)}`, {headers: headers}).then(res =>{
                    allCourses = res.data.allCourses
                    this.courseSearchTerm = '' 
                    this.searchedCourses = []
                    this.schedCourses = []
                    this.cartCourses = []
                    this.degreeRequirements = res.data.academicRequirements
                    console.log(res.data)
                    const currentSchedule = res.data.currentSchedule
                    for(const [key, value] of Object.entries(currentSchedule)){
                        console.log(key,value)
                        for(let i = 0; i < allCourses.length; i++){
                            if(allCourses[i].name == key){
                                console.log("Hi")
                                
                                if(value.Tutorial){
                                    for(let j = 0; j < allCourses[i].combinations.length; j++){
                                        if(allCourses[i].combinations[j][0] == value.Lecture && allCourses[i].combinations[j][1] == value.Tutorial){
                                            allCourses[i].selectedIndices = Array(allCourses[i].combinations.length).fill(false)
                                            allCourses[i].selectedIndices[j] = true
                                            allCourses[i].selected = j
                                            allCourses[i].included= 'sched'
                                            allCourses[i].enrolled = value
                                            break
                                        }
                                    }
                                }
                                else{
                                    for(let j = 0; j < allCourses[i].combinations.length; j++){
                                        if(allCourses[i].combinations[j][0] == value.Lecture){
                                            allCourses[i].selectedIndices = Array(allCourses[i].combinations.length).fill(false)
                                            allCourses[i].selectedIndices[j] = true
                                            allCourses[i].selected = j
                                            allCourses[i].included = 'sched'
                                            allCourses[i].enrolled = value
                                            break
                                        }
                                    }
                                }
                                console.log(allCourses[i])
                                const newSched = [...this.schedCourses, allCourses[i]]
                                this.schedCourses = newSched
                                break
                            }
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            searchResults(){
                this.searchedCourses = []
                const term = this.courseSearchTerm.toLowerCase()
                if(term == ""){
                    return;
                }
                allCourses.forEach((item) => {
                    if(item.name.toLowerCase().includes(term)){
                        if(this.courseInSched(item.name)){
                            item.included = 'sched';
                        }
                        else if(this.courseInCart(item.name) ){
                            item.included = 'cart';
                        }
                       
                        else{
                            item.included = false;
                        }
                        this.searchedCourses.push(item)
                    }
                })
            },
            searchedToSched(courseName){
                const index = this.searchedCourses.findIndex((item) => {
                    return item.name == courseName
                })
                const course = this.searchedCourses[index]
                course.included = 'sched'
                course.selected = 0
                course.selectedIndices =  Array(course.combinations.length).fill(true)
                const newSched = [...this.schedCourses, course]
                this.schedCourses = newSched
            },
            schedToCart(courseName){
                const index = this.schedCourses.findIndex((item) => {
                    return item.name == courseName
                })
                const course = this.schedCourses[index]
                course.included = 'cart';
                const newCart = [...this.cartCourses, course]
                this.cartCourses = newCart
                const newSched = this.schedCourses.filter((item) => {
                    return item.name != courseName
                })
                this.schedCourses = newSched
            },
            removeCourseFromCart(courseName){
                const newCart = this.cartCourses.filter((item) => {
                    return item.name != courseName
                })
                this.cartCourses = newCart
                for(let i = 0; i < this.searchedCourses.length; i++){
                    if(this.searchedCourses[i].name == courseName){
                        this.searchedCourses[i].included = false;
                        this.searchedCourses[i].selected = 0;
                        break;
                    }
                }
            },
            removeCourseFromSched(courseName){    
                for(let i = 0; i < this.schedCourses.length && !this.dropCoursePopup; i++){
                    if(this.schedCourses[i].name == courseName && this.schedCourses[i].enrolled){
                        this.selectedDroppedCourse = courseName
                        this.dropCoursePopup = true
                        return
                    }
                }
                for(let i = 0; i < this.schedCourses.length; i++){
                    if(this.schedCourses[i].name == courseName){
                        delete this.schedCourses[i].enrolled
                        break
                    }
                }

                const newSched = this.schedCourses.filter((item) => {
                    return item.name != courseName
                })
                this.schedCourses = newSched
    
                for(let i = 0; i < this.searchedCourses.length; i++){
                    if(this.searchedCourses[i].name == courseName){
                        this.searchedCourses[i].included = false;
                        this.searchedCourses[i].selected = 0;
                        break;
                    }
                }
            },
            removeCourse(coursename){
                if(this.courseInCart(coursename)){
                    this.removeCourseFromCart(coursename)
                }
                else if(this.courseInSched(coursename)){
                    this.removeCourseFromSched(coursename)
                }
            },
            addCourseFromRequirements(course){
                this.searchedCourses = []
                for(let i = 0; i < this.schedCourses.length; i++){
                    if(this.schedCourses[i].name == course){
                        return
                    }
                }
                for(let i = 0; i < this.cartCourses.length; i++){
                    if(this.cartCourses[i].name == course){
                        return
                    }
                }
                for(let i = 0; i < allCourses.length; i++){
                    if(allCourses[i].name == course){
                        allCourses[i].included = 'sched';
                        allCourses[i].selected = 0;
                        allCourses[i].selectedIndices = Array(allCourses[i].combinations.length).fill(true)
                        const newSched = [...this.schedCourses, allCourses[i]]
                        this.schedCourses = newSched
                        break;
                    }
                }
                this.academicRequirementsPopup = false
            },
            computeSchedules(){
           
                this.worker.onmessage = (e) => {
                    //console.log(e.data.schedules)
                    this.schedules = e.data.schedules
                    this.schedsLoading = false
        
                }
                this.worker.onerror = (e) => {
                    console.log(e)
                }
                const courses = JSON.parse(JSON.stringify(this.schedCourses));
                this.worker.postMessage({
                    courses: courses
                })
               
                this.schedsLoading = true
    
            },
            cartToSched(courseName){
                const index = this.cartCourses.findIndex((item) => {
                    return item.name == courseName
                })
                const course = this.cartCourses[index]
                course.included = 'sched';
                const newSched = [...this.schedCourses, course]
                this.schedCourses = newSched
                const newCart = this.cartCourses.filter((item) => {
                    return item.name != courseName
                })
                this.cartCourses = newCart
            },
            courseInSched(courseName){
                for(let i = 0; i < this.schedCourses.length; i++){
                    if(this.schedCourses[i].name == courseName){
                        return true;
                    }
                }
                return false;
            },
            courseInCart(courseName){
               for(let i = 0; i < this.cartCourses.length; i++){
                   if(this.cartCourses[i].name == courseName){
                       return true;
                   }
                }
                return false;
            },
            courseListToSched(){
                let sched = []
                for(let i = 0; i < this.schedCourses.length; i++){
                    const course = this.schedCourses[i]
                    const selected = course.combinations[course.selected]
                    const schedCourse = {
                        courseCode: course.name,
                        courseTitle : course.title,
                        Lecture : null,
                        Tutorial:null
                    }
                    const lecture = {
                            days : null,
                            start : null,
                            end : null,
                            roomno: null,
                            LectureNO : null
                    }
                    for(let j = 0; j < course.lectures.length; j++){
                        if(course.lectures[j].name === selected[0]){
                            lecture.days = course.lectures[j].days
                            lecture.start = course.lectures[j].start
                            lecture.end = course.lectures[j].end
                            lecture.roomno = course.lectures[j].roomno
                            lecture.LectureNO = course.lectures[j].name
                            break
                        }
                    }
                    schedCourse.Lecture = lecture
                    if(selected.length > 1){
                        const tutorial = {
                            days : null,
                            start : null,
                            end : null,
                            roomno: null,
                            TutorialNO : null
                        }
                        for(let j = 0; j < course.tutorials.length; j++){
                            if(course.tutorials[j].name === selected[1]){
                                tutorial.days = course.tutorials[j].days
                                tutorial.start = course.tutorials[j].start
                                tutorial.end = course.tutorials[j].end
                                tutorial.roomno = course.tutorials[j].roomno
                                tutorial.TutorialNO = course.tutorials[j].name
                                break
                            }
                        }
                        schedCourse.Tutorial = tutorial
                    }
                    sched.push(schedCourse)
                }
                return sched
            },
            resetSelectedToZero(){
                this.schedIndex = 0;
            },
            setSelectedToLast(){
                if(this.schedules.length > 0){
                    this.schedIndex = this.schedules.length - 1;
                }
            },
            incrementSchedIndex(){
                if(this.schedIndex < this.schedules.length - 1){
                    this.schedIndex = this.schedIndex + 1;
                }
            },
            decrementSchedIndex(){
                if(this.schedIndex > 0){
                    this.schedIndex = this.schedIndex - 1;
                }
            },
            computeColor(courseName){
                for(let i = 0; i < this.schedCourses.length; i++){
                    if(this.schedCourses[i].name === courseName){
                        return i
                    }
                }
                for(let i = 0; i < this.cartCourses.length; i++){
                    if(this.cartCourses[i].name === courseName){
                        return i + this.schedCourses.length
                    }
                }
                return this.schedCourses.length + this.cartCourses.length
            },
            addSection(courseName,sectionIndex){
                for(let i = 0; i < this.schedCourses.length; i++){
                    if(this.schedCourses[i].name === courseName){
                        const newSched = [...this.schedCourses]
                        newSched[i].selectedIndices[sectionIndex] = true
                        this.schedCourses = newSched
                        this.computeSchedules()
                        return
                    }
                }
                for(let i = 0; i < this.cartCourses.length; i++){
                    if(this.cartCourses[i].name === courseName){
                        this.cartCourses[i].selectedIndices[sectionIndex] = true
                        return
                    }
                }
            },
            removeSection(courseName, sectionIndex){
                for(let i = 0; i < this.schedCourses.length; i++){
                    if(this.schedCourses[i].name === courseName){
                        const newSched = [...this.schedCourses]
                        newSched[i].selectedIndices[sectionIndex] = false
                        this.schedCourses = newSched
                        this.computeSchedules()
                        return
                    }
                }
                for(let i = 0; i < this.cartCourses.length; i++){
                    if(this.cartCourses[i].name === courseName){
                        this.cartCourses[i].selectedIndices[sectionIndex] = false
                        return
                    }
                }
            },
            reselectall(courseName){
                console.log('reselecting all')
                for(let i = 0; i < this.schedCourses.length; i++){
                    if(this.schedCourses[i].name === courseName){
                        const newSched = [...this.schedCourses]
                        newSched[i].selectedIndices = Array(newSched[i].combinations.length).fill(true)
                        this.schedCourses = newSched
                        this.computeSchedules()
                        return
                    }
                }
                for(let i = 0; i < this.cartCourses.length; i++){
                    if(this.cartCourses[i].name === courseName){
                        this.cartCourses[i].selectedIndices = Array(this.cartCourses[i].combinations.length).fill(true)
                        return
                    } 
                }
            },
            updateset(courseName, newList){
                for(let i = 0; i < this.schedCourses.length; i++){
                    if(this.schedCourses[i].name === courseName){
                        const newSched = [...this.schedCourses]
                        newSched[i].selectedIndices = [...newList]
                        this.schedCourses = newSched
                        this.computeSchedules()

                        return
                    }
                }
                for(let i = 0; i < this.cartCourses.length; i++){
                    if(this.cartCourses[i].name === courseName){
                        this.cartCourses[i].selectedIndices = [...newList]
                        return
                    }
                }
            },
            dropCourse(){
                const serverPath = this.$store.state.serverPath
                const apiPath = '/api/schedule-builder/'
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization' : `Token ${this.$cookies.get("auth-token")}`
                }
                this.$http.delete(`${serverPath}${apiPath}${encodeURIComponent(this.selectedTerm.term_key)}/${encodeURIComponent(this.selectedDroppedCourse)}`, {headers: headers}).then(res => {
                    console.log("fucks" , res)

                    this.removeCourseFromSched(this.selectedDroppedCourse)
                    this.dropCoursePopup = false

                    this.selectedDroppedCourse = ''
                    console.log(this.dropCoursePopup , this.schedCourses)
                }).catch(err => {
                    console.log(err)
                })
            },
            applyAdvancedFilters(filters){
                this.advancedSearchOpen = false
                
                const courseDaysandTime = (course) =>{
                    const daytoIndex = {
                        'M': 0,
                        'T': 1,
                        'W': 2,
                        'R': 3,
                        'F': 4
                    }
                    for(let i = 0; i < course.combinations.length; i++){
                        const lectureInfo = createLecInfo(course, i)
                        if(lectureInfo.lecture.start > filters.startTime && lectureInfo.lecture.end < filters.endTime){
                            if(lectureInfo.lecture.days.every((day) => filters.days[daytoIndex[day]])){
                                if(lectureInfo.tutorial.end){
                                    if(lectureInfo.tutorial.start > filters.startTime && lectureInfo.tutorial.end < filters.endTime){
                                        if(lectureInfo.tutorial.days.every((day) => filters.days[daytoIndex[day]])){
                                            return true
                                        }
                                    }
                                }
                                else{
                                    return true
                                }
                            }
                        }
                    }
                    return false
                }
                const courseOnline = (course) =>{
                    return (course.lectures[0].roomno == 'online') === filters.isOnline
                }
                this.searchedCourses = allCourses.filter((course) => {
                    return courseCode(course, filters) && courseNumber(course, filters) && courseDaysandTime(course) && courseOnline(course)
                })
            },
            getSchedule(){
                this.enrollPopup = true
            },
            convertTerm(term){
                if(!term){
                    return ''
                }
                const conv = {
                    'Fal' : 'Fall ',
                    'Win' : 'Winter ',
                    'Spr' : 'Spring ',
                    'Sum' : 'Summer '
                }
                let first = ""
                first += term[0]
                first += term[1]

                first += term[2]
                let second = ''
                second += term[3]
                second += term[4]
                second += term[5]
                second += term[6]
                
                return conv[first] + second
                //return term
            }
              

        },
        computed:{
            
        },
        watch:{
            schedCourses:{
                handler(newList, oldList) {
                    
                    if (newList.length !== oldList.length) {
                        this.computeSchedules()
                        return
                    }
                },
                deep: true,
            },
            schedules:{
                handler(){
                    this.schedIndex = 0
                },
                deep: true
                
            },
            schedIndex:{
                handler(){
                    for(let i = 0; i < this.schedCourses.length; i++){
                        this.schedCourses[i].selected = this.schedules[this.schedIndex][i]
                    }
                }
            },
            selectedTerm:{
                handler(){
                    this.getTermInfo()
                },
                deep: true
            }


        }
    }
</script>

