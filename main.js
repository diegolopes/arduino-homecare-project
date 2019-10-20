$(document).ready(function () {

    //Estética da página
    $('body').css({"fontFamily":"Source Code Pro"});

    //Variáveis onde serão armazenados os valores do gráfico
    let data = [];
    let currentData;

    // Div onde irei 'printar' os responses do server
    const div = $('#response');

    function requestData() {
        $.post({
            url: 'http://169.254.125.171',
            beforeSend: function () {
                div.html('Temperatura: Atualizando...')
            }
        }).done(function (response) {
            div.html('Temperatura: ' + response.temperature)
            console.log(response);
            data.push(response.temperature); // Array das temperaturas
            currentData = response.temperature // Array das temperaturas
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