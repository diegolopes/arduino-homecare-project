$(document).ready(function () {

    //Estética da página
    $('body').css({
        "fontFamily":"Verdana",
        "textAlign": "center",
        "backgroundColor": "black",
        "color": "white",
        "overflow": "hidden"
    });

    // Esconder alerta inicial
    $('#alertaFebre').hide();
    $('#alertaBpm').hide();

    //Variáveis onde serão armazenados os valores do gráfico de temperatura
    let data = [];
    let currentData;

    //Variáveis onde serão armazenados os valores do gráfico de BPM
    let data_bpm = [];
    let currentData_bpm;

    // Div onde irei 'printar' os responses do server
    const div = $('#response');
    const divBpm = $('.response-bpm');

    function requestData() {
        $.post({
            url: 'http://127.0.0.1:80/fake-data.php',
            beforeSend: function () {
                div.html('...')
            }
        }).done(function (response) {
            div.html(response.temperature)
            divBpm.html(response.bpm)

            // Calcular média das BPMs:
            var total = 0;
            for(var i = 0; i < newArray.length; i++) {
                total += newArray[i];
            }
            var mediaTmp = total / newArray.length;
            $('.mediaTemp').html(mediaTmp);
            console.log(mediaTmp >= 36 && !isNaN(mediaTmp) )
            console.log(mediaTmp < 36 && !isNaN(mediaTmp) )

            console.log(response);
            data.push(response.temperature); // Array das temperaturas
            currentData = response.temperature // Array das temperaturas
            

            data_bpm.push(response.bpm); // Array das BPM
            currentData_bpm = response.bpm // Array das BPM

            // Alertas de BPM
            if(response.bpm > 300){
                $('#alertaBpm').show();
            }
            else if (response.bpm < 300) {
                $('#alertaBpm').hide();
            }

            // Alertas de temperatura
            if(mediaTmp >= 38 && !isNaN(mediaTmp)){
                $('#alertaFebre').show();
            }
            else if(mediaTmp < 38){
                $('#alertaFebre').hide();
            }

            // Alertas de BPM
            if(response.bpm >= 100){
                $('.alertaBpm').show();
            }

            else if(response.bpm < 100){
                $('.alertaBpm').hide();
            }


        })
    }

    //Comunicação com o servidor do arquino a cada X milisegundos
    setInterval(requestData, 500);


    /*  Gráficos usando a biblioteca:  Plotly.js
        Código retirado da documentação: https://plot.ly/javascript/streaming/
        Animação: https://bl.ocks.org/velickym/d19f76572243c774557f/    
    */


    
    //Gráfico temperatura
    var arrayLength = 20
    var newArray = []

    for (var i = 0; i < arrayLength; i++) {
        var y = data[i]
        newArray[i] = y
    }
    var layout = {
        plot_bgcolor: 'black',
        paper_bgcolor:'black'

    }

    Plotly.plot('graph', [{
        y: newArray,
        mode: 'lines',
        responsive: true,
        line: {
            color: 'red'
        }
    }],layout);




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


   //Gráfico BPM
   var arrayLength_bpm = 20
   var newArray_bpm = []

   for (var i = 0; i < arrayLength_bpm; i++) {
       var y = data_bpm[i]
       newArray_bpm[i] = y
   }

   Plotly.plot('graph-bpm', [{
       y: newArray_bpm,
       mode: 'lines',
       responsive: true,
       line: {
           color: 'red'
       }, 
   }],layout);

   var cnt = 0;

   var interval = setInterval(function () {

       var y = currentData_bpm ;
       newArray_bpm = newArray_bpm.concat(y)
       newArray_bpm.splice(0, 1)

       var data_update_bpm = {
           y: [newArray_bpm]
       };

       Plotly.update('graph-bpm', data_update_bpm)

       if (cnt === 100) clearInterval(interval);
   }, 500);


})