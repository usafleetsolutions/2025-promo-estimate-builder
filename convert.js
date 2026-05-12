#!/usr/bin/env node
/**
 * Convert Excel workbook to data.json
 * Usage: node convert.js [input.xlsx] [output.json]
 * Defaults: node convert.js workbook.xlsx data.json
 */

const fs = require('fs');
const XLSX = require('xlsx');
const path = require('path');

const inputFile = process.argv[2] || 'workbook.xlsx';
const outputFile = process.argv[3] || 'data.json';

try {
  if (!fs.existsSync(inputFile)) {
    throw new Error(`Input file not found: ${inputFile}`);
  }

  console.log(`Reading ${inputFile}...`);
  const workbook = XLSX.readFile(inputFile);
  const sheetName = workbook.SheetNames[0];
  
  if (!sheetName) {
    throw new Error('No sheets found in workbook');
  }

  console.log(`Using sheet: ${sheetName}`);
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);

  if (!rows || rows.length === 0) {
    throw new Error('No data rows found in sheet');
  }

  console.log(`Found ${rows.length} rows`);

  // Normalize column names and values
  const normalized = rows.map(row => {
    const item = {};
    for (const key in row) {
      const normalizedKey = key.trim().toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '');
      
      let val = row[key];
      
      // Map common column name variations
      if (normalizedKey === 'productservice' || normalizedKey === 'product') {
        item.product = String(val || '').trim();
      } else if (normalizedKey === 'sku') {
        item.sku = String(val || '').trim();
      } else if (normalizedKey === 'price' || normalizedKey === 'salespricerate') {
        const num = parseFloat(String(val || '').replace(/[^0-9.\-]/g, ''));
        item.price = isNaN(num) ? null : num;
      } else if (normalizedKey === 'cost') {
        const num = parseFloat(String(val || '').replace(/[^0-9.\-]/g, ''));
        item.cost = isNaN(num) ? null : num;
      } else if (normalizedKey === 'installtype') {
        item.installType = String(val || '').trim();
      } else if (normalizedKey === 'bundle') {
        item.bundle = String(val || '').trim();
      } else if (normalizedKey === 'estimatenote' || normalizedKey === 'notes') {
        item.estimateNote = String(val || '').trim();
      } else if (normalizedKey === 'myadminorderaction' || normalizedKey === 'action') {
        item.myadminAction = String(val || '').trim();
      }
    }
    return item;
  });

  // Filter out empty rows
  const filtered = normalized.filter(item => item.product || item.sku);

  fs.writeFileSync(outputFile, JSON.stringify(filtered, null, 2));
  console.log(`✓ Wrote ${filtered.length} items to ${outputFile}`);
  console.log(`\nExpected columns in workbook:`);
  console.log('  - Product (or Product/Service)');
  console.log('  - SKU');
  console.log('  - Price (or Sales Price/Rate)');
  console.log('  - Cost');
  console.log('  - Install Type');
  console.log('  - Bundle');
  console.log('  - Estimate Note (or Notes)');
  console.log('  - MyAdmin Order Action (or Action)');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
