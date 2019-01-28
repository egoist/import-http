import template from 'https://unpkg.com/lodash/template'

console.log(template(`Hello <%= name %>`)({name: 'EGOIST'}))
