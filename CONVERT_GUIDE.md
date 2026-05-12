# Excel → JSON Conversion

## Quick Start

Once your Excel workbook is ready (see format below), convert it to `data.json` with:

```bash
node convert.js workbook.xlsx data.json
```

Then reload the app—it will automatically load the new dataset.

## Excel Column Format

Your workbook should have these columns (names are flexible—the script auto-detects):

| Product | SKU | Price | Cost | Install Type | Bundle | Estimate Note | MyAdmin Order Action |
|---------|-----|-------|------|--------------|--------|---------------|----------------------|
| 2026 - MRT - GO Core Plan Bundle | 2601 | 14.95 | 8 | Self Install | Core | | Order on Core Plan w/ BUNDLE-GO Promo |

### Column Name Variants (Auto-Detected)
- **Product**: `Product`, `Product/Service`
- **Price**: `Price`, `Sales Price/Rate`
- **Install Type**: `Install Type`
- **Estimate Note**: `Estimate Note`, `Notes`
- **MyAdmin Order Action**: `MyAdmin Order Action`, `Action`

### Data Types
- **Price / Cost**: Numbers (can include $ prefix, will be stripped)
- **All others**: Text
- Leave blank if not applicable

## Example Usage

1. Edit `workbook.xlsx` in Excel or Google Sheets
2. Run: `node convert.js workbook.xlsx data.json`
3. Commit `data.json` to the repo
4. Deploy—the app loads `data.json` automatically

## Install xlsx library (if needed)

```bash
npm install xlsx
```

If you get a "Cannot find module" error, run the command above first.
