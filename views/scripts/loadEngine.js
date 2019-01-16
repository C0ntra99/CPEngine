function loadEngine(engineObj) {
    //console.log(engineObj["vulnerabilities"]["Forensics Questions"]);

    const table = document.querySelector('table');
    table.setAttribute('id', 'properties');
    const colName = document.createElement('tr')
    for (var key in engineObj) {
        if(engineObj.hasOwnProperty(key)) {
            if(key == "vulnerabilities" || key =="name"){
                continue;
            }
            //Create column names
            const th = document.createElement('th');
            const name = document.createTextNode(key); 
            th.appendChild(name);
            colName.appendChild(th);
            table.appendChild(colName);
        }
    }

    var col = document.createElement('tr');
    for (var key in engineObj) {
        if(engineObj.hasOwnProperty(key)) {
            if(key == 'vulnerabilities') {
                continue;
            }
            //if (engineObj[key])
            var td = document.createElement('td');
            switch(key) {
                case 'os':
                    var value = document.createElement('select');
                    value.setAttribute('id', 'os');
                    value.setAttribute('selected', engineObj[key]);
                    var operatingSystems = ['ubuntu', 'debian', 'windows 10', 'server 2016'];
                    for (var os in operatingSystems){
                        var opt = document.createElement('option');
                        opt.setAttribute('value', operatingSystems[os]);
                        if(engineObj[key] == operatingSystems[os]){
                            opt.setAttribute('selected','selected')
                        }
                        
                        opt.appendChild(document.createTextNode(operatingSystems[os]));
                        value.appendChild(opt);
                    }
                    break;
                case 'type':
                    var value = document.createElement('select');
                    value.setAttribute('id', 'type');
                    value.setAttribute('selected', 'standalone')
                    var types = ['standalone', 'client (WIP)', 'server(WIP)'];
                    for (var element in types){
                        var opt = document.createElement('option');
                        opt.setAttribute('value', types[element]);
                        opt.appendChild(document.createTextNode(types[element]))
                        value.appendChild(opt);
                    }
                    break;
                case 'name':
                    continue;
                    
                default:
                    if (key == 'name' && engineObj[key] == '') {
                        var value = document.createElement('input');
                        value.setAttribute('id', 'name');

                    } else {
                        var value = document.createTextNode(engineObj[key]);
                    }
                    break;
            }
            td.appendChild(value);
            col.appendChild(td);
            table.appendChild(col);
        }
    }
  
    //Dont really need to worry about this quite yet
    document.getElementById('type').onchange = function() {
        var index = this.selectedIndex;
        var text = this.children[index].innerHTML.trim();
        console.log(text);
    };

    var title = document.querySelector('title');
    title.replaceChild(document.createTextNode(engineObj.name), title.childNodes[0]);
    //Display the available options for each operating system
    //This still needs to be determined
    //I dont know Cyberpatriot anymore so I need to talk to clark about what vulns to add
    //Also allow custom ones (need to determine how to handle those)
    document.getElementById('os').addEventListener('change', function() {
        var index = this.selectedIndex;
        var text = this.children[index].innerHTML.trim();
        switch(text){
            case 'ubuntu':
                //Load ubuntu vulns
                var table = document.getElementById('vulns');
                console.log('SHIT');
            case 'windows 10':
                console.log('SHIT');

                //Load windows 10 vulns
            case 'server 2016':
                console.log('SHIT');
        }
    });

    
    function loadVulns(vulnerabilities) {
        //console.log(vulnerabilities);
        var engine = document.getElementById('engine');
        for (var category in vulnerabilities) {
            //Create the category header
            var catHeader = document.createElement('h3');
            catHeader.setAttribute('id', `category:${category}`)
            catHeader.innerHTML = category;
            engine.appendChild(catHeader);

            for (var vulns in vulnerabilities[category]){
                //Create the vuln table
                var vulnTable = document.createElement('table');
                vulnTable.setAttribute('id', `table:${category}`)
                var tr = document.createElement('tr');
                //Create headers
                for (var [key, val] of Object.entries(vulnerabilities[category][vulns])) {
                    if (key == 'parameters' && val == null) {
                        continue;
                    } else {
                        var th = document.createElement('th');
                        th.appendChild(document.createTextNode(key));
                        vulnTable.appendChild(th);
                    }
                    //engine.appendChild(vulnTable);
                }
                for (var key in vulnerabilities[category][vulns]) {
                    var td = document.createElement('td');
                    switch(typeof(vulnerabilities[category][vulns][key])) {
                        case 'boolean':
                            //var value = document.createElement('td');
                            var value = document.createElement('input');
                            value.setAttribute('type', 'checkbox');
                            if (vulnerabilities[category][vulns][key] == true) {
                                value.setAttribute('checked', '');
                            }
                            break;

                        case 'string':                           
                            var value = document.createElement('td');
                            value.appendChild(document.createTextNode(vulnerabilities[category][vulns][key]));        
                            break;

                        case 'number':
                            var value = document.createElement('input');
                            value.setAttribute('type', 'number');
                            value.setAttribute('value', vulnerabilities[category][vulns][key]);
                            break;

                        case 'object':
                            if (vulnerabilities[category][vulns][key] !== null) {
                                var value = document.createElement('input');
                                value.setAttribute('value',vulnerabilities[category][vulns][key]);
                            }
                            break;

                        default:
                            var value = document.createTextNode(vulnerabilities[category][vulns][key]);
                            break;
                    }
                    td.appendChild(value);
                    tr.appendChild(td);
                    vulnTable.appendChild(tr);
                    engine.appendChild(vulnTable);
                    //console.log(test);
                }
               // console.log(vulnerabilities[category][vulns]);
            }
            
            if ( category == 'Forensics Questions') {
                //Create the add more button
                var location = document.getElementById('category:Forensics Questions');
                var createMore = document.createElement('button');
                createMore.setAttribute('id', 'NewFQ');
                createMore.innerText = "New question";
                location.appendChild(createMore);
                //vulnTable.appendChild(tr);
                //engine.appendChild(vulnTable);
            }
        }
    }

    loadVulns(engineObj['vulnerabilities']);
    //Listen for create new FQ even
    document.getElementById("NewFQ").addEventListener("click", function(e){
        e.preventDefault();
        //Create a new value in the table
        var table = document.getElementById('table:Forensics Questions');
        var tr = document.createElement('tr');
        for ( x of ['name', 'enabled', 'pointValue', 'question', 'answer']){
            var td = document.createElement('td');
            switch(x) {
                case 'name':
                    var value = document.createTextNode("Forensics Question");
                    break;
                case 'enabled':
                    var value = document.createElement('input');
                    value.setAttribute('type', 'checkbox');
                    break;
                case 'pointValue':
                    var value = document.createElement('input');
                    value.setAttribute('type', 'number');
                    value.setAttribute('valaue', 10);
                    break;
                case 'question':
                    var value = document.createElement('input');
                    break;
                case 'answer':
                    var value = document.createElement('input');
                    break;
                default:
                    continue;
            }
            td.appendChild(value);
            tr.appendChild(td);
            table.appendChild(tr);
            
        };
    });
}


