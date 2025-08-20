# Google Sheets Setup Guide for Wheels Web

This guide will help you set up Google Sheets integration for both Leads and Disbursements in your Wheels Web application.

## Prerequisites

- Google account
- Access to Google Cloud Console
- Basic understanding of APIs

## Step 1: Google Cloud Console Setup

### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it: `Wheels Web Sheets API`
4. Click "Create"

### 1.2 Enable Google Sheets API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

### 1.3 Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in:
   - **Service account name**: `wheels-web-sheets`
   - **Service account ID**: `wheels-web-sheets@your-project-id.iam.gserviceaccount.com`
   - **Description**: `Service account for Wheels Web Google Sheets integration`
4. Click "Create and Continue"
5. Skip the optional steps (click "Done")

### 1.4 Download Credentials

1. Click on your service account email
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON" format
5. Click "Create" - this downloads your credentials file
6. **Keep this file secure** - it contains sensitive information

## Step 2: Create Google Sheets

### 2.1 Create Leads Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet named "Wheels Web - Leads"
3. In the first row (A1:AV1), add these headers:

```
A1: ID | B1: Loan ID | C1: Date Time | D1: Source | E1: Stage | F1: Profile Type | G1: Name | H1: Gender | I1: Customer Profile | J1: Marital Status | K1: PAN No | L1: Mobile No | M1: Alt Mobile No | N1: Email | O1: Mother Name | P1: Loan Amount | Q1: DSA | R1: RC No | S1: Vehicle Variant | T1: MFG Year | U1: OS No | V1: Kilometre Reading | W1: Vehicle Owner Contact No | X1: Vehicle Location | Y1: Ref First Name | Z1: Ref First Mob No | AA1: Ref Second Name | AB1: Ref Second Mob No | AC1: Nominee Name | AD1: Nominee DOB | AE1: Nominee Relationship | AF1: Permanent Address Type | AG1: Permanent Address Landmark | AH1: Permanent Address Category | AI1: Is Current Address Same | AJ1: Current Address Type | AK1: Current Address Landmark | AL1: Current Address Category | AM1: Is Office Address Same | AN1: Employment Detail | AO1: Office Address Type | AP1: Office Address Landmark | AQ1: Bank Finance | AR1: Branch | AS1: Login Executive Name | AT1: Case Dealer | AU1: Ref Name Mob No | AV1: Remarks
```

### 2.2 Create Disbursements Sheet

1. Create another spreadsheet named "Wheels Web - Disbursements"
2. In the first row (A1:AP1), add these headers:

```
A1: ID | B1: Loan ID | C1: Date Time | D1: Source | E1: Stage | F1: Profile Type | G1: Name | H1: Gender | I1: Customer Profile | J1: PAN No | K1: Mobile No | L1: Alt Mobile No | M1: Email | N1: DSA | O1: Bank Finance | P1: Bank Finance Branch | Q1: Login Executive Name | R1: RC No | S1: Vehicle Variant | T1: MFG Year | U1: OS No | V1: Kilometre Reading | W1: Vehicle Owner Contact No | X1: Total Loan Amount | Y1: PF Charges | Z1: Documentation Charges | AA1: Loan Insurance Charges | AB1: Other Charges | AC1: RTO Charges | AD1: Net Loan Amount | AE1: Tenure | AF1: IRR | AG1: EMI Amount | AH1: EMI Date | AI1: Transaction 1 | AJ1: Transaction 2 | AK1: Remarks For Hold | AL1: UTR | AM1: Case Dealer | AN1: Dealer Mob | AO1: RC Card Status | AP1: Remarks
```

## Step 3: Share Sheets with Service Account

1. In each Google Sheet, click "Share" (top right)
2. Add your service account email as an **Editor**
3. The email looks like: `wheels-web-sheets@your-project-id.iam.gserviceaccount.com`
4. Make sure to give **Editor** permissions (not just Viewer)

## Step 4: Get Sheet IDs

### 4.1 Get Leads Sheet ID

1. Open your Leads spreadsheet
2. Copy the ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_LEADS_SHEET_ID_HERE/edit
   ```

### 4.2 Get Disbursements Sheet ID

1. Open your Disbursements spreadsheet
2. Copy the ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_DISBURSEMENTS_SHEET_ID_HERE/edit
   ```

## Step 5: Set Up Environment Variables

Create a `.env.local` file in your project root with the following content:

```bash
# Google Sheets Configuration
GOOGLE_LEADS_SHEET_ID=your_leads_sheet_id_here
GOOGLE_DISBURSEMENTS_SHEET_ID=your_disbursements_sheet_id_here

# Google Service Account Credentials
# Copy these values from your downloaded JSON file
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your_service_account_email@your_project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your_service_account_email%40your_project.iam.gserviceaccount.com
```

### 5.1 How to Get Credential Values

1. Open your downloaded JSON credentials file
2. Copy each value to the corresponding environment variable:

```json
{
	"type": "service_account",
	"project_id": "your-project-id",
	"private_key_id": "your-private-key-id",
	"private_key": "-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n",
	"client_email": "wheels-web-sheets@your-project-id.iam.gserviceaccount.com",
	"client_id": "your-client-id",
	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
	"token_uri": "https://oauth2.googleapis.com/token",
	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
	"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/wheels-web-sheets%40your-project-id.iam.gserviceaccount.com"
}
```

## Step 6: Test the Integration

### 6.1 Start Your Development Server

```bash
npm run dev
```

### 6.2 Test Leads Integration

1. Go to your app and try to create a new lead
2. Check your Google Sheets - the lead should appear in the Leads sheet
3. Try viewing leads - they should load from Google Sheets

### 6.3 Test Disbursements Integration

1. Go to your app and try to create a new disbursement
2. Check your Google Sheets - the disbursement should appear in the Disbursements sheet
3. Try viewing disbursements - they should load from Google Sheets

## Step 7: Troubleshooting

### Common Issues:

1. **"Failed to fetch leads" error**

   - Check if your service account email has Editor access to the sheets
   - Verify your environment variables are correct
   - Make sure the sheet IDs are correct

2. **"Failed to save lead" error**

   - Check if the sheet headers match exactly
   - Verify the service account has write permissions
   - Check the browser console for detailed error messages

3. **Environment variables not loading**
   - Restart your development server after adding `.env.local`
   - Make sure the file is in the project root
   - Check for typos in variable names

### Debug Steps:

1. **Check API Routes**

   - Visit `http://localhost:3000/api/leads` in your browser
   - You should see a JSON response with leads data

2. **Check Environment Variables**

   - Add `console.log(process.env.GOOGLE_LEADS_SHEET_ID)` in your API route
   - Check the server console for the output

3. **Check Google Sheets Permissions**
   - Go to your Google Sheets
   - Click "Share" and verify the service account email is listed as Editor

## Step 8: Production Deployment

### 8.1 Environment Variables

When deploying to production, make sure to set all environment variables in your hosting platform:

- **Vercel**: Add them in the Vercel dashboard under Settings → Environment Variables
- **Netlify**: Add them in the Netlify dashboard under Site Settings → Environment Variables
- **Railway**: Add them in the Railway dashboard under Variables

### 8.2 Security Notes

- Never commit your `.env.local` file to version control
- Keep your service account JSON file secure
- Consider using environment-specific service accounts for development and production

## Step 9: Advanced Features

### 9.1 Add Update Functionality

To enable editing leads/disbursements in Google Sheets, you'll need to add PUT endpoints to your API routes.

### 9.2 Add Real-time Sync

Consider implementing webhooks or periodic sync to keep your app and Google Sheets in sync.

### 9.3 Add Data Validation

Add validation rules in Google Sheets to ensure data quality.

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Check the server console for API errors
3. Verify all environment variables are set correctly
4. Ensure Google Sheets permissions are correct

## File Structure

Your project should now have:

```
src/
├── app/
│   ├── api/
│   │   ├── leads/
│   │   │   └── route.ts
│   │   └── disbursements/
│   │       └── route.ts
│   └── ...
├── lib/
│   └── data.ts (updated)
└── ...
.env.local (new file)
```

This setup will give you a fully functional Google Sheets integration for both leads and disbursements with automatic backup to localStorage if the API fails.
