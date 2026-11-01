# Inventa: An AI-Driven Multimodal Product Catalog System and Inventory Optimization

<p align="center">
  <img src="client/src/assets/FINAL.png" alt="Invenza Logo" width="120"/>
</p>

<p align="center">
  **Invenza** is an AI-driven platform that helps businesses create structured product catalogs, manage inventory, analyse historical sales and make informed replenishment decisions.
</p>

---

## Project Information

| Field | Details |
|---|---|
| Academic Project Title | Inventa: An AI-driven multimodal product catalog system and inventory optimization |
| Application Name | Invenza |
| Domain | Artificial Intelligence, Full-Stack Development and Inventory Optimization |
| Department | Computer Science and Engineering |
| Academic Project Team | Kaavya K, Prithi Jessica J, Tharshini A, Akash J V |

## Table of Contents

- [About the Project](#about-the-project)
- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [Key Features](#key-features)
- [System Workflow](#system-workflow)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Dataset and Data Sources](#dataset-and-data-sources)
- [Machine Learning and Evaluation](#machine-learning-and-evaluation)
- [API and Testing](#api-and-testing)
- [Application Screenshots](#application-screenshots)
- [References](#references)
- [Acknowledgements](#acknowledgements)
- [Project Team](#project-team)
- [Software License](#software-license)
## About the Project

Invenza is a full-stack, AI-driven platform designed to simplify digital product catalog creation and connect product information with inventory intelligence.

Small retailers, artisans, farmers and other small businesses may face difficulties maintaining structured product information, monitoring stock, analysing historical sales and estimating future demand.

Invenza brings these activities together through multimodal product input, AI-assisted catalog generation, product management, inventory tracking, historical sales integration, demand forecasting and reorder recommendations.

The system combines a React frontend, Node.js backend, MongoDB database and Python-based AI service.

## Problem Statement

Small businesses often face challenges such as:

- Manually creating and maintaining product catalogs.
- Inconsistent product names, descriptions and attributes.
- Difficulty tracking inventory and identifying low-stock products.
- Limited use of historical sales data for demand estimation.
- Uncertainty about when and how much stock to replenish.
- Fragmented product and business information.

Invenza addresses these challenges through an integrated product catalog and inventory intelligence workflow.

## Objectives

1. Develop a multimodal system for AI-assisted product catalog generation.
2. Support product information input through text, voice and images.
3. Provide product management and inventory tracking.
4. Integrate historical retail sales data for demand analysis.
5. Apply machine-learning-based demand forecasting.
6. Generate inventory and reorder recommendations.
7. Present product, inventory and recommendation information through an interactive dashboard.

## Key Features

### 1. Multimodal Product Input

- Text-based product information entry.
- Browser-based voice input.
- Product image input.
- AI-assisted extraction and organization of product information.

### 2. AI-Assisted Product Catalog Generation

- Generates structured product information from supported inputs.
- Assists with product titles, descriptions and catalog attributes.
- Provides a review step before saving generated information.

### 3. Product and Inventory Management

- Product creation, viewing, updating and deletion.
- Stock-level tracking.
- Reorder-threshold configuration.
- Low-stock identification.

### 4. Historical Sales Integration

- Uses the UCI Online Retail dataset as a historical retail-sales source.
- Matches relevant transactions to Invenza product records.
- Stores matched historical orders.
- Aggregates sales into daily sales metrics.

### 5. Demand Forecasting

- Uses historical sales information to estimate future demand.
- Connects the Python AI service with the backend.
- Provides forecast outputs for inventory decisions.
- Supports forecast-based reorder recommendations.

### 6. Inventory and Pricing Insights

- Combines available product, stock and sales information.
- Provides AI-assisted inventory and pricing recommendations.
- Uses available demand and competitor information where supported.

### 7. Competitor Insights

- Displays available competitor benchmark information.
- Distinguishes demonstration data from verified live market information.

### 8. Dashboard and Analytics

- Consolidated product and inventory information.
- Demand and forecast views.
- Recommendation summaries.
- Analytics and alerts.

### 9. AI Assistant

- Conversational interface for supported product and business queries.
- Uses retrieval-augmented generation components for contextual responses.

## System Workflow

1. A seller provides product information through text, voice or an image.
2. The AI service processes the input and assists with catalog generation.
3. The user reviews the generated information.
4. Approved product information is stored in MongoDB.
5. Inventory records and stock levels are maintained.
6. Historical sales records are connected to matching products.
7. Daily sales metrics are used for demand forecasting.
8. Forecast outputs support inventory and reorder recommendations.
9. Dashboard modules present the available business insights.


## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| AI Service | Python, FastAPI |
| Data Processing | Pandas, NumPy, SciPy |
| Machine Learning | Scikit-learn, XGBoost, LightGBM |
| Forecasting | Prophet, Statsmodels |
| Generative AI | Google Gemini and configured LLM integrations |
| Retrieval | LangChain, ChromaDB and related integrations |

## Project Structure

The repository contains three main application components:

- **ai-service/** — Python-based AI, forecasting and evaluation service.
- **client/** — React and Vite frontend.
- **server/** — Node.js and Express backend, API routes and database integration.
- **data/** — Dataset files used by the project.
- **screenshots/** — Application screenshots.

Each application component has its own dependencies and setup requirements.
## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.10 or a compatible version supported by the AI service dependencies
- MongoDB (local or hosted)
- Git

### 1. Configure Environment Variables

Create local environment files from the supplied `.env.example` templates. Fill in the required values for your own environment. Never commit real credentials, API keys, database passwords or tokens.

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
```

### 4. Install AI Service Dependencies

```bash
cd ai-service
python -m venv .venv
```

Activate the virtual environment, then install the dependencies:

```bash
python -m pip install -r requirements.txt
```

### 5. Start the Application

Start MongoDB and then run each application component in a separate terminal.

Backend:

```bash
cd server
npm run dev
```

AI service:

```bash
cd ai-service
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Frontend:

```bash
cd client
npm run dev
```

The frontend development server displays the local URL when it starts. Confirm that the backend, AI service and database are configured and running before testing application features.

### Notes

- Some features require external API keys or services configured through environment variables.
- Do not publish private environment files or production credentials.
- Dependency versions and compatibility should be checked against the supplied package files and Python requirements.
## Dataset and Data Sources

The project uses product and historical retail transaction data to support catalog and inventory workflows.

### Product Catalog Dataset

- The project dataset contains 200 unique product records.
- Each record includes a stock code, description, category, base cost, current price, stock level, reorder threshold and source label.
- Base cost and stock-level values are derived testing fields; they should not be interpreted as original fields supplied by the source dataset.

### UCI Online Retail Dataset

The project also uses the UCI Online Retail transaction dataset. The original workbook is used by the sales-import pipeline to match transaction records against products in the project catalog.

The import process filters invalid transaction rows and creates matched order records and daily sales metrics. Therefore, the number of original workbook rows should not be confused with the number of orders successfully matched and imported into the application.

### Dataset Preparation and Limitations

- Product records and historical transactions serve different purposes in the application.
- Product matching depends on stock codes present in both datasets.
- Imported results depend on the matching, validation and deduplication rules in the import scripts.
- Forecasting and recommendation outputs depend on the available historical data and should be interpreted as decision-support estimates.

For dataset attribution, refer to the original UCI Machine Learning Repository record and its specified citation and licence.
## Machine Learning and Evaluation

The AI service contains forecasting, demand-analysis and pricing-related components intended to support inventory and business decision-making.

### Forecasting and Demand Analysis

Historical sales records are processed into daily sales metrics. These records provide the time-series input used by the forecasting workflows. Forecasts are intended to help users understand potential demand and plan stock replenishment.

### Price Elasticity Model

The project includes a price-elasticity modelling component. Its training pipeline supports model version registration and stores model metadata alongside trained model artifacts. Depending on the available dependencies, the training implementation can use XGBoost, LightGBM or a Gradient Boosting fallback.

### Evaluation

The `ai-service/evaluation/` directory contains evaluation scripts for forecasting, pricing, elasticity, chatbot behaviour, demand signals and A/B testing.

Evaluation results depend on the dataset, sample size, validation method and model configuration. Saved elasticity metadata records small training samples; the reported metrics should not be interpreted as evidence of high predictive accuracy.

### Reproducibility

For reproducible experiments, document the dataset version, preprocessing steps, training configuration, evaluation split, metrics and software dependencies used for each run.
## API and Testing

### Backend API

The Node.js and Express backend provides the application API and connects the frontend to the database and supporting services. API route implementations are organised in the `server/` directory.

The repository also contains a Swagger configuration file at `server/config/swaggerDoc.js`. Refer to the backend configuration and route setup for the actual documentation URL and available endpoints.

### Available Checks

Frontend production build:

```bash
cd client
npm run build
```

Frontend linting:

```bash
cd client
npm run lint
```

Backend tests:

```bash
cd server
npm test
```

AI service tests can be run with pytest from the `ai-service/` directory, subject to the installed Python dependencies and test configuration:

```bash
cd ai-service
python -m pytest
```

Test availability and coverage may vary. A command being defined in a package file does not by itself mean that every test passes.
## Application Screenshots

The following screenshots show selected pages and features of the Invenza application.

### Landing Page

![Landing page](<screenshots/landing-after-desktop.png>)

![Landing page on mobile](<screenshots/landing-after-mobile.png>)

### Dashboard

![Dashboard](<screenshots/dashboard.png>)

### Product Catalog

![Products page](<screenshots/Products Page.png>)

### Inventory and Forecasting

![Inventory forecasts](<screenshots/Inventory Forecasts.png>)

![AI recommendations](<screenshots/AI Recommendations.png>)

### Demand Signals and Competitor Insights

![Demand signals overview](<screenshots/Demand Signals1.png>)

![Demand signals details](<screenshots/Demand Signals2.png>)

![Competitor insights](<screenshots/Competitors1.png>)

![Competitor comparison](<screenshots/Competitors2.png>)

### Alerts and About

![Alerts](<screenshots/Alerts.png>)

![About page](<screenshots/about-after.png>)

### Additional Application View

![Initial application view](<screenshots/first-impression.png>)




## References

### Research Background

1. Taylor, S. J., & Letham, B. (2018). Forecasting at Scale. *The American Statistician, 72*(1), 37–45. https://doi.org/10.1080/00031305.2017.1380080
2. Lim, B., & Zohren, S. (2021). Time-series forecasting with deep learning: a survey. *Philosophical Transactions of the Royal Society A, 379*(2194), 20200209. https://doi.org/10.1098/rsta.2020.0209

### Dataset Source

3. Chen, D. (2015). Online Retail [Dataset]. UCI Machine Learning Repository. https://doi.org/10.24432/C5BW33.

The UCI Online Retail dataset is licensed under Creative Commons Attribution 4.0 International (CC BY 4.0). Please consult the original dataset page for its terms and attribution requirements.

## Acknowledgements

The project acknowledges the UCI Machine Learning Repository and the creator of the Online Retail dataset for making the historical retail transaction data available for research and educational use.

The project also uses open-source frameworks and libraries listed in the technology stack and dependency files. Their respective authors and maintainers retain their original rights and licences.

## Project Team

The academic project records list the following project authors:

- Kaavya K
- Prithi Jessica J
- Tharshini A
- Akash J V

## Software License

No separate open-source software licence is currently specified for this repository. The CC BY 4.0 licence mentioned above applies to the UCI Online Retail dataset, not automatically to the Invenza source code.
