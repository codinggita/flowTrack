import csv from 'csv-parser';
import { Readable } from 'stream';

const normalizeCategory = (cat = '') => {
  const map = {
    food:'Food', transport:'Transport', shopping:'Shopping', income:'Income',
    housing:'Housing', utilities:'Utilities', software:'Software', tech:'Tech',
    investment:'Investment', salary:'Income', rent:'Housing',
  };
  return map[cat.toLowerCase()] || 'Others';
};

export const parseCSV = (buffer) => new Promise((resolve, reject) => {
  const results = [];
  Readable.from(buffer.toString())
    .pipe(csv({ mapHeaders: ({header}) => header.trim().toLowerCase(), mapValues: ({value}) => value.trim() }))
    .on('data', row => {
      const amount = parseFloat(row.amount);
      if (!isNaN(amount)) results.push({
        date:        new Date(row.date),
        description: row.description || row.desc || 'Unknown',
        amount:      Math.abs(amount),
        type:        row.type?.toLowerCase() === 'income' ? 'income' : 'expense',
        category:    normalizeCategory(row.category),
        notes:       row.notes || '',
      });
    })
    .on('end',   () => resolve(results))
    .on('error', reject);
});
