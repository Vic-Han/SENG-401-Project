<template>
    <div class="academic-report bg-grey-100 shadow-inner p-4 ">
      <div class="flex flex-row">
        <div class="program-information bg-white shadow-md rounded-lg p-6 mb-4 bg-white-100 w-2/5 text-start">
          <h1 class="text-xl font-semibold mb-4">Program Information</h1>
          <p><strong>Degree Stream:</strong> {{ programInfo.degree }}</p>
          <p><strong>Major:</strong> {{ programInfo.major }}</p>
          <p><strong>Minor:</strong> {{ programInfo.minor }}</p>
          <p><strong>Concentration:</strong> {{ programInfo.concentrartion }}</p>
          <p><strong>Year of Program:</strong> {{ programInfo.Year }}</p>
          <p><strong>Academic Load:</strong> {{ programInfo.academicLoad }}</p>
        </div>
        <div class="bg-white-100 rounded-lg shadow-md px-6 mb-4 ml-4 w-3/5">
          <div class="text-left font-semibold text-xl pt-6">Degree Progress</div>
          <div class="w-full h-10 bg-grey-100 shadow-xl mt-10 rounded-lg">
            <div class="relative h-10 bg-green-100 mt-10 rounded-lg" :style="{ width: percentage + '%' }">
              <div v-if="percentage > 10" class="pt-1 text-2xl text-white-100 font-semibold">{{ percentage }}%</div>
            </div>
          </div>
          <div class="flex flex-row mt-2">
            <div class="w-1/3 text-lg font-semibold text-left">0%</div>
            <div class="w-1/3 text-lg font-semibold">50%</div>
            <div class="w-1/3 text-lg font-semibold text-right">100%</div>
          </div>
        </div>
      </div>
      <div class="h-144 w-full bg-white-100 rounded-xl shadow-xl pt-6 pl-6 pb-4 pr-1">
        <div class="font-semibold text-2xl text-left">Course Breakdown</div>
        <div class="overflow-y-auto max-h-112 pt-5 pr-5">
          <div v-for="(Requirement,index) in requiredCourses" :key="index">
            <div class="px-1 py-1">
              <div class="flex flex-row items-center">
                <div class="text-left font-semibold text-l min-w-fit">{{ Requirement.description }}:</div>
                <div class="w-fit" @click="Requirement.expanded = !Requirement.expanded">
                  <div v-if="Requirement.expanded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 fill-black-100"  viewBox="0 -960 960 960">
                      <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>
                    </svg>
                  </div>
                  <div v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 fill-black-100 -rotate-90"  viewBox="0 -960 960 960">
                      <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>
                    </svg>
                  </div>
                </div>
                <div class="flex flex-col w-full">
                  <div></div>
                  <div class="border border-grey-200"></div>
                </div>
                <div v-if="Requirement.status =='complete'" class="flex flex-row items-center pl-6 w-fit">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-green-100" viewBox="0 -960 960 960">
                      <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z"/>
                    </svg>
                  </div>
                  <div class="pl-2 text-sm italic text-green-100">Complete</div>
                </div>
              </div>
              <div v-if="Requirement.expanded == true">
                <div>
                  <div class="grid grid-cols-5 gap-4 py-2">
                    <div v-for="(course, i) in Requirement.courses" :key="i">
                      <div class="relative z-10" @mouseenter="course.hovered = true" @mouseleave="course.hovered = false">
                          <div :class="{
                          'bg-green-100 text-white-100': course.status === 'complete',
                          'bg-yellow-100 text-grey-200': course.status === 'in-progress',
                          'bg-white-100 border border-grey-100 text-grey-200': course.status === 'incomplete',
                          'p-2': true,
                          'rounded-lg': true,
                          'shadow': true,
                          'text-center': true
                          }" class="hover:-translate-y-1 transition-transform duration-300">
                            {{ course.name }}
                          </div>
                          <div v-if="course.hovered" class="tooltip absolute bottom-full mb-2 -translate-x-1/2 left-1/2 text-black p-2 border border-gray-500 bg-white-100 rounded shadow-lg whitespace-nowrap max-w-screen overflow-x-auto z-10">
                              <div class="text-left"><strong>Status:</strong> {{ course.status }}</div>
                              <div class="text-left"><strong>Units:</strong> {{ course.units }}</div>
                              <div v-if="course.status == 'complete'" class="text-left"><strong>Grade:</strong> {{ course.grade+ '%'}}</div>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
<script>
// function filterSemester(course, predicate) {
//         return course.semester == predicate
// }
  export default {
    name: 'AcademicReport',
    emits: ['show-navbar', 'set-title'],
    data: ()=> {
      return {

        expandedReport: false,
        percentage: 0,
        completedProgress: 0,
        pendingProgress:0,
        programInfo: {
          degree: "Bachelor of Science",
          major: "Software Engineering Internship Designation",
          minor: "None",
          concentrartion: 'None',
          Year: 6,
          academicLoad: "Full-Time"
        },
        requiredCourses:
        [
          
        ]
      }
    },
    methods: {
        getWidth() {
          return "w-[" + this.completedProgress + "%]"
        },
        toggleExpandedReport() {
            this.expandedReport = !this.expandedReport;
        },
        fetchData(){
            const serverPath = this.$store.state.serverPath
            const apiPath = '/api/course-requirements/'
            const headers = {
              'Content-Type': 'application/json',
              'Authorization': `Token ${this.$cookies.get("auth-token")}`
            };
            this.$http.get(`${serverPath}${apiPath}`, { headers}).then(res=>{
              console.log(res.data)
              const backendData = res.data
              let totalUnits = 0
              let takenUnits = 0
              let pendingUnits = 0
              //For each requirement
              for(let i = 0; i < backendData.requirements.length; i++) {
                totalUnits += backendData.requirements[i].requiredUnits
                const requiredCourseNos = backendData.requirements[i].requiredUnits / 3
                //if complete
                if(backendData.requirements[i].status == 'complete') {
                  this.requiredCourses.push({
                  description: backendData.requirements[i].description,
                  requiredUnits: backendData.requirements[i].requiredUnits,
                  status: backendData.requirements[i].status,
                  expanded: false,
                  courses: []
                })
                //else
                } else {
                  this.requiredCourses.push({
                  description: backendData.requirements[i].description,
                  requiredUnits: backendData.requirements[i].requiredUnits,
                  status: backendData.requirements[i].status,
                  expanded: true,
                  courses: []
                })
                }
                //for each course in requirement
                for(let j = 0; j < requiredCourseNos; j++) {
                  //if complete
                  if(backendData.requirements[i].courses[j].status == 'complete') {
                    takenUnits += backendData.requirements[i].courses[j].units
                    this.requiredCourses[i].courses.push(backendData.requirements[i].courses[j])
                  }
                  //else if in progress
                  else if(backendData.requirements[i].courses[j].status == 'in-progress') {
                    pendingUnits += backendData.requirements[i].courses[j].units
                    this.requiredCourses[i].courses.push(backendData.requirements[i].courses[j])
                  }
                  //if requirement courses optional
                  else if(backendData.requirements[i].optional) {
                    this.requiredCourses[i].courses.push({
                      name: "Option",
                      units: 3,
                      status: "incomplete",
                      grade: null
                    })
                    //else
                  } else {
                    this.requiredCourses[i].courses.push(backendData.requirements[i].courses[j])
                  }
                }
              }
              this.completedProgress = Math.round((takenUnits/totalUnits)*100)
              this.pendingProgress = Math.round((pendingUnits/totalUnits)*100)
            }).catch(err=>{
                      console.log(err)
            })
        },
        // toggleReportDetails(index) {
        //     const program = this.academicReport.programs[index];
        //     // Ensure program exists and has courseCategory defined
        //     if (program && Array.isArray(program.courseCategory)) {
        //     program.isExpanded = !program.isExpanded;
        //     if (!program.isExpanded) {
        //         // Store full course list if not done already
        //         if (!program.fullCourseList) {
        //         program.fullCourseList = program.courseCategory.map(category => ({
        //             ...category, 
        //             courseField: category.courseField.map(field => ({ ...field }))
        //         }));
        //         }
        //         // Filter out completed and inProgress courses
        //         program.courseCategory.forEach(category => {
        //         category.courseField.forEach(field => {
        //             field.courses = field.courses.filter(course => course.status === 'incomplete');
        //         });
        //         });
        //     } else {
        //         // Restore the full course list if it has been stored
        //         if (program.fullCourseList) {
        //         program.courseCategory = program.fullCourseList.map(category => ({
        //             ...category, 
        //             courseField: category.courseField.map(field => ({ ...field }))
        //         }));
        //         }
        //     }
        //     } else {
        //     console.error('Program or courseCategory is undefined.');
        //     }
        // },
        // toggleAllReports() {
        //     this.areAllReportsExpanded = !this.areAllReportsExpanded;
        //     this.academicReport.programs.forEach((program, index) => {
        //     // Toggle the expanded state for each program
        //     this.toggleReportDetails(index);
        //     });

        // }
        incrementPCT() {
          this.percentage++
        },
    },
    watch: {
      completedProgress: {
        handler() {
          this.percentage = 0
          for(let i = 0; i < this.completedProgress; i++) {
            setTimeout(this.incrementPCT, 10*i)
          }
        }
      }
    },
    created() {
      this.$emit('show-navbar')
      this.$emit('toggle-selected','academics')

      
      this.fetchData()
      // const backendData = {
      //   "requirements":
      //   [
            //{
            //     "description": "Required Courses",
            //     "requiredUnits": 96,
            //     "status": "in-progress",
            //     "courses":
            //     [
            //         {
            //             "name": "CHEM209",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "F1",
            //             "grade": "C",
            //             "hovered": false
            //         },
            //         {
            //             "name": "ENGG233",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "F1",
            //             "grade": "A",
            //             "hovered": false
            //         },
            //         {
            //             "name": "MATH275",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "F1",
            //             "grade": "B",
            //             "hovered": false
            //         },
            //         {
            //             "name": "MATH211",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "F1",
            //             "grade": "D",
            //             "hovered": false
            //         },
            //         {
            //             "name": "ENGG225",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "F1",
            //             "grade": "C",
            //             "hovered": false
            //         },
            //         {
            //             "name": "ENGG201",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "W1",
            //             "grade": "A",
            //             "hovered": false
            //         },
            //         {
            //             "name": "ENGG202",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "W1",
            //             "grade": "B",
            //             "hovered": false
            //         },
            //         {
            //             "name": "MATH277",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "W1",
            //             "grade": "D",
            //             "hovered": false
            //         },
            //         {
            //             "name": "PHYS259",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "W1",
            //             "grade": "C",
            //             "hovered": false
            //         },
            //         {
            //             "name": "ENGG200",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "W1",
            //             "grade": "B",
            //             "hovered": false
            //         },
            //         {
            //             "name": "ENGG319",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "F2",
            //             "grade": "A",
            //             "hovered": false
            //         },
            //         {
            //             "name": "PHYS365",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "F2",
            //             "grade": "D",
            //             "hovered": false
            //         },
            //         {
            //             "name": "MATH375",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "F2",
            //             "grade": null,
            //             "hovered": false
            //         },
            //         {
            //             "name": "ENSF337",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "F2",
            //             "grade": "C",
            //             "hovered": false
            //         },
            //         {
            //             "name": "ENEL353",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "F2",
            //             "grade": "B",
            //             "hovered": false
            //         },
            //         {
            //             "name": "MATH271",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "W2",
            //             "grade": "A",
            //             "hovered": false
            //         },
            //         {
            //             "name": "ENEL327",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "W2",
            //             "grade": "C",
            //             "hovered": false
            //         },
            //         {
            //             "name": "ENSF409",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "W2",
            //             "grade": "B",
            //             "hovered": false
            //         },
            //         {
            //             "name": "ENCM369",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "W2",
            //             "grade": null,
            //             "hovered": false
            //         },
            //         {
            //             "name": "CPSC319",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "W2",
            //             "grade": "D",
            //             "hovered": false
            //         },
            //         {
            //             "name": "ENSF480",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "F3",
            //             "grade": "C",
            //             "hovered": false
            //         },
            //         {
            //             "name": "ENCM511",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "F3",
            //             "grade": "B",
            //             "hovered": false
            //         },
            //         {
            //             "name": "CPSC457",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "F3",
            //             "grade": "A",
            //             "hovered": false
            //         },
            //         {
            //             "name": "SENG401",
            //             "units": 3,
            //             "status": "in-progress",
            //             "semester": "W3",
            //             "grade": null,
            //             "hovered": false
            //         },
            //         {
            //             "name": "SENG438",
            //             "units": 3,
            //             "status": "in-progress",
            //             "semester": "W3",
            //             "grade": null,
            //             "hovered": false
            //         },
            //         {
            //             "name": "SENG471",
            //             "units": 3,
            //             "status": "in-progress",
            //             "semester": "W3",
            //             "grade": null,
            //             "hovered": false
            //         },
            //         {
            //             "name": "CPSC441",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "W3",
            //             "grade": "B",
            //             "hovered": false
            //         },
            //         {
            //             "name": "CPSC471",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "W3",
            //             "grade": "A",
            //             "hovered": false
            //         },
            //         {
            //             "name": "ENEL500A",
            //             "units": 3,
            //             "status": "incomplete",
            //             "semester": "F4",
            //             "grade": null,
            //             "hovered": false
            //         },
            //         {
            //             "name": "SENG511",
            //             "units": 3,
            //             "status": "complete",
            //             "semester": "F4",
            //             "grade": "A",
            //             "hovered": false
            //         },
            //         {
            //             "name": "ENEL500B",
            //             "units": 3,
            //             "status": "incomplete",
            //             "semester": "W4",
            //             "grade": null,
            //             "hovered": false
            //         },
            //         {
            //             "name": "SENG533",
            //             "units": 3,
            //             "status": "in-progress",
            //             "semester": "W4",
            //             "grade": null,
            //             "hovered": false
            //         }
            //     ]
            // },
      //       {
      //           "description": "Technical Electives",
      //           "requiredUnits": 15,
      //           "remainingUnits": 12,
      //           "status": "in-progress",
      //           "optional": false,
      //           "courses": [
      //               {
      //                   "name": "SENG550",
      //                   "units": 3,
      //                   "status": "complete",
      //                   "grade": "B",
      //                   "hovered": false
      //               },
      //               {
      //                   "name": "SENG567",
      //                   "units": 3,
      //                   "status": "incomplete",
      //                   "grade": null,
      //                   "hovered": false
      //               },
      //               {
      //                   "name": "SENG512",
      //                   "units": 3,
      //                   "status": "incomplete",
      //                   "grade": null,
      //                   "hovered": false
      //               },
      //               {
      //                   "name": "SENG570",
      //                   "units": 3,
      //                   "status": "incomplete",
      //                   "grade": null,
      //                   "hovered": false
      //               },
      //               {
      //                   "name": "SENG580",
      //                   "units": 3,
      //                   "status": "incomplete",
      //                   "grade": null,
      //                   "hovered": false
      //               }
      //           ]
      //       },
      //       {
      //           "description": "Complementary Studies",
      //           "requiredUnits": 18,
      //           "remainingUnits": 3,
      //           "optional": true,
      //           "status": "in-progress",
      //           "courses": [
      //               {
      //                   "name": "ECON201",
      //                   "units": 3,
      //                   "status": "complete",
      //                   "grade": "B",
      //                   "hovered": false
      //               },
      //               {
      //                   "name": "ECON203",
      //                   "units": 3,
      //                   "status": "complete",
      //                   "grade": "C",
      //                   "hovered": false
      //               },
      //               {
      //                   "name": "ENGG209",
      //                   "units": 3,
      //                   "status": "complete",
      //                   "grade": "A",
      //                   "hovered": false
      //               },
      //               {
      //                   "name": "COMS363",
      //                   "units": 3,
      //                   "status": "complete",
      //                   "grade": "A",
      //                   "hovered": false
      //               },
      //               {
      //                   "name": "ENGG481",
      //                   "units": 3,
      //                   "status": "complete",
      //                   "grade": "D",
      //                   "hovered": false
      //               },
      //               {
      //                   "name": "ENGG513",
      //                   "units": 3,
      //                   "status": "incomplete",
      //                   "grade": null,
      //                   "hovered": false
      //               }
      //           ]
      //       },
      //       {
      //           "description": "Internship Designation",
      //           "requiredUnits": 9,
      //           "remainingUnits":0,
      //           "status": "complete",
      //           "optional": false,
      //           "courses":
      //           [
      //               {
      //                   "name": "INTE513.1",
      //                   "units": 3,
      //                   "status": "complete",
      //                   "grade": "Pass",
      //                   "hovered": false
      //               },
      //               {
      //                   "name": "INTE513.2",
      //                   "units": 3,
      //                   "status": "complete",
      //                   "grade": "Pass",
      //                   "hovered": false
      //               },
      //               {
      //                   "name": "INTE513.3",
      //                   "units": 3,
      //                   "status": "complete",
      //                   "grade": "Pass",
      //                   "hovered": false
      //               }
      //           ]
      //       }
      //   ]
      // } 
      // let totalUnits = 0
      // let takenUnits = 0
      // let pendingUnits = 0
      // //For each requirement
      // for(let i = 0; i < backendData.requirements.length; i++) {
      //   totalUnits += backendData.requirements[i].requiredUnits
      //   const requiredCourseNos = backendData.requirements[i].requiredUnits / 3
      //   //if complete
      //   if(backendData.requirements[i].status == 'complete') {
      //     this.requiredCourses.push({
      //     description: backendData.requirements[i].description,
      //     requiredUnits: backendData.requirements[i].requiredUnits,
      //     status: backendData.requirements[i].status,
      //     expanded: false,
      //     courses: []
      //   })
      //   //else
      //   } else {
      //     this.requiredCourses.push({
      //     description: backendData.requirements[i].description,
      //     requiredUnits: backendData.requirements[i].requiredUnits,
      //     status: backendData.requirements[i].status,
      //     expanded: true,
      //     courses: []
      //   })
      //   }
      //   //for each course in requirement
      //   for(let j = 0; j < requiredCourseNos; j++) {
      //     //if complete
      //     if(backendData.requirements[i].courses[j].status == 'complete') {
      //       takenUnits += backendData.requirements[i].courses[j].units
      //       this.requiredCourses[i].courses.push(backendData.requirements[i].courses[j])
      //     }
      //     //else if in progress
      //     else if(backendData.requirements[i].courses[j].status == 'in-progress') {
      //       pendingUnits += backendData.requirements[i].courses[j].units
      //       this.requiredCourses[i].courses.push(backendData.requirements[i].courses[j])
      //     }
      //     //if requirement courses optional
      //     else if(backendData.requirements[i].optional) {
      //       this.requiredCourses[i].courses.push({
      //         name: "Option",
      //         units: 3,
      //         status: "incomplete",
      //         grade: null
      //       })
      //       //else
      //     } else {
      //       this.requiredCourses[i].courses.push(backendData.requirements[i].courses[j])
      //     }
      //   }
      // }
      // this.completedProgress = Math.round((takenUnits/totalUnits)*100)
      // this.pendingProgress = Math.round((pendingUnits/totalUnits)*100)
      // // Preset data should not be modified here, it should be set in data() or computed
    }
  }
</script>
    