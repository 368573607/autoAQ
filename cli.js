#!/usr/bin/node
const autoAQ = require("./index")

const [a, b, name, pass, from] = process.argv

autoAQ({
    name,
    pass,
    from
}, false, 3000)
