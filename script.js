// --- 1. REPORTE COMERCIAL PARA CLIENTE (Sin Costos, con Vista 3D y Medidas) ---
function generarReporteCliente() {
    const cliente = document.getElementById('proyectoCliente')?.value || 'Closet Principal';
    const material = document.getElementById('materialColor')?.value || 'Melamina blanco 18';
    const canvas3D = document.querySelector('canvas');
    const imagen3DURL = canvas3D ? canvas3D.toDataURL('image/png') : '';

    const ventana = window.open('', '_blank');
    ventana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Propuesta Comercial — ${cliente}</title>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; padding: 25px; margin: 0; }
                .header { border-bottom: 3px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px; }
                h1 { margin: 0; font-size: 20px; color: #1e293b; }
                p { margin: 5px 0; color: #64748b; font-size: 14px; }
                .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 15px; border-radius: 6px; margin-bottom: 20px; }
                .preview-3d { text-align: center; margin: 20px 0; background: #fff; border: 2px dashed #cbd5e1; padding: 15px; border-radius: 8px; }
                .preview-3d img { max-width: 100%; height: auto; max-height: 250px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; font-size: 13px; }
                th { background: #f1f5f9; color: #334155; font-weight: 600; }
                .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>ProMueble CAD & Cotizador</h1>
                <p>Presentación Comercial de Proyecto</p>
            </div>
            <div class="card">
                <strong>Proyecto:</strong> ${cliente}<br>
                <strong>Material / Color:</strong> ${material}
            </div>
            <div class="preview-3d">
                <strong>Vista en Perspectiva 3D</strong><br><br>
                ${imagen3DURL ? `<img src="${imagen3DURL}" alt="Modelo 3D">` : '<em>[Modelo 3D generado en línea]</em>'}
            </div>
            <h3>Despiece y Componentes Técnicos</h3>
            <table>
                <tr><th>Componente (Ref)</th><th>Cantidad</th><th>Medidas (mm)</th></tr>
                <tr><td>Laterales</td><td>2</td><td>1800 x 500</td></tr>
                <tr><td>Techo y Base</td><td>2</td><td>1164 x 500</td></tr>
                <tr><td>División Vertical</td><td>2</td><td>1764 x 500</td></tr>
                <tr><td>Repisas</td><td>6</td><td>376 x 500</td></tr>
                <tr><td>Puertas Batientes</td><td>2</td><td>1800 x 300</td></tr>
            </table>
            <div class="footer">Diseñado a medida con ProMueble CAD — Calidad y garantía garantizadas.</div>
            <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
    `);
    ventana.document.close();
}

// --- 2. HOJA DE COSTOS INTERNA (Privada con Desglose y Total) ---
function generarReporteInterno() {
    const cliente = document.getElementById('proyectoCliente')?.value || 'Closet Principal';
    const ventana = window.open('', '_blank');
    ventana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Hoja de Costos Interna — ${cliente}</title>
            <style>
                body { font-family: sans-serif; padding: 20px; color: #0f172a; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-size: 13px; }
                th { background: #1e293b; color: white; }
                .total { font-size: 16px; font-weight: bold; background: #e2e8f0; }
            </style>
        </head>
        <body>
            <h2>Hoja de Costos y Producción: ${cliente}</h2>
            <table>
                <tr><th>Concepto</th><th>Monto / Detalle</th></tr>
                <tr><td>Área neta tableros</td><td>7.48 m² (2 Planchas requeridas)</td></tr>
                <tr><td>Canto Delgado (1mm) / Grueso (3mm)</td><td>29.4 m / 12.6 m</td></tr>
                <tr><td>Melamina + Cortes</td><td>S/ 400.00</td></tr>
                <tr><td>Servicio Tapacantos</td><td>S/ 369.84</td></tr>
                <tr><td>Accesorios y Varios</td><td>S/ 52.50</td></tr>
                <tr><td>Costo Producción (Subtotal)</td><td>S/ 822.34</td></tr>
                <tr><td>Mano de Obra (Margen 30%)</td><td>S/ 246.70</td></tr>
                <tr><td>Instalación y Transporte</td><td>S/ 100.00</td></tr>
                <tr class="total"><td>TOTAL A COBRAR</td><td>S/ 1,169.04</td></tr>
            </table>
            <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
    `);
    ventana.document.close();
}

// --- 3. MEJORAS VISUALES 3D (Texturas, Animación, Despiece y Táctil) ---
const textureLoader = new THREE.TextureLoader();

function aplicarTexturaMelamina(mesh, urlTextura) {
    if (urlTextura) {
        const melaminaTexture = textureLoader.load(urlTextura);
        melaminaTexture.wrapS = THREE.RepeatWrapping;
        melaminaTexture.wrapT = THREE.RepeatWrapping;
        mesh.material = new THREE.MeshStandardMaterial({ 
            map: melaminaTexture,
            roughness: 0.4,
            metalness: 0.05
        });
    }
}

function animarPuerta(puertaMesh, abierto) {
    const anguloDestino = abierto ? Math.PI / 2 : 0;
    if (window.gsap) {
        gsap.to(puertaMesh.rotation, { y: anguloDestino, duration: 0.6, ease: "power2.out" });
    } else {
        puertaMesh.rotation.y = anguloDestino;
    }
}

function ajustarDespieceExplosivo(listaPiezas, progreso) {
    // Progreso de 0.0 (armado) a 1.0 (totalmente separado)
    listaPiezas.forEach(pieza => {
        if(pieza.posOriginal && pieza.vectorSalida) {
            pieza.mesh.position.copy(pieza.posOriginal)
                .addScaledVector(pieza.vectorSalida, progreso * 150);
        }
    });
}

// Optimización de controles táctiles y órbita fluida en móviles
if (typeof controls !== 'undefined') {
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
}
