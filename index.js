var stripe = require('stripe')('YOUR API KEY'),
    csv = require('csv'),
    fs = require('fs'),
    planparser = csv.parse({ delimiter: ',', from: 2 }),
    prodparser = csv.parse({ delimiter: ',', from: 2 }),
    prodoutput = [],
    planoutput = [];

var createPlan = function (plan) {
    let obj = {
        currency: plan[7],
        interval: plan[8],
        product: plan[1],
        nickname: plan[3],
        amount: plan[6],
        id: plan[0]
    }
    Object.keys(obj).forEach(key => {
        if (!obj[key]) delete obj[key];
    });
    const newplan = stripe.plans.create(obj);
}

var createProduct = function(prod){
    let obj = {
        id: prod[0],
        name: prod[1],
        type: prod[2],
        statement_descriptor: prod[5],
        unit_label: prod[6] ? prod[6] : null
    };
    Object.keys(obj).forEach(key => {
        if (!obj[key]) delete obj[key];
    })
    const product = stripe.products.create(obj);
}

var iterateCalled = 0;

var iteratePlans = function (plans, products) {
    iterateCalled++;
    if (iterateCalled == 2){
        // console.log(products[0]);
        // console.log(plans[0]);
        products.forEach(function (prod) {
            createProduct(prod);
        }, this);

        setTimeout(() => {
            plans.forEach(function (plan) {
                createPlan(plan);
            }, this);  
            console.log('done ');
        } , 5000);
    }
}

fs.readFile('./plans.csv', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    planparser.write(data);
    planparser.end();
});


planparser.on('readable', function () {
    while (record = planparser.read()) {
        planoutput.push(record);
    }
});

// Catch any error
planparser.on('error', function (err) {
    console.log('plan', err.message);
});
// When we are done, test that the parsed output matched what expected
planparser.on('finish', function (data) {
    console.log('finish plan')
    iteratePlans(planoutput, prodoutput);
});


fs.readFile('./products.csv', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    prodparser.write(data);
    prodparser.end();
});



prodparser.on('readable', function () {
    while (rec = prodparser.read()) {
        prodoutput.push(rec);
    }
});

// Catch any error
prodparser.on('error', function (err) {
    console.log('prod',err.message);
});
// When we are done, test that the parsed output matched what expected
prodparser.on('finish', function (data) {
    console.log('finish prod')
    iteratePlans(planoutput, prodoutput);
});
