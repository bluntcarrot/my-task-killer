"use strict";

function processes( ){

    document.getElementById('loading').style.display = "block";

    const psList = require('ps-list');

    // Obtain the list of running processes
    // Returns array 
    // [ { pid: 3213, name: 'node', cmd: 'node test.js' }, {...} ]
    psList().then( processes => {

        document.getElementById('process_list').innerHTML = build_html_table( processes );

        document.getElementById('loading').style.display = "none";

    });

}

function build_html_table( processes ){

    var visible_processes = get_visible_processes();

    var html = "<tr>" +
        "<td><strong>Task</strong></td>" +
        "<td><strong>Kill?</strong></td>" +
    "</tr>";

    processes.forEach( function( process ){

        if( document.getElementById("checkbox_show_all_tasks").checked === false ){

            visible_processes.forEach( function( visible_process ){

                if( process.name.includes( visible_process ) ){

                    html += "<tr onclick='if (event.target.tagName != "+ '"INPUT"'+") document.getElementById("+ process.pid +").checked = !document.getElementById("+ process.pid +").checked'>" +
                            "<td>"+ process.name +"</td>" +
                            "<td>" +  
                                "<div class='checkbox'>" +
                                    "<label>" +
                                        "<input id='"+ process.pid +"' type='checkbox'>" +
                                    "</label>" +
                                "</div>" +
                            "</td>" +
                        "</tr>";

                }

            });

        } else{

            html += "<tr onclick='if (event.target.tagName != "+ '"INPUT"'+") document.getElementById("+ process.pid +").checked = !document.getElementById("+ process.pid +").checked'>" +
                    "<td>"+ process.name +"</td>" +
                    "<td>" +  
                        "<div class='checkbox'>" +
                            "<label>" +
                                "<input id='"+ process.pid +"' type='checkbox'>" +
                            "</label>" +
                        "</div>" +
                    "</td>" +
                "</tr>";
        }
        
    });
    
    return html;
    
}

function get_visible_processes(){
    
    var jsonfile = require('jsonfile');
    var settings = './app-settings.json';
    
    return jsonfile.readFileSync( settings ).filter;
    
}

function load_visible_processes(){

    var visible_processes = get_visible_processes();
    
    var html = "<thead>" +
        "<tr>" + 
            "<th>Task Name</th>" +
            "<th>Remove</th>" +
        "</tr>" +
    "</thead>";
        
    visible_processes.forEach( function( visible_process ){
        
        html += "<tr>" +
            "<td>" + visible_process + "</td>" +
            "<td>" +
                "<a href='#' id='" + visible_process + "' class='remove_visible_process'>" +
                    "<span class='glyphicon glyphicon-remove text-danger' aria-hidden='true'></span>" +
                "</a>" +
            "</td>" +
        "</tr>";
        
    });
    
    document.getElementById('settings_visible_tasks').innerHTML = html;
    
    // Refresh the processes list
    processes();
    
    var remove_visible_processes = document.getElementsByClassName("remove_visible_process");

    // Add an event listener to remove each row on the visible tasks table
    for( var i = 0; i < remove_visible_processes.length; i++ ){
        
        remove_visible_processes[i].addEventListener('click', function( e ){
            
            var jsonfile = require('jsonfile');
            var settings = './app-settings.json';
            
            var settings_obj = jsonfile.readFileSync( settings );
            var visible_tasks_array = settings_obj.filter;
            
            var task_to_remove = this.getAttribute("id");
            
            // filter the array by selecting all elements different to the element you want to remove
            visible_tasks_array = visible_tasks_array.filter(e => e !== task_to_remove);
            
            settings_obj.filter = visible_tasks_array;
            
            jsonfile.writeFileSync( settings, settings_obj );
            
            // Refresh the visible tasks table with new data
            load_visible_processes();

        }, false );
        
    }
    
}

document.getElementById("btn_add_task").addEventListener( "click", function( e ){

    var task_to_add = document.getElementById("input_task_name").value;
    
    if( task_to_add.length > 0 ){
        
        var jsonfile = require('jsonfile');
        var settings = './app-settings.json';
        
        var settings_obj = jsonfile.readFileSync( settings );
        var visible_tasks_array = settings_obj.filter;
        
        // add the task to the front of the array
        visible_tasks_array.unshift( task_to_add );
        
        settings_obj.filter = visible_tasks_array;
        jsonfile.writeFileSync( settings, settings_obj );
        
        document.getElementById("input_task_name").value = "";
        
        // Refresh the visible tasks table with new data
        load_visible_processes();  
        
    }

}, false );

document.getElementById("btn_refresh_list").addEventListener( "click", function( e ){

    processes();

}, false );

document.getElementById("checkbox_show_all_tasks").addEventListener( "click", function( e ){

    processes();

}, false );

$('#settings-modal').on('show.bs.modal', function( e ){

    load_visible_processes();

});

// Load the processes
processes();