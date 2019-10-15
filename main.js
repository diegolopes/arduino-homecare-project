$(document).ready(function(){

    let data = [];

    $('#btn').click(function(){

        $.post({
            url : 'http://169.254.125.171',
            beforeSend : function(){
                $('#response').html('Tentando fazer requisição...')
            }
        }).done(function(response){
            $('#response').html(response.number)
            console.log(response);
        })
 
    });


    function requestData(){
        $.post({
            url : 'http://169.254.125.171',
            beforeSend : function(){
                $('#response').html('Tentando fazer requisição...')
            }
        }).done(function(response){
            $('#response').html(response.number)
            //console.log(response);
            data.push(response.number);
            console.log(data);
        })
    }

    setInterval(requestData,2000);

})