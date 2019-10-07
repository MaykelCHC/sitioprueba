/**
 Template Name: Minton Dashboard
 Author: CoderThemes
 Email: coderthemes@gmail.com
 File: Chartjs
 */


!function($) {
    "use strict";

    var ChartJs = function() {};

    ChartJs.prototype.respChart = function(selector,type,data, options) {
        // get selector by context
        var ctx = selector.get(0).getContext("2d");
        // pointing parent container to make chart js inherit its width
        var container = $(selector).parent();

        // enable resizing matter
        $(window).resize( generateChart );

        // this function produce the responsive Chart JS
        function generateChart(){
            // make chart width fit with its container
            var ww = selector.attr('width', $(container).width() );
            switch(type){
                case 'Line':
                    new Chart(ctx, {type: 'line', data: data, options: options});
                    break;
                case 'Doughnut':
                    new Chart(ctx, {type: 'doughnut', data: data, options: options});
                    break;
                case 'Pie':
                    new Chart(ctx, {type: 'pie', data: data, options: options});
                    break;
                case 'Bar':
                    new Chart(ctx, {type: 'bar', data: data, options: options});
                    break;
                case 'Radar':
                    new Chart(ctx, {type: 'radar', data: data, options: options});
                    break;
                case 'PolarArea':
                    new Chart(ctx, {data: data, type: 'polarArea', options: options});
                    break;
            }
            // Initiate new chart or Redraw

        };
        // run function - render chart at first load
        generateChart();
    },
        //init
        ChartJs.prototype.init = function() {
            //creating lineChart
            var lineChart = {
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September"],
                datasets: [
                    {
                        label: "Sales Analytics",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "#7266ba",
                        borderColor: "#7266ba",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "#7266ba",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "#7266ba",
                        pointHoverBorderColor: "#eef0f2",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [65, 59, 80, 81, 56, 55, 40, 35, 30]
                    }
                ]
            };

            var lineOpts = {
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 100,
                            min: 20,
                            stepSize: 10
                        }
                    }]
                }
            };

            this.respChart($("#lineChart"),'Line',lineChart, lineOpts);

            //donut chart
            var donutChart = {
                labels: [
                    "Desktops",
                    "Tablets",
                    "Mobiles"
                ],
                datasets: [
                    {
                        data: [300, 50, 100],
                        backgroundColor: [
                            "#7266ba",
                            "#f76397",
                            "#00b19d"
                        ],
                        hoverBackgroundColor: [
                            "#7266ba",
                            "#f76397",
                            "#00b19d"
                        ],
                        hoverBorderColor: "#fff"
                    }]
            };
            this.respChart($("#doughnut"),'Doughnut',donutChart);


            //Pie chart
            var pieChart = {
                labels: [
                    "Desktops",
                    "Tablets",
                    "Mobiles"
                ],
                datasets: [
                    {
                        data: [300, 50, 100],
                        backgroundColor: [
                            "#7266ba",
                            "#00b19d",
                            "#f76397"
                        ],
                        hoverBackgroundColor: [
                            "#7266ba",
                            "#00b19d",
                            "#f76397"
                        ],
                        hoverBorderColor: "#fff"
                    }]
            };
            this.respChart($("#pie"),'Pie',pieChart);


            //barchart
            var barChart = {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "Sales Analytics",
                        backgroundColor: "rgba(114, 102, 186, 0.3)",
                        borderColor: "#7266ba",
                        borderWidth: 1,
                        hoverBackgroundColor: "rgba(114, 102, 186,0.6)",
                        hoverBorderColor: "#188ae2",
                        data: [65, 59, 80, 81, 56, 55, 40,20]
                    }
                ]
            };
            this.respChart($("#bar"),'Bar',barChart);


            //radar chart
            var radarChart = {
                labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
                datasets: [
                    {
                        label: "Desktops",
                        backgroundColor: "rgba(179,181,198,0.2)",
                        borderColor: "rgba(179,181,198,1)",
                        pointBackgroundColor: "rgba(179,181,198,1)",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(179,181,198,1)",
                        data: [65, 59, 90, 81, 56, 55, 40]
                    },
                    {
                        label: "Tablets",
                        backgroundColor: "rgba(114, 102, 186,0.2)",
                        borderColor: "rgba(114, 102, 186,1)",
                        pointBackgroundColor: "rgba(114, 102, 186,1)",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(114, 102, 186,1)",
                        data: [28, 48, 40, 19, 96, 27, 100]
                    }
                ]
            };
            this.respChart($("#radar"),'Radar',radarChart);

            //Polar area chart
            var polarChart = {
                datasets: [{
                    data: [
                        11,
                        16,
                        7,
                        3,
                        14
                    ],
                    backgroundColor: [
                        "#7266ba",
                        "#ffaa00",
                        "#f76397",
                        "#E7E9ED",
                        "#00b19d"
                    ],
                    label: 'My dataset', // for legend
                    hoverBorderColor: "#fff"
                }],
                labels: [
                    "Series 1",
                    "Series 2",
                    "Series 3",
                    "Series 4",
                    "Series 5"
                ]
            };
            this.respChart($("#polarArea"),'PolarArea',polarChart);
        },
        $.ChartJs = new ChartJs, $.ChartJs.Constructor = ChartJs

}(window.jQuery),

//initializing
    function($) {
        "use strict";
        $.ChartJs.init()
    }(window.jQuery);