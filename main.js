$(document).ready(function () {

    //Estética
    $('body').css({"fontFamily":"Source Code Pro"});

    //Variáveis onde serão armazenados os valores do gráfico
    let data = [];
    let currentData;

    $('#btn').click(function () {

        $.post({
            url: 'http://169.254.125.171', // ip do server do arduino
            beforeSend: function () {
                $('#response').html('Conectando ao arduino...')
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

    //Comunicação com o servidor do arquino a cada X milisegundos
    setInterval(requestData, 500);



    /*  Gráficos usando a biblioteca:  Plotly.js
        Código retirado da documentação: https://plot.ly/javascript/streaming/ */

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