const { count } = require('console');
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    
    function get_maxHolderAndValue(obj) { 
        let n = Object.keys(obj).length;
        let max = 0;
        let max_holder = '';
        for (const key in obj) {
            if (obj[key]>max) {
                max = max=obj[key];
                max_holder = key;
            }
        }
        return {holder:max_holder,value:max};
    }
    
    try {
        const fs = require('fs');
        const fileContents = fs.readFileSync('mydata.json', 'utf8');
        var view = "<h1 style='text-align:center;'>My Results</h1><div style='width:20%;margin:auto;margin-top:50px;'>";
        const data = JSON.parse(fileContents);
        let results = { 
            manufacturer_sums:{},
            model_sums:{}, 
            best_selling_manufacturer: {}, 
            average_sales: 0, 
            trendy_color: ''
        };
        sum = 0;
        model_count = 0;
        colors = {};
        for (const obj of data) {
            (!results.manufacturer_sums.hasOwnProperty(obj.manufacturer))? results.manufacturer_sums[obj.manufacturer] = 0: -1;
            (!results.model_sums.hasOwnProperty(obj.model))? results.model_sums[obj.model] = 0: -1;
            (!colors.hasOwnProperty(obj.colour))? colors[obj.colour] = 0: -1;
            colors[obj.colour]++;
            for (const salesHistory of obj.salesHistory) {
                let val = parseInt(salesHistory.vehiclesSold);
                results.model_sums[obj.model] += val;
                results.manufacturer_sums[obj.manufacturer] += val;
                sum += val;
            }
            model_count++;
        }
        results.average_sales = Math.round(sum/model_count);
        results.best_selling_manufacturer = get_maxHolderAndValue(results.manufacturer_sums);
        results.trendy_color = get_maxHolderAndValue(colors).holder;

        view += "<h4>Model Sales</h4><ul>";
        for (const model in results.model_sums) {
            view += "<li>" + model + " - " + results.model_sums[model] + "</li>";
        }
        view += "</ul> <h4>Best Selling Manufacturer</h4> <ul><li>" + results.best_selling_manufacturer.holder + " - " + results.best_selling_manufacturer.value + "</li></ul>";
        view += "</ul> <h4>Average Model Sales</h4> <ul><li>" + results.average_sales + "</li></ul>";
        view += "</ul> <h4>Trendy Color</h4> <ul><li>" + results.trendy_color + "</li></ul>";
        console.log(results);
        console.log(colors);
    } catch(err) {
        console.error(err);
    }
    
    view += "</div>";
    res.end(view);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});