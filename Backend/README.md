# Sales Analytics Pipeline Backend

A Django REST Framework backend for the SalesLens analytics pipeline. It accepts CSV/XLSX sales uploads, stores the raw file in AWS S3, cleans and transforms the data with Pandas, replaces the current Snowflake `sales` dataset, exposes analytics APIs, and can generate an AI executive summary with Gemini.

No authentication, no JWT, no login/register, and no Docker are included.

## 1. Requirements

Install the project dependencies:

```bash
pip install -r requirements.txt
```

Main packages:

- Django and Django REST Framework for REST APIs
- Pandas and openpyxl for CSV/XLSX ETL
- boto3 for AWS S3 uploads
- snowflake-connector-python for Snowflake loading and analytics queries
- python-decouple for reading `.env` variables
- Python standard library `urllib` for Gemini REST API calls

## 2. Project Setup

Create and activate a virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create database tables for upload metadata:

```bash
python manage.py makemigrations
python manage.py migrate
```

Run the development server:

```bash
python manage.py runserver
```

## 3. Environment Variables

The `.env` file stores local configuration and secrets. Replace the placeholder values before running uploads.

Required variables:

```env
SECRET_KEY=change-this-secret-key
DEBUG=True

AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_STORAGE_BUCKET_NAME=your-s3-bucket-name
AWS_S3_REGION_NAME=us-east-1

SNOWFLAKE_USER=your-snowflake-user
SNOWFLAKE_PASSWORD=your-snowflake-password
SNOWFLAKE_ACCOUNT=your-snowflake-account
SNOWFLAKE_WAREHOUSE=your-snowflake-warehouse
SNOWFLAKE_DATABASE=your-snowflake-database
SNOWFLAKE_SCHEMA=PUBLIC

GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash-lite
```

`GEMINI_MODEL` is optional. If it is not provided, the backend uses the default configured in `sales_analytics/settings.py`.

After changing `.env`, restart Django so the new values are loaded.

## 4. Django Settings

`sales_analytics/settings.py` configures:

- Django REST Framework
- CORS
- SQLite for local upload metadata
- AWS S3 environment variables
- Snowflake environment variables
- Gemini environment variables
- no default authentication for API views

## 5. Upload Metadata

`uploads/models.py` contains `SalesUpload`, which stores:

- original file name
- file type
- S3 key and URL
- processing status
- processed row count
- error message
- upload and processed timestamps

The local upload history is not cleared when new files are uploaded.

## 6. AWS S3 Integration

`services/s3_service.py` uploads the original file to S3 using boto3.

Uploaded files are stored under:

```text
sales-uploads/<upload_id>/<generated-file-id>.<extension>
```

S3 keeps the raw uploaded files. Replacing Snowflake data does not delete old S3 files.

## 7. ETL Processing

`services/etl_service.py` uses Pandas to:

- read CSV/XLSX files
- normalize column names
- map common column aliases
- derive missing values where possible
- validate required columns
- remove duplicates
- handle null values
- format dates
- calculate total sales, profit, and profit margin

Preferred input columns:

```text
order_date, region, product, quantity, unit_price, cost
```

Supported examples:

```text
branch -> region
product_line -> product
qty -> quantity
price -> unit_price
revenue or total -> total_sales
cogs or total_cost -> cost
gross_income or net_profit -> profit
```

If `region` is missing, the ETL sets it to `Unknown`. If `cost` is missing, the ETL loads the report with `cost = 0`.

Profit formula:

```text
profit = total_sales - cost
profit_margin = profit / total_sales * 100
```

## 8. Snowflake Integration

`services/snowflake_service.py`:

- connects to Snowflake
- creates the `sales` table if it does not exist
- replaces existing `sales` rows with the latest uploaded file data
- runs analytics queries

Important behavior:

- Each successful upload clears the existing Snowflake `sales` table data and inserts only the newly processed file rows.
- Upload metadata in SQLite is not cleared.
- Raw files already uploaded to S3 are not deleted.

Before using the API, make sure the Snowflake warehouse, database, and schema already exist.

To verify the latest upload:

```sql
SELECT COUNT(*) FROM SALES;

SELECT *
FROM SALES
ORDER BY LOADED_AT DESC
LIMIT 20;
```

## 9. APIs

Upload APIs:

```http
POST /api/upload/
GET /api/uploads/
```

Analytics APIs:

```http
GET /api/analytics/dashboard/
GET /api/analytics/sales/
GET /api/analytics/profit/
GET /api/analytics/regions/
GET /api/analytics/products/
GET /api/analytics/ai-summary/
POST /api/analytics/ai-summary/
```

Example file upload:

```bash
curl -X POST http://127.0.0.1:8000/api/upload/ -F "file=@sales.csv"
```

Example AI summary request:

```bash
curl http://127.0.0.1:8000/api/analytics/ai-summary/
```

The AI summary endpoint reads the current Snowflake `sales` table, sends a compact analytics payload to Gemini, and returns:

```json
{
  "summary": "Executive summary text..."
}
```

It summarizes:

- transaction count
- date range
- total sales
- total profit
- profit margin
- monthly trend
- top products
- regional performance when region data is available

Common Gemini errors:

- `404`: unsupported model name
- `429`: quota exhausted
- `503`: model temporarily unavailable or high demand

## 10. Power BI

Power BI connects directly to Snowflake:

1. Open Power BI Desktop.
2. Select **Get Data**.
3. Search for **Snowflake**.
4. Enter the Snowflake server/account and warehouse.
5. Choose the database and schema from `.env`.
6. Select the `sales` table.
7. Build visuals such as total sales, profit, monthly sales, region-wise sales, and top products.

Dashboard refresh works like this:

- This Django backend replaces the Snowflake `sales` table data with the latest uploaded file.
- Power BI reads the latest current dataset from Snowflake.
- In Power BI Service, configure the Snowflake credentials.
- Set a scheduled refresh so reports update automatically.
- When a new sales file is uploaded and processed, the next Power BI refresh will show the new file data only.

## 11. Current Workflow

```text
React frontend
-> Django REST API
-> AWS S3 raw file storage
-> Pandas ETL cleaning
-> Snowflake sales table replacement
-> Analytics APIs
-> React dashboard / Power BI
-> Gemini AI executive summary
```

Upload flow:

```text
User uploads CSV/XLSX
-> Django validates file
-> Django creates SalesUpload metadata
-> Django uploads original file to S3
-> Django cleans/transforms data with Pandas
-> Django creates Snowflake sales table if needed
-> Django deletes old Snowflake sales rows
-> Django inserts latest file rows
-> Django marks upload as processed
```

## 12. Folder Structure

```text
.
├── analytics/
├── sales_analytics/
├── services/
├── uploads/
├── utils/
├── .env
├── .env.example
├── .gitignore
├── manage.py
├── README.md
└── requirements.txt
```
