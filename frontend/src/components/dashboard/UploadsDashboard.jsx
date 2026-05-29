import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

const UploadsDashboard = () => {
  const [uploads, setUploads] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUploads =
      async () => {
        try {
          const response =
            await fetch(
              "http://127.0.0.1:8000/api/uploads/"
            );

          if (!response.ok) {
            throw new Error(
              "Failed to fetch uploads."
            );
          }

          const data =
            await response.json();

          setUploads(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

    fetchUploads();
  }, []);

  return (
    <section className="w-full">
      {loading && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white">
          Loading uploads...
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-300">
          {error}
        </div>
      )}

      {!loading &&
        !error && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="font-kpi text-lg font-semibold text-white">
                    #{upload.id}
                  </h3>

                  <span className="font-kpi rounded-full bg-cyan-400/20 px-3 py-1 text-xs text-cyan-300">
                    {upload.status}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* file name */}
                  <div>
                    <p className="font-kpi text-xs uppercase tracking-wider text-white/40">
                      File Name
                    </p>

                    <p className="mt-1 truncate text-sm text-white">
                      {upload.original_filename}
                    </p>
                  </div>

                  {/* type of file */}
                  <div>
                    <p className="font-kpi text-xs uppercase tracking-wider text-white/40">
                      File Type
                    </p>

                    <p className="mt-1 text-sm text-white">
                      {upload.file_type}
                    </p>
                  </div>

                  {/* rows processed */}
                  <div>
                    <p className="font-kpi text-xs uppercase tracking-wider text-white/40">
                      Rows Processed
                    </p>

                    <p className="mt-1 text-sm text-white">
                      {upload.rows_processed}
                    </p>
                  </div>

                  {/* uploaded time */}
                  <div>
                    <p className="font-kpi text-xs uppercase tracking-wider text-white/40">
                      Uploaded At
                    </p>

                    <p className="mt-1 text-sm text-white">
                      {new Date(
                        upload.uploaded_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  {/* procesed time  */}
                  <div>
                    <p className="font-kpi text-xs uppercase tracking-wider text-white/40">
                      Processed At
                    </p>

                    <p className="mt-1 text-sm text-white">
                      {upload.processed_at
                        ? new Date(
                            upload.processed_at
                          ).toLocaleString()
                        : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-10 flex justify-end">
          <button
            onClick={() => navigate("/")}
            className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm font-semibold text-cyan-300 backdrop-blur-xl transition hover:scale-105 hover:bg-cyan-400/20"
          >
             Go Back
          </button>
        </div>
    </section>
  );
};

export default UploadsDashboard;
