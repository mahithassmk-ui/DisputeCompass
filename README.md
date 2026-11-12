# DisputeCompass
DisputeCompass helps merchants understand PayPal disputes, identify relevant evidence, and prepare responses for review. It retrieves the details of the dispute selected by the merchant, explains the buyer’s complaint, reviews supporting documents and images, highlights missing evidence, and prepares an editable response draft. It also displays dispute statuses and deadlines to help merchants prioritize their work.
- **Overview dashboard** displays total, open, and resolved disputes. Disputes awaiting a seller response appear first, ordered by deadline where that information is available.
- **Evidence Studio** lets merchants select a dispute, add complaint details and order notes, and upload up to five supporting documents or images. It compares the complaint with those records, identifies supporting evidence and gaps, and generates an editable response draft.
- **AI Assistant** explains a dispute based on the reason, transaction details, and merchant’s account of events, then suggests evidence to gather.
- **Dispute Timeline** displays available dispute dates, statuses, and response deadlines, with a direct path to Evidence Studio.

  <img width="1904" height="934" alt="homepage" src="https://github.com/user-attachments/assets/c0230d57-8b87-4c75-9be4-6cf9939dee2c" />


# PreRequisites

| Software / Tool | Version / Requirement | Purpose | Download / Installation |
|---|---|---|---|
| Java JDK | Java 21 | Runs the Spring Boot backend | [Oracle Java Downloads](https://www.oracle.com/in/java/technologies/downloads/) |
| Node.js | LTS | Runs the Angular frontend | [Node.js Downloads](https://nodejs.org/en/download) |
| npm | Bundled with Node.js | Installs frontend dependencies | Included with Node.js |
| Angular CLI | Compatible with your project | Runs and builds Angular | `npm install -g @angular/cli` |
| Ollama | Latest Windows version | Runs the AI model locally | [Ollama](https://ollama.com/) |
| Visual Studio Code | Latest | Code editor | [VS Code Downloads](https://code.visualstudio.com/download) |
| Apache Maven | Latest stable version | Builds the backend and manages project dependencies | [Maven Downloads](https://maven.apache.org/download.cgi) |

# Commands to Run the Application

# Running the Dispute Navigator Application

Follow these steps to set up and run the Dispute Navigator application locally on Windows.

The application requires three services to run:
1. Spring Boot Backend
2. Angular Frontend
3. Ollama with Gemma 3 (4B)

---

## 1. Backend Setup and Execution

Open **PowerShell – Terminal 1**.

### Step 1: Configure PayPal Sandbox Credentials

Replace the placeholders with your PayPal Sandbox REST App credentials.

```powershell
$env:PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com"

$env:PAYPAL_CLIENT_ID = "YOUR_SANDBOX_CLIENT_ID"

$env:PAYPAL_CLIENT_SECRET = "YOUR_SANDBOX_CLIENT_SECRET"
```

### Step 2: Verify Credentials (Optional)

```powershell
if ($env:PAYPAL_CLIENT_ID -and $env:PAYPAL_CLIENT_SECRET) {
    Write-Host "PayPal credentials are configured."
} else {
    Write-Host "PayPal credentials are missing."
}
```

### Step 3: Navigate to the Backend Directory

```powershell
cd C:\Users\HP\dispute-navigator\backend\dispute-navigator-api
```

### Step 4: Verify Java and Maven

```powershell
java -version
mvn -version
```

Alternatively, verify the Maven Wrapper included in the project:

```powershell
.\mvnw.cmd -version
```

### Step 5: Build and Run the Backend

```powershell
.\mvnw.cmd clean spring-boot:run
```

The backend will be available at:

`http://localhost:8080`

### Step 6: Verify Backend Health (Optional)

Open another PowerShell terminal and execute:

```powershell
Invoke-RestMethod http://localhost:8080/api/health
```

---

## 2. Frontend Setup and Execution

Open **PowerShell – Terminal 2**.

### Step 1: Navigate to the Frontend Directory

```powershell
cd C:\Users\HP\dispute-navigator\frontend\dispute-navigator-ui
```

### Step 2: Install Dependencies

Run this command for the initial setup or whenever project dependencies change.

```powershell
npm install
```

### Step 3: Start the Angular Application

```powershell
npx ng serve
```

The frontend will be available at:

`http://localhost:4200`

---

## 3. Ollama Setup and Gemma 3 (4B)

Open **PowerShell – Terminal 3**.

### Step 1: Verify Ollama Installation

```powershell
ollama --version
```

### Step 2: Start the Ollama Server

If Ollama is not already running:

```powershell
ollama serve
```

Keep this terminal running.

### Step 3: Run the Gemma 3 (4B) Model

Open another PowerShell terminal and execute:

```powershell
ollama run gemma3:4b
```

Ollama will download the model if it is not already installed.

### Step 4: Verify Installed Models

```powershell
ollama list
```

### Step 5: Configure the AI Model in Spring Boot

Ensure the following configuration is present in:

`backend/dispute-navigator-api/src/main/resources/application.yml`

```yaml
ollama:
  base-url: http://localhost:11434
  model: gemma3:4b
```

---

## 4. Application URLs

| Component | URL |
|---|---|
| Angular Frontend | http://localhost:4200 |
| Spring Boot Backend | http://localhost:8080 |
| Backend Health Check | http://localhost:8080/api/health |
| Ollama API | http://localhost:11434 |

---

## 5. Quick Startup Reference

| Terminal | Component | Command |
|---|---|---|
| Terminal 1 | Backend | `.\mvnw.cmd clean spring-boot:run` |
| Terminal 2 | Frontend | `npx ng serve` |
| Terminal 3 | Ollama Server | `ollama serve` |
| Terminal 4 (optional) | Gemma 3 Model | `ollama run gemma3:4b` |

---

## Important Notes

- Keep the backend, frontend, and Ollama server running while using the application.
- Make sure to run these commands in Powershell.
- PayPal environment variables must be configured again whenever a new backend terminal session is opened.
- The Maven Wrapper (`mvnw.cmd`) is included in the project, so a separate Maven installation is not required to run the backend.
- The `ollama run` command opens an interactive model session. The Spring Boot backend communicates with the Ollama server independently.
