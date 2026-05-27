// src/pages/Analyze.jsx

import { useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';

import {
  FileSpreadsheet,
  UploadCloud,
} from 'lucide-react';

import { parseCSV } from '../services/csvParser';

import { parseExcel } from '../services/excelParser';

const Analyze = () => {
  const navigate = useNavigate();

  const inputRef = useRef(null);

  const [file, setFile] = useState(null);

  const [dragActive, setDragActive] =
    useState(false);

  const [error, setError] = useState('');

  const [loading, setLoading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const allowedExtensions = [
    'csv',
    'xlsx',
    'xls',
  ];

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // VALIDATE FILE
  const validateFile = (selectedFile) => {
    const extension =
      selectedFile.name.split('.').pop();

    // FILE TYPE
    if (
      !allowedExtensions.includes(
        extension.toLowerCase()
      )
    ) {
      setError(
        'Only CSV and Excel files are allowed.'
      );

      return false;
    }

    // FILE SIZE
    if (
      selectedFile.size > MAX_FILE_SIZE
    ) {
      setError(
        'File size must be less than 5MB.'
      );

      return false;
    }

    // EMPTY FILE
    if (selectedFile.size === 0) {
      setError('File is empty.');

      return false;
    }

    setError('');

    return true;
  };

  // HANDLE FILE
  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const valid = validateFile(selectedFile);

    if (!valid) return;

    setFile(selectedFile);
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    const selectedFile = e.target.files[0];

    handleFile(selectedFile);
  };

  // DRAG OVER
  const handleDragOver = (e) => {
    e.preventDefault();

    setDragActive(true);
  };

  // DRAG LEAVE
  const handleDragLeave = () => {
    setDragActive(false);
  };

  // DROP
  const handleDrop = (e) => {
    e.preventDefault();

    setDragActive(false);

    const droppedFile =
      e.dataTransfer.files[0];

    handleFile(droppedFile);
  };

  // ANALYZE FILE
  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setLoading(true);

      setProgress(20);

      const extension =
        file.name.split('.').pop();

      let parsedData = [];

      // CSV
      if (
        extension.toLowerCase() === 'csv'
      ) {
        parsedData = await parseCSV(file);
      }

      // EXCEL
      else {
        parsedData = await parseExcel(file);
      }

      setProgress(60);

      // STORE TEMPORARY DATA
      sessionStorage.setItem(
        'uploadedFileData',
        JSON.stringify(parsedData)
      );

      sessionStorage.setItem(
        'uploadedFileName',
        file.name
      );

      setProgress(100);

      toast.success(
        'File parsed successfully'
      );

      // NAVIGATE TO DASHBOARD
      navigate('/dashboard');
    } catch (error) {
      console.error(error);

      toast.error('Analysis failed');
    } finally {
      setLoading(false);

      setTimeout(() => {
        setProgress(0);
      }, 1200);
    }
  };

  return (
    <section
      id="analyze"
      className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:px-8"
    >
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl sm:p-7 lg:p-8">
        {/* TOP */}
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
            Analyze Files
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
            Upload spreadsheets instantly.
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/55 sm:text-base">
            Drag & drop CSV and Excel files to
            generate realtime analytics.
          </p>
        </div>

        {/* DROPZONE */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mt-8 rounded-[24px] border border-dashed p-6 text-center transition-all sm:p-8 ${
            dragActive
              ? 'border-cyan-400 bg-cyan-400/10'
              : 'border-cyan-400/20 bg-[#081120]/80'
          }`}
        >
          {/* ICON */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10">
            {file ? (
              <FileSpreadsheet className="h-8 w-8 text-cyan-300" />
            ) : (
              <UploadCloud className="h-8 w-8 text-cyan-300" />
            )}
          </div>

          {/* FILE NAME */}
          <h3 className="mt-5 text-xl font-semibold sm:text-2xl">
            {file
              ? file.name
              : 'Drag & Drop File'}
          </h3>

          <p className="mt-2 text-sm text-white/50">
            Supported: .csv .xlsx .xls
          </p>

          {/* ERROR */}
          {error && (
            <p className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}

          {/* INPUT */}
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleChange}
          />

          {/* BUTTONS */}
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() =>
                inputRef.current.click()
              }
              className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#020617] transition hover:scale-[1.03]"
            >
              Select File
            </button>

            {file && (
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                {loading
                  ? 'Processing...'
                  : 'Analyze File'}
              </button>
            )}
          </div>

          {/* PROGRESS */}
          {progress > 0 && (
            <div className="mt-6">
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  style={{
                    width: `${progress}%`,
                  }}
                  className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                />
              </div>

              <p className="mt-2 text-sm text-white/50">
                Progress: {progress}%
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Analyze;