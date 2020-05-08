import template from 'https://unpkg.com/lodash-es/template'

console.log(template(`Hello <%= name %>`)({name: 'EGOIST'}))
