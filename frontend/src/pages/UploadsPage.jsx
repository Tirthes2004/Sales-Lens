import UploadsDashboard from "../components/dashboard/UploadsDashboard";

const UploadsPage = () => {
  return (
    <main className="min-h-screen bg-[#020617] px-4 py-32 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="font-handwritten font-caveat text-6xl text-white">
            Upload Analytics
          </h1>

          <p className="mt-4 max-w-2xl text-white/60">
            View processed uploads, analytics pipeline history,
            processing status, and uploaded sales reports.
          </p>
        </div>

        <UploadsDashboard />
      </div>
    </main>
  );
};

export default UploadsPage;
