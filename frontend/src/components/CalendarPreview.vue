<template>
  <div class="bg-white rounded-lg px-4 py-4">
    <h2 class="font-bold text-3xl mb-10 text-left">Important Dates</h2>
    <!-- Add color codes -->
    <ul class="space-y-2 overflow-y-auto max-h-96 pr-2">
    <li v-for="date in importantDates" :key="date.id" class="flex items-center bg-gray-100 border border-gray-200 rounded-lg py-2 shadow-lg relative">
        <span class="absolute left-0 top-0 bottom-0 w-2 bg-red-500 rounded-l-lg"></span>
        <div class="ml-4 flex flex-col justify-center">
        <p class="text-3xl font-bold text-gray-700">{{ date.month }}</p>
        <p class="text-3xl font-bold text-gray-800">{{ date.day }}</p>
        </div>
        <div class="mx-12">
        <p class="font-semibold text-gray-500 text-left mx-2">{{ date.event }}</p>
        </div>
    </li>
    </ul>
  </div>
</template>

<script>
export default {
name: 'CalendarPreview',
data() {
    return {
    importantDates: [
        { id: 8, month: 'APR', day: '10', event: 'Last day of classes' },
        { id: 9, month: 'APR', day: '15', event: 'Start of Final Exams' },
        { id: 10, month: 'APR', day: '30', event: 'End of Final Exams' }
    ]
    };
},
}
</script>
  