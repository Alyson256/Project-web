export function escapeCsvCell(value: string | number | boolean): string {
  const str = String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export function downloadCsvFile(
  filenamePrefix: string,
  headers: string[],
  rows: Array<Array<string | number | boolean>>
): void {
  const headerLine = headers.join(',');
  const rowLines = rows.map((row) =>
    row.map((cell) => (typeof cell === 'number' ? String(cell) : escapeCsvCell(cell))).join(',')
  );
  const csvContent = [headerLine, ...rowLines].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
