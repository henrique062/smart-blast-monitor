
import * as XLSX from 'xlsx';

// Function to parse CSV files
export const parseCSV = async (file: File): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      if (!csvText) {
        reject(new Error("Falha ao ler arquivo CSV"));
        return;
      }

      try {
        // Parse CSV using XLSX
        const workbook = XLSX.read(csvText, { type: 'string' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        reject(new Error("Erro ao processar arquivo CSV"));
      }
    };
    
    reader.onerror = () => reject(new Error("Erro na leitura do arquivo"));
    reader.readAsText(file);
  });
};

// Function to parse Excel files (XLSX/XLS)
export const parseExcel = async (file: File): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error("Falha ao ler arquivo Excel"));
          return;
        }
        
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        console.error("Error parsing Excel:", error);
        reject(new Error("Erro ao processar arquivo Excel"));
      }
    };
    
    reader.onerror = () => reject(new Error("Erro na leitura do arquivo"));
    reader.readAsArrayBuffer(file);
  });
};

// Function to parse JSON files
export const parseJSON = async (file: File): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const jsonText = e.target?.result as string;
        if (!jsonText) {
          reject(new Error("Falha ao ler arquivo JSON"));
          return;
        }
        
        const jsonData = JSON.parse(jsonText);
        
        // Handle both array and object formats
        const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
        resolve(dataArray);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        reject(new Error("Erro ao processar arquivo JSON"));
      }
    };
    
    reader.onerror = () => reject(new Error("Erro na leitura do arquivo"));
    reader.readAsText(file);
  });
};
