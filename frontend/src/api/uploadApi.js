{/*no use here*/}
export const uploadFileToBackend = async (
  parsedData,
  fileName
) => {
  try {
    const response = await fetch(
      'http://localhost:8000/upoloads',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          fileName,
          data: parsedData,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error(error);

    throw error;
  }
};