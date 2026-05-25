# Sales Analytics Pipeline Backend

A simple backend-only sales analytics pipeline built with Django REST Framework, AWS S3, Pandas, Snowflake, and Power BI.

No authentication, no JWT, no login/register, no Docker, and no frontend code are included.

## 1. requirements.txt

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

## 3. .env

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
```

## 4. .env.example

`.env.example` is committed as a safe template. Copy it to `.env` when setting up a new machine.

## 5. .gitignore

The `.gitignore` keeps secrets, local databases, Python cache files, logs, virtual environments, and media files out of Git.

## 6. settings.py

`sales_analytics/settings.py` configures:

- Django REST Framework
- SQLite for simple local metadata storage
- S3 environment variables
- Snowflake environment variables
- no default authentication for API views

## 7. models.py

`uploads/models.py` contains `SalesUpload`, which stores:

- original file name
- file type
- S3 key and URL
- processing status
- processed row count
- error message
- upload and processed timestamps

## 8. serializers.py

`uploads/serializers.py` contains:

- `FileUploadSerializer` for validating CSV/XLSX uploads
- `SalesUploadSerializer` for returning upload metadata

## 9. AWS S3 Integration

`services/s3_service.py` uploads the original file to S3 using boto3.

Uploaded files are stored under:

```text
sales-uploads/<upload_id>/<generated-file-id>.<extension>
```

## 10. ETL Processing

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

If `cost` is missing, the ETL loads the report with `cost = 0`. This keeps revenue-only reports usable, but profit will equal sales unless the file includes cost or profit data.

Profit formula:

```text
profit = total_sales - cost
profit_margin = profit / total_sales * 100
```

## 11. Snowflake Integration

`services/snowflake_service.py`:

- connects to Snowflake
- creates the `sales` table if it does not exist
- inserts processed rows
- runs analytics queries

Before using the API, make sure the Snowflake warehouse, database, and schema already exist.

## 12. Analytics APIs

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
```

Example file upload with curl:

```bash
curl -X POST http://127.0.0.1:8000/api/upload/ -F "file=@sales.csv"
```

## 13. Power BI

Power BI connects directly to Snowflake:

1. Open Power BI Desktop.
2. Select **Get Data**.
3. Search for **Snowflake**.
4. Enter the Snowflake server/account and warehouse.
5. Choose the database and schema from `.env`.
6. Select the `sales` table.
7. Build visuals such as total sales, profit, monthly sales, region-wise sales, and top products.

Dashboard refresh works like this:

- This Django backend loads cleaned data into Snowflake.
- Power BI reads the latest data from Snowflake.
- In Power BI Service, configure the Snowflake credentials.
- Set a scheduled refresh so reports update automatically.
- When new sales files are uploaded and processed, the next Power BI refresh will include the new Snowflake rows.

## Folder Structure

```text
sales_analytics/
├── uploads/
├── analytics/
├── services/
├── utils/
├── .env
├── .env.example
├── .gitignore
├── requirements.txt
├── manage.py
└── README.md
```

Actual Django layout:

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
