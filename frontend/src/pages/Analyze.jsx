// src/pages/Analyze.jsx

import { useRef, useState } from 'react';

import {
  UploadCloud,
  FileSpreadsheet,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import Papa from 'papaparse';

import ExcelJS from 'exceljs';

import { useNavigate } from 'react-router-dom';

const Analyze = () => {
  const inputRef = useRef(null);

  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState('');

  const [dragging, setDragging] =
    useState(false);

  const validateFile = (file) => {
    if (!file) return false;

    const allowedExtensions = [
      '.csv',
      '.xlsx',
      '.xls',
    ];

    const fileName =
      file.name.toLowerCase();

    return allowedExtensions.some(
      (ext) =>
        fileName.endsWith(ext)
    );
  };

  const parseCSV = (file) => {
    return new Promise(
      (resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,

          complete: (results) => {
            resolve(results.data);
          },

          error: (err) => {
            reject(err);
          },
        });
      }
    );
  };

  const parseExcel = async (file) => {
    const workbook =
      new ExcelJS.Workbook();

    const buffer =
      await file.arrayBuffer();

    await workbook.xlsx.load(buffer);

    const worksheet =
      workbook.worksheets[0];

    const rows = [];

    worksheet.eachRow(
      (row, rowNumber) => {
        rows.push(row.values);
      }
    );

    return rows;
  };

  const handleFileSelect = (
    file
  ) => {
    setError('');

    if (!validateFile(file)) {
      setError(
        'Only CSV and Excel files are allowed.'
      );

      setSelectedFile(null);

      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setDragging(false);

    const file =
      e.dataTransfer.files[0];

    handleFileSelect(file);
  };

  const handleAnalyze =
    async () => {
      try {
        setLoading(true);

        setError('');

        if (!selectedFile) {
          setError(
            'Please select a file.'
          );

          setLoading(false);

          return;
        }

        /*
          optional frontend parsing
        */

        if (
          selectedFile.name.endsWith(
            '.csv'
          )
        ) {
          await parseCSV(
            selectedFile
          );
        }

        if (
          selectedFile.name.endsWith(
            '.xlsx'
          ) ||
          selectedFile.name.endsWith(
            '.xls'
          )
        ) {
          await parseExcel(
            selectedFile
          );
        }

        /*
          send file to backend
        */

        const formData =
          new FormData();

        /*
          Backend serializer expects "file"
        */

        formData.append(
          'file',
          selectedFile
        );

        const response =
          await fetch(
            'http://127.0.0.1:8000/api/upload/',
            {
              method: 'POST',

              body: formData,
            }
          );

        /*
          parse backend response 
        */

        const data =
          await response.json();

        /*
          backend response error
        */

        if (!response.ok) {
          console.error(
            'Backend Error:',
            data
          );

          throw new Error(
            JSON.stringify(data)
          );
        }

        /*
          success message
        */

        console.log(
          'Upload Success:',
          data
        );

        /*
          Navigate to dashboard
        */

        navigate('/dashboard', {
          state: {
            dashboardData: data,
          },
        });
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            'Upload failed.'
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <section
      id="analyze"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.12),transparent_40%)]" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        {/* header */}

        <div className="mb-14 text-center">
          <p className="font-retro text-cyan-300">
            AI DATA ANALYTICS
          </p>

          <h2 className="mt-4 font-hero text-5xl text-white md:text-6xl">
            Upload & Analyze
          </h2>

          <p className="mx-auto mt-5 max-w-2xl font-body text-lg text-white/55">
            Drag and drop your CSV
            or Excel files to
            generate intelligent
            business dashboards.
          </p>
        </div>

        {/* dropzone */}

        <div
          onDragOver={(e) => {
            e.preventDefault();

            setDragging(true);
          }}
          onDragLeave={() =>
            setDragging(false)
          }
          onDrop={handleDrop}
          className={`relative rounded-[32px] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-2xl transition-all duration-300 ${
            dragging
              ? 'scale-[1.01] border-cyan-400/40 bg-cyan-400/5'
              : ''
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            hidden
            onChange={(e) =>
              handleFileSelect(
                e.target.files[0]
              )
            }
          />

          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-400/10">
              <UploadCloud className="h-11 w-11 text-cyan-300" />
            </div>

            <h3 className="mt-6 text-2xl font-semibold text-white">
              Drag & Drop Files
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/45">
              Supported formats:
              CSV, XLSX, XLS.
              Upload your business
              reports and analyze
              them instantly with AI
              dashboards.
            </p>

            {/* file name */}

            {selectedFile && (
              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4">
                <FileSpreadsheet className="h-5 w-5 text-cyan-300" />

                <span className="text-sm text-white/80">
                  {
                    selectedFile.name
                  }
                </span>
              </div>
            )}

            {/* error */}

            {error && (
              <div className="mt-6 flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle className="h-4 w-4" />

                <span>{error}</span>
              </div>
            )}

            {/* buttons */}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() =>
                  inputRef.current.click()
                }
                className="rounded-full bg-white/5 px-7 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Select File
              </button>

              <button
                onClick={
                  handleAnalyze
                }
                disabled={loading}
                className="flex items-center gap-2 rounded-full bg-cyan-400 px-7 py-3 text-sm font-semibold text-[#020617] transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    Processing...
                  </>
                ) : (
                  'Analyze File'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analyze;