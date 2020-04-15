#!/usr/bin/env node
const fs = require("fs");
const {spawn} = require("child_process");

var cssFiles = [
    'create.css',
    'form.css',
    'list.css',
    'show.css',
    'update.css',
    'styles.css',

]

var componentFiles = [
    'Create.js',
    'Form.js',
    'List.js',
    'Show.js',
    'Update.js',
    'index.js'
]

console.log('Generating components...');
const ls = spawn('generate-api-platform-client');
ls.stdout.on('data', (data) => {});
  
ls.stderr.on('data', (data) => {});
ls.on('close', (code) => {
    console.log('Finished generating components ;)');

    var components = getComponents();
    createDefaultCss(cssFiles);
    addCssImports(components, componentFiles, cssFiles);
    editAppJs(components);
    editReducersJs(components);
    parseToInt();
    importDataAccess();
});

function getComponents() {
    const dir = 'src/components';
    var components = []
    fs.readdirSync(dir).forEach(component => {
        components.push(component);
    });

    return components
}

function createDefaultCss(files) {
    var dir = 'src/styles/';
    var created = false;
    files.forEach(file => {
        try {
            if(!fs.existsSync(dir + file)) {
                var data = "/* CSS FILE " + file +  " */"
                fs.writeFile(dir + file, data, function(err, data) {
                    if (err) console.log(err)
                });
                created = true;
            }
        } catch(err) {
            console.log(err);
        }
    });
    if (created) {
        console.log("\x1b[32m%s\x1b[0m","Succesfully created/updated css files");
    } else {
        console.log("\x1b[33m%s\x1b[0m","All css files already exist, nothing is created");
    }
}

function addCssImports(components, files, cssFiles) {
    components.forEach(comp => {
        var dir = 'src/components/' + comp + '/';
        files.forEach(file => {
            var data = fs.readFileSync(dir + file);
            if(!data.includes("import '../../styles/" + cssFiles[files.indexOf(file)])) {
                var fd = fs.openSync(dir + file, 'w+');
                var buffer = new Buffer("import '../../styles/" + cssFiles[files.indexOf(file)] + "'; \n");

                fs.writeSync(fd, buffer, 0, buffer.length, 0)
                fs.writeSync(fd, data, 0, data.length, buffer.length);
            }
        });
    });
}

function editAppJs(components)
{
    var file = 'src/App.js';
    components.forEach(comp => {
        var data = fs.readFileSync(file).toString();
        if(!data.includes(  "import " + comp + "Routes from './routes/" + comp + "'"))
        {
            data = data.replace(
                "// Import your routes here",
                "// Import your routes here \n" +
                "import " + comp + "Routes from './routes/" + comp + "';");
        }
        
        if(!data.includes("{"+comp + "Routes},")) {
            data = data.replace(
                "{/* Add your routes here */}",
                "{/* Add your routes here */}\n\t\t\t\t\t\t\t\t\t" +
                "{"+comp + "Routes},"
            )
        }

        fs.writeFileSync(file, data, function(err, data){
            if (err) console.log(err)
        });

    });
}

function editReducersJs(components)
{
    var file = 'src/reducers.js';
    components.forEach(comp => {
        var data = fs.readFileSync(file).toString();
        if(!data.includes("import " + comp + " from './reducers/" + comp)){
            data = data.replace(
                "// Import your reducers here",
                "// Import your reducers here \n" +
                "import " + comp + " from './reducers/" + comp + "/';");
        }
        if(!data.includes("\t" + comp + ",")) {
            data = data.replace(
                "/* Add your reducers here */",
                "/* Add your reducers here */\n\t" +
                comp + ","  
            );
        }

        fs.writeFileSync(file, data, function(err, data){
            if (err) console.log(err)
        });

    });
}

function parseToInt()
{
    // parse={value => Number(value)}
    const dir = 'src//components/';
    var components = []
    fs.readdirSync(dir).forEach(component => {
        components.push(component);
    });

    components.forEach(comp => {
        path = dir + comp + "/Form.js";
        var data = fs.readFileSync(path).toString();
        if(
            data.includes('type="number"') && 
            !data.includes('parse={value => Number(value)}')
        ){
            data = data.replace(/type="number"/g, "type=\"number\"\n\t\t\t\t\tparse={value => Number(value)}");
        }

        fs.writeFileSync(path, data, function(err, data){
            if (err) console.log(err)
        });
    });

}

function importDataAccess() {
    console.log('Importing dataAcces file...');
    const dir = 'src/actions/';
    var dirs = [];
    fs.readdirSync(dir).forEach(d => {
        dirs.push(d);
    })
    dirs.forEach(d => {
        files = [];
        fs.readdirSync(dir + d + '/').forEach(f => {
            files.push(dir + d + '/' + f);
        });

        files.forEach(f => {
            var data = fs.readFileSync(f).toString();
            if(data.includes("from '../../utils/dataAccess';")) {
                data = data.replace(
                    "from '../../utils/dataAccess';",
                    "from '../../utils/dataAccess';")
            }

            fs.writeFileSync(f, data, function(err, data){
                if (err) console.log(err);
            });
        });
    });
}