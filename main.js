$(document).ready(function () {

    let data = [];
    let currentData;

    $('#btn').click(function () {

        $.post({
            url: 'http://169.254.125.171',
            beforeSend: function () {
                $('#response').html('Tentando fazer requisição...')
            }
        }).done(function (response) {
            $('#response').html(response.number)
            console.log(response);
        })

    });


    function requestData() {
        $.post({
            url: 'http://169.254.45.198',
            beforeSend: function () {
                $('#response').html('Tentando fazer requisição...')
            }
        }).done(function (response) {
            $('#response').html(response.number)
            //console.log(response);
            data.push(response.number);
            currentData = response.number
            console.log(currentData);
        })
    }

    setInterval(requestData, 500);



    // Gráficos com plotty
    var arrayLength = 20
    var newArray = []

    for (var i = 0; i < arrayLength; i++) {
        var y = data[i]
        newArray[i] = y
    }

    Plotly.plot('graph', [{
        y: newArray,
        mode: 'lines',
        line: {
            color: 'red'
        }
    }]);

    var cnt = 0;

    var interval = setInterval(function () {

        var y = currentData ;
        newArray = newArray.concat(y)
        newArray.splice(0, 1)

        var data_update = {
            y: [newArray]
        };

        Plotly.update('graph', data_update)

        if (cnt === 100) clearInterval(interval);
    }, 500);



})