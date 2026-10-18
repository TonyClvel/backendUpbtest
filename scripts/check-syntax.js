const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const buscarJavaScript = (directorio) => fs.readdirSync(directorio, { withFileTypes: true })
    .flatMap((entrada) => {
        const ruta = path.join(directorio, entrada.name);
        return entrada.isDirectory() ? buscarJavaScript(ruta) : (ruta.endsWith('.js') ? [ruta] : []);
    });

const archivos = ['src', 'scripts', 'test']
    .map((directorio) => path.join(process.cwd(), directorio))
    .filter(fs.existsSync)
    .flatMap(buscarJavaScript);

for (const archivo of archivos) {
    const resultado = spawnSync(process.execPath, ['--check', archivo], { stdio: 'inherit' });
    if (resultado.status !== 0) process.exit(resultado.status || 1);
}

console.log(`Sintaxis validada en ${archivos.length} archivos.`);
