let vistaActual = 'frontal';

function cambiarVista(vista) {
    vistaActual = vista;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    if(vista === 'frontal') document.getElementById('btnFrontal').classList.add('active');
    if(vista === 'lateral') document.getElementById('btnLateral').classList.add('active');
    if(vista === 'planta') document.getElementById('btnPlanta').classList.add('active');
    if(vista === '3d') document.getElementById('btn3D').classList.add('active');
    dibujarMueble();
}

function dibujarMueble() {
    const canvas = document.getElementById('muebleCanvas');
    const ctx = canvas.getContext('2d');
    const alto = parseFloat(document.getElementById('mAlto').value) || 0;
    const ancho = parseFloat(document.getElementById('mAncho').value) || 0;
    const prof = parseFloat(document.getElementById('mProf').value) || 0;
    const grosor = parseFloat(document.getElementById('mGrosor').value) || 18;
    const hRepisas = parseInt(document.getElementById('mRepisas').value) || 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (alto <= 0 || ancho <= 0 || prof <= 0) return;

    const drawFace = (x, y, w, h, fill = 'var(--wood-fill)', stroke = 'var(--wood-stroke)') => {
        ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = 1.5;
        ctx.fillRect(x, y, w, h); ctx.strokeRect(x, y, w, h);
    };

    const padding = 20;

    if (vistaActual === 'frontal') {
        const vDivs = parseInt(document.getElementById('mDivV').value) || 0;
        const scale = Math.min((canvas.width - padding*2) / ancho, (canvas.height - padding*2) / alto);
        const wPx = ancho * scale, hPx = alto * scale, gPx = grosor * scale;
        const oX = (canvas.width - wPx) / 2, oY = (canvas.height - hPx) / 2;

        drawFace(oX, oY, gPx, hPx); 
        drawFace(oX + wPx - gPx, oY, gPx, hPx);
        drawFace(oX + gPx, oY, wPx - 2*gPx, gPx);
        drawFace(oX + gPx, oY + hPx - gPx, wPx - 2*gPx, gPx);

        const cols = vDivs + 1;
        const colW = (wPx - 2*gPx - (vDivs * gPx)) / cols;
        for(let i=1; i<=vDivs; i++) drawFace(oX + gPx + (i * colW) + ((i-1) * gPx), oY + gPx, gPx, hPx - 2*gPx);
        
        const rowH = (hPx - 2*gPx - (hRepisas * gPx)) / (hRepisas + 1);
        for(let c=0; c<cols; c++) {
            let cx = oX + gPx + (c * colW) + (c * gPx);
            for(let r=1; r<=hRepisas; r++) drawFace(cx, oY + gPx + (r * rowH) + ((r-1) * gPx), colW, gPx);
        }
    } 
    else if (vistaActual === 'lateral') {
        const scale = Math.min((canvas.width - padding*2) / prof, (canvas.height - padding*2) / alto);
        const pPx = prof * scale, hPx = alto * scale, gPx = grosor * scale;
        const oX = (canvas.width - pPx) / 2, oY = (canvas.height - hPx) / 2;

        drawFace(oX, oY, pPx, hPx, 'rgba(217, 185, 155, 0.2)', 'var(--wood-stroke)');
        drawFace(oX, oY, pPx, gPx);
        drawFace(oX, oY + hPx - gPx, pPx, gPx);

        const rowH = (hPx - 2*gPx - (hRepisas * gPx)) / (hRepisas + 1);
        for(let r=1; r<=hRepisas; r++) {
            drawFace(oX, oY + gPx + (r * rowH) + ((r-1) * gPx), pPx, gPx);
        }
    }
    else if (vistaActual === 'planta') {
        const vDivs = parseInt(document.getElementById('mDivV').value) || 0;
        const scale = Math.min((canvas.width - padding*2) / ancho, (canvas.height - padding*2) / prof);
        const wPx = ancho * scale, pPx = prof * scale, gPx = grosor * scale;
        const oX = (canvas.width - wPx) / 2, oY = (canvas.height - pPx) / 2;

        drawFace(oX, oY, wPx, pPx, 'rgba(0,0,0,0.02)', '#ccc');
        drawFace(oX, oY, gPx, pPx); 
        drawFace(oX + wPx - gPx, oY, gPx, pPx);

        const cols = vDivs + 1;
        const colW = (wPx - 2*gPx - (vDivs * gPx)) / cols;
        for(let i=1; i<=vDivs; i++) drawFace(oX + gPx + (i * colW) + ((i-1) * gPx), oY, gPx, pPx);
    }
    else if (vistaActual === '3d') {
        const vDivs = parseInt(document.getElementById('mDivV').value) || 0;
        const pseudoScale = Math.min((canvas.width - padding*2) / (ancho + prof*0.5), (canvas.height - padding*2) / (alto + prof*0.5));
        const wPx = ancho * pseudoScale, hPx = alto * pseudoScale, pPx = prof * pseudoScale, gPx = grosor * pseudoScale;
        
        const offsetX3D = pPx * 0.6; 
        const offsetY3D = pPx * 0.4;
        
        const oX = (canvas.width - (wPx + offsetX3D)) / 2;
        const oY = (canvas.height - (hPx + offsetY3D)) / 2 + offsetY3D;

        const drawBlock3D = (x, y, w, h) => {
            drawFace(x + offsetX3D, y - offsetY3D, w, h, 'rgba(217, 185, 155, 0.1)', 'rgba(139, 90, 43, 0.3)');
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + offsetX3D, y - offsetY3D); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x+w, y); ctx.lineTo(x+w + offsetX3D, y - offsetY3D); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x, y+h); ctx.lineTo(x + offsetX3D, y+h - offsetY3D); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x+w, y+h); ctx.lineTo(x+w + offsetX3D, y+h - offsetY3D); ctx.stroke();
            drawFace(x, y, w, h, 'rgba(255, 255, 255, 0.6)', 'var(--wood-stroke)');
        };

        drawBlock3D(oX, oY, gPx, hPx); 
        drawBlock3D(oX + wPx - gPx, oY, gPx, hPx); 
        drawBlock3D(oX + gPx, oY, wPx - 2*gPx, gPx); 
        drawBlock3D(oX + gPx, oY + hPx - gPx, wPx - 2*gPx, gPx); 

        const cols = vDivs + 1;
        const colW = (wPx - 2*gPx - (vDivs * gPx)) / cols;
        for(let i=1; i<=vDivs; i++) drawBlock3D(oX + gPx + (i * colW) + ((i-1) * gPx), oY + gPx, gPx, hPx - 2*gPx);
        
        const rowH = (hPx - 2*gPx - (hRepisas * gPx)) / (hRepisas + 1);
        for(let c=0; c<cols; c++) {
            let cx = oX + gPx + (c * colW) + (c * gPx);
            for(let r=1; r<=hRepisas; r++) drawBlock3D(cx, oY + gPx + (r * rowH) + ((r-1) * gPx), colW, gPx);
        }
    }
}

function enviarAlDespiece() {
    const alto = parseFloat(document.getElementById('mAlto').value) || 0;
    const ancho = parseFloat(document.getElementById('mAncho').value) || 0;
    const prof = parseFloat(document.getElementById('mProf').value) || 0;
    const grosor = parseFloat(document.getElementById('mGrosor').value) || 18;
    const vDivs = parseInt(document.getElementById('mDivV').value) || 0;
    const hRepisas = parseInt(document.getElementById('mRepisas').value) || 0;

    const tbody = document.getElementById('bodyPiezas');
    tbody.innerHTML = '';

    const inyectarFila = (ref, l, a, cant) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" class="ref" value="${ref}"></td>
            <td><input type="number" class="largo" value="${Math.round(l)}"></td>
            <td><input type="number" class="ancho" value="${Math.round(a)}"></td>
            <td><input type="number" class="cant" value="${cant}"></td>
            <td><select class="cLargo"><option value="0">0</option><option value="1">1</option><option value="2" selected>2</option></select></td>
            <td><select class="cAncho"><option value="0">0</option><option value="1" selected>1</option><option value="2">2</option></select></td>
            <td><select class="cTipo"><option value="ninguno">-</option><option value="delgado" selected>1mm</option><option value="grueso">3mm</option></select></td>
            <td><button class="btn btn-delete" onclick="eliminarFila(this)">✖</button></td>
        `;
        tbody.appendChild(tr);
    }

    inyectarFila('Laterales', alto, prof, 2);
    const anchoInterno = ancho - (2 * grosor);
    inyectarFila('Techo y Base', anchoInterno, prof, 2);

    const altoInterno = alto - (2 * grosor);
    if (vDivs > 0) inyectarFila('Div. Vertical', altoInterno, prof, vDivs);

    const cols = vDivs + 1;
    const anchoColumna = (anchoInterno - (vDivs * grosor)) / cols;
    const totalRepisas = cols * hRepisas;
    if (totalRepisas > 0) inyectarFila('Repisa', anchoColumna, prof, totalRepisas);
}

function eliminarFila(btn) { btn.closest('tr').remove(); }

function agregarFilaPieza() {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" class="ref" placeholder="Ej: Puerta"></td>
        <td><input type="number" class="largo" placeholder="0"></td>
        <td><input type="number" class="ancho" placeholder="0"></td>
        <td><input type="number" class="cant" value="1"></td>
        <td><select class="cLargo"><option value="0">0</option><option value="1">1</option><option value="2">2</option></select></td>
        <td><select class="cAncho"><option value="0">0</option><option value="1">1</option><option value="2">2</option></select></td>
        <td><select class="cTipo"><option value="ninguno" selected>-</option><option value="delgado">1mm</option><option value="grueso">3mm</option></select></td>
        <td><button class="btn btn-delete" onclick="eliminarFila(this)">✖</button></td>
    `;
    document.getElementById('bodyPiezas').appendChild(tr);
}

function agregarFilaAccesorio() {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" class="acc-nombre" placeholder="Ej: Jalador / Bisagra"></td>
        <td><input type="number" class="acc-cant" value="1"></td>
        <td><input type="number" class="acc-precio" placeholder="0.00" step="0.1"></td>
        <td><button class="btn btn-delete" onclick="eliminarFila(this)">✖</button></td>
    `;
    document.getElementById('bodyAccesorios').appendChild(tr);
}

function calcularProyecto() {
    const nombreProyecto = document.getElementById('nombreProyecto').value.trim();
    const tipoPlancha = document.getElementById('tipoPlanchaTxt').value.trim();
    
    const tituloRes = document.getElementById('resNombreProyecto');
    const tipoRes = document.getElementById('resTipoPlanchaText');

    tituloRes.innerText = nombreProyecto !== "" ? "Presupuesto: " + nombreProyecto : "Presupuesto General";
    if(tipoPlancha !== "") {
        tipoRes.innerText = "Material: " + tipoPlancha;
        tipoRes.style.display = "block";
    } else { tipoRes.style.display = "none"; }

    let areaM2 = 0, cantoD = 0, cantoG = 0;
    document.querySelectorAll('#bodyPiezas tr').forEach(fila => {
        const L = parseFloat(fila.querySelector('.largo').value) || 0;
        const A = parseFloat(fila.querySelector('.ancho').value) || 0;
        const cant = parseFloat(fila.querySelector('.cant').value) || 0;
        const lL = parseFloat(fila.querySelector('.cLargo').value) || 0;
        const lA = parseFloat(fila.querySelector('.cAncho').value) || 0;
        const tipo = fila.querySelector('.cTipo').value;

        areaM2 += (L * A * cant) / 1000000;
        if (tipo !== 'ninguno') {
            const perim = ((L * lL * cant) + (A * lA * cant)) / 1000;
            tipo === 'delgado' ? cantoD += perim : cantoG += perim;
        }
    });

    let totalAccesorios = 0;
    document.querySelectorAll('#bodyAccesorios tr').forEach(fila => {
        const cant = parseFloat(fila.querySelector('.acc-cant').value) || 0;
        const precio = parseFloat(fila.querySelector('.acc-precio').value) || 0;
        totalAccesorios += (cant * precio);
    });

    const planchas = Math.ceil(areaM2 / 4.45); 
    const pPlan = parseFloat(document.getElementById('pPlancha').value) || 0;
    const pCort = parseFloat(document.getElementById('pCorte').value) || 0;
    const pCD = parseFloat(document.getElementById('pCantoD').value) || 0;
    const pCG = parseFloat(document.getElementById('pCantoG').value) || 0;
    const pTornillos = parseFloat(document.getElementById('pTornillos').value) || 0;
    const pInstalacion = parseFloat(document.getElementById('pInstalacion').value) || 0;
    const margen = parseFloat(document.getElementById('pMargen').value) || 0;

    const cMelamina = planchas * (pPlan + pCort);
    const cCanto = (cantoD * pCD) + (cantoG * pCG);
    const cFerreteriaTotal = totalAccesorios + pTornillos; 
    
    const subtotal = cMelamina + cCanto + cFerreteriaTotal;
    const mObra = subtotal * (margen / 100);
    const total = subtotal + mObra + pInstalacion;

    document.getElementById('resArea').innerText = areaM2.toFixed(2) + ' m²';
    document.getElementById('resMetrosD').innerText = cantoD.toFixed(1) + ' m';
    document.getElementById('resMetrosG').innerText = cantoG.toFixed(1) + ' m';
    document.getElementById('resPlanchas').innerText = planchas;

    document.getElementById('resCostoMelamina').innerText = 'S/ ' + cMelamina.toFixed(2);
    document.getElementById('resCostoCanto').innerText = 'S/ ' + cCanto.toFixed(2);
    document.getElementById('resCostoFerreteria').innerText = 'S/ ' + cFerreteriaTotal.toFixed(2);
    document.getElementById('resSubtotal').innerText = 'S/ ' + subtotal.toFixed(2);
    document.getElementById('resManoObra').innerText = 'S/ ' + mObra.toFixed(2);
    document.getElementById('resInstalacion').innerText = 'S/ ' + pInstalacion.toFixed(2);
    document.getElementById('resTotal').innerText = 'S/ ' + total.toFixed(2);

    document.getElementById('resultados').style.display = 'block';
    document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
}

// Funciones para Generar Reportes Comerciales e Internos
function generarReporteCliente() {
    const cliente = document.getElementById('nombreProyecto')?.value || 'Closet Principal';
    const material = document.getElementById('tipoPlanchaTxt')?.value || 'Melamina blanco 18mm';
    const canvas3D = document.getElementById('muebleCanvas');
    const imagen3DURL = canvas3D ? canvas3D.toDataURL('image/png') : '';

    let filasTabla = '';
    document.querySelectorAll('#bodyPiezas tr').forEach(fila => {
        const ref = fila.querySelector('.ref')?.value || 'Pieza';
        const cant = fila.querySelector('.cant')?.value || '1';
        const largo = fila.querySelector('.largo')?.value || '0';
        const ancho = fila.querySelector('.ancho')?.value || '0';
        if(largo > 0 && ancho > 0) {
            filasTabla += `<tr><td>${ref}</td><td>${cant}</td><td>${largo} x ${ancho} mm</td></tr>`;
        }
    });

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
                <strong>Vista del Mueble</strong><br><br>
                ${imagen3DURL ? `<img src="${imagen3DURL}" alt="Modelo CAD">` : '<em>[Modelo generado]</em>'}
            </div>
            <h3>Despiece y Componentes Técnicos</h3>
            <table>
                <tr><th>Componente (Ref)</th><th>Cantidad</th><th>Medidas (mm)</th></tr>
                ${filasTabla || '<tr><td colspan="3">No hay piezas registradas</td></tr>'}
            </table>
            <div class="footer">Diseñado a medida con ProMueble CAD — Calidad y garantía garantizadas.</div>
            <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
    `);
    ventana.document.close();
}

function generarReporteInterno() {
    const cliente = document.getElementById('nombreProyecto')?.value || 'Closet Principal';
    const area = document.getElementById('resArea')?.innerText || '0 m²';
    const cantPlanchas = document.getElementById('resPlanchas')?.innerText || '0';
    const mCantoD = document.getElementById('resMetrosD')?.innerText || '0 m';
    const mCantoG = document.getElementById('resMetrosG')?.innerText || '0 m';
    const cMelamina = document.getElementById('resCostoMelamina')?.innerText || 'S/ 0.00';
    const cCanto = document.getElementById('resCostoCanto')?.innerText || 'S/ 0.00';
    const cFerreteria = document.getElementById('resCostoFerreteria')?.innerText || 'S/ 0.00';
    const subtotal = document.getElementById('resSubtotal')?.innerText || 'S/ 0.00';
    const manoObra = document.getElementById('resManoObra')?.innerText || 'S/ 0.00';
    const instalacion = document.getElementById('resInstalacion')?.innerText || 'S/ 0.00';
    const totalCobrar = document.getElementById('resTotal')?.innerText || 'S/ 0.00';

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
                <tr><td>Área neta tableros</td><td>${area} (${cantPlanchas} Planchas requeridas)</td></tr>
                <tr><td>Canto Delgado (1mm) / Grueso (3mm)</td><td>${mCantoD} / ${mCantoG}</td></tr>
                <tr><td>Melamina + Cortes</td><td>${cMelamina}</td></tr>
                <tr><td>Servicio Tapacantos</td><td>${cCanto}</td></tr>
                <tr><td>Accesorios y Varios</td><td>${cFerreteria}</td></tr>
                <tr><td>Costo Producción (Subtotal)</td><td>${subtotal}</td></tr>
                <tr><td>Mano de Obra (Ganancia)</td><td>${manoObra}</td></tr>
                <tr><td>Instalación y Transporte</td><td>${instalacion}</td></tr>
                <tr class="total"><td>TOTAL A COBRAR</td><td>${totalCobrar}</td></tr>
            </table>
            <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
    `);
    ventana.document.close();
}

window.onload = dibujarMueble;
