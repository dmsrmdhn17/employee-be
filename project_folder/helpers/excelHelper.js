const formatResponse = require("./format_responseHelper");
const ExcelJS = require("exceljs");
const Stream = require("stream");

class excelHelper {
	// UNDUH FILE EXCEL
	static download(res, workbook, filename) {
		try {
			res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			res.setHeader("Content-Disposition", `attachment; filename=${filename}.xlsx`);
			return workbook.xlsx.write(res).then(function () {});
		} catch (error) {
			return res.status(500).json(formatResponse.error_server(error));
		}
	}

	// KONVERSI DATA OBJEK => FORMAT WORKBOOK EXCEL JS (AGAR READY TO DOWNLOAD)
	static async jsonToSpreadsheet(data) {
		const workbook = new ExcelJS.Workbook();
		const filename = data.filename;
		const worksheets = data.worksheets;

		worksheets.forEach((sheetData) => {
			const worksheet = workbook.addWorksheet(sheetData.sheetname);

			// MEMBUAT JUDUL KOLOM
			worksheet.columns = sheetData.column_data.map((column) => ({
				header: column.header,
				key: column.key,
				width: column.width,
			}));

			// STYLING JUDUL KOLOM (FONT CENTER, FONT BOLD, FILL COLUMN YELLOW)
			const headerRow = worksheet.getRow(1);
			headerRow.eachCell((cell) => {
				cell.font = { bold: true };
				cell.alignment = { vertical: "middle", horizontal: "center" };
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "FFFF00" },
				};
			});

			// TAMBAH BARIS DATA
			const rowData = Array.isArray(sheetData.row_data) ? sheetData.row_data : [];
			rowData.forEach((row) => {
				const validatedRow = {};
				for (let key in row) {
					validatedRow[key] =
						row[key] === "null" || row[key] === null || row[key] === "undefined" || row[key] === undefined || ((row[key] === "NaN" || isNaN(row[key])) && typeof row[key] !== "string")
							? ""
							: row[key];
				}
				worksheet.addRow(validatedRow);
			});
		});

		return { hasil: workbook, nama_file: filename };
	}

	static async jsonToSpreadsheetv2(data) {
		const workbook = new ExcelJS.Workbook();
		const filename = data.filename;
		const worksheets = data.worksheets;

		worksheets.forEach((sheetData) => {
			const worksheet = workbook.addWorksheet(sheetData.sheetname);

			// MEMBUAT JUDUL KOLOM
			let custom_column = [];
			if (sheetData.main_column_data !== undefined) {
				custom_column.push(
					...sheetData.main_column_data.map((column) => ({
						header: column.header,
						key: column.key,
						width: column.width,
					})),
				);
				worksheet.columns = custom_column;
				worksheet.addRow(sheetData.column_data.map((x) => x.header));
				// worksheet.mergeCells("A1:E1")
			} else {
				custom_column.push(
					...sheetData.column_data.map((column) => ({
						header: column.header,
						key: column.key,
						width: column.width,
					})),
				);
				worksheet.columns = custom_column;
			}

			// JUDUL PALING ATAS
			const firstHeaderRow = worksheet.getRow(1);
			firstHeaderRow.eachCell((cell) => {
				cell.font = { bold: true };
				cell.alignment = { vertical: "middle", horizontal: "center" };
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "FFFF00" },
				};
			});
			// STYLING JUDUL KOLOM (FONT CENTER, FONT BOLD, FILL COLUMN YELLOW) (ANAK)
			const headerRow = worksheet.getRow(2);
			headerRow.eachCell((cell) => {
				cell.font = { bold: true };
				cell.alignment = { vertical: "middle", horizontal: "center" };
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "FFFF00" },
				};
			});

			// TAMBAH BARIS DATA
			const rowData = Array.isArray(sheetData.row_data) ? sheetData.row_data : [];
			rowData.forEach((row) => {
				const validatedRow = {};
				for (let key in row) {
					validatedRow[key] =
						row[key] === "null" || row[key] === null || row[key] === "undefined" || row[key] === undefined || ((row[key] === "NaN" || isNaN(row[key])) && typeof row[key] !== "string")
							? ""
							: row[key];
				}
				worksheet.addRow(validatedRow);
			});
		});

		return { hasil: workbook, nama_file: filename };
	}

	// KONVERSI DATA OBJEK => STREAM BUFFER
	static async jsonToStream(data) {
		const stream = new Stream.PassThrough();
		const options = {
			stream: stream,
			useStyles: true,
			useSharedStrings: true,
		};

		const workbook = new ExcelJS.stream.xlsx.WorkbookWriter(options);
		const filename = data.filename + ".xlsx";
		const worksheets = data.worksheets;

		worksheets.forEach((sheetData) => {
			const worksheet = workbook.addWorksheet(sheetData.sheetname);

			// MEMBUAT JUDUL KOLOM
			worksheet.columns = sheetData.column_data.map((column) => ({
				header: column.header,
				key: column.key,
				width: column.width,
			}));

			// STYLING JUDUL KOLOM (FONT CENTER, FONT BOLD, FILL COLUMN YELLOW)
			const headerRow = worksheet.getRow(1);
			headerRow.eachCell((cell) => {
				cell.font = { bold: true };
				cell.alignment = { vertical: "middle", horizontal: "center" };
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "FFFF00" },
				};
			});
			headerRow.commit(); // Commit header row after formatting

			// TAMBAH BARIS DATA
			const rowData = Array.isArray(sheetData.row_data) ? sheetData.row_data : [];
			rowData.forEach((row) => {
				const worksheetRow = worksheet.addRow(row);
				worksheetRow.commit(); // Commit each row immediately after adding it
			});
		});
		workbook.commit();

		return { hasil: stream, nama_file: filename };
	}

	// KONVERSI LANGSUNG DATA EXCEL => DATA OBJEK (TANPA HARUS SIMPAN FILE)
	static async spreadsheetToJson(file) {
		return new Promise((resolve, reject) => {
			const workbook = new ExcelJS.Workbook();
			workbook.xlsx
				.load(file.data)
				.then((workbook) => {
					const jsonData = [];
					workbook.eachSheet((sheet) => {
						const sheetData = {
							sheetname: sheet.name,
							column_data: [],
							row_data: [],
						};
						sheet.eachRow((row, rowIndex) => {
							const rowData = {};
							if (rowIndex === 1) {
								// Header row
								row.eachCell((cell, colIndex) => {
									const columnHeader = cell.value; // Use cell value as column header
									sheetData.column_data.push({
										header: columnHeader,
										key: columnHeader, // Use cell value as key
										width: sheet.getColumn(colIndex).width,
									});
								});
							} else {
								// Data row
								row.eachCell((cell, colIndex) => {
									const columnHeader = sheetData.column_data[colIndex - 1].key;
									const cellValue = cell.value === undefined || cell.value === null || cell.value === "" ? null : cell.value;
									rowData[columnHeader] = cellValue;
								});
								// Add index (row number) to row data
								rowData.index = rowIndex;
								sheetData.row_data.push(rowData);
							}
						});
						jsonData.push(sheetData);
					});

					// Fill missing keys in header row with null
					const headerKeys = jsonData[0].column_data.map((column) => column.key);
					jsonData[0].row_data.forEach((row) => {
						headerKeys.forEach((headerKey) => {
							if (row[headerKey] === undefined) {
								row[headerKey] = null;
							}
						});
					});

					resolve(jsonData);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	static async dataToSpreadsheetWithStyle({ data, style = { headerBgColor: "96d8ff" }, options = { useFirstNumberColumn: false } }) {
		const workbook = new ExcelJS.Workbook();
		const filename = data.filename;
		const worksheets = data.worksheets;

		worksheets.forEach((sheetData) => {
			const worksheet = workbook.addWorksheet(sheetData.sheetname);
			const noExKey = "numberExcel";
			if (options.useFirstNumberColumn) {
				sheetData.column_data.unshift({ header: "NO", key: noExKey, width: 7 });
			}

			// MEMBUAT JUDUL KOLOM
			worksheet.columns = sheetData.column_data.map((column) => ({
				header: column.header,
				key: column.key,
				width: column.width,
			}));

			// STYLING JUDUL KOLOM (FONT CENTER, FONT BOLD, FILL COLUMN YELLOW)
			const headerRow = worksheet.getRow(1);
			headerRow.eachCell((cell) => {
				cell.font = { bold: true };
				cell.alignment = { vertical: "middle", horizontal: "center" };
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: style.headerBgColor },
				};
			});

			// TAMBAH BARIS DATA
			const rowData = Array.isArray(sheetData.row_data) ? sheetData.row_data : [];
			rowData.forEach((row, key) => {
				const validatedRow = {};
				for (let key in row) {
					validatedRow[key] =
						row[key] === "null" || row[key] === null || row[key] === "undefined" || row[key] === undefined || ((row[key] === "NaN" || isNaN(row[key])) && typeof row[key] !== "string")
							? ""
							: row[key];
				}

				if (options.useFirstNumberColumn) {
					validatedRow[noExKey] = key + 1;
				}

				const createdRow = worksheet.addRow(validatedRow);
				if (row.bold) {
					for (let i = 1; i <= sheetData.column_data.length; i++) {
						createdRow.getCell(i).font = { bold: true };
					}
				}
				if (row.bg_color && row?.bg_color !== "#ffffff00") {
					//ffffff00 default color
					for (let i = 1; i <= sheetData.column_data.length; i++) {
						createdRow.getCell(i).fill = {
							type: "pattern",
							pattern: "solid",
							fgColor: { argb: row.bg_color.replace("#", "") },
						};
						createdRow.getCell(i).font = {
							color: { argb: this.getContrastTextColor(row.bg_color) }, // Asumsi ada kolom text_color
						};
					}
				}
			});
		});

		return { hasil: workbook, nama_file: filename };
	}
}

excelHelper.buildExcelHeader = (kolom_data, fields) => {
	// Convert kolom_data to an object for quick access
	const kolomDataMap = Object.fromEntries(kolom_data.map((kolom) => [kolom.key, kolom]));

	// Get the fields from query or default to the first column key
	const requestedFields = fields ? fields.split(/,\s*/).map((field) => field.trim()) : [kolom_data[0].key];

	// Build the Excel header format
	const excelHeaders = requestedFields
		.map((field) => {
			const column = kolomDataMap[field];
			if (!column) return null; // Skip if column is not found

			return {
				header: field, // The header name for Excel
				key: field, // The key to match data with
				width: column.width || 30, // Default width if not specified
			};
		})
		.filter(Boolean); // Remove null values

	return {
		excelHeaders, // Excel header configuration
	};
};

module.exports = excelHelper;
