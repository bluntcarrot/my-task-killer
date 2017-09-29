"use strict";

const ps = require('ps-node');

function kill(){

    document.getElementById('loading').style.display = "block";

    var table = document.getElementById("process_list");
    
    for( var i = 0; table.rows[i]; i++ ){

        // Skip the table headers row
        if ( i > 0 ){
            if( table.rows[i].getElementsByTagName('input')[0].checked == true ){
                
                var pid = table.rows[i].getElementsByTagName('input')[0].getAttribute('id'),
                    process = table.rows[i].innerText.trim();

                ps.kill( pid, function( err ){

                    if( err ){
                        throw new Error( err );
                        document.getElementById('loading').style.display = "none";
                    }
                    else{
                        console.log( 'Process %s has been killed!', pid );
                        document.getElementById('loading').style.display = "none";
                    }
                    
                });

            }
        }
        
    }
    
}

document.getElementById("btn_kill_process").addEventListener("click", function( e ){

    

    kill();

    

}, false);
