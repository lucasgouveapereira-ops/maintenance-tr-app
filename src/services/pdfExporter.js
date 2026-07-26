/**
 * Exporter service for generating CSV and PDF documentation
 */

export function exportToCSV(filename, rows) {
  if (!rows || !rows.length) return;
  
  const headers = Object.keys(rows[0]).join(';');
  const csvContent = [
    headers,
    ...rows.map(row => 
      Object.values(row)
        .map(val => {
          if (val === null || val === undefined) return '""';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(';')
    )
  ].join('\n');

  // UTF-8 BOM for Excel compatibility
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printElement(elementId, title = 'Relatório de Manutenção') {
  const elem = document.getElementById(elementId);
  if (!elem) return;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 20px;
            color: #1e293b;
            background: #ffffff;
          }
          h1, h2, h3 { color: #0f172a; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th, td {
            border: 1px solid #cbd5e1;
            padding: 8px 12px;
            text-align: left;
            font-size: 13px;
          }
          th {
            background-color: #f1f5f9;
            font-weight: 600;
          }
          .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
          }
          .badge-success { background: #dcfce7; color: #166534; }
          .badge-warning { background: #fef3c7; color: #92400e; }
          .badge-danger { background: #fee2e2; color: #991b1b; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div style="margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
          <h2 style="margin: 0; color: #d97706;">Tec Rochas — Controle de Manutenção</h2>
          <p style="margin: 4px 0 0; color: #64748b; font-size: 13px;">Data de emissão: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}</p>
        </div>
        ${elem.innerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
}
