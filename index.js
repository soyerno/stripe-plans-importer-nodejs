var stripe = require('stripe')('YOUR API KEY'),
    csv = require('csv'),
    fs = require('fs'),
    parser = csv.parse({ delimiter: ',', from: 2 }),
    output = [];

var createPlan = function (plan) {
    stripe.plans.create({
        id: plan[0],
        name: plan[1],
        interval: plan[3],
        amount: plan[4],
        currency: plan[5]
    }, function (err, plan) {
        // asynchronously called
        if (err) {
            return console.log(err);
        }
        console.log('Plan ' + plan.id + ' was created');
    });
}

var iteratePlans = function (plans) {
    plans.forEach(function (plans) {
        createPlan(plans);
    }, this);
}

fs.readFile('./plans.csv', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    parser.write(data);
    parser.end();
});


parser.on('readable', function () {
    while (record = parser.read()) {
        output.push(record);
    }
});

// Catch any error
parser.on('error', function (err) {
    console.log(err.message);
});
// When we are done, test that the parsed output matched what expected
parser.on('finish', function (data) {
    console.log('finish')
    iteratePlans(output);
});

