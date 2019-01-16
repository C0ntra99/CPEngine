function saveEngine() {
    var engineObj = {'name':'', 'path':'', 'type':'', 'os':'', 'vulnerabilities':{}};
    var eng = document.getElementById('engine');
    for ( var child of eng.children) {
        //Set the properties
        if(child.id.includes('properties')) {
            //is the properties table
            var table = child;
            engineObj['name'] = document.title;
            for(x of table.children[1].children) {
                if(x.childNodes[0].type) {
                    if(x.childNodes[0].id == 'type') {
                        engineObj['type'] = x.childNodes[0].options[x.childNodes[0].selectedIndex].value;
                    } else if (x.childNodes[0].id == 'os') {
                        engineObj['os'] = x.childNodes[0].options[x.childNodes[0].selectedIndex].value;
                    }
                } else {
                    engineObj['path'] = x.innerText;
                }
            };
        }
        //Creates the vuln element
        //console.log(child.id);
        if(child.id.includes('table')) {
            var table = child;
            for(x of table.children) {
                console.log(x);
            }
            //engineObj['vulnerabilities'][child.id.split(":")[1]] = [];
        }
    }
    //console.log(engineObj);

}